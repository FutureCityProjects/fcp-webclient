export enum SelfAssessment {
  Starting = 0,
  MakingProgress = 25,
  HalfFinished = 50,
  AlmostFinished = 75,
  Complete = 100,
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
  "hydra:search"?: Record<string, unknown>
  "hydra:totalItems"?: number
}

export enum FundState {
  Active = "active",
  Finished = "finished",
  Inactive = "inactive",
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
  Concretization = "concretization",
  Detailing = "detailing",
  Submitted = "submitted",
}

export interface IFundApplication extends INumericIdentifierModel {
  "@id"?: string
  active?: boolean
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
  submissionData?: ISubmissionData
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
  Idea = "idea",
  CreatingProfile = "creating_profile",
  CreatingPlan = "creating_plan",
  CreatingApplication = "creating_application",
  SubmittingApplication = "submitting_application",
  ApplicationSubmitted = "application_submitted",
}

export enum ProjectState {
  Active = "active",
  Inactive = "inactive",
  Deactivated = "deactivated",
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
  locked?: boolean
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
  progress: ProjectProgress.Idea,
  shortDescription: "",
}

// additional fields required when a user creates a project,
// are moved to his membership server-side
export interface IProjectCreation extends IProject {
  motivation: string
  skills: string
}

export const emptyProject: IProjectCreation = {
  motivation: "",
  progress: ProjectProgress.CreatingProfile,
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
  Administrative = "administrative",
  Investment = "investment",
  Material = "material",
  Personnel = "personnel",
  Rent = "rent",
  Traveling = "traveling",
}

export enum ResourceSourceType {
  Funding = "funding",
  OwnFunds = "own_funds",
  Proceeds = "proceeds",
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
  Applicant = "applicant",
  Member = "member",
  Owner = "owner",
}

export interface IProjectMembership extends INumericIdentifierModel {
  "@id"?: string
  motivation?: string
  project?: IProject | string
  role?: MembershipRole
  skills?: string
  tasks?: string
  user?: IUser | string
}

export enum UserRole {
  Admin = "ROLE_ADMIN",
  ProcessOwner = "ROLE_PROCESS_OWNER",
  User = "ROLE_USER",

  // @todo should not be an allowed role for any actions, added here for authenticated links
  Guest = "ROLE_GUEST",
}

export interface IUser extends INumericIdentifierModel {
  "@id"?: string
  active?: boolean
  createdAt?: Date | string
  createdProjects?: IProject[]
  deletedAt?: Date | string
  email?: string
  firstName?: string
  id?: number
  lastName?: string
  objectRoles?: IUserObjectRoles[]
  password?: string
  projectMemberships?: IProjectMembership[]
  roles?: UserRole[]
  username?: string
  validated?: boolean
}

export interface IRegistration extends IUser {
  validationUrl: string
}

export enum ObjectRoles {
  JuryMember = "juryMember",
  ProcessOwner = "processOwner",
}

export interface IUserObjectRoles {
  "@id"?: string
  objectId?: number
  objectType?: string
  role?: ObjectRoles
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
