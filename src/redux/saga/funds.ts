import hasProp from "lodash/has"
import { withCallback } from "redux-saga-callback"
import { all, call, put, select, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IFund, IHydraCollection, IProcess } from "api/schema"
import { FundManagementActionTypes, IActivateFundAction } from "redux/actions/fundManagement"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  ILoadByAction,
  IModelFormAction,
  loadCollectionSuccessAction,
  loadingSuccessAction,
  loadModelSuccessAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { RequestErrors } from "services/requestError"
import { SubmissionError } from "services/submissionError"
import { getCurrentProcess } from "./currentProcess"

export function* fundsWatcherSaga(): any {
  yield all([
    takeLatest("CREATE_FUND", withCallback(createFundSaga)),
    takeLatest("UPDATE_FUND", withCallback(updateFundSaga)),
    takeLatest("DELETE_FUND", withCallback(deleteFundSaga)),
    takeLatest("LOAD_FUND", withCallback(loadFundSaga)),
    takeLatest("LOAD_FUND_COLLECTION", withCallback(loadFundCollectionSaga)),
    takeLatest(FundManagementActionTypes.ActivateFund, withCallback(activateFundSaga)),
  ])
}

function* loadFundSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("fund_loading", true))
    let fund: IFund = null
    if (hasProp(action.criteria, "id")) {
      fund = yield call(apiClient.getFund, action.criteria.id)
    } else if (hasProp(action.criteria, "slug")) {
      fund = yield call(apiClient.getFundBySlug, action.criteria.slug)
      // getFundBySlug returns undefined when no fund with the given slug is found,
      // the request to the collection was still successful -> throw error here
      if (!fund) {
        throw new Error(RequestErrors.NotFound)
      }
    } else {
      throw new Error("Unknown criteria when loading fund")
    }

    yield put(loadModelSuccessAction(EntityType.Fund, fund))

    yield put(loadingSuccessAction("fund_loading", fund))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, fund))
    }

    return fund
  } catch (err) {
    yield put(setLoadingAction("fund_loading", false, err.message))
    return null
  }
}

export function* loadFundCollectionSaga(action: ILoadByAction): Generator<any, IHydraCollection<IFund>, IHydraCollection<IFund>> {
  try {
    yield put(setLoadingAction("fund_collection_loading", true))
    const funds: IHydraCollection<IFund> = yield call(apiClient.getFunds, action.criteria)
    yield put(loadCollectionSuccessAction(EntityType.Fund, funds))

    yield put(loadingSuccessAction("fund_collection_loading", funds))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, funds))
    }

    return funds
  } catch (err) {
    yield put(setLoadingAction("fund_collection_loading", false, err.message))

    return null
  }
}

function* createFundSaga(action: IModelFormAction<IFund>) {
  const { success, setErrors, setSubmitting } = action.actions

  const process: IProcess = yield call(getCurrentProcess)
  if (!process) {
    const err = yield select((s: AppState) => s.requests.processLoading.loadingError as string)
    yield put(setLoadingAction("fund_operation", false, err))
    return null
  }

  // inject the current process, it's required
  action.model.process = process["@id"]

  try {
    yield put(setLoadingAction("fund_operation", true))
    const fund: IFund = yield call(apiClient.createFund, action.model)
    yield put(createModelSuccessAction(EntityType.Fund, fund, action.scope))
    yield put(setLoadingAction("fund_operation", false))
    yield call(success, fund)

    return fund
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fund_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateFundSaga(action: IModelFormAction<IFund>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fund_operation", true))
    const fund: IFund = yield call(apiClient.updateFund, action.model)
    yield put(updateModelSuccessAction(EntityType.Fund, fund, action.scope))
    yield put(setLoadingAction("fund_operation", false))
    yield call(success, fund)

    return fund
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fund_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteFundSaga(action: IModelFormAction<IFund>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fund_operation", true))
    yield call(apiClient.deleteFund, action.model)
    yield put(deleteModelSuccessAction(EntityType.Fund, action.model, action.scope))
    yield put(setLoadingAction("fund_operation", false))
    yield call(success)

    return true
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fund_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}

function* activateFundSaga(action: IActivateFundAction) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("fund_operation", true))
    const fund: IFund = yield call(apiClient.acitvateFund, action.fund)
    yield put(updateModelSuccessAction(EntityType.Fund, fund))
    yield put(setLoadingAction("fund_operation", false))
    yield call(success, fund)

    return fund
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("fund_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}
