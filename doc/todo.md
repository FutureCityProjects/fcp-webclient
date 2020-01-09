# Todo
  * translation mit custom keys in der api
  * translation in der _error: validation { project {description { tooShort }}}
  * refactor form error messages: before submit display only errors from touched fields
    (client validation), after submit from all fields (server validation, e.g. empty field is
    required, formik setState?)
  * multipage wizard: https://github.com/vincentntang/multistep-wizard-formik-yup-reactstrap
  * css ins scss statt inline -> einfacher weiterzuverwenden
  * component files .jsx benennen
  * icons als echte .svg ins public dir (caching, served by nginx -> performance)
  * src/assets/icons vs src/components/ui-components/icons ?
  * storing the JWT in localstorage and cookie is discouraged due to XSS vulnerability but how do we send
    it to the server otherwise? Samesite & httponly cookie? No session sync via localstorage but only logout sync? @see https://blog.hasura.io/best-practices-of-using-jwt-with-graphql/#jwt_security
  * confirm password field on registration form
  * accept AGB checkbox on registration form
  * accept privacy declaration on registration form
  * when a logged out user creates a new project and without registering/logging in tries to 
    create another project the first one is overwritten -> show warning instead, only one Project in state.newProject
  * Logout: add option to give a reason why the user was logged out (user was inactive | token refresh   
    failed), if a reason was given redirect to the /login page and show the reason, else redirect to the
    start page -> user logged out manually
  * saga_ran action: replace by ``typeof window !== 'undefined'``? maybe replace next-redux-sage etc too?  @see https://github.com/bbortt/qdrakeboo/pull/11/commits/0df1a76c3bd6aa08807fe71855190abe24d4aa2b
  * we use a handcrafted token-refresh which uses the currently valid JWT to retrieve a new JWT, is there
    any (security) benefit in using specialized refresh tokens? e.g. via https://github.com/markitosgv/JWTRefreshTokenBundle - refresh tokens are probably required for native apps because we don't want the user to login each time he uses the app, for browser usage it's okay to keep only the session alive and then re-login
  