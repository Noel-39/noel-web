/**
 * RECHNER-SIMPLE.JS - Vereinfachter 3D Preisrechner
 *
 * Vereinfachte Version mit:
 * - Maximal 4 Materialien
 * - Keine Arbeitszeit
 * - Keine Material-Hersteller-Auswahl
 * - Keine Material-Typ-Auswahl (manuelle Preiseingabe)
 */

let currentLanguage = 'de';
let currentCurrency = 'EUR';
const USD_RATE = 1.09;
const MAX_MATERIALS = 4;
let activeMaterialIds = [1, 2, 3, 4];

const translations = {
    de: {
        title: 'Preisrechner',
        printerHead: 'Drucker',
        printerType: 'Verwendeter Drucker',
        materialName: 'Materialname',
        materialNamePlaceholder: 'Mit Enter bestätigen',
        pricePerKg: 'Preis pro kg',
        weight: 'Gewicht (g)',
        timeLabel: 'Druckzeit (Stunden)',
        timePlaceholder: 'z.B. 4 oder 1:30',
        calc: 'BERECHNEN',
        roundInfo: '(bei fehlern oder besserungs ideen kontaktieren sie mich bitte unter wallnoel39@gmail.com)',
        roundedPriceLabel: 'Verkaufspreis (gerundet):',
        power: 'Strom',
        wear: 'Abnutzung',
        cost: 'Selbstkosten',
        exactPrice: 'Exakter Preis',
        strompreis: 'Strompreis',
        removeMaterial: 'Entfernen',
        materialA: 'Material 1',
        materialB: 'Material 2',
        materialC: 'Material 3',
        materialD: 'Material 4'
    },
    en: {
        title: 'Price Calculator',
        printerHead: 'Printer',
        printerType: 'Printer Model',
        materialName: 'Material name',
        materialNamePlaceholder: 'Press Enter to confirm',
        pricePerKg: 'Price per kg',
        weight: 'Weight (g)',
        timeLabel: 'Print time (hours)',
        timePlaceholder: 'e.g. 4 or 1:30',
        calc: 'CALCULATE',
        roundInfo: '(For errors or suggestions, please contact me at wallnoel39@gmail.com)',
        roundedPriceLabel: 'Selling price (rounded):',
        power: 'Power',
        wear: 'Wear',
        cost: 'Base cost',
        exactPrice: 'Exact price',
        strompreis: 'Electricity price',
        removeMaterial: 'Remove',
        materialA: 'Material 1',
        materialB: 'Material 2',
        materialC: 'Material 3',
        materialD: 'Material 4'
    }
};

const printerPower = {
    'A1': 0.1,
    'A1 mini': 0.08,
    'P1S': 0.1,
    'P2S': 0.2,
    'X1C': 0.2,
    'H2C': 0.2,
    'Kobra': 0.15,
    'Kobra 3': 0.15,
    'Cobra 3 combo': 0.31,
};

function getCurrencyRate(currency) {
    return currency === 'USD' ? USD_RATE : 1;
}

function getCurrencySymbol() {
    return currentCurrency === 'USD' ? '$' : '€';
}

function updateMoneyLabels() {
    const t = translations[currentLanguage];
    const symbol = getCurrencySymbol();
    document.getElementById('strompreisLabel').innerText = `${t.strompreis} (${symbol}/kWh)`;
}

function setCurrency(currency) {
    const next = currency === 'USD' ? 'USD' : 'EUR';
    if (next === currentCurrency) {
        updateMoneyLabels();
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) currencySelect.value = currentCurrency;
        return;
    }

    const oldRate = getCurrencyRate(currentCurrency);
    const newRate = getCurrencyRate(next);
    const factor = newRate / oldRate;

    for (let i = 1; i <= MAX_MATERIALS; i++) {
        const kgEl = document.getElementById(`kg_${i}`);
        if (kgEl) {
            const val = parseFloat((kgEl.value || '').replace(',', '.'));
            if (Number.isFinite(val)) {
                kgEl.value = (val * factor).toFixed(2);
            }
        }
    }

    const spEl = document.getElementById('strompreis');
    if (spEl) {
        const spVal = parseFloat((spEl.value || '').replace(',', '.'));
        if (Number.isFinite(spVal)) spEl.value = (spVal * factor).toFixed(2);
    }

    currentCurrency = next;
    updateMoneyLabels();
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) currencySelect.value = currentCurrency;

    if (document.getElementById('ausgabe').style.display !== 'none') rechnen();
    if (window.saveAppPreferences) {
        window.saveAppPreferences({ language: currentLanguage, currency: currentCurrency });
    }
}

