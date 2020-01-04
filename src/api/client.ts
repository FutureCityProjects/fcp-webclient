import { ICredentials, IHydraCollection, IProcess, IUser } from "api/schema"
import { HydraClient } from "services/hydraClient"
import { FCP_API_ENTRYPOINT } from "../../config"

export class FCPClient extends HydraClient {
  public requestAuthToken = (credentials: ICredentials): Promise<string> => {
    return this.post("/authentication_token", credentials)
      .then((res) => res.token)
  }

  public refreshAuthToken = (): Promise<string> => {
    return this.get("/refresh_token")
      .then((res) => res.token)
  }

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
}

export default new FCPClient(FCP_API_ENTRYPOINT)
