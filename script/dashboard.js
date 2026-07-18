/**
 * DASHBOARD.JS - Persönliche Startseite nach dem Login
 * 
 * Diese Seite ist nur für angemeldete Benutzer zugänglich.
 * Sie zeigt den Benutzernamen und Abmelde-Funktionalität.
 */

const dashboardTitle = document.getElementById('dashboardTitle');
const logoutBtn = document.getElementById('logoutBtn');

async function getSessionUser() {
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

async function initDashboard() {
    const username = await getSessionUser();
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    dashboardTitle.textContent = `Willkommen, ${username}`;
}

logoutBtn.addEventListener('click', async () => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
    });
    window.location.href = 'login.html';
});

initDashboard();
