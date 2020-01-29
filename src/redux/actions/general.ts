export enum GeneralActionTypes {
  CLEAR_STORE = "CLEAR_STORE",
}

export const clearStoreAction = () => ({ type: GeneralActionTypes.CLEAR_STORE })
