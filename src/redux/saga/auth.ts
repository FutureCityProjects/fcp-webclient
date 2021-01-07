import Cookie from "js-cookie"
import Router from "next/router"
import { all, call, delay, put, select, takeEvery, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import {
  AuthActionTypes,
  ILoginAction,
  ILogoutAction,
  loginSuccessfulAction,
  logoutAction,
  refreshTokenAction,
  setAuthAction,
} from "redux/actions/auth"
import { clearStoreAction } from "redux/actions/general"
import { addNotificationAction } from "redux/actions/notifications"
import { loadingSuccessAction, setLoadingAction } from "redux/helper/actions"
import { selectAuthExpiresIn, selectIsAuthenticated } from "redux/reducer/auth"
import { AuthToken } from "services/authToken"
import { Routes } from "services/routes"
import { SubmissionError } from "services/submissionError"
import { AUTH_COOKIE_NAME, AUTH_REFRESH_THRESHOLD } from "../../../config"
import { getCurrentUser } from "./currentUser"

export function* authWatcherSaga(): any {
  yield all([
    takeLatest(AuthActionTypes.Login, loginSaga),
    takeEvery(AuthActionTypes.Logout, logoutSaga),

    // we use takeLatest to allow restart of the countdown when the token was refreshed by another tab
    takeLatest(AuthActionTypes.RefreshToken, refreshTokenSaga),

    takeEvery(AuthActionTypes.UserIsIdle, userIsIdleSaga),
  ])
}

/**
 * exported for the tests
 */
export function* loginSaga(action: ILoginAction): Generator<any, any, any> {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("login", true))
    const encoded = yield call(apiClient.requestAuthToken, action.credentials)
    yield call(saveToken, encoded)
    yield put(loadingSuccessAction("login", encoded))

    // enforce loading the current user, we need him to decide where to redirect after the login
    const user = yield call(getCurrentUser)

    yield call(success, user)
    yield put(loginSuccessfulAction(user))

    // trigger the refresh mechanism
    yield put(refreshTokenAction())
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("login", false))
    yield call(setSubmitting, false)
  }
}

/**
 * exported for the tests
 */
export function* logoutSaga(action: ILogoutAction): Generator<any, any, any> {
  yield call(Cookie.remove, AUTH_COOKIE_NAME)

  // @todo get redirect url from store|config|env
  yield call(Router.push, action.message ? Routes.Login : Routes.Home)

  // remove all data from the store. To keep the state consistent we also need  to clear all
  // dependent states, like IDs of all projects shown in the marketplace.
  yield put(clearStoreAction())

  // only after the store was cleared add new state
  yield put(addNotificationAction(action.message || "message.auth.logout", "info", action.options))
}

export function* refreshTokenSaga(): Generator<any, any, any> {
  const expiresIn: number = yield select(selectAuthExpiresIn)

  // should not happen, because refreshTokenAction() is triggered right after the new token was received,
  // an expired token cannot be refreshed
  if (expiresIn <= 0) {
    return
  }

  if (expiresIn <= AUTH_REFRESH_THRESHOLD) {
    // @todo log warning
    // eslint-disable-next-line no-console
    console.log(`WARNING: Token lifetime (${expiresIn} seconds) below refreshThreshold`
      + ` (${AUTH_REFRESH_THRESHOLD} seconds), refreshing now, please check config!`)

    yield call(doRefresh)
    return
  }

  // to reduce concurrency between two open browser tabs we wake 0-10% of the refresh threshold
  // earlier, this way in most cases only one will trigger a refresh network request and
  // update the other via localStorage
  // @todo remove, the token should not be shared via localstorage
  const wakeEarlier = Math.random() * 0.1 * AUTH_REFRESH_THRESHOLD

  // sleep until short before expiration
  yield delay((expiresIn - AUTH_REFRESH_THRESHOLD - wakeEarlier) * 1000)

  // logged out meanwhile?
  const stillAuthenticated = yield select(selectIsAuthenticated)

  if (stillAuthenticated) {
    yield call(doRefresh)
  }

  // attention: no code after call(doRefresh), we use takeLatest which cancels the execution when
  // the same saga is started again
}

/**
 * Try to refresh the auth token, if successful replace the token in the store
 * and trigger the refresh mechanism again
 */
export function* doRefresh(): Generator<any, any, any> {
  try {
    const newToken = yield call(apiClient.refreshAuthToken)
    yield call(saveToken, newToken)
    yield put(refreshTokenAction())

    // attention: no code after put(), we use takeLatest which cancels the execution when
    // the same refresh saga is started again
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("WARNING: Token refresh failed, maybe user locked meanwhile, logging out...")
    // @todo log the error, different handling for network error and 401?
    // eslint-disable-next-line no-console
    console.log(err)

    yield put(logoutAction("message.auth.refreshFailed"))
  }
}

/**
 * Save the auth token
 *
 * @param encodedToken JWT as received from the server
 */
export function* saveToken(encodedToken: string): Generator<any, any, any> {
  // save the encoded token in the cookie, this way it is transported to the server if the user
  // hits reload
  yield call(Cookie.set, AUTH_COOKIE_NAME, encodedToken, {
    sameSite: "lax",
    // @todo: should the env be exposed? Because of:
    // The key "NODE_ENV" under "env" in next.config.js is not allowed.
    secure: process.env.BASE_URL.indexOf("//localhost") === -1 && process.env.CLIENT_ENV === "production",
  })

  // save the encoded token (for the Authorization header) together with the decoded expiration time,
  // username & roles
  const auth = new AuthToken(encodedToken)
  yield put(setAuthAction(auth.jwt))
}

/**
 * Logout user after inactivity timeout, see /pages/_app.js
 */
export function* userIsIdleSaga(): Generator<any, any, any> {
  const isAuthenticated = yield select(selectIsAuthenticated)
  if (isAuthenticated) {
    yield put(logoutAction("message.auth.idleLogout", { autoClose: false }))
  }
}
