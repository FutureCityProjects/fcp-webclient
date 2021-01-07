import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProjectMembership, IUser, MembershipRole } from "api/schema"
import { AuthActionTypes, ILoginSuccessfulAction } from "redux/actions/auth"
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

export function* memberApplicationWatcherSaga(): any {
  yield all([
    takeLatest(MemberApplicationActionTypes.CreateMemberApplication, withCallback(createApplicationSaga)),
    takeLatest(AuthActionTypes.LoginSuccessful, createSavedApplicationSaga),
    takeLatest(RegistrationActionTypes.SetRegisteredUser, postRegistrationSaga),
  ])
}

/**
 * Create a new project for an already logged in user.
 *
 * @param action ICreateProjectAction
 */
function* createApplicationSaga(action: ICreateMemberApplicationAction) {
  yield put(setLoadingAction("projectMembership_operation", true))
  const user: IUser = yield call(getCurrentUser)
  if (!user) {
    const err = yield select((s: AppState) => s.requests.processLoading.loadingError as string)
    yield put(setLoadingAction("projectMembership_operation", false, err))
    return null
  }

  action.application.user = user["@id"]
  action.application.role = MembershipRole.Applicant
  const createdApplication: IProjectMembership = yield putWait(createModelAction(EntityType.ProjectMembership,
    action.application, action.actions))

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
function* createSavedApplicationSaga(action: ILoginSuccessfulAction) {
  const memberApplication: IProjectMembership = yield select(selectNewMemberApplication)
  if (!memberApplication) {
    return
  }

  try {
    yield put(setLoadingAction("projectMembership_operation", true))

    memberApplication.user = action.user["@id"]
    memberApplication.role = MembershipRole.Applicant
    const savedApplication: IProjectMembership = yield call(apiClient.createProjectMembership, memberApplication)

    yield put(setLoadingAction("projectMembership_operation", false))
    yield put(addNotificationAction("message.project.memberships.applicationSaved", "success"))
    yield put(resetMemberApplicationAction())

    // refresh the user to get the new membership
    yield putWait(loadCurrentUserAction())

    // refresh list of projects
    yield put(loadMyProjectsAction())

    return savedApplication
  } catch (err) {
    // reset the application or the saga will try to create it again each time the token
    // is refreshed...
    yield put(resetMemberApplicationAction())

    if (err instanceof SubmissionError) {
      const keys = Object.keys(err.errors)
      if (keys.length === 1 && typeof err.errors[keys[0]] === "string") {
        yield put(addNotificationAction(err.errors[keys[0]], "error"))
      } else {
        yield put(addNotificationAction("validate.general.submissionFailed", "error"))
      }
    } else {
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
    .filter((m) => m.role === MembershipRole.Applicant)
    .length > 0

  if (hasApplication) {
    yield put(addNotificationAction("message.project.memberships.applicationSaved", "success"))
  }
}
