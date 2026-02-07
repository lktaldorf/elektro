/**
 * ElektroProfi Ultimate - Berechnungen
 * Alle Formeln nach DIN VDE korrigiert
 */

// ============================================
// KONSTANTEN
// ============================================
const KAPPA_CU = 56;  // Leitfähigkeit Kupfer in m/(Ω·mm²)
const KAPPA_AL = 35;  // Leitfähigkeit Aluminium in m/(Ω·mm²)

// Standardquerschnitte in mm²
const QUERSCHNITTE = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

// Sicherungsgrößen in A
const SICHERUNGEN = [6, 10, 13, 16, 20, 25, 32, 35, 40, 50, 63, 80, 100, 125, 160, 200, 250];

// Trafogrößen in kVA
const TRAFOGROESSEN = [100, 160, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500];

// Strombelastbarkeit nach DIN VDE 0298-4 (Kupfer, 3 belastete Adern)
const BELASTBARKEIT = {
  'b1': {1.5:13.5, 2.5:18, 4:24, 6:31, 10:42, 16:56, 25:73, 35:89, 50:108, 70:136, 95:164, 120:188, 150:216, 185:245, 240:286},
  'b2': {1.5:15.5, 2.5:21, 4:28, 6:36, 10:50, 16:68, 25:89, 35:110, 50:134, 70:171, 95:207, 120:239, 150:275, 185:314, 240:367},
  'c':  {1.5:17.5, 2.5:24, 4:32, 6:41, 10:57, 16:76, 25:101, 35:125, 50:151, 70:192, 95:232, 120:269, 150:309, 185:353, 240:415},
  'e':  {1.5:19.5, 2.5:27, 4:36, 6:46, 10:63, 16:85, 25:112, 35:138, 50:168, 70:213, 95:258, 120:299, 150:344, 185:392, 240:461}
};

// Kabelgewichte in g/m (NYM-J)
const KABELGEWICHTE = {
  nym: {
    1.5: {3:85, 4:105, 5:125},
    2.5: {3:115, 4:145, 5:175},
    4:   {3:160, 4:200, 5:245},
    6:   {3:210, 4:265, 5:325},
    10:  {3:320, 4:410, 5:500},
    16:  {3:475, 4:610, 5:750},
    25:  {3:710, 4:920, 5:1130},
    35:  {3:960, 4:1250, 5:1540},
    50:  {3:1310, 4:1710, 5:2110}
  },
  nyy: {
    1.5: {3:115, 4:140, 5:170},
    2.5: {3:155, 4:195, 5:235},
    4:   {3:215, 4:270, 5:330},
    6:   {3:285, 4:365, 5:445},
    10:  {3:435, 4:560, 5:685},
    16:  {3:650, 4:840, 5:1030},
    25:  {3:980, 4:1270, 5:1560},
    35:  {3:1330, 4:1730, 5:2130},
    50:  {3:1820, 4:2370, 5:2920}
  }
};

// ============================================
// OHMSCHES GESETZ
// ============================================
function updateOhmFields() {
  const type = document.getElementById('ohm-calc-type').value;
  const container = document.getElementById('ohm-inputs');
  let html = '';
  
  switch(type) {
    case 'voltage':
      html = `
        <div class="grid-2">
          <div class="form-group">
            <label>Stromstärke I (A)</label>
            <input type="number" id="ohm-current" step="0.001" placeholder="z.B. 10">
          </div>
          <div class="form-group">
            <label>Widerstand R (Ω)</label>
            <input type="number" id="ohm-resistance" step="0.001" placeholder="z.B. 23">
          </div>
        </div>`;
      break;
    case 'current':
      html = `
        <div class="grid-2">
          <div class="form-group">
            <label>Spannung U (V)</label>
            <input type="number" id="ohm-voltage" step="0.01" placeholder="z.B. 230">
          </div>
          <div class="form-group">
            <label>Widerstand R (Ω)</label>
            <input type="number" id="ohm-resistance" step="0.001" placeholder="z.B. 23">
          </div>
        </div>`;
      break;
    case 'resistance':
      html = `
        <div class="grid-2">
          <div class="form-group">
            <label>Spannung U (V)</label>
            <input type="number" id="ohm-voltage" step="0.01" placeholder="z.B. 230">
          </div>
          <div class="form-group">
            <label>Stromstärke I (A)</label>
            <input type="number" id="ohm-current" step="0.001" placeholder="z.B. 10">
          </div>
        </div>`;
      break;
    case 'power':
      html = `
        <div class="grid-2">
          <div class="form-group">
            <label>Spannung U (V)</label>
            <input type="number" id="ohm-voltage" step="0.01" placeholder="z.B. 230">
          </div>
          <div class="form-group">
            <label>Stromstärke I (A)</label>
            <input type="number" id="ohm-current" step="0.001" placeholder="z.B. 10">
          </div>
        </div>`;
      break;
  }
  container.innerHTML = html;
}

