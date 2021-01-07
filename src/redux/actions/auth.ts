import { ToastOptions } from "react-toastify"

import { ICredentials, IUser } from "api/schema"
import { IWebToken } from "redux/helper/state"

export enum AuthActionTypes {
  Login = "LOGIN",
  LoginSuccessful = "LOGIN_SUCCESSFUL",
  Logout = "LOGOUT",
  RefreshToken = "REFRESH_TOKEN",
  SetAuth = "SET_AUTH",
  UserIsIdle = "USER_IS_IDLE",
}

export interface IAuthAction {
  type: AuthActionTypes
}

export interface ILoginAction extends IAuthAction {
  actions: any
  credentials: ICredentials
  type: AuthActionTypes.Login
}

export interface ILoginSuccessfulAction extends IAuthAction {
  user: IUser
  type: AuthActionTypes.LoginSuccessful
}

export interface ILogoutAction extends IAuthAction {
  message?: string
  options?: ToastOptions
  type: AuthActionTypes.Logout
}

export interface IRefreshTokenAction extends IAuthAction {
  type: AuthActionTypes.RefreshToken
}

export interface ISetAuthAction extends IAuthAction {
  type: AuthActionTypes.SetAuth
  token: IWebToken
}

export interface IUserIsIdleAction extends IAuthAction {
  type: AuthActionTypes.UserIsIdle
}

export type AuthActions =
  ILoginAction
  | ILogoutAction
  | ISetAuthAction
  | IRefreshTokenAction
  | ISetAuthAction
  | IUserIsIdleAction

export const loginAction = (credentials: ICredentials, actions: Record<string, unknown>): ILoginAction => ({
  actions,
  credentials,
  type: AuthActionTypes.Login,
})

export const loginSuccessfulAction = (user: IUser): ILoginSuccessfulAction => ({
  user,
  type: AuthActionTypes.LoginSuccessful,
})

export const logoutAction = (message?: string, options?: ToastOptions): ILogoutAction => ({
  message,
  options,
  type: AuthActionTypes.Logout,
})

export const refreshTokenAction = (): IRefreshTokenAction => ({
  type: AuthActionTypes.RefreshToken,
})

export const setAuthAction = (token: IWebToken): ISetAuthAction => ({
  token,
  type: AuthActionTypes.SetAuth,
})

export const userIsIdleAction = (): IUserIsIdleAction => ({
  type: AuthActionTypes.UserIsIdle,
})
