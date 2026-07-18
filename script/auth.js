const authForm = document.getElementById('authForm');
const message = document.getElementById('message');
const languageToggle = document.getElementById('languageToggle');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const nicknameInput = document.getElementById('nickname');
const labels = {
    pageTitle: document.getElementById('page-title'),
    pageDescription: document.getElementById('page-description'),
    labelUsername: document.getElementById('label-username'),
    labelPassword: document.getElementById('label-password'),
    labelNickname: document.getElementById('label-nickname'),
};
const nextStepButton = document.getElementById('nextStepButton');
const nextPasswordButton = document.getElementById('nextPasswordButton');
const submitButton = document.getElementById('submitButton');
const stepElements = Array.from(document.querySelectorAll('.step'));

const isRegisterPage = window.location.pathname.endsWith('register.html');
let language = 'de';
let currentStep = 1;
const USERNAME_PATTERN = /^[a-z0-9]+(?:\.[a-z0-9]+)+$/;

const translations = {
    de: {
        pageTitle: isRegisterPage ? 'Registrieren' : 'Login',
        pageDescription: isRegisterPage ? 'Bitte registrieren Sie sich in drei Schritten.' : 'Bitte melden Sie sich mit Benutzername und Passwort an.',
        username: 'Benutzername',
        password: 'Passwort',
        nickname: 'Spitzname',
        submitLogin: 'Einloggen',
        submitRegister: 'Registrieren',
        nextButton: 'Weiter',
        backButton: 'Zurück',
        note: 'Passwörter werden sicher auf dem Server gespeichert und niemals im Klartext übertragen.',
        toggleText: isRegisterPage ? 'Bereits registriert?' : 'Noch kein Konto?',
        toggleButton: isRegisterPage ? 'Anmelden' : 'Registrieren',
        usernamePlaceholder: 'Ihr Benutzername',
        passwordPlaceholder: 'Mindestens 8 Zeichen',
        nicknamePlaceholder: 'Ihr Spitzname',
        usernameHint: 'Bitte nur Kleinbuchstaben, Zahlen und einen Punkt verwenden, z. B. noel.w.',
        nicknameHint: 'Dieser Name wird angezeigt, wenn du angemeldet bist.',
        successLogin: 'Erfolgreich eingeloggt!',
        successRegister: 'Registrierung erfolgreich. Weiterleitung zum Dashboard...',
        errorLogin: 'Login fehlgeschlagen. Bitte prüfen Sie Benutzername und Passwort.',
        errorRegister: 'Registrierung fehlgeschlagen. Der Benutzername ist bereits vergeben.',
        errorInvalid: 'Bitte füllen Sie alle Felder korrekt aus.',
        errorUsername: 'Bitte gib einen gültigen Benutzernamen ein, z. B. noel.w.'
    },
    en: {
        pageTitle: isRegisterPage ? 'Register' : 'Login',
        pageDescription: isRegisterPage ? 'Please register in three steps.' : 'Please sign in with username and password.',
        username: 'Username',
        password: 'Password',
        nickname: 'Nickname',
        submitLogin: 'Login',
        submitRegister: 'Register',
        nextButton: 'Next',
        backButton: 'Back',
        note: 'Passwords are safely stored on the server and never sent in plain text.',
        toggleText: isRegisterPage ? 'Already registered?' : 'No account yet?',
        toggleButton: isRegisterPage ? 'Sign in' : 'Register',
        usernamePlaceholder: 'Your username',
        passwordPlaceholder: 'At least 8 characters',
        nicknamePlaceholder: 'Your nickname',
        usernameHint: 'Please use lowercase letters, numbers and one dot, e.g. noel.w.',
        nicknameHint: 'This name will be shown whenever you are signed in.',
        successLogin: 'Logged in successfully!',
        successRegister: 'Registration complete. Redirecting to dashboard...',
        errorLogin: 'Login failed. Please check username and password.',
        errorRegister: 'Registration failed. The username is already taken.',
        errorInvalid: 'Please fill in all fields correctly.',
        errorUsername: 'Please enter a valid username, e.g. noel.w.'
    }
};

