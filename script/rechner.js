let currentLanguage = 'de';
let currentCurrency = 'EUR';
const USD_RATE = 1.09;
let materialCount = 1;
let nextMaterialId = 2;
let activeMaterialIds = [1];

function getActiveMaterialIds() {
    return [...activeMaterialIds];
}

const translations = {
    de: {
        title: '3D Preisrechner',
        druckerHersteller: 'Hersteller',
        printerHead: 'Drucker',
        printerType: 'Druckermodell',
        materialName: 'Materialname',
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
        materialName: 'Material name',
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

const baseMaterialPricesEUR = {
    PLA_BASIC: 22.99,
    PLA_MATTE: 22.99,
    PETG_BASIC: 22.99,
    PETG_TRANSLUCENT: 22.99,
    ABS: 22.99,
    TPU_AMS: 35.99,
    SUPPORT_PLA_PETG: 73.98,
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
    'H2C': 0.2,
    'Kobra': 0.15,
    'Kobra 3': 0.15,
    'Cobra 3 combo': 0.31,
};

const printerModelsByManufacturer = {
    Bambulab: ['A1', 'A1 mini', 'P1S', 'P2S', 'X1C', 'H2C'],
    Anycubic: ['Kobra', 'Kobra 3', 'Cobra 3 combo']
};

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
    getActiveMaterialIds().forEach((id) => {
        const select = document.getElementById(`type_${id}`);
        if (!select) return;
        const previousValue = select.value;
        select.innerHTML = buildMaterialOptionHtml(manufacturer);
        if (getMaterialOptions(manufacturer).some((option) => option.value === previousValue)) {
            select.value = previousValue;
        }
        syncCustomSelect(select);
    });
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
    getActiveMaterialIds().forEach((id) => {
        const select = document.getElementById(`type_${id}`);
        if (!select) return;
        Array.from(select.options).forEach((opt) => {
            if (!opt.value || !(opt.value in materialPrices)) return;
            const name = materialNames[opt.value] || opt.value;
            const price = materialPrices[opt.value].toFixed(2).replace('.', ',');
            opt.text = `${name} (${price} ${symbol}/kg)`;
        });
    });
}

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

    getActiveMaterialIds().forEach((id) => {
        const kgEl = document.getElementById(`kg_${id}`);
        if (!kgEl) return;
        const val = parseFloat((kgEl.value || '').replace(',', '.'));
        if (!Number.isFinite(val)) return;
        const typeEl = document.getElementById(`type_${id}`);
        const selectedType = typeEl ? typeEl.value : null;
        const oldPrice = selectedType ? materialPrices[selectedType] : undefined;
        const newPrice = selectedType ? newBasePrices[selectedType] : undefined;
        if (oldPrice !== undefined && newPrice !== undefined && Math.abs(val - oldPrice) < 0.01) {
            kgEl.value = newPrice.toFixed(2);
        } else {
            kgEl.value = (val * factor).toFixed(2);
        }
    });

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
    getActiveMaterialIds().slice(1).forEach((id, index) => {
        const matHeading = document.getElementById(`matHeading_${id}`);
        if (matHeading) {
            const key = 'material' + String.fromCharCode(65 + index + 1);
            matHeading.innerText = t[key] || `Material ${index + 2}`;
        }
    });
    
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


function setMaterialPrice(materialIndex, materialType) {
    const priceInput = document.getElementById(`kg_${materialIndex}`);
    if (!priceInput) return;
    priceInput.value = materialPrices[materialType] || 0;
}

function handleMaterialNameKeydown(event, materialIndex) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmMaterialName(materialIndex);
    }
}

function clearMaterialNameConfirmation(input) {
    if (!input) return;
    input.dataset.confirmed = 'false';
    input.classList.remove('name-valid', 'name-invalid');
}

function confirmMaterialName(materialIndex) {
    const input = document.getElementById(`name_${materialIndex}`);
    if (!input) return;
    input.dataset.confirmed = 'true';
    validateMaterialNames();
}

