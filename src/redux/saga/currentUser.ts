import { putWait, withCallback } from "redux-saga-callback"
import { put, select, takeLatest } from "redux-saga/effects"

import { IUser } from "api/schema"
import { CurrentUserActionTypes, loadCurrentUserAction } from "redux/actions/currentUser"
import { loadModelAction, setLoadingAction } from "redux/helper/actions"
import { selectCurrentUserId } from "redux/reducer/auth"
import { selectCurrentUser } from "redux/reducer/auth"
import { EntityType } from "redux/reducer/data"

export function* currentUserWatcherSaga() {
  yield takeLatest(CurrentUserActionTypes.LOAD_CURRENT_USER, withCallback(loadCurrentUserSaga))
}

function* loadCurrentUserSaga() {
  const id = yield select(selectCurrentUserId)
  if (id) {
    return yield putWait(loadModelAction(EntityType.USER, { id }))
  }

  yield put(setLoadingAction("user_loading", false, "failure.notLoggedIn"))
  return null
}

export function* getCurrentUser(): IUser {
  const currentUser = yield select(selectCurrentUser)
  if (currentUser) {
    return currentUser
  }

  return yield putWait(loadCurrentUserAction())
}
