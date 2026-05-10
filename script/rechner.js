/**
 * RECHNER.JS - 3D Preisrechner
 * 
 * AUFGABE: Diese Seite berechnet die Kosten für 3D-Drucke basierend auf:
 * 1. Druckermodell und dessen Stromverbrauch
 * 2. Materialarten und -gewichte
 * 3. Druckzeit
 * 4. Optionale Arbeitszeit (z.B. für Post-Processing)
 * 
 * BERECHNUNGSFORMEL:
 * Selbstkosten = (Materialkosten + Stromkosten + Verschleißkosten)
 * Verkaufspreis = Selbstkosten × 2.5 + Arbeitskosten
 * Finaler Preis = Verkaufspreis aufgerundet auf nächste 0.50€
 * 
 * BESONDERHEIT: 
 * - Nur angemeldete Benutzer können diese Seite nutzen
 * - Unterstützt zwei Währungen: EUR und USD
 * - Unterstützt zwei Sprachen: Deutsch und Englisch
 */

// ===== SICHERHEITS-CHECK =====
// Überprüfe ob Benutzer angemeldet ist
// Falls NICHT angemeldet: Leite zur Login-Seite um
if (!localStorage.getItem('logged_in_user')) {
    window.location.href = 'login.html';  // Nur angemeldete Benutzer dürfen hier sein
}

// ===== GLOBALE EINSTELLUNGEN =====
let currentLanguage = 'de';  // Aktuelle Sprache ('de' = Deutsch, 'en' = English)
let currentCurrency = 'EUR';  // Aktuelle Währung ('EUR' = Euro, 'USD' = Dollar)
const USD_RATE = 1.09;  // Umrechnungskurs: 1 EUR = 1.09 USD
let materialCount = 1;  // Anzahl der hinzugefügten Material-Felder

// ===== SPRACH-ÜBERSETZUNGEN =====
// Alle Texte auf der Seite sind hier gespeichert
// translations['de'] = deutsche Texte
// translations['en'] = englische Texte
// t.key = Genaue Übersetzung abrufen
const translations = {
    de: {
        title: '3D Preisrechner',
        druckerHersteller: 'Hersteller',
        printerHead: 'Drucker',
        printerType: 'Druckermodell',
        materialType: 'Materialart',
        pricePerKg: 'Preis pro kg',
        weight: 'Gewicht (g)',
        addMaterial: '+ Material hinzufügen',
        addMaterialB: '+ Material 2 hinzufügen',
        addMaterialC: '+ Material 3 hinzufügen',
        addMaterialD: '+ Material 4 hinzufügen',
        addWork: '+ Arbeitszeit hinzufügen',
        timeLabel: 'Druckzeit (Stunden)',
        workHeading: 'Arbeitszeit',
        workTimeLabel: 'Arbeitszeit (Stunden)',
        hourlyWageLabel: 'Stundenlohn',
        labor: 'Arbeitszeit',
        timePlaceholder: 'z.B. 4 oder 1:30 oder 1.5',
        calc: 'BERECHNEN',
        roundInfo: '(bei fehlern oder besserungs ideen kontaktieren sie mich bitte unter wallnoel39@gmail.com)',
        roundedPriceLabel: 'Verkaufspreis (gerundet):',
        chooseMaterial: 'Bitte wählen...',
        materialManufacturer: 'Materialhersteller',
        bambulab: 'Bambulab',
        sunlu: 'Sunlu',
        materialA: 'Material 1',
        materialB: 'Material 2',
        materialC: 'Material 3',
        materialD: 'Material 4',
        power: 'Strom',
        wear: 'Abnutzung',
        cost: 'Selbstkosten',
        exactPrice: 'Exakter Preis',
        strompreis: 'Strompreis',
        removeMaterial: 'Entfernen',
        materialE: 'Material 5',
        materialF: 'Material 6',
        materialG: 'Material 7',
        materialH: 'Material 8',
        materialI: 'Material 9',
        materialJ: 'Material 10',
        materialK: 'Material 11',
        materialL: 'Material 12',
        materialM: 'Material 13',
        materialN: 'Material 14',
        materialO: 'Material 15',
        materialP: 'Material 16'
    },
    en: {
        title: '3D Price Calculator',
        druckerHersteller: 'Manufacturer',
        printerHead: 'Printer',
        printerType: 'Printer model',
        materialType: 'Material type',
        pricePerKg: 'Price per kg',
        weight: 'Weight (g)',
        addMaterial: '+ Add Material',
        addMaterialB: 'Add Material 2',
        addMaterialC: 'Add Material 3',
        addMaterialD: 'Add Material 4',
        addWork: '+ Add Work Time',
        timeLabel: 'Print time (hours)',
        workHeading: 'Work Time',
        workTimeLabel: 'Work time (hours)',
        hourlyWageLabel: 'Hourly wage',
        labor: 'Work time',
        timePlaceholder: 'e.g. 4 or 1:30 or 1.5',
        calc: 'CALCULATE',
        roundInfo: '(For errors or suggestions for improvement, please contact me at wallnoel39@gmail.com)',
        roundedPriceLabel: 'Selling price (rounded):',
        chooseMaterial: 'Please select...',
        materialManufacturer: 'Material manufacturer',
        bambulab: 'Bambulab',
        sunlu: 'Sunlu',
        materialA: 'Material 1',
        materialB: 'Material 2',
        materialC: 'Material 3',
        materialD: 'Material 4',
        power: 'Power',
        wear: 'Wear',
        cost: 'Base cost',
        exactPrice: 'Exact price',
        strompreis: 'Electricity price',
        removeMaterial: 'Remove',
        materialE: 'Material 5',
        materialF: 'Material 6',
        materialG: 'Material 7',
        materialH: 'Material 8',
        materialI: 'Material 9',
        materialJ: 'Material 10',
        materialK: 'Material 11',
        materialL: 'Material 12',
        materialM: 'Material 13',
        materialN: 'Material 14',
        materialO: 'Material 15',
        materialP: 'Material 16'
    }
};

// ===== MATERIALPREISE PRO KG =====
// Preislist für alle verfügbaren Materialien in EUR
const baseMaterialPricesEUR = {
    PLA_BASIC: 22.99,
    PLA_MATTE: 22.99,
    PETG_BASIC: 22.99,
    PETG_TRANSLUCENT: 22.99,
    ABS: 22.99,
    TPU_AMS: 35.99,
    SUPPORT_PLA_PETG: 36.99,
    SUNLU_PLA: 9.49,
    SUNLU_PETG: 10.49,
    SUNLU_ABS: 11.99,
};

// Gleiche Preise aber in USD
const baseMaterialPricesUSD = {
    PLA_BASIC: 19.99,
    PLA_MATTE: 19.99,
    PETG_BASIC: 19.99,
    PETG_TRANSLUCENT: 19.99,
    ABS: 19.99,
    TPU_AMS: 34.99,
    SUPPORT_PLA_PETG: 34.99,
    SUNLU_PLA: 10.99,
    SUNLU_PETG: 10.49,
    SUNLU_ABS: 11.99,
};

// Diese Variable wird beim Währungswechsel aktualisiert
let materialPrices = { ...baseMaterialPricesEUR };

