export enum ValidationActionTypes {
  ConfirmAccount = "CONFIRM_ACCOUNT",
  ConfirmEmail = "CONFIRM_EMAIL",
  ResetPassword = "RESET_PASSWORD",
  ResetValidationResult = "RESET_VALIDATION_RESULT",
}

export interface IValidationAction {
  type: ValidationActionTypes
}

export interface IConfirmAccountAction extends IValidationAction {
  actions: any
  id: string
  token: string
  type: ValidationActionTypes.ConfirmAccount
}

export interface IConfirmEmailAction extends IValidationAction {
  actions: any
  id: string
  token: string
  type: ValidationActionTypes.ConfirmEmail
}

export interface IResetPasswordAction extends IValidationAction {
  actions: any
  id: string
  password: string
  token: string
  type: ValidationActionTypes.ResetPassword
}

export interface IResetValidationResultAction extends IValidationAction {
  type: ValidationActionTypes.ResetValidationResult
}

export type ValidationActions =
  IConfirmAccountAction
  | IConfirmEmailAction
  | IResetPasswordAction
  | IResetValidationResultAction

export const confirmAccountAction = (id: string, token: string, actions: Record<string, unknown>): IConfirmAccountAction => ({
  actions,
  id,
  token,
  type: ValidationActionTypes.ConfirmAccount,
})

export const confirmEmailAction = (id: string, token: string, actions: Record<string, unknown>): IConfirmEmailAction => ({
  actions,
  id,
  token,
  type: ValidationActionTypes.ConfirmEmail,
})

export const resetPasswordAction =
  (id: string, token: string, password: string, actions: Record<string, unknown>): IResetPasswordAction => ({
    actions,
    id,
    password,
    token,
    type: ValidationActionTypes.ResetPassword,
  })

export const resetValidationResultAction = (): IResetValidationResultAction => ({
  type: ValidationActionTypes.ResetValidationResult,
})
