/**
 * DASHBOARD.JS - Persönliche Startseite nach dem Login
 * 
 * Diese Seite ist nur für angemeldete Benutzer zugänglich.
 * Sie zeigt den Spitznamen und Abmelde-Funktionalität.
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
        return data.authenticated ? data : null;
    } catch (error) {
        return null;
    }
}

async function initDashboard() {
    const session = await getSessionUser();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const displayName = session.nickname || session.username;
    dashboardTitle.textContent = `Willkommen, ${displayName}`;
}

logoutBtn.addEventListener('click', async () => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
    });
    window.location.href = 'login.html';
});

initDashboard();
