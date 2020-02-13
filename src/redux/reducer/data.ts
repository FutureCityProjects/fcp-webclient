import { combineReducers } from "redux"

import { IFund, IFundApplication, IFundConcretization, IProcess, IProject, IProjectMembership, IUser } from "api/schema"
import { scopedObjectReducer } from "redux/helper/reducers"
import { AppState } from "redux/reducer"

export enum EntityType {
  FUND = "fund",
  FUND_APPLICATION = "fundApplication",
  FUND_CONCRETIZATION = "fundConcretization",
  PROCESS = "process",
  PROJECT = "project",
  PROJECT_MEMBERSHIP = "projectMembership",
  USER = "user",
}

export type ScopedModel = IFund | IFundApplication | IProcess | IProject | IUser

export default combineReducers({
  fund: scopedObjectReducer<IFund>(EntityType.FUND),
  fundApplication: scopedObjectReducer<IFundApplication>(EntityType.FUND_APPLICATION),

  // fixes: Property '[Scope.FUND_CONCRETIZATION]' does not exist on type CombinedState
  // and other errors from typescript, we don't need this reducer but also can't use a fake
  // one like (state) => state
  fundConcretization: scopedObjectReducer<IFundConcretization>(EntityType.FUND_CONCRETIZATION),

  process: scopedObjectReducer<IProcess>(EntityType.PROCESS),
  project: scopedObjectReducer<IProject>(EntityType.PROJECT),
  projectMembership: scopedObjectReducer<IProjectMembership>(EntityType.PROJECT_MEMBERSHIP),
  user: scopedObjectReducer<IUser>(EntityType.USER),
})

export const selectCollection = <T extends ScopedModel>(state: AppState, scope: EntityType): T[] =>
  Object.values(state.data[scope])

export const selectCollectionByIds = <T extends ScopedModel>(state: AppState, scope: EntityType, ids: number[]): T[] =>
  ids.map((id) => state.data[scope][id] as T)

export const selectById = <T extends ScopedModel>(state: AppState, scope: EntityType, id: number): T =>
  state.data[scope][id] as T

export const selectUserByUsername = (state: AppState, username: string): IUser =>
  selectCollection<IUser>(state, EntityType.USER)
    .filter((u) => u.username === username)
    .shift()

export const selectProjectBySlug = (state: AppState, slug: string): IProject =>
  selectCollection<IProject>(state, EntityType.PROJECT)
    .filter((p) => p.slug === slug)
    .shift()

export const selectFundBySlug = (state: AppState, slug: string): IFund =>
  selectCollection<IFund>(state, EntityType.FUND)
    .filter((f) => f.slug === slug)
    .shift()

/**
 * Selector to retrieve the loaded process.
 *
 * @todo rewrite for multi-process
 * @returns IProcess, may be empty
 */
export const selectCurrentProcess = (state: AppState): IProcess =>
  selectCollection<IProcess>(state, EntityType.PROCESS).shift()