function updateText() {
    const t = translations[language];
    if (labels.pageTitle) labels.pageTitle.textContent = t.pageTitle;
    if (labels.pageDescription) labels.pageDescription.textContent = t.pageDescription;
    if (labels.labelUsername) labels.labelUsername.textContent = t.username;
    if (labels.labelPassword) labels.labelPassword.textContent = t.password;
    if (labels.labelNickname) labels.labelNickname.textContent = t.nickname;
    if (usernameInput) usernameInput.placeholder = t.usernamePlaceholder;
    if (passwordInput) passwordInput.placeholder = t.passwordPlaceholder;
    if (nicknameInput) nicknameInput.placeholder = t.nicknamePlaceholder;
    const usernameHint = document.getElementById('usernameHint');
    const nicknameHint = document.getElementById('nicknameHint');
    if (usernameHint) usernameHint.textContent = t.usernameHint;
    if (nicknameHint) nicknameHint.textContent = t.nicknameHint;
    if (document.querySelector('.note')) document.querySelector('.note').textContent = t.note;
    if (languageToggle) languageToggle.textContent = language === 'de' ? 'EN' : 'DE';
    if (submitButton) submitButton.textContent = isRegisterPage ? t.submitRegister : t.submitLogin;
    const toggleText = document.getElementById('toggleText');
    if (toggleText) toggleText.textContent = t.toggleText;
    if (nextStepButton) nextStepButton.textContent = t.nextButton;
    const nextPasswordBtn = document.getElementById('nextPasswordButton');
    const backButton = document.getElementById('backStepButton');
    const backNicknameButton = document.getElementById('backNicknameButton');
    if (nextPasswordBtn) nextPasswordBtn.textContent = t.nextButton;
    if (backButton) backButton.textContent = t.backButton;
    if (backNicknameButton) backNicknameButton.textContent = t.backButton;
    if (isRegisterPage) {
        if (passwordInput) passwordInput.autocomplete = 'new-password';
    } else if (passwordInput) {
        passwordInput.autocomplete = 'current-password';
    }
}

function showMessage(text, isError = false) {
    if (!message) return;
    message.textContent = text;
    message.className = isError ? 'message error' : 'message success';
}

function isValidUsernameValue(value) {
    return USERNAME_PATTERN.test(value.toLowerCase());
}

function updateStepButtons() {
    if (!isRegisterPage) return;
    const usernameValue = usernameInput ? usernameInput.value.trim() : '';
    const passwordValue = passwordInput ? passwordInput.value : '';
    const nicknameValue = nicknameInput ? nicknameInput.value.trim() : '';

    if (nextStepButton) {
        nextStepButton.classList.toggle('hidden', !isValidUsernameValue(usernameValue));
    }

    if (nextPasswordButton) {
        nextPasswordButton.classList.toggle('hidden', passwordValue.length < 8);
    }

    if (submitButton) {
        submitButton.classList.toggle('hidden', nicknameValue.length < 2);
    }
}

function showStep(step) {
    if (!isRegisterPage) return;
    currentStep = step;
    stepElements.forEach((stepElement, index) => {
        stepElement.classList.toggle('active', index + 1 === step);
    });
    updateStepButtons();
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

async function checkUsernameAvailability(username) {
    const response = await fetch('/api/check-username', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    const result = await response.json();
    return { response, result };
}

async function handleRegister(event) {
    event.preventDefault();
    const username = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const password = passwordInput ? passwordInput.value : '';
    const nickname = nicknameInput ? nicknameInput.value.trim() : '';
    const t = translations[language];

    if (!username || !isValidUsernameValue(username) || !password || password.length < 8 || !nickname || nickname.length < 2) {
        showMessage(t.errorInvalid, true);
        return;
    }

    const response = await fetch('/api/register', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, nickname }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
        showMessage(result.message || t.errorRegister, true);
        return;
    }

    showMessage(t.successRegister, false);
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 800);
}

async function handleLogin(event) {
    event.preventDefault();
    const username = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const password = passwordInput ? passwordInput.value : '';
    const t = translations[language];

    if (!username || !password || password.length < 8) {
        showMessage(t.errorInvalid, true);
        return;
    }

    const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
        showMessage(result.message || t.errorLogin, true);
        return;
    }

    showMessage(t.successLogin, false);
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 800);
}

async function handleSubmit(event) {
    if (isRegisterPage) {
        await handleRegister(event);
        return;
    }
    await handleLogin(event);
}

async function goToNextStep() {
    if (!isRegisterPage) return;
    const username = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const t = translations[language];

    if (!username || !isValidUsernameValue(username)) {
        showMessage(t.errorUsername, true);
        return;
    }

    const { response, result } = await checkUsernameAvailability(username);
    if (!response.ok || !result.available) {
        showMessage(result.message || t.errorRegister, true);
        return;
    }

    showStep(2);
}

function goToPreviousStep() {
    if (!isRegisterPage || currentStep <= 1) return;
    showStep(currentStep - 1);
}

if (isRegisterPage) {
    if (nextStepButton) {
        nextStepButton.addEventListener('click', goToNextStep);
    }
    if (nextPasswordButton) {
        nextPasswordButton.addEventListener('click', () => showStep(3));
    }
    if (document.getElementById('backStepButton')) {
        document.getElementById('backStepButton').addEventListener('click', goToPreviousStep);
    }
    if (document.getElementById('backNicknameButton')) {
        document.getElementById('backNicknameButton').addEventListener('click', goToPreviousStep);
    }
    [usernameInput, passwordInput, nicknameInput].forEach((input) => {
        if (input) {
            input.addEventListener('input', () => {
                showMessage('', false);
                updateStepButtons();
            });
        }
    });
}

if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        language = language === 'de' ? 'en' : 'de';
        updateText();
    });
}

if (authForm) {
    authForm.addEventListener('submit', handleSubmit);
}

(async function init() {
    const username = await getSession();
    if (username) {
        window.location.href = 'dashboard.html';
        return;
    }
    if (isRegisterPage) {
        showStep(1);
    }
    updateText();
})();
