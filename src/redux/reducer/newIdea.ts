import { emptyIdea, IProject } from "api/schema"
import { NewIdeaActions, NewIdeaActionTypes } from "redux/actions/newIdea"
import { AppState } from "redux/reducer"

const newIdeaReducer =
  (state: IProject = emptyIdea, action: NewIdeaActions): IProject => {
    switch (action.type) {
      case NewIdeaActionTypes.SET_NEW_IDEA:
        return action.idea

      case NewIdeaActionTypes.RESET_NEW_IDEA:
        return emptyIdea

      default:
        return state
    }
  }


export default newIdeaReducer

/**
 * Selector to retrieve the new project idea entered by the user.
 *
 * @returns IProject|null
 */
export const selectNewIdea = (state: AppState): IProject =>
  state.newIdea.shortDescription ? state.newIdea : null
