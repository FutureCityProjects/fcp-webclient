import { INumericIdentifierModel } from "api/schema"
import { EntityType } from "redux/reducer/data"
import {
  IEntityAction,
  ILoadCollectionSuccessAction,
  ILoadingSuccessAction,
  IModelAction,
  ISetLoadingAction,
} from "./actions"
import {
  IIndexedCollectionState,
  initialIndexedCollectionState,
  initialRequestState,
  IRequestState,
} from "./state"

export const scopedRequestReducer = (scope: string) => {
  const requestReducer =
    (state: IRequestState = initialRequestState, action: ISetLoadingAction | ILoadingSuccessAction) => {
      switch (action.type) {
        case "SET_LOADING_" + scope.toUpperCase():
          return {
            ...state,
            isLoading: (action as ISetLoadingAction).loading,
            loadingError: (action as ISetLoadingAction).error,
          }

        case "LOADING_" + scope.toUpperCase() + "_SUCCESS":
          return { ...state, isLoading: false, loadingError: null }

        default:
          return state
      }
    }

  return requestReducer
}

export function scopedObjectReducer<T extends INumericIdentifierModel>(entityType: EntityType) {
  const objectReducer = (
    state: IIndexedCollectionState<T> = initialIndexedCollectionState,
    action: IEntityAction,
  ) => {
    switch (action.type) {
      case `LOAD_${entityType.toUpperCase()}_SUCCESS`:
      // no break
      case `CREATE_${entityType.toUpperCase()}_SUCCESS`:
      // no break
      case `UPDATE_${entityType.toUpperCase()}_SUCCESS`:
        const singleModel = (action as IModelAction<T>).model
        return { ...state, [singleModel.id]: singleModel }

      case `DELETE_${entityType.toUpperCase()}_SUCCESS`:
        const deletedModel = (action as IModelAction<T>).model
        const reduced: IIndexedCollectionState<T> = {}
        Object.values(state).forEach((value) => {
          if (value.id === deletedModel.id) { return }
          reduced[value.id] = value
        })
        return reduced

      case `LOAD_${entityType.toUpperCase()}_COLLECTION_SUCCESS`:
        const newCollection: IIndexedCollectionState<T> = {}
        const data = (action as ILoadCollectionSuccessAction<T>).collection
        data["hydra:member"].forEach((element: T) => {
          newCollection[element.id] = element
        })
        return { ...state, ...newCollection }

      default:
        return state
    }
  }

  return objectReducer
}
