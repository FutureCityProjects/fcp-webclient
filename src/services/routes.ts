// to avoid typos and to allow changing the URLs later all links should use this enum
export enum Routes {
  home = "/",
  about = "/about",
  imprint = "/imprint",
  dataProtection = "/data-protection",
  offlineToolPlanning = "/offline-tools/planning",
  offlineToolProfile = "/offline-tools/profile",
  offlineToolTeam = "/offline-tools/team",
  processOverview = "/process",
  fundPage = "/funds/[slug]",

  // user handling
  login = "/user/login",
  userProfile = "/user/profile",
  registration = "/user/register",
  confirmAccount = "/user/confirm-account/[id]/[token]",
  confirmEmailChange = "/user/confirm-email/[id]/[token]",
  confirmPasswordReset = "/user/reset-password/[id]/[token]",

  // public project data/pages
  marketplace = "/projects",
  projectPage = "/projects/[slug]", // also works for ID
  createIdea = "/ideas/create",
  createProject = "/projects/create?inspiration=[id]",
  projectApplication = "/projects/[slug]/apply",

  // project data for members
  myProjects = "/user/projects",
  projectProfile = "/projects/[slug]/profile",
  projectProfileEdit = "/projects/[slug]/profile/edit",
  projectSelectFund = "/projects/[slug]/fund-application/select-fund",
  projectConcretization = "/projects/[slug]/fund-application/concretization",
  projectMembers = "/projects/[slug]/members",
  projectPlan = "/projects/[slug]/plan",
  projectPlanEdit = "/projects/[slug]/plan/edit",
  projectPlanTasks = "/projects/[slug]/plan/tasks",
  projectPlanWorkPackages = "/projects/[slug]/plan/work-packages",
  projectPlanTimetable = "/projects/[slug]/plan/timetable",
  projectPlanResourceRequirements = "/projects/[slug]/plan/resource-requirements",
  projectPlanFinances = "/projects/[slug]/plan/finances",
  projectFundApplication = "/projects/[slug]/fund-application",
  projectFundApplicationEdit = "/projects/[slug]/fund-application/edit",
  projectFundApplicationSubmit = "/projects/[slug]/fund-application/submit",
  projectFundApplicationSubmission = "/projects/[slug]/fund-application/submission",
  projectFundingEdit = "/projects/[slug]/fund-application/funding",

  // administrative pages for process owner / admin
  processCreate = "/process/create",
  processEdit = "/process/edit",

  userOverview = "/users",
  userDetails = "/users/[id]",

  fundOverview = "/management/funds",
  fundCreate = "/management/funds/create",
  fundDetails = "/management/funds/[id]",
  fundEdit = "/management/funds/[id]/edit",
  fundActivate = "/management/funds/[id]/activate",
  concretizationCreate = "/management/funds/[id]/add-concretization",
  concretizationEdit = "/management/funds/[id]/edit-concretization",
}

export const routeWithParams = (route: Routes, params: { [param: string]: string | number }) => {
  let result: string = route
  Object.keys(params).forEach((name) => {
    result = result.replace(`[${name}]`, params[name].toString())
  })

  return result
}