// Schönere Namen für die Materialien (z.B. "PLA_BASIC" wird zu "PLA Basic")
const materialNames = {
    PLA_BASIC: 'PLA Basic',
    PLA_MATTE: 'PLA Matte',
    PETG_BASIC: 'PETG Basic',
    PETG_TRANSLUCENT: 'PETG Translucent',
    ABS: 'ABS',
    TPU_AMS: 'TPU for AMS',
    SUPPORT_PLA_PETG: 'Support for PLA/PETG',
    SUNLU_PLA: 'PLA',
    SUNLU_PETG: 'PETG',
    SUNLU_ABS: 'ABS',
};

// ===== DRUCKER-STROMVERBRAUCH =====
// Stromverbrauch in kW für jeden Drucker
// Beispiel: A1 verbraucht 0.1 kW (100 Watt)
const printerPower = {
    'A1': 0.1,          // Bambulab A1 = 100 Watt
    'A1 mini': 0.08,    // Bambulab A1 mini = 80 Watt
    'P1S': 0.1,         // Bambulab P1S = 100 Watt
    'P2S': 0.2,         // Bambulab P2S = 200 Watt
    'X1C': 0.2,         // Bambulab X1C = 200 Watt
    'Kobra': 0.15,      // Anycubic Kobra = 150 Watt
    'Kobra 3': 0.15,    // Anycubic Kobra 3 = 150 Watt
    'Cobra 3 combo': 0.31,  // Anycubic Cobra 3 combo = 310 Watt
};

// ===== VERFÜGBARE DRUCKER PRO HERSTELLER =====
// Welche Drucker gibt es von jedem Hersteller?
const printerModelsByManufacturer = {
    Bambulab: ['A1', 'A1 mini', 'P1S', 'P2S', 'X1C'],
    Anycubic: ['Kobra', 'Kobra 3', 'Cobra 3 combo']
};

// ===== VERFÜGBARE MATERIALIEN PRO HERSTELLER =====
// Welche Materialarten gibt es von jedem Hersteller?
const materialTypesByManufacturer = {
    Bambulab: [
        { value: 'PLA_BASIC', label: 'PLA Basic' },
        { value: 'PLA_MATTE', label: 'PLA Matte' },
        { value: 'PETG_BASIC', label: 'PETG Basic' },
        { value: 'PETG_TRANSLUCENT', label: 'PETG Translucent' },
        { value: 'ABS', label: 'ABS' },
        { value: 'TPU_AMS', label: 'TPU for AMS' },
        { value: 'SUPPORT_PLA_PETG', label: 'Support for PLA/PETG' }
    ],
    Sunlu: [
        { value: 'SUNLU_PLA', label: 'PLA' },
        { value: 'SUNLU_PETG', label: 'PETG' },
        { value: 'SUNLU_ABS', label: 'ABS' }
    ]
};

// ===== HILFSFUNKTIONEN =====

/**
 * getCurrentMaterialManufacturer()
 * AUFGABE: Hole den aktuell ausgewählten Materialhersteller
 * RÜCKGABE: Name des Herstellers (z.B. "Bambulab")
 */
function getCurrentMaterialManufacturer() {
    return document.getElementById('materialManufacturer')?.value || 'Bambulab';
}

/**
 * getMaterialOptions(manufacturer)
 * AUFGABE: Hole alle verfügbaren Materialarten für einen Hersteller
 * PARAMETER: manufacturer = Name des Herstellers (z.B. "Bambulab")
 * RÜCKGABE: Array mit allen Materialien von diesem Hersteller
 */
function getMaterialOptions(manufacturer) {
    return materialTypesByManufacturer[manufacturer] || materialTypesByManufacturer['Bambulab'];
}

/**
 * buildMaterialOptionHtml(manufacturer)
 * AUFGABE: Erstelle HTML-Code für Material-Dropdown-Optionen
 * PARAMETER: manufacturer = Name des Herstellers
 * RÜCKGABE: HTML-String mit allen Material-Optionen
 */
function buildMaterialOptionHtml(manufacturer) {
    const options = getMaterialOptions(manufacturer);
    const symbol = getCurrencySymbol();
    const chooseText = translations[currentLanguage].chooseMaterial;
    return [`<option value="" class="chooseMaterialOption">${chooseText}</option>`,
        ...options.map((option) => {
            const price = materialPrices[option.value] ? materialPrices[option.value].toFixed(2).replace('.', ',') : '0,00';
            return `<option value="${option.value}">${option.label} (${price} ${symbol}/kg)</option>`;
        })
    ].join('');
}

/**
 * updateMaterialOptions()
 * AUFGABE: Aktualisiere alle Material-Dropdowns wenn Hersteller wechselt
 */
function updateMaterialOptions() {
    const manufacturer = getCurrentMaterialManufacturer();
    for (let i = 1; i <= materialCount; i++) {
        const select = document.getElementById(`type_${i}`);
        if (!select) continue;
        const previousValue = select.value;
        select.innerHTML = buildMaterialOptionHtml(manufacturer);
        if (getMaterialOptions(manufacturer).some((option) => option.value === previousValue)) {
            select.value = previousValue;
        }
        syncCustomSelect(select);
    }
    if (document.getElementById('ausgabe').style.display !== 'none') {
        rechnen();  // Berechnung aktualisieren wenn Formular sichtbar ist
    }
}

/**
 * updatePrinterOptions()
 * AUFGABE: Aktualisiere Drucker-Modelle wenn Hersteller wechselt
 */
function updatePrinterOptions() {
    const manufacturer = document.getElementById('hersteller').value;
    const printerSelect = document.getElementById('printer_type');
    const models = printerModelsByManufacturer[manufacturer] || printerModelsByManufacturer['Bambulab'];
    const previousValue = printerSelect.value;

    printerSelect.innerHTML = '';
    models.forEach((model) => {
        const option = document.createElement('option');
        option.value = model;
        option.text = model;
        printerSelect.appendChild(option);
    });

    if (models.includes(previousValue)) {
        printerSelect.value = previousValue;
    }

    initCustomSelects();
    if (document.getElementById('ausgabe').style.display !== 'none') {
        rechnen();
    }
}

/**
 * getCurrencyRate(currency)
 * AUFGABE: Hole den Umrechnungskurs für eine Währung
 * PARAMETER: currency = "USD" oder "EUR"
 * RÜCKGABE: Umrechnungskurs (z.B. 1.09 für USD)
 */
function getCurrencyRate(currency) {
    return currency === 'USD' ? USD_RATE : 1;
}

/**
 * getCurrencySymbol()
 * AUFGABE: Hole das Symbol für die aktuelle Währung
 * RÜCKGABE: "$" für USD oder "€" für EUR
 */
function getCurrencySymbol() {
    return currentCurrency === 'USD' ? '$' : '€';
}

/**
 * updateMoneyLabels()
 * AUFGABE: Aktualisiere alle Geldbeträge und Symbole auf der Seite
 * VERWENDET VON: setCurrency(), setLanguage()
 */
