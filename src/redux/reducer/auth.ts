import { ROLES } from "api/schema"
import { AuthActions, AuthActionTypes } from "redux/actions/auth"
import { IWebToken } from "redux/helper/state"

export interface IAuthState {
  token?: IWebToken,
  loginPending: boolean
  redirectUrl?: string
  error?: string
}

export const initialAuthState: IAuthState = {
  error: null,
  loginPending: false,
  redirectUrl: null,
  token: null,
}

export default function(state: IAuthState = initialAuthState, action: AuthActions) {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, loginPending: true, error: null }

    case AuthActionTypes.LOGIN_SUCCESSFUL:
      return { ...state, loginPending: false, error: null }

    case AuthActionTypes.LOGIN_FAILED:
      return { ...state, token: null, loginPending: false, error: action.error }

    case AuthActionTypes.LOGOUT:
      return { ...state, token: null, loginPending: false, error: null }

    case AuthActionTypes.SET_AUTH:
      return { ...state, token: action.token }

    default:
      return state
  }
}

/**
 * Selector to retrieve the token for use in the Authentication Header.
 *
 * @returns the encoded JWT or null if none is in the store
 */
export const selectAuthToken = (state: { auth: IAuthState }): string =>
  state.auth.token ? state.auth.token.encoded : null

/**
 * Selector to retrieve the current username.
 *
 * @returns the username from the JWT or null if not authenticated
 */
export const selectUsername = (state: { auth: IAuthState }): string =>
  state.auth.token ? state.auth.token.username : null

/**
 * Selector to retrieve the current user roles.
 *
 * @returns array of role names, may be empty
 */
export const selectRoles = (state: { auth: IAuthState }): string[] =>
  state.auth.token ? state.auth.token.roles : []

/**
 * Selector to check if the user has a given role
 *
 * @returns true if the JWT claims the given role, else false
 */
export const selectHasRole = (state: { auth: IAuthState }, role: ROLES): boolean =>
  selectRoles(state).includes(role)

/**
 * Selector to get the remaining seconds on the token TTL
 *
 * @returns number of seconds remaining or null if none / no token
 */
export const selectAuthExpiresIn = (state: { auth: IAuthState }): number =>
  selectIsAuthenticated(state)
    ? (state.auth.token.expiresAt * 1000 - new Date().getTime()) / 1000
    : 0

/**
 * Selector to check if a user is authenticated but the token expired.
 *
 * @returns true only if there is a token which is expired, else false
 */
export const selectAuthExpired = (state: { auth: IAuthState }): boolean =>
  state.auth.token && new Date() > new Date(state.auth.token.expiresAt * 1000)

/**
 * Selector to check if a user is authenticated.
 *
 * @returns true if there is a non-expired auth token in the store, else false
 */
export const selectIsAuthenticated = (state: { auth: IAuthState }): boolean =>
  state.auth.token && !selectAuthExpired(state)
