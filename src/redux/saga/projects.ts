import hasProp from "lodash/has"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IProject } from "api/schema"
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

export function* projectsWatcherSaga() {
  yield all([
    takeLatest("CREATE_PROJECT", createProjectSaga),
    takeLatest("UPDATE_PROJECT", updateProjectSaga),
    takeLatest("DELETE_PROJECT", deleteProjectSaga),
    takeLatest("LOAD_PROJECT", loadProjectSaga),
    takeLatest("LOAD_PROJECT_COLLECTION", loadProjectCollectionSaga),
  ])
}

function* loadProjectSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction(action.scope, true))

    let project: IProject = null
    if (hasProp(action.criteria, "id")) {
      project = yield call(apiClient.getProject, action.criteria.id)
    } else if (hasProp(action.criteria, "slug")) {
      project = yield call(apiClient.getProjectBySlug, action.criteria.slug)
    } else {
      throw new Error("Unknown criteria when loading project")
    }

    yield put(loadModelSuccessAction(Scope.PROJECT, project))
    yield put(setLoadingAction(action.scope, false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction(action.scope, false, msg))
  }
}

function* loadProjectCollectionSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction(action.scope, true))
    const projects: IHydraCollection<IProject> = yield call(apiClient.getProjects, action.criteria)
    yield put(loadCollectionSuccessAction(Scope.PROJECT, projects))
    yield put(setLoadingAction(action.scope, false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction(action.scope, false, msg))
  }
}

function* createProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    const project: IProject = yield call(apiClient.createProject, action.model)
    yield put(createModelSuccessAction(Scope.PROJECT, project))
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

function* updateProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    const project: IProject = yield call(apiClient.updateProject, action.model)
    yield put(updateModelSuccessAction(Scope.PROJECT, project))
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

function* deleteProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    yield call(apiClient.deleteProject, action.model)
    yield put(deleteModelSuccessAction(Scope.PROJECT, action.model))
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
