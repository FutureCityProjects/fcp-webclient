import { combineReducers } from "redux"

import authReducer from "./auth"
import currentProcessReducer from "./currentProcess"
import newIdeaReducer from "./newIdea"
import notificationsReducer from "./notifications"
import profileReducer from "./profile"
import projectsReducer from "./projects"
import registrationReducer from "./registration"
import sagaReducer from "./saga"
import singleProcessReducer from "./singleProcess"
import singleUserReducer from "./singleUser"
import usersReducer from "./users"

export default combineReducers({
  auth: authReducer,
  currentProcess: currentProcessReducer,
  newIdea: newIdeaReducer,
  notifications: notificationsReducer,
  profile: profileReducer,
  projects: projectsReducer,
  registration: registrationReducer,
  saga: sagaReducer,
  singleProcess: singleProcessReducer,
  singleUser: singleUserReducer,
  users: usersReducer,
})
