import { IHydraCollection, IProject } from "api/schema"
import { putWait, withCallback } from "redux-saga-callback"
import { takeLatest } from "redux-saga/effects"

import { MarketplaceActionTypes } from "redux/actions/marketplace"
import { loadCollectionAction } from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"

export function* marketplaceWatcherSaga(): any {
  yield takeLatest(MarketplaceActionTypes.LoadMarketplace, withCallback(loadMarketplaceSaga))
}

function* loadMarketplaceSaga() {
  const projects: IHydraCollection<IProject> = yield putWait(loadCollectionAction(EntityType.Project, {}, "marketplace"))
  return projects
}
