import { IUser } from "api/schema"
import { scopedObjectReducer } from "redux/helper/reducers"
import { AppState } from "redux/store"

export default scopedObjectReducer<IUser>("user")

/**
 * Selector to retrieve the list of loaded users.
 *
 * @returns array of User, may be empty
 */
export const selectUsers = (state: AppState): IUser[] => Object.values(state.users)

/**
 * Selector to retrieve a user given by his ID.
 *
 * @returns array of User, may be empty
 */
export const selectUserById = (state: AppState, id: number): IUser => state.users[id]
