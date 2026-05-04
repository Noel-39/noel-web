if (localStorage.getItem('logged_in_user')) {
    window.location.href = 'dashboard.html';
}

const translations = {
    de: {
        pageTitle: 'Login',
        pageDescription: 'Bitte melden Sie sich mit Benutzername, E-Mail und Passwort an.',
        username: 'Benutzername',
        email: 'E-Mail',
        password: 'Passwort',
        submitLogin: 'Einloggen',
        submitRegister: 'Registrieren',
        note: 'Passwörter werden lokal gehasht, bevor sie gespeichert oder geprüft werden.',
        toggleTextLogin: 'Noch kein Konto?',
        toggleTextRegister: 'Bereits registriert?',
        toggleButtonLogin: 'Registrieren',
        toggleButtonRegister: 'Anmelden',
        usernamePlaceholder: 'Ihr Benutzername',
        emailPlaceholder: 'name@beispiel.de',
        passwordPlaceholder: 'Mindestens 8 Zeichen',
        successLogin: 'Erfolgreich eingeloggt!',
        successRegister: 'Registrierung erfolgreich. Sie können sich jetzt einloggen.',
        errorLogin: 'Login fehlgeschlagen. Bitte prüfen Sie Benutzername, E-Mail und Passwort.',
        errorRegister: 'Registrierung fehlgeschlagen. Der Benutzername ist bereits vergeben.',
        errorInvalid: 'Bitte füllen Sie alle Felder korrekt aus.'
    },
    en: {
        pageTitle: 'Login',
        pageDescription: 'Please sign in with username, email and password.',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        submitLogin: 'Login',
        submitRegister: 'Register',
        note: 'Passwords are hashed locally before storage or verification.',
        toggleTextLogin: 'No account yet?',
        toggleTextRegister: 'Already registered?',
        toggleButtonLogin: 'Register',
        toggleButtonRegister: 'Sign in',
        usernamePlaceholder: 'Your username',
        emailPlaceholder: 'name@example.com',
        passwordPlaceholder: 'At least 8 characters',
        successLogin: 'Logged in successfully!',
        successRegister: 'Registration complete. You can now log in.',
        errorLogin: 'Login failed. Please check username, email and password.',
        errorRegister: 'Registration failed. The username is already taken.',
        errorInvalid: 'Please fill in all fields correctly.'
    }
};

let mode = 'login';
let language = 'de';

const authForm = document.getElementById('authForm');
const submitButton = document.getElementById('submitButton');
const toggleModeButton = document.getElementById('toggleMode');
const toggleText = document.getElementById('toggleText');
const message = document.getElementById('message');
const languageToggle = document.getElementById('languageToggle');

const labels = {
    pageTitle: document.getElementById('page-title'),
    pageDescription: document.getElementById('page-description'),
    labelUsername: document.getElementById('label-username'),
    labelEmail: document.getElementById('label-email'),
    labelPassword: document.getElementById('label-password')
};

function updateText() {
    const t = translations[language];
    labels.pageTitle.textContent = t.pageTitle;
    labels.pageDescription.textContent = t.pageDescription;
    labels.labelUsername.textContent = t.username;
    labels.labelEmail.textContent = t.email;
    labels.labelPassword.textContent = t.password;
    document.getElementById('username').placeholder = t.usernamePlaceholder;
    document.getElementById('email').placeholder = t.emailPlaceholder;
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

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUserKey(username) {
    return `secure_user_${username.toLowerCase()}`;
}

async function handleAuth(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const t = translations[language];

    if (!username || !email || !password || password.length < 8) {
        message.textContent = t.errorInvalid;
        message.className = 'message error';
        return;
    }

    const passwordHash = await hashPassword(password);
    const storageKey = getUserKey(username);
    const storedValue = localStorage.getItem(storageKey);

    if (mode === 'login') {
        if (!storedValue) {
            message.textContent = t.errorLogin;
            message.className = 'message error';
            return;
        }
        const storedUser = JSON.parse(storedValue);
        if (storedUser.email === email && storedUser.passwordHash === passwordHash) {
            localStorage.setItem('logged_in_user', username);
            window.location.href = 'dashboard.html';
        } else {
            message.textContent = t.errorLogin;
            message.className = 'message error';
        }
    } else {
        if (storedValue) {
            message.textContent = t.errorRegister;
            message.className = 'message error';
            return;
        }
        localStorage.setItem(storageKey, JSON.stringify({ email, passwordHash }));
        localStorage.setItem('logged_in_user', username);
        window.location.href = 'dashboard.html';
    }
}

function setMode(newMode) {
    mode = newMode;
    updateText();
    message.textContent = '';
    message.className = 'message';
}

toggleModeButton.addEventListener('click', () => {
    setMode(mode === 'login' ? 'register' : 'login');
});

languageToggle.addEventListener('click', () => {
    language = language === 'de' ? 'en' : 'de';
    setMode(mode);
});

authForm.addEventListener('submit', handleAuth);
updateText();
