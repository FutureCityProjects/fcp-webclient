import { IProcess } from "api/schema"

export enum ProcessActionTypes {
  CREATE_PROCESS = "CREATE_PROCESS",
  UPDATE_PROCESS = "UPDATE_PROCESS",

  LOAD_CURRENT_PROCESS = "LOAD_CURRENT_PROCESS",
  LOAD_CURRENT_PROCESS_SUCCESS = "LOAD_CURRENT_PROCESS_SUCCESS",
  LOAD_CURRENT_PROCESS_FAILED = "LOAD_CURRENT_PROCESS_FAILED",

  LOAD_PROCESS_BY_ID = "LOAD_PROCESS_BY_ID",
  LOAD_PROCESS_BY_SLUG = "LOAD_PROCESS_BY_SLUG",
  LOAD_PROCESS_SUCCESS = "LOAD_PROCESS_SUCCESS",
  LOAD_PROCESS_FAILED = "LOAD_PROCESS_FAILED",
}

export interface IProcessAction {
  type: ProcessActionTypes
}

export interface ICreateProcessAction extends IProcessAction {
  actions: any
  process: IProcess
  type: ProcessActionTypes.CREATE_PROCESS
}

export interface IUpdateProcessAction extends IProcessAction {
  actions: any
  process: IProcess
  type: ProcessActionTypes.UPDATE_PROCESS
}

export interface ILoadCurrentProcessAction extends IProcessAction {
  reject?: any
  resolve?: any
  type: ProcessActionTypes.LOAD_CURRENT_PROCESS
}

export interface ILoadCurrentProcessSuccessAction extends IProcessAction {
  type: ProcessActionTypes.LOAD_CURRENT_PROCESS_SUCCESS
  process: IProcess
}

export interface ILoadCurrentProcessFailedAction extends IProcessAction {
  type: ProcessActionTypes.LOAD_CURRENT_PROCESS_FAILED
  error: string
}

export interface ILoadProcessByIdAction extends IProcessAction {
  id: number
  type: ProcessActionTypes.LOAD_PROCESS_BY_ID
}

export interface ILoadProcessBySlugAction extends IProcessAction {
  slug: string
  type: ProcessActionTypes.LOAD_PROCESS_BY_SLUG
}

export interface ILoadProcessSuccessAction extends IProcessAction {
  type: ProcessActionTypes.LOAD_PROCESS_SUCCESS
  process: IProcess
}

export interface ILoadProcessFailedAction extends IProcessAction {
  type: ProcessActionTypes.LOAD_PROCESS_FAILED
  error: string
}

export type ProcessActions =
  ICreateProcessAction
  | IUpdateProcessAction
  | ILoadCurrentProcessAction
  | ILoadCurrentProcessSuccessAction
  | ILoadCurrentProcessFailedAction
  | ILoadProcessByIdAction
  | ILoadProcessBySlugAction
  | ILoadProcessSuccessAction
  | ILoadProcessFailedAction

export const createProcessAction =
  ({ process, actions }: { process: IProcess, actions: any }): ICreateProcessAction => ({
    actions,
    process,
    type: ProcessActionTypes.CREATE_PROCESS,
  })

export const updateProcessAction =
  ({ process, actions }: { process: IProcess, actions: any }): IUpdateProcessAction => ({
    actions,
    process,
    type: ProcessActionTypes.UPDATE_PROCESS,
  })

export const loadCurrentProcessAction =
  (promise: { resolve: any, reject: any } = null): ILoadCurrentProcessAction => ({
    reject: promise ? promise.reject : null,
    resolve: promise ? promise.resolve : null,
    type: ProcessActionTypes.LOAD_CURRENT_PROCESS,
  })

export const loadCurrentProcessSuccessAction = (process: IProcess): ILoadCurrentProcessSuccessAction => ({
  process,
  type: ProcessActionTypes.LOAD_CURRENT_PROCESS_SUCCESS,
})

export const loadCurrentProcessFailedAction = (error: string): ILoadCurrentProcessFailedAction => ({
  error,
  type: ProcessActionTypes.LOAD_CURRENT_PROCESS_FAILED,
})

export const loadProcessByIdAction = (id: number): ILoadProcessByIdAction => ({
  id,
  type: ProcessActionTypes.LOAD_PROCESS_BY_ID,
})

export const loadProcessBySlugAction = (slug: string): ILoadProcessBySlugAction => ({
  slug,
  type: ProcessActionTypes.LOAD_PROCESS_BY_SLUG,
})

export const loadProcessSuccessAction = (process: IProcess): ILoadProcessSuccessAction => ({
  process,
  type: ProcessActionTypes.LOAD_PROCESS_SUCCESS,
})

export const loadProcessFailedAction = (error: string): ILoadProcessFailedAction => ({
  error,
  type: ProcessActionTypes.LOAD_PROCESS_FAILED,
})
