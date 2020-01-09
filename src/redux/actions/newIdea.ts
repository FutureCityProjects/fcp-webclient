import { IProject } from "api/schema"

export enum NewIdeaActionTypes {
  CREATE_IDEA = "CREATE_IDEA",
  SET_NEW_IDEA = "SET_NEW_IDEA",
  SET_IDEA_CREATED = "SET_IDEA_CREATED",
  RESET_NEW_IDEA = "RESET_NEW_IDEA",
}

export interface INewIdeaAction {
  type: NewIdeaActionTypes
}

export interface ISetNewIdeaAction extends INewIdeaAction {
  idea: IProject
  type: NewIdeaActionTypes.SET_NEW_IDEA
}

export interface ICreateIdeaAction extends INewIdeaAction {
  actions: any
  idea: IProject
  type: NewIdeaActionTypes.CREATE_IDEA
}

export interface ISetIdeaCreatedAction extends INewIdeaAction {
  type: NewIdeaActionTypes.SET_IDEA_CREATED
}

export interface IResetNewIdeaAction extends INewIdeaAction {
  type: NewIdeaActionTypes.RESET_NEW_IDEA
}

export type NewIdeaActions =
  ISetNewIdeaAction
  | ICreateIdeaAction
  | ISetIdeaCreatedAction
  | IResetNewIdeaAction

export const setNewIdeaAction = (idea: IProject): ISetNewIdeaAction => ({
  idea,
  type: NewIdeaActionTypes.SET_NEW_IDEA,
})

export const createIdeaAction = (idea: IProject, actions: any): ICreateIdeaAction => ({
  actions,
  idea,
  type: NewIdeaActionTypes.CREATE_IDEA,
})

export const setIdeaCreatedAction = (): ISetIdeaCreatedAction => ({
  type: NewIdeaActionTypes.SET_IDEA_CREATED,
})

export const resetNewIdeaAction = (): IResetNewIdeaAction => ({
  type: NewIdeaActionTypes.RESET_NEW_IDEA,
})
