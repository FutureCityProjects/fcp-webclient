import { IUser, UserRole } from "api/schema"
import { AuthActions, AuthActionTypes } from "redux/actions/auth"
import { IWebToken } from "redux/helper/state"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "./data"

const tokenReducer = (state: IWebToken = null, action: AuthActions) => {
  switch (action.type) {
    case AuthActionTypes.SET_AUTH:
      return action.token

    case AuthActionTypes.LOGOUT:
      return null

    default:
      return state
  }
}

export default tokenReducer

/**
 * Selector to retrieve the token for use in the Authentication Header.
 *
 * @returns the encoded JWT or null if none is in the store
 */
export const selectAuthToken = (state: AppState): string =>
  state.auth ? state.auth.encoded : null

/**
 * Selector to retrieve the current username.
 *
 * @returns the username from the JWT or null if not authenticated
 */
export const selectUsername = (state: AppState): string =>
  state.auth ? state.auth.username : null

/**
 * Selector to retrieve the current users ID.
 *
 * @returns the user ID from the JWT or null if not authenticated
 */
export const selectCurrentUserId = (state: AppState): number =>
  state.auth ? state.auth.id : null

/**
 * Selector to retrieve the current user roles.
 *
 * @returns array of role names, may be empty
 */
export const selectRoles = (state: AppState): string[] =>
  state.auth ? state.auth.roles : []

/**
 * Selector to check if the user has a given role
 *
 * @returns true if the JWT claims the given role, else false
 */
export const selectHasRole = (state: AppState, role: UserRole): boolean =>
  selectRoles(state).includes(role)

/**
 * Selector to get the remaining seconds on the token TTL
 *
 * @returns number of seconds remaining or null if none / no token
 */
export const selectAuthExpiresIn = (state: AppState): number =>
  selectIsAuthenticated(state)
    ? (state.auth.expiresAt * 1000 - new Date().getTime()) / 1000
    : 0

/**
 * Selector to check if a user is authenticated but the token expired.
 *
 * @returns true only if there is a token which is expired, else false
 */
export const selectAuthExpired = (state: AppState): boolean =>
  state.auth && new Date() > new Date(state.auth.expiresAt * 1000)

/**
 * Selector to check if a user is authenticated.
 *
 * @returns true if there is a non-expired auth token in the store, else false
 */
export const selectIsAuthenticated = (state: AppState): boolean =>
  state.auth && !selectAuthExpired(state)

/**
 * Selector to retrieve the currently logged in user.
 *
 * @returns IUser, may be empty
 */
export const selectCurrentUser = (state: AppState): IUser => {
  const id = selectCurrentUserId(state)
  return id ? selectById(state, EntityType.USER, id) : null
}
