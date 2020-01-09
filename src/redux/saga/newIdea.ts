import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IProject, ProjectProgress } from "api/schema"
import { AuthActionTypes } from "redux/actions/auth"
import { ICreateIdeaAction, resetNewIdeaAction } from "redux/actions/newIdea"
import { addNotificationAction } from "redux/actions/notifications"
import { loadCurrentProcessAction } from "redux/actions/processes"
import { ISetRegisteredUserAction, RegistrationActionTypes } from "redux/actions/registration"
import {
  createModelSuccessAction,
  setLoadingAction,
} from "redux/helper/actions"
import { selectCurrentProcess } from "redux/reducer/currentProcess"
import { selectNewIdea } from "redux/reducer/newIdea"
import { loadCurrentProcessSaga } from "redux/saga/processes"
import { SubmissionError } from "services/submissionError"

export function* newIdeaWatcherSaga() {
  yield all([
    takeLatest("CREATE_IDEA", createIdeaSaga),
    takeLatest(AuthActionTypes.LOGIN_SUCCESSFUL, createSavedIdeaSaga),
    takeLatest(RegistrationActionTypes.SET_REGISTERED_USER, postRegistrationSaga),
  ])
}

/**
 * Create a new project idea for an already logged in user.
 *
 * @param action ICreateIdeaAction
 */
function* createIdeaSaga(action: ICreateIdeaAction) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    // inject the current process, it's required
    let process: IProcess = yield select(selectCurrentProcess)
    if (!process) {
      yield call(loadCurrentProcessSaga, loadCurrentProcessAction())
      process = yield select(selectCurrentProcess)
    }
    action.idea.process = process["@id"]

    yield put(setLoadingAction("new_idea", true))
    const savedIdea: IProject = yield call(apiClient.createProject, action.idea)
    yield put(createModelSuccessAction("project", savedIdea))
    yield put(setLoadingAction("new_idea", false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction("new_idea", false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction("new_idea", false, err.message))
    }

    yield call(setSubmitting, false)
  }
}

/**
 * After the user logged in: check if we have a previously entered but
 * not submitted project idea, if yes push it to the API now.
 */
function* createSavedIdeaSaga() {
  const newIdea = yield select(selectNewIdea)
  if (!newIdea) {
    return
  }

  try {
    // inject the current process, it's required
    let process: IProcess = yield select(selectCurrentProcess)
    if (!process) {
      yield call(loadCurrentProcessSaga, loadCurrentProcessAction())
      process = yield select(selectCurrentProcess)
    }
    newIdea.process = process["@id"]

    const savedIdea: IProject = yield call(apiClient.createProject, newIdea)
    yield put(createModelSuccessAction("project", savedIdea))
    yield put(addNotificationAction("message.projectIdea.saved", "success"))
    yield put(resetNewIdeaAction())
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
        yield put(createModelSuccessAction("project", createdProjects[key]))
      }
    }
  }
}
