export enum MarketplaceActionTypes {
  LOAD_MARKETPLACE = "LOAD_MARKETPLACE",
}

export interface IMarketplaceAction {
  type: MarketplaceActionTypes
}

export interface ILoadMarketplaceAction extends IMarketplaceAction {
  type: MarketplaceActionTypes.LOAD_MARKETPLACE
}

export type MarketplaceActions = ILoadMarketplaceAction

export const loadMarketplaceAction = (): ILoadMarketplaceAction => ({
  type: MarketplaceActionTypes.LOAD_MARKETPLACE,
})
