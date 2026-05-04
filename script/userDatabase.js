/**
 * USERDATABASE.JS - Lokale Login-Datenbank in localStorage
 *
 * Diese Datei verwaltet die zentrale Datenbank für Benutzerdaten.
 * Alle Login-Daten werden in einem einzigen localStorage-Eintrag gespeichert.
 * Dadurch ist das System besser strukturiert als viele einzelne localStorage-Schlüssel.
 *
 * Struktur:
 * {
 *   "benutzername": { "passwordHash": "..." },
 *   "anderer_user": { "passwordHash": "..." }
 * }
 */

const USER_DATABASE_KEY = 'login_user_database';

/**
 * Lädt die lokale Benutzer-Datenbank aus localStorage.
 * Wenn sie noch nicht existiert, wird eine leere Datenbank angelegt.
 */
function loadUserDatabase() {
    const dbString = localStorage.getItem(USER_DATABASE_KEY);
    if (!dbString) {
        const emptyDb = {};
        localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(emptyDb));
        return emptyDb;
    }

    try {
        const parsed = JSON.parse(dbString);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        console.error('Fehler beim Laden der Login-Datenbank:', error);
        const emptyDb = {};
        localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(emptyDb));
        return emptyDb;
    }
}

/**
 * Speichert die komplette Benutzer-Datenbank in localStorage.
 */
function saveUserDatabase(database) {
    localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(database));
}

/**
 * Gibt die gespeicherten Daten für einen Benutzernamen zurück.
 * Gibt null zurück, wenn der Benutzer nicht existiert.
 */
function getUserFromDatabase(username) {
    if (!username) {
        return null;
    }
    const normalized = username.toLowerCase();
    const database = loadUserDatabase();
    return database[normalized] || null;
}

/**
 * Speichert einen neuen Benutzer in der lokalen Datenbank.
 */
function saveUserToDatabase(username, passwordHash) {
    const normalized = username.toLowerCase();
    const database = loadUserDatabase();
    database[normalized] = { passwordHash };
    saveUserDatabase(database);
}

/**
 * Prüft, ob ein Benutzername bereits in der Datenbank existiert.
 */
function databaseHasUser(username) {
    return Boolean(getUserFromDatabase(username));
}