function updateMoneyLabels() {
    const t = translations[currentLanguage];
    const symbol = getCurrencySymbol();
    document.querySelectorAll('[data-i18n="pricePerKg"]').forEach((el) => {
        el.innerText = `${t.pricePerKg} (${symbol})`;
    });
    document.getElementById('hourlyWageLabel').innerText = `${t.hourlyWageLabel} (${symbol})`;
    document.getElementById('strompreisLabel').innerText = `${t.strompreis} (${symbol}/kWh)`;
}

/**
 * updateMaterialOptionLabels()
 * AUFGABE: Aktualisiere Preisanzeige in Material-Dropdowns
 */
function updateMaterialOptionLabels() {
    const symbol = getCurrencySymbol();
    for (let i = 1; i <= materialCount; i++) {
        const select = document.getElementById(`type_${i}`);
        if (!select) continue;
        Array.from(select.options).forEach((opt) => {
            if (!opt.value || !(opt.value in materialPrices)) return;
            const name = materialNames[opt.value] || opt.value;
            const price = materialPrices[opt.value].toFixed(2).replace('.', ',');
            opt.text = `${name} (${price} ${symbol}/kg)`;
        });
    }
}

/**
 * setCurrency(currency)
 * AUFGABE: Wechsle die Währung zwischen EUR und USD
 * PARAMETER: currency = "EUR" oder "USD"
 * 
 * ABLAUF:
 * 1. Rechne alle Preise und Beträge um
 * 2. Aktualisiere alle Anzeigen
 * 3. Speichere neue Währung
 */
function setCurrency(currency) {
    const next = currency === 'USD' ? 'USD' : 'EUR';
    if (next === currentCurrency) {
        updateMoneyLabels();
        updateMaterialOptionLabels();
        initCustomSelects();
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) currencySelect.value = currentCurrency;
        return;
    }

    // Berechne Umrechnungsfaktor
    const oldRate = getCurrencyRate(currentCurrency);
    const newRate = getCurrencyRate(next);
    const factor = newRate / oldRate;
    const newBasePrices = next === 'USD' ? baseMaterialPricesUSD : baseMaterialPricesEUR;

    // Rechne alle Materialpreise um
    for (let i = 1; i <= materialCount; i++) {
        const kgEl = document.getElementById(`kg_${i}`);
        if (!kgEl) continue;
        const val = parseFloat((kgEl.value || '').replace(',', '.'));
        if (!Number.isFinite(val)) continue;
        const typeEl = document.getElementById(`type_${i}`);
        const selectedType = typeEl ? typeEl.value : null;
        const oldPrice = selectedType ? materialPrices[selectedType] : undefined;
        const newPrice = selectedType ? newBasePrices[selectedType] : undefined;
        if (oldPrice !== undefined && newPrice !== undefined && Math.abs(val - oldPrice) < 0.01) {
            kgEl.value = newPrice.toFixed(2);
        } else {
            kgEl.value = (val * factor).toFixed(2);
        }
    }

    // Rechne Stundenlohn um
    const hwEl = document.getElementById('hourlyWage');
    if (hwEl) {
        const hwVal = parseFloat((hwEl.value || '').replace(',', '.'));
        if (Number.isFinite(hwVal)) hwEl.value = (hwVal * factor).toFixed(2);
    }

    // Rechne Strompreis um
    const spEl = document.getElementById('strompreis');
    if (spEl) {
        const spVal = parseFloat((spEl.value || '').replace(',', '.'));
        if (Number.isFinite(spVal)) spEl.value = (spVal * factor).toFixed(2);
    }

    currentCurrency = next;
    materialPrices = { ...newBasePrices };

    updateMoneyLabels();
    updateMaterialOptionLabels();
    initCustomSelects();
    const tCurr = translations[currentLanguage];
    document.getElementById('roundInfo').innerText = tCurr.roundInfo;
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) currencySelect.value = currentCurrency;

    if (document.getElementById('ausgabe').style.display !== 'none') rechnen();
}

/**
 * closeAllCustomSelects(exceptId)
 * AUFGABE: Schließe alle Material-Dropdowns außer einem
 * PARAMETER: exceptId = ID des Dropdowns der OFFEN bleiben soll
 */
function closeAllCustomSelects(exceptId) {
    document.querySelectorAll('.custom-select').forEach((wrap) => {
        if (wrap.dataset.selectId !== exceptId) {
            const list = wrap.querySelector('.custom-select-list');
            if (list) list.classList.add('hidden');
        }
    });
}

/**
 * syncCustomSelect(select)
 * AUFGABE: Synchronisiere Custom-Select mit echtem HTML-Select
 * VERWENDET VON: initCustomSelects()
 */
function syncCustomSelect(select) {
    const custom = select._custom;
    if (!custom) return;

    custom.list.innerHTML = '';
    Array.from(select.options).forEach((opt) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'custom-select-option' + (opt.value === select.value ? ' active' : '');
        item.innerText = opt.text;
        item.onclick = () => {
            select.value = opt.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            custom.trigger.innerText = opt.text;
            custom.list.classList.add('hidden');
            syncCustomSelect(select);
        };
        custom.list.appendChild(item);
    });

    const selected = select.options[select.selectedIndex];
    custom.trigger.innerText = selected ? selected.text : '';
}

/**
 * initCustomSelects()
 * AUFGABE: Initialisiere alle Material-Dropdowns als Custom-Selects
 * WICHTIG: Wird am Anfang und bei Änderungen aufgerufen
 */
