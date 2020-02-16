import { IHydraCollection } from "api/schema"
import { Action } from "redux"
import { EntityType } from "redux/reducer/data"

export interface IScopeAction extends Action {
  scope: string
  type: string
}

export interface ISetLoadingAction extends IScopeAction {
  error: string
  loading: boolean
}

export interface ILoadingSuccessAction extends IScopeAction {
  result: any
}

export const setLoadingAction =
  (scope: string, loading: boolean, error: string = null): ISetLoadingAction => ({
    error,
    loading,
    scope,
    type: `SET_LOADING_${scope.toUpperCase()}`,
  })

export const loadingSuccessAction =
  (scope: string, result: any): ILoadingSuccessAction => ({
    result,
    scope,
    type: `LOADING_${scope.toUpperCase()}_SUCCESS`,
  })

export interface IFilterCriteria {
  [property: string]: any
}

export interface IEntityAction extends IScopeAction {
  entityType: EntityType
}

export interface ILoadByAction extends IEntityAction {
  criteria: IFilterCriteria,
}

export interface IModelAction<T> extends IEntityAction {
  model: T,
}

export interface IModelFormAction<T> extends IModelAction<T> {
  actions: any
}

export interface ILoadCollectionSuccessAction<T> extends IEntityAction {
  collection: IHydraCollection<T>,
}

export const loadModelAction =
  (entityType: EntityType, criteria: IFilterCriteria, scope?: string): ILoadByAction => ({
    criteria,
    entityType,
    scope,
    type: "LOAD_" + entityType.toUpperCase(),
  })

export const loadCollectionAction =
  (entityType: EntityType, criteria: IFilterCriteria = {}, scope?: string): ILoadByAction => ({
    criteria,
    entityType,
    scope,
    type: "LOAD_" + entityType.toUpperCase() + "_COLLECTION",
  })

export const loadCollectionSuccessAction =
  (entityType: EntityType, collection: IHydraCollection<any>, scope?: string): ILoadCollectionSuccessAction<any> => ({
    collection,
    entityType,
    scope,
    type: "LOAD_" + entityType.toUpperCase() + "_COLLECTION_SUCCESS",
  })

export const loadModelSuccessAction =
  (entityType: EntityType, model: any, scope?: string): IModelAction<any> => ({
    entityType,
    model,
    scope,
    type: "LOAD_" + entityType.toUpperCase() + "_SUCCESS",
  })

export const createModelAction =
  (entityType: EntityType, model: any, actions: any, scope?: string): IModelFormAction<any> => ({
    actions,
    entityType,
    model,
    scope,
    type: "CREATE_" + entityType.toUpperCase(),
  })

export const createModelSuccessAction =
  (entityType: EntityType, model: any, scope?: string): IModelAction<any> => ({
    entityType,
    model,
    scope,
    type: "CREATE_" + entityType.toUpperCase() + "_SUCCESS",
  })

export const updateModelAction =
  (entityType: EntityType, model: any, actions: any, scope?: string): IModelFormAction<any> => ({
    actions,
    entityType,
    model,
    scope,
    type: "UPDATE_" + entityType.toUpperCase(),
  })

export const updateModelSuccessAction =
  (entityType: EntityType, model: any, scope?: string): IModelAction<any> => ({
    entityType,
    model,
    scope,
    type: "UPDATE_" + entityType.toUpperCase() + "_SUCCESS",
  })

export const deleteModelAction =
  (entityType: EntityType, model: any, actions?: any, scope?: string): IModelFormAction<any> => ({
    actions: actions || {},
    entityType,
    model,
    scope,
    type: "DELETE_" + entityType.toUpperCase(),
  })

export const deleteModelSuccessAction =
  (entityType: EntityType, model: any, scope?: string): IModelAction<any> => ({
    entityType,
    model,
    scope,
    type: "DELETE_" + entityType.toUpperCase() + "_SUCCESS",
  })
