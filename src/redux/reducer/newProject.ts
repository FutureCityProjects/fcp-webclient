import { emptyProject, IProjectCreation } from "api/schema"
import { NewProjectActions, NewProjectActionTypes } from "redux/actions/newProject"
import { AppState } from "redux/reducer"

const newProjectReducer =
  (state: IProjectCreation = emptyProject, action: NewProjectActions): IProjectCreation => {
    switch (action.type) {
      case NewProjectActionTypes.SetNewProject:
        return action.project

      case NewProjectActionTypes.ResetNewProject:
        return emptyProject

      default:
        return state
    }
  }

export default newProjectReducer

/**
 * Selector to retrieve the new project entered by the user.
 *
 * @returns IProject|null
 */
export const selectNewProject = (state: AppState): IProjectCreation =>
  state.newProject.motivation ? state.newProject : null
