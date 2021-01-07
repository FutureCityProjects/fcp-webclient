import { combineReducers } from "redux"

import { IFund, IFundApplication, IFundConcretization, IProcess, IProject, IProjectMembership, IUser } from "api/schema"
import { scopedObjectReducer } from "redux/helper/reducers"
import { AppState } from "redux/reducer"

export enum EntityType {
  Fund = "fund",
  FundApplication = "fundApplication",
  FundConcretization = "fundConcretization",
  Process = "process",
  Project = "project",
  ProjectMembership = "projectMembership",
  User = "user",
}

export type ScopedModel = IFund | IFundApplication | IProcess | IProject | IUser

export default combineReducers({
  fund: scopedObjectReducer<IFund>(EntityType.Fund),
  fundApplication: scopedObjectReducer<IFundApplication>(EntityType.FundApplication),

  // fixes: Property '[Scope.FUND_CONCRETIZATION]' does not exist on type CombinedState
  // and other errors from typescript, we don't need this reducer but also can't use a fake
  // one like (state) => state
  fundConcretization: scopedObjectReducer<IFundConcretization>(EntityType.FundConcretization),

  process: scopedObjectReducer<IProcess>(EntityType.Process),
  project: scopedObjectReducer<IProject>(EntityType.Project),
  projectMembership: scopedObjectReducer<IProjectMembership>(EntityType.ProjectMembership),
  user: scopedObjectReducer<IUser>(EntityType.User),
})

export const selectCollection = <T extends ScopedModel>(state: AppState, scope: EntityType): T[] =>
  Object.values(state.data[scope])

export const selectCollectionByIds = <T extends ScopedModel>(state: AppState, scope: EntityType, ids: number[]): T[] =>
  ids.map((id) => state.data[scope][id] as T)

export const selectById = <T extends ScopedModel>(state: AppState, scope: EntityType, id: number): T =>
  state.data[scope][id] as T

export const selectUserByUsername = (state: AppState, username: string): IUser =>
  selectCollection<IUser>(state, EntityType.User)
    .filter((u) => u.username === username)
    .shift()

export const selectProjectBySlug = (state: AppState, slug: string): IProject =>
  selectCollection<IProject>(state, EntityType.Project)
    .filter((p) => p.slug === slug)
    .shift()

export const selectFundBySlug = (state: AppState, slug: string): IFund =>
  selectCollection<IFund>(state, EntityType.Fund)
    .filter((f) => f.slug === slug)
    .shift()

/**
 * Selector to retrieve the loaded process.
 *
 * @todo rewrite for multi-process
 * @returns IProcess, may be empty
 */
export const selectCurrentProcess = (state: AppState): IProcess =>
  selectCollection<IProcess>(state, EntityType.Process).shift()