export enum CurrentProcessActionTypes {
  LoadCurrentProcess = "LOAD_CURRENT_PROCESS",
}

export interface ICurrentProcessAction {
  type: CurrentProcessActionTypes
}

export interface ILoadCurrentProcessAction extends ICurrentProcessAction {
  type: CurrentProcessActionTypes.LoadCurrentProcess
}

export type CurrentProcessActions = ILoadCurrentProcessAction

export const loadCurrentProcessAction = (): ILoadCurrentProcessAction => ({
  type: CurrentProcessActionTypes.LoadCurrentProcess,
})