function calculateOhm() {
  const type = document.getElementById('ohm-calc-type').value;
  let result = '';
  
  switch(type) {
    case 'voltage': {
      const I = parseFloat(document.getElementById('ohm-current').value);
      const R = parseFloat(document.getElementById('ohm-resistance').value);
      if (isNaN(I) || isNaN(R)) return showError('Bitte alle Felder ausfüllen');
      const U = I * R;
      const P = U * I;
      result = `
        <div class="result">
          <h3>Ergebnis: Spannung</h3>
          <div class="result-item">
            <span class="result-label">Spannung U:</span>
            <span class="result-value">${U.toFixed(2)} V</span>
          </div>
          <div class="result-item">
            <span class="result-label">Leistung P:</span>
            <span class="result-value">${P.toFixed(2)} W</span>
          </div>
        </div>`;
      break;
    }
    case 'current': {
      const U = parseFloat(document.getElementById('ohm-voltage').value);
      const R = parseFloat(document.getElementById('ohm-resistance').value);
      if (isNaN(U) || isNaN(R) || R === 0) return showError('Bitte alle Felder ausfüllen (R ≠ 0)');
      const I = U / R;
      const P = U * I;
      result = `
        <div class="result">
          <h3>Ergebnis: Stromstärke</h3>
          <div class="result-item">
            <span class="result-label">Stromstärke I:</span>
            <span class="result-value">${I.toFixed(3)} A</span>
          </div>
          <div class="result-item">
            <span class="result-label">Leistung P:</span>
            <span class="result-value">${P.toFixed(2)} W</span>
          </div>
        </div>`;
      break;
    }
    case 'resistance': {
      const U = parseFloat(document.getElementById('ohm-voltage').value);
      const I = parseFloat(document.getElementById('ohm-current').value);
      if (isNaN(U) || isNaN(I) || I === 0) return showError('Bitte alle Felder ausfüllen (I ≠ 0)');
      const R = U / I;
      const P = U * I;
      result = `
        <div class="result">
          <h3>Ergebnis: Widerstand</h3>
          <div class="result-item">
            <span class="result-label">Widerstand R:</span>
            <span class="result-value">${R.toFixed(3)} Ω</span>
          </div>
          <div class="result-item">
            <span class="result-label">Leistung P:</span>
            <span class="result-value">${P.toFixed(2)} W</span>
          </div>
        </div>`;
      break;
    }
    case 'power': {
      const U = parseFloat(document.getElementById('ohm-voltage').value);
      const I = parseFloat(document.getElementById('ohm-current').value);
      if (isNaN(U) || isNaN(I)) return showError('Bitte alle Felder ausfüllen');
      const P = U * I;
      const R = I !== 0 ? U / I : 0;
      result = `
        <div class="result">
          <h3>Ergebnis: Leistung</h3>
          <div class="result-item">
            <span class="result-label">Leistung P:</span>
            <span class="result-value">${P.toFixed(2)} W (${(P/1000).toFixed(3)} kW)</span>
          </div>
          <div class="result-item">
            <span class="result-label">Widerstand R:</span>
            <span class="result-value">${R.toFixed(3)} Ω</span>
          </div>
        </div>`;
      break;
    }
  }
  
  document.getElementById('ohm-result').innerHTML = result;
}

