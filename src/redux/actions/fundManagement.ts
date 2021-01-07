import { IFund } from "api/schema"

export enum FundManagementActionTypes {
  ActivateFund = "ACTIVATE_FUND",
}

export interface IFundManagementAction {
  type: FundManagementActionTypes
}

export interface IActivateFundAction extends IFundManagementAction {
  actions: any
  fund: IFund
  type: FundManagementActionTypes.ActivateFund
}

export type FundManagementActions =
  IActivateFundAction

export const activateFundAction = (fund: IFund, actions: Record<string, unknown>): IActivateFundAction => ({
  actions,
  fund,
  type: FundManagementActionTypes.ActivateFund,
})
