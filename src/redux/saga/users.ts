import hasProp from "lodash/has"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IUser } from "api/schema"
import {
  createModelSuccessAction,
  deleteModelSuccessAction,
  ILoadByAction,
  IModelFormAction,
  loadCollectionSuccessAction,
  loadModelSuccessAction,
  setLoadingAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { Scope } from "redux/reducer/data"
import { RequestError } from "services/requestError"
import { SubmissionError } from "services/submissionError"

export function* usersWatcherSaga() {
  yield all([
    takeLatest("CREATE_USER", createUserSaga),
    takeLatest("UPDATE_USER", updateUserSaga),
    takeLatest("DELETE_USER", deleteUserSaga),
    takeLatest("LOAD_USER", loadUserSaga),
    takeLatest("LOAD_USER_COLLECTION", loadUserCollectionSaga),
  ])
}

function* loadUserSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction(action.scope, true))

    let user: IUser = null
    if (hasProp(action.criteria, "id")) {
      user = yield call(apiClient.getUser, action.criteria.id)
    } else if (hasProp(action.criteria, "username")) {
      user = yield call(apiClient.getUserByUsername, action.criteria.username)
    } else {
      throw new Error("Unknown criteria when loading user")
    }

    yield put(loadModelSuccessAction(Scope.USER, user))
    yield put(setLoadingAction(action.scope, false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction(action.scope, false, msg))
  }
}

function* loadUserCollectionSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction(action.scope, true))
    const users: IHydraCollection<IUser> = yield call(apiClient.getUsers, action.criteria)
    yield put(loadCollectionSuccessAction(Scope.USER, users))
    yield put(setLoadingAction(action.scope, false))
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction(action.scope, false, msg))
  }
}

function* createUserSaga(action: IModelFormAction<IUser>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    const user: IUser = yield call(apiClient.createUser, action.model)
    yield put(createModelSuccessAction(Scope.USER, user))
    yield put(setLoadingAction(action.scope, false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction(action.scope, false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction(action.scope, false, err.message))
    }

    yield call(setSubmitting, false)
  }
}

function* updateUserSaga(action: IModelFormAction<IUser>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    const user: IUser = yield call(apiClient.updateUser, action.model)
    yield put(updateModelSuccessAction(Scope.USER, user))
    yield put(setLoadingAction(action.scope, false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction(action.scope, false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction(action.scope, false, err.message))
    }

    yield call(setSubmitting, false)
  }
}

function* deleteUserSaga(action: IModelFormAction<IUser>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction(action.scope, true))
    yield call(apiClient.deleteUser, action.model)
    yield put(deleteModelSuccessAction(Scope.USER, action.model))
    yield put(setLoadingAction(action.scope, false))
    yield call(success)
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, { ...err.errors })
      yield put(setLoadingAction(action.scope, false))
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
      yield put(setLoadingAction(action.scope, false, err.message))
    }

    yield call(setSubmitting, false)
  }
}
