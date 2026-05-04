/**
 * LOGIN.JS - Login und Registrierung
 * 
 * Dieses Script verwaltet die Login- und Registrierungsseite.
 * Benutzerdaten werden zentral in einer lokalen Browser-Datenbank gespeichert.
 *
 * Die Datenbank ist eine JSON-Struktur in localStorage, z.B.:
 * {
 *   "maxmustermann": { "passwordHash": "..." },
 *   "anna": { "passwordHash": "..." }
 * }
 *
 * Zusätzlich wird die aktive Sitzung im Schlüssel 'logged_in_user' gespeichert.
 */

// Wenn bereits angemeldet, direkt zum Dashboard
if (localStorage.getItem('logged_in_user')) {
    window.location.href = 'dashboard.html';
}

// Übersetzungen für Deutsch und Englisch
const translations = {
    de: {
        pageTitle: 'Login',
        pageDescription: 'Bitte melden Sie sich mit Benutzername und Passwort an.',
        username: 'Benutzername',
        password: 'Passwort',
        submitLogin: 'Einloggen',
        submitRegister: 'Registrieren',
        note: 'Passwörter werden lokal gehasht, bevor sie gespeichert oder geprüft werden.',
        toggleTextLogin: 'Noch kein Konto?',
        toggleTextRegister: 'Bereits registriert?',
        toggleButtonLogin: 'Registrieren',
        toggleButtonRegister: 'Anmelden',
        usernamePlaceholder: 'Ihr Benutzername',
        passwordPlaceholder: 'Mindestens 8 Zeichen',
        successLogin: 'Erfolgreich eingeloggt!',
        successRegister: 'Registrierung erfolgreich. Sie können sich jetzt einloggen.',
        errorLogin: 'Login fehlgeschlagen. Bitte prüfen Sie Benutzername und Passwort.',
        errorRegister: 'Registrierung fehlgeschlagen. Der Benutzername ist bereits vergeben.',
        errorInvalid: 'Bitte füllen Sie alle Felder korrekt aus.'
    },
    en: {
        pageTitle: 'Login',
        pageDescription: 'Please sign in with username and password.',
        username: 'Username',
        password: 'Password',
        submitLogin: 'Login',
        submitRegister: 'Register',
        note: 'Passwords are hashed locally before storage or verification.',
        toggleTextLogin: 'No account yet?',
        toggleTextRegister: 'Already registered?',
        toggleButtonLogin: 'Register',
        toggleButtonRegister: 'Sign in',
        usernamePlaceholder: 'Your username',
        passwordPlaceholder: 'At least 8 characters',
        successLogin: 'Logged in successfully!',
        successRegister: 'Registration complete. You can now log in.',
        errorLogin: 'Login failed. Please check username and password.',
        errorRegister: 'Registration failed. The username is already taken.',
        errorInvalid: 'Please fill in all fields correctly.'
    }
};

// ===== VARIABLEN =====
// Aktueller Modus: 'login' oder 'register'
let mode = 'login';
// Sprache: 'de' oder 'en'
let language = 'de';

// ===== DOM-ELEMENTE REFERENZIEREN =====
const submitButton = document.getElementById('submitButton');
const toggleModeButton = document.getElementById('toggleMode');
const toggleText = document.getElementById('toggleText');
const message = document.getElementById('message');
const languageToggle = document.getElementById('languageToggle');

const labels = {
    pageTitle: document.getElementById('page-title'),
    pageDescription: document.getElementById('page-description'),
    labelUsername: document.getElementById('label-username'),
    labelPassword: document.getElementById('label-password')
};

// Referenz zum Login-/Registrierungsformular
const authForm = document.getElementById('authForm');

// ===== FUNKTIONEN =====

/**
 * Aktualisiert alle Texte auf der Seite basierend auf der gewählten Sprache
 */
function updateText() {
    const t = translations[language];
    labels.pageTitle.textContent = t.pageTitle;
    labels.pageDescription.textContent = t.pageDescription;
    labels.labelUsername.textContent = t.username;
    labels.labelPassword.textContent = t.password;
    document.getElementById('username').placeholder = t.usernamePlaceholder;
    document.getElementById('password').placeholder = t.passwordPlaceholder;
    document.querySelector('.note').textContent = t.note;
    languageToggle.textContent = language === 'de' ? 'EN' : 'DE';
    if (mode === 'login') {
        submitButton.textContent = t.submitLogin;
        toggleText.textContent = t.toggleTextLogin;
        toggleModeButton.textContent = t.toggleButtonLogin;
    } else {
        submitButton.textContent = t.submitRegister;
        toggleText.textContent = t.toggleTextRegister;
        toggleModeButton.textContent = t.toggleButtonRegister;
    }
}

/**
 * Generiert einen SHA-256 Hash aus dem Passwort
 * (Passwörter werden NICHT im Klartext gespeichert!)
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verarbeitet Login und Registrierung
 * - LOGIN: Prüft Benutzerdaten gegen die zentrale lokale Datenbank
 * - REGISTRIERUNG: Speichert neue Benutzer in der lokalen Datenbank
 */
async function handleAuth(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const t = translations[language];

    if (!username || !password || password.length < 8) {
        message.textContent = t.errorInvalid;
        message.className = 'message error';
        return;
    }

    const passwordHash = await hashPassword(password);
    const storedUser = getUserFromDatabase(username);

    if (mode === 'login') {
        if (!storedUser || storedUser.passwordHash !== passwordHash) {
            message.textContent = t.errorLogin;
            message.className = 'message error';
            return;
        }

        localStorage.setItem('logged_in_user', username);
        window.location.href = 'dashboard.html';
    } else {
        if (databaseHasUser(username)) {
            message.textContent = t.errorRegister;
            message.className = 'message error';
            return;
        }

        saveUserToDatabase(username, passwordHash);
        localStorage.setItem('logged_in_user', username);
        window.location.href = 'dashboard.html';
    }
}

/**
 * Wechselt zwischen Login- und Registrierungsmodus
 */
function setMode(newMode) {
    mode = newMode;
    updateText();
    message.textContent = '';
    message.className = 'message';
}

// ===== EVENT-LISTENER =====
// Button zum Umschalten zwischen Login und Registrierung
toggleModeButton.addEventListener('click', () => {
    setMode(mode === 'login' ? 'register' : 'login');
});

// Button zum Umschalten der Sprache
languageToggle.addEventListener('click', () => {
    language = language === 'de' ? 'en' : 'de';
    setMode(mode);
});

// Formular absenden (Login oder Registrierung)
authForm.addEventListener('submit', handleAuth);
// Beim Laden: Texte initialisieren
updateText();
