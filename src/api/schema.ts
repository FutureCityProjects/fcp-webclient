export enum SELF_ASSESSMENT {
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
  OPEN = "open",
  SUBMITTED = "submitted",
}

export interface IFund extends INumericIdentifierModel {
  "@id"?: string
  applications?: IFundApplication[]
  briefingDate?: any
  budget?: number
  concretizations: IFundConcretization[]
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
  process?: IProcess
  projects?: IProject[]
  ratingBegin?: any
  ratingEnd?: any
  region?: string
  slug?: string
  sponsor?: string
  state?: string
  submissionBegin?: any
  submissionEnd?: any
}

export interface IFundApplication extends INumericIdentifierModel {
  "@id"?: string
  concretizations?: string[]
  concretizationSelfAssessment?: SELF_ASSESSMENT
  fund?: IFund
  id?: number
  juryComment?: string
  juryOrder?: number
  project?: IProject
  ratings?: IJuryRating[]
  state?: string
}

export interface IFundConcretization extends INumericIdentifierModel {
  "@id"?: string
  description?: string
  fund?: IFund
  id?: number
  maxLength?: number
  question?: string
}

export interface IJuryCriterion extends INumericIdentifierModel {
  "@id"?: string
  fund?: IFund
  id?: number
  question?: string
}

export interface IJuryRating {
  "@id"?: string
  application?: IFundApplication
  fund?: IFund
  juror?: IUser
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
  inspiration?: IProject
  isLocked?: boolean
  memberships?: IProjectMembership[]
  name?: string
  picture?: string
  process?: IProcess | string
  profileSelfAssessment?: SELF_ASSESSMENT
  progress?: ProjectProgress
  resultingProjects?: IProject[]
  shortDescription?: string
  slug?: string
  state?: string
  vision?: string
  visualization?: string
}

export const emptyIdea: IProject = {
  progress: ProjectProgress.IDEA,
  shortDescription: "",
}

export interface IProjectMembership {
  "@id"?: string
  motivation?: string
  project?: IProject
  role?: string
  skills?: string
  tasks?: string
  user?: IUser
}

export enum ROLES {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_PROCESS_OWNER = "ROLE_PROCESS_OWNER",
  ROLE_USER = "ROLE_USER",
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
  roles?: ROLES[]
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
