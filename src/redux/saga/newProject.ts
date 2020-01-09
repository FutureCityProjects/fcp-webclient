import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IProject, ProjectProgress } from "api/schema"
import { AuthActionTypes } from "redux/actions/auth"
import { ICreateProjectAction, resetNewProjectAction } from "redux/actions/newProject"
import { addNotificationAction } from "redux/actions/notifications"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import { createModelAction, createModelSuccessAction } from "redux/helper/actions"
import { selectCurrentProcess } from "redux/reducer/currentProcess"
import { Scope } from "redux/reducer/data"
import { selectNewProject } from "redux/reducer/newProject"
import { loadCurrentProcessSaga } from "redux/saga/currentProcess"
import { SubmissionError } from "services/submissionError"

export function* newProjectWatcherSaga() {
  yield all([
    takeLatest("CREATE_PROJECT", createProjectSaga),
    takeLatest(AuthActionTypes.LOGIN_SUCCESSFUL, createSavedProjectSaga),
    takeLatest(RegistrationActionTypes.SET_REGISTERED_USER, postRegistrationSaga),
  ])
}

/**
 * Create a new project for an already logged in user.
 *
 * @param action ICreateProjectAction
 */
function* createProjectSaga(action: ICreateProjectAction) {
  // inject the current process, it's required
  let process: IProcess = yield select(selectCurrentProcess)
  if (!process) {
    yield call(loadCurrentProcessSaga)
    process = yield select(selectCurrentProcess)
  }
  action.project.process = process["@id"]

  yield put(createModelAction(Scope.PROJECT, "new_project", action.project, action.actions))
}

/**
 * After the user logged in: check if we have a previously entered but
 * not submitted project, if yes push it to the API now.
 */
function* createSavedProjectSaga() {
  const newProject = yield select(selectNewProject)
  if (!newProject) {
    return
  }

  try {
    // inject the current process, it's required
    let process: IProcess = yield select(selectCurrentProcess)
    if (!process) {
      yield call(loadCurrentProcessSaga)
      process = yield select(selectCurrentProcess)
    }
    newProject.process = process["@id"]

    const savedProject: IProject = yield call(apiClient.createProject, newProject)
    yield put(createModelSuccessAction(Scope.PROJECT, savedProject))
    yield put(addNotificationAction("message.newProject.saved", "success"))
    yield put(resetNewProjectAction())
  } catch (err) {
    if (err instanceof SubmissionError) {
      // we have no form where we could show individual messages per property, also the
      // error returned from the API is not (easily) translateable -> use general message
      yield put(addNotificationAction("validate.general.submissionFailed", "error"))
    } else {
      // @todo log RequestError for monitoring
      yield put(addNotificationAction(err.message, "error"))
    }
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

  const createdProjects = action.user.createdProjects

  for (const key in createdProjects) {
    if (createdProjects.hasOwnProperty(key)) {
      if (createdProjects[key].progress === ProjectProgress.CREATING_PROFILE) {
        yield put(addNotificationAction("message.newProject.saved", "success"))
        yield put(resetNewProjectAction())
        yield put(createModelSuccessAction("project", createdProjects[key]))
      }
    }
  }
}
