import { IUser } from "api/schema"
import { UserActions, UserActionTypes } from "redux/actions/users"
import { ICollectionState, initialCollectionState } from "redux/helper/state"

export type UsersState = ICollectionState<IUser>

export default function(state: UsersState = initialCollectionState, action: UserActions): UsersState {
  switch (action.type) {
    case UserActionTypes.LOAD_USERS:
      return { ...state, collection: null, isLoading: true, loadingError: null }

    case UserActionTypes.LOAD_USERS_SUCCESS:
      return { ...state, collection: action.users, isLoading: false }

    case UserActionTypes.LOAD_USERS_FAILED:
      return { ...state, collection: null, isLoading: false, loadingError: action.error }

    default:
      return state
  }
}

/**
 * Selector to retrieve the list of loaded users.
 *
 * @returns array of User, may be empty
 */
export const selectUsers = (state: { users: UsersState }): IUser[] =>
  state.users.collection ? state.users.collection["hydra:member"] : []
