export enum ROLES {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_PROCESS_OWNER = "ROLE_PROCESS_OWNER",
  ROLE_USER = "ROLE_USER",
}

export interface ICredentials {
  username: string
  password: string
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

export interface IFund {
  "@id"?: string
  briefingDate?: any
  criteria?: string[]
  description?: string
  finalJuryDate?: any
  imprint?: string
  id?: number
  jurorsPerApplication: number
  juryCriteria?: IJuryCriteria[]
  logo?: string
  maximumFund?: number
  minimumFund?: number
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

export interface IFundApplication {
  "@id"?: string
  project?: IProject
  fund?: IFund
}

export interface IFundConcretization {
  "@id"?: string
  id?: number
  fund?: IFund
}

export interface IJuryCriteria {
  "@id"?: string
  id?: number
  fund?: IFund
}

export interface IProcess {
  "@id"?: string
  id?: number
  criteria?: string[]
  description?: string
  funds?: IFund[]
  imprint?: string
  logo?: string
  name?: string
  projects?: IProject[]
  region?: string
  slug?: string
  targets?: string[]
}

export interface IProject {
  "@id"?: string
  id?: number
}

export interface IUser {
  "@id"?: string
  id?: number
  email?: string
  roles?: ROLES[]
  password?: string
  username?: string
  firstName?: string
  lastName?: string
  salt?: string
}
