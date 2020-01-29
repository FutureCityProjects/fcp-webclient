import hasProp from "lodash/has"
import { withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IProject } from "api/schema"
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
import { RequestError, REQUEST_ERRORS } from "services/requestError"
import { SubmissionError } from "services/submissionError"

export function* projectsWatcherSaga() {
  yield all([
    takeLatest("CREATE_PROJECT", withCallback(createProjectSaga)),
    takeLatest("UPDATE_PROJECT", withCallback(updateProjectSaga)),
    takeLatest("DELETE_PROJECT", withCallback(deleteProjectSaga)),
    takeLatest("LOAD_PROJECT", withCallback(loadProjectSaga)),
    takeLatest("LOAD_PROJECT_COLLECTION", withCallback(loadProjectCollectionSaga)),
  ])
}

function* loadProjectSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("project_loading", true))
    let project: IProject = null
    if (hasProp(action.criteria, "id")) {
      project = yield call(apiClient.getProject, action.criteria.id)
    } else if (hasProp(action.criteria, "slug")) {
      project = yield call(apiClient.getProjectBySlug, action.criteria.slug)

      // getProjectBySlug returns undefined when no project with the given slug is found,
      // the request to the collection was still successful -> throw error here
      if (!project) {
        throw new Error(REQUEST_ERRORS.NOT_FOUND)
      }
    } else {
      throw new Error("Unknown criteria when loading project")
    }

    yield put(loadModelSuccessAction(EntityType.PROJECT, project))
    yield put(loadingSuccessAction("project_loading", project))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, project))
    }

    return project
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction("project_loading", false, msg))

    return null
  }
}

export function* loadProjectCollectionSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("project_collection_loading", true))
    const projects: IHydraCollection<IProject> = yield call(apiClient.getProjects, action.criteria)
    yield put(loadCollectionSuccessAction(EntityType.PROJECT, projects))
    yield put(loadingSuccessAction("project_collection_loading", projects))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, projects))
    }

    return projects
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction("project_collection_loading", false, msg))

    return null
  }
}

function* createProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    yield put(setLoadingAction("project_operation", true))
    const project: IProject = yield call(apiClient.createProject, action.model)
    yield put(createModelSuccessAction(EntityType.PROJECT, project))
    yield put(loadingSuccessAction("project_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(success, project)

    return project
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("project_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("project_operation", true))
    const project: IProject = yield call(apiClient.updateProject, action.model)
    yield put(updateModelSuccessAction(EntityType.PROJECT, project))
    yield put(loadingSuccessAction("project_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(success, project)

    return project
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("project_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("project_operation", true))
    yield call(apiClient.deleteProject, action.model)
    yield put(deleteModelSuccessAction(EntityType.PROJECT, action.model))
    yield put(loadingSuccessAction("project_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(success)

    return true
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("project_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
