import { IProjectCreation } from "api/schema"

export enum NewProjectActionTypes {
  CREATE_PROJECT = "CREATE_PROJECT",
  SET_NEW_PROJECT = "SET_NEW_PROJECT",
  RESET_NEW_PROJECT = "RESET_NEW_PROJECT",
}

export interface INewProjectAction {
  type: NewProjectActionTypes
}

export interface ISetNewProjectAction extends INewProjectAction {
  project: IProjectCreation
  type: NewProjectActionTypes.SET_NEW_PROJECT
}

export interface ICreateProjectAction extends INewProjectAction {
  actions: any
  project: IProjectCreation
  type: NewProjectActionTypes.CREATE_PROJECT
}

export interface IResetNewProjectAction extends INewProjectAction {
  type: NewProjectActionTypes.RESET_NEW_PROJECT
}

export type NewProjectActions =
  ISetNewProjectAction
  | ICreateProjectAction
  | IResetNewProjectAction

export const setNewProjectAction = (project: IProjectCreation): ISetNewProjectAction => ({
  project,
  type: NewProjectActionTypes.SET_NEW_PROJECT,
})

export const createProjectAction = (project: IProjectCreation, actions: any): ICreateProjectAction => ({
  actions,
  project,
  type: NewProjectActionTypes.CREATE_PROJECT,
})

export const resetNewProjectAction = (): IResetNewProjectAction => ({
  type: NewProjectActionTypes.RESET_NEW_PROJECT,
})
