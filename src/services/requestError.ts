export enum RequestErrors {
  AccessDenied = "Access Denied",
  BadRequest = "Bad Request",
  NotFound = "Not Found",
}

export class RequestError extends Error { }