function setLanguage(lang) {
    currentLanguage = translations[lang] ? lang : 'de';
    const t = translations[currentLanguage];

    document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'de';
    document.getElementById('titleText').innerText = t.title;
    document.getElementById('printerHead').innerText = t.printerHead;
    document.getElementById('strompreisLabel').innerText = t.strompreis + ' (€/kWh)';
    document.getElementById('timeLabel').innerText = t.timeLabel;
    document.getElementById('zeit').placeholder = t.timePlaceholder || 'z.B. 4 oder 1:30';
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (key && t[key]) el.placeholder = t[key];
    });
    document.getElementById('calcBtn').innerText = t.calc;
    document.getElementById('roundInfo').innerText = t.roundInfo;
    document.getElementById('roundedPriceLabel').innerText = t.roundedPriceLabel;
    
    document.getElementById('matAHeading').innerText = t.materialA;
    if (document.getElementById('mat2Heading')) document.getElementById('mat2Heading').innerText = t.materialB;
    if (document.getElementById('mat3Heading')) document.getElementById('mat3Heading').innerText = t.materialC;
    if (document.getElementById('mat4Heading')) document.getElementById('mat4Heading').innerText = t.materialD;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });

    document.getElementById('languageSelect').value = currentLanguage;

    if (document.getElementById('ausgabe').style.display !== 'none') rechnen();
    if (window.saveAppPreferences) {
        window.saveAppPreferences({ language: currentLanguage, currency: currentCurrency });
    }
}

function parseZeit(val) {
    val = (val || '').trim().replace(',', '.');
    if (val.includes(':')) {
        const parts = val.split(':');
        return (parseFloat(parts[0]) || 0) + (parseFloat(parts[1]) || 0) / 60;
    }
    if (val.includes('.')) {
        const parts = val.split('.');
        const hours = parseFloat(parts[0]) || 0;
        const decimal = parseFloat('0.' + parts[1]) || 0;
        const minutes = decimal * 100;
        return hours + minutes / 60;
    }
    return parseFloat(val) || 0;
}

function isSectionVisible(section) {
    if (!section) return false;
    const style = window.getComputedStyle(section);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function handleMaterialNameKeydown(event, materialIndex) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmMaterialName(materialIndex);
    }
}

function validateMaterialNames() {
    const nameCounts = {};
    const visibleIndexes = [];

    for (let i = 1; i <= MAX_MATERIALS; i++) {
        const section = document.getElementById(`sec${i}`);
        if (!section || section.style.display === 'none') continue;
        visibleIndexes.push(i);
        const input = document.getElementById(`name_${i}`);
        if (!input) continue;
        const name = input.value.trim();
        if (!name) continue;
        nameCounts[name] = (nameCounts[name] || 0) + 1;
    }

    visibleIndexes.forEach((i) => {
        const input = document.getElementById(`name_${i}`);
        if (!input) return;
        const name = input.value.trim();
        input.classList.remove('name-valid', 'name-invalid');
        if (!name) return;
        if (nameCounts[name] > 1) {
            input.classList.add('name-invalid');
        } else if (input.dataset.confirmed === 'true') {
            input.classList.add('name-valid');
        }
    });
}

function clearMaterialNameConfirmation(input) {
    if (!input) return;
    input.dataset.confirmed = 'false';
    input.classList.remove('name-valid', 'name-invalid');
    validateMaterialNames();
}

function confirmMaterialName(materialIndex) {
    const input = document.getElementById(`name_${materialIndex}`);
    if (!input) return;
    input.dataset.confirmed = 'true';
    validateMaterialNames();
}

function initializeMaterialConfirmation() {
    for (let i = 1; i <= MAX_MATERIALS; i++) {
        const input = document.getElementById(`name_${i}`);
        if (input) input.dataset.confirmed = 'false';
    }
}

