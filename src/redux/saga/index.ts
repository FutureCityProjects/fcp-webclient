import { all } from "redux-saga/effects"

import { authWatcherSaga } from "./auth"
import { currentProcessWatcherSaga } from "./currentProcess"
import { currentUserWatcherSaga } from "./currentUser"
import { fundApplicationsWatcherSaga } from "./fundApplications"
import { fundConcretizationsWatcherSaga } from "./fundConcretizations"
import { fundsWatcherSaga } from "./funds"
import { marketplaceWatcherSaga } from "./marketplace"
import { myProjectsWatcherSaga } from "./myProjects"
import { newIdeaWatcherSaga } from "./newIdea"
import { newProjectWatcherSaga } from "./newProject"
import { processesWatcherSaga } from "./processes"
import { projectsWatcherSaga } from "./projects"
import { registrationWatcherSaga } from "./registration"
import { usersWatcherSaga } from "./users"
import { validationWatcherSaga } from "./validation"

function* rootSaga() {
  yield all([
    authWatcherSaga(),
    currentProcessWatcherSaga(),
    currentUserWatcherSaga(),
    fundApplicationsWatcherSaga(),
    fundConcretizationsWatcherSaga(),
    fundsWatcherSaga(),
    marketplaceWatcherSaga(),
    myProjectsWatcherSaga(),
    newIdeaWatcherSaga(),
    newProjectWatcherSaga(),
    processesWatcherSaga(),
    projectsWatcherSaga(),
    registrationWatcherSaga(),
    usersWatcherSaga(),
    validationWatcherSaga(),
  ])
}

export default rootSaga
