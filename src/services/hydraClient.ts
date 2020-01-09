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
        "Accept": LD_MIME_TYPE,
        "Content-Type": LD_MIME_TYPE,
      },
    })
  }

  public get = (url: string, params: object = {}, config: AxiosRequestConfig = {}) => {
    config.method = "get"
    config.params = params

    return this.request(url, config)
  }

  public post = (url: string, data: object, config: AxiosRequestConfig = {}) => {
    config.method = "post"
    config.data = JSON.stringify(data)

    return this.request(url, config)
  }

  public put = (url: string, data: object, config: AxiosRequestConfig = {}) => {
    config.method = "put"
    config.data = JSON.stringify(data)

    return this.request(url, config)
  }

  public delete = (url: string, config: AxiosRequestConfig = {}) => {
    config.method = "delete"

    return this.request(url, config)
  }

  public request = (url: string, config: AxiosRequestConfig = {}) => {
    const axiosConfig = {
      ...config,
      url,
    }

    // the Authorization header is added via interceptor
    return this.axios.request(axiosConfig)
      // @todo we don't want to flatten nested documents, some properties are only readable
      // as subresource, remove the normalize completely?
      // .then((response: AxiosResponse) => this.normalize(response.data))
      .then((response: AxiosResponse) => response.data)
      .catch(this.handleError)
  }

  protected normalize = (data: any) => {
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

  protected handleError = (err: AxiosError) => {
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

    if (err.request) {
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(err.request)

      throw new RequestError("The request was made, but no response was received")
    }

    throw new RequestError("Something happened in setting up the request that triggered an Error")
  }

  private addViolationToErrors = (violation: IViolation, errors: any, pathList: string[]): object | string => {
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
   * of propertyPath => message. But if the property is nested it returns prop[subProp] => message
   * which is not what redux-form expects in its SubmissionError. So we have to parse the path to build
   * a nested errors object.
   */
  private parsePropertyPath = (path: string): string[] => {
    const pathList = []
    const nestedPropRegex = /\[(.+?)]/g
    const nestedStart = path.indexOf("[")

    if (nestedStart > 0) {
      const baseProp = path.substring(0, nestedStart)
      pathList.push(baseProp)

      let matches
      do {
        matches = nestedPropRegex.exec(path)
        if (matches) {
          pathList.push(matches[1])
        }
      } while (matches)
    } else {
      pathList.push(path)
    }

    return pathList
  }
}
