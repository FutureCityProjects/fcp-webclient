import { IFundApplication } from "api/schema"

export enum MyProjectsActionTypes {
  LoadMyProjects = "LOAD_MY_PROJECTS",
  SubmitApplication = "SUBMIT_APPLICATION",
}

export interface IMyProjectsAction {
  type: MyProjectsActionTypes
}

export interface ILoadMyProjectsAction extends IMyProjectsAction {
  type: MyProjectsActionTypes.LoadMyProjects
}

export interface ISubmitFundApplicationAction extends IMyProjectsAction {
  actions: any
  application: IFundApplication
  type: MyProjectsActionTypes.SubmitApplication
}

export type MyProjectsActions = ILoadMyProjectsAction | ISubmitFundApplicationAction

export const loadMyProjectsAction = (): ILoadMyProjectsAction => ({
  type: MyProjectsActionTypes.LoadMyProjects,
})

export const submitFundApplicationAction = (application: IFundApplication, actions: Record<string, unknown>): ISubmitFundApplicationAction => ({
  actions,
  application,
  type: MyProjectsActionTypes.SubmitApplication,
})