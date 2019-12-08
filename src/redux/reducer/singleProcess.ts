import { IProcess } from "api/schema"
import { ProcessActions, ProcessActionTypes } from "redux/actions/processes"
import { IModelState, initialModelState } from "redux/helper/state"

export type ProcessState = IModelState<IProcess>

export default function(state: ProcessState = initialModelState, action: ProcessActions): ProcessState {
  switch (action.type) {
    case ProcessActionTypes.LOAD_PROCESS_BY_ID:
      return { ...state, model: null, isLoading: true, loadingError: null }

    case ProcessActionTypes.LOAD_PROCESS_BY_SLUG:
      return { ...state, model: null, isLoading: true, loadingError: null }

    case ProcessActionTypes.LOAD_PROCESS_SUCCESS:
      return { ...state, model: action.process, isLoading: false }

    case ProcessActionTypes.LOAD_PROCESS_FAILED:
      return { ...state, model: null, isLoading: false, loadingError: action.error }

    default:
      return state
  }
}

/**
 * Selector to retrieve the loaded process.
 *
 * @returns IProcess, may be empty
 */
export const selectProcess = (state: { singleProcess: ProcessState }): IProcess =>
  state.singleProcess.model ? state.singleProcess.model : null