// ============================================
// LEITUNGSQUERSCHNITT - KORRIGIERT
// ============================================
function calculateCableSize() {
  const art = document.getElementById('leitung-art').value;
  const strom = parseFloat(document.getElementById('leitung-strom').value);
  const laenge = parseFloat(document.getElementById('leitung-laenge').value);
  const verlegeart = document.getElementById('leitung-verlegeart').value;
  const material = document.getElementById('leitung-material').value;
  const maxSFProzent = parseFloat(document.getElementById('leitung-spannungsfall').value);
  
  if (isNaN(strom) || isNaN(laenge) || strom <= 0 || laenge <= 0) {
    return showError('Bitte alle Felder korrekt ausfüllen');
  }
  
  const kappa = material === 'cu' ? KAPPA_CU : KAPPA_AL;
  const nennspannung = art === 'ac1' ? 230 : 400;
  const alFaktor = material === 'al' ? 0.61 : 1; // Reduktionsfaktor für Alu
  
  // Max. zulässiger Spannungsfall in Volt
  const maxDeltaU = nennspannung * (maxSFProzent / 100);
  
  // 1. Querschnitt nach Strombelastbarkeit ermitteln
  let qBelastbarkeit = QUERSCHNITTE[0];
  for (const q of QUERSCHNITTE) {
    if (BELASTBARKEIT[verlegeart][q] * alFaktor >= strom) {
      qBelastbarkeit = q;
      break;
    }
  }
  
  // 2. Querschnitt nach Spannungsfall berechnen
  // KORRIGIERTE FORMEL:
  // Einphasig: A = (2 × L × I × cos φ) / (κ × ΔU)
  // Drehstrom: A = (√3 × L × I × cos φ) / (κ × ΔU)
  // Hier cos φ = 1 angenommen (kann erweitert werden)
  const faktor = art === 'ac1' ? 2 : Math.sqrt(3);
  const qSpannungsfall = (faktor * laenge * strom) / (kappa * maxDeltaU);
  
  // 3. Größeren Querschnitt wählen
  let gewaehlterQ = Math.max(qBelastbarkeit, qSpannungsfall);
  
  // Nächst größeren Standardquerschnitt finden
  let empfohlenerQ = QUERSCHNITTE[QUERSCHNITTE.length - 1];
  for (const q of QUERSCHNITTE) {
    if (q >= gewaehlterQ) {
      empfohlenerQ = q;
      break;
    }
  }
  
  // 4. Tatsächlichen Spannungsfall berechnen
  const tatsaechlicherDeltaU = (faktor * laenge * strom) / (kappa * empfohlenerQ);
  const tatsaechlicherSFProzent = (tatsaechlicherDeltaU / nennspannung) * 100;
  
  // Maximale Belastbarkeit des gewählten Querschnitts
  const maxBelastbarkeit = BELASTBARKEIT[verlegeart][empfohlenerQ] * alFaktor;
  
  // Ergebnis ausgeben
  let html = `
    <div class="result">
      <h3>Empfohlener Leitungsquerschnitt</h3>
      <div class="result-item">
        <span class="result-label">Mindestquerschnitt:</span>
        <span class="result-value">${empfohlenerQ} mm²</span>
      </div>
      <div class="result-item">
        <span class="result-label">Max. Belastbarkeit:</span>
        <span class="result-value">${maxBelastbarkeit.toFixed(1)} A</span>
      </div>
      <div class="result-item">
        <span class="result-label">Spannungsfall:</span>
        <span class="result-value">${tatsaechlicherDeltaU.toFixed(2)} V (${tatsaechlicherSFProzent.toFixed(2)}%)</span>
      </div>
      <div class="result-item">
        <span class="result-label">Status:</span>
        <span class="result-value">${tatsaechlicherSFProzent <= maxSFProzent ? '✓ OK' : '⚠ Spannungsfall zu hoch'}</span>
      </div>
    </div>`;
  
  // Hinweise
  if (qSpannungsfall > qBelastbarkeit) {
    html += `<div class="info-box"><h4>ℹ️ Hinweis</h4><p>Der Querschnitt wurde aufgrund des Spannungsfalls erhöht (nicht wegen Strombelastbarkeit).</p></div>`;
  }
  
  if (tatsaechlicherSFProzent > maxSFProzent) {
    html += `<div class="warning"><p>⚠️ Auch mit ${empfohlenerQ} mm² wird der zulässige Spannungsfall überschritten. Größeren Querschnitt oder kürzere Leitung wählen!</p></div>`;
  }
  
  document.getElementById('leitung-result').innerHTML = html;
}

