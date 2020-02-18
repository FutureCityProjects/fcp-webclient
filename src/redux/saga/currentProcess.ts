import { putWait, withCallback } from "redux-saga-callback"
import { call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess } from "api/schema"
import { CurrentProcessActionTypes, loadCurrentProcessAction } from "redux/actions/currentProcess"
import { loadModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { selectCurrentProcess } from "redux/reducer/data"
import { EntityType } from "redux/reducer/data"

export function* currentProcessWatcherSaga() {
  yield takeLatest(CurrentProcessActionTypes.LOAD_CURRENT_PROCESS, withCallback(loadCurrentProcessSaga))
}

function* loadCurrentProcessSaga() {
  try {
    yield put(setLoadingAction("process_loading", true))
    const process: IProcess = yield call(apiClient.getCurrentProcess)
    if (process) {
      yield put(loadModelSuccessAction(EntityType.PROCESS, process))
    }
    yield put(setLoadingAction("process_loading", false))

    return process
  } catch (err) {
    yield put(setLoadingAction("process_loading", false, err.message))
    return null
  }
}

export function* getCurrentProcess(): IProcess {
  const process = yield select(selectCurrentProcess)
  if (process) {
    return process
  }

  return yield putWait(loadCurrentProcessAction())
}
