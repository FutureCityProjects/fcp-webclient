import has from "lodash/has"
import { withCallback } from "redux-saga-callback"
import { all, call, put, takeLatest } from "redux-saga/effects"

import apiClient from "api/client"
import { addNotificationAction } from "redux/actions/notifications"
import { IConfirmAccountAction, IConfirmEmailAction, IResetPasswordAction, ValidationActionTypes } from "redux/actions/validation"
import { loadingSuccessAction, setLoadingAction } from "redux/helper/actions"
import { REQUEST_ERRORS } from "services/requestError"

export function* validationWatcherSaga() {
  yield all([
    takeLatest(ValidationActionTypes.CONFIRM_ACCOUNT, withCallback(confirmAccountSaga)),
    takeLatest(ValidationActionTypes.CONFIRM_EMAIL, withCallback(confirmEmailSaga)),
    takeLatest(ValidationActionTypes.RESET_PASSWORD, withCallback(confirmPasswordResetSaga)),
  ])
}

function* confirmAccountSaga(action: IConfirmAccountAction) {
  try {
    yield put(setLoadingAction("validation_operation", true))

    // @todo server-side and in the unit tests JSON is returned, on the client we only get
    // 205 reset content? why? Accepted Content-type? Validation is still confirmed...
    yield call(apiClient.confirmValidation, action.id, action.token)

    yield put(addNotificationAction("message.account.validated", "success"))
    yield put(loadingSuccessAction("validation_operation", true))

    if (has(action, "actions.success")) {
      yield call(action.actions.success)
    }

    return true
  } catch (err) {
    if (err.message === REQUEST_ERRORS.NOT_FOUND) {
      err.message = "validation.account.notFound"
    }

    yield action.actions
      ? call(action.actions.setErrors, { _error: err.message })
      : put(setLoadingAction("validation_operation", false, err.message))

    if (action.actions) {
      yield put(setLoadingAction("validation_operation", false))
      yield call(action.actions.setSubmitting, false)
    }

    return false
  }
}

function* confirmEmailSaga(action: IConfirmEmailAction) {
  try {
    yield put(setLoadingAction("validation_operation", true))
    const result = yield call(apiClient.confirmValidation, action.id, action.token)
    yield put(loadingSuccessAction("validation_operation", result))

    if (action.actions) {
      yield call(action.actions.success, result)
    }

    return result
  } catch (err) {
    if (err.message === REQUEST_ERRORS.NOT_FOUND) {
      err.message = "validation.changeEmail.notFound"
    }

    yield action.actions
      ? call(action.actions.setErrors, { _error: err.message })
      : put(setLoadingAction("validation_operation", false, err.message))

    if (action.actions) {
      yield put(setLoadingAction("validation_operation", false))
      yield call(action.actions.setSubmitting, false)
    }

    return null
  }
}

function* confirmPasswordResetSaga(action: IResetPasswordAction) {
  try {
    yield put(setLoadingAction("validation_operation", true))
    const result = yield call(apiClient.resetPassword, action.id, action.token, action.password)
    yield put(loadingSuccessAction("validation_operation", result))

    if (action.actions) {
      yield call(action.actions.success, result)
    }

    return result
  } catch (err) {
    if (err.message === REQUEST_ERRORS.NOT_FOUND) {
      err.message = "validation.resetPassword.notFound"
    }

    yield action.actions
      ? call(action.actions.setErrors, { _error: err.message })
      : put(setLoadingAction("validation_operation", false, err.message))

    if (action.actions) {
      yield put(setLoadingAction("validation_operation", false))
      yield call(action.actions.setSubmitting, false)
    }

    return null
  }
}