function addMaterial() {
    for (let i = 2; i <= MAX_MATERIALS; i++) {
        const section = document.getElementById(`sec${i}`);
        if (section && !isSectionVisible(section)) {
            section.style.display = 'block';
            return;
        }
    }
}

function removeMaterial(index) {
    const section = document.getElementById(`sec${index}`);
    if (section) {
        section.style.display = 'none';
        document.getElementById(`name_${index}`).value = '';
        document.getElementById(`kg_${index}`).value = '22.99';
        document.getElementById(`g_${index}`).value = '';
    }
}

function rechnen() {
    const v = (id) => parseFloat(document.getElementById(id).value.replace(',', '.')) || 0;

    let matTotal = 0;
    for (let i = 1; i <= MAX_MATERIALS; i++) {
        const section = document.getElementById(`sec${i}`);
        if (!section || section.style.display === 'none') continue;
        const kg = v(`kg_${i}`);
        const g = v(`g_${i}`);
        matTotal += (kg / 1000) * g;
    }

    const zeit = parseZeit(document.getElementById('zeit').value);
    const rate = getCurrencyRate(currentCurrency);
    const drucker = document.getElementById('printer_type').value;
    const power = printerPower[drucker] || 0.1;
    const strompreis = v('strompreis');
    const strom = ((zeit * power) * strompreis) * rate;
    const abnutzung = (zeit * 0.05) * rate;

    const rohpreis = matTotal + strom + abnutzung;
    const preis = rohpreis * 2.5;
    const endpreis = preis;

    const verkaufspreisGerundet = Math.ceil(endpreis * 2) / 2;

    const t = translations[currentLanguage];
    const symbol = getCurrencySymbol();
    let detailText = '';
    
    for (let i = 1; i <= MAX_MATERIALS; i++) {
        const section = document.getElementById(`sec${i}`);
        if (!isSectionVisible(section)) continue;
        const kg = v(`kg_${i}`);
        const g = v(`g_${i}`);
        const matCost = (kg / 1000) * g;
        const nameInput = document.getElementById(`name_${i}`);
        const nameValue = nameInput ? nameInput.value.trim() : '';
        const displayName = (nameInput && nameInput.dataset.confirmed === 'true' && nameValue) ? nameValue : `Material ${i}`;
        if (matCost > 0 || nameValue || kg > 0 || g > 0) {
            detailText += `${displayName}: ${matCost.toFixed(2)}${symbol}<br>`;
        }
    }
    
    detailText += `${t.power}: ${strom.toFixed(2)}${symbol} | ${t.wear}: ${abnutzung.toFixed(2)}${symbol} | ${t.cost}: ${rohpreis.toFixed(2)}${symbol}<br>`;
    detailText += `<small>${t.exactPrice}: ${endpreis.toFixed(2)}${symbol}</small>`;

    document.getElementById('details').innerHTML = detailText;
    document.getElementById('gesamt').innerText = verkaufspreisGerundet.toFixed(2) + ' ' + symbol;
    document.getElementById('ausgabe').style.display = 'block';
}

// Initiale Material-Sektionen nach dem ersten Material verstecken
for (let i = 2; i <= MAX_MATERIALS; i++) {
    const section = document.getElementById(`sec${i}`);
    if (section) {
        section.style.display = 'none';
    }
}

// "Material hinzufügen" Button zeigen wenn nicht alle sichtbar
document.getElementById('addMaterialBtn').style.display = 'block';
initializeMaterialConfirmation();

setCurrency('EUR');
setLanguage('de');
document.getElementById('languageSelect').value = 'de';

(async function initializePreferences() {
    try {
        const preferences = window.loadAppPreferences ? await window.loadAppPreferences() : null;
        if (preferences) {
            currentLanguage = preferences.language === 'en' ? 'en' : 'de';
            currentCurrency = preferences.currency === 'USD' ? 'USD' : 'EUR';
            setLanguage(currentLanguage);
            setCurrency(currentCurrency);
            const currencySelect = document.getElementById('currencySelect');
            const languageSelect = document.getElementById('languageSelect');
            if (currencySelect) currencySelect.value = currentCurrency;
            if (languageSelect) languageSelect.value = currentLanguage;
        }
    } catch (error) {
        return;
    }
})();
