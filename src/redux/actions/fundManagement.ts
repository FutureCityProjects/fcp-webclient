import { IFund } from "api/schema"

export enum FundManagementActionTypes {
  ACTIVATE_FUND = "ACTIVATE_FUND",
}

export interface IFundManagementAction {
  type: FundManagementActionTypes
}

export interface IActivateFundAction extends IFundManagementAction {
  actions: any
  fund: IFund
  type: FundManagementActionTypes.ACTIVATE_FUND
}

export type FundManagementActions =
  IActivateFundAction

export const activateFundAction = (fund: IFund, actions: any): IActivateFundAction => ({
  actions,
  fund,
  type: FundManagementActionTypes.ACTIVATE_FUND,
})
