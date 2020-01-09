import { combineReducers } from "redux"

import { emptyIdea, IProject } from "api/schema"
import { NewIdeaActions, NewIdeaActionTypes } from "redux/actions/newIdea"
import { scopedSetLoadingReducer } from "redux/helper/reducers"

interface INewIdeaState {
  created: boolean
  data: IProject
}

const intitialNewIdeaState: INewIdeaState = {
  created: false,
  data: emptyIdea,
}

const newIdeaReducer =
  (state: INewIdeaState = intitialNewIdeaState, action: NewIdeaActions): INewIdeaState => {
    switch (action.type) {
      case NewIdeaActionTypes.SET_NEW_IDEA:
        return { ...state, data: action.idea }

      case NewIdeaActionTypes.SET_IDEA_CREATED:
        return { ...state, created: true }

      case NewIdeaActionTypes.RESET_NEW_IDEA:
        return intitialNewIdeaState

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
export const selectNewIdea = (state: { newIdea: { idea: INewIdeaState } }): IProject =>
  state.newIdea.idea.data.shortDescription
    ? state.newIdea.idea.data
    : null
