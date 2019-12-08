import { MakeStoreOptions } from "next-redux-wrapper"
import { applyMiddleware, createStore, Store } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import createSagaMiddleware, { Task } from "redux-saga"
import { refreshTokenAction } from "./actions/auth"
import { sagaStarted } from "./actions/saga"
import rootReducer from "./reducer"
import rootSaga from "./saga"

export type AppState = ReturnType<typeof rootReducer>

export type SagaStore = Store<AppState> & {
  sagaTask?: Task;
}

/**
 * Creates a new Redux store, used by next-redux-wrapper,
 * transfer of state from server to client is handled automatically
 */
export const makeStore = (initialState: AppState, options: MakeStoreOptions): SagaStore => {
  // Recreate the stdChannel (saga middleware) with every context.
  const sagaMiddleware = createSagaMiddleware()

  const enhancer = process.env.NODE_ENV === "production"
    ? applyMiddleware(sagaMiddleware)
    : composeWithDevTools(applyMiddleware(sagaMiddleware))

  const store: SagaStore = createStore(rootReducer, initialState, enhancer)

  /**
   * next-redux-saga depends on `sagaTask` being attached to the store.
   * It is used to await the rootSaga task before sending results to the client.
   * However it should run only once - which must be regarded when using `next-redux-wrapper:^2.1.0`
   */
  if (!options.isServer || !store.getState().saga.ran) {
    store.dispatch(sagaStarted())
    store.sagaTask = sagaMiddleware.run(rootSaga)
  }

  // @todo move to __app.js, there is already other auth related stuff
  if (!options.isServer) {
    // on client only: start token refresh mechanism to refresh an
    // existing token (from server, without login), auto-exits if
    // no token exists
    store.dispatch(refreshTokenAction())
  }

  return store
}
