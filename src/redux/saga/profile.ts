import { call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IUser } from "api/schema"
import {
  loadCurrentUserFailedAction,
  loadCurrentUserSuccessAction,
  ProfileActionTypes,
} from "redux/actions/profile"
import { selectAuthToken, selectUsername } from "redux/reducer/auth"
import { RequestError } from "services/requestError"

export function* profileWatcherSaga() {
  yield takeLatest(ProfileActionTypes.LOAD_CURRENT_USER, loadCurrentUserSaga)
}

function* loadCurrentUserSaga() {
  try {
    const token = yield select(selectAuthToken)
    const username = yield select(selectUsername)
    const user: IUser = yield call(apiClient.getUserByUsername, username, token)
    yield put(loadCurrentUserSuccessAction(user))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(loadCurrentUserFailedAction(msg))
  }
}
