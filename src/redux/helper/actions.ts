import { IHydraCollection } from "api/schema"
import { Action } from "redux"

export interface IScopeAction extends Action {
  scope: string
  type: string
}

export interface ISetLoadingAction extends IScopeAction {
  error: string
  loading: boolean
}

export const setLoadingAction = (scope: string, loading: boolean, error: string = null): ISetLoadingAction => {
  return {
    error,
    loading,
    scope,
    type: `SET_LOADING_${scope.toUpperCase()}`,
  }
}

export interface IFilterCriteria {
  [property: string]: any
}

export interface ILoadByAction extends IScopeAction {
  criteria: IFilterCriteria,
}

export const loadModelAction = (scope: string, criteria: IFilterCriteria): ILoadByAction => {
  return {
    criteria,
    scope,
    type: `LOAD_${scope.toUpperCase()}`,
  }
}

export const loadCollectionAction = (scope: string, criteria: IFilterCriteria): ILoadByAction => {
  return {
    criteria,
    scope,
    type: `LOAD_${scope.toUpperCase()}_COLLECTION`,
  }
}

export interface IModelAction<T> extends IScopeAction {
  model: T,
}

export const loadModelSuccessAction = (scope: string, model: any): IModelAction<any> => {
  return {
    model,
    scope,
    type: `LOAD_${scope.toUpperCase()}_SUCCESS`,
  }
}

export interface IModelFormAction<T> extends IModelAction<T> {
  actions: any
}

export const createModelAction = (scope: string, model: any, actions: any): IModelFormAction<any> => {
  return {
    actions,
    model,
    scope,
    type: `CREATE_${scope.toUpperCase()}`,
  }
}

export const createModelSuccessAction = (scope: string, model: any): IModelAction<any> => {
  return {
    model,
    scope,
    type: `CREATE_${scope.toUpperCase()}_SUCCESS`,
  }
}

export const updateModelAction = (scope: string, model: any, actions: any): IModelFormAction<any> => {
  return {
    actions,
    model,
    scope,
    type: `UPDATE_${scope.toUpperCase()}`,
  }
}

export const updateModelSuccessAction = (scope: string, model: any): IModelAction<any> => {
  return {
    model,
    scope,
    type: `UPDATE_${scope.toUpperCase()}_SUCCESS`,
  }
}

export const deleteModelAction = (scope: string, model: any, actions: any): IModelFormAction<any> => {
  return {
    actions,
    model,
    scope,
    type: `DELETE_${scope.toUpperCase()}`,
  }
}

export const deleteModelSuccessAction = (scope: string, model: any): IModelAction<any> => {
  return {
    model,
    scope,
    type: `DELETE_${scope.toUpperCase()}_SUCCESS`,
  }
}

export interface ILoadCollectionSuccessAction<T> extends IScopeAction {
  collection: IHydraCollection<T>,
}

export const loadCollectionSuccessAction =
  (scope: string, collection: IHydraCollection<any>): ILoadCollectionSuccessAction<any> => {
    return {
      collection,
      scope,
      type: `LOAD_${scope.toUpperCase()}_COLLECTION_SUCCESS`,
    }
  }
