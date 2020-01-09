import { combineReducers } from "redux"

import { IUser } from "api/schema"
import { RegistrationActions, RegistrationActionTypes } from "redux/actions/registration"
import { scopedSetLoadingReducer } from "redux/helper/reducers"
import { AppState } from "redux/store"
import { selectUserById } from "./users"

const registrationReducer =
  (state: number = null, action: RegistrationActions): number => {
    switch (action.type) {
      case RegistrationActionTypes.SET_REGISTERED_USER:
        return action.user.id

      case RegistrationActionTypes.RESET_REGISTRATION:
        return null

      default:
        return state
    }
  }

export default combineReducers({
  request: scopedSetLoadingReducer("registration"),
  user: registrationReducer,
})

/**
 * Selector to retrieve the registered user model if any.
 *
 * @returns IUser
 */
export const selectRegisteredUser = (state: AppState): IUser =>
  state.registration.user ? selectUserById(state, state.registration.user) : null
