import {
  createModelAction,
  createModelSuccessAction,
  deleteModelAction,
  deleteModelSuccessAction,
  loadCollectionAction,
  loadCollectionSuccessAction,
  loadModelAction,
  loadModelSuccessAction,
  setLoadingAction,
  updateModelAction,
  updateModelSuccessAction,
} from "redux/helper/actions"
import { Scope } from "redux/reducer/data"

describe("setLoadingAction", () => {
  it("creates an action", () => {
    const action = setLoadingAction("user", true, "failure")
    expect(action.error).toBe("failure")
    expect(action.loading).toBeTruthy()
    expect(action.scope).toBe("user")
    expect(action.type).toBe("SET_LOADING_USER")
  })

  it("uses empty error message if none provided", () => {
    const action = setLoadingAction("user", false)
    expect(action.type).toBe("SET_LOADING_USER")
    expect(action.loading).toBeFalsy()
    expect(action.error).toBeNull()
  })
})

describe("loadCollectionAction", () => {
  it("creates an action", () => {
    const action = loadCollectionAction(Scope.USER, "current_user", { id: 12 })
    expect(action.type).toBe("LOAD_USER_COLLECTION")
    expect(action.criteria).toStrictEqual({ id: 12 })
    expect(action.scope).toBe("current_user")
  })
})

describe("loadCollectionSuccessAction", () => {
  it("creates an action", () => {
    const action = loadCollectionSuccessAction("user", { "@context": "user" })
    expect(action.type).toBe("LOAD_USER_COLLECTION_SUCCESS")
    expect(action.collection).toStrictEqual({ "@context": "user" })
    expect(action.scope).toBe("user")
  })
})

describe("loadModelAction", () => {
  it("creates an action", () => {
    const action = loadModelAction(Scope.USER, "current_user", { id: 12 })
    expect(action.type).toBe("LOAD_USER")
    expect(action.criteria).toStrictEqual({ id: 12 })
    expect(action.scope).toBe("current_user")
  })
})

describe("loadModelSuccessAction", () => {
  it("creates an action", () => {
    const action = loadModelSuccessAction("user", { id: 12 })
    expect(action.type).toBe("LOAD_USER_SUCCESS")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.scope).toBe("user")
  })
})

describe("createModelAction", () => {
  it("creates an action", () => {
    const action = createModelAction(Scope.USER, "current_user", { id: 12 }, { success: true })
    expect(action.type).toBe("CREATE_USER")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.actions).toStrictEqual({ success: true })
    expect(action.scope).toBe("current_user")
  })
})

describe("createModelSuccessAction", () => {
  it("creates an action", () => {
    const action = createModelSuccessAction("user", { id: 12 })
    expect(action.type).toBe("CREATE_USER_SUCCESS")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.scope).toBe("user")
  })
})

describe("updateModelAction", () => {
  it("creates an action", () => {
    const action = updateModelAction(Scope.USER, "current_user", { id: 12 }, { success: true })
    expect(action.type).toBe("UPDATE_USER")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.actions).toStrictEqual({ success: true })
    expect(action.scope).toBe("current_user")
  })
})

describe("updateModelSuccessAction", () => {
  it("creates an action", () => {
    const action = updateModelSuccessAction("user", { id: 12 })
    expect(action.type).toBe("UPDATE_USER_SUCCESS")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.scope).toBe("user")
  })
})

describe("deleteModelAction", () => {
  it("creates an action", () => {
    const action = deleteModelAction(Scope.USER, "current_user", { id: 12 }, { success: true })
    expect(action.type).toBe("DELETE_USER")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.actions).toStrictEqual({ success: true })
    expect(action.scope).toBe("current_user")
  })
})

describe("deleteModelSuccessAction", () => {
  it("creates an action", () => {
    const action = deleteModelSuccessAction("user", { id: 12 })
    expect(action.type).toBe("DELETE_USER_SUCCESS")
    expect(action.model).toStrictEqual({ id: 12 })
    expect(action.scope).toBe("user")
  })
})
