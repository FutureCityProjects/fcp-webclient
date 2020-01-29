import { putWait, withCallback } from "redux-saga-callback"
import { takeLatest } from "redux-saga/effects"

import { MarketplaceActionTypes } from "redux/actions/marketplace"
import { loadCollectionAction } from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"

export function* marketplaceWatcherSaga() {
  yield takeLatest(MarketplaceActionTypes.LOAD_MARKETPLACE, withCallback(loadMarketplaceSaga))
}

function* loadMarketplaceSaga() {
  return yield putWait(loadCollectionAction(EntityType.PROJECT, {}, "marketplace"))
}
