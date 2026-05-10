/**
 * LOGIN.JS - Login und Registrierung
 */

// Wenn bereits angemeldet, direkt zum Dashboard
if (localStorage.getItem('logged_in_user')) {
    window.location.href = 'dashboard.html';
}

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
let mode = 'login';
let language = 'de';

// ===== DOM-ELEMENTE =====
const submitButton = document.getElementById('submitButton');
const toggleModeButton = document.getElementById('toggleMode');
const toggleText = document.getElementById('toggleText');
const message = document.getElementById('message');
const languageToggle = document.getElementById('languageToggle');
const authForm = document.getElementById('authForm');
const passwordInput = document.getElementById('password'); // Zentral referenziert

const labels = {
    pageTitle: document.getElementById('page-title'),
    pageDescription: document.getElementById('page-description'),
    labelUsername: document.getElementById('label-username'),
    labelPassword: document.getElementById('label-password')
};

// ===== FUNKTIONEN =====

function updateText() {
    const t = translations[language];
    labels.pageTitle.textContent = t.pageTitle;
    labels.pageDescription.textContent = t.pageDescription;
    labels.labelUsername.textContent = t.username;
    labels.labelPassword.textContent = t.password;
    document.getElementById('username').placeholder = t.usernamePlaceholder;
    passwordInput.placeholder = t.passwordPlaceholder;
    document.querySelector('.note').textContent = t.note;
    languageToggle.textContent = language === 'de' ? 'EN' : 'DE';
    
    if (mode === 'login') {
        submitButton.textContent = t.submitLogin;
        toggleText.textContent = t.toggleTextLogin;
        toggleModeButton.textContent = t.toggleButtonLogin;
        passwordInput.autocomplete = "current-password"; // Wichtig für Manager
    } else {
        submitButton.textContent = t.submitRegister;
        toggleText.textContent = t.toggleTextRegister;
        toggleModeButton.textContent = t.toggleButtonRegister;
        passwordInput.autocomplete = "new-password"; // Wichtig für Manager
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function handleAuth(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value; // Korrigierte ID
    const t = translations[language];

    if (!username || !password || password.length < 8) {
        message.textContent = t.errorInvalid;
        message.className = 'message error';
        return;
    }

    const passwordHash = await hashPassword(password);
    
    // Annahme: Diese Funktionen kommen aus deiner userDatabase.js
    const storedUser = typeof getUserFromDatabase === 'function' ? getUserFromDatabase(username) : null;

    if (mode === 'login') {
        if (!storedUser || storedUser.passwordHash !== passwordHash) {
            message.textContent = t.errorLogin;
            message.className = 'message error';
            return;
        }

        localStorage.setItem('logged_in_user', username);
        // Kleiner Timeout gibt dem Browser Zeit, das Passwort-Speichern-Popup zu triggern
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 150);
        
    } else {
        if (typeof databaseHasUser === 'function' && databaseHasUser(username)) {
            message.textContent = t.errorRegister;
            message.className = 'message error';
            return;
        }

        if (typeof saveUserToDatabase === 'function') {
            saveUserToDatabase(username, passwordHash);
        }
        
        localStorage.setItem('logged_in_user', username);
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 150);
    }
}

function setMode(newMode) {
    mode = newMode;
    updateText();
    message.textContent = '';
    message.className = 'message';
}

// ===== EVENT-LISTENER =====
toggleModeButton.addEventListener('click', () => {
    setMode(mode === 'login' ? 'register' : 'login');
});

languageToggle.addEventListener('click', () => {
    language = language === 'de' ? 'en' : 'de';
    updateText();
});

authForm.addEventListener('submit', handleAuth);

// Beim Laden initialisieren
updateText();
