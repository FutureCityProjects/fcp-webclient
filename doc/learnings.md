# Learnings
  * OpenSource zu benutzen ist schwierig in einem komplexen Projekt:
    * man stößt schnell an die Grenzen der vorgesehenen Use Cases
    * man stößt oft auf kleine bis größere Bugs
    * die Dokumentation für alles andere als triviale Fälle ist meist nicht vorhanden oder mindestens 
      suboptimal

## Next.js
  * Environment variables can be accessed server-side via ``process.env.ENV_VAR_NAME`` as known in Node, 
    when they are added to the ``env`` option in *next.config.js* they are accessible client-side too.
  * Pages and their componentes do not unmount (and ``componentWillUnmount()`` is not called) when the 
    router changes the page, they are simply discarded, so any running timers etc. can't be cleared → use redux sagas etc. instead

## Redux-Saga
  * When takeLatest() is used the execution of a running saga is cancelled if the same saga is triggered   again, so there is no guarantee each line of code is run, e.g if the token-refresh saga calls 
    ``yield put(refreshTokenAction())`` to restart itself, every line afterwards is never executed.