import { all } from "redux-saga/effects"

import { authWatcherSaga } from "./auth"
import { currentProcessWatcherSaga } from "./currentProcess"
import { currentUserWatcherSaga } from "./currentUser"
import { newIdeaWatcherSaga } from "./newIdea"
import { newProjectWatcherSaga } from "./newProject"
import { processesWatcherSaga } from "./processes"
import { projectsWatcherSaga } from "./projects"
import { registrationWatcherSaga } from "./registration"
import { usersWatcherSaga } from "./users"

function* rootSaga() {
  yield all([
    authWatcherSaga(),
    currentProcessWatcherSaga(),
    currentUserWatcherSaga(),
    newIdeaWatcherSaga(),
    newProjectWatcherSaga(),
    processesWatcherSaga(),
    projectsWatcherSaga(),
    registrationWatcherSaga(),
    usersWatcherSaga(),
  ])
}

export default rootSaga
