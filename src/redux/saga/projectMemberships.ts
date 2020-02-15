import { withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProjectMembership } from "api/schema"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  IModelFormAction,
  loadingSuccessAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { SubmissionError } from "services/submissionError"

export function* projectMembershipsWatcherSaga() {
  yield all([
    takeLatest("CREATE_PROJECTMEMBERSHIP", withCallback(createProjectMembershipSaga)),
    takeLatest("UPDATE_PROJECTMEMBERSHIP", withCallback(updateProjectMembershipSaga)),
    takeLatest("DELETE_PROJECTMEMBERSHIP", withCallback(deleteProjectMembershipSaga)),
  ])
}

function* createProjectMembershipSaga(action: IModelFormAction<IProjectMembership>) {
  const { success, setErrors, setSubmitting } = action.actions
  console.log("start create")
  try {
    yield put(setLoadingAction("projectMembership_operation", true))
    const projectMembership: IProjectMembership = yield call(apiClient.createProjectMembership, action.model)
    yield put(createModelSuccessAction(EntityType.PROJECT_MEMBERSHIP, projectMembership))
    yield put(loadingSuccessAction("projectMembership_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }
    console.log("created")
    yield call(success, projectMembership)

    return projectMembership
  } catch (err) {
    console.log("creat err", err)
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("projectMembership_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateProjectMembershipSaga(action: IModelFormAction<IProjectMembership>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("projectMembership_operation", true))
    const projectMembership: IProjectMembership = yield call(apiClient.updateProjectMembership, action.model)
    yield put(updateModelSuccessAction(EntityType.PROJECT_MEMBERSHIP, projectMembership))
    yield put(loadingSuccessAction("projectMembership_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(setSubmitting, false)
    if (success) {
      yield call(success, projectMembership)
    }

    return projectMembership
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("projectMembership_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteProjectMembershipSaga(action: IModelFormAction<IProjectMembership>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("projectMembership_operation", true))
    yield call(apiClient.deleteProjectMembership, action.model)
    yield put(deleteModelSuccessAction(EntityType.PROJECT_MEMBERSHIP, action.model))
    yield put(loadingSuccessAction("projectMembership_operation", process))
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

    yield put(setLoadingAction("projectMembership_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
