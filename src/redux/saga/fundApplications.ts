import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IFundApplication, IProject } from "api/schema"
import { ISubmitFundApplicationAction, MyProjectsActionTypes } from "redux/actions/myProjects"
import {
  deleteModelSuccessAction,
  IModelFormAction,
  loadModelAction,
  setLoadingAction,
} from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { SubmissionError } from "services/submissionError"

export function* fundApplicationsWatcherSaga() {
  yield all([
    takeLatest("CREATE_FUNDAPPLICATION", withCallback(createFundApplicationSaga)),
    takeLatest("UPDATE_FUNDAPPLICATION", withCallback(updateFundApplicationSaga)),
    takeLatest("DELETE_FUNDAPPLICATION", withCallback(deleteFundApplicationSaga)),
    takeLatest(MyProjectsActionTypes.SUBMIT_APPLICATION, withCallback(submitFundApplicationSaga)),
  ])
}

function* createFundApplicationSaga(action: IModelFormAction<IFundApplication>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fundApplication_operation", true))
    const fundApplication: IFundApplication = yield call(apiClient.createFundApplication, action.model)

    // reload the project to have a consistent model in the store, instead of integrating the
    // application manually, this also sets the request scope isLoading to false
    yield putWait(loadModelAction(EntityType.PROJECT, { id: (fundApplication.project as IProject).id }, "fundApplication_operation"))

    yield call(success, fundApplication)

    return fundApplication
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateFundApplicationSaga(action: IModelFormAction<IFundApplication>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fundApplication_operation", true))
    const fundApplication: IFundApplication = yield call(apiClient.updateFundApplication, action.model)

    // reload the project to have a consistent model in the store, instead of integrating the
    // application manually, this also sets the request scope isLoading to false
    yield putWait(loadModelAction(EntityType.PROJECT, { id: (fundApplication.project as IProject).id }, "fundApplication_operation"))

    if (success) {
      yield call(success, fundApplication)
    }

    return fundApplication
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteFundApplicationSaga(action: IModelFormAction<IFundApplication>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fundApplication_operation", true))
    yield call(apiClient.deleteFundApplication, action.model)
    yield put(deleteModelSuccessAction(EntityType.FUND_APPLICATION, action.model, action.scope))
    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(success)

    return true
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}

function* submitFundApplicationSaga(action: ISubmitFundApplicationAction) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fundApplication_operation", true))
    const fundApplication: IFundApplication = yield call(apiClient.submitFundApplication, action.application)

    // reload the project to have a consistent model in the store, instead of integrating the
    // application manually, this also sets the request scope isLoading to false
    yield putWait(loadModelAction(EntityType.PROJECT, { id: (fundApplication.project as IProject).id }, "fundApplication_operation"))

    if (success) {
      yield call(success, fundApplication)
    }

    return fundApplication
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}
