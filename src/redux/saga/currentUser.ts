import { put, select, takeLatest } from "redux-saga/effects"

import { CurrentUserActionTypes } from "redux/actions/currentUser"
import { loadModelAction } from "redux/helper/actions"
import { selectUsername } from "redux/reducer/auth"
import { Scope } from "redux/reducer/data"

export function* currentUserWatcherSaga() {
  yield takeLatest(CurrentUserActionTypes.LOAD_CURRENT_USER, loadCurrentUserSaga)
}

function* loadCurrentUserSaga() {
  const username = yield select(selectUsername)
  if (username) {
    yield put(loadModelAction(Scope.USER, "current_user", { username }))
  }
}
