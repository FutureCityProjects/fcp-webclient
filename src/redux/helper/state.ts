import { INumericIdentifierModel } from "api/schema"

export interface IRequestState {
  isLoading: boolean,
  loadingError: string,
}
export const initialRequestState: IRequestState = {
  isLoading: false,
  loadingError: null,
}

export interface IIndexedCollectionState<T extends INumericIdentifierModel> {
  [id: number]: T
}
export const initialIndexedCollectionState: IIndexedCollectionState<any> = {}

// describes the data we receive with the authorization token
// used as action payloed and saved in the redux store
export interface IWebToken {
  encoded: string
  expiresAt: number
  id: number
  roles: string[]
  username: string
}
