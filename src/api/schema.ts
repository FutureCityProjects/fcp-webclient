export enum SelfAssessment {
  SELF_ASSESSMENT_0_PERCENT = 0,
  SELF_ASSESSMENT_25_PERCENT = 25,
  SELF_ASSESSMENT_50_PERCENT = 50,
  SELF_ASSESSMENT_75_PERCENT = 75,
  SELF_ASSESSMENT_100_PERCENT = 100,
}

export interface ICredentials {
  username: string
  password: string
}

export interface INumericIdentifierModel {
  [prop: string]: any
  id?: number
}

export interface IHydraCollection<T> {
  "@context"?: string
  "@id"?: string
  "@type"?: string
  "hydra:firstPage"?: number
  "hydra:itemsPerPage"?: number
  "hydra:lastPage"?: number
  "hydra:member"?: T[]
  "hydra:nextPage"?: string
  "hydra:search"?: object
  "hydra:totalItems"?: number
}

export enum FundState {
  ACTIVE = "active",
  FINISHED = "finished",
  INACTIVE = "inactive",
}

export interface IFund extends INumericIdentifierModel {
  "@id"?: string
  applications?: IFundApplication[]
  briefingDate?: any
  budget?: number
  concretizations?: IFundConcretization[]
  criteria?: string[]
  description?: string
  finalJuryDate?: any
  id?: number
  imprint?: string
  jurorsPerApplication: number
  juryCriteria?: IJuryCriterion[]
  logo?: string
  maximumGrant?: number
  minimumGrant?: number
  name?: string
  process?: IProcess | string
  projects?: IProject[]
  ratingBegin?: any
  ratingEnd?: any
  region?: string
  slug?: string
  sponsor?: string
  state?: FundState
  submissionBegin?: any
  submissionEnd?: any
}

export enum FundApplicationState {
  OPEN = "open",
  SUBMITTED = "submitted",
}

export interface IFundApplication extends INumericIdentifierModel {
  "@id"?: string
  concretizations?: string[]
  concretizationSelfAssessment?: SelfAssessment
  fund?: IFund
  id?: number
  juryComment?: string
  juryOrder?: number
  project?: IProject | string
  ratings?: IJuryRating[]
  state?: FundApplicationState
}

export interface IFundConcretization extends INumericIdentifierModel {
  "@id"?: string
  description?: string
  fund?: IFund | string
  id?: number
  maxLength?: number
  question?: string
}

export interface IJuryCriterion extends INumericIdentifierModel {
  "@id"?: string
  fund?: IFund | string
  id?: number
  question?: string
}

export interface IJuryRating {
  "@id"?: string
  application?: IFundApplication | string
  juror?: IUser | string
  ratings?: any // @todo
  state?: string
}

export interface IProcess extends INumericIdentifierModel {
  "@id"?: string
  id?: number
  criteria?: string[]
  description?: string
  funds?: IFund[]
  goals?: string[]
  imprint?: string
  logo?: string
  name?: string
  projects?: IProject[]
  region?: string
  slug?: string
}

export enum ProjectProgress {
  IDEA = "idea",
  CREATING_PROFILE = "creating_profile",
  CREATING_PLAN = "creating_plan",
  CREATING_APPLICATION = "creating_application",
  APPLICATION_SUBMITTED = "application_submitted",
}

export enum ProjectState {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DEACTIVATED = "deactivated",
}

export interface IProject extends INumericIdentifierModel {
  "@id"?: string
  applications?: IFundApplication[]
  challenges?: string
  createdAt?: Date
  createdBy?: IUser
  deletedAt?: Date
  delimitation?: string
  description?: string
  goal?: string
  id?: number
  implementationTime?: number
  inspiration?: IProject | string
  isLocked?: boolean
  memberships?: IProjectMembership[]
  name?: string
  picture?: string
  process?: IProcess | string
  profileSelfAssessment?: SelfAssessment
  progress?: ProjectProgress
  resultingProjects?: IProject[]
  shortDescription?: string
  slug?: string
  state?: string
  tasks?: IProjectTask[]
  vision?: string
  visualization?: string
  workPackages?: IWorkPackage[]
}

export const emptyIdea: IProject = {
  progress: ProjectProgress.IDEA,
  shortDescription: "",
}

// additional fields required when a user creates a project,
// are moved to his membership server-side
export interface IProjectCreation extends IProject {
  motivation: string,
  skills: string,
}

export const emptyProject: IProjectCreation = {
  motivation: "",
  progress: ProjectProgress.CREATING_PROFILE,
  skills: "",
}

export interface IProjectTask {
  // @PHMU textarea
  description?: string

  // create via lodash/uniqueId
  id?: string

  // in which months of the projects implementationTime this task will be worked on
  // e.g. 1,2,3 for the first 3 months
  months?: number[]

  // using workPackages is optional but a task always belongs to a project
  project?: IProject | string

  ressourceRequirements?: IRessourceRequirement[]

  // @PHMU: nicht für die erste Umsetzung
  result?: string
  // @PHMU: nicht für die erste Umsetzung
  title?: string

  // id of the parent IWorkPackage
  workPackage?: string
}

export interface IWorkPackage {
  // @PHMU textarea
  description?: string

  id?: string // create via lodash/uniqueId

  // @PHMU text input
  mainResponsibility?: string

  // @PHMU text input
  name?: string

  // for display when no name is set (AP1, AP2, ...) and for sorting,
  // newPackage.order = project.workPackages.length + 1
  // @PHMU Umsortierung (bspw. via Drag&Drop) erstmal optional / low prio
  order?: number

  project?: IProject | string

  // when the project is loaded from the API this will be empty,
  // can be filled in runtime for editing & display:
  // wp.tasks = project.tasks.filter((t) => t.workPackage === wp.id)
  // when a task is added to a workPackage the task CAN be added to this array but the
  // tasks workPackage property MUST be set to the packages ID
  tasks?: IProjectTask[]
}

export interface IRessourceRequirement {
  costs?: number
  costType: string
  description?: string
  source?: string
  sourceType?: string
  task?: string // id of the parent IProjectTask
}

export enum MembershipRole {
  APPLICANT = "applicant",
  MEMBER = "member",
  OWNER = "owner",
}

export interface IProjectMembership {
  "@id"?: string
  motivation?: string
  project?: IProject | string
  role?: MembershipRole
  skills?: string
  tasks?: string
  user?: IUser
}

export enum UserRole {
  ADMIN = "ROLE_ADMIN",
  PROCESS_OWNER = "ROLE_PROCESS_OWNER",
  USER = "ROLE_USER",

  // @todo should not be an allowed role for any actions, added here for authenticated links
  GUEST = "ROLE_GUEST",
}

export interface IUser extends INumericIdentifierModel {
  "@id"?: string
  createdAt?: Date
  createdProjects?: IProject[]
  deletedAt?: Date
  email?: string
  firstName?: string
  id?: number
  isActive?: boolean
  isValidated?: boolean
  lastName?: string
  objectRoles?: IUserObjectRoles[]
  password?: string
  projectMemberships?: IProjectMembership[]
  roles?: UserRole[]
  salt?: string
  username?: string
}

export interface IRegistration extends IUser {
  validationUrl: string
}

export enum OBJECT_ROLES {
  ROLE_JURY_MEMBER = "juryMember",
  ROLE_PROCESS_OWNER = "processOwner",
}

export interface IUserObjectRoles {
  "@id"?: string
  objectId?: number
  objectType?: string
  role?: OBJECT_ROLES
  user?: IUser
}
