import { IUser } from "api/schema"
import { ProfileActions, ProfileActionTypes } from "redux/actions/profile"
import { IModelState, initialModelState } from "redux/helper/state"

export type ProfileState = IModelState<IUser>

export default function(state: ProfileState = initialModelState, action: ProfileActions): ProfileState {
  switch (action.type) {
    case ProfileActionTypes.LOAD_CURRENT_USER:
      return { ...state, model: null, isLoading: true, loadingError: null }

    case ProfileActionTypes.LOAD_CURRENT_USER_SUCCESS:
      return { ...state, model: action.user, isLoading: false }

    case ProfileActionTypes.LOAD_CURRENT_USER_FAILED:
      return { ...state, model: null, isLoading: false, loadingError: action.error }

    default:
      return state
  }
}

/**
 * Selector to retrieve the currently logged in user.
 *
 * @returns IUser, may be empty
 */
export const selectCurrentUser = (state: { profile: ProfileState }): IUser =>
  state.profile.model ? state.profile.model : null
