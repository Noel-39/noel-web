(function () {
    const STORAGE_KEY = 'appPreferences';
    const defaults = { language: 'de', currency: 'EUR' };

    function normalizeLanguage(value) {
        return value === 'en' ? 'en' : 'de';
    }

    function normalizeCurrency(value) {
        return value === 'USD' ? 'USD' : 'EUR';
    }

    function normalizePreferences(preferences) {
        const nextPreferences = preferences && typeof preferences === 'object' ? preferences : {};
        return {
            language: normalizeLanguage(nextPreferences.language),
            currency: normalizeCurrency(nextPreferences.currency),
        };
    }

    function readStoredPreferences() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            return normalizePreferences(parsed);
        } catch (error) {
            return null;
        }
    }

    function persistStoredPreferences(preferences) {
        const nextPreferences = normalizePreferences({ ...defaults, ...preferences });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
        } catch (error) {
            // Ignore storage errors and continue with in-memory state.
        }
        return nextPreferences;
    }

    async function loadServerPreferences() {
        try {
            const response = await fetch('/api/user-settings', { credentials: 'same-origin' });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            if (!data || !data.success || !data.language) {
                return null;
            }
            return normalizePreferences({ language: data.language, currency: data.currency });
        } catch (error) {
            return null;
        }
    }

    async function loadAppPreferences() {
        const storedPreferences = readStoredPreferences();
        const serverPreferences = await loadServerPreferences();
        const resolvedPreferences = normalizePreferences(serverPreferences || storedPreferences || defaults);
        const persistedPreferences = persistStoredPreferences(resolvedPreferences);
        window.appPreferences = persistedPreferences;
        document.documentElement.lang = persistedPreferences.language === 'en' ? 'en' : 'de';
        document.documentElement.dataset.language = persistedPreferences.language;
        document.documentElement.dataset.currency = persistedPreferences.currency;
        window.dispatchEvent(new CustomEvent('appPreferencesChanged', { detail: persistedPreferences }));
        return persistedPreferences;
    }

    async function saveAppPreferences(preferences) {
        const resolvedPreferences = persistStoredPreferences(preferences || {});
        try {
            await fetch('/api/user-settings', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: resolvedPreferences.language,
                    currency: resolvedPreferences.currency,
                }),
            });
        } catch (error) {
            // Ignore server errors and keep the client-side state.
        }
        window.appPreferences = resolvedPreferences;
        document.documentElement.lang = resolvedPreferences.language === 'en' ? 'en' : 'de';
        document.documentElement.dataset.language = resolvedPreferences.language;
        document.documentElement.dataset.currency = resolvedPreferences.currency;
        window.dispatchEvent(new CustomEvent('appPreferencesChanged', { detail: resolvedPreferences }));
        return resolvedPreferences;
    }

    function getAppPreferences() {
        return normalizePreferences(window.appPreferences || readStoredPreferences() || defaults);
    }

    if (typeof window !== 'undefined') {
        window.appPreferences = normalizePreferences(readStoredPreferences() || defaults);
        window.getAppPreferences = getAppPreferences;
        window.loadAppPreferences = loadAppPreferences;
        window.saveAppPreferences = saveAppPreferences;
        document.documentElement.lang = window.appPreferences.language === 'en' ? 'en' : 'de';
        document.documentElement.dataset.language = window.appPreferences.language;
        document.documentElement.dataset.currency = window.appPreferences.currency;
    }
})();
