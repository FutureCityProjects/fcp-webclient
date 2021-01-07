import { putWait, withCallback } from "redux-saga-callback"
import { put, select, takeLatest } from "redux-saga/effects"

import { IUser } from "api/schema"
import { CurrentUserActionTypes, loadCurrentUserAction } from "redux/actions/currentUser"
import { loadModelAction, setLoadingAction } from "redux/helper/actions"
import { selectCurrentUserId } from "redux/reducer/auth"
import { selectCurrentUser } from "redux/reducer/auth"
import { EntityType } from "redux/reducer/data"

export function* currentUserWatcherSaga(): any {
  yield takeLatest(CurrentUserActionTypes.LoadCurrentUser, withCallback(loadCurrentUserSaga))
}

function* loadCurrentUserSaga() {
  const id = yield select(selectCurrentUserId)
  if (id) {
    const user: IUser = yield putWait(loadModelAction(EntityType.User, { id }))
    return user
  }

  yield put(setLoadingAction("user_loading", false, "failure.notLoggedIn"))
  return null
}

export function* getCurrentUser(): IUser {
  let currentUser: IUser = yield select(selectCurrentUser)
  if (!currentUser) {
    currentUser = yield putWait(loadCurrentUserAction())
  }

  return currentUser
}
