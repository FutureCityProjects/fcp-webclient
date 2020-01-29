// to avoid typos and to allow changing the URLs later all links should use this enum
export enum Routes {
  HOME = "/",
  ABOUT = "/about",

  // user handling
  LOGIN = "/user/login",
  USER_PROFILE = "/user/profile",
  REGISTRATION = "/user/register",
  CONFIRM_ACCOUNT = "/user/confirm-account/[id]/[token]",
  CONFIRM_EMAIL_CHANGE = "/user/confirm-email/[id]/[token]",
  CONFIRM_PASSWORD_RESET = "/user/reset-password/[id]/[token]",

  // public project data/pages
  MARKETPLACE = "/projects",
  PROJECT_PAGE = "/projects/[slug]", // also works for ID
  CREATE_IDEA = "/ideas/create",
  CREATE_PROJECT = "/projects/create?inspiration=[id]",
  PROJECT_APPLICATION = "projects/[slug]/apply",

  // project data for members
  MY_PROJECTS = "/user/projects",
  PROJECT_PROFILE = "/projects/[slug]/profile",
  PROJECT_PROFILE_EDIT = "/projects/[slug]/profile/edit",
  PROJECT_SELECT_FUND = "/projects/[slug]/select-fund",
  PROJECT_CONCRETIZATION = "/projects/[slug]/concretization",

  // administrative pages for process owner / admin
  PROCESS_OVERVIEW = "/process",
  PROCESS_CREATE = "/process/create",
  PROCESS_EDIT = "/process/edit",

  USER_OVERVIEW = "/users",
  USER_DETAILS = "/users/[id]",

  FUND_OVERVIEW = "/management/funds",
  FUND_CREATE = "/management/funds/create",
  FUND_DETAILS = "/management/funds/[id]",
  FUND_EDIT = "/management/funds/[id]/edit",
  FUND_ACTIVATE = "/management/funds/[id]/activate",
  CONCRETIZATION_CREATE = "/management/funds/[id]/add-concretization",
  CONCRETIZATION_EDIT = "/management/funds/[id]/edit-concretization",
}

export const routeWithParams = (route: Routes, params: { [param: string]: string | number }) => {
  let result: string = route
  Object.keys(params).forEach((name) => {
    result = result.replace(`[${name}]`, params[name].toString())
  })

  return result
}
