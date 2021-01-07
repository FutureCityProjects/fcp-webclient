export enum MarketplaceActionTypes {
  LoadMarketplace = "LOAD_MARKETPLACE",
}

export interface IMarketplaceAction {
  type: MarketplaceActionTypes
}

export interface ILoadMarketplaceAction extends IMarketplaceAction {
  type: MarketplaceActionTypes.LoadMarketplace
}

export type MarketplaceActions = ILoadMarketplaceAction

export const loadMarketplaceAction = (): ILoadMarketplaceAction => ({
  type: MarketplaceActionTypes.LoadMarketplace,
})
