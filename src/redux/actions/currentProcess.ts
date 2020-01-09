export enum CurrentProcessActionTypes {
  LOAD_CURRENT_PROCESS = "LOAD_CURRENT_PROCESS",
}

export interface ICurrentProcessAction {
  type: CurrentProcessActionTypes
}

export interface ILoadCurrentProcessAction extends ICurrentProcessAction {
  type: CurrentProcessActionTypes.LOAD_CURRENT_PROCESS
}

export type CurrentProcessActions = ILoadCurrentProcessAction

export const loadCurrentProcessAction = (): ILoadCurrentProcessAction => ({
  type: CurrentProcessActionTypes.LOAD_CURRENT_PROCESS,
})
