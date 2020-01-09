import { call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess } from "api/schema"
import { CurrentProcessActionTypes } from "redux/actions/currentProcess"
import { loadModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { Scope } from "redux/reducer/data"
import { RequestError } from "services/requestError"

export function* currentProcessWatcherSaga() {
  yield takeLatest(CurrentProcessActionTypes.LOAD_CURRENT_PROCESS, loadCurrentProcessSaga)
}

export function* loadCurrentProcessSaga() {
  try {
    yield put(setLoadingAction("current_process", true))
    const process: IProcess = yield call(apiClient.getCurrentProcess)
    yield put(loadModelSuccessAction(Scope.PROCESS, process))
    yield put(setLoadingAction("current_process", false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction("current_process", false, msg))
  }
}
