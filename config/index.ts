// Set the environment variables shown below to configure the app.
// FCP_API_ENTRYPOINT & BASE_URL are the only required options.
// Via next.config.js these options are also exposed to the client side so access is isomorphic.

export const FCP_API_ENTRYPOINT = process.env.FCP_API_ENTRYPOINT
  ? process.env.FCP_API_ENTRYPOINT
  : "https://example.net/api"

// under which URL is this client running?
// used to generate URLs to send to the API to be sent via email, e.g. for validations
export const BASE_URL = process.env.BASE_URL
  ? process.env.BASE_URL
  : "https://example.net/api"

// cookie name used to send the JWT to the server for server-side rendering
// of pages/contents requiring authentication
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME
  ? process.env.AUTH_COOKIE_NAME
  : "fcp.authToken"

// name of the localStorage item that is used to sync the auth between browser tabs,
// should be individualized to prevent problems when a user accesses two different
// FCP instances
export const AUTH_LOCALSTORAGE_NAME = process.env.AUTH_LOCALSTORAGE_NAME
  ? process.env.AUTH_LOCALSTORAGE_NAME
  : "fcp.authToken"

// number of seconds before the JWT expires the app will try to refresh is,
// must be below the JWT TTL, should account for network delay and [-3,+3] secs. randomization
export const AUTH_REFRESH_THRESHOLD: number = process.env.AUTH_REFRESH_THRESHOLD
  ? parseInt(process.env.AUTH_REFRESH_THRESHOLD, 10)
  : 30

// number of seconds after which the user is logged out if he wasn't active,
// listens to DOMEvents like mousedown, keydown, ...
export const AUTH_IDLE_TIMEOUT: number = process.env.AUTH_IDLE_TIMEOUT
  ? parseInt(process.env.AUTH_IDLE_TIMEOUT, 10)
  : 3600
