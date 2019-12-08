import { ICredentials, IHydraCollection, IProcess, IUser } from "api/schema"
import { HydraClient } from "services/hydraClient"
import { FCP_API_ENTRYPOINT } from "../../config"

export class FCPClient extends HydraClient {
  public requestAuthToken = (credentials: ICredentials): Promise<string> => {
    return this.post("/authentication_token", credentials)
      .then((res) => res.token)
  }

  public refreshAuthToken = (token: string): Promise<string> => {
    return this.get("/refresh_token", {}, token)
      .then((res) => res.token)
  }

  public getUser = (id: number, token: string): Promise<IUser> => {
    return this.get(`/users/${id}`, {}, token)
  }

  public getUserByUsername = (username: string, token: string): Promise<IUser> => {
    return this.getUsers(token, { username }).then((users) => {
      return users["hydra:member"].length ? users["hydra:member"][0] : null
    })
  }

  public getUsers = (token: string, query: any = {}): Promise<IHydraCollection<IUser>> => {
    return this.get("/users", query, token)
  }

  public getCurrentProcess = (token: string): Promise<IProcess> => {
    return this.getProcesses(token).then((processes) => {
      return processes["hydra:member"].length ? processes["hydra:member"][0] : null
    })
  }

  public getProcesses = (token: string): Promise<IHydraCollection<IProcess>> => {
    return this.get("/processes", {}, token)
  }

  public createProcess = (process: IProcess, token: string): Promise<IProcess> => {
    return this.post("/processes", process, token)
  }

  public updateProcess = (process: IProcess, token: string): Promise<IProcess> => {
    return this.put(process["@id"], process, token)
  }
}

export default new FCPClient(FCP_API_ENTRYPOINT)
