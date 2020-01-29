# Todo
  * Prozess-Edit: Kriterien sind als Pflicht markiert, absenden geht ohne?
  * Testen: FÖrdertopfauswahl als ProjektOwner - keine inaktiven Funds
  * Testen: Fördertopfauswahl ohne Funds
  * Zurück-Button bei Freischaltungs-Bestätigung Fund
  * The type of the "maximumGrant" attribute must be "float", "string" given.
  * Minlength Validator schliesst HTML mit ein
  * Invalid credentials Übersetzung
  * RTE toolbar konfigurierbar für PO + Members etc
  * refactor form error messages: before submit display only errors from touched fields
    (client validation), after submit from all fields (server validation, e.g. empty field is
    required, formik setState?)
  * WYSIWYG als Markdown speichern
    * use https://github.com/domchristie/turndown to generate markdown from quill html.
    * use markdown-to-jsx to render the markdown instead of using
      dangerouslySetInnerHtml
    * use https://reactjs.org/docs/react-dom-server.html#rendertostring to set the markdown-to-jsx
      as HTML in the editor
    * or use https://github.com/showdownjs/showdown for bidirectional conversion +
      https://www.npmjs.com/package/html-to-react for display
    * or use only html-to-react for display
  * UserManagement lädt nicht die Liste aller User wenn schon/nur der eingeloggte User in der
    Liste ist
  * multipage wizard: https://github.com/vincentntang/multistep-wizard-formik-yup-reactstrap
  * component files .jsx benennen
  * icons als echte .svg ins public dir (caching, served by nginx -> performance)
  * Passwort minlength/strength validieren in der API
  * storing the JWT in localstorage and cookie is discouraged due to XSS vulnerability but how
    do we send it to the server otherwise? Samesite & httponly cookie? No session sync via localstorage but only logout sync? @see https://blog.hasura.io/best-practices-of-using-jwt-with-graphql/#jwt_security
  * Muss Zustimmung zu den AGB und zur Datenspeicherung unabhängig erfolgen?
    * Muss die Zustimmung gesondert gespeichert werden, bspw. mit Zeitstempel / bool-Feld / IP?
  * when a logged out user creates a new project and without registering/logging in tries to 
    create another project the first one is overwritten -> show warning instead, only one Project in state.newProject
  * locale not hardcoded in FormikDate, dateFormat
  * saga_ran action: replace by ``typeof window !== 'undefined'``? maybe replace next-redux-sage etc too?  @see https://github.com/bbortt/qdrakeboo/pull/11/commits/0df1a76c3bd6aa08807fe71855190abe24d4aa2b
  * we use a handcrafted token-refresh which uses the currently valid JWT to retrieve a new JWT, is there
    any (security) benefit in using specialized refresh tokens? e.g. via https://github.com/markitosgv/JWTRefreshTokenBundle - refresh tokens are probably required for native apps because we don't want the user to login each time he uses the app, for browser usage it's okay to keep only the session alive and then re-login
  * use `<time>` and other semantic elements in markup


  * Prio low fixes
    * Project-Tableau Hover Bug: http://prntscr.com/qs7ukj
    * project tableau overflows project card on high zoom