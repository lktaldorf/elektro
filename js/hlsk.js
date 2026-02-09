/**
 * HLSK Sammlung - Berechnungen
 * Heizung, Lüftung, Sanitär, Klima
 */

// Rohrdimensionen nach DIN
const ROHRDIMENSIONEN = {
  kupfer: [
    {dn: '10×1', di: 8, da: 10},
    {dn: '12×1', di: 10, da: 12},
    {dn: '15×1', di: 13, da: 15},
    {dn: '18×1', di: 16, da: 18},
    {dn: '22×1', di: 20, da: 22},
    {dn: '28×1,5', di: 25, da: 28},
    {dn: '35×1,5', di: 32, da: 35},
    {dn: '42×1,5', di: 39, da: 42},
    {dn: '54×2', di: 50, da: 54}
  ],
  stahl: [
    {dn: 'DN 10', di: 12.5, da: 17.2},
    {dn: 'DN 15', di: 16, da: 21.3},
    {dn: 'DN 20', di: 21.6, da: 26.9},
    {dn: 'DN 25', di: 27.2, da: 33.7},
    {dn: 'DN 32', di: 35.9, da: 42.4},
    {dn: 'DN 40', di: 41.8, da: 48.3},
    {dn: 'DN 50', di: 53, da: 60.3},
    {dn: 'DN 65', di: 68.8, da: 76.1},
    {dn: 'DN 80', di: 80.8, da: 88.9},
    {dn: 'DN 100', di: 107.1, da: 114.3}
  ],
  kunststoff: [
    {dn: '16×2', di: 12, da: 16},
    {dn: '20×2', di: 16, da: 20},
    {dn: '25×2,3', di: 20.4, da: 25},
    {dn: '32×2,9', di: 26.2, da: 32},
    {dn: '40×3,7', di: 32.6, da: 40},
    {dn: '50×4,6', di: 40.8, da: 50},
    {dn: '63×5,8', di: 51.4, da: 63}
  ]
};

// Heizlast-Richtwerte nach DIN EN 12831
const HEIZLAST_RICHTWERTE = {
  neubau: {min: 30, max: 50, label: 'Neubau (EnEV/GEG)'},
  altbau_saniert: {min: 50, max: 80, label: 'Altbau saniert'},
  altbau_unsaniert: {min: 80, max: 120, label: 'Altbau unsaniert'},
  altbau_schlecht: {min: 120, max: 180, label: 'Altbau schlecht gedämmt'}
};

// Luftwechselraten nach DIN 1946-6
const LUFTWECHSEL = {
  wohnzimmer: {min: 0.5, empfohlen: 0.5},
  schlafzimmer: {min: 0.5, empfohlen: 0.5},
  kueche: {min: 40, empfohlen: 60, einheit: 'm³/h'},
  bad: {min: 40, empfohlen: 60, einheit: 'm³/h'},
  wc: {min: 20, empfohlen: 30, einheit: 'm³/h'}
};

// Anschlusswerte Sanitär nach DIN 1988-300
const ANSCHLUSSWERTE = {
  waschbecken: {kalt: 0.07, warm: 0.07, dn: 'DN 15'},
  dusche: {kalt: 0.15, warm: 0.15, dn: 'DN 15'},
  badewanne: {kalt: 0.15, warm: 0.15, dn: 'DN 15'},
  wc_spuelkasten: {kalt: 0.13, warm: 0, dn: 'DN 15'},
  wc_druckspueler: {kalt: 1.0, warm: 0, dn: 'DN 25'},
  spuele: {kalt: 0.07, warm: 0.07, dn: 'DN 15'},
  waschmaschine: {kalt: 0.25, warm: 0, dn: 'DN 15'},
  geschirrspueler: {kalt: 0.15, warm: 0, dn: 'DN 15'}
};