function initCustomSelects() {
    document.querySelectorAll('.material-select').forEach((select) => {
        if (select._custom) {
            syncCustomSelect(select);
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'custom-select';
        wrap.dataset.selectId = select.id;

        select.classList.add('native-select-hidden');
        select.parentNode.insertBefore(wrap, select);
        wrap.appendChild(select);

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select-trigger';
        wrap.appendChild(trigger);

        const list = document.createElement('div');
        list.className = 'custom-select-list hidden';
        wrap.appendChild(list);

        trigger.onclick = (e) => {
            e.stopPropagation();
            const willOpen = list.classList.contains('hidden');
            closeAllCustomSelects(select.id);
            list.classList.toggle('hidden', !willOpen);
        };

        select._custom = { trigger, list };
        select.addEventListener('change', () => syncCustomSelect(select));
        syncCustomSelect(select);
    });

    if (!window._customSelectOutsideHandler) {
        window._customSelectOutsideHandler = true;
        document.addEventListener('click', () => closeAllCustomSelects(''));
    }
}

/**
 * setLanguage(lang)
 * AUFGABE: Wechsle die Sprache zwischen Deutsch und Englisch
 * PARAMETER: lang = "de" oder "en"
 * 
 * ABLAUF:
 * 1. Aktualisiere globale Sprach-Variable
 * 2. Übersetze alle Texte auf der Seite
 * 3. Aktualisiere Platzhalter und Beschreibungen
 * 4. Berechnung erneut ausführen wenn Formular sichtbar
 */
function setLanguage(lang) {
    currentLanguage = translations[lang] ? lang : 'de';
    const t = translations[currentLanguage];

    // Setze HTML-Sprache für Browser
    document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'de';
    
    // Aktualisiere alle großen Überschriften
    document.getElementById('titleText').innerText = t.title;
    document.getElementById('printerHead').innerText = t.printerHead;
    document.getElementById('strompreisLabel').innerText = t.strompreis + ' (€/kWh)';
    
    // Aktualisiere Buttons
    const addMaterialBtn = document.getElementById('addMaterialBtn');
    if (addMaterialBtn) addMaterialBtn.innerText = t.addMaterial;
    const addB = document.getElementById('addB');
    if (addB) addB.innerText = t.addMaterialB;
    const addC = document.getElementById('addC');
    if (addC) addC.innerText = t.addMaterialC;
    const addD = document.getElementById('addD');
    if (addD) addD.innerText = t.addMaterialD;
    
    // Aktualisiere Formular-Labels
    document.getElementById('addWork').innerText = t.addWork;
    document.getElementById('timeLabel').innerText = t.timeLabel;
    document.getElementById('zeit').placeholder = t.timePlaceholder;
    document.getElementById('calcBtn').innerText = t.calc;
    document.getElementById('roundInfo').innerText = t.roundInfo;
    document.getElementById('roundedPriceLabel').innerText = t.roundedPriceLabel;
    
    // Aktualisiere Material-Überschriften
    document.getElementById('matAHeading').innerText = t.materialA;
    const matBHeading = document.getElementById('matBHeading');
    if (matBHeading) matBHeading.innerText = t.materialB;
    const matCHeading = document.getElementById('matCHeading');
    if (matCHeading) matCHeading.innerText = t.materialC;
    const matDHeading = document.getElementById('matDHeading');
    if (matDHeading) matDHeading.innerText = t.materialD;
    
    // Aktualisiere dynamisch hinzugefügte Material-Überschriften
    for (let i = 2; i <= materialCount; i++) {
        const matHeading = document.getElementById(`matHeading_${i}`);
        if (matHeading) {
            const key = 'material' + String.fromCharCode(64 + i);
            matHeading.innerText = t[key] || `Material ${i}`;
        }
    }
    
    // Aktualisiere Arbeitszeit-Section
    document.getElementById('workHeading').innerText = t.workHeading;
    document.getElementById('workTimeLabel').innerText = t.workTimeLabel;
    document.getElementById('hourlyWageLabel').innerText = t.hourlyWageLabel;

    updateMoneyLabels();

    // Aktualisiere alle Elemente mit data-i18n Attribut
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });

    // Aktualisiere "Bitte wählen" Platzhalter
    document.querySelectorAll('.chooseMaterialOption').forEach((el) => {
        el.innerText = t.chooseMaterial;
    });

    initCustomSelects();

    // Setze Sprach-Dropdown
    document.getElementById('languageSelect').value = currentLanguage;

    // Berechnung erneut ausführen wenn sichtbar
    if (document.getElementById('ausgabe').style.display !== 'none') rechnen();
}

/**
 * setMaterialPrice(materialIndex, materialType)
 * AUFGABE: Setze den Preis in einem Material-Feld basierend auf Auswahl
 * PARAMETER: 
 *   - materialIndex = Nummer des Materials (1, 2, 3, ...)
 *   - materialType = Code des Materials (z.B. "PLA_BASIC")
 */
function setMaterialPrice(materialIndex, materialType) {
    const priceInput = document.getElementById(`kg_${materialIndex}`);
    if (!priceInput) return;
    priceInput.value = materialPrices[materialType] || 0;
}

/**
 * addMaterial()
 * AUFGABE: Füge ein neues Material-Eingabefeld hinzu (maximal 16)
 */
function addMaterial() {
    if (materialCount >= 16) return;  // Maximum 16 Materialien
    materialCount++;
    const container = document.getElementById('materialsContainer');
    const section = document.createElement('div');
    section.className = 'section';
    section.id = `sec${materialCount}`;
    const t = translations[currentLanguage];
    const manufacturer = getCurrentMaterialManufacturer();
    const materialOptions = buildMaterialOptionHtml(manufacturer);
    
    // Erstelle neue Material-Section
    section.innerHTML = `
        <strong id="matHeading_${materialCount}">${t['material' + String.fromCharCode(64 + materialCount)]}</strong>
        <label data-i18n="materialType">Materialart</label>
        <select id="type_${materialCount}" class="material-select" onchange="setMaterialPrice(${materialCount}, this.value)">
            ${materialOptions}
        </select>
        <label data-i18n="pricePerKg">Preis pro kg (€)</label>
        <input type="number" id="kg_${materialCount}" value="0" step="0.01">
        <label data-i18n="weight">Gewicht (g)</label>
        <input type="number" id="g_${materialCount}" value="0">
        <button class="btn-remove" onclick="removeMaterial(${materialCount})">${t.removeMaterial}</button>
    `;
    container.appendChild(section);
    updateMaterialOptionLabels();
    initCustomSelects();
    
    // Verstecke "Material hinzufügen" Button wenn 16 erreicht
    if (materialCount >= 16) {
        document.getElementById('addMaterialBtn').style.display = 'none';
    }
}

/**
 * removeMaterial(index)
 * AUFGABE: Entferne ein Material-Eingabefeld
 * PARAMETER: index = Nummer des Materials zum Löschen
 */
function removeMaterial(index) {
    const section = document.getElementById(`sec${index}`);
    if (section) section.remove();
    materialCount--;
    
    // Zeige "Material hinzufügen" Button wieder wenn unter 16
    document.getElementById('addMaterialBtn').style.display = 'block';
}

/**
 * show(id, btnId, nextBtnId)
 * AUFGABE: Zeige einen versteckten Bereich und verstecke Buttons
 */
function show(id, btnId, nextBtnId) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(btnId).classList.add('hidden');
    if (nextBtnId) document.getElementById(nextBtnId).classList.remove('hidden');
}

/**
 * parseZeit(val)
 * AUFGABE: Parse Zeitangaben in verschiedenen Formaten zu Stunden
 * 
 * UNTERSTÜTZTE FORMATE:
 * - "4" = 4 Stunden
 * - "1:30" = 1 Stunde 30 Minuten
 * - "1.5" = 1.5 Stunden
 * 
 * RÜCKGABE: Zeit in Stunden als Dezimalzahl
 */
function parseZeit(val) {
    val = (val || '').trim().replace(',', '.');  // Ersetze Komma mit Punkt
    
    if (val.includes(':')) {
        // Format: "1:30" = 1 Stunde 30 Minuten
        const parts = val.split(':');
        return (parseFloat(parts[0]) || 0) + (parseFloat(parts[1]) || 0) / 60;
    }
    
    if (val.includes('.')) {
        // Format: "1.5" = 1.5 Stunden
        const parts = val.split('.');
        const hours = parseFloat(parts[0]) || 0;
        const decimal = parseFloat('0.' + parts[1]) || 0;
        const minutes = decimal * 100;
        return hours + minutes / 60;
    }
    
    // Format: "4" = 4 Stunden
    return parseFloat(val) || 0;
}

// ===== HAUPTFUNKTION: PREISBERECHNUNG =====

