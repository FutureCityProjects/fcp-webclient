import { combineReducers } from "redux"

import { scopedSetLoadingReducer } from "redux/helper/reducers"

export default combineReducers({
  request: scopedSetLoadingReducer("userManagement"),
})
