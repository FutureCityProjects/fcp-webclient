import { Action } from "redux"

import { IUser } from "api/schema"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "./data"

const registrationReducer =
  (state: number = null, action: Action): number => {
    switch (action.type) {
      case RegistrationActionTypes.SET_REGISTERED_USER:
        return (action as ISetRegisteredUserAction).user.id

      // After the user logged in remove the reference to a previous registration
      case "LOADING_LOGIN_SUCCESS":
        return null

      default:
        return state
    }
  }

export default registrationReducer

/**
 * Selector to retrieve the registered user model if any.
 *
 * @returns IUser
 */
export const selectRegisteredUser = (state: AppState): IUser =>
  state.registration ? selectById(state, EntityType.USER, state.registration) : null
