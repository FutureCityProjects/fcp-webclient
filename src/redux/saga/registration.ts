import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IRegistration, IUser } from "api/schema"
import { AuthActionTypes } from "redux/actions/auth"
import { loadCurrentProcessAction } from "redux/actions/processes"
import {
  IRegisterUserAction,
  RegistrationActionTypes,
  resetRegistrationAction,
  setRegisteredUserAction,
} from "redux/actions/registration"
import { createModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { selectCurrentProcess } from "redux/reducer/currentProcess"
import { selectNewIdea } from "redux/reducer/newIdea"
import { SubmissionError } from "services/submissionError"
import { BASE_URL } from "../../../config"
import { loadCurrentProcessSaga } from "./processes"

export function* registrationWatcherSaga() {
  yield all([
    takeLatest(RegistrationActionTypes.REGISTER_USER, registerUserSaga),
    takeLatest(AuthActionTypes.LOGIN_SUCCESSFUL, resetRegistrationSaga),
  ])
}

function* registerUserSaga(action: IRegisterUserAction) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    yield put(setLoadingAction("registration", true))
    const registration: IRegistration = {
      validationUrl: BASE_URL + "validation/confirm?id={{id}}&token={{token}}&type={{type}}",
      ...action.user,
    }

    // @todo add additional action preUserRegister that we can intercept in extra sagas
    // to add the idea there
    const newIdea = yield select(selectNewIdea)
    if (newIdea) {
      // inject the current process, it's required
      let process: IProcess = yield select(selectCurrentProcess)
      if (!process) {
        yield call(loadCurrentProcessSaga, loadCurrentProcessAction())
        process = yield select(selectCurrentProcess)
      }

      newIdea.process = process["@id"]
      registration.createdProjects = [newIdea]
    }

    // @todo check for newProject

    const newUser: IUser = yield call(apiClient.registerUser, registration)
    yield put(createModelSuccessAction("user", newUser))
    yield put(setLoadingAction("registration", false))
    yield put(setRegisteredUserAction(newUser))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction("registration", false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction("registration", false, err.message))
    }

    yield call(setSubmitting, false)
  }
}

/**
 * After the user logged in remove the reference to a previous registration
 */
function* resetRegistrationSaga() {
  yield put(resetRegistrationAction())
}
