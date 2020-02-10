# Todo
  * norbert wifö
  * norbert app
  * logout zeigt keine meldungen
  * pakete erst bei Aufgaben freischalten
  * ressourcen erst bei aufgaben freischalten
  * gesamtsumme in res + taskview
  * set focus on taskpopover input + package first input + resource first input when 
    popover/modal opens
  * Einreichen nur mit owner PW
  * Keine Bearbeitung Antragsdaten wenn bereits eingereicht?
  * DropdownComponent rendert leere Buttons im Menu weil sie <AuthElement> als nicht-leer
    erkennt. (autowrap true/false)
  * warning tasks löschen wenn resourcen (task page + wp page), resourcen aktualisieren wenn task gelöscht wird
  * logout wegen inaktivität notice nicht verschwinden lassen
  * RTE toolbar konfigurierbar für PO + Members etc
  * Wie kann die Zuspitzung als complete markiert werden? Wir wissen in ProjectStatus die Anzahl der
    FundConcretizations nicht -> Fortschritt ähnlich wie beim Project preUpdate tracken
  * Logo / Bild Platzhalter für Demo
  * refactor form error messages: before submit display only errors from touched fields
    (client validation), after submit from all fields (server validation, e.g. empty field is
    required, formik setState?)
  * optimize carousel: smaller cards, show partial card, hide buttons/move outside
  * validate: tasks that have a workpackage ID that does not exist (still catched by "tasksWithoutPackage")
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
  * isLocked ausgeben für owner + member
    * auswerten in myProjectCard + unterseiten
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
  * update redux.md to reflect generalized request state & scoping
  * use `<time>` and other semantic elements in markup
  * how to customize translation for different instances?
  * how to customize styling for different instances?

  * Prio low fixes
    * Project-Tableau Hover Bug: http://prntscr.com/qs7ukj
    * project tableau overflows project card on high zoom
    * slider labels schieben sich schon bei relativ hohen bildschirmbreiten inneinander: http://prntscr.com/quxsi4
    * a.btn mit Icon hat noch einen active rahmen: http://prntscr.com/qv56ch