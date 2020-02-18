import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProject, IProjectMembership, IUser } from "api/schema"
import { loadCurrentUserAction } from "redux/actions/currentUser"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  IModelFormAction,
  loadingSuccessAction,
  loadModelAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { selectCurrentUserId } from "redux/reducer/auth"
import { EntityType } from "redux/reducer/data"
import { selectMyMemberships } from "redux/reducer/myProjects"
import { SubmissionError } from "services/submissionError"
import { getCurrentUser } from "./currentUser"

export function* projectMembershipsWatcherSaga() {
  yield all([
    takeLatest("CREATE_PROJECTMEMBERSHIP", withCallback(createProjectMembershipSaga)),
    takeLatest("UPDATE_PROJECTMEMBERSHIP", withCallback(updateProjectMembershipSaga)),
    takeLatest("DELETE_PROJECTMEMBERSHIP", withCallback(deleteProjectMembershipSaga)),
  ])
}

function* createProjectMembershipSaga(action: IModelFormAction<IProjectMembership>) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    yield put(setLoadingAction("projectMembership_operation", true))
    const projectMembership: IProjectMembership = yield call(apiClient.createProjectMembership, action.model)
    yield put(createModelSuccessAction(EntityType.PROJECT_MEMBERSHIP, projectMembership))
    yield put(loadingSuccessAction("projectMembership_operation", process))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    yield call(success, projectMembership)

    const currentUserId = yield select(selectCurrentUserId)
    if ((projectMembership.user as IUser).id === currentUserId) {
      // refresh my memberships and my-projects list (wait for the user result!)
      yield putWait(loadCurrentUserAction())
      yield put(loadMyProjectsAction())
    } else {
      // only refresh the project, e.g. the owner created a new membership
      yield put(loadModelAction(EntityType.PROJECT, { id: (action.model.project as IProject).id }, action.scope))
    }

    return projectMembership
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
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

    // refresh the project, this also sets the loadingSuccess
    yield put(loadModelAction(EntityType.PROJECT, { id: (action.model.project as IProject).id }, action.scope))

    yield call(setSubmitting, false)
    if (success) {
      yield call(success, projectMembership)
    }

    const currentUser: IUser = yield call(getCurrentUser)
    if (currentUser) {
      // I myself was the member -> update my memberships
      if (currentUser.id === (action.model.user as IUser).id) {
        yield put(loadCurrentUserAction())
      }
    }

    return projectMembership
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
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

    // if the membership is actually the currentUser's membership it has no [user] property so
    // we can't compare action.model.user.id to the currentUser.id. We also don't want to assume
    // that it's the currentUser's membership if no user property is present -> lookup by the @id
    const myMemberships = yield select(selectMyMemberships)
    const isMyMembership = myMemberships && myMemberships
      .filter((m) => m["@id"] === action.model["@id"])
      .length > 0

    if (isMyMembership) {
      // I myself was the member -> update my memberships (wait for result!) & the list of myProjects
      yield putWait(loadCurrentUserAction())
      yield put(loadMyProjectsAction())
      yield put(loadingSuccessAction("projectMembership_operation", true))
    } else {
      // refresh the project, this also sets the loadingSuccess
      yield put(loadModelAction(EntityType.PROJECT, { id: (action.model.project as IProject).id }, action.scope))
    }

    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, process))
    }

    if (success) {
      yield call(success)
    }

    return true
  } catch (err) {
    if (err instanceof SubmissionError) {
      if (setErrors) {
        yield call(setErrors, err.errors)
      }
    } else {
      if (setErrors) {
        yield call(setErrors, { _error: err.message })
      }
    }

    yield put(setLoadingAction("projectMembership_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
