import { IEntityAction, ILoadCollectionSuccessAction, IModelAction, ISetLoadingAction } from "redux/helper/actions"
import { scopedObjectReducer, scopedRequestReducer } from "redux/helper/reducers"
import { initialIndexedCollectionState, initialRequestState } from "redux/helper/state"
import { EntityType } from "redux/reducer/data"

describe("scopedSetLoadingReducer", () => {
  it("returns a function", () => {
    const reducer = scopedRequestReducer("user")
    expect(typeof reducer).toBe("function")
  })

  it("returns the given state as default", () => {
    const action: ISetLoadingAction = { error: null, loading: false, scope: "user", type: "unknown" }
    const reducer = scopedRequestReducer("user")
    const state = reducer(initialRequestState, action)
    expect(state).toStrictEqual(initialRequestState)
  })

  it("updates the state", () => {
    const action: ISetLoadingAction = { error: "failed", loading: true, scope: "user", type: "SET_LOADING_USER" }
    const reducer = scopedRequestReducer("user")
    const state = reducer(initialRequestState, action)
    expect(state).toStrictEqual({ loadingError: "failed", isLoading: true })
  })
})

describe("scopedObjectReducer", () => {
  it("returns a function", () => {
    const reducer = scopedObjectReducer(EntityType.USER)
    expect(typeof reducer).toBe("function")
  })

  it("returns the given state as default", () => {
    const action: IEntityAction = { entityType: EntityType.USER, scope: "user", type: "unknown" }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer(initialIndexedCollectionState, action)
    expect(state).toStrictEqual(initialIndexedCollectionState)
  })

  it("handles LOAD_SUCCESS", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "LOAD_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer(initialIndexedCollectionState, action)
    expect(state).toStrictEqual({ 12: { id: 12 } })
  })

  it("adds LOAD_SUCCESS model to existing collection", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "LOAD_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 7: { id: 7 } }, action)
    expect(state).toStrictEqual({
      7: { id: 7 },
      12: { id: 12 },
    })
  })

  it("replaces existing model on LOAD_SUCCESS", () => {
    const action: IModelAction<any> = {
      entityType: EntityType.USER,
      model: {
        id: 12,
        name: "new",
      },
      scope: "user",
      type: "LOAD_USER_SUCCESS",
    }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 12: { id: 12, name: "old" } }, action)
    expect(state).toStrictEqual({ 12: { id: 12, name: "new" } })
  })

  it("handles LOAD_COLLECTION_SUCCESS", () => {
    const action: ILoadCollectionSuccessAction<any> = {
      entityType: EntityType.USER,
      collection: {
        "hydra:member": [
          {
            id: 12,
          },
        ],
      },
      scope: "user",
      type: "LOAD_USER_COLLECTION_SUCCESS",
    }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer(initialIndexedCollectionState, action)
    expect(state).toStrictEqual({ 12: { id: 12 } })
  })

  it("adds LOAD_COLLECTION_SUCCESS models to existing collection", () => {
    const action: ILoadCollectionSuccessAction<any> = {
      entityType: EntityType.USER,
      collection: {
        "hydra:member": [
          {
            id: 12,
          },
          {
            id: 99,
          },
        ],
      },
      scope: "user",
      type: "LOAD_USER_COLLECTION_SUCCESS",
    }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 7: { id: 7 } }, action)
    expect(state).toStrictEqual({
      7: { id: 7 },
      12: { id: 12 },
      99: { id: 99 },
    })
  })

  it("replaces existing model on LOAD_COLLECTION_SUCCESS", () => {
    const action: ILoadCollectionSuccessAction<any> = {
      entityType: EntityType.USER,
      collection: {
        "hydra:member": [
          {
            id: 12,
            name: "new",
          },
        ],
      },
      scope: "user",
      type: "LOAD_USER_COLLECTION_SUCCESS",
    }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({
      7: { id: 7, name: "test" },
      12: { id: 12, name: "old" },
    }, action)
    expect(state).toStrictEqual({
      7: { id: 7, name: "test" },
      12: { id: 12, name: "new" },
    })
  })

  it("handles CREATE_SUCCESS", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "CREATE_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer(initialIndexedCollectionState, action)
    expect(state).toStrictEqual({ 12: { id: 12 } })
  })

  it("adds CREATE_SUCCESS model to existing collection", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "CREATE_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 7: { id: 7 } }, action)
    expect(state).toStrictEqual({
      7: { id: 7 },
      12: { id: 12 },
    })
  })

  it("replaces existing model on CREATE_SUCCESS", () => {
    const action: IModelAction<any> = {
      entityType: EntityType.USER,
      model: {
        id: 12,
        name: "new",
      },
      scope: "user",
      type: "CREATE_USER_SUCCESS",
    }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 12: { id: 12, name: "old" } }, action)
    expect(state).toStrictEqual({ 12: { id: 12, name: "new" } })
  })

  it("handles UPDATE_SUCCESS", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "UPDATE_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer(initialIndexedCollectionState, action)
    expect(state).toStrictEqual({ 12: { id: 12 } })
  })

  it("adds UPDATE_SUCCESS model to existing collection if not found", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "UPDATE_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 7: { id: 7 } }, action)
    expect(state).toStrictEqual({
      7: { id: 7 },
      12: { id: 12 },
    })
  })

  it("replaces existing model on UPDATE_SUCCESS", () => {
    const action: IModelAction<any> = {
      entityType: EntityType.USER,
      model: {
        id: 12,
        name: "new",
      },
      scope: "user",
      type: "UPDATE_USER_SUCCESS",
    }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({ 12: { id: 12, name: "old" } }, action)
    expect(state).toStrictEqual({ 12: { id: 12, name: "new" } })
  })

  it("handles DELETE_SUCCESS", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "DELETE_USER_SUCCESS", model: { id: 12 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({
      7: { id: 7 },
      12: { id: 12 },
    }, action)
    expect(state).toStrictEqual({ 7: { id: 7 } })
  })

  it("ignores missing model on DELETE_SUCCESS", () => {
    const action: IModelAction<any> = { entityType: EntityType.USER, scope: "user", type: "DELETE_USER_SUCCESS", model: { id: 99 } }
    const reducer = scopedObjectReducer(EntityType.USER)
    const state = reducer({
      7: { id: 7 },
      12: { id: 12 },
    }, action)
    expect(state).toStrictEqual({
      7: { id: 7 },
      12: { id: 12 },
    })
  })
})
