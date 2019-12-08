import { IUser } from "api/schema"

export enum ProfileActionTypes {
  LOAD_CURRENT_USER = "LOAD_CURRENT_USER",
  LOAD_CURRENT_USER_SUCCESS = "LOAD_CURRENT_USER_SUCCESS",
  LOAD_CURRENT_USER_FAILED = "LOAD_CURRENT_USER_FAILED",
}

export interface IProfileAction {
  type: ProfileActionTypes
}

export interface ILoadCurrentUserAction extends IProfileAction {
  type: ProfileActionTypes.LOAD_CURRENT_USER
}

export interface ILoadCurrentUserSuccessAction extends IProfileAction {
  type: ProfileActionTypes.LOAD_CURRENT_USER_SUCCESS
  user: IUser
}

export interface ILoadCurrentUserFailedAction extends IProfileAction {
  type: ProfileActionTypes.LOAD_CURRENT_USER_FAILED
  error: string
}

export type ProfileActions =
  ILoadCurrentUserAction
  | ILoadCurrentUserSuccessAction
  | ILoadCurrentUserFailedAction

export const loadCurrentUserAction = (): ILoadCurrentUserAction => ({
  type: ProfileActionTypes.LOAD_CURRENT_USER,
})

export const loadCurrentUserSuccessAction = (user: IUser): ILoadCurrentUserSuccessAction => ({
  type: ProfileActionTypes.LOAD_CURRENT_USER_SUCCESS,
  user,
})

export const loadCurrentUserFailedAction = (error: string): ILoadCurrentUserFailedAction => ({
  error,
  type: ProfileActionTypes.LOAD_CURRENT_USER_FAILED,
})
