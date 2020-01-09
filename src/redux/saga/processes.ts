import hasProp from "lodash/has"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IProcess } from "api/schema"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  ILoadByAction,
  IModelFormAction,
  loadCollectionSuccessAction,
  loadModelSuccessAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { Scope } from "redux/reducer/data"
import { RequestError } from "services/requestError"
import { SubmissionError } from "services/submissionError"

export function* processesWatcherSaga() {
  yield all([
    takeLatest("CREATE_PROCESS", createProcessSaga),
    takeLatest("UPDATE_PROCESS", updateProcessSaga),
    takeLatest("DELETE_PROCESS", deleteProcessSaga),
    takeLatest("LOAD_PROCESS", loadProcessSaga),
    takeLatest("LOAD_PROCESS_COLLECTION", loadProcessCollectionSaga),
  ])
}

function* loadProcessSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction(action.scope, true))

    let process: IProcess = null
    if (hasProp(action.criteria, "id")) {
      process = yield call(apiClient.getProcess, action.criteria.id)
    } else if (hasProp(action.criteria, "slug")) {
      process = yield call(apiClient.getProcessBySlug, action.criteria.slug)
    } else {
      throw new Error("Unknown criteria when loading process")
    }

    yield put(loadModelSuccessAction(Scope.PROCESS, process))
    yield put(setLoadingAction(action.scope, false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction(action.scope, false, msg))
  }
}

function* loadProcessCollectionSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction(action.scope, true))
    const processs: IHydraCollection<IProcess> = yield call(apiClient.getProcesses, action.criteria)
    yield put(loadCollectionSuccessAction(Scope.PROCESS, processs))
    yield put(setLoadingAction(action.scope, false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction(action.scope, false, msg))
  }
}

function* createProcessSaga(action: IModelFormAction<IProcess>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    const process: IProcess = yield call(apiClient.createProcess, action.model)
    yield put(createModelSuccessAction(Scope.PROCESS, process))
    yield put(setLoadingAction(action.scope, false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction(action.scope, false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction(action.scope, false, err.message))
    }

    yield call(setSubmitting, false)
  }
}

function* updateProcessSaga(action: IModelFormAction<IProcess>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    const process: IProcess = yield call(apiClient.updateProcess, action.model)
    yield put(updateModelSuccessAction(Scope.PROCESS, process))
    yield put(setLoadingAction(action.scope, false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction(action.scope, false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction(action.scope, false, err.message))
    }

    yield call(setSubmitting, false)
  }
}

function* deleteProcessSaga(action: IModelFormAction<IProcess>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    yield call(apiClient.deleteProcess, action.model)
    yield put(deleteModelSuccessAction(Scope.PROCESS, action.model))
    yield put(setLoadingAction(action.scope, false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction(action.scope, false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction(action.scope, false, err.message))
    }

    yield call(setSubmitting, false)
  }
}
