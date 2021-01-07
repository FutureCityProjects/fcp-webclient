import {
  ICredentials,
  IFund,
  IFundApplication,
  IFundConcretization,
  IHydraCollection,
  IProcess,
  IProject,
  IProjectCreation,
  IProjectMembership,
  IRegistration,
  IUser,
} from "api/schema"
import { HydraClient } from "services/hydraClient"
import { FCP_API_ENTRYPOINT } from "../../config"

export class FCPClient extends HydraClient {
  /* #region Auth */
  public requestAuthToken = (credentials: ICredentials): Promise<string> => {
    return (this.post("/authentication_token", credentials)
      .then((res) => res.token as string))
  }

  public refreshAuthToken = (): Promise<string> => {
    return this.get("/refresh_token")
      .then((res) => res.token as string)
  }
  /* #endregion */

  /* #region Fund */
  public getFundBySlug = (slug: string): Promise<IFund> => {
    return this.getFunds({ slug }).then((funds) => funds["hydra:member"].shift())
  }

  public getFund = (id: number): Promise<IFund> => {
    return this.get(`/funds/${id}`) as Promise<IFund>
  }

  public getFunds = (query: any = {}): Promise<IHydraCollection<IFund>> => {
    return this.get("/funds", query) as Promise<IHydraCollection<IFund>>
  }

  public createFund = (fund: IFund): Promise<IFund> => {
    return this.post("/funds", fund) as Promise<IFund>
  }

  public updateFund = (fund: IFund): Promise<IFund> => {
    return this.put(fund["@id"], fund) as Promise<IFund>
  }

  public deleteFund = (concretization: IFundConcretization): Promise<void> => {
    return this.delete(concretization["@id"]) as Promise<void>
  }

  public createFundConcretization = (concretization: IFundConcretization): Promise<IFundConcretization> => {
    return this.post("/fund_concretizations", concretization) as Promise<IFundConcretization>
  }

  public updateFundConcretization = (concretization: IFundConcretization): Promise<IFundConcretization> => {
    return this.put(concretization["@id"], concretization) as Promise<IFundConcretization>
  }

  public deleteFundConcretization = (concretization: IFundConcretization): Promise<void> => {
    return this.delete(concretization["@id"]) as Promise<void>
  }

  public acitvateFund = (fund: IFund): Promise<IFund> => {
    return this.post(fund["@id"] + "/activate", {}) as Promise<IFund>
  }
  /* #endregion */

  /* #region FundApplication */
  public getFundApplication = (id: number): Promise<IFundApplication> => {
    return this.get(`/fund_applications/${id}`) as Promise<IFundApplication>
  }

  public getFundApplications = (query: any = {}): Promise<IHydraCollection<IFundApplication>> => {
    return this.get("/fund_applications", query) as Promise<IHydraCollection<IFundApplication>>
  }

  public createFundApplication = (fundApplication: IFundApplication): Promise<IFundApplication> => {
    return this.post("/fund_applications", fundApplication) as Promise<IFundApplication>
  }

  public updateFundApplication = (fundApplication: IFundApplication): Promise<IFundApplication> => {
    return this.put(fundApplication["@id"], fundApplication) as Promise<IFundApplication>
  }

  public deleteFundApplication = (fundApplication: IFundApplication): Promise<void> => {
    return this.delete(fundApplication["@id"]) as Promise<void>
  }

  public submitFundApplication = (fundApplication: IFundApplication): Promise<void> => {
    return this.post(fundApplication["@id"] + "/submit", {}) as Promise<void>
  }
  /* #endregion */

  /* #region Process */
  // @todo update when multi-processes are implemented
  public getCurrentProcess = (): Promise<IProcess> => {
    return this.getProcesses().then((processes) => processes["hydra:member"].shift())
  }

  public getProcessBySlug = (slug: string): Promise<IProcess> => {
    return this.getProcesses({ slug }).then((processes) => processes["hydra:member"].shift())
  }

  public getProcess = (id: number): Promise<IProcess> => {
    return this.get(`/processes/${id}`) as Promise<IProcess>
  }

  public getProcesses = (query: any = {}): Promise<IHydraCollection<IProcess>> => {
    return this.get("/processes", query) as Promise<IHydraCollection<IProcess>>
  }

  public createProcess = (process: IProcess): Promise<IProcess> => {
    return this.post("/processes", process) as Promise<IProcess>
  }

  public updateProcess = (process: IProcess): Promise<IProcess> => {
    return this.put(process["@id"], process) as Promise<IProcess>
  }

  public deleteProcess = (process: IProcess): Promise<void> => {
    return this.delete(process["@id"]) as Promise<void>
  }
  /* #endregion */

  /* #region Project */
  public getProjectBySlug = (slug: string): Promise<IProject> => {
    return this.getProjects({ slug }).then((projects) => projects["hydra:member"].shift())
  }

  public getProject = (id: number): Promise<IProject> => {
    return this.get(`/projects/${id}`) as Promise<IProject>
  }

  public getProjects = (query: any = {}): Promise<IHydraCollection<IProject>> => {
    return this.get("/projects", query) as Promise<IHydraCollection<IProject>>
  }

  public createProject = (project: IProjectCreation | IProject): Promise<IProject> => {
    return this.post("/projects", project) as Promise<IProject>
  }

  public updateProject = (project: IProject): Promise<IProject> => {
    return this.put(project["@id"], project) as Promise<IProject>
  }

  public deleteProject = (project: IProject): Promise<void> => {
    return this.delete(project["@id"]) as Promise<void>
  }
  /* #endregion */

  /* #region ProjectMembership */
  public createProjectMembership = (project: IProjectMembership): Promise<IProjectMembership> => {
    return this.post("/project_memberships", project) as Promise<IProjectMembership>
  }

  public updateProjectMembership = (projectMembership: IProjectMembership): Promise<IProjectMembership> => {
    return this.put(projectMembership["@id"], projectMembership) as Promise<IProjectMembership>
  }

  public deleteProjectMembership = (projectMembership: IProjectMembership): Promise<void> => {
    return this.delete(projectMembership["@id"]) as Promise<void>
  }
  /* #endregion */

  /* #region User */
  public getUserByUsername = (username: string): Promise<IUser> => {
    return this.getUsers({ username }).then((users) => users["hydra:member"].shift())
  }

  public getUser = (id: number): Promise<IUser> => {
    return this.get(`/users/${id}`) as Promise<IUser>
  }

  public getUsers = (query: any = {}): Promise<IHydraCollection<IUser>> => {
    return this.get("/users", query) as Promise<IHydraCollection<IUser>>
  }

  public createUser = (user: IUser): Promise<IUser> => {
    return this.post("/users", user) as Promise<IUser>
  }

  public registerUser = (user: IRegistration): Promise<IUser> => {
    return this.post("/users/register", user) as Promise<IUser>
  }

  public updateUser = (user: IUser): Promise<IUser> => {
    return this.put(user["@id"], user) as Promise<IUser>
  }

  public deleteUser = (user: IUser): Promise<void> => {
    return this.delete(user["@id"]) as Promise<void>
  }
  /* #endregion */

  /* #region Validation */
  public confirmValidation = (id: string, token: string): Promise<boolean> => {
    return this.post(`/validations/${id}/confirm`, { token }) as Promise<boolean>
  }

  public resetPassword = (id: string, token: string, password: string): Promise<boolean> => {
    return this.post(`/validations/${id}/confirm`, { token, password }) as Promise<boolean>
  }
  /* #endregion */
}

export default new FCPClient(FCP_API_ENTRYPOINT)
