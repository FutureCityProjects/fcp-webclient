export enum SelfAssessment {
  STARTING = 0,
  MAKING_PROGRESS = 25,
  HALF_FINISHED = 50,
  ALMOST_FINISHED = 75,
  COMPLETE = 100,
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
  briefingDate?: Date | string
  budget?: number
  concretizations?: IFundConcretization[]
  criteria?: string[]
  description?: string
  finalJuryDate?: Date | string
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
  ratingBegin?: Date | string
  ratingEnd?: Date | string
  region?: string
  slug?: string
  sponsor?: string
  state?: FundState
  submissionBegin?: Date | string
  submissionEnd?: Date | string
}

export enum FundApplicationState {
  CONCRETIZATION = "concretization",
  DETAILING = "detailing",
  SUBMITTED = "submitted",
}

export interface IFundApplication extends INumericIdentifierModel {
  "@id"?: string
  applicationSelfAssessment?: SelfAssessment
  concretizations?: { [id: number]: string }
  concretizationSelfAssessment?: SelfAssessment
  fund?: IFund
  id?: number
  juryComment?: string
  juryOrder?: number
  project?: IProject | string
  ratings?: IJuryRating[]
  requestedFunding?: number
  state?: FundApplicationState
  submissionData: ISubmissionData
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
  SUBMITTING_APPLICATION = "submitting_application",
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
  contactEmaiL?: string
  contactName?: string
  contactPhone?: string
  createdAt?: Date | string
  createdBy?: IUser
  deletedAt?: Date | string
  delimitation?: string
  description?: string
  goal?: string
  holderAddressInfo?: string
  holderCity?: string
  holderName?: string
  holderStreet?: string
  holderZipCode?: string
  id?: number
  impact?: string[]
  implementationBegin?: Date | string
  implementationTime?: number
  inspiration?: IProject | string
  isLocked?: boolean
  memberships?: IProjectMembership[]
  name?: string
  outcome?: string[]
  picture?: string
  planSelfAssessment?: SelfAssessment
  process?: IProcess | string
  profileSelfAssessment?: SelfAssessment
  progress?: ProjectProgress
  resourceRequirements?: IResourceRequirement[]
  resultingProjects?: IProject[]
  results?: string[]
  shortDescription?: string
  slug?: string
  state?: string
  targetGroups?: string[]
  tasks?: IProjectTask[]
  updatedAt?: Date | string
  utilization?: string
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
  description?: string
  id?: string
  // in which months of the projects implementationTime this task will be worked on
  // e.g. 1,2,3 for the first 3 months
  months?: number[]
  result?: string
  title?: string
  workPackage?: string // ID of the parent IWorkPackage
}

export interface IWorkPackage {
  description?: string
  id?: string
  mainResponsibility?: string
  name?: string
  // for display (AP1, AP2, ...) and for sorting
  order?: number
  project?: IProject | string
}

export enum ResourceCostType {
  COST_TYPE_ADMINISTRATIVE = "administrative",
  COST_TYPE_INVESTMENT = "investment",
  COST_TYPE_MATERIAL = "material",
  COST_TYPE_PERSONNEL = "personnel",
  COST_TYPE_RENT = "rent",
  COST_TYPE_TRAVELING = "traveling",
}

export enum ResourceSourceType {
  SOURCE_TYPE_FUNDING = "funding",
  SOURCE_TYPE_OWN_FUNDS = "own_funds",
  SOURCE_TYPE_PROCEEDS = "proceeds",
}

export interface IResourceRequirement {
  cost?: number
  costType?: ResourceCostType
  description?: string
  id?: string
  source?: string
  sourceType?: ResourceSourceType
  task?: string // ID of the parent IProjectTask
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
  user?: IUser | string
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
  createdAt?: Date | string
  createdProjects?: IProject[]
  deletedAt?: Date | string
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

// The data stored with each submitted application,
// immutable copy of most project properties.
export interface ISubmissionData {
  projectId?: number
  submissionDate?: string | Date
  submittedBy?: {
    userId: number
    username: string
    firstName: string
    lastName: string
  }
  name: string
  shortDescription: string
  description: string
  goal: string
  challenges: string
  vision: string
  delimitation: string
  implementationBegin: string
  implementationTime: number
  impact: string[]
  outcome: string[]
  targetGroups: string[]
  results: string[]
  utilization: string
  tasks: IProjectTask[]
  workPackages: IWorkPackage[]
  resourceRequirements: IResourceRequirement[]
  contactEmail: string
  contactName: string
  contactPhone: string
  holderAddressInfo: string
  holderCity: string
  holderName: string
  holderStreet: string
  holderZipCode: string
  concretizations: { [id: number]: string }
  requestedFunding: number
}
