import { IUser } from "api/schema"

export enum RegistrationActionTypes {
  RegisterUser = "REGISTER_USER",
  SetRegisteredUser = "SET_REGISTERED_USER",
}

export interface IRegistrationAction {
  type: RegistrationActionTypes
}

export interface IRegisterUserAction extends IRegistrationAction {
  actions: any
  type: RegistrationActionTypes.RegisterUser
  user: IUser
}

export interface ISetRegisteredUserAction extends IRegistrationAction {
  type: RegistrationActionTypes.SetRegisteredUser
  user: IUser
}

export type RegistrationActions =
  IRegisterUserAction
  | ISetRegisteredUserAction

export const registerUserAction = (user: IUser, actions: Record<string, unknown>): IRegisterUserAction => ({
  actions,
  type: RegistrationActionTypes.RegisterUser,
  user,
})

export const setRegisteredUserAction = (user: IUser): ISetRegisteredUserAction => ({
  type: RegistrationActionTypes.SetRegisteredUser,
  user,
})
