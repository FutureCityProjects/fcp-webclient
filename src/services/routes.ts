// to avoid typos and to allow changing the URLs later all links should use this enum
export enum Routes {
  Home = "/",
  About = "/about",
  Imprint = "/imprint",
  DataProtection = "/data-protection",
  OfflineToolPlanning = "/offline-tools/planning",
  OfflineToolProfile = "/offline-tools/profile",
  OfflineToolTeam = "/offline-tools/team",
  ProcessOverview = "/process",
  FundPage = "/funds/[slug]",

  // user handling
  Login = "/user/login",
  UserProfile = "/user/profile",
  Registration = "/user/register",
  ConfirmAccount = "/user/confirm-account/[id]/[token]",
  ConfirmEmailChange = "/user/confirm-email/[id]/[token]",
  ConfirmPasswordReset = "/user/reset-password/[id]/[token]",

  // public project data/pages
  Marketplace = "/projects",
  ProjectPage = "/projects/[slug]", // also works for ID
  CreateIdea = "/ideas/create",
  CreateProject = "/projects/create?inspiration=[id]",
  ProjectApplication = "/projects/[slug]/apply",

  // project data for members
  MyProjects = "/user/projects",
  ProjectProfile = "/projects/[slug]/profile",
  ProjectProfileEdit = "/projects/[slug]/profile/edit",
  ProjectSelectFund = "/projects/[slug]/fund-application/select-fund",
  ProjectConcretization = "/projects/[slug]/fund-application/concretization",
  ProjectMembers = "/projects/[slug]/members",
  ProjectPlan = "/projects/[slug]/plan",
  ProjectPlanEdit = "/projects/[slug]/plan/edit",
  ProjectPlanTasks = "/projects/[slug]/plan/tasks",
  ProjectPlanWorkPackages = "/projects/[slug]/plan/work-packages",
  ProjectPlanTimetable = "/projects/[slug]/plan/timetable",
  ProjectPlanResourceRequirements = "/projects/[slug]/plan/resource-requirements",
  ProjectPlanFinances = "/projects/[slug]/plan/finances",
  ProjectFundApplication = "/projects/[slug]/fund-application",
  ProjectFundApplicationEdit = "/projects/[slug]/fund-application/edit",
  ProjectFundApplicationSubmit = "/projects/[slug]/fund-application/submit",
  ProjectFundApplicationSubmission = "/projects/[slug]/fund-application/submission",
  ProjectFundingEdit = "/projects/[slug]/fund-application/funding",

  // administrative pages for process owner / admin
  ProcessCreate = "/process/create",
  ProcessEdit = "/process/edit",

  UserOverview = "/users",
  UserDetails = "/users/[id]",

  FundOverview = "/management/funds",
  FundCreate = "/management/funds/create",
  FundDetails = "/management/funds/[id]",
  FundEdit = "/management/funds/[id]/edit",
  FundActivate = "/management/funds/[id]/activate",
  ConcretizationCreate = "/management/funds/[id]/add-concretization",
  ConcretizationEdit = "/management/funds/[id]/edit-concretization",
}

export const routeWithParams = (route: Routes, params: { [param: string]: string | number }): string => {
  let result: string = route
  Object.keys(params).forEach((name) => {
    result = result.replace(`[${name}]`, params[name].toString())
  })

  return result
}
