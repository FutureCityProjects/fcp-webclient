import { putWait, withCallback } from "redux-saga-callback"
import { call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess } from "api/schema"
import { CurrentProcessActionTypes, loadCurrentProcessAction } from "redux/actions/currentProcess"
import { loadModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { selectCurrentProcess } from "redux/reducer/data"
import { EntityType } from "redux/reducer/data"

export function* currentProcessWatcherSaga(): any {
  yield takeLatest(CurrentProcessActionTypes.LoadCurrentProcess, withCallback(loadCurrentProcessSaga))
}

function* loadCurrentProcessSaga() {
  try {
    yield put(setLoadingAction("process_loading", true))
    const process: IProcess = yield call(apiClient.getCurrentProcess)
    if (process) {
      yield put(loadModelSuccessAction(EntityType.Process, process))
    }
    yield put(setLoadingAction("process_loading", false))

    return process
  } catch (err) {
    yield put(setLoadingAction("process_loading", false, err.message))
    return null
  }
}

export function* getCurrentProcess(): IProcess {
  let process: IProcess = yield select(selectCurrentProcess)
  if (!process) {
    process = yield putWait(loadCurrentProcessAction())
  }

  return process
}
