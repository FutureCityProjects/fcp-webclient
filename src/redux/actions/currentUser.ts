export enum CurrentUserActionTypes {
  LOAD_CURRENT_USER = "LOAD_CURRENT_USER",
}

export interface ICurrentUserAction {
  type: CurrentUserActionTypes
}

export interface ILoadCurrentUserAction extends ICurrentUserAction {
  type: CurrentUserActionTypes.LOAD_CURRENT_USER
}

export type CurrentUserActions = ILoadCurrentUserAction

export const loadCurrentUserAction = (): ILoadCurrentUserAction => ({
  type: CurrentUserActionTypes.LOAD_CURRENT_USER,
})