// ============================================
// SPANNUNGSFALL - KORRIGIERT
// ============================================
function calculateVoltageDrop() {
  const art = document.getElementById('sf-art').value;
  const laenge = parseFloat(document.getElementById('sf-laenge').value);
  const querschnitt = parseFloat(document.getElementById('sf-querschnitt').value);
  const strom = parseFloat(document.getElementById('sf-strom').value);
  const material = document.getElementById('sf-material').value;
  const cosPhi = parseFloat(document.getElementById('sf-cosphi').value) || 1;
  
  if (isNaN(laenge) || isNaN(querschnitt) || isNaN(strom)) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  const kappa = material === 'cu' ? KAPPA_CU : KAPPA_AL;
  const nennspannung = art === 'ac1' ? 230 : 400;
  
  // KORRIGIERTE FORMEL für Spannungsfall:
  // Einphasig (Hin + Rück): ΔU = (2 × L × I × cos φ) / (κ × A)
  // Drehstrom symmetrisch: ΔU = (√3 × L × I × cos φ) / (κ × A)
  const faktor = art === 'ac1' ? 2 : Math.sqrt(3);
  const deltaU = (faktor * laenge * strom * cosPhi) / (kappa * querschnitt);
  const deltaUProzent = (deltaU / nennspannung) * 100;
  const spannungVerbraucher = nennspannung - deltaU;
  
  // Bewertung
  let bewertung, boxClass;
  if (deltaUProzent <= 3) {
    bewertung = '✓ In Ordnung (≤3%)';
    boxClass = 'result';
  } else if (deltaUProzent <= 5) {
    bewertung = '⚠ Grenzwertig (3-5%)';
    boxClass = 'warning';
  } else {
    bewertung = '✗ Zu hoch (>5%)';
    boxClass = 'danger';
  }
  
  document.getElementById('sf-result').innerHTML = `
    <div class="${boxClass}">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Spannungsfall ΔU:</span>
        <span class="result-value">${deltaU.toFixed(2)} V (${deltaUProzent.toFixed(2)}%)</span>
      </div>
      <div class="result-item">
        <span class="result-label">Spannung am Verbraucher:</span>
        <span class="result-value">${spannungVerbraucher.toFixed(2)} V</span>
      </div>
      <div class="result-item">
        <span class="result-label">Bewertung:</span>
        <span class="result-value">${bewertung}</span>
      </div>
    </div>
    <div class="info-box">
      <h4>📐 Verwendete Formel (${art === 'ac1' ? 'Einphasig' : 'Drehstrom'})</h4>
      <p>ΔU = (${art === 'ac1' ? '2' : '√3'} × L × I × cos φ) / (κ × A)</p>
      <p>ΔU = (${faktor.toFixed(3)} × ${laenge} × ${strom} × ${cosPhi}) / (${kappa} × ${querschnitt})</p>
    </div>`;
}

