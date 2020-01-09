import { all } from "redux-saga/effects"

import { authWatcherSaga } from "./auth"
import { newIdeaWatcherSaga } from "./newIdea"
import { processesWatcherSaga } from "./processes"
import { profileWatcherSaga } from "./profile"
import { projectsWatcherSaga } from "./projects"
import { registrationWatcherSaga } from "./registration"
import { usersWatcherSaga } from "./users"

function* rootSaga() {
  yield all([
    authWatcherSaga(),
    newIdeaWatcherSaga(),
    processesWatcherSaga(),
    profileWatcherSaga(),
    projectsWatcherSaga(),
    registrationWatcherSaga(),
    usersWatcherSaga(),
  ])
}

export default rootSaga
