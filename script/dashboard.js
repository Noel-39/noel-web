/**
 * DASHBOARD.JS - Persönliche Startseite nach dem Login
 * 
 * Diese Seite ist nur für angemeldete Benutzer zugänglich.
 * Sie zeigt den Benutzernamen und Abmelde-Funktionalität.
 */

// ===== SICHERHEITS-CHECK =====
// Prüfe ob Benutzer eingeloggt ist
const username = localStorage.getItem('logged_in_user');

// Wenn NICHT eingeloggt: Leite zurück zum Login
if (!username) {
    window.location.href = 'login.html';  // Nur angemeldete Benutzer dürfen hier sein
}

// ===== PERSONALISIERUNG =====
// Zeige den Benutzernamen in der Überschrift
// Beispiel: "Willkommen, Max"
document.getElementById('dashboardTitle').textContent = `Willkommen, ${username}`;

// ===== LOGOUT-FUNKTIONALITÄT =====
// Wenn der Benutzer den "Abmelden"-Button klickt
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Lösche die Anmelde-Session (den gespeicherten Benutzernamen)
    localStorage.removeItem('logged_in_user');
    
    // Leite zurück zur Startseite
    window.location.href = 'index.html';
});
