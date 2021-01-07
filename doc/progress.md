# 2019-11-11 → 2019-11-17
  * IdleTimer eingebaut
  * Konfiguration via ENV ermöglicht
  * ActiveLinks/Elements im Menu ermöglicht
  * Loginstatus wird zwischen mehreren Tabs synchronisiert
  * TSLint konfiguriert/aktiviert & Code gefixed
  * Übersetzung eingebaut
  * Route-Loading-Indicator eingebaut
  * Test-Umgebung Client eingerichtet + erste Saga- & Komponenten-Tests hinzugefügt
  
# 2019-11-18 → 2019-11-24
  * DB Schema erstellt
  * Backend Unittests DB + API

# 2019-11-25 → 2019-12-01
  * Username, Vorname, Nachname eingefügt
  * Client Typescript- + API-Optiomierung

# 2019-12-02 → 2019-12-08
  * WYSIWYG Formularelemente eingebaut
  * Listen-Formularelemente eingebaut
  * Darstellung der formatierten Eingaben
  * Redirect after Login
  * Errorpage für 403/404/...
  * Prozess bearbeiten

# 2019-12-09 → 2019-12-15
  * Projekt-Stati für Bearbeitungsstand, Aktivität, Sichtbarkeit
  * Lizenz-Recherche
  * Input-Transformation & Validierung für Projekte
  * API für Mitgliedschaften

# 2019-12-16 → 2019-12-22
  * API für Fördertöpfe defined & tested
  * erster Commit vom Backend
  * kleine Anpassungen im Backend

# 2019-12-23 → 2019-12-29
  * API für Zuspitzungen & Jury-Kriterien
  * Message Queue eingerichtet
  * Email Versand + Template eingerichtet
  * Neue Action: User Registrierung mit Validierungsemail
  * Cleanup nach Löschen
    * User: private Daten, Email, Projektverbindungen, Berechtigungen
    * Process: Objektrollen
    * Fördertopf: Objektrollen
  * API für Validierungen

# 2019-12-30 → 2020-01-05
  * Cron Commands & Events (täglich, stündlich)
  * API für Email-Änderung & PW-Reset
  * Account-, Email-Änderung-, PW-Reset-Validierung
  * API für Förderanträge
  * Fortschrittsupdate bei Ausfüllen des Projektprofils
  * Client refactor zu axios interceptor, redux actions/reducers
  * WYSIWYG Tooltips
 
# 2020-01-06 → 2020-01-12
  * Benachrichtungen
  * Formular für neue Projektidee + Projektübernahme
  * Registrierungsformular
  * API für Übergabe von Idee/Projekt bei Registrierung eines Nutzers
  * Prozess: Eingabe Idee -> Speichern wenn eingeloggt -> sonst Speichern wenn Login/Registration
  * Prozess: Idee übernehmen -> Speichern wenn eingeloggt -> sonst Speichern wenn Login/Registration
  * neue UI eingebaut (Startseite, Marktplatz, Demo für Meine Projekte + Projektprofil)
  * dynamische Parameter für die neue UI
  * Marktplatz von der API laden

# 2020-01-13 → 2020-01-19
  * Marktplatz Links zu Idee anlegen, Idee übernehmen, als Mitglied bewerben
  * Seiten für Bewerbung, Profilansicht als Mitglied, Profilbearbeitung als Mitglied, öffentliches
    Projektprofil, Rechte-Prüfung
  * UI Optimierung
  * Datenbereinigung nach Logout, Logout-Grund
  * "Meine Projekte" von der API laden
  * Refactor Sagas, Seitenstruktur
  * Projekte/Ideen zusammen mit dem nicht-validierten Nutzer löschen bei Ablauf der Validierung
  * Fix Redirect zu Seiten mit Parametern nach Login
  * Update API+Client tests

# 2020-01-20 → 2020-01-26
  * Handling Account-Validierung im Client
  * Optimierung Fehlermeldungen + Elementanzeige Forms
  * Vervollständigung Registrierungs-Form
  * Übersetzungen
  * Fördertopfübersicht + Fördertopf anlegen + Fördertopf bearbeiten
  * Zuspitzungen anlegen, bearbeiten, löschen
  * Datepicker, Datumsformatierung
  * Projekt-Profil Bearbeitung
  * Projekt-Profil Status ans Tableau angeschlossen

# 2020-01-27 → 2020-02-02
  * ProgressBox verallgemeinert
  * Fördertopf freischalten
  * Fördertopf auswählen
  * Schema für Aufgaben, Arbeitspakete, Ressourcen
  * Zuspitzung angeben
  * Footer Links
  * Projektplan-Übersicht + Projektplan-Texte bearbeiten
  * Zahl + Währungsformatierung
  * API für Arbeitspakete + Tasks
  * Zeichencounter unter WYSIWYG
  * Marktplatz Carousel eingebaut

# 2020-02-03 → 2020-02-09
  * Aufgabenbearbeitung eingebaut
  * API für Antragsdaten
  * Bearbeitung Antragsdaten im Client
  * Bearbeitung Fördersumme
  * API Antrag einreichen
  * Antrag einreichen im Client
  * Build fix + DockerFile + Production Build auf Dev API unter fcp.vrok.de
  * optimize market carousel
  * Arbeitspaketverwaltung eingebaut
  * API für Ressourcenbedarf (1.25h)
  * Komponenten für Ressourcenbedarf (9.5h)
  
# 2020-02-10 → 2020-02-16
  * autocomplete-Feld
  * Komponenten erweitert für Finanzierung
  * Finanzierung eingebaut, Anzeige im Projektplan
  * Öffentliches Projektprofil befüllt
  * Formular für Mitgliedsbewerbung
  * diverse Link-Fixes, Funktions-Fixes, CSS-Order-Fix
  * API Für Mitgliedsbewerbung in Kombination mit Registrierung
  * Mitgliedsbewerbung funktioniert eingeloggt, nach Login und bei Registrierung
  * Anzeige meiner Bewerbungen bei meinen Projekten
  * Bewerbung zurückziehen

# 2020-02-17 → 2020-02-23
  * Usability & Fixes
  * öffentliche Prozess-Seite
  * Öffentliche Fördertopfansicht
  * Zeitplan eingebaut
  * Projektplanübersicht angepasst
  * Förderantragsanzeige vor Einreichen
  * API: Speicherung kompletter Antragsdaten bei Einreichen
  * Förderantragsanzeige unveränderbar nach Einreichen
  * Docker-Umgebung für Demo-Day
  * API: Option um Email-Validierung an-/abzuschalten
  * Fix Redirect-Loop nach abgelaufener Auth