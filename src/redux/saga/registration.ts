import { withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IProcess, IRegistration, IUser, MembershipRole } from "api/schema"
import { resetMemberApplicationAction } from "redux/actions/memberApplication"
import { resetNewIdeaAction } from "redux/actions/newIdea"
import { resetNewProjectAction } from "redux/actions/newProject"
import {
  IRegisterUserAction,
  RegistrationActionTypes,
  setRegisteredUserAction,
} from "redux/actions/registration"
import { createModelSuccessAction, setLoadingAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectNewMemberApplication } from "redux/reducer/memberApplication"
import { selectNewIdea } from "redux/reducer/newIdea"
import { selectNewProject } from "redux/reducer/newProject"
import { Routes } from "services/routes"
import { SubmissionError } from "services/submissionError"
import { BASE_URL } from "../../../config"
import { getCurrentProcess } from "./currentProcess"

export function* registrationWatcherSaga() {
  yield all([
    takeLatest(RegistrationActionTypes.REGISTER_USER, withCallback(registerUserSaga)),
  ])
}

function* registerUserSaga(action: IRegisterUserAction) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    yield put(setLoadingAction("user_operation", true))
    // the API uses {{param}} as placeholder while Next uses [param]:
    const route = Routes.CONFIRM_ACCOUNT.replace(/\[/g, "{{").replace(/\]/g, "}}")

    const registration: IRegistration = {
      validationUrl: BASE_URL + route,
      ...action.user,
    }

    registration.createdProjects = []
    registration.projectMemberships = []

    // @todo add additional action preUserRegister that we can intercept in extra sagas
    // to add the idea there
    const newIdea = yield select(selectNewIdea)
    if (newIdea) {
      const process: IProcess = yield call(getCurrentProcess)
      if (!process) {
        const err = yield select((s: AppState) => s.requests.processLoading.loadingError)
        yield put(setLoadingAction("user_operation", false, err))
        return null
      }

      // inject the current process, it's required
      newIdea.process = process["@id"]
      registration.createdProjects.push(newIdea)
    }

    // @todo add additional action preUserRegister that we can intercept in extra sagas
    // to add the project there
    const newProject = yield select(selectNewProject)
    if (newProject) {
      const process: IProcess = yield call(getCurrentProcess)
      if (!process) {
        const err = yield select((s: AppState) => s.requests.processLoading.loadingError)
        yield put(setLoadingAction("user_operation", false, err))
        return null
      }

      // inject the current process, it's required
      newProject.process = process["@id"]
      registration.createdProjects.push(newProject)
    }

    // @todo add additional action preUserRegister that we can intercept in extra sagas
    // to add the membership there
    const newMembership = yield select(selectNewMemberApplication)
    if (newMembership) {
      newMembership.role = MembershipRole.APPLICANT
      registration.projectMemberships.push(newMembership)
    }

    const newUser: IUser = yield call(apiClient.registerUser, registration)
    yield put(createModelSuccessAction(EntityType.USER, newUser))
    yield put(setLoadingAction("user_operation", false))
    yield put(setRegisteredUserAction(newUser))
    yield call(success)

    // just needed for instances where no user validation is required
    yield put(resetMemberApplicationAction())
    yield put(resetNewIdeaAction())
    yield put(resetNewProjectAction())

    return newUser
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("user_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}
