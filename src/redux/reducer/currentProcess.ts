import { combineReducers } from "redux"

import { IProcess } from "api/schema"
import { scopedSetLoadingReducer } from "redux/helper/reducers"
import { AppState } from "redux/store"
import { Scope, selectCollection } from "./data"

export default combineReducers({
  request: scopedSetLoadingReducer("current_process"),
})

/**
 * Selector to retrieve the loaded process.
 *
 * @todo rewrite for multi-process
 * @returns IProcess, may be empty
 */
export const selectCurrentProcess = (state: AppState): IProcess =>
  selectCollection<IProcess>(Scope.PROCESS, state).shift()
