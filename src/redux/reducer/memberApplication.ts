import { IProjectMembership } from "api/schema"
import { MemberApplicationActions, MemberApplicationActionTypes } from "redux/actions/memberApplication"
import { AppState } from "redux/reducer"

const emptyApplication = { motivation: "", skills: "" }

const memberApplicationReducer =
  (state: IProjectMembership = emptyApplication, action: MemberApplicationActions): IProjectMembership => {
    switch (action.type) {
      case MemberApplicationActionTypes.SetNewMemberApplication:
        return action.application

      case MemberApplicationActionTypes.ResetNewMemberApplication:
        return emptyApplication

      default:
        return state
    }
  }

export default memberApplicationReducer

/**
 * Selector to retrieve the new project entered by the user.
 *
 * @returns IProject|null
 */
export const selectNewMemberApplication = (state: AppState): IProjectMembership =>
  state.memberApplication.motivation ? state.memberApplication : null
