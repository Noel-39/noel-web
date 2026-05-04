/**
 * DASHBOARD.JS - Persönliche Startseite nach dem Login
 * 
 * Diese Seite ist nur für angemeldete Benutzer zugänglich.
 * Sie zeigt den Benutzernamen und Navigationsmöglichkeiten.
 */

// Prüfe, ob Benutzer angemeldet ist
const username = localStorage.getItem('logged_in_user');
// Wenn nicht angemeldet: Zurück zum Login
if (!username) {
    window.location.href = 'login.html';
}

// Benutzernamen in der Überschrift anzeigen
document.getElementById('dashboardTitle').textContent = `Willkommen, ${username}`;

// Logout-Button: Benutzer abmelden
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Anmelde-Session löschen
    localStorage.removeItem('logged_in_user');
    // Zurück zur Startseite
    window.location.href = 'index.html';
});
