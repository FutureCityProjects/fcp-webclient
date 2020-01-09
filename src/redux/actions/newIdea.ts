import { IProject } from "api/schema"

export enum NewIdeaActionTypes {
  CREATE_IDEA = "CREATE_IDEA",
  SET_NEW_IDEA = "SET_NEW_IDEA",
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

export interface IResetNewIdeaAction extends INewIdeaAction {
  type: NewIdeaActionTypes.RESET_NEW_IDEA
}

export type NewIdeaActions =
  ISetNewIdeaAction
  | ICreateIdeaAction
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

export const resetNewIdeaAction = (): IResetNewIdeaAction => ({
  type: NewIdeaActionTypes.RESET_NEW_IDEA,
})
