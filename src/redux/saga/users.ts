import hasProp from "lodash/has"
import { withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { IHydraCollection, IUser } from "api/schema"
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
import { EntityType } from "redux/reducer/data"
import { RequestError } from "services/requestError"
import { SubmissionError } from "services/submissionError"

export function* usersWatcherSaga() {
  yield all([
    takeLatest("CREATE_USER", withCallback(createUserSaga)),
    takeLatest("UPDATE_USER", withCallback(updateUserSaga)),
    takeLatest("DELETE_USER", withCallback(deleteUserSaga)),
    takeLatest("LOAD_USER", withCallback(loadUserSaga)),
    takeLatest("LOAD_USER_COLLECTION", withCallback(loadUserCollectionSaga)),
  ])
}

function* loadUserSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("user_loading", true))
    let user: IUser = null
    if (hasProp(action.criteria, "id")) {
      user = yield call(apiClient.getUser, action.criteria.id)
    } else if (hasProp(action.criteria, "username")) {
      user = yield call(apiClient.getUserByUsername, action.criteria.username)
    } else {
      throw new Error("Unknown criteria when loading user")
    }

    yield put(loadModelSuccessAction(EntityType.USER, user))
    yield put(loadingSuccessAction("user_loading", user))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, user))
    }

    return user
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction("user_loading", false, msg))

    return null
  }
}

function* loadUserCollectionSaga(action: ILoadByAction) {
  try {
    yield put(setLoadingAction("user_collection_loading", true))
    const users: IHydraCollection<IUser> = yield call(apiClient.getUsers, action.criteria)
    yield put(loadCollectionSuccessAction(EntityType.USER, users, action.scope))
    yield put(loadingSuccessAction("user_collection_loading", users))
    if (action.scope) {
      yield put(loadingSuccessAction(action.scope, users))
    }

    return users
  } catch (err) {
    // @todo log RequestError for monitoring
    const msg = err instanceof RequestError ? "message.requestError" : err.message
    yield put(setLoadingAction("user_collection_loading", false, msg))

    return null
  }
}

function* createUserSaga(action: IModelFormAction<IUser>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("user_operation", true))
    const user: IUser = yield call(apiClient.createUser, action.model)
    yield put(createModelSuccessAction(EntityType.USER, user))
    yield put(setLoadingAction("user_operation", false))
    if (action.scope) {
      yield put(setLoadingAction(action.scope, false))
    }

    yield call(success, user)

    return user
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("user_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* updateUserSaga(action: IModelFormAction<IUser>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("user_operation", true))
    const user: IUser = yield call(apiClient.updateUser, action.model)
    yield put(updateModelSuccessAction(EntityType.USER, user))
    yield put(setLoadingAction("user_operation", false))
    if (action.scope) {
      yield put(setLoadingAction(action.scope, false))
    }

    yield call(success, user)

    return user
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("user_operation", false))
    yield call(setSubmitting, false)

    return null
  }
}

function* deleteUserSaga(action: IModelFormAction<IUser>) {
  const { success, setErrors, setSubmitting } = action.actions
  try {
    yield put(setLoadingAction("user_operation", true))
    yield call(apiClient.deleteUser, action.model)
    yield put(deleteModelSuccessAction(EntityType.USER, action.model))
    yield put(setLoadingAction("user_operation", false))
    if (action.scope) {
      yield put(setLoadingAction(action.scope, false))
    }

    yield call(success)

    return true
  } catch (err) {
    if (err instanceof SubmissionError) {
      yield call(setErrors, err.errors)
    } else {
      // @todo log RequestError for monitoring
      yield call(setErrors, { _error: err.message })
    }

    yield put(setLoadingAction("user_operation", false))
    yield call(setSubmitting, false)

    return false
  }
}
