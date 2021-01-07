import { IProject } from "api/schema"

export enum NewIdeaActionTypes {
  CreateIdea = "CREATE_IDEA",
  SetNewIdea = "SET_NEW_IDEA",
  ResetNewIdea = "RESET_NEW_IDEA",
}

export interface INewIdeaAction {
  type: NewIdeaActionTypes
}

export interface ISetNewIdeaAction extends INewIdeaAction {
  idea: IProject
  type: NewIdeaActionTypes.SetNewIdea
}

export interface ICreateIdeaAction extends INewIdeaAction {
  actions: any
  idea: IProject
  type: NewIdeaActionTypes.CreateIdea
}

export interface IResetNewIdeaAction extends INewIdeaAction {
  type: NewIdeaActionTypes.ResetNewIdea
}

export type NewIdeaActions =
  ISetNewIdeaAction
  | ICreateIdeaAction
  | IResetNewIdeaAction

export const setNewIdeaAction = (idea: IProject): ISetNewIdeaAction => ({
  idea,
  type: NewIdeaActionTypes.SetNewIdea,
})

export const createIdeaAction = (idea: IProject, actions: Record<string, unknown>): ICreateIdeaAction => ({
  actions,
  idea,
  type: NewIdeaActionTypes.CreateIdea,
})

export const resetNewIdeaAction = (): IResetNewIdeaAction => ({
  type: NewIdeaActionTypes.ResetNewIdea,
})
