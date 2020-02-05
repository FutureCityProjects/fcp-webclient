import { IFundApplication } from "api/schema"

export enum MyProjectsActionTypes {
  LOAD_MY_PROJECTS = "LOAD_MY_PROJECTS",
  SUBMIT_APPLICATION = "SUBMIT_APPLICATION",
}

export interface IMyProjectsAction {
  type: MyProjectsActionTypes
}

export interface ILoadMyProjectsAction extends IMyProjectsAction {
  type: MyProjectsActionTypes.LOAD_MY_PROJECTS
}

export interface ISubmitFundApplicationAction extends IMyProjectsAction {
  actions: any
  application: IFundApplication
  type: MyProjectsActionTypes.SUBMIT_APPLICATION
}

export type MyProjectsActions = ILoadMyProjectsAction | ISubmitFundApplicationAction

export const loadMyProjectsAction = (): ILoadMyProjectsAction => ({
  type: MyProjectsActionTypes.LOAD_MY_PROJECTS,
})

export const submitFundApplicationAction = (application: IFundApplication, actions: any): ISubmitFundApplicationAction => ({
  actions,
  application,
  type: MyProjectsActionTypes.SUBMIT_APPLICATION,
})