/**
 * rechnen()
 * 
 * AUFGABE: Berechne den Verkaufspreis für einen 3D-Druck
 * 
 * BERECHNUNGSLOGIK:
 * 1. Hole alle Eingabewerte aus dem Formular
 * 2. Berechne Materialkosten (alle Materialien zusammen)
 * 3. Berechne Stromkosten = Druckzeit × Stromverbrauch × Strompreis
 * 4. Berechne Verschleiß = Druckzeit × 0.05€ pro Stunde
 * 5. Berechne Arbeitskosten = Arbeitszeit × Stundenlohn
 * 6. Berechne Selbstkosten = Material + Strom + Verschleiß
 * 7. Berechne Verkaufspreis = Selbstkosten × 2.5 + Arbeitskosten
 * 8. Berechne finalen Preis = Verkaufspreis aufgerundet auf 0.50€
 * 9. Zeige Ergebnis und Details auf der Seite
 */
function rechnen() {
    // Hilfsfunktion: Hole einen Eingabewert und konvertiere zu Zahl
    const v = (id) => parseFloat(document.getElementById(id).value.replace(',', '.')) || 0;

    // ===== SCHRITT 1: MATERIALKOSTEN =====
    // Addiere alle Materialkosten zusammen
    let matTotal = 0;
    for (let i = 1; i <= materialCount; i++) {
        const kg = v(`kg_${i}`);  // Preis pro kg
        const g = v(`g_${i}`);    // Gewicht in Gramm
        matTotal += (kg / 1000) * g;  // Konvertiere kg-Preis zu g-Preis und multipliziere
    }

    // ===== SCHRITT 2: DRUCKZEIT PARSING =====
    // Parse die Druckzeit (unterstützt Formate wie "4", "1:30", "1.5")
    const zeit = parseZeit(document.getElementById('zeit').value);
    
    // ===== SCHRITT 3: WÄHRUNGSUMRECHNUNG =====
    // Hole Umrechnungskurs für aktuelle Währung
    const rate = getCurrencyRate(currentCurrency);
    
    // ===== SCHRITT 4: STROMKOSTEN =====
    // Hole Drucker-Stromverbrauch
    const drucker = document.getElementById('printer_type').value;
    const power = printerPower[drucker] || 0.11;  // kW (Standard 110 Watt)
    const strompreis = v('strompreis');  // Euro pro kWh
    // Formel: Zeit (h) × Leistung (kW) × Strompreis (€/kWh) × Währungskurs
    const strom = ((zeit * power) * strompreis) * rate;
    
    // ===== SCHRITT 5: VERSCHLEISSKOSTEN =====
    // Drucker verschleißt im Laufe der Zeit (~0.05€ pro Stunde)
    const abnutzung = (zeit * 0.05) * rate;
    
    // ===== SCHRITT 6: ARBEITSKOSTEN =====
    // Parse Arbeitszeit und hole Stundenlohn
    const arbeitszeit = parseZeit(document.getElementById('workTime').value);
    const stundenlohn = v('hourlyWage');
    const arbeitskosten = arbeitszeit * stundenlohn;

    // ===== SCHRITT 7: SELBSTKOSTEN BERECHNEN =====
    const rohpreis = matTotal + strom + abnutzung;
    
    // ===== SCHRITT 8: VERKAUFSPREIS MIT GEWINNMARGE =====
    // Multiplikator 2.5 = Kosten + 150% Gewinn
    const preis = rohpreis * 2.5;
    
    // ===== SCHRITT 9: FINALER PREIS =====
    const endpreis = preis + arbeitskosten;
    
    // ===== SCHRITT 10: PREIS RUNDEN =====
    // Runde auf nächste 0.50€ nach oben
    const verkaufspreisGerundet = Math.ceil(endpreis * 2) / 2;

    // ===== DETAIL-ANSICHT ERSTELLEN =====
    const t = translations[currentLanguage];
    const symbol = getCurrencySymbol();
    let detailText = '';
    
    // Zeige jeden Material-Kostenpunkt
    for (let i = 1; i <= materialCount; i++) {
        const kg = v(`kg_${i}`);
        const g = v(`g_${i}`);
        const matCost = (kg / 1000) * g;
        if (matCost > 0) {
            detailText += `Material ${i}: ${matCost.toFixed(2)}${symbol}<br>`;
        }
    }
    
    // Zeige Strom, Verschleiß, Arbeitskosten und Selbstkosten
    detailText += `${t.power}: ${strom.toFixed(2)}${symbol} | ${t.wear}: ${abnutzung.toFixed(2)}${symbol} | ${t.labor}: ${arbeitskosten.toFixed(2)}${symbol} | ${t.cost}: ${rohpreis.toFixed(2)}${symbol}<br>`;
    detailText += `<small>${t.exactPrice}: ${endpreis.toFixed(2)}${symbol}</small>`;

    // ===== ERGEBNIS ANZEIGEN =====
    document.getElementById('details').innerHTML = detailText;
    document.getElementById('gesamt').innerText = verkaufspreisGerundet.toFixed(2) + ' ' + symbol;
    document.getElementById('ausgabe').style.display = 'block';
}

// ===== INITIALISIERUNG (Beim Seitenstart) =====
// Setze Standard-Währung und Sprache
setCurrency('EUR');
setLanguage('de');
document.getElementById('languageSelect').value = 'de';
initCustomSelects();

// ===== KONFIGURATION =====
// Sprache: 'de' oder 'en' (Standard: Deutsch)
let currentLanguage = 'de';
// Währung: 'EUR' oder 'USD'
let currentCurrency = 'EUR';
// Umrechnungskurs USD zu EUR
const USD_RATE = 1.09;
// Anzahl der hinzugefügten Materialien
let materialCount = 1;

