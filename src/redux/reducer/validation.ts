import { Action } from "redux"

import { ValidationActionTypes } from "redux/actions/validation"
import { ILoadingSuccessAction } from "redux/helper/actions"

const validationsReducer = (state = false, action: Action): boolean => {
  switch (action.type) {
    case "LOADING_VALIDATION_OPERATION_SUCCESS":
      return (action as ILoadingSuccessAction).result

    case ValidationActionTypes.RESET_VALIDATION_RESULT:
      return false

    default:
      return state
  }
}

export default validationsReducer
