import Cookie from "js-cookie"
import Router from "next/router"
import { expectSaga } from "redux-saga-test-plan"
import * as matchers from "redux-saga-test-plan/matchers"
import { throwError } from "redux-saga-test-plan/providers"
import { call } from "redux-saga/effects"

import apiClient from "api/client"
import { loginAction, logoutAction, refreshTokenAction, setAuthAction } from "redux/actions/auth"
import { loadingSuccessAction, setLoadingAction } from "redux/helper/actions"
import { scopedRequestReducer } from "redux/helper/reducers"
import { initialRequestState } from "redux/helper/state"
import authReducer from "redux/reducer/auth"
import { loginSaga, logoutSaga, saveToken } from "redux/saga/auth"
import { getCurrentUser } from "redux/saga/currentUser"
import { AuthToken } from "services/authToken"
import { removeStorageItem, setStorageItem } from "services/localStorage"
import { AUTH_COOKIE_NAME, AUTH_LOCALSTORAGE_NAME } from "../../../config"

describe("Auth:loginSaga", () => {
  const credentials = { username: "test@example.net", password: "secret" }
  const successHandler = () => ({})
  const errorHandler = () => ({})
  const submittingHandler = () => ({})
  const action = loginAction(credentials,
    { success: successHandler, setErrors: errorHandler, setSubmitting: submittingHandler })
  const token = "test123"

  it("requests token, stores the token in state & cookie, triggers refresh", () => {
    expectSaga.DEFAULT_TIMEOUT = 15000

    return expectSaga(loginSaga, action)
      .withState(null)
      .withReducer(authReducer)
      .provide([
        [call(apiClient.requestAuthToken, credentials), token],

        // mock those calls, they would error server-side
        [matchers.call.fn(Cookie.set), true],
        [matchers.call.fn(setStorageItem), true],
        [matchers.call.fn(getCurrentUser), null],
      ])
      .put(setLoadingAction("login", true))
      .call(apiClient.requestAuthToken, credentials)
      .call(saveToken, token)
      .put(loadingSuccessAction("login", token))
      .call(getCurrentUser)
      .call(successHandler, null)
      .put(refreshTokenAction())
      .hasFinalState({
        encoded: token,
        expiresAt: 0,
        id: null,
        roles: [],
        username: "",
      })
      .run()
  })

  it("handles failed auth and sets error message", () => {
    const message = "Bad Credentials."

    return expectSaga(loginSaga, action)
      .withState(initialRequestState)
      .withReducer(scopedRequestReducer("login"))
      .provide([
        [matchers.call.fn(apiClient.requestAuthToken), throwError(new Error(message))],
      ])
      .call(errorHandler, { _error: message })
      .put(setLoadingAction("login", false))
      .call(submittingHandler, false)
      .hasFinalState({
        ...initialRequestState,
        loadingError: null,
      })
      .run()
  })

  /* @todo throwError gives a Error instance to the saga instead of the RequestError?
  it("handles failed requests and sets error message", () => {
    const message = "Empty Response"

    return expectSaga(loginSaga, action)
      .withState(initialAuthState)
      .withReducer(authReducer)
      .provide([
        [matchers.call.fn(requestAuthToken), throwError(new RequestError(message))],
      ])
      .put(loginFailedAction(message))
      .hasFinalState({
        ...initialAuthState,
        error: "message.requestFailed",
      })
      .run()
  })
  */
})

describe("Auth:saveTokenSaga", () => {
  it("saves token in cookie and localstorage", () => {
    const token = "test123"
    const jwt = new AuthToken(token)

    return expectSaga(saveToken, token)
      .provide([
        // mock those calls, they would error server-side
        [matchers.call.fn(Cookie.set), true],
        [matchers.call.fn(setStorageItem), true],
      ])
      .call(Cookie.set, AUTH_COOKIE_NAME, token, { sameSite: "lax", secure: false })
      .call(setStorageItem, AUTH_LOCALSTORAGE_NAME, token)
      .put(setAuthAction(jwt.jwt))
      .run()
  })
})

describe("Auth:logoutSaga", () => {
  it("removes cookie, syncs localstorage and redirects to the homepage", () => {
    const action = logoutAction()
    return expectSaga(logoutSaga, action)
      .provide([
        // mock those calls, they would error server-side
        [matchers.call.fn(Cookie.remove), true],
        [matchers.call.fn(removeStorageItem), true],
        [matchers.call.fn(Router.push), true],
      ])
      .call(Cookie.remove, AUTH_COOKIE_NAME)
      .call(removeStorageItem, AUTH_LOCALSTORAGE_NAME)
      .call(Router.push, "/")
      .run()
  })
})
