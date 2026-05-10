/**
 * REGISTER.JS - Registrierungs-Seite
 * 
 * AUFGABE: Verwaltet die Registrierung neuer Benutzer mit folgenden Funktionen:
 * - Neues Konto erstellen
 * - Benutzername prüfen ob bereits verwendet
 * - Passwort verschlüsseln
 * - Sprache wechseln (Deutsch/Englisch)
 * - Fehlerbehandlung und Nachrichten
 */

// ===== SICHERHEITS-CHECK =====
// Wenn Benutzer bereits eingeloggt ist: Leite zu Dashboard um
// (Eingeloggte sollten keine neue Registrierung machen)
if (localStorage.getItem('logged_in_user')) {
    window.location.href = 'dashboard.html';  // Gehe zur Dashboard-Seite
}

// ===== SPRACHTEXTE =====
// Dieses Objekt enthält alle Texte in zwei Sprachen
// translations['de'] = deutsche Texte
// translations['en'] = englische Texte
const translations = {
    de: {
        pageTitle: 'Registrieren',
        pageDescription: 'Bitte registrieren Sie sich mit Benutzername und Passwort.',
        username: 'Benutzername',
        password: 'Passwort',
        submitRegister: 'Registrieren',
        note: 'Passwörter werden lokal gehasht, bevor sie gespeichert oder geprüft werden.',
        toggleText: 'Bereits registriert?',
        toggleButton: 'Anmelden',
        usernamePlaceholder: 'Ihr Benutzername',
        passwordPlaceholder: 'Mindestens 8 Zeichen',
        successRegister: 'Registrierung erfolgreich. Sie werden zum Dashboard weitergeleitet.',
        errorRegister: 'Registrierung fehlgeschlagen. Der Benutzername ist bereits vergeben.',
        errorInvalid: 'Bitte füllen Sie alle Felder korrekt aus.'
    },
    en: {
        pageTitle: 'Register',
        pageDescription: 'Please register with username and password.',
        username: 'Username',
        password: 'Password',
        submitRegister: 'Register',
        note: 'Passwords are hashed locally before storage or verification.',
        toggleText: 'Already registered?',
        toggleButton: 'Sign in',
        usernamePlaceholder: 'Your username',
        passwordPlaceholder: 'At least 8 characters',
        successRegister: 'Registration complete. Redirecting to dashboard.',
        errorRegister: 'Registration failed. The username is already taken.',
        errorInvalid: 'Please fill in all fields correctly.'
    }
};

// ===== VARIABLEN (Speicherplätze für Werte) =====
let language = 'de';  // 'de' = Deutsch oder 'en' = Englisch

// ===== DOM-ELEMENTE =====
// Das sind die HTML-Elemente auf der Seite, mit denen der JavaScript kommuniziert
// document.getElementById('name') = Suche HTML-Element mit id="name"
const submitButton = document.getElementById('submitButton');  // Der "Registrieren"-Button
const message = document.getElementById('message');  // Nachrichten-Feld für Fehlermeldungen
const languageToggle = document.getElementById('languageToggle');  // Sprach-Schalter (EN/DE)
const authForm = document.getElementById('authForm');  // Das gesamte Registrierungs-Formular
const passwordInput = document.getElementById('password');  // Das Passwort-Feld
const toggleText = document.getElementById('toggleText');  // Text wie "Bereits registriert?"

// Sammlung aller Beschriftungen/Labels
const labels = {
    pageTitle: document.getElementById('page-title'),  // Seitentitel
    pageDescription: document.getElementById('page-description'),  // Beschreibung
    labelUsername: document.getElementById('label-username'),  // "Benutzername"-Label
    labelPassword: document.getElementById('label-password')  // "Passwort"-Label
};

// ===== FUNKTIONEN =====

/**
 * updateText()
 * 
 * AUFGABE: Aktualisiere alle Texte auf der Seite in der aktuellen Sprache
 * 
 * ABLAUF:
 * 1. Hole die Texte für die aktuelle Sprache aus 'translations'
 * 2. Aktualisiere alle HTML-Elemente mit den neuen Texten
 */
function updateText() {
    const t = translations[language];  // Hole Texte in aktueller Sprache
    
    // Aktualisiere alle Überschriften und Beschreibungen
    labels.pageTitle.textContent = t.pageTitle;
    labels.pageDescription.textContent = t.pageDescription;
    labels.labelUsername.textContent = t.username;
    labels.labelPassword.textContent = t.password;
    
    // Aktualisiere Platzhalter-Texte in den Eingabefeldern
    document.getElementById('username').placeholder = t.usernamePlaceholder;
    passwordInput.placeholder = t.passwordPlaceholder;
    
    // Aktualisiere Notiz-Text
    document.querySelector('.note').textContent = t.note;
    
    // Aktualisiere Button-Texte
    submitButton.textContent = t.submitRegister;
    toggleText.textContent = t.toggleText;
    
    // Wechsle Sprach-Button zwischen EN und DE
    languageToggle.textContent = language === 'de' ? 'EN' : 'DE';
    
    // Tipps für den Browser bei der Passwort-Verwaltung
    passwordInput.autocomplete = "new-password";  // "Neues Passwort" nicht "Existierendes"
}