function validateMaterialNames() {
    const nameCount = {};
    getActiveMaterialIds().forEach((id) => {
        const input = document.getElementById(`name_${id}`);
        if (!input) return;
        const name = input.value.trim();
        if (!name) return;
        const normalized = name.toLowerCase();
        nameCount[normalized] = (nameCount[normalized] || 0) + 1;
    });

    getActiveMaterialIds().forEach((id) => {
        const input = document.getElementById(`name_${id}`);
        if (!input) return;
        const name = input.value.trim();
        if (!name || input.dataset.confirmed !== 'true') {
            input.classList.remove('name-valid', 'name-invalid');
            return;
        }
        const normalized = name.toLowerCase();
        if (nameCount[normalized] > 1) {
            input.classList.add('name-invalid');
            input.classList.remove('name-valid');
        } else {
            input.classList.add('name-valid');
            input.classList.remove('name-invalid');
        }
    });
}

function addMaterial() {
    if (getActiveMaterialIds().length >= 16) return;
    const id = nextMaterialId++;
    activeMaterialIds.push(id);
    const container = document.getElementById('materialsContainer');
    const section = document.createElement('div');
    section.className = 'section';
    section.id = `sec${id}`;
    const t = translations[currentLanguage];
    const manufacturer = getCurrentMaterialManufacturer();
    const materialOptions = buildMaterialOptionHtml(manufacturer);
    const headingLabel = t['material' + String.fromCharCode(64 + activeMaterialIds.length)] || 'Material ' + activeMaterialIds.length;
    section.innerHTML = `
        <strong id="matHeading_${id}">${headingLabel}</strong>
        <label data-i18n="materialName">Materialname</label>
        <input type="text" id="name_${id}" placeholder="z.B. Gehäuse" onkeydown="handleMaterialNameKeydown(event, ${id})" oninput="clearMaterialNameConfirmation(this)">
        <label data-i18n="materialType">Materialart</label>
        <select id="type_${id}" class="material-select" onchange="setMaterialPrice(${id}, this.value)">
            ${materialOptions}
        </select>
        <label data-i18n="pricePerKg">Preis pro kg (€)</label>
        <input type="number" id="kg_${id}" value="0" step="0.01">
        <label data-i18n="weight">Gewicht (g)</label>
        <input type="number" id="g_${id}" value="0">
        <button class="btn-remove" onclick="removeMaterial(${id})">${t.removeMaterial}</button>
    `;
    container.appendChild(section);
    updateMaterialOptionLabels();
    initCustomSelects();
    validateMaterialNames();
    if (getActiveMaterialIds().length >= 16) {
        document.getElementById('addMaterialBtn').style.display = 'none';
    }
}

function removeMaterial(index) {
    const section = document.getElementById(`sec${index}`);
    if (section) section.remove();
    activeMaterialIds = activeMaterialIds.filter((id) => id !== index);
    document.getElementById('addMaterialBtn').style.display = 'block';
    validateMaterialNames();
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

function rechnen() {
    const v = (id) => parseFloat(document.getElementById(id).value.replace(',', '.')) || 0;

    let matTotal = 0;
    getActiveMaterialIds().forEach((id) => {
        const kg = v(`kg_${id}`);
        const g = v(`g_${id}`);
        matTotal += (kg / 1000) * g;
    });

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
    getActiveMaterialIds().forEach((id, index) => {
        const kg = v(`kg_${id}`);
        const g = v(`g_${id}`);
        const matCost = (kg / 1000) * g;
        if (matCost > 0) {
            const nameInput = document.getElementById(`name_${id}`);
            const nameValue = nameInput ? nameInput.value.trim() : '';
            const displayName = nameValue || `Material ${index + 1}`;
            detailText += `${displayName}: ${matCost.toFixed(2)}${symbol}<br>`;
        }
    });
    detailText += `${t.power}: ${strom.toFixed(2)}${symbol} | ${t.wear}: ${abnutzung.toFixed(2)}${symbol} | ${t.labor}: ${arbeitskosten.toFixed(2)}${symbol} <br>`;
    detailText += `${t.cost}: ${rohpreis.toFixed(2)}${symbol}<br>`;
    detailText += `<small>${t.exactPrice}: ${endpreis.toFixed(2)}${symbol}</small>`;

    document.getElementById('details').innerHTML = detailText;
    document.getElementById('gesamt').innerText = verkaufspreisGerundet.toFixed(2) + ' ' + symbol;
    document.getElementById('ausgabe').style.display = 'block';
}

setCurrency('EUR');
setLanguage('de');
document.getElementById('languageSelect').value = 'de';
initCustomSelects();