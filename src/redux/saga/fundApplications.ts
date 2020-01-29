import { withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IFundApplication } from "api/schema"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  IModelFormAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { SubmissionError } from "services/submissionError"

export function* fundApplicationsWatcherSaga() {
  yield all([
    takeLatest("CREATE_FUNDAPPLICATION", withCallback(createFundApplicationSaga)),
    takeLatest("UPDATE_FUNDAPPLICATION", withCallback(updateFundApplicationSaga)),
    takeLatest("DELETE_FUNDAPPLICATION", withCallback(deleteFundApplicationSaga)),
  ])
}

function* createFundApplicationSaga(action: IModelFormAction<IFundApplication>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fundApplication_operation", true))
    const fundApplication: IFundApplication = yield call(apiClient.createFundApplication, action.model)
    yield put(createModelSuccessAction(EntityType.FUND_APPLICATION, fundApplication, action.scope))
    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(success, fundApplication)

    return fundApplication
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
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
    yield put(updateModelSuccessAction(EntityType.FUND_APPLICATION, fundApplication, action.scope))
    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(success, fundApplication)

    return fundApplication
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
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
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundApplication_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