// ============================================
// HEIZLAST BERECHNUNG
// ============================================
function calculateHeizlast() {
  const flaeche = parseFloat(document.getElementById('hl-flaeche').value);
  const gebaeude = document.getElementById('hl-gebaeude').value;
  const hoehe = parseFloat(document.getElementById('hl-hoehe').value) || 2.5;
  
  if (isNaN(flaeche) || flaeche <= 0) {
    return alert('Bitte gültige Fläche eingeben');
  }
  
  const richtwert = HEIZLAST_RICHTWERTE[gebaeude];
  const volumen = flaeche * hoehe;
  
  const heizlastMin = flaeche * richtwert.min;
  const heizlastMax = flaeche * richtwert.max;
  const heizlastMittel = (heizlastMin + heizlastMax) / 2;
  
  document.getElementById('hl-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis - ${richtwert.label}</h3>
      <div class="result-item">
        <span class="result-label">Beheizte Fläche:</span>
        <span class="result-value">${flaeche} m²</span>
      </div>
      <div class="result-item">
        <span class="result-label">Raumvolumen:</span>
        <span class="result-value">${volumen.toFixed(1)} m³</span>
      </div>
      <div class="result-item">
        <span class="result-label">Heizlast (Bereich):</span>
        <span class="result-value">${(heizlastMin/1000).toFixed(1)} - ${(heizlastMax/1000).toFixed(1)} kW</span>
      </div>
      <div class="result-item">
        <span class="result-label">Empfohlene Heizleistung:</span>
        <span class="result-value"><strong>${(heizlastMittel/1000).toFixed(1)} kW</strong></span>
      </div>
    </div>
    <div class="info-box">
      <h4>📌 Hinweis</h4>
      <p>Dies ist eine Überschlagsrechnung. Für genaue Planung: DIN EN 12831 Berechnung erforderlich!</p>
    </div>`;
}

// ============================================
// ROHRDIMENSIONIERUNG
// ============================================
function calculateRohr() {
  const volumenstrom = parseFloat(document.getElementById('rohr-volumenstrom').value);
  const geschwindigkeit = parseFloat(document.getElementById('rohr-geschwindigkeit').value) || 1.0;
  const material = document.getElementById('rohr-material').value;
  
  if (isNaN(volumenstrom) || volumenstrom <= 0) {
    return alert('Bitte gültigen Volumenstrom eingeben');
  }
  
  // Volumenstrom in m³/s
  const Q = volumenstrom / 3600; // l/h zu m³/s = /3600000, aber l/h zu l/s = /3600
  const Qm3s = volumenstrom / 3600000;
  
  // Benötigter Querschnitt A = Q / v
  const A = Qm3s / geschwindigkeit; // m²
  
  // Durchmesser d = sqrt(4*A/π)
  const dBerechnet = Math.sqrt(4 * A / Math.PI) * 1000; // in mm
  
  // Passendes Rohr finden
  const rohre = ROHRDIMENSIONEN[material];
  let empfohlen = rohre[rohre.length - 1];
  
  for (const rohr of rohre) {
    if (rohr.di >= dBerechnet) {
      empfohlen = rohr;
      break;
    }
  }
  
  // Tatsächliche Geschwindigkeit
  const diM = empfohlen.di / 1000;
  const Atats = Math.PI * Math.pow(diM/2, 2);
  const vTats = Qm3s / Atats;
  
  document.getElementById('rohr-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Volumenstrom:</span>
        <span class="result-value">${volumenstrom} l/h = ${(volumenstrom/60).toFixed(2)} l/min</span>
      </div>
      <div class="result-item">
        <span class="result-label">Berechneter Innendurchmesser:</span>
        <span class="result-value">${dBerechnet.toFixed(1)} mm</span>
      </div>
      <div class="result-item">
        <span class="result-label">Empfohlenes Rohr:</span>
        <span class="result-value"><strong>${empfohlen.dn}</strong> (di=${empfohlen.di}mm)</span>
      </div>
      <div class="result-item">
        <span class="result-label">Tatsächliche Geschwindigkeit:</span>
        <span class="result-value">${vTats.toFixed(2)} m/s</span>
      </div>
    </div>`;
}

// ============================================
// LÜFTUNGSBERECHNUNG
// ============================================
function calculateLueftung() {
  const volumen = parseFloat(document.getElementById('lueft-volumen').value);
  const luftwechsel = parseFloat(document.getElementById('lueft-wechsel').value);
  const personen = parseInt(document.getElementById('lueft-personen').value) || 0;
  
  if (isNaN(volumen) || volumen <= 0) {
    return alert('Bitte gültiges Raumvolumen eingeben');
  }
  
  // Nach Luftwechsel
  const volLuftwechsel = volumen * luftwechsel;
  
  // Nach Personen (30 m³/h pro Person)
  const volPersonen = personen * 30;
  
  // Maßgebend ist der größere Wert
  const erforderlich = Math.max(volLuftwechsel, volPersonen);
  
  document.getElementById('lueft-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Raumvolumen:</span>
        <span class="result-value">${volumen} m³</span>
      </div>
      <div class="result-item">
        <span class="result-label">Nach Luftwechsel (${luftwechsel}/h):</span>
        <span class="result-value">${volLuftwechsel.toFixed(0)} m³/h</span>
      </div>
      ${personen > 0 ? `
      <div class="result-item">
        <span class="result-label">Nach Personen (${personen} × 30):</span>
        <span class="result-value">${volPersonen} m³/h</span>
      </div>` : ''}
      <div class="result-item">
        <span class="result-label">Erforderlicher Luftvolumenstrom:</span>
        <span class="result-value"><strong>${erforderlich.toFixed(0)} m³/h</strong></span>
      </div>
    </div>`;
}

// ============================================
// SANITÄR SPITZENDURCHFLUSS
// ============================================
function calculateSanitaer() {
  let summeKalt = 0;
  let summeWarm = 0;
  
  // Alle Eingabefelder durchgehen
  document.querySelectorAll('.sanitaer-input').forEach(input => {
    const typ = input.dataset.typ;
    const anzahl = parseInt(input.value) || 0;
    
    if (anzahl > 0 && ANSCHLUSSWERTE[typ]) {
      summeKalt += anzahl * ANSCHLUSSWERTE[typ].kalt;
      summeWarm += anzahl * ANSCHLUSSWERTE[typ].warm;
    }
  });
  
  if (summeKalt === 0) {
    return alert('Bitte mindestens ein Objekt eingeben');
  }
  
  // Spitzendurchfluss nach Formel (vereinfacht)
  // Vs = a × Σ(VR)^b, typisch a=1, b=0.5
  const spitzeKalt = Math.sqrt(summeKalt) * 1.0;
  const spitzeWarm = Math.sqrt(summeWarm) * 1.0;
  const spitzeGesamt = Math.sqrt(summeKalt + summeWarm) * 1.0;
  
  document.getElementById('san-result').innerHTML = `
    <div class="result">
      <h3>Ergebnis</h3>
      <div class="result-item">
        <span class="result-label">Summe Anschlusswerte Kalt:</span>
        <span class="result-value">${summeKalt.toFixed(2)} l/s</span>
      </div>
      <div class="result-item">
        <span class="result-label">Summe Anschlusswerte Warm:</span>
        <span class="result-value">${summeWarm.toFixed(2)} l/s</span>
      </div>
      <div class="result-item">
        <span class="result-label">Spitzendurchfluss Kalt:</span>
        <span class="result-value">${spitzeKalt.toFixed(2)} l/s = ${(spitzeKalt*60).toFixed(1)} l/min</span>
      </div>
      <div class="result-item">
        <span class="result-label">Spitzendurchfluss Warm:</span>
        <span class="result-value">${spitzeWarm.toFixed(2)} l/s = ${(spitzeWarm*60).toFixed(1)} l/min</span>
      </div>
    </div>
    <div class="info-box">
      <h4>📌 Hinweis</h4>
      <p>Vereinfachte Berechnung nach DIN 1988-300. Für genaue Planung Gleichzeitigkeitsfaktoren beachten!</p>
    </div>`;
}
