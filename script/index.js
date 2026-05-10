/**
 * INDEX.JS - Startseite
 * 
 * AUFGABE: Überprüft ob Benutzer angemeldet ist und zeigt dementsprechend:
 * - "Login" Button wenn nicht angemeldet
 * - Benutzernamen mit Link zum Dashboard wenn angemeldet
 * 
 * Dies ermöglicht personalisierte Startseite für jeden Benutzer
 */

// ===== FINDE DAS LOGIN-BUTTON-ELEMENT =====
// Suche nach dem HTML-Element mit id="loginStatusButton"
// (dies ist wahrscheinlich ein Link in der Navigation)
const loginStatusButton = document.getElementById('loginStatusButton');

// ===== PRÜFE OB BENUTZER ANGEMELDET IST =====
// Hole aus dem Browser-Speicher den Namen des eingeloggten Benutzers
// Falls keiner eingeloggt: currentUser wird null
const currentUser = localStorage.getItem('logged_in_user');

// ===== PERSONALISIERE DEN BUTTON BASIEREND AUF ANMELDESTATUS =====
// Überprüfe ob das Button-Element existiert
if (loginStatusButton) {
    if (currentUser) {
        // === BENUTZER IST ANGEMELDET ===
        // Zeige den Benutzernamen statt "Login"
        loginStatusButton.textContent = currentUser;  // z.B. "Max" statt "Login"
        
        // Setze den Link zum Dashboard
        loginStatusButton.href = 'dashboard.html';  // Klick leitet zum Dashboard
    } else {
        // === BENUTZER IST NICHT ANGEMELDET ===
        // Zeige "Login" Button
        loginStatusButton.textContent = 'Login';  // Standard-Text
        
        // Setze den Link zur Login-Seite
        loginStatusButton.href = 'login.html';  // Klick leitet zur Login-Seite
    }
}
