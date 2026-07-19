(function () {
    const translations = {
        de: {
            homeTitle: 'Noel-Web',
            loginButton: 'Login',
            menuImpressum: 'Impressum',
            menuDatenschutz: 'Datenschutz',
            menuCalculator: 'Preisberechner',
            imprintTitle: 'Impressum - 3D Preisrechner',
            imprintHeading: 'Impressum',
            privacyTitle: 'Datenschutzerklärung - 3D Preisrechner',
            privacyHeading: 'Datenschutzerklärung',
            backHome: '← Zurück zur Startseite'
        },
        en: {
            homeTitle: 'Noel-Web',
            loginButton: 'Login',
            menuImpressum: 'Imprint',
            menuDatenschutz: 'Privacy',
            menuCalculator: 'Price calculator',
            imprintTitle: 'Imprint - 3D Price Calculator',
            imprintHeading: 'Imprint',
            privacyTitle: 'Privacy Policy - 3D Price Calculator',
            privacyHeading: 'Privacy Policy',
            backHome: '← Back to home'
        }
    };

    async function applyPageLanguage() {
        try {
            const response = await fetch('/api/user-settings', { credentials: 'same-origin' });
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            if (!data.success || !data.language) {
                return;
            }
            const lang = data.language === 'en' ? 'en' : 'de';
            const t = translations[lang];
            document.documentElement.lang = lang;

            if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
                document.title = t.homeTitle;
                const loginBtn = document.getElementById('loginStatusButton');
                if (loginBtn) loginBtn.textContent = t.loginButton;
                const menuLinks = Array.from(document.querySelectorAll('.menu a'));
                if (menuLinks[0]) menuLinks[0].textContent = t.menuImpressum;
                if (menuLinks[1]) menuLinks[1].textContent = t.menuDatenschutz;
                if (menuLinks[2]) menuLinks[2].textContent = t.menuCalculator;
            }

            if (window.location.pathname.endsWith('/impressum.html')) {
                document.title = t.imprintTitle;
                const mainHeading = document.querySelector('.legal-container h1');
                if (mainHeading) mainHeading.textContent = t.imprintHeading;
                const backLink = document.querySelector('.back-link');
                if (backLink) backLink.textContent = t.backHome;
            }

            if (window.location.pathname.endsWith('/datenschutz.html')) {
                document.title = t.privacyTitle;
                const mainHeading = document.querySelector('.legal-container h1');
                if (mainHeading) mainHeading.textContent = t.privacyHeading;
                const backLink = document.querySelector('.back-link');
                if (backLink) backLink.textContent = t.backHome;
            }
        } catch (error) {
            return;
        }
    }

    document.addEventListener('DOMContentLoaded', applyPageLanguage);
})();
