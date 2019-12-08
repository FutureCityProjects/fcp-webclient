import Cookie from "js-cookie"
import Router from "next/router"
import { expectSaga } from "redux-saga-test-plan"
import * as matchers from "redux-saga-test-plan/matchers"
import { throwError } from "redux-saga-test-plan/providers"
import { call } from "redux-saga/effects"

import apiClient from "api/client"
import { loginAction, loginFailedAction, loginSuccessfulAction, refreshTokenAction, setAuthAction } from "redux/actions/auth"
import authReducer from "redux/reducer/auth"
import { initialAuthState } from "redux/reducer/auth"
import { loginSaga, loginSuccessfulSaga, logoutSaga, saveToken } from "redux/saga/auth"
import { AuthToken } from "services/authToken"
import { removeStorageItem, setStorageItem } from "services/localStorage"
import { AUTH_COOKIE_NAME, AUTH_LOCALSTORAGE_NAME } from "../../../config"

describe("Auth:loginSaga", () => {
  const credentials = { username: "test@example.net", password: "secret" }
  const action = loginAction(credentials)
  const token = "test123"

  it("requests token, stores the token in state & cookie, triggeres refresh", () => {
    return expectSaga(loginSaga, action)
      .withState(initialAuthState)
      .withReducer(authReducer)
      .provide([
        [call(apiClient.requestAuthToken, credentials), token],

        // mock those calls, they would error server-side
        [matchers.call.fn(Cookie.set), true],
        [matchers.call.fn(setStorageItem), true],
      ])
      .call(apiClient.requestAuthToken, credentials)
      .call(saveToken, token)
      .put(loginSuccessfulAction())
      .put(refreshTokenAction())
      .hasFinalState({
        ...initialAuthState,
        token: {
          encoded: token,
          expiresAt: 0,
          roles: [],
          username: "",
        },
      })
      .run()
  })

  it("handles failed auth and sets error message", () => {
    const message = "Bad Credentials."

    return expectSaga(loginSaga, action)
      .withState(initialAuthState)
      .withReducer(authReducer)
      .provide([
        [matchers.call.fn(apiClient.requestAuthToken), throwError(new Error(message))],
      ])
      .put(loginFailedAction(message))
      .hasFinalState({
        ...initialAuthState,
        error: message,
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

describe("Auth:loginSuccessfulSaga", () => {
  it("redirects to the dashboard", () => {
    const action = loginSuccessfulAction()

    return expectSaga(loginSuccessfulSaga, action)
      .provide([
        // mock this call, it would error server-side
        [matchers.call.fn(Router.push), true],
      ])
      .call(Router.push, "/dashboard")
      .run()
  })

  it("redirects to the requested URL if given", () => {
    const action = loginSuccessfulAction("/users")

    return expectSaga(loginSuccessfulSaga, action)
      .provide([
        // mock this call, it would error server-side
        [matchers.call.fn(Router.push), true],
      ])
      .call(Router.push, "/users")
      .run()
  })
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
    return expectSaga(logoutSaga)
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
