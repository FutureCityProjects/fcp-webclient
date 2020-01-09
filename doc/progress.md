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
 * Formular für neue Projektidee
 * Registrierungsformular
 * Prozess: Eingabe Idee -> Speichern wenn eingeloggt -> sonst Speichern wenn Login/Registration