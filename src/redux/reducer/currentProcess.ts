import { IProcess } from "api/schema"
import { ProcessActions, ProcessActionTypes } from "../actions/processes"
import { IModelState, initialModelState } from "../helper/state"

export type CurrentProcessState = IModelState<IProcess>

export default function(state: CurrentProcessState = initialModelState, action: ProcessActions): CurrentProcessState {
  switch (action.type) {
    case ProcessActionTypes.LOAD_CURRENT_PROCESS:
      return { ...state, model: null, isLoading: true, loadingError: null }

    case ProcessActionTypes.LOAD_CURRENT_PROCESS_SUCCESS:
      return { ...state, model: action.process, isLoading: false }

    case ProcessActionTypes.LOAD_CURRENT_PROCESS_FAILED:
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
export const selectCurrentProcess = (state: { currentProcess: CurrentProcessState }): IProcess =>
  state.currentProcess.model ? state.currentProcess.model : null
