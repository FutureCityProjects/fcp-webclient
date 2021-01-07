import { IProjectMembership } from "api/schema"

export enum MemberApplicationActionTypes {
  CreateMemberApplication = "CREATE_MEMBER_APPLICATION",
  SetNewMemberApplication = "SET_NEW_MEMBER_APPLICATION",
  ResetNewMemberApplication = "RESET_NEW_MEMBER_APPLICATION",
}

export interface IMemberApplicationAction {
  type: MemberApplicationActionTypes
}

export interface ISetMemberApplicationAction extends IMemberApplicationAction {
  application: IProjectMembership
  type: MemberApplicationActionTypes.SetNewMemberApplication
}

export interface ICreateMemberApplicationAction extends IMemberApplicationAction {
  actions: any
  application: IProjectMembership
  type: MemberApplicationActionTypes.CreateMemberApplication
}

export interface IResetMemberApplicationAction extends IMemberApplicationAction {
  type: MemberApplicationActionTypes.ResetNewMemberApplication
}

export type MemberApplicationActions =
  ISetMemberApplicationAction
  | ICreateMemberApplicationAction
  | IResetMemberApplicationAction

export const setNewMemberApplicationAction = (application: IProjectMembership): ISetMemberApplicationAction => ({
  application,
  type: MemberApplicationActionTypes.SetNewMemberApplication,
})

export const createMemberApplicationAction = (application: IProjectMembership, actions: Record<string, unknown>): ICreateMemberApplicationAction => ({
  actions,
  application,
  type: MemberApplicationActionTypes.CreateMemberApplication,
})

export const resetMemberApplicationAction = (): IResetMemberApplicationAction => ({
  type: MemberApplicationActionTypes.ResetNewMemberApplication,
})