// ===== ÜBERSETZUNGEN =====
const translations = {
    de: {
        title: '3D Preisrechner',
        druckerHersteller: 'Hersteller',
        printerHead: 'Drucker',
        printerType: 'Druckermodell',
        materialType: 'Materialart',
        pricePerKg: 'Preis pro kg',
        weight: 'Gewicht (g)',
        addMaterial: '+ Material hinzufügen',
        addMaterialB: '+ Material 2 hinzufügen',
        addMaterialC: '+ Material 3 hinzufügen',
        addMaterialD: '+ Material 4 hinzufügen',
        addWork: '+ Arbeitszeit hinzufügen',
        timeLabel: 'Druckzeit (Stunden)',
        workHeading: 'Arbeitszeit',
        workTimeLabel: 'Arbeitszeit (Stunden)',
        hourlyWageLabel: 'Stundenlohn',
        labor: 'Arbeitszeit',
        timePlaceholder: 'z.B. 4 oder 1:30 oder 1.5',
        calc: 'BERECHNEN',
        roundInfo: '(bei fehlern oder besserungs ideen kontaktieren sie mich bitte unter wallnoel39@gmail.com)',
        roundedPriceLabel: 'Verkaufspreis (gerundet):',
        chooseMaterial: 'Bitte wählen...',
        materialManufacturer: 'Materialhersteller',
        bambulab: 'Bambulab',
        sunlu: 'Sunlu',
        materialA: 'Material 1',
        materialB: 'Material 2',
        materialC: 'Material 3',
        materialD: 'Material 4',
        power: 'Strom',
        wear: 'Abnutzung',
        cost: 'Selbstkosten',
        exactPrice: 'Exakter Preis',
        strompreis: 'Strompreis',
        removeMaterial: 'Entfernen',
        materialE: 'Material 5',
        materialF: 'Material 6',
        materialG: 'Material 7',
        materialH: 'Material 8',
        materialI: 'Material 9',
        materialJ: 'Material 10',
        materialK: 'Material 11',
        materialL: 'Material 12',
        materialM: 'Material 13',
        materialN: 'Material 14',
        materialO: 'Material 15',
        materialP: 'Material 16'
    },
    en: {
        title: '3D Price Calculator',
        druckerHersteller: 'Manufacturer',
        printerHead: 'Printer',
        printerType: 'Printer model',
        materialType: 'Material type',
        pricePerKg: 'Price per kg',
        weight: 'Weight (g)',
        addMaterial: '+ Add Material',
        addMaterialB: 'Add Material 2',
        addMaterialC: 'Add Material 3',
        addMaterialD: 'Add Material 4',
        addWork: '+ Add Work Time',
        timeLabel: 'Print time (hours)',
        workHeading: 'Work Time',
        workTimeLabel: 'Work time (hours)',
        hourlyWageLabel: 'Hourly wage',
        labor: 'Work time',
        timePlaceholder: 'e.g. 4 or 1:30 or 1.5',
        calc: 'CALCULATE',
        roundInfo: '(For errors or suggestions for improvement, please contact me at wallnoel39@gmail.com)',
        roundedPriceLabel: 'Selling price (rounded):',
        chooseMaterial: 'Please select...',
        materialManufacturer: 'Material manufacturer',
        bambulab: 'Bambulab',
        sunlu: 'Sunlu',
        materialA: 'Material 1',
        materialB: 'Material 2',
        materialC: 'Material 3',
        materialD: 'Material 4',
        power: 'Power',
        wear: 'Wear',
        cost: 'Base cost',
        exactPrice: 'Exact price',
        strompreis: 'Electricity price',
        removeMaterial: 'Remove',
        materialE: 'Material 5',
        materialF: 'Material 6',
        materialG: 'Material 7',
        materialH: 'Material 8',
        materialI: 'Material 9',
        materialJ: 'Material 10',
        materialK: 'Material 11',
        materialL: 'Material 12',
        materialM: 'Material 13',
        materialN: 'Material 14',
        materialO: 'Material 15',
        materialP: 'Material 16'
    }
};

// ===== MATERIALPREISE =====
// Preise pro kg in EUR und USD
const baseMaterialPricesEUR = {
    PLA_BASIC: 22.99,
    PLA_MATTE: 22.99,
    PETG_BASIC: 22.99,
    PETG_TRANSLUCENT: 22.99,
    ABS: 22.99,
    TPU_AMS: 35.99,
    SUPPORT_PLA_PETG: 36.99,
    SUNLU_PLA: 9.49,
    SUNLU_PETG: 10.49,
    SUNLU_ABS: 11.99,
};
const baseMaterialPricesUSD = {
    PLA_BASIC: 19.99,
    PLA_MATTE: 19.99,
    PETG_BASIC: 19.99,
    PETG_TRANSLUCENT: 19.99,
    ABS: 19.99,
    TPU_AMS: 34.99,
    SUPPORT_PLA_PETG: 34.99,
    SUNLU_PLA: 10.99,
    SUNLU_PETG: 10.49,
    SUNLU_ABS: 11.99,
};
let materialPrices = { ...baseMaterialPricesEUR };
const materialNames = {
    PLA_BASIC: 'PLA Basic',
    PLA_MATTE: 'PLA Matte',
    PETG_BASIC: 'PETG Basic',
    PETG_TRANSLUCENT: 'PETG Translucent',
    ABS: 'ABS',
    TPU_AMS: 'TPU for AMS',
    SUPPORT_PLA_PETG: 'Support for PLA/PETG',
    SUNLU_PLA: 'PLA',
    SUNLU_PETG: 'PETG',
    SUNLU_ABS: 'ABS',
};

const printerPower = {
    'A1': 0.1, // kW
    'A1 mini': 0.08,
    'P1S': 0.1,
    'P2S': 0.2,
    'X1C': 0.2,
    'Kobra': 0.15,
    'Kobra 3': 0.15,
    'Cobra 3 combo': 0.31,
};

// ===== DRUCKER-MODELLE =====
// Verfügbare Drucker für jeden Hersteller
const printerModelsByManufacturer = {
    Bambulab: ['A1', 'A1 mini', 'P1S', 'P2S', 'X1C'],
    Anycubic: ['Kobra', 'Kobra 3', 'Cobra 3 combo']
};

// ===== MATERIALTYPEN PRO HERSTELLER =====
// Verfügbare Materialarten für jeden Druckerhersteller
const materialTypesByManufacturer = {
    Bambulab: [
        { value: 'PLA_BASIC', label: 'PLA Basic' },
        { value: 'PLA_MATTE', label: 'PLA Matte' },
        { value: 'PETG_BASIC', label: 'PETG Basic' },
        { value: 'PETG_TRANSLUCENT', label: 'PETG Translucent' },
        { value: 'ABS', label: 'ABS' },
        { value: 'TPU_AMS', label: 'TPU for AMS' },
        { value: 'SUPPORT_PLA_PETG', label: 'Support for PLA/PETG' }
    ],
    Sunlu: [
        { value: 'SUNLU_PLA', label: 'PLA' },
        { value: 'SUNLU_PETG', label: 'PETG' },
        { value: 'SUNLU_ABS', label: 'ABS' }
    ]
};

// ===== HILFSFUNKTIONEN - MATERIALVERWALTUNG =====

/**
 * Gibt den aktuell ausgewählten Materialhersteller zurück
 */
function getCurrentMaterialManufacturer() {
    return document.getElementById('materialManufacturer')?.value || 'Bambulab';
}

function getMaterialOptions(manufacturer) {
    return materialTypesByManufacturer[manufacturer] || materialTypesByManufacturer['Bambulab'];
}

function buildMaterialOptionHtml(manufacturer) {
    const options = getMaterialOptions(manufacturer);
    const symbol = getCurrencySymbol();
    const chooseText = translations[currentLanguage].chooseMaterial;
    return [`<option value="" class="chooseMaterialOption">${chooseText}</option>`,
        ...options.map((option) => {
            const price = materialPrices[option.value] ? materialPrices[option.value].toFixed(2).replace('.', ',') : '0,00';
            return `<option value="${option.value}">${option.label} (${price} ${symbol}/kg)</option>`;
        })
    ].join('');
}

function updateMaterialOptions() {
    const manufacturer = getCurrentMaterialManufacturer();
    for (let i = 1; i <= materialCount; i++) {
        const select = document.getElementById(`type_${i}`);
        if (!select) continue;
        const previousValue = select.value;
        select.innerHTML = buildMaterialOptionHtml(manufacturer);
        if (getMaterialOptions(manufacturer).some((option) => option.value === previousValue)) {
            select.value = previousValue;
        }
        syncCustomSelect(select);
    }
    if (document.getElementById('ausgabe').style.display !== 'none') {
        rechnen();
    }
}

