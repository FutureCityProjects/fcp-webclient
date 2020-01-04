# Todo
  * fonts nicht von google laden -> local
  * css ins scss statt inline -> einfacher weiterzuverwenden
  * component files .jsx benennen
  * icons als echte .svg ins public dir (caching, served by nginx -> performance)
  * src/assets/icons vs src/components/ui-components/icons ?
  * Tooltips for the RTE (https://codepen.io/quill/pen/ozYEro, https://github.com/quilljs/quill/issues/650)
  * storing the JWT in localstorage and cookie is discouraged due to XSS vulnerability but how do we send
    it to the server otherwise? Samesite & httponly cookie? No session sync via localstorage but only logout sync? @see https://blog.hasura.io/best-practices-of-using-jwt-with-graphql/#jwt_security
  * include Alerts, e.g. like https://github.com/bbortt/qdrakeboo/blob/master/source/frontend/next-js-web-ui/app/state/reducer/alert.reducer.js
  * Logout: add option to give a reason why the user was logged out (user was inactive | token refresh   
    failed), if a reason was given redirect to the /login page and show the reason, else redirect to the
    start page -> user logged out manually
  * saga_ran action: replace by ``typeof window !== 'undefined'``? maybe replace next-redux-sage etc too?  @see https://github.com/bbortt/qdrakeboo/pull/11/commits/0df1a76c3bd6aa08807fe71855190abe24d4aa2b
  * we use a handcrafted token-refresh which uses the currently valid JWT to retrieve a new JWT, is there
    any (security) benefit in using specialized refresh tokens? e.g. via https://github.com/markitosgv/JWTRefreshTokenBundle - refresh tokens are probably required for native apps because we don't want the user to login each time he uses the app, for browser usage it's okay to keep only the session alive and then re-login
  