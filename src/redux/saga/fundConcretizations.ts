import { putWait, withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IFund, IFundConcretization } from "api/schema"
import {
  IModelFormAction,
  loadModelAction,
  setLoadingAction,
} from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { selectFundByConcretizationId } from "redux/reducer/fundManagement"
import { SubmissionError } from "services/submissionError"

export function* fundConcretizationsWatcherSaga(): any {
  yield all([
    takeLatest("CREATE_FUNDCONCRETIZATION", withCallback(createFundConcretizationSaga)),
    takeLatest("UPDATE_FUNDCONCRETIZATION", withCallback(updateFundConcretizationSaga)),
    takeLatest("DELETE_FUNDCONCRETIZATION", withCallback(deleteFundConcretizationSaga)),
  ])
}

function* createFundConcretizationSaga(action: IModelFormAction<IFundConcretization>) {
  const { success, setErrors, setSubmitting } = action.actions

  try {
    yield put(setLoadingAction("fundConcretization_operation", true))
    const fundConcretization: IFundConcretization = yield call(apiClient.createFundConcretization, action.model)

    // reload the fund to have a consistent model in the store, instead of integrating the
    // concretization manually, this also sets the request scope isLoading to false
    yield putWait(loadModelAction(EntityType.Fund, { id: (fundConcretization.fund as IFund).id }, "fundConcretization_operation"))

    yield call(success, fundConcretization)

    return fundConcretization
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundConcretization_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateFundConcretizationSaga(action: IModelFormAction<IFundConcretization>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fundConcretization_operation", true))
    const fundConcretization: IFundConcretization = yield call(apiClient.updateFundConcretization, action.model)

    // reload the fund to have a consistent model in the store, instead of integrating the
    // concretization manually, this also sets the request scope isLoading to false
    yield putWait(loadModelAction(EntityType.Fund, { id: (fundConcretization.fund as IFund).id }, "fundConcretization_operation"))

    yield call(success, fundConcretization)

    return fundConcretization
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fundConcretization_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteFundConcretizationSaga(action: IModelFormAction<IFundConcretization>) {
  try {
    yield put(setLoadingAction("fundConcretization_operation", true))
    yield call(apiClient.deleteFundConcretization, action.model)

    const fund = yield select(selectFundByConcretizationId, action.model.id)

    // reload the fund to have a consistent model in the store, instead of removing the
    // concretization manually, this also sets the request scope isLoading to false
    yield putWait(loadModelAction(EntityType.Fund, { id: fund.id }, "fundConcretization_operation"))

    if (action.actions && action.actions.success) {
      yield call(action.actions.success)
    }

    return true
  } catch (err) {
    if (action.actions && action.actions.setErrors) {
      if (err instanceof SubmissionError) {
        yield call(action.actions.setErrors, err.errors)
      } else {
        yield call(action.actions.setErrors, { _error: err.message })
      }
    }

    yield put(setLoadingAction("fundConcretization_operation", false))
    if (action.actions && action.actions.setSubmitting) {
      yield call(action.actions.setSubmitting, false)
    }

    return false
  }
}