function updatePrinterOptions() {
    const manufacturer = document.getElementById('hersteller').value;
    const printerSelect = document.getElementById('printer_type');
    const models = printerModelsByManufacturer[manufacturer] || printerModelsByManufacturer['Bambulab'];
    const previousValue = printerSelect.value;

    printerSelect.innerHTML = '';
    models.forEach((model) => {
        const option = document.createElement('option');
        option.value = model;
        option.text = model;
        printerSelect.appendChild(option);
    });

    if (models.includes(previousValue)) {
        printerSelect.value = previousValue;
    }

    initCustomSelects();
    if (document.getElementById('ausgabe').style.display !== 'none') {
        rechnen();
    }
}

function getCurrencyRate(currency) {
    return currency === 'USD' ? USD_RATE : 1;
}

function getCurrencySymbol() {
    return currentCurrency === 'USD' ? '$' : '€';
}

// ===== HILFSFUNKTIONEN - SPRACHE & WÄHRUNG =====

/**
 * Aktualisiert alle Geldbeträge auf der Seite (€ oder $)
 */
function updateMoneyLabels() {
    const t = translations[currentLanguage];
    const symbol = getCurrencySymbol();
    document.querySelectorAll('[data-i18n="pricePerKg"]').forEach((el) => {
        el.innerText = `${t.pricePerKg} (${symbol})`;
    });
    document.getElementById('hourlyWageLabel').innerText = `${t.hourlyWageLabel} (${symbol})`;
    document.getElementById('strompreisLabel').innerText = `${t.strompreis} (${symbol}/kWh)`;
}

function updateMaterialOptionLabels() {
    const symbol = getCurrencySymbol();
    for (let i = 1; i <= materialCount; i++) {
        const select = document.getElementById(`type_${i}`);
        if (!select) continue;
        Array.from(select.options).forEach((opt) => {
            if (!opt.value || !(opt.value in materialPrices)) return;
            const name = materialNames[opt.value] || opt.value;
            const price = materialPrices[opt.value].toFixed(2).replace('.', ',');
            opt.text = `${name} (${price} ${symbol}/kg)`;
        });
    }
}

/**
 * Wechselt die Währung zwischen EUR und USD
 */
function setCurrency(currency) {
    const next = currency === 'USD' ? 'USD' : 'EUR';
    if (next === currentCurrency) {
        updateMoneyLabels();
        updateMaterialOptionLabels();
        initCustomSelects();
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) currencySelect.value = currentCurrency;
        return;
    }

    const oldRate = getCurrencyRate(currentCurrency);
    const newRate = getCurrencyRate(next);
    const factor = newRate / oldRate;
    const newBasePrices = next === 'USD' ? baseMaterialPricesUSD : baseMaterialPricesEUR;

    for (let i = 1; i <= materialCount; i++) {
        const kgEl = document.getElementById(`kg_${i}`);
        if (!kgEl) continue;
        const val = parseFloat((kgEl.value || '').replace(',', '.'));
        if (!Number.isFinite(val)) continue;
        const typeEl = document.getElementById(`type_${i}`);
        const selectedType = typeEl ? typeEl.value : null;
        const oldPrice = selectedType ? materialPrices[selectedType] : undefined;
        const newPrice = selectedType ? newBasePrices[selectedType] : undefined;
        if (oldPrice !== undefined && newPrice !== undefined && Math.abs(val - oldPrice) < 0.01) {
            kgEl.value = newPrice.toFixed(2);
        } else {
            kgEl.value = (val * factor).toFixed(2);
        }
    }

    const hwEl = document.getElementById('hourlyWage');
    if (hwEl) {
        const hwVal = parseFloat((hwEl.value || '').replace(',', '.'));
        if (Number.isFinite(hwVal)) hwEl.value = (hwVal * factor).toFixed(2);
    }

    const spEl = document.getElementById('strompreis');
    if (spEl) {
        const spVal = parseFloat((spEl.value || '').replace(',', '.'));
        if (Number.isFinite(spVal)) spEl.value = (spVal * factor).toFixed(2);
    }

    currentCurrency = next;
    materialPrices = { ...newBasePrices };

    updateMoneyLabels();
    updateMaterialOptionLabels();
    initCustomSelects();
    const tCurr = translations[currentLanguage];
    document.getElementById('roundInfo').innerText = tCurr.roundInfo.replace('{symbol}', getCurrencySymbol());
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) currencySelect.value = currentCurrency;

    if (document.getElementById('ausgabe').style.display !== 'none') rechnen();
}

function closeAllCustomSelects(exceptId) {
    document.querySelectorAll('.custom-select').forEach((wrap) => {
        if (wrap.dataset.selectId !== exceptId) {
            const list = wrap.querySelector('.custom-select-list');
            if (list) list.classList.add('hidden');
        }
    });
}

function syncCustomSelect(select) {
    const custom = select._custom;
    if (!custom) return;

    custom.list.innerHTML = '';
    Array.from(select.options).forEach((opt) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'custom-select-option' + (opt.value === select.value ? ' active' : '');
        item.innerText = opt.text;
        item.onclick = () => {
            select.value = opt.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            custom.trigger.innerText = opt.text;
            custom.list.classList.add('hidden');
            syncCustomSelect(select);
        };
        custom.list.appendChild(item);
    });

    const selected = select.options[select.selectedIndex];
    custom.trigger.innerText = selected ? selected.text : '';
}

function initCustomSelects() {
    document.querySelectorAll('.material-select').forEach((select) => {
        if (select._custom) {
            syncCustomSelect(select);
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'custom-select';
        wrap.dataset.selectId = select.id;

        select.classList.add('native-select-hidden');
        select.parentNode.insertBefore(wrap, select);
        wrap.appendChild(select);

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select-trigger';
        wrap.appendChild(trigger);

        const list = document.createElement('div');
        list.className = 'custom-select-list hidden';
        wrap.appendChild(list);

        trigger.onclick = (e) => {
            e.stopPropagation();
            const willOpen = list.classList.contains('hidden');
            closeAllCustomSelects(select.id);
            list.classList.toggle('hidden', !willOpen);
        };

        select._custom = { trigger, list };
        select.addEventListener('change', () => syncCustomSelect(select));
        syncCustomSelect(select);
    });

    if (!window._customSelectOutsideHandler) {
        window._customSelectOutsideHandler = true;
        document.addEventListener('click', () => closeAllCustomSelects(''));
    }
}

/**
 * Wechselt die Sprache der gesamten Seite (Deutsch/Englisch)
 */
function setLanguage(lang) {
    currentLanguage = translations[lang] ? lang : 'de';
    const t = translations[currentLanguage];

    document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'de';
    document.getElementById('titleText').innerText = t.title;
    document.getElementById('printerHead').innerText = t.printerHead;
    document.getElementById('strompreisLabel').innerText = t.strompreis + ' (€/kWh)';
    const addMaterialBtn = document.getElementById('addMaterialBtn');
    if (addMaterialBtn) addMaterialBtn.innerText = t.addMaterial;
    const addB = document.getElementById('addB');
    if (addB) addB.innerText = t.addMaterialB;
    const addC = document.getElementById('addC');
    if (addC) addC.innerText = t.addMaterialC;
    const addD = document.getElementById('addD');
    if (addD) addD.innerText = t.addMaterialD;
    document.getElementById('addWork').innerText = t.addWork;
    document.getElementById('timeLabel').innerText = t.timeLabel;
    document.getElementById('zeit').placeholder = t.timePlaceholder;
    document.getElementById('calcBtn').innerText = t.calc;
    document.getElementById('roundInfo').innerText = t.roundInfo.replace('{symbol}', getCurrencySymbol());
    document.getElementById('roundedPriceLabel').innerText = t.roundedPriceLabel;
    document.getElementById('matAHeading').innerText = t.materialA;
    const matBHeading = document.getElementById('matBHeading');
    if (matBHeading) matBHeading.innerText = t.materialB;
    const matCHeading = document.getElementById('matCHeading');
    if (matCHeading) matCHeading.innerText = t.materialC;
    const matDHeading = document.getElementById('matDHeading');
    if (matDHeading) matDHeading.innerText = t.materialD;
    
    // Update dynamically added material headings
    for (let i = 2; i <= materialCount; i++) {
        const matHeading = document.getElementById(`matHeading_${i}`);
        if (matHeading) {
            const key = 'material' + String.fromCharCode(64 + i);
            matHeading.innerText = t[key] || `Material ${i}`;
        }
    }
    
    document.getElementById('workHeading').innerText = t.workHeading;
    document.getElementById('workTimeLabel').innerText = t.workTimeLabel;
    document.getElementById('hourlyWageLabel').innerText = t.hourlyWageLabel;

    updateMoneyLabels();

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });

    updateMoneyLabels();

    document.querySelectorAll('.chooseMaterialOption').forEach((el) => {
        el.innerText = t.chooseMaterial;
    });

    initCustomSelects();

    document.getElementById('languageSelect').value = currentLanguage;

    if (document.getElementById('ausgabe').style.display !== 'none') rechnen();
}

