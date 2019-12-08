import { call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IUser } from "api/schema"
import {
  ILoadUserByIdAction,
  ILoadUserByUsernameAction,
  loadUserFailedAction,
  loadUsersFailedAction,
  loadUsersSuccessAction,
  loadUserSuccessAction,
  UserActionTypes,
} from "redux/actions/users"
import { selectAuthToken } from "redux/reducer/auth"
import { RequestError } from "services/requestError"

export function* usersWatcherSaga() {
  yield takeLatest(UserActionTypes.LOAD_USER_BY_ID, loadUserByIdSaga)
  yield takeLatest(UserActionTypes.LOAD_USER_BY_USERNAME, loadUserByUsernameSaga)
  yield takeLatest(UserActionTypes.LOAD_USERS, loadUsersSaga)
}

function* loadUserByIdSaga(action: ILoadUserByIdAction) {
  try {
    const token = yield select(selectAuthToken)
    const user: IUser = yield call(apiClient.getUser, action.id, token)
    yield put(loadUserSuccessAction(user))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(loadUserFailedAction(msg))
  }
}

function* loadUserByUsernameSaga(action: ILoadUserByUsernameAction) {
  try {
    const token = yield select(selectAuthToken)
    const user: IUser = yield call(apiClient.getUserByUsername, action.username, token)
    yield put(loadUserSuccessAction(user))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(loadUserFailedAction(msg))
  }
}

function* loadUsersSaga() {
  try {
    const token = yield select(selectAuthToken)
    const users: IHydraCollection<IUser> = yield call(apiClient.getUsers, token)
    yield put(loadUsersSuccessAction(users))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(loadUsersFailedAction(msg))
  }
}
