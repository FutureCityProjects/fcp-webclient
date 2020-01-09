import { combineReducers } from "redux"

import { emptyProject, IProjectCreation } from "api/schema"
import { NewProjectActions, NewProjectActionTypes } from "redux/actions/newProject"
import { scopedSetLoadingReducer } from "redux/helper/reducers"

const newProjectReducer =
  (state: IProjectCreation = emptyProject, action: NewProjectActions): IProjectCreation => {
    switch (action.type) {
      case NewProjectActionTypes.SET_NEW_PROJECT:
        return action.project

      case NewProjectActionTypes.RESET_NEW_PROJECT:
        return emptyProject

      default:
        return state
    }
  }

export default combineReducers({
  project: newProjectReducer,
  request: scopedSetLoadingReducer("new_project"),
})

/**
 * Selector to retrieve the new project entered by the user.
 *
 * @returns IProject|null
 */
export const selectNewProject = (state: { newProject: { project: IProjectCreation } }): IProjectCreation =>
  state.newProject.project.motivation ? state.newProject.project : null
