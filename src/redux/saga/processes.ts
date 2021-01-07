import hasProp from "lodash/has"
import { withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IProcess } from "api/schema"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  ILoadByAction,
  IModelFormAction,
  loadCollectionSuccessAction,
  loadingSuccessAction,
  loadModelSuccessAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { SubmissionError } from "services/submissionError"

export function* processesWatcherSaga(): any {
  yield all([
    takeLatest("CREATE_PROCESS", withCallback(createProcessSaga)),
    takeLatest("UPDATE_PROCESS", withCallback(updateProcessSaga)),
    takeLatest("DELETE_PROCESS", withCallback(deleteProcessSaga)),
    takeLatest("LOAD_PROCESS", withCallback(loadProcessSaga)),
    takeLatest("LOAD_PROCESS_COLLECTION", withCallback(loadProcessCollectionSaga)),
  ])
}

function* loadProcessSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("process_loading", true))

    let process: IProcess = null
    if (hasProp(action.criteria, "id")) {
      process = (yield call(apiClient.getProcess, action.criteria.id)) as IProcess
    } else if (hasProp(action.criteria, "slug")) {
      process = (yield call(apiClient.getProcessBySlug, action.criteria.slug)) as IProcess
    } else {
      throw new Error("Unknown criteria when loading process")
    }

    yield put(loadModelSuccessAction(EntityType.Process, process))
    yield put(loadingSuccessAction("process_loading", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    return process
  } catch (err) {
    yield put(setLoadingAction("process_loading", false, err.message))

    return null
  }
}

function* loadProcessCollectionSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("process_collection_loading", true))
    const processes: IHydraCollection<IProcess> = yield call(apiClient.getProcesses, action.criteria)
    yield put(loadCollectionSuccessAction(EntityType.Process, processes))
    yield put(loadingSuccessAction("process_collection_loading", processes))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, processes))
    }

    return processes
  } catch (err) {
    yield put(setLoadingAction("process_collection_loading", false, err.message))

    return null
  }
}

function* createProcessSaga(action: IModelFormAction<IProcess>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("process_operation", true))
    const process: IProcess = yield call(apiClient.createProcess, action.model)
    yield put(createModelSuccessAction(EntityType.Process, process))
    yield put(loadingSuccessAction("process_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(success, process)

    return process
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("process_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateProcessSaga(action: IModelFormAction<IProcess>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("process_operation", true))
    const process: IProcess = yield call(apiClient.updateProcess, action.model)
    yield put(updateModelSuccessAction(EntityType.Process, process))
    yield put(loadingSuccessAction("process_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(success, process)

    return process
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("process_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteProcessSaga(action: IModelFormAction<IProcess>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("process_operation", true))
    yield call(apiClient.deleteProcess, action.model)
    yield put(deleteModelSuccessAction(EntityType.Process, action.model))
    yield put(loadingSuccessAction("process_operation", action.model))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, action.model))
    }

    yield call(success)

    return true
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("process_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
