import { combineReducers } from "redux"

import { IUser } from "api/schema"
import { scopedSetLoadingReducer } from "redux/helper/reducers"
import { AppState } from "redux/store"
import { selectUsername } from "./auth"
import { selectUserByUsername } from "./data"

export default combineReducers({
  request: scopedSetLoadingReducer("current_user"),
})

/**
 * Selector to retrieve the currently logged in user.
 *
 * @returns IUser, may be empty
 */
export const selectCurrentUser = (state: AppState): IUser => {
  const username = selectUsername(state)
  return username ? selectUserByUsername(username, state) : null
}
