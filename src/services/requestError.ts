export enum RequestErrors {
  accessDenied = "Access Denied",
  badRequest = "Bad Request",
  notFound = "Not Found",
}

export class RequestError extends Error { }
