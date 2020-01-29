export enum MyProjectsActionTypes {
  LOAD_MY_PROJECTS = "LOAD_MY_PROJECTS",
}

export interface IMyProjectsAction {
  type: MyProjectsActionTypes
}

export interface ILoadMyProjectsAction extends IMyProjectsAction {
  type: MyProjectsActionTypes.LOAD_MY_PROJECTS
}

export type MyProjectsActions = ILoadMyProjectsAction

export const loadMyProjectsAction = (): ILoadMyProjectsAction => ({
  type: MyProjectsActionTypes.LOAD_MY_PROJECTS,
})
