import { combineReducers } from "redux"

import { IFund, IFundApplication, IProcess, IProject, IUser } from "api/schema"
import { scopedObjectReducer } from "redux/helper/reducers"
import { AppState } from "redux/store"

export enum Scope {
  FUND = "fund",
  FUND_APPLICATION = "fundApplication",
  PROCESS = "process",
  PROJECT = "project",
  USER = "user",
}

export type ScopedModel = IFund | IFundApplication | IProcess | IProject | IUser

export default combineReducers({
  fund: scopedObjectReducer<IFund>(Scope.FUND),
  fundApplication: scopedObjectReducer<IFundApplication>(Scope.FUND_APPLICATION),
  process: scopedObjectReducer<IProcess>(Scope.PROCESS),
  project: scopedObjectReducer<IProject>(Scope.PROJECT),
  user: scopedObjectReducer<IUser>(Scope.USER),
})

export const selectCollection = <T extends ScopedModel>(scope: Scope, state: AppState): T[] =>
  Object.values(state.data[scope])

export const selectById = (scope: Scope, id: number, state: AppState): ScopedModel =>
  state.data[scope][id]

export const selectUserByUsername = (username: string, state: AppState): IUser =>
  selectCollection<IUser>(Scope.USER, state)
    .filter((u) => u.username === username)
    .shift()
