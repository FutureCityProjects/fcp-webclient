import { combineReducers } from "redux"
import { scopedRequestReducer } from "redux/helper/reducers"

/**
 * Instead of creating a requestReducer for each single use case
 * (like confirm_validation, user_registration, user_management, ...)
 * we create default request reducers/state here: up to three for each entity type including
 * one for fetching a single entity, one for fetching a collection and one for an create/update/delete
 * operation.
 * This should be sufficent also for complex cases, e.g. that need to load a single project,
 * a list of funds and create a fundApplication
 */
export default combineReducers({
  fundLoading: scopedRequestReducer("fund_loading"),
  fundsLoading: scopedRequestReducer("fund_collection_loading"),
  fundOperation: scopedRequestReducer("fund_operation"),

  fundApplicationOperation: scopedRequestReducer("fundApplication_operation"),
  fundConcretizationOperation: scopedRequestReducer("fundConcretization_operation"),

  processLoading: scopedRequestReducer("process_loading"),
  processesLoading: scopedRequestReducer("process_collection_loading"),
  processOperation: scopedRequestReducer("process_operation"),

  projectLoading: scopedRequestReducer("project_loading"),
  projectsLoading: scopedRequestReducer("project_collection_loading"),
  projectOperation: scopedRequestReducer("project_operation"),

  userLoading: scopedRequestReducer("user_loading"),
  usersLoading: scopedRequestReducer("user_collection_loading"),
  userOperation: scopedRequestReducer("user_operation"),

  validationOperation: scopedRequestReducer("validation_operation"),
})