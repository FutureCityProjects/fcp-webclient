import { render } from "@testing-library/react"
import React from "react"
import { Provider } from "react-redux"
import { createStore } from "redux"

import rootReducer, { AppState } from "../src/redux/reducer"
import { SagaStore } from "../src/redux/store"

export const getInitialState = (): AppState => rootReducer(undefined, { type: null })

export function renderWithRedux(ui: React.ReactNode, initialState?: AppState, store?: SagaStore) {
  if (!store) {
    if (!initialState) {
      initialState = getInitialState()
    }
    store = createStore(rootReducer, initialState)
  }

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}
