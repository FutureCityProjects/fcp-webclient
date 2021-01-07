import { Action } from "redux"

import { IFund, IHydraCollection } from "api/schema"
import { ILoadingSuccessAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectCollectionByIds } from "./data"

type FundsState = number[]

const fundsReducer = (state: FundsState = null, action: Action): FundsState => {
  switch (action.type) {
    case "LOADING_FUND_MANAGEMENT_SUCCESS":
      const funds: IHydraCollection<IFund> = (action as ILoadingSuccessAction).result
      return funds["hydra:member"]
        .map((p) => p.id)

    default:
      return state
  }
}

export default fundsReducer

export const selectManagementFundsLoaded = (state: AppState): boolean =>
  state.fundManagement !== null

export const selectManagementFunds = (state: AppState): IFund[] => {
  const ids: number[] = state.fundManagement
  if (ids === null || ids.length === 0) {
    return []
  }

  return selectCollectionByIds<IFund>(state, EntityType.Fund, ids)
}

export const selectFundByConcretizationId = (state: AppState, id: number): IFund =>
  selectManagementFunds(state)
    .filter((f) => f.concretizations.filter((c) => c.id === id).length === 1)
    .shift()
