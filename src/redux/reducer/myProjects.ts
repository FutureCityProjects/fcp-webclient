import { Action, combineReducers } from "redux"

import { IFund, IHydraCollection, IProject, IProjectMembership, MembershipRole } from "api/schema"
import { ILoadingSuccessAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { selectCurrentUser } from "./auth"
import { EntityType, selectCollectionByIds } from "./data"

type myProjectsState = number[]

const myProjectsReducer = (state: myProjectsState = null, action: Action): myProjectsState => {
  switch (action.type) {
    // Storing the IDs of my projects is redundant as we can determine them from the current users
    // memberships. But we need a way to determine if the projects in the central data state were
    // loaded after the user logged in, if they were loaded before (e.g. because the user visited
    // the marketplace) they contain only public data
    case "LOADING_MY_PROJECTS_SUCCESS":
      const projects: IHydraCollection<IProject> = (action as ILoadingSuccessAction).result
      return projects["hydra:member"].map((p) => p.id)

    default:
      return state
  }
}

type selectableFundsState = number[]

const selectableFundsReducer = (state: selectableFundsState = null, action: Action): selectableFundsState => {
  switch (action.type) {
    case "LOADING_SELECTABLE_FUNDS_SUCCESS":
      const funds: IHydraCollection<IFund> = (action as ILoadingSuccessAction).result
      return funds["hydra:member"].map((f) => f.id)

    default:
      return state
  }
}

export default combineReducers({
  projects: myProjectsReducer,
  selectableFunds: selectableFundsReducer,
})

export const selectMyMemberships = (state: AppState): IProjectMembership[] => {
  const user = selectCurrentUser(state)
  return user ? user.projectMemberships : null
}

/**
 * Selector to retrieve the list of project IDs the user is a member (or applicant) of.
 *
 * @param state
 * @returns null if the user wasn't loaded yet, else the list of IDs (may be empty)
 */
export const selectMyProjectIDs = (state: AppState): number[] => {
  const memberships = selectMyMemberships(state)

  // to allow differentiating between "user not loaded" and "has no memberships":
  if (memberships === null) {
    return null
  }
  if (memberships.length === 0) {
    return []
  }

  return memberships.map((membership) => (membership.project as IProject).id)
}

/**
 * Selector to get all projects the current user is a member (or applicant) of.
 *
 * @param state
 * @returns null if the projects weren't loeaded yet or the list of projects (may be empty)
 */
export const selectMyProjects = (state: AppState): IProject[] => {
  if (state.myProjects.projects === null) {
    return null
  }

  if (state.myProjects.projects.length === 0) {
    return []
  }

  return selectCollectionByIds<IProject>(state, EntityType.PROJECT, state.myProjects.projects)
}

/**
 * @todo remove, use the state check directly
 *
 * @param state
 */
export const selectMyProjectsLoaded = (state: AppState): boolean =>
  state.myProjects.projects !== null

/**
 * Selector to get own of the users projects by either ID or slug.
 * Used on the member pages to make sure only own projects can be shown / edited.
 *
 * @param identifier
 * @param state
 * @returns null when the user has no own projects or when they weren't loaded yet, else
 *    the project matching by ID or slug
 */
export const selectMyProjectByIdentifier = (state: AppState, identifier: string | number): IProject => {
  const projects = selectMyProjects(state)
  if (projects === null) {
    return null
  }

  return projects.filter((p) => p.slug === identifier || p.id.toString() === identifier).shift()
}

export const selectIsProjectOwner = (state: AppState, identifier: string | number): boolean => {
  const project = selectMyProjectByIdentifier(state, identifier)
  if (!project) {
    return false
  }

  const memberships = selectMyMemberships(state)
  if (!memberships || memberships.length === 0) {
    return false
  }

  return memberships
    .filter((m: IProjectMembership) => (m.project as IProject).id === project.id && m.role === MembershipRole.OWNER)
    .length > 0
}

export const selectIsProjectMember = (state: AppState, identifier: string | number): boolean => {
  const project = selectMyProjectByIdentifier(state, identifier)
  if (!project) {
    return false
  }

  const memberships = selectMyMemberships(state)
  if (!memberships || memberships.length === 0) {
    return false
  }

  return memberships
    .filter((m: IProjectMembership) => (m.project as IProject).id === project.id && m.role !== MembershipRole.APPLICANT)
    .length > 0
}

export const selectIsProjectApplicant = (state: AppState, identifier: string | number): boolean => {
  const project = selectMyProjectByIdentifier(state, identifier)
  if (!project) {
    return false
  }

  const memberships = selectMyMemberships(state)
  if (!memberships || memberships.length === 0) {
    return false
  }

  return memberships
    .filter((m: IProjectMembership) => (m.project as IProject).id === project.id && m.role === MembershipRole.APPLICANT)
    .length > 0
}
