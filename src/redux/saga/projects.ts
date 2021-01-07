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
import { RequestErrors } from "services/requestError"
import { SubmissionError } from "services/submissionError"

export function* projectsWatcherSaga(): any {
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
        throw new Error(RequestErrors.NotFound)
      }
    } else {
      throw new Error("Unknown criteria when loading project")
    }

    yield put(loadModelSuccessAction(EntityType.Project, project))
    yield put(loadingSuccessAction("project_loading", project))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, project))
    }

    return project
  } catch (err) {
    yield put(setLoadingAction("project_loading", false, err.message))

    return null
  }
}

export function* loadProjectCollectionSaga(action: ILoadByAction): Generator<any, any, any> {
  try {
    yield put(setLoadingAction("project_collection_loading", true))
    const projects: IHydraCollection<IProject> = yield call(apiClient.getProjects, action.criteria)
    yield put(loadCollectionSuccessAction(EntityType.Project, projects))
    yield put(loadingSuccessAction("project_collection_loading", projects))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, projects))
    }

    return projects
  } catch (err) {
    yield put(setLoadingAction("project_collection_loading", false, err.message))

    return null
  }
}

function* createProjectSaga(action: IModelFormAction<IProject>) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    yield put(setLoadingAction("project_operation", true))
    const project: IProject = yield call(apiClient.createProject, action.model)
    yield put(createModelSuccessAction(EntityType.Project, project))
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
    yield put(updateModelSuccessAction(EntityType.Project, project))
    yield put(loadingSuccessAction("project_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(setSubmitting, false)
    if (success) {
      yield call(success, project)
    }

    return project
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
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
    yield put(deleteModelSuccessAction(EntityType.Project, action.model))
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
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("project_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