/**
 * hashPassword(password)
 * 
 * AUFGABE: Verschlüssele das Passwort mit SHA-256 Hashing
 * 
 * PARAMETER:
 * - password: Das Passwort als Text (z.B. "meinPassword123")
 * 
 * RÜCKGABE: Das verschlüsselte Passwort als Text (z.B. "a1b2c3d4...")
 * 
 * WICHTIG: 
 * - Das Passwort wird NICHT lesbar, nur die Verschlüsselung wird gespeichert
 * - "async" bedeutet: Diese Funktion braucht Zeit zum Ausführen
 * - Deshalb verwenden wir "await" um zu warten, bis sie fertig ist
 */
async function hashPassword(password) {
    // Konvertiere das Passwort in Bytes (Zahlenwerte)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Berechne die SHA-256 Verschlüsselung (längere Berechnung)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Konvertiere Bytes zurück zu Text (Hexadezimal)
    // map = "für jedes Byte mache folgendes"
    // b.toString(16) = Konvertiere Zahl zu hexadezimalen Text (0-F)
    // padStart(2, '0') = Füge '0' vorne hinzu wenn nötig (z.B. "5" wird zu "05")
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');  // Verbinde alle Teile zu einem Text
}

/**
 * handleRegister(event)
 * 
 * AUFGABE: Verarbeite das Absenden des Registrierungs-Formulars
 * 
 * PARAMETER:
 * - event: Das Form-Submit-Event (automatisch übergeben)
 * 
 * ABLAUF:
 * 1. Stoppe das Standard-Form-Verhalten (Seite neuladen)
 * 2. Hole Benutzername und Passwort aus den Eingabefeldern
 * 3. Überprüfe ob beide Felder gefüllt sind
 * 4. Überprüfe ob Benutzername bereits existiert
 * 5. Verschlüssele das Passwort
 * 6. Speichere neuen Benutzer in der Datenbank
 * 7. Melde Benutzer automatisch an
 * 8. Leite zum Dashboard um
 */
async function handleRegister(event) {
    event.preventDefault();  // Verhindere Seiten-Neuladen
    
    // Hole Werte aus HTML-Eingabefeldern
    const username = document.getElementById('username').value.trim();  // trim() entfernt Leerzeichen
    const password = passwordInput.value;
    const t = translations[language];  // Hole Nachrichten in aktueller Sprache
    
    // VALIDIERUNG: Überprüfe ob alle Felder korrekt gefüllt sind
    if (!username || !password || password.length < 8) {
        // Zeige Fehlermeldung
        message.textContent = t.errorInvalid;
        message.className = 'message error';  // CSS-Klasse für rote Farbe
        return;  // Beende Funktion hier
    }
    
    // DUPLIKAT-PRÜFUNG: Existiert der Benutzername bereits?
    // Diese Funktion kommt aus userDatabase.js
    if (typeof databaseHasUser === 'function' && databaseHasUser(username)) {
        // FEHLER: Benutzername ist bereits vergeben
        message.textContent = t.errorRegister;
        message.className = 'message error';
        return;
    }
    
    // Verschlüssele das eingegebene Passwort
    const passwordHash = await hashPassword(password);
    
    // SPEICHERN: Speichere neuen Benutzer in der Datenbank
    // Diese Funktion kommt aus userDatabase.js
    if (typeof saveUserToDatabase === 'function') {
        saveUserToDatabase(username, passwordHash);
    }
    
    // ANMELDEN: Speichere Benutzernamen im Browser-Speicher
    localStorage.setItem('logged_in_user', username);
    
    // Zeige Erfolgs-Meldung
    message.textContent = t.successRegister;
    message.className = 'message success';  // CSS-Klasse für grüne Farbe
    
    // Warte 1,5 Sekunden (1500 Millisekunden) damit Benutzer die Erfolgs-Meldung sieht
    setTimeout(() => { 
        window.location.href = 'dashboard.html';  // Gehe zu Dashboard
    }, 1500);
}

// ===== EVENT-LISTENER (Reagiere auf Benutzer-Aktionen) =====

// Wenn Sprach-Button angeklickt wird
languageToggle.addEventListener('click', () => {
    language = language === 'de' ? 'en' : 'de';  // Wechsle zwischen Sprachen
    updateText();  // Aktualisiere alle Texte
});

// Wenn Form abgesendet wird (Registrieren-Button geklickt)
authForm.addEventListener('submit', handleRegister);

// ===== INITIALISIERUNG (Beim Seitenstart) =====
updateText();  // Setze alle Texte beim Laden der Seite
