import { IUser } from "api/schema"

export enum RegistrationActionTypes {
  REGISTER_USER = "REGISTER_USER",
  SET_REGISTERED_USER = "SET_REGISTERED_USER",
  RESET_REGISTRATION = "RESET_REGISTRATION",
}

export interface IRegistrationAction {
  type: RegistrationActionTypes
}

export interface IRegisterUserAction extends IRegistrationAction {
  actions: any
  type: RegistrationActionTypes.REGISTER_USER
  user: IUser
}

export interface IResetRegistrationAction extends IRegistrationAction {
  type: RegistrationActionTypes.RESET_REGISTRATION
}

export interface ISetRegisteredUserAction extends IRegistrationAction {
  type: RegistrationActionTypes.SET_REGISTERED_USER
  user: IUser
}

export type RegistrationActions =
  IRegisterUserAction
  | IResetRegistrationAction
  | ISetRegisteredUserAction

export const registerUserAction = (user: IUser, actions: any): IRegisterUserAction => ({
  actions,
  type: RegistrationActionTypes.REGISTER_USER,
  user,
})

export const setRegisteredUserAction = (user: IUser): ISetRegisteredUserAction => ({
  type: RegistrationActionTypes.SET_REGISTERED_USER,
  user,
})

export const resetRegistrationAction = (): IResetRegistrationAction => ({
  type: RegistrationActionTypes.RESET_REGISTRATION,
})
