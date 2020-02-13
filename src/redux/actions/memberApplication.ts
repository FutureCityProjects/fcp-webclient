import { IProjectMembership } from "api/schema"

export enum MemberApplicationActionTypes {
  CREATE_MEMBER_APPLICATION = "CREATE_MEMBER_APPLICATION",
  SET_NEW_MEMBER_APPLICATION = "SET_NEW_MEMBER_APPLICATION",
  RESET_NEW_MEMBER_APPLICATION = "RESET_NEW_MEMBER_APPLICATION",
}

export interface IMemberApplicationAction {
  type: MemberApplicationActionTypes
}

export interface ISetMemberApplicationAction extends IMemberApplicationAction {
  application: IProjectMembership
  type: MemberApplicationActionTypes.SET_NEW_MEMBER_APPLICATION
}

export interface ICreateMemberApplicationAction extends IMemberApplicationAction {
  actions: any
  application: IProjectMembership
  type: MemberApplicationActionTypes.CREATE_MEMBER_APPLICATION
}

export interface IResetMemberApplicationAction extends IMemberApplicationAction {
  type: MemberApplicationActionTypes.RESET_NEW_MEMBER_APPLICATION
}

export type MemberApplicationActions =
  ISetMemberApplicationAction
  | ICreateMemberApplicationAction
  | IResetMemberApplicationAction

export const setNewMemberApplicationAction = (application: IProjectMembership): ISetMemberApplicationAction => ({
  application,
  type: MemberApplicationActionTypes.SET_NEW_MEMBER_APPLICATION,
})

export const createMemberApplicationAction = (application: IProjectMembership, actions: any): ICreateMemberApplicationAction => ({
  actions,
  application,
  type: MemberApplicationActionTypes.CREATE_MEMBER_APPLICATION,
})

export const resetMemberApplicationAction = (): IResetMemberApplicationAction => ({
  type: MemberApplicationActionTypes.RESET_NEW_MEMBER_APPLICATION,
})
