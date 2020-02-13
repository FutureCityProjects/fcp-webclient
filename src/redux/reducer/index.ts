import { Action, combineReducers } from "redux"

import { GeneralActionTypes } from "redux/actions/general"
import authReducer from "./auth"
import dataReducer from "./data"
import fundManagementReducer from "./fundManagement"
import marketplaceReducer from "./marketplace"
import memberApplicationReducer from "./memberApplication"
import myProjectsReducer from "./myProjects"
import newIdeaReducer from "./newIdea"
import newProjectReducer from "./newProject"
import notificationsReducer from "./notifications"
import registrationReducer from "./registration"
import requestsReducer from "./requests"
import sagaReducer from "./saga"
import validationReducer from "./validation"

const appReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  fundManagement: fundManagementReducer,
  marketplace: marketplaceReducer,
  memberApplication: memberApplicationReducer,
  myProjects: myProjectsReducer,
  newIdea: newIdeaReducer,
  newProject: newProjectReducer,
  notifications: notificationsReducer,
  registration: registrationReducer,
  requests: requestsReducer,
  saga: sagaReducer,
  validation: validationReducer,
})

export type AppState = ReturnType<typeof appReducer>

/**
 * Enhance the default appReducer to allow clearing all state, e.g. after logout
 *
 * @param AppState state
 * @param Action action
 */
export default function rootReducer(state: AppState, action: Action) {
  if (action.type === GeneralActionTypes.CLEAR_STORE) {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}
