export enum ValidationActionTypes {
  CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT",
  CONFIRM_EMAIL = "CONFIRM_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
  RESET_VALIDATION_RESULT = "RESET_VALIDATION_RESULT",
}

export interface IValidationAction {
  type: ValidationActionTypes
}

export interface IConfirmAccountAction extends IValidationAction {
  actions: any
  id: string
  token: string
  type: ValidationActionTypes.CONFIRM_ACCOUNT
}

export interface IConfirmEmailAction extends IValidationAction {
  actions: any
  id: string
  token: string
  type: ValidationActionTypes.CONFIRM_EMAIL
}

export interface IResetPasswordAction extends IValidationAction {
  actions: any
  id: string
  password: string
  token: string
  type: ValidationActionTypes.RESET_PASSWORD
}

export interface IResetValidationResultAction extends IValidationAction {
  type: ValidationActionTypes.RESET_VALIDATION_RESULT
}

export type ValidationActions =
  IConfirmAccountAction
  | IConfirmEmailAction
  | IResetPasswordAction
  | IResetValidationResultAction

export const confirmAccountAction = (id: string, token: string, actions: any): IConfirmAccountAction => ({
  actions,
  id,
  token,
  type: ValidationActionTypes.CONFIRM_ACCOUNT,
})

export const confirmEmailAction = (id: string, token: string, actions: any): IConfirmEmailAction => ({
  actions,
  id,
  token,
  type: ValidationActionTypes.CONFIRM_EMAIL,
})

export const resetPasswordAction =
  (id: string, token: string, password: string, actions: any): IResetPasswordAction => ({
    actions,
    id,
    password,
    token,
    type: ValidationActionTypes.RESET_PASSWORD,
  })

export const resetValidationResultAction = (): IResetValidationResultAction => ({
  type: ValidationActionTypes.RESET_VALIDATION_RESULT,
})
