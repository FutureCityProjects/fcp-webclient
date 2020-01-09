export default combineReducers({
  idea: newIdeaReducer,
  request: scopedSetLoadingReducer("new_idea"),
})