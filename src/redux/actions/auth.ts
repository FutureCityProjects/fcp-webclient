import { ICredentials } from "api/schema"
import { IWebToken } from "redux/helper/state"

export enum AuthActionTypes {
  LOCAL_STORAGE_CHANGED = "LOCAL_STORAGE_CHANGED",
  LOGIN = "LOGIN",
  LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  SET_AUTH = "SET_AUTH",
  USER_IS_IDLE = "USER_IS_IDLE",
}

export interface IAuthAction {
  type: AuthActionTypes
}

export interface ILocalStorageChangedAction extends IAuthAction {
  type: AuthActionTypes.LOCAL_STORAGE_CHANGED
}

export interface ILoginAction extends IAuthAction {
  credentials: ICredentials
  redirectBack?: string
  type: AuthActionTypes.LOGIN
}

export interface ILoginSuccessfulAction extends IAuthAction {
  redirectBack?: string
  type: AuthActionTypes.LOGIN_SUCCESSFUL
}

export interface ILoginFailedAction extends IAuthAction {
  type: AuthActionTypes.LOGIN_FAILED
  error: string
}

export interface ILogoutAction extends IAuthAction {
  type: AuthActionTypes.LOGOUT
}

export interface IRefreshTokenAction extends IAuthAction {
  type: AuthActionTypes.REFRESH_TOKEN
}

export interface ISetAuthAction extends IAuthAction {
  type: AuthActionTypes.SET_AUTH
  token: IWebToken
}

export interface IUserIsIdleAction extends IAuthAction {
  type: AuthActionTypes.USER_IS_IDLE
}

export type AuthActions =
  ILocalStorageChangedAction
  | ILoginAction
  | ILoginSuccessfulAction
  | ILoginFailedAction
  | ILogoutAction
  | ISetAuthAction
  | IRefreshTokenAction
  | IUserIsIdleAction

export const loginAction = (credentials: ICredentials, redirectBack?: string): ILoginAction => ({
  credentials,
  redirectBack,
  type: AuthActionTypes.LOGIN,
})

export const localStorageChangedAction = (): ILocalStorageChangedAction => ({
  type: AuthActionTypes.LOCAL_STORAGE_CHANGED,
})

export const loginSuccessfulAction = (redirectBack?: string): ILoginSuccessfulAction => ({
  redirectBack,
  type: AuthActionTypes.LOGIN_SUCCESSFUL,
})

export const loginFailedAction = (error: string): ILoginFailedAction => ({
  error,
  type: AuthActionTypes.LOGIN_FAILED,
})

export const logoutAction = (): ILogoutAction => ({
  type: AuthActionTypes.LOGOUT,
})

export const refreshTokenAction = (): IRefreshTokenAction => ({
  type: AuthActionTypes.REFRESH_TOKEN,
})

export const setAuthAction = (token: IWebToken): ISetAuthAction => ({
  token,
  type: AuthActionTypes.SET_AUTH,
})

export const userIsIdleAction = (): IUserIsIdleAction => ({
  type: AuthActionTypes.USER_IS_IDLE,
})
