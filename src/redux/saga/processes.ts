import { call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess } from "api/schema"
import {
  ICreateProcessAction,
  ILoadCurrentProcessAction,
  IUpdateProcessAction,
  loadCurrentProcessFailedAction,
  loadCurrentProcessSuccessAction,
  ProcessActionTypes,
} from "redux/actions/processes"
import { RequestError } from "services/requestError"
import { SubmissionError } from "services/submissionError"

export function* processesWatcherSaga() {
  yield takeLatest(ProcessActionTypes.CREATE_PROCESS, createProcessSaga)
  yield takeLatest(ProcessActionTypes.UPDATE_PROCESS, updateProcessSaga)
  yield takeLatest(ProcessActionTypes.LOAD_CURRENT_PROCESS, loadCurrentProcessSaga)
}

/**
 * Handles the submission of the form to create a process.
 * Uses Formik actions to return state to the form component.
 *
 * @param action ICreateProcessAction
 */
function* createProcessSaga(action: ICreateProcessAction) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield call(apiClient.createProcess, action.process)
    yield call(success)
  } catch (err) {
    // @todo log RequestError for monitoring
    yield call(setErrors, err instanceof SubmissionError
      ? { ...err.errors }
      : { process: err.message },
    )

    yield call(setSubmitting, false)
  }
}

/**
 * Handles the submission of the form to edit a process.
 * Uses Formik actions to return state to the form component.
 *
 * @param action IUpdateProcessAction
 */
function* updateProcessSaga(action: IUpdateProcessAction) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield call(apiClient.updateProcess, action.process)
    yield call(success)
  } catch (err) {
    // @todo log RequestError for monitoring
    yield call(setErrors, err instanceof SubmissionError
      ? { ...err.errors }
      : { process: err.message },
    )

    yield call(setSubmitting, false)
  }
}

/**
 * Loads the current process for use in the application.
 * Supports resolving/rejecting a Promise to allow redirects when a|no process is found.
 *
 * @param action ILoadCurrentProcessAction
 */
export function* loadCurrentProcessSaga(action: ILoadCurrentProcessAction) {
  try {
    const process: IProcess = yield call(apiClient.getCurrentProcess)
    yield put(loadCurrentProcessSuccessAction(process))

    if (action.resolve) {
      yield call(action.resolve, process)
    }
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(loadCurrentProcessFailedAction(msg))

    if (action.reject) {
      yield call(action.reject, err)
    } else {
      throw err
    }
  }
}
