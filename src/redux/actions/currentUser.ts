export enum CurrentUserActionTypes {
  LoadCurrentUser = "LOAD_CURRENT_USER",
}

export interface ICurrentUserAction {
  type: CurrentUserActionTypes
}

export interface ILoadCurrentUserAction extends ICurrentUserAction {
  type: CurrentUserActionTypes.LoadCurrentUser
}

export type CurrentUserActions = ILoadCurrentUserAction

export const loadCurrentUserAction = (): ILoadCurrentUserAction => ({
  type: CurrentUserActionTypes.LoadCurrentUser,
})
