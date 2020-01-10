import { combineReducers } from "redux"

import authReducer from "./auth"
import currentProcessReducer from "./currentProcess"
import currentUserReducer from "./currentUser"
import dataReducer from "./data"
import newIdeaReducer from "./newIdea"
import newProjectReducer from "./newProject"
import notificationsReducer from "./notifications"
import processManagementReducer from "./processManagement"
import registrationReducer from "./registration"
import sagaReducer from "./saga"
import userManagementReducer from "./userManagement"

export default combineReducers({
  auth: authReducer,
  currentProcess: currentProcessReducer,
  currentUser: currentUserReducer,
  data: dataReducer,
  newIdea: newIdeaReducer,
  newProject: newProjectReducer,
  notifications: notificationsReducer,
  processManagement: processManagementReducer,
  registration: registrationReducer,
  saga: sagaReducer,
  userManagement: userManagementReducer,
})
