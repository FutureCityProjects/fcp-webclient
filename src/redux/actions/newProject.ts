import { IProjectCreation } from "api/schema"

export enum NewProjectActionTypes {
  // don't use "CREATE_PROJECT", it collides with the general data acions
  CreateNewProject = "CREATE_NEW_PROJECT",

  SetNewProject = "SET_NEW_PROJECT",
  ResetNewProject = "RESET_NEW_PROJECT",
}

export interface INewProjectAction {
  type: NewProjectActionTypes
}

export interface ISetNewProjectAction extends INewProjectAction {
  project: IProjectCreation
  type: NewProjectActionTypes.SetNewProject
}

export interface ICreateProjectAction extends INewProjectAction {
  actions: any
  project: IProjectCreation
  type: NewProjectActionTypes.CreateNewProject
}

export interface IResetNewProjectAction extends INewProjectAction {
  type: NewProjectActionTypes.ResetNewProject
}

export type NewProjectActions =
  ISetNewProjectAction
  | ICreateProjectAction
  | IResetNewProjectAction

export const setNewProjectAction = (project: IProjectCreation): ISetNewProjectAction => ({
  project,
  type: NewProjectActionTypes.SetNewProject,
})

export const createProjectAction = (project: IProjectCreation, actions: Record<string, unknown>): ICreateProjectAction => ({
  actions,
  project,
  type: NewProjectActionTypes.CreateNewProject,
})

export const resetNewProjectAction = (): IResetNewProjectAction => ({
  type: NewProjectActionTypes.ResetNewProject,
})
