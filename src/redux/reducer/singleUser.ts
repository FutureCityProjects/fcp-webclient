import { IUser } from "api/schema"
import { UserActions, UserActionTypes } from "redux/actions/users"
import { IModelState, initialModelState } from "redux/helper/state"

export type UserState = IModelState<IUser>

export default function(state: UserState = initialModelState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.LOAD_USER_BY_ID:
      return { ...state, model: null, isLoading: true, loadingError: null }

    case UserActionTypes.LOAD_USER_BY_USERNAME:
      return { ...state, model: null, isLoading: true, loadingError: null }

    case UserActionTypes.LOAD_USER_SUCCESS:
      return { ...state, model: action.user, isLoading: false }

    case UserActionTypes.LOAD_USER_FAILED:
      return { ...state, model: null, isLoading: false, loadingError: action.error }

    default:
      return state
  }
}

/**
 * Selector to retrieve the a single user by ID
 *
 * @returns IUser, may be empty
 */
export const selectUserById = (id: number, state: { singleUser: UserState }): IUser =>
  state.singleUser.model && state.singleUser.model.id === id
    ? state.singleUser.model
    : null

/**
 * Selector to retrieve the a single user by username
 *
 * @returns IUser, may be empty
 */
export const selectUserByUsername = (username: string, state: { singleUser: UserState }): IUser =>
  state.singleUser.model && state.singleUser.model.username === username
    ? state.singleUser.model
    : null
