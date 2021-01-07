import { Action } from "redux"

import { IHydraCollection, IProject, ProjectProgress, ProjectState } from "api/schema"
import { ILoadingSuccessAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectCollectionByIds } from "./data"

type MarketProjectsState = number[]

const marketProjectsReducer =
  (state: MarketProjectsState = [], action: Action): MarketProjectsState => {
    switch (action.type) {
      case "LOADING_MARKETPLACE_SUCCESS":
        const projects: IHydraCollection<IProject> = (action as ILoadingSuccessAction).result
        return projects["hydra:member"]
          // deactivated projects are not shown in the marketplace
          .filter((p) => p.state !== ProjectState.Deactivated)
          .map((p) => p.id)

      default:
        return state
    }
  }

export default marketProjectsReducer

export const selectMarketplaceIdeas = (state: AppState): IProject[] => {
  const ids: number[] = state.marketplace
  if (!ids.length) {
    return []
  }

  return selectCollectionByIds<IProject>(state, EntityType.Project, ids)
    .filter((p: IProject) => p.progress === ProjectProgress.Idea)
}

export const selectMarketplaceProjects = (state: AppState): IProject[] => {
  const ids: number[] = state.marketplace
  if (!ids.length) {
    return []
  }

  return selectCollectionByIds<IProject>(state, EntityType.Project, ids)
    .filter((p: IProject) => p.progress !== ProjectProgress.Idea)
}
