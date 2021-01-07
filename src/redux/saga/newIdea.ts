import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IProject, ProjectProgress } from "api/schema"
import { AuthActionTypes, ISetAuthAction } from "redux/actions/auth"
import { ICreateIdeaAction, NewIdeaActionTypes, resetNewIdeaAction } from "redux/actions/newIdea"
import { addNotificationAction } from "redux/actions/notifications"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import { createModelAction, setLoadingAction } from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { selectNewIdea } from "redux/reducer/newIdea"
import { SubmissionError } from "services/submissionError"
import { getCurrentProcess } from "./currentProcess"

export function* newIdeaWatcherSaga(): any {
  yield all([
    takeLatest(NewIdeaActionTypes.CreateIdea, withCallback(createIdeaSaga)),
    takeLatest(AuthActionTypes.SetAuth, createSavedIdeaSaga),
    takeLatest(RegistrationActionTypes.SetRegisteredUser, postRegistrationSaga),
  ])
}

/**
 * Create a new project idea for an already logged in user.
 *
 * @param action ICreateIdeaAction
 */
function* createIdeaSaga(action: ICreateIdeaAction) {
  yield put(setLoadingAction("project_operation", true))

  const process: IProcess = yield call(getCurrentProcess)
  if (!process) {
    const err = yield select((s) => s.requests.processLoading.loadingError as string)
    yield put(setLoadingAction("project_operation", false, err))
    return null
  }

  // inject the current process, it's required
  action.idea.process = process["@id"]

  const idea: IProject = yield putWait(createModelAction(EntityType.Project, action.idea, action.actions))
  return idea
}

/**
 * After the user logged in: check if we have a previously entered but
 * not submitted project idea, if yes push it to the API now.
 * This is also called at each token refresh (SET_AUTH).
 */
function* createSavedIdeaSaga(action: ISetAuthAction) {
  // no token -> no successful login -> do nothing
  if (!action.token) {
    return
  }

  const newIdea = yield select(selectNewIdea)
  if (!newIdea) {
    return
  }

  try {
    yield put(setLoadingAction("project_operation", true))
    const process: IProcess = yield call(getCurrentProcess)
    if (!process) {
      const err = yield select((s) => s.currentProcess.request.loadingError as string)
      yield put(setLoadingAction("project_operation", false, err))
      return null
    }

    // inject the current process, it's required
    newIdea.process = process["@id"]

    const savedIdea: IProject = yield call(apiClient.createProject, newIdea)
    yield put(setLoadingAction("project_operation", false))
    yield put(addNotificationAction("message.project.ideaSaved", "success"))
    yield put(resetNewIdeaAction())

    return savedIdea
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
 * After a user registered successfully check if a new project idea was created with it,
 * if yes update the store and add notification.
 *
 * @param action ISetRegisteredUserAction
 */
function* postRegistrationSaga(action: ISetRegisteredUserAction) {
  if (!action.user.createdProjects) {
    return
  }

  for (const project of action.user.createdProjects) {
    if (project.progress === ProjectProgress.Idea) {
      yield put(addNotificationAction("message.project.ideaSaved", "success"))
      yield put(resetNewIdeaAction())
    }
  }
}
