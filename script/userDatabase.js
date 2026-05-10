/**
 * USERDATABASE.JS - Lokale Login-Datenbank in localStorage
 *
 * Diese Datei verwaltet die zentrale Datenbank für Benutzerdaten.
 * Alle Login-Daten werden in einem einzigen localStorage-Eintrag gespeichert.
 * localStorage = Browser-Speicher, der auch nach Schließen des Browsers erhalten bleibt
 *
 * Struktur der gespeicherten Daten:
 * {
 *   "benutzername": { "passwordHash": "..." },
 *   "anderer_user": { "passwordHash": "..." }
 * }
 */

// Eindeutiger Schlüssel für den Browser-Speicher
const USER_DATABASE_KEY = 'login_user_database';

/**
 * loadUserDatabase()
 * 
 * AUFGABE: Lädt die Benutzerdatenbank aus dem Browser-Speicher
 * 
 * RÜCKGABE: Ein Objekt mit allen Benutzerdaten oder ein leeres Objekt
 * 
 * ABLAUF:
 * 1. Schaut im Browser-Speicher nach der Datenbank
 * 2. Falls nicht vorhanden: Erstelle neue leere Datenbank
 * 3. Falls vorhanden: Überprüfe ob es gültig ist
 * 4. Bei Fehler: Erstelle neue leere Datenbank und zeige Fehler
 */
function loadUserDatabase() {
    // Versuche die Datenbank aus dem Browser-Speicher zu laden
    const dbString = localStorage.getItem(USER_DATABASE_KEY);
    
    // Falls noch keine Datenbank existiert
    if (!dbString) {
        const emptyDb = {};  // Erstelle leeres Datenbank-Objekt
        localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(emptyDb));  // Speichere es
        return emptyDb;  // Gebe das leere Objekt zurück
    }

    // Versuche den Text in ein Objekt umzuwandeln
    try {
        const parsed = JSON.parse(dbString);  // Konvertiere Text zu Objekt
        // Überprüfe ob es ein gültiges Objekt ist
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        // Falls Fehler auftritt: Zeige Fehlermeldung und erstelle neue Datenbank
        console.error('Fehler beim Laden der Login-Datenbank:', error);
        const emptyDb = {};
        localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(emptyDb));
        return emptyDb;
    }
}

/**
 * saveUserDatabase(database)
 * 
 * AUFGABE: Speichert die komplette Benutzerdatenbank im Browser-Speicher
 * 
 * PARAMETER:
 * - database: Das Objekt mit allen Benutzerdaten
 */
function saveUserDatabase(database) {
    // Konvertiere das Objekt zu Text (JSON) und speichere es
    localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(database));
}

/**
 * getUserFromDatabase(username)
 * 
 * AUFGABE: Holt die Daten eines bestimmten Benutzers aus der Datenbank
 * 
 * PARAMETER:
 * - username: Der Benutzername zum Suchen (z.B. "Max")
 * 
 * RÜCKGABE:
 * - Benutzerdaten wenn gefunden (z.B. { passwordHash: "abc123..." })
 * - null wenn Benutzer nicht existiert
 */
function getUserFromDatabase(username) {
    // Überprüfe ob Benutzername vorhanden ist
    if (!username) {
        return null;  // Keine Eingabe = kein Benutzer
    }
    
    // Konvertiere Benutzername zu Kleinbuchstaben (Max = max = MAX)
    const normalized = username.toLowerCase();
    
    // Lade alle Benutzer aus der Datenbank
    const database = loadUserDatabase();
    
    // Gebe Benutzerdaten zurück oder null wenn nicht vorhanden
    return database[normalized] || null;
}

/**
 * saveUserToDatabase(username, passwordHash)
 * 
 * AUFGABE: Speichert einen neuen Benutzer in der Datenbank
 * 
 * PARAMETER:
 * - username: Der Benutzername (z.B. "Max")
 * - passwordHash: Das verschlüsselte Passwort (z.B. "abc123...")
 * 
 * ABLAUF:
 * 1. Lade aktuelle Datenbank
 * 2. Füge neuen Benutzer hinzu
 * 3. Speichere alles im Browser-Speicher
 */
function saveUserToDatabase(username, passwordHash) {
    // Konvertiere Benutzername zu Kleinbuchstaben für einheitliche Speicherung
    const normalized = username.toLowerCase();
    
    // Lade alle existierenden Benutzer
    const database = loadUserDatabase();
    
    // Füge neuen Benutzer zur Datenbank hinzu
    // Der Benutzer wird als Objekt mit passwordHash gespeichert
    database[normalized] = { passwordHash };
    
    // Speichere die aktualisierte Datenbank im Browser-Speicher
    saveUserDatabase(database);
}

/**
 * databaseHasUser(username)
 * 
 * AUFGABE: Prüft ob ein Benutzer bereits in der Datenbank existiert
 * 
 * PARAMETER:
 * - username: Der Benutzername zum Prüfen
 * 
 * RÜCKGABE:
 * - true = Benutzer existiert bereits
 * - false = Benutzer existiert nicht
 */
function databaseHasUser(username) {
    // getUserFromDatabase() gibt null zurück wenn nicht vorhanden
    // Boolean() konvertiert null zu false und Objekt zu true
    return Boolean(getUserFromDatabase(username));
}
