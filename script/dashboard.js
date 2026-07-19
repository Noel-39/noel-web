/**
 * DASHBOARD.JS - Persönliche Startseite nach dem Login
 * 
 * Diese Seite ist nur für angemeldete Benutzer zugänglich.
 * Sie zeigt den Spitznamen und Abmelde-Funktionalität.
 */

const dashboardTitle = document.getElementById('dashboardTitle');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settingsMessage');
const settingNickname = document.getElementById('settingNickname');
const settingLanguage = document.getElementById('settingLanguage');
const settingCurrency = document.getElementById('settingCurrency');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const logoutBtn = document.getElementById('logoutBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
let currentDashboardLanguage = 'de';
let dashboardDisplayName = '';

const dashboardTranslations = {
    de: {
        settingsBtn: 'Einstellungen',
        panelTitle: 'Einstellungen',
        close: 'Schließen',
        nicknameLabel: 'Spitzname',
        nicknamePlaceholder: 'Ihr Spitzname',
        languageLabel: 'Sprache',
        currencyLabel: 'Währung',
        passwordGroupTitle: 'Passwort ändern',
        currentPasswordLabel: 'Aktuelles Passwort',
        currentPasswordPlaceholder: 'Aktuelles Passwort',
        newPasswordLabel: 'Neues Passwort',
        newPasswordPlaceholder: 'Neues Passwort',
        saveButton: 'Speichern',
        logoutButton: 'Logout',
        menuCalculator: '3D Preisrechner',
        menuImpressum: 'Impressum',
        menuDatenschutz: 'Datenschutz',
        welcome: 'Willkommen, {name}',
        saveSuccess: 'Einstellungen gespeichert.',
        saveError: 'Fehler beim Speichern der Einstellungen.'
    },
    en: {
        settingsBtn: 'Settings',
        panelTitle: 'Settings',
        close: 'Close',
        nicknameLabel: 'Nickname',
        nicknamePlaceholder: 'Your nickname',
        languageLabel: 'Language',
        currencyLabel: 'Currency',
        passwordGroupTitle: 'Change password',
        currentPasswordLabel: 'Current password',
        currentPasswordPlaceholder: 'Current password',
        newPasswordLabel: 'New password',
        newPasswordPlaceholder: 'New password',
        saveButton: 'Save',
        logoutButton: 'Logout',
        menuCalculator: '3D Price Calculator',
        menuImpressum: 'Imprint',
        menuDatenschutz: 'Privacy',
        welcome: 'Welcome, {name}',
        saveSuccess: 'Settings saved.',
        saveError: 'Failed to save settings.'
    }
};

function applyDashboardLanguage(language) {
    const lang = language === 'en' ? 'en' : 'de';
    currentDashboardLanguage = lang;
    const t = dashboardTranslations[lang];
    document.documentElement.lang = lang;
    settingsBtn.textContent = t.settingsBtn;
    closeSettingsBtn.setAttribute('aria-label', t.close);
    document.querySelector('.settings-header h2').textContent = t.panelTitle;
    document.querySelector('label[for="settingNickname"]').textContent = t.nicknameLabel;
    settingNickname.placeholder = t.nicknamePlaceholder;
    document.querySelector('label[for="settingLanguage"]').textContent = t.languageLabel;
    document.querySelector('label[for="settingCurrency"]').textContent = t.currencyLabel;
    document.querySelector('.password-group p').textContent = t.passwordGroupTitle;
    document.querySelector('label[for="currentPassword"]').textContent = t.currentPasswordLabel;
    currentPassword.placeholder = t.currentPasswordPlaceholder;
    document.querySelector('label[for="newPassword"]').textContent = t.newPasswordLabel;
    newPassword.placeholder = t.newPasswordPlaceholder;
    saveSettingsBtn.textContent = t.saveButton;
    logoutBtn.textContent = t.logoutButton;
    const menuLinks = Array.from(document.querySelectorAll('.menu a'));
    if (menuLinks[0]) menuLinks[0].textContent = t.menuCalculator;
    if (menuLinks[1]) menuLinks[1].textContent = t.menuImpressum;
    if (menuLinks[2]) menuLinks[2].textContent = t.menuDatenschutz;
}

function updateDashboardTitle(displayName) {
    const t = dashboardTranslations[currentDashboardLanguage];
    dashboardTitle.textContent = t.welcome.replace('{name}', displayName);
}

async function getSessionUser() {
    try {
        const response = await fetch('/api/session', { credentials: 'same-origin' });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.authenticated ? data : null;
    } catch (error) {
        return null;
    }
}

async function getUserSettings() {
    try {
        const response = await fetch('/api/user-settings', { credentials: 'same-origin' });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.success ? data : null;
    } catch (error) {
        return null;
    }
}

function openSettings() {
    settingsPanel.classList.remove('hidden');
    settingsPanel.classList.add('open');
    settingsOverlay.classList.remove('hidden');
    settingsPanel.setAttribute('aria-hidden', 'false');
}

function closeSettings() {
    settingsPanel.classList.add('hidden');
    settingsPanel.classList.remove('open');
    settingsOverlay.classList.add('hidden');
    settingsPanel.setAttribute('aria-hidden', 'true');
    settingsMessage.textContent = '';
}

async function initDashboard() {
    const session = await getSessionUser();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const displayName = session.nickname || session.username;
    dashboardDisplayName = displayName;
    const preferences = window.loadAppPreferences ? await window.loadAppPreferences() : null;
    const preferredLanguage = (preferences && preferences.language) || session.language || 'de';
    const preferredCurrency = (preferences && preferences.currency) || 'EUR';
    applyDashboardLanguage(preferredLanguage);
    updateDashboardTitle(displayName);

    const settings = await getUserSettings();
    if (settings) {
        const nextLanguage = settings.language || preferredLanguage || 'de';
        const nextCurrency = settings.currency || preferredCurrency || 'EUR';
        applyDashboardLanguage(nextLanguage);
        settingNickname.value = settings.nickname || session.username || '';
        settingLanguage.value = nextLanguage;
        settingCurrency.value = nextCurrency;
        if (window.saveAppPreferences) {
            await window.saveAppPreferences({ language: nextLanguage, currency: nextCurrency });
        }
        updateDashboardTitle(settings.nickname || displayName);
    }
}

settingsBtn.addEventListener('click', () => {
    openSettings();
});

closeSettingsBtn.addEventListener('click', () => {
    closeSettings();
});

settingsOverlay.addEventListener('click', () => {
    closeSettings();
});

settingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!settingsMessage) return;

    const payload = {
        nickname: settingNickname.value.trim(),
        language: settingLanguage.value,
        currency: settingCurrency.value,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
    };

    try {
        const response = await fetch('/api/user-settings', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            settingsMessage.textContent = result.message || dashboardTranslations[currentDashboardLanguage].saveError;
            settingsMessage.className = 'message error';
            return;
        }

        const nextLanguage = result.language || payload.language || currentDashboardLanguage;
        const nextCurrency = result.currency || payload.currency || 'EUR';
        applyDashboardLanguage(nextLanguage);
        if (window.saveAppPreferences) {
            await window.saveAppPreferences({ language: nextLanguage, currency: nextCurrency });
        }
        settingsMessage.textContent = result.message || dashboardTranslations[currentDashboardLanguage].saveSuccess;
        settingsMessage.className = 'message success';
        dashboardDisplayName = result.nickname || payload.nickname || dashboardDisplayName;
        updateDashboardTitle(dashboardDisplayName);
        currentPassword.value = '';
        newPassword.value = '';
    } catch (error) {
        settingsMessage.textContent = dashboardTranslations[currentDashboardLanguage].saveError;
        settingsMessage.className = 'message error';
    }
});

logoutBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
    });
    window.location.href = 'login.html';
});

initDashboard();
