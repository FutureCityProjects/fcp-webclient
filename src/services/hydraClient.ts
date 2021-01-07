import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import getProp from "lodash/get"
import hasProp from "lodash/has"
import mapValues from "lodash/mapValues"

import { RequestError } from "./requestError"
import { SubmissionError } from "./submissionError"

export const LD_MIME_TYPE = "application/ld+json"

export interface IViolation {
  message: string
  propertyPath: string
}

export class HydraClient {
  // @todo public to allow setting interceptors, create an addInterceptor() instead?
  public axios: AxiosInstance

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
      headers: {
        "accept": LD_MIME_TYPE,
        "content-type": LD_MIME_TYPE,
      },
    })
  }

  public get = (url: string, params: Record<string, unknown> = {}, config: AxiosRequestConfig = {}): Promise<any> => {
    config.method = "get"
    config.params = params

    return this.request(url, config)
  }

  public post = (url: string, data: unknown, config: AxiosRequestConfig = {}): Promise<any> => {
    config.method = "post"
    config.data = JSON.stringify(data)

    return this.request(url, config)
  }

  public put = (url: string, data: Record<string, unknown>, config: AxiosRequestConfig = {}): Promise<any> => {
    config.method = "put"
    config.data = JSON.stringify(data)

    return this.request(url, config)
  }

  public delete = (url: string, config: AxiosRequestConfig = {}): Promise<any> => {
    config.method = "delete"

    return this.request(url, config)
  }

  public request = (url: string, config: AxiosRequestConfig = {}): Promise<any> => {
    const axiosConfig = {
      ...config,
      url,
    }

    // the Authorization header is added via interceptor
    return this.axios.request(axiosConfig)
      // @todo we don't want to flatten nested documents, some properties are only readable
      // as subresource, remove the normalize completely?
      // .then((response: AxiosResponse) => this.normalize(response.data))
      .then((response: AxiosResponse) => response.data as unknown)
      .catch(this.handleError)
  }

  protected normalize = (data: Record<string, any>): any => {
    if (hasProp(data, "hydra:member")) {
      // Normalize items in collections
      data["hydra:member"] = data["hydra:member"].map((item: any) => this.normalize(item))

      return data
    }

    // Flatten nested documents
    return mapValues(data, (value) =>
      Array.isArray(value)
        ? value.map((v) => getProp(v, "@id", v))
        : getProp(value, "@id", value),
    )
  }

  protected handleError = (err: AxiosError): void => {
    if (err.response) {
      const json = err.response.data
      const msg = json["hydra:description"] || json.message || err.response.statusText

      if (!json.violations) {
        throw Error(msg)
      }

      const errors = {} // @todo do we ever need the general error when violations exist? { _error: msg }
      json.violations.map((violation: IViolation) => {
        this.addViolationToErrors(violation, errors, this.parsePropertyPath(violation.propertyPath))
      })

      throw new SubmissionError(errors)
    }

    // @todo log RequestError for monitoring

    if (err.request) {
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new RequestError("failure.noNetworkResponse")
    }

    throw new RequestError("failure.sendingRequest")
  }

  private addViolationToErrors = (violation: IViolation, errors: any, pathList: string[]): Record<string, unknown> | string => {
    if (pathList.length) {
      const prop = pathList.shift()
      const res = this.addViolationToErrors(violation, errors ? errors[prop] : null, pathList)
      if (errors) {
        errors[prop] = res
      } else {
        errors = { [prop]: res }
      }
      return errors
    } else {
      return errors
        ? errors + "\n" + violation.message
        : violation.message
    }
  }

  /**
   * API Platform returns a list of violations, one element for each failed constraint, in the form
   * of propertyPath => message. But if the property is an array it returns prop[i] => message,
   * if the property is nested it returns prop.subProp => message (or even prop[i].subProp),
   * which is not what redux-form expects in its SubmissionError. So we have to parse the path to build
   * a nested errors object.
   */
  private parsePropertyPath = (path: string): string[] => {
    let pathList = []
    let baseProp = path

    const nestStart = path.indexOf(".")
    if (nestStart > 0) {
      baseProp = baseProp.substring(0, nestStart)
    }

    const arrayPropRegex = /\[(.+?)]/g
    const arrayStart = path.indexOf("[")

    if (arrayStart > 0) {
      baseProp = baseProp.substring(0, arrayStart)
      pathList.push(baseProp)

      let matches: RegExpExecArray
      do {
        matches = arrayPropRegex.exec(path)
        if (matches) {
          pathList.push(matches[1])
        }
      } while (matches)
    } else {
      pathList.push(path)
    }

    pathList = nestStart > 0
      ? [...pathList, ...this.parsePropertyPath(path.substring(nestStart + 1))]
      : pathList

    return pathList
  }
}
