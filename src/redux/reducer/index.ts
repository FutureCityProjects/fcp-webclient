import { combineReducers } from "redux"

import authReducer from "./auth"
import currentProcessReducer from "./currentProcess"
import profileReducer from "./profile"
import sagaReducer from "./saga"
import singleProcessReducer from "./singleProcess"
import singleUserReducer from "./singleUser"
import usersReducer from "./users"

export default combineReducers({
  auth: authReducer,
  currentProcess: currentProcessReducer,
  profile: profileReducer,
  saga: sagaReducer,
  singleProcess: singleProcessReducer,
  singleUser: singleUserReducer,
  users: usersReducer,
})
