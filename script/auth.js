const authForm = document.getElementById('authForm');
const message = document.getElementById('message');
const languageToggle = document.getElementById('languageToggle');
const passwordInput = document.getElementById('password');
const labels = {
    pageTitle: document.getElementById('page-title'),
    pageDescription: document.getElementById('page-description'),
    labelUsername: document.getElementById('label-username'),
    labelPassword: document.getElementById('label-password'),
};

const isRegisterPage = window.location.pathname.endsWith('register.html');
let language = 'de';

const translations = {
    de: {
        pageTitle: isRegisterPage ? 'Registrieren' : 'Login',
        pageDescription: isRegisterPage ? 'Bitte registrieren Sie sich mit Benutzername und Passwort.' : 'Bitte melden Sie sich mit Benutzername und Passwort an.',
        username: 'Benutzername',
        password: 'Passwort',
        submitLogin: 'Einloggen',
        submitRegister: 'Registrieren',
        note: 'Passwörter werden sicher auf dem Server gespeichert und niemals im Klartext übertragen.',
        toggleText: isRegisterPage ? 'Bereits registriert?' : 'Noch kein Konto?',
        toggleButton: isRegisterPage ? 'Anmelden' : 'Registrieren',
        usernamePlaceholder: 'Ihr Benutzername',
        passwordPlaceholder: 'Mindestens 8 Zeichen',
        successLogin: 'Erfolgreich eingeloggt!',
        successRegister: 'Registrierung erfolgreich. Weiterleitung zum Dashboard...',
        errorLogin: 'Login fehlgeschlagen. Bitte prüfen Sie Benutzername und Passwort.',
        errorRegister: 'Registrierung fehlgeschlagen. Der Benutzername ist bereits vergeben.',
        errorInvalid: 'Bitte füllen Sie alle Felder korrekt aus.'
    },
    en: {
        pageTitle: isRegisterPage ? 'Register' : 'Login',
        pageDescription: isRegisterPage ? 'Please register with username and password.' : 'Please sign in with username and password.',
        username: 'Username',
        password: 'Password',
        submitLogin: 'Login',
        submitRegister: 'Register',
        note: 'Passwords are safely stored on the server and never sent in plain text.',
        toggleText: isRegisterPage ? 'Already registered?' : 'No account yet?',
        toggleButton: isRegisterPage ? 'Sign in' : 'Register',
        usernamePlaceholder: 'Your username',
        passwordPlaceholder: 'At least 8 characters',
        successLogin: 'Logged in successfully!',
        successRegister: 'Registration complete. Redirecting to dashboard...',
        errorLogin: 'Login failed. Please check username and password.',
        errorRegister: 'Registration failed. The username is already taken.',
        errorInvalid: 'Please fill in all fields correctly.'
    }
};

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
    document.getElementById('submitButton').textContent = isRegisterPage ? t.submitRegister : t.submitLogin;
    document.getElementById('toggleText').textContent = t.toggleText;
    if (isRegisterPage) {
        passwordInput.autocomplete = 'new-password';
    } else {
        passwordInput.autocomplete = 'current-password';
    }
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError ? 'message error' : 'message success';
}

async function getSession() {
    try {
        const response = await fetch('/api/session', { credentials: 'same-origin' });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.authenticated ? data.username : null;
    } catch (error) {
        return null;
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value;
    const t = translations[language];

    if (!username || !password || password.length < 8) {
        showMessage(t.errorInvalid, true);
        return;
    }

    const endpoint = isRegisterPage ? '/api/register' : '/api/login';
    const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
        showMessage(result.message || (isRegisterPage ? t.errorRegister : t.errorLogin), true);
        return;
    }

    showMessage(isRegisterPage ? t.successRegister : t.successLogin, false);
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 800);
}

languageToggle.addEventListener('click', () => {
    language = language === 'de' ? 'en' : 'de';
    updateText();
});

authForm.addEventListener('submit', handleSubmit);

(async function init() {
    const username = await getSession();
    if (username) {
        window.location.href = 'dashboard.html';
        return;
    }
    updateText();
})();
