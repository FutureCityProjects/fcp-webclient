import { INumericIdentifierModel } from "api/schema"
import {
  ILoadCollectionSuccessAction,
  IModelAction,
  IScopeAction,
  ISetLoadingAction,
} from "./actions"
import {
  IIndexedCollectionState,
  initialIndexedCollectionState,
  initialRequestState,
  IRequestState,
} from "./state"

export const scopedSetLoadingReducer = (scope: string) => {
  const setLoadingReducer = (state: IRequestState = initialRequestState, action: ISetLoadingAction) => {
    switch (action.type) {
      case "SET_LOADING_" + scope.toUpperCase():
        return { ...state, isLoading: action.loading, loadingError: action.error }

      default:
        return state
    }
  }

  return setLoadingReducer
}

export function scopedObjectReducer<T extends INumericIdentifierModel>(scope: string) {
  const objectReducer = (
    state: IIndexedCollectionState<T> = initialIndexedCollectionState,
    action: IScopeAction,
  ) => {
    switch (action.type) {
      case `LOAD_${scope.toUpperCase()}_SUCCESS`:
      // no break
      case `CREATE_${scope.toUpperCase()}_SUCCESS`:
      // no break
      case `UPDATE_${scope.toUpperCase()}_SUCCESS`:
        const singleModel = (action as IModelAction<T>).model
        return { ...state, [singleModel.id]: singleModel }

      case `DELETE_${scope.toUpperCase()}_SUCCESS`:
        const deletedModel = (action as IModelAction<T>).model
        const reduced: IIndexedCollectionState<T> = {}
        Object.values(state).forEach((value) => {
          if (value.id === deletedModel.id) { return }
          reduced[value.id] = value
        })
        return reduced

      case `LOAD_${scope.toUpperCase()}_COLLECTION_SUCCESS`:
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
