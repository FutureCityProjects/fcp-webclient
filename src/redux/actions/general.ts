import { Action } from "redux"

export enum GeneralActionTypes {
  ClearStore = "CLEAR_STORE",
}

export const clearStoreAction = (): Action => ({ type: GeneralActionTypes.ClearStore })