// ============================================
// LEISTUNGSBERECHNUNG
// ============================================
function updateLeistungFields() {
  const art = document.getElementById('leistung-art').value;
  const container = document.getElementById('leistung-inputs');
  let html = '';
  
  if (art === 'dc') {
    html = `
      <div class="grid-2">
        <div class="form-group">
          <label>Spannung U (V)</label>
          <input type="number" id="leistung-spannung" placeholder="z.B. 24">
        </div>
        <div class="form-group">
          <label>Stromstärke I (A)</label>
          <input type="number" id="leistung-strom" placeholder="z.B. 5">
        </div>
      </div>`;
  } else if (art === 'ac1') {
    html = `
      <div class="grid-2">
        <div class="form-group">
          <label>Spannung U (V)</label>
          <input type="number" id="leistung-spannung" value="230">
        </div>
        <div class="form-group">
          <label>Stromstärke I (A)</label>
          <input type="number" id="leistung-strom" placeholder="z.B. 10">
        </div>
      </div>
      <div class="form-group">
        <label>Leistungsfaktor cos φ</label>
        <input type="number" id="leistung-cosphi" value="1" step="0.01" min="0" max="1">
      </div>`;
  } else {
    html = `
      <div class="grid-2">
        <div class="form-group">
          <label>Spannung U (V) - Außenleiter</label>
          <input type="number" id="leistung-spannung" value="400">
        </div>
        <div class="form-group">
          <label>Stromstärke I (A)</label>
          <input type="number" id="leistung-strom" placeholder="z.B. 16">
        </div>
      </div>
      <div class="form-group">
        <label>Leistungsfaktor cos φ</label>
        <input type="number" id="leistung-cosphi" value="0.85" step="0.01" min="0" max="1">
      </div>`;
  }
  container.innerHTML = html;
}

function calculatePower() {
  const art = document.getElementById('leistung-art').value;
  const U = parseFloat(document.getElementById('leistung-spannung').value);
  const I = parseFloat(document.getElementById('leistung-strom').value);
  
  if (isNaN(U) || isNaN(I)) return showError('Bitte alle Felder ausfüllen');
  
  let P, S, Q, result;
  
  if (art === 'dc') {
    P = U * I;
    result = `
      <div class="result">
        <h3>Ergebnis: Gleichstrom</h3>
        <div class="result-item">
          <span class="result-label">Leistung P:</span>
          <span class="result-value">${P.toFixed(2)} W (${(P/1000).toFixed(3)} kW)</span>
        </div>
      </div>`;
  } else {
    const cosPhi = parseFloat(document.getElementById('leistung-cosphi').value);
    if (isNaN(cosPhi)) return showError('Bitte Leistungsfaktor eingeben');
    
    const sinPhi = Math.sin(Math.acos(cosPhi));
    
    if (art === 'ac1') {
      S = U * I;
    } else {
      S = Math.sqrt(3) * U * I;
    }
    
    P = S * cosPhi;
    Q = S * sinPhi;
    
    result = `
      <div class="result">
        <h3>Ergebnis: ${art === 'ac1' ? 'Wechselstrom 1~' : 'Drehstrom 3~'}</h3>
        <div class="result-item">
          <span class="result-label">Wirkleistung P:</span>
          <span class="result-value">${P.toFixed(2)} W (${(P/1000).toFixed(2)} kW)</span>
        </div>
        <div class="result-item">
          <span class="result-label">Scheinleistung S:</span>
          <span class="result-value">${S.toFixed(2)} VA (${(S/1000).toFixed(2)} kVA)</span>
        </div>
        <div class="result-item">
          <span class="result-label">Blindleistung Q:</span>
          <span class="result-value">${Q.toFixed(2)} var (${(Q/1000).toFixed(2)} kvar)</span>
        </div>
      </div>`;
  }
  
  document.getElementById('leistung-result').innerHTML = result;
}

