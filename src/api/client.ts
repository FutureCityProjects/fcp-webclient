import { ICredentials, IHydraCollection, IProcess, IProject, IProjectMembership, IUser, IRegistration } from "api/schema"
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

  /* #region User */
  public getUser = (id: number): Promise<IUser> => {
    return this.get(`/users/${id}`)
  }

  public getUserByUsername = (username: string): Promise<IUser> => {
    return this.getUsers({ username }).then((users) => {
      return users["hydra:member"].length ? users["hydra:member"][0] : null
    })
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
  /* #endregion */

  /* #region Process */
  // @todo update when multi-processes are implemented
  public getCurrentProcess = (): Promise<IProcess> => {
    return this.getProcesses().then((processes) => {
      return processes["hydra:member"].length ? processes["hydra:member"][0] : null
    })
  }

  public getProcesses = (): Promise<IHydraCollection<IProcess>> => {
    return this.get("/processes")
  }

  public createProcess = (process: IProcess): Promise<IProcess> => {
    return this.post("/processes", process)
  }

  public updateProcess = (process: IProcess): Promise<IProcess> => {
    return this.put(process["@id"], process)
  }
  /* #endregion */

  /* #region Project */
  public getProject = (id: number): Promise<IProject> => {
    return this.get(`/projects/${id}`)
  }

  public getProjectBySlug = (slug: string): Promise<IProject> => {
    return this.getProjects({ slug }).then((projects) => {
      return projects["hydra:member"].length ? projects["hydra:member"][0] : null
    })
  }

  public getProjects = (query: any = {}): Promise<IHydraCollection<IProject>> => {
    return this.get("/projects", query)
  }

  public createProject = (project: IProject): Promise<IProject> => {
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
}

export default new FCPClient(FCP_API_ENTRYPOINT)
