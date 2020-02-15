import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IUser, MembershipRole } from "api/schema"
import { AuthActionTypes, ISetAuthAction } from "redux/actions/auth"
import { loadCurrentUserAction } from "redux/actions/currentUser"
import { ICreateMemberApplicationAction, MemberApplicationActionTypes, resetMemberApplicationAction } from "redux/actions/memberApplication"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { addNotificationAction } from "redux/actions/notifications"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import { createModelAction, setLoadingAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectNewMemberApplication } from "redux/reducer/memberApplication"
import { getCurrentUser } from "redux/saga/currentUser"
import { SubmissionError } from "services/submissionError"

export function* memberApplicationWatcherSaga() {
  yield all([
    takeLatest(MemberApplicationActionTypes.CREATE_MEMBER_APPLICATION, withCallback(createApplicationSaga)),
    takeLatest(AuthActionTypes.SET_AUTH, createSavedApplicationSaga),
    takeLatest(RegistrationActionTypes.SET_REGISTERED_USER, postRegistrationSaga),
  ])
}

/**
 * Create a new project for an already logged in user.
 *
 * @param action ICreateProjectAction
 */
function* createApplicationSaga(action: ICreateMemberApplicationAction) {
  yield put(setLoadingAction("projectMembership_operation", true))
  console.log("start")
  const user: IUser = yield call(getCurrentUser)
  if (!user) {
    const err = yield select((s: AppState) => s.requests.processLoading.loadingError)
    yield put(setLoadingAction("projectMembership_operation", false, err))
    return null
  }
  console.log("got user")
  action.application.user = user["@id"]
  action.application.role = MembershipRole.APPLICANT
  const createdApplication = yield putWait(createModelAction(EntityType.PROJECT_MEMBERSHIP,
    action.application, action.actions))
  console.log("created app")
  // refresh the user to get the new membership
  yield put(loadCurrentUserAction())

  // refresh list of projects
  yield put(loadMyProjectsAction())

  return createdApplication
}

/**
 * After the user logged in: check if we have a previously entered but
 * not submitted project, if yes push it to the API now.
 */
function* createSavedApplicationSaga(action: ISetAuthAction) {
  // no token -> no successful login -> do nothing
  if (!action.token) {
    return
  }

  const memberApplication = yield select(selectNewMemberApplication)
  if (!memberApplication) {
    return
  }

  try {
    yield put(setLoadingAction("projectMembership_operation", true))
    const user: IUser = yield call(getCurrentUser)
    if (!user) {
      const err = yield select((s: AppState) => s.requests.processLoading.loadingError)
      yield put(setLoadingAction("projectMembership_operation", false, err))
      return null
    }

    memberApplication.user = user["@id"]
    memberApplication.role = MembershipRole.APPLICANT
    const savedApplication = yield call(apiClient.createProjectMembership, memberApplication)

    yield put(setLoadingAction("projectMembership_operation", false))
    yield put(addNotificationAction("message.project.memberships.applicationSaved", "success"))
    yield put(resetMemberApplicationAction())

    // refresh the user to get the new membership
    yield put(loadCurrentUserAction())

    // refresh list of projects
    yield put(loadMyProjectsAction())

    return savedApplication
  } catch (err) {
    if (err instanceof SubmissionError) {
      // we have no form where we could show individual messages per property, also the
      // error returned from the API is not (easily) translateable -> use general message
      yield put(addNotificationAction("validate.general.submissionFailed", "error"))
    } else {
      // @todo log RequestError for monitoring
      yield put(addNotificationAction(err.message, "error"))
    }

    return null
  }
}

/**
 * After a user registered successfully check if a new project was created with it,
 * if yes update the store and add notification.
 *
 * @param action ISetRegisteredUserAction
 */
function* postRegistrationSaga(action: ISetRegisteredUserAction) {
  if (!action.user.projectMemberships) {
    return
  }

  const hasApplication = action.user.projectMemberships
    .filter((m) => m.role === MembershipRole.APPLICANT)
    .length > 0

  if (hasApplication) {
    yield put(addNotificationAction("message.project.memberships.applicationSaved", "success"))
  }
}
