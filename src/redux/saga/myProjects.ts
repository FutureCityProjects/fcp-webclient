import { withCallback } from "redux-saga-callback"
import { call, put, select, takeLatest } from "redux-saga/effects"

import { MyProjectsActionTypes } from "redux/actions/myProjects"
import { loadCollectionAction, loadingSuccessAction, setLoadingAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectMyProjectIDs } from "redux/reducer/myProjects"
import { getCurrentUser } from "./currentUser"
import { loadProjectCollectionSaga } from "./projects"

export function* myProjectsWatcherSaga(): any {
  yield takeLatest(MyProjectsActionTypes.LoadMyProjects, withCallback(loadMyProjectsSaga))
}

function* loadMyProjectsSaga() {
  yield put(setLoadingAction("project_collection_loading", true))

  // ensure we have the user, we get the project IDs from his memberships
  if (!(yield call(getCurrentUser))) {
    const err = yield select((s: AppState) => s.requests.userLoading.loadingError)
    yield put(setLoadingAction("project_collection_loading", false, err))
    return null
  }

  // if the user isn't member (or applicant) of a project don't bother the API
  const myProjectIds = yield select(selectMyProjectIDs)
  if (!myProjectIds.length) {
    const empty = { "hydra:member": [] }
    yield put(setLoadingAction("project_collection_loading", false))
    yield put(loadingSuccessAction("my_projects", empty))
    return empty
  }

  // just filter by the IDs, no need to filter for progress, a user cannot be member of Ideas
  // @todo why does putWait not work here for SSR? It just hangs without calling the saga...
  // it works in the marketplace.ts? Too many putWaits before for getting the current user?
  // return yield putWait(loadCollectionAction(Scope.PROJECT, "my_projects", { id: myProjectIds }))
  return yield call(loadProjectCollectionSaga,
    loadCollectionAction(EntityType.Project, { id: myProjectIds }, "my_projects"))
}
