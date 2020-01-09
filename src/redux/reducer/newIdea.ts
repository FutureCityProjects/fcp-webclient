import { combineReducers } from "redux"

import { emptyIdea, IProject } from "api/schema"
import { NewIdeaActions, NewIdeaActionTypes } from "redux/actions/newIdea"
import { scopedSetLoadingReducer } from "redux/helper/reducers"

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

export default combineReducers({
  idea: newIdeaReducer,
  request: scopedSetLoadingReducer("new_idea"),
})

/**
 * Selector to retrieve the new project idea entered by the user.
 *
 * @returns IProject|null
 */
export const selectNewIdea = (state: { newIdea: { idea: IProject } }): IProject =>
  state.newIdea.idea.shortDescription ? state.newIdea.idea : null
