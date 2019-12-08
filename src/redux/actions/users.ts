import { IHydraCollection, IUser } from "api/schema"

export enum UserActionTypes {
  LOAD_USER_BY_ID = "LOAD_USER_BY_ID",
  LOAD_USER_BY_USERNAME = "LOAD_USER_BY_USERNAME",
  LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS",
  LOAD_USER_FAILED = "LOAD_USER_FAILED",

  LOAD_USERS = "LOAD_USERS",
  LOAD_USERS_SUCCESS = "LOAD_USERS_SUCCESS",
  LOAD_USERS_FAILED = "LOAD_USERS_FAILED",
}

export interface IUserAction {
  type: UserActionTypes
}

export interface ILoadUserByIdAction extends IUserAction {
  id: number
  type: UserActionTypes.LOAD_USER_BY_ID
}

export interface ILoadUserByUsernameAction extends IUserAction {
  username: string
  type: UserActionTypes.LOAD_USER_BY_USERNAME
}

export interface ILoadUserSuccessAction extends IUserAction {
  type: UserActionTypes.LOAD_USER_SUCCESS
  user: IUser
}

export interface ILoadUserFailedAction extends IUserAction {
  type: UserActionTypes.LOAD_USER_FAILED
  error: string
}

export interface ILoadUsersAction extends IUserAction {
  type: UserActionTypes.LOAD_USERS
}

export interface ILoadUsersSuccessAction extends IUserAction {
  type: UserActionTypes.LOAD_USERS_SUCCESS
  users: IHydraCollection<IUser>
}

export interface ILoadUsersFailedAction extends IUserAction {
  type: UserActionTypes.LOAD_USERS_FAILED
  error: string
}

export type UserActions =
  ILoadUserByIdAction
  | ILoadUserByUsernameAction
  | ILoadUserSuccessAction
  | ILoadUserFailedAction
  | ILoadUsersAction
  | ILoadUsersSuccessAction
  | ILoadUsersFailedAction

export const loadUserByIdAction = (id: number): ILoadUserByIdAction => ({
  id,
  type: UserActionTypes.LOAD_USER_BY_ID,
})

export const loadUserByUsernameAction = (id: number): ILoadUserByIdAction => ({
  id,
  type: UserActionTypes.LOAD_USER_BY_ID,
})

export const loadUserSuccessAction = (user: IUser): ILoadUserSuccessAction => ({
  type: UserActionTypes.LOAD_USER_SUCCESS,
  user,
})

export const loadUserFailedAction = (error: string): ILoadUserFailedAction => ({
  error,
  type: UserActionTypes.LOAD_USER_FAILED,
})

export const loadUsersAction = (): ILoadUsersAction => ({
  type: UserActionTypes.LOAD_USERS,
})

export const loadUsersSuccessAction = (users: IHydraCollection<IUser>): ILoadUsersSuccessAction => ({
  type: UserActionTypes.LOAD_USERS_SUCCESS,
  users,
})

export const loadUsersFailedAction = (error: string): ILoadUsersFailedAction => ({
  error,
  type: UserActionTypes.LOAD_USERS_FAILED,
})
