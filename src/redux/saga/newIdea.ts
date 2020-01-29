import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IProject, ProjectProgress } from "api/schema"
import { AuthActionTypes, ISetAuthAction } from "redux/actions/auth"
import { ICreateIdeaAction, NewIdeaActionTypes, resetNewIdeaAction } from "redux/actions/newIdea"
import { addNotificationAction } from "redux/actions/notifications"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import { createModelAction, createModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectNewIdea } from "redux/reducer/newIdea"
import { SubmissionError } from "services/submissionError"
import { getCurrentProcess } from "./currentProcess"

export function* newIdeaWatcherSaga() {
  yield all([
    takeLatest(NewIdeaActionTypes.CREATE_IDEA, withCallback(createIdeaSaga)),
    takeLatest(AuthActionTypes.SET_AUTH, createSavedIdeaSaga),
    takeLatest(RegistrationActionTypes.SET_REGISTERED_USER, postRegistrationSaga),
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
    const err = yield select((s: AppState) => s.requests.processLoading.loadingError)
    yield put(setLoadingAction("project_operation", false, err))
    return null
  }

  // inject the current process, it's required
  action.idea.process = process["@id"]

  return yield putWait(createModelAction(EntityType.PROJECT, action.idea, action.actions, "new_idea"))
}

/**
 * After the user logged in: check if we have a previously entered but
 * not submitted project idea, if yes push it to the API now.
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
      const err = yield select((s) => s.currentProcess.request.loadingError)
      yield put(setLoadingAction("project_operation", false, err))
      return null
    }

    // inject the current process, it's required
    newIdea.process = process["@id"]

    const savedIdea: IProject = yield call(apiClient.createProject, newIdea)
    yield put(createModelSuccessAction(EntityType.PROJECT, savedIdea, "new_idea"))
    yield put(setLoadingAction("project_operation", false))
    yield put(addNotificationAction("message.projectIdea.saved", "success"))
    yield put(resetNewIdeaAction())

    return savedIdea
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
 * After a user registered successfully check if a new project idea was created with it,
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
      const project = createdProjects[key]
      if (project.progress === ProjectProgress.IDEA) {
        yield put(addNotificationAction("message.projectIdea.saved", "success"))
        yield put(resetNewIdeaAction())
        yield put(createModelSuccessAction(EntityType.PROJECT, createdProjects[key], "new_idea"))
      }
    }
  }
}
