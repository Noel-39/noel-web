/**
 * INDEX.JS - Startseite
 * 
 * AUFGABE: Zeigt den Anmelde-Status des aktuellen Benutzers an.
 * - "Login" Button wenn nicht angemeldet
 * - Benutzernamen mit Link zum Dashboard wenn angemeldet
 */

const loginStatusButton = document.getElementById('loginStatusButton');

async function updateLoginStatus() {
    if (!loginStatusButton) {
        return;
    }

    try {
        const response = await fetch('/api/session', { credentials: 'same-origin' });
        if (!response.ok) {
            loginStatusButton.textContent = 'Login';
            loginStatusButton.href = 'login.html';
            return;
        }

        const data = await response.json();
        if (data.authenticated && data.username) {
            loginStatusButton.textContent = data.username;
            loginStatusButton.href = 'dashboard.html';
        } else {
            loginStatusButton.textContent = 'Login';
            loginStatusButton.href = 'login.html';
        }
    } catch (error) {
        loginStatusButton.textContent = 'Login';
        loginStatusButton.href = 'login.html';
    }
}

updateLoginStatus();
