import { ToastOptions } from "react-toastify"

import { ICredentials } from "api/schema"
import { IWebToken } from "redux/helper/state"

export enum AuthActionTypes {
  LOCAL_STORAGE_CHANGED = "LOCAL_STORAGE_CHANGED",
  LOGIN = "LOGIN",
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
  actions: any
  credentials: ICredentials
  type: AuthActionTypes.LOGIN
}

export interface ILogoutAction extends IAuthAction {
  message?: string
  options?: ToastOptions
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
  | ILogoutAction
  | ISetAuthAction
  | IRefreshTokenAction
  | IUserIsIdleAction

export const loginAction = (credentials: ICredentials, actions: any): ILoginAction => ({
  actions,
  credentials,
  type: AuthActionTypes.LOGIN,
})

export const localStorageChangedAction = (): ILocalStorageChangedAction => ({
  type: AuthActionTypes.LOCAL_STORAGE_CHANGED,
})

export const logoutAction = (message?: string, options?: ToastOptions): ILogoutAction => ({
  message,
  options,
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
