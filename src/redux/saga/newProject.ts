import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IProject, ProjectProgress } from "api/schema"
import { AuthActionTypes, ISetAuthAction } from "redux/actions/auth"
import { loadCurrentUserAction } from "redux/actions/currentUser"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { ICreateProjectAction, NewProjectActionTypes, resetNewProjectAction } from "redux/actions/newProject"
import { addNotificationAction } from "redux/actions/notifications"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import { createModelAction, createModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectNewProject } from "redux/reducer/newProject"
import { getCurrentProcess } from "redux/saga/currentProcess"
import { SubmissionError } from "services/submissionError"

export function* newProjectWatcherSaga(): any {
  yield all([
    takeLatest(NewProjectActionTypes.CreateNewProject, withCallback(createProjectSaga)),
    takeLatest(AuthActionTypes.SetAuth, createSavedProjectSaga),
    takeLatest(RegistrationActionTypes.SetRegisteredUser, postRegistrationSaga),
  ])
}

/**
 * Create a new project for an already logged in user.
 *
 * @param action ICreateProjectAction
 */
function* createProjectSaga(action: ICreateProjectAction) {
  yield put(setLoadingAction("project_operation", true))
  const process: IProcess = yield call(getCurrentProcess)
  if (!process) {
    const err = yield select((s: AppState) => s.requests.processLoading.loadingError as string)
    yield put(setLoadingAction("project_operation", false, err))
    return null
  }

  // inject the current process, it's required
  action.project.process = process["@id"]

  const project: IProject = yield putWait(createModelAction(EntityType.Project, action.project, action.actions))

  // refresh the user to get the new membership
  yield putWait(loadCurrentUserAction())

  // refresh list of projects
  yield putWait(loadMyProjectsAction())

  return project
}

/**
 * After the user logged in: check if we have a previously entered but
 * not submitted project, if yes push it to the API now.
 */
function* createSavedProjectSaga(action: ISetAuthAction) {
  // no token -> no successful login -> do nothing
  if (!action.token) {
    return
  }

  const newProject: IProject = yield select(selectNewProject)
  if (!newProject) {
    return
  }

  try {
    yield put(setLoadingAction("project_operation", true))
    const process: IProcess = yield call(getCurrentProcess)
    if (!process) {
      const err = yield select((s) => s.currentProcess.request.loadingError) // @todo gibt es currentProcess überhaupt (noch)?
      yield put(setLoadingAction("project_operation", false, err))
      return null
    }

    // inject the current process, it's required
    newProject.process = process["@id"]

    const savedProject: IProject = yield call(apiClient.createProject, newProject)
    yield put(setLoadingAction("project_operation", false))
    yield put(addNotificationAction("message.project.newProjectSaved", "success"))
    yield put(resetNewProjectAction())

    // refresh the user to get the new membership
    yield put(loadCurrentUserAction())

    // refresh list of projects
    yield put(loadMyProjectsAction())

    return savedProject
  } catch (err) {
    if (err instanceof SubmissionError) {
      // we have no form where we could show individual messages per property, also the
      // error returned from the API is not (easily) translateable -> use general message
      yield put(addNotificationAction("validate.general.submissionFailed", "error"))
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
  if (!action.user.createdProjects) {
    return
  }

  for (const project of action.user.createdProjects) {
    if (project.progress === ProjectProgress.CreatingProfile) {
      yield put(addNotificationAction("message.project.newProjectSaved", "success"))
      yield put(resetNewProjectAction())
      yield put(createModelSuccessAction(EntityType.Project, project, "new_project"))
    }
  }
}