// ===== HILFSFUNKTIONEN - MATERIAL-VERWALTUNG =====

/**
 * Setzt den Preis für ein spezifisches Material basierend auf Materialtyp
 */
function setMaterialPrice(materialIndex, materialType) {
    const priceInput = document.getElementById(`kg_${materialIndex}`);
    if (!priceInput) return;
    priceInput.value = materialPrices[materialType] || 0;
}

/**
 * Fügt ein neues Material-Feld hinzu (bis zu 16 verschiedene Materialien)
 */
function addMaterial() {
    if (materialCount >= 16) return;
    materialCount++;
    const container = document.getElementById('materialsContainer');
    const section = document.createElement('div');
    section.className = 'section';
    section.id = `sec${materialCount}`;
    const t = translations[currentLanguage];
    const manufacturer = getCurrentMaterialManufacturer();
    const materialOptions = buildMaterialOptionHtml(manufacturer);
    section.innerHTML = `
        <strong id="matHeading_${materialCount}">${t['material' + String.fromCharCode(64 + materialCount)]}</strong>
        <label data-i18n="materialType">Materialart</label>
        <select id="type_${materialCount}" class="material-select" onchange="setMaterialPrice(${materialCount}, this.value)">
            ${materialOptions}
        </select>
        <label data-i18n="pricePerKg">Preis pro kg (€)</label>
        <input type="number" id="kg_${materialCount}" value="0" step="0.01">
        <label data-i18n="weight">Gewicht (g)</label>
        <input type="number" id="g_${materialCount}" value="0">
        <button class="btn-remove" onclick="removeMaterial(${materialCount})">${t.removeMaterial}</button>
    `;
    container.appendChild(section);
    updateMaterialOptionLabels();
    initCustomSelects();
    if (materialCount >= 16) {
        document.getElementById('addMaterialBtn').style.display = 'none';
    }
}

function removeMaterial(index) {
    const section = document.getElementById(`sec${index}`);
    if (section) section.remove();
    materialCount--;
    document.getElementById('addMaterialBtn').style.display = 'block';
    // Renumber if needed, but for simplicity, leave IDs as is
}

function show(id, btnId, nextBtnId) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(btnId).classList.add('hidden');
    if (nextBtnId) document.getElementById(nextBtnId).classList.remove('hidden');
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
        const minutes = decimal * 100; // 0.3 -> 30 minutes
        return hours + minutes / 60;
    }
    return parseFloat(val) || 0;
}

// ===== HAUPTFUNKTION: BERECHNUNG =====

/**
 * Hauptfunktion: Berechnet den Preis für einen 3D-Druck
 * 
 * Berechnungsschritte:
 * 1. Materialkosten (Gewicht * Preis pro kg)
 * 2. Stromkosten (Druckzeit * Stromverbrauch * Strompreis)
 * 3. Verschleiß (typisch 0,50€ pro Stunde)
 * 4. Arbeitszeit (optional, nur wenn eingegeben)
 * 5. Summe mit Gewinnmarge (typisch 30-50% Aufschlag)
 * 6. Ergebnis runden und in gewählter Währung darstellen
 */
function rechnen() {
    const v = (id) => parseFloat(document.getElementById(id).value.replace(',', '.')) || 0;

    let matTotal = 0;
    for (let i = 1; i <= materialCount; i++) {
        const kg = v(`kg_${i}`);
        const g = v(`g_${i}`);
        matTotal += (kg / 1000) * g;
    }

    const zeit = parseZeit(document.getElementById('zeit').value);
    const rate = getCurrencyRate(currentCurrency);
    const drucker = document.getElementById('printer_type').value;
    const power = printerPower[drucker] || 0.11;
    const strompreis = v('strompreis');
    const strom = ((zeit * power) * strompreis) * rate;
    const abnutzung = (zeit * 0.05) * rate;
    const arbeitszeit = parseZeit(document.getElementById('workTime').value);
    const stundenlohn = v('hourlyWage');
    const arbeitskosten = arbeitszeit * stundenlohn;

    const rohpreis = matTotal + strom + abnutzung;
    const preis = rohpreis * 2.5;
    const endpreis = preis + arbeitskosten;

    const verkaufspreisGerundet = Math.ceil(endpreis * 2) / 2;

    const t = translations[currentLanguage];
    const symbol = getCurrencySymbol();
    let detailText = '';
    for (let i = 1; i <= materialCount; i++) {
        const kg = v(`kg_${i}`);
        const g = v(`g_${i}`);
        const matCost = (kg / 1000) * g;
        if (matCost > 0) {
            detailText += `Material ${i}: ${matCost.toFixed(2)}${symbol}<br>`;
        }
    }
    detailText += `${t.power}: ${strom.toFixed(2)}${symbol} | ${t.wear}: ${abnutzung.toFixed(2)}${symbol} | ${t.labor}: ${arbeitskosten.toFixed(2)}${symbol} | ${t.cost}: ${rohpreis.toFixed(2)}${symbol}<br>`;
    detailText += `<small>${t.exactPrice}: ${endpreis.toFixed(2)}${symbol}</small>`;

    document.getElementById('details').innerHTML = detailText;
    document.getElementById('gesamt').innerText = verkaufspreisGerundet.toFixed(2) + ' ' + symbol;
    document.getElementById('ausgabe').style.display = 'block';
}

setCurrency('EUR');
setLanguage('de');
document.getElementById('languageSelect').value = 'de';
initCustomSelects();