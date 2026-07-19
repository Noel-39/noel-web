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
    dashboardTitle.textContent = `Willkommen, ${displayName}`;

    const settings = await getUserSettings();
    if (settings) {
        settingNickname.value = settings.nickname || session.username || '';
        settingLanguage.value = settings.language || 'de';
        settingCurrency.value = settings.currency || 'EUR';
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
            settingsMessage.textContent = result.message || 'Fehler beim Speichern der Einstellungen.';
            settingsMessage.className = 'message error';
            return;
        }

        settingsMessage.textContent = result.message || 'Einstellungen gespeichert.';
        settingsMessage.className = 'message success';
        dashboardTitle.textContent = `Willkommen, ${result.nickname || payload.nickname}`;
        currentPassword.value = '';
        newPassword.value = '';
    } catch (error) {
        settingsMessage.textContent = 'Fehler beim Speichern der Einstellungen.';
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
