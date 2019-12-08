import { all } from "redux-saga/effects"

import { authWatcherSaga } from "./auth"
import { processesWatcherSaga } from "./processes"
import { profileWatcherSaga } from "./profile"
import { usersWatcherSaga } from "./users"

function* rootSaga() {
  yield all([
    authWatcherSaga(),
    processesWatcherSaga(),
    profileWatcherSaga(),
    usersWatcherSaga(),
  ])
}

export default rootSaga
