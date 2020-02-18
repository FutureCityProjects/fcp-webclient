import Cookie from "js-cookie"
import Router from "next/router"
import { all, call, delay, put, select, takeEvery, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import {
  AuthActionTypes,
  ILoginAction,
  ILogoutAction,
  logoutAction,
  refreshTokenAction,
  setAuthAction,
} from "redux/actions/auth"
import { clearStoreAction } from "redux/actions/general"
import { addNotificationAction } from "redux/actions/notifications"
import { loadingSuccessAction, setLoadingAction } from "redux/helper/actions"
import { selectAuthExpiresIn, selectAuthToken, selectIsAuthenticated } from "redux/reducer/auth"
import { AuthToken } from "services/authToken"
import { getStorageItem, removeStorageItem, setStorageItem } from "services/localStorage"
import { Routes } from "services/routes"
import { SubmissionError } from "services/submissionError"
import { AUTH_COOKIE_NAME, AUTH_LOCALSTORAGE_NAME, AUTH_REFRESH_THRESHOLD } from "../../../config"
import { getCurrentUser } from "./currentUser"

export function* authWatcherSaga() {
  yield all([
    takeLatest(AuthActionTypes.LOCAL_STORAGE_CHANGED, localStorageChangedSaga),
    takeLatest(AuthActionTypes.LOGIN, loginSaga),
    takeEvery(AuthActionTypes.LOGOUT, logoutSaga),

    // we use takeLatest to allow restart of the countdown when the token was refreshed by another tab
    takeLatest(AuthActionTypes.REFRESH_TOKEN, refreshTokenSaga),

    takeEvery(AuthActionTypes.USER_IS_IDLE, userIsIdleSaga),
  ])
}

/**
 * exported for the tests
 */
export function* loginSaga(action: ILoginAction) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("login", true))
    const encoded = yield call(apiClient.requestAuthToken, action.credentials)
    yield call(saveToken, encoded)
    yield put(loadingSuccessAction("login", encoded))

    // enforce loading the current user, we need him to decide where to redirect after the login
    const user = yield call(getCurrentUser)

    yield call(success, user)

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
export function* logoutSaga(action: ILogoutAction) {
  yield call(Cookie.remove, AUTH_COOKIE_NAME)

  yield call(removeStorageItem, AUTH_LOCALSTORAGE_NAME)

  // @todo get redirect url from store|config|env
  yield call(Router.push, action.message ? Routes.LOGIN : Routes.HOME)

  // remove all data from the store. To keep the state consistent we also need  to clear all
  // dependent states, like IDs of all projects shown in the marketplace.
  yield put(clearStoreAction())

  // only after the store was cleared add new state
  yield put(addNotificationAction(action.message || "message.auth.logout", "info", action.options))
}

export function* refreshTokenSaga() {
  const expiresIn = yield select(selectAuthExpiresIn)

  // should not happen, because refreshTokenAction() is triggered right after the new token was received,
  // an expired token cannot be refreshed
  if (expiresIn <= 0) {
    return
  }

  if (expiresIn <= AUTH_REFRESH_THRESHOLD) {
    // @todo log warning
    // tslint:disable-next-line: no-console
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
export function* doRefresh() {
  try {
    const newToken = yield call(apiClient.refreshAuthToken)
    yield call(saveToken, newToken)
    yield put(refreshTokenAction())

    // attention: no code after put(), we use takeLatest which cancels the execution when
    // the same refresh saga is started again
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log("WARNING: Token refresh failed, maybe user locked meanwhile, logging out...")
    // @todo log the error, different handling for network error and 401?
    // tslint:disable-next-line: no-console
    console.log(err)

    yield put(logoutAction("message.auth.refreshFailed"))
  }
}

/**
 * Save the auth token
 *
 * @param encodedToken JWT as received from the server
 */
export function* saveToken(encodedToken: string) {
  // save the encoded token in the cookie, this way it is transported to the server if the user
  // hits reload
  yield call(Cookie.set, AUTH_COOKIE_NAME, encodedToken, {
    sameSite: "lax",
    // @todo: should the env be exposed? Because of:
    // The key "NODE_ENV" under "env" in next.config.js is not allowed.
    secure: process.env.CLIENT_ENV === "production",
  })

  // save the token in the localStorage to signal the auth state to other browser tabs
  yield call(setStorageItem, AUTH_LOCALSTORAGE_NAME, encodedToken)

  // save the encoded token (for the Authorization header) together with the decoded expiration time,
  // username & roles
  const auth = new AuthToken(encodedToken)
  yield put(setAuthAction(auth.jwt))
}

/**
 * Logout user after inactivity timeout, see /pages/_app.js
 */
export function* userIsIdleSaga() {
  const isAuthenticated = yield select(selectIsAuthenticated)
  if (isAuthenticated) {
    yield put(logoutAction("message.auth.idleLogout", { autoClose: false }))
  }
}

/**
 * Sync the auth state between multiple open tabs using the localStorage
 */
export function* localStorageChangedSaga() {
  const localAuth = yield call(getStorageItem, AUTH_LOCALSTORAGE_NAME)
  const storeAuth = yield select(selectAuthToken)

  // nothing changed, we probably caused the change ourselves via login/logout in the current tab
  // @todo event is never triggered in the same tab that changed the storage?
  if (storeAuth === localAuth) {
    return
  }

  if (localAuth) {
    // do not use call(saveToken, localAuth) as this updates the localStorage again and
    // setting the cookie is not neccessary as already done in the other tab
    const auth = new AuthToken(localAuth)
    yield put(setAuthAction(auth.jwt))

    // restart the refresh mechanism if we received a (new) token
    yield put(refreshTokenAction())
  } else if (storeAuth) {
    yield put(logoutAction("Logout in anderem Browser-Tab"))
  }
}
