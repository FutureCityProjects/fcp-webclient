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
    return this.post("/authentication_token", credentials)
      .then((res) => res.token)
  }

  public refreshAuthToken = (): Promise<string> => {
    return this.get("/refresh_token")
      .then((res) => res.token)
  }
  /* #endregion */

  /* #region Fund */
  public getFundBySlug = (slug: string): Promise<IFund> => {
    return this.getFunds({ slug }).then((funds) => funds["hydra:member"].shift())
  }

  public getFund = (id: number): Promise<IFund> => {
    return this.get(`/funds/${id}`)
  }

  public getFunds = (query: any = {}): Promise<IHydraCollection<IFund>> => {
    return this.get("/funds", query)
  }

  public createFund = (fund: IFund): Promise<IFund> => {
    return this.post("/funds", fund)
  }

  public updateFund = (fund: IFund): Promise<IFund> => {
    return this.put(fund["@id"], fund)
  }

  public deleteFund = (concretization: IFundConcretization): Promise<void> => {
    return this.delete(concretization["@id"])
  }

  public createFundConcretization = (concretization: IFundConcretization): Promise<IFundConcretization> => {
    return this.post("/fund_concretizations", concretization)
  }

  public updateFundConcretization = (concretization: IFundConcretization): Promise<IFundConcretization> => {
    return this.put(concretization["@id"], concretization)
  }

  public deleteFundConcretization = (concretization: IFundConcretization): Promise<void> => {
    return this.delete(concretization["@id"])
  }

  public acitvateFund = (fund: IFund): Promise<IFund> => {
    return this.post(fund["@id"] + "/activate", {})
  }
  /* #endregion */

  /* #region FundApplication */
  public getFundApplication = (id: number): Promise<IFundApplication> => {
    return this.get(`/fund_applications/${id}`)
  }

  public getFundApplications = (query: any = {}): Promise<IHydraCollection<IFundApplication>> => {
    return this.get("/fund_applications", query)
  }

  public createFundApplication = (fundApplication: IFundApplication): Promise<IFundApplication> => {
    return this.post("/fund_applications", fundApplication)
  }

  public updateFundApplication = (fundApplication: IFundApplication): Promise<IFundApplication> => {
    return this.put(fundApplication["@id"], fundApplication)
  }

  public deleteFundApplication = (fundApplication: IFundApplication): Promise<void> => {
    return this.delete(fundApplication["@id"])
  }

  public submitFundApplication = (fundApplication: IFundApplication): Promise<void> => {
    return this.post(fundApplication["@id"] + "/submit", {})
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
    return this.get(`/processes/${id}`)
  }

  public getProcesses = (query: any = {}): Promise<IHydraCollection<IProcess>> => {
    return this.get("/processes", query)
  }

  public createProcess = (process: IProcess): Promise<IProcess> => {
    return this.post("/processes", process)
  }

  public updateProcess = (process: IProcess): Promise<IProcess> => {
    return this.put(process["@id"], process)
  }

  public deleteProcess = (process: IProcess): Promise<void> => {
    return this.delete(process["@id"])
  }
  /* #endregion */

  /* #region Project */
  public getProjectBySlug = (slug: string): Promise<IProject> => {
    return this.getProjects({ slug }).then((projects) => projects["hydra:member"].shift())
  }

  public getProject = (id: number): Promise<IProject> => {
    return this.get(`/projects/${id}`)
  }

  public getProjects = (query: any = {}): Promise<IHydraCollection<IProject>> => {
    return this.get("/projects", query)
  }

  public createProject = (project: IProjectCreation | IProject): Promise<IProject> => {
    return this.post("/projects", project)
  }

  public updateProject = (project: IProject): Promise<IProject> => {
    return this.put(project["@id"], project)
  }

  public deleteProject = (project: IProject): Promise<void> => {
    return this.delete(project["@id"])
  }
  /* #endregion */

  /* #region ProjectMembership */
  public createProjectMembership = (project: IProjectMembership): Promise<IProjectMembership> => {
    return this.post("/project_memberships", project)
  }

  public updateProjectMembership = (projectMembership: IProjectMembership): Promise<IProjectMembership> => {
    return this.put(projectMembership["@id"], projectMembership)
  }

  public deleteProjectMembership = (projectMembership: IProjectMembership): Promise<void> => {
    return this.delete(projectMembership["@id"])
  }
  /* #endregion */

  /* #region User */
  public getUserByUsername = (username: string): Promise<IUser> => {
    return this.getUsers({ username }).then((users) => users["hydra:member"].shift())
  }

  public getUser = (id: number): Promise<IUser> => {
    return this.get(`/users/${id}`)
  }

  public getUsers = (query: any = {}): Promise<IHydraCollection<IUser>> => {
    return this.get("/users", query)
  }

  public createUser = (user: IUser): Promise<IUser> => {
    return this.post("/users", user)
  }

  public registerUser = (user: IRegistration): Promise<IUser> => {
    return this.post("/users/register", user)
  }

  public updateUser = (user: IUser): Promise<IUser> => {
    return this.put(user["@id"], user)
  }

  public deleteUser = (user: IUser): Promise<void> => {
    return this.delete(user["@id"])
  }
  /* #endregion */

  /* #region Validation */
  public confirmValidation = (id: string, token: string): Promise<boolean> => {
    return this.post(`/validations/${id}/confirm`, { token })
  }

  public resetPassword = (id: string, token: string, password: string): Promise<boolean> => {
    return this.post(`/validations/${id}/confirm`, { token, password })
  }
  /* #endregion */
}

export default new FCPClient(FCP_API_ENTRYPOINT)
