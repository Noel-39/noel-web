/**
 * INDEX.JS - Startseite
 * 
 * Dieser Script prüft, ob der Benutzer angemeldet ist und zeigt:
 * - "Login" Button, wenn nicht angemeldet
 * - Benutzernamen mit Link zum Dashboard, wenn angemeldet
 */

// Referenz zum Login/Status-Button
const loginStatusButton = document.getElementById('loginStatusButton');
// Prüfe, ob Benutzer bereits angemeldet ist
const currentUser = localStorage.getItem('logged_in_user');

if (loginStatusButton) {
    if (currentUser) {
        // Angemeldet: Zeige Benutzernamen und Link zum Dashboard
        loginStatusButton.textContent = currentUser;
        loginStatusButton.href = 'dashboard.html';
    } else {
        // Nicht angemeldet: Zeige Login-Button
        loginStatusButton.textContent = 'Login';
        loginStatusButton.href = 'login.html';
    }
}
