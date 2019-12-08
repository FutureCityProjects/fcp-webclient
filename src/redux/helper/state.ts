import { IHydraCollection } from "api/schema"

// abstraction for staste that represents a single object received from the API
export interface IModelState<T> {
  model?: T,
  isLoading: boolean,
  loadingError: string,
}
export const initialModelState: IModelState<any> = {
  isLoading: false,
  loadingError: null,
  model: null,
}

// abstraction for state that represents a list of objects received from the API
export interface ICollectionState<T> {
  collection?: IHydraCollection<T>,
  isLoading: boolean,
  loadingError: string,
}
export const initialCollectionState: ICollectionState<any> = {
  collection: null,
  isLoading: false,
  loadingError: null,
}

// describes the data we receive with the authorization token
// used as action payloed and saved in the redux store
export interface IWebToken {
  encoded: string
  expiresAt: number
  roles: string[]
  username: string
}