// ============================================
// ABSICHERUNG
// ============================================
function calculateFuse() {
  let P = parseFloat(document.getElementById('sicherung-leistung').value);
  const U = parseFloat(document.getElementById('sicherung-spannung').value);
  const cosPhi = parseFloat(document.getElementById('sicherung-cosphi').value);
  
  if (isNaN(P) || isNaN(U) || isNaN(cosPhi)) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  // Wenn Wert klein, als kW interpretieren
  if (P < 100) P = P * 1000;
  
  // Strom berechnen
  let I;
  if (U === 230) {
    I = P / (U * cosPhi);
  } else {
    I = P / (Math.sqrt(3) * U * cosPhi);
  }
  
  // Sicherung mit Reserve wählen (1,25 × Betriebsstrom)
  const sicherungStrom = I * 1.25;
  let empfohlene = SICHERUNGEN.find(s => s >= sicherungStrom) || 250;
  
  // Mindestquerschnitt zur Sicherung
  const querschnitte = {
    6: 1.5, 10: 1.5, 13: 1.5, 16: 2.5, 20: 2.5, 25: 4, 32: 6, 35: 6,
    40: 10, 50: 10, 63: 16, 80: 25, 100: 35, 125: 50, 160: 70, 200: 95, 250: 120
  };
  
  // Auslösecharakteristik empfehlen
  let charakteristik;
  if (P >= 15000) {
    charakteristik = 'D (hoher Anlaufstrom)';
  } else if (P >= 3000 || empfohlene >= 20) {
    charakteristik = 'C (Motor/Gewerbe)';
  } else {
    charakteristik = 'B (Haushalt/ohmsche Last)';
  }
  
  document.getElementById('sicherung-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Geräteleistung:</span>
        <span class="result-value">${(P/1000).toFixed(2)} kW</span>
      </div>
      <div class="result-item">
        <span class="result-label">Betriebsstrom:</span>
        <span class="result-value">${I.toFixed(2)} A</span>
      </div>
      <div class="result-item">
        <span class="result-label">Empfohlene Sicherung:</span>
        <span class="result-value">${empfohlene} A</span>
      </div>
      <div class="result-item">
        <span class="result-label">Charakteristik:</span>
        <span class="result-value">${charakteristik}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Mindestquerschnitt:</span>
        <span class="result-value">${querschnitte[empfohlene]} mm² (Cu)</span>
      </div>
    </div>`;
}

// ============================================
// ERDUNG
// ============================================
function updateErdungFields() {
  // Felder je nach Erdungsart anpassen (optional)
}

function calculateEarthing() {
  const art = document.getElementById('erdung-art').value;
  const laenge = parseFloat(document.getElementById('erdung-laenge').value);
  const durchmesser = parseFloat(document.getElementById('erdung-durchmesser').value) / 1000; // in m
  const rhoE = parseFloat(document.getElementById('erdung-boden').value);
  
  if (isNaN(laenge) || isNaN(durchmesser) || isNaN(rhoE)) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  let Ra;
  
  switch(art) {
    case 'stab':
      // Staberder: Ra = (ρE / 2πL) × ln(4L/d)
      Ra = (rhoE / (2 * Math.PI * laenge)) * Math.log(4 * laenge / durchmesser);
      break;
    case 'ring':
      // Ringerder mit Umfang L: Ra ≈ ρE / (4r) mit r = L/(2π)
      const radius = laenge / (2 * Math.PI);
      Ra = rhoE / (4 * radius);
      break;
    case 'band':
      // Banderder horizontal: Ra = (ρE / 2πL) × ln(2L²/bd)
      // Vereinfacht mit Standardbreite 30mm, Tiefe 0.5m
      Ra = (rhoE / (2 * Math.PI * laenge)) * Math.log(2 * laenge / 0.5);
      break;
  }
  
  // Bewertung
  let status, boxClass;
  if (Ra <= 2) {
    status = '✓ Sehr gut (≤2Ω) - TN-System optimal';
    boxClass = 'result';
  } else if (Ra <= 10) {
    status = '✓ Gut (≤10Ω) - Blitzschutz OK';
    boxClass = 'result';
  } else {
    status = '⚠ Verbesserung empfohlen (>10Ω)';
    boxClass = 'warning';
  }
  
  let html = `
    <div class="${boxClass}">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Erdungswiderstand Ra:</span>
        <span class="result-value">${Ra.toFixed(2)} Ω</span>
      </div>
      <div class="result-item">
        <span class="result-label">Bewertung:</span>
        <span class="result-value">${status}</span>
      </div>
    </div>`;
  
  if (Ra > 10) {
    html += `<div class="info-box"><h4>💡 Verbesserungsmöglichkeiten</h4>
      <ul>
        <li>Mehrere Erder parallel schalten</li>
        <li>Längeren Erder verwenden</li>
        <li>Erdreich mit Bentonit oder Salz verbessern</li>
        <li>Tiefenerder bis ins Grundwasser</li>
      </ul></div>`;
  }
  
  document.getElementById('erdung-result').innerHTML = html;
}

// ============================================
// KURZSCHLUSSSTROM - KORRIGIERT
// ============================================
function calculateShortCircuit() {
  const Sn = parseFloat(document.getElementById('kss-trafo').value) * 1000; // VA
  const uk = parseFloat(document.getElementById('kss-uk').value) / 100;
  const Un = parseFloat(document.getElementById('kss-spannung').value);
  const laenge = parseFloat(document.getElementById('kss-laenge').value);
  const querschnitt = parseFloat(document.getElementById('kss-querschnitt').value);
  const material = document.getElementById('kss-material').value;
  
  if (isNaN(Sn) || isNaN(uk) || isNaN(laenge) || isNaN(querschnitt)) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  const kappa = material === 'cu' ? KAPPA_CU : KAPPA_AL;
  
  // Kurzschlussstrom am Trafo
  // Ik" = Sn / (√3 × Un × uk)
  const IkTrafo = Sn / (Math.sqrt(3) * Un * uk);
  
  // Trafoimpedanz
  const ZTrafo = (Un * uk) / (Math.sqrt(3) * (Sn / (Math.sqrt(3) * Un)));
  
  // Leitungsimpedanz (Hin + Rück)
  // ZL = 2 × L / (κ × A)
  const ZLeitung = (2 * laenge) / (kappa * querschnitt);
  
  // Gesamtimpedanz
  const ZGes = ZTrafo + ZLeitung;
  
  // Kurzschlussstrom an Fehlerstelle
  const IkFehler = Un / (Math.sqrt(3) * ZGes);
  
  document.getElementById('kss-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Ik" am Trafo:</span>
        <span class="result-value">${(IkTrafo/1000).toFixed(2)} kA</span>
      </div>
      <div class="result-item">
        <span class="result-label">Trafoimpedanz ZT:</span>
        <span class="result-value">${(ZTrafo*1000).toFixed(2)} mΩ</span>
      </div>
      <div class="result-item">
        <span class="result-label">Leitungsimpedanz ZL:</span>
        <span class="result-value">${(ZLeitung*1000).toFixed(2)} mΩ</span>
      </div>
      <div class="result-item">
        <span class="result-label">Ik" an Fehlerstelle:</span>
        <span class="result-value">${(IkFehler/1000).toFixed(2)} kA</span>
      </div>
    </div>
    <div class="info-box">
      <h4>📌 Hinweise</h4>
      <ul>
        <li>Schutzeinrichtungen müssen mindestens ${(IkFehler/1000).toFixed(1)} kA Schaltvermögen haben</li>
        <li>Selektivität: Vorsicherung muss höheren Ik aushalten</li>
        <li>Thermische Kurzschlussfestigkeit des Kabels prüfen</li>
      </ul>
    </div>`;
}

// ============================================
// TRAFO-DIMENSIONIERUNG
// ============================================
function calculateTransformer() {
  const PAnschluss = parseFloat(document.getElementById('trafo-leistung').value);
  const g = parseFloat(document.getElementById('trafo-gleich').value);
  const cosPhi = parseFloat(document.getElementById('trafo-cosphi').value);
  const reserve = parseFloat(document.getElementById('trafo-reserve').value) / 100;
  
  if (isNaN(PAnschluss) || isNaN(g) || isNaN(cosPhi)) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  // Gleichzeitige Leistung
  const PGleich = PAnschluss * g;
  
  // Scheinleistung
  const S = PGleich / cosPhi;
  
  // Mit Reserve
  const SMitReserve = S * (1 + reserve);
  
  // Nächste Trafogröße finden
  const empfohlen = TRAFOGROESSEN.find(t => t >= SMitReserve) || TRAFOGROESSEN[TRAFOGROESSEN.length - 1];
  
  document.getElementById('trafo-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Anschlussleistung:</span>
        <span class="result-value">${PAnschluss} kW</span>
      </div>
      <div class="result-item">
        <span class="result-label">Gleichzeitige Leistung:</span>
        <span class="result-value">${PGleich.toFixed(1)} kW</span>
      </div>
      <div class="result-item">
        <span class="result-label">Scheinleistung:</span>
        <span class="result-value">${S.toFixed(1)} kVA</span>
      </div>
      <div class="result-item">
        <span class="result-label">Mit Reserve (${(reserve*100).toFixed(0)}%):</span>
        <span class="result-value">${SMitReserve.toFixed(1)} kVA</span>
      </div>
      <div class="result-item">
        <span class="result-label">Empfohlener Trafo:</span>
        <span class="result-value">${empfohlen} kVA</span>
      </div>
    </div>`;
}

// ============================================
// KABELGEWICHT
// ============================================
function calculateCableWeight() {
  const typ = document.getElementById('gewicht-typ').value;
  const q = parseFloat(document.getElementById('gewicht-querschnitt').value);
  const adern = parseInt(document.getElementById('gewicht-adern').value);
  const laenge = parseFloat(document.getElementById('gewicht-laenge').value);
  
  if (isNaN(q) || isNaN(adern) || isNaN(laenge)) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  // Gewicht aus Tabelle oder schätzen
  let gewichtProMeter;
  if (KABELGEWICHTE[typ] && KABELGEWICHTE[typ][q] && KABELGEWICHTE[typ][q][adern]) {
    gewichtProMeter = KABELGEWICHTE[typ][q][adern];
  } else {
    // Schätzformel: Basisgewicht + Kupfergewicht
    const kupferGewicht = q * adern * 8.9; // Cu-Dichte 8.9 g/cm³
    const mantelGewicht = q * 2 + 30;
    gewichtProMeter = kupferGewicht + mantelGewicht;
  }
  
  const gesamtgewicht = (gewichtProMeter * laenge) / 1000; // in kg
  
  document.getElementById('gewicht-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Gewicht pro Meter:</span>
        <span class="result-value">${gewichtProMeter.toFixed(0)} g/m</span>
      </div>
      <div class="result-item">
        <span class="result-label">Gesamtgewicht (${laenge}m):</span>
        <span class="result-value">${gesamtgewicht.toFixed(2)} kg</span>
      </div>
    </div>
    <div class="info-box">
      <p><strong>Hinweis:</strong> Bei Trassen und Leitern Traglast beachten!</p>
    </div>`;
}

// ============================================
// TRASSEN-DIMENSIONIERUNG
// ============================================
function calculateTray() {
  const anzahl = parseInt(document.getElementById('trasse-anzahl').value);
  const durchmesser = parseFloat(document.getElementById('trasse-durchmesser').value);
  const fuellgrad = parseInt(document.getElementById('trasse-fuellgrad').value) / 100;
  
  if (isNaN(anzahl) || isNaN(durchmesser) || anzahl <= 0 || durchmesser <= 0) {
    return showError('Bitte alle Felder ausfüllen');
  }
  
  // Gesamtfläche der Kabel
  const kabelFlaeche = anzahl * Math.PI * Math.pow(durchmesser / 2, 2);
  
  // Benötigte Trassenfläche (mit Füllgrad)
  const benoetigteFläche = kabelFlaeche / fuellgrad;
  
  // Trassenbreite berechnen (Annahme: Höhe = 60mm Standard)
  const trassenHoehe = 60;
  const benotigteBreite = benoetigteFläche / trassenHoehe;
  
  // Standard-Trassenbreiten
  const standardBreiten = [50, 75, 100, 150, 200, 300, 400, 500, 600];
  const empfohleneBreite = standardBreiten.find(b => b >= benotigteBreite) || 600;
  
  document.getElementById('trasse-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Kabelfläche gesamt:</span>
        <span class="result-value">${kabelFlaeche.toFixed(0)} mm²</span>
      </div>
      <div class="result-item">
        <span class="result-label">Benötigte Trassenfläche:</span>
        <span class="result-value">${benoetigteFläche.toFixed(0)} mm²</span>
      </div>
      <div class="result-item">
        <span class="result-label">Berechnete Breite:</span>
        <span class="result-value">${benotigteBreite.toFixed(0)} mm</span>
      </div>
      <div class="result-item">
        <span class="result-label">Empfohlene Trasse:</span>
        <span class="result-value">${empfohleneBreite} × ${trassenHoehe} mm</span>
      </div>
    </div>`;
}

// Helper
function showError(msg) {
  alert(msg);
}
