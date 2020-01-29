export enum REQUEST_ERRORS {
  ACCESS_DENIED = "Access Denied",
  BAD_REQUEST = "Bad Request",
  NOT_FOUND = "Not Found",
}

export class RequestError extends Error { }
