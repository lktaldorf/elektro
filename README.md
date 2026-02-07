# ElektroProfi Ultimate v2.0

Komplette Progressive Web App für Elektrofachkräfte und Auszubildende.

## 🆕 Neuerungen in Version 2.0

### 1. Korrigierte Symbole nach DIN-Normen
- **Installationssymbole (DIN 18015)**: 35+ Symbole exakt nach Norm
  - Steckdosen (Halbkreis oben + Strich)
  - Schalter (Kreis mit Anschluss)
  - Beleuchtung (X-Zeichen)
  - Geräte (E, Herd mit 4 Punkten, etc.)
- **Schaltplansymbole (DIN EN 60617)**: 30+ Symbole
  - Widerstand (Rechteck), Kondensator, Spule
  - Dioden, Transistoren (NPN/PNP korrekt)
  - Logikgatter (& und ≥1)
  - Messgeräte (A/V/Ω im Kreis)

### 2. Neue Sicherungen-Seite
- **Farben (DIN 49360)**: Visuelle Farbkarten mit Merkspruch
- **LSS-Charakteristiken**: B/C/D/K/Z mit Auslösekurven-Diagramm
- **NH-Sicherungen**: Komplette Tabelle 000 bis NH4
  - Maße, Kontaktabstände, Stromstärken
  - Betriebsklassen (gG, aM, gR/aR)
  - Sicherheitshinweise
- **DIAZED/NEOZED**: Größen und Sockelfarben

### 3. Bad-Zonen mit Maßzeichnungen
- **Draufsicht**: Badewanne, Dusche, Waschbecken mit Zone 0/1/2
- **Seitenansicht**: Höhenbemaßung 225cm, 120cm Brauseradius
- IP-Schutzarten für jede Zone
- FI-Schutz ≤30mA Pflicht

### 4. Strukturierte Navigation
- Separate Sicherungen-Seite mit Tabs
- Übersichtlichere Praxis-Seite
- Erweiterte Wissen-Seite mit Installationshöhen

## 📁 Struktur

```
elektro-pwa-v2/
├── index.html          # Startseite
├── manifest.json       # PWA-Manifest
├── sw.js              # Service Worker
├── css/
│   └── style.css      # Alle Styles
├── js/
│   ├── app.js         # Navigation
│   ├── berechnungen.js # Formeln
│   └── quiz.js        # Quiz-Logik
├── pages/
│   ├── berechnungen.html  # Ohm, Querschnitt, Leistung
│   ├── erweitert.html     # Kurzschluss, Trafo
│   ├── praxis.html        # Symbole, Drehmoment
│   ├── sicherungen.html   # Farben, LSS, NH, DIAZED
│   ├── wissen.html        # Badzonen, Höhen, IP
│   ├── lernen.html        # Quiz
│   └── fehlersuche.html   # Messungen
└── icons/
    └── icon-*.png     # App-Icons
```

## 🚀 Installation

1. ZIP entpacken auf Webserver oder lokal
2. Im Browser öffnen (http://localhost oder file://)
3. "Zum Startbildschirm hinzufügen" für PWA-Installation
4. Funktioniert auch offline!

## ✅ Geprüfte Formeln

Alle Formeln nach DIN VDE:
- Ohmsches Gesetz: U = I × R
- Spannungsfall Einphasig: ΔU = (2 × L × I × cos φ) / (κ × A)
- Spannungsfall Drehstrom: ΔU = (√3 × L × I × cos φ) / (κ × A)
- Leistung AC: S = √3 × U × I, P = S × cos φ
- Kurzschlussstrom: Ik" = Sn / (√3 × Un × uk)

## 📱 Features

- ⚡ Alle wichtigen Elektro-Berechnungen
- 📐 DIN-konforme Symbole
- 🛡️ Komplettes Sicherungswissen
- 📚 Normen-Nachschlagewerk
- 🎓 Quiz zum Lernen
- 🔧 Fehlersuche-Anleitungen
- 📵 Offline-Funktionalität
- 📱 Installierbar als App

---
Version 2.0 | 2026 | Für Elektrofachkräfte
