# Redux

## Redux helpers

The redux helpers (in /src/redux/helper) try to generalize recurring use cases for loading data
from the API.

### State
* IIndexedCollectionState represents a list of entities (received from the API), indexed by their
  ID. All elements received should be stored in one central collection for their corresponding
  type.
* IRequestState represents state regarding the API request for a concrete use case, e.g. the
  request for the registration of a user. There could be multiple use cases (e.g. different pages)
  where API requests for entities of the same type are made which would still need separate
  request tracking

### Actions
* ISetLoadingAction (created by `setLoadingAction`) is used to set the IRequestState for a
  specific use case, the `scope` parameter is used for differentiating.
* ILoadByAction is used to request a single entity (via `loadModelAction`) or a collection (via 
  `loadCollectionAction`) from the API. The first parameter _modelScope_ determines which type 
  should be requested, the second _requestScope_ again differentiates the use case for request
  tracking
* `loadModelSuccessAction` and `loadCollectionSuccessAction` are used to update the 
  IIndexedCollectionState of the type corresponding _scope_ parameter
* `createModelSuccessAction`, `updateModelSuccessAction`, `deleteModelSuccessAction` also update
  the IIndexedCollectionState for a single entity
* ILoadingSuccessAction (via `loadingSuccessAction`) is used to notify the calling use case
  identified by his _scope_ of the received entity/collection and also to reset the IRequestState
  for this use case

### Reducers
* `scopedRequestReducer` creates a reducer that handles the request state for a use case, 
  identified by its _scope_ by listening to ISetLoadingAction and ILoadingSuccessAction
* `scopedObjectReducer` tracks entities received from the API in a IIndexedCollectionState by
  listening to the `loadModelSuccessAction`, `loadCollectionSuccessAction`, 
  `createModelSuccessAction`, `updateModelSuccessAction` and `deleteModelSuccessAction`.

### Usage
* in _/src/redux/reducer/data.ts_ one reducer for each entity type is created by using
  `scopedObjectReducer` and `combineReducers` for storing all entities from the API in the
  redux state
* each use case, like user registration in _/src/redux/reducer/registration.ts_, tracks his own
  request state by using `scopedRequestReducer` and additional required state, e.g. by tracking the id of the created user (or multiple IDs like _/src/redux/reducer/marketplace.ts_) that 
  references the object(s) in the central storage

### Example
* _/pages/marketplace/index.tsx_ triggers `loadMarketplaceAction` which is transformed by
  _/src/redux/saga/marketplace.ts_ to an ILoadByAction with a _modelScope_ of "project" and a
  _requestScope_ of "marketplace" and a resulting _action.type_ of "LOAD_PROJECT_COLLECTION"
* _/src/redux/saga/projects.ts_ listens to "LOAD_PROJECT_COLLECTION" and uses `setLoadingAction`
  to set the IRequestState for "marketplace" (defined in _/src/redux/reducer/marketplace.ts_) to
  "currently loading"
* when the collection is received from the API the saga triggers `loadCollectionSuccessAction`
  with the _scope_ "project" to notify the central data.projects reducer to store the collection
* then it triggers `loadingSuccessAction` with the _scope_ "marketplace" to a) reset the request
  state and also b) allow the reducer defined in _/src/redux/reducer/marketplace.ts_ to track 
  which of all projects in the central collection are for display in the marketplace page by storing their IDs