# ElektroProfi Ultimate PWA

Komplette Elektro-Suite für Elektrofachkräfte und Azubis mit Offline-Unterstützung.

## 📁 Struktur

```
elektro-pwa/
├── index.html          # Hauptseite mit Navigation
├── manifest.json       # PWA-Manifest
├── sw.js              # Service Worker (Offline-Cache)
├── css/
│   └── style.css      # Alle Styles
├── js/
│   ├── app.js         # Haupt-App-Logik
│   ├── berechnungen.js # Alle Berechnungsfunktionen
│   └── quiz.js        # Quiz-System
├── pages/
│   ├── berechnungen.html  # Ohm, Querschnitt, Leistung, etc.
│   ├── erweitert.html     # Erdung, Kurzschluss, Trafo
│   ├── praxis.html        # Symbole, Drehmoment, Farben
│   ├── wissen.html        # Tabellen, Höhen, Badzonen
│   ├── lernen.html        # Quiz
│   └── fehlersuche.html   # Troubleshooting
└── icons/
    └── icon.svg       # App-Icon (für PNGs konvertieren)
```

## 🚀 Installation & Deployment

### Lokal testen

Die PWA benötigt einen Webserver (wegen Service Worker):

```bash
# Mit Python 3
cd elektro-pwa
python -m http.server 8080

# Mit Node.js (npx)
npx serve .

# Mit PHP
php -S localhost:8080
```

Dann öffnen: `http://localhost:8080`

### Auf Webserver deployen

1. Alle Dateien auf deinen Webserver hochladen
2. HTTPS ist erforderlich für PWA-Installation!
3. Auf SharePoint: Als statische Website bereitstellen

### Icons generieren

Für vollständige PWA-Unterstützung, generiere PNG-Icons aus dem SVG:
- icon-72.png (72×72)
- icon-96.png (96×96)
- icon-128.png (128×128)
- icon-144.png (144×144)
- icon-152.png (152×152)
- icon-192.png (192×192)
- icon-384.png (384×384)
- icon-512.png (512×512)

Online-Tools: realfavicongenerator.net oder pwa-asset-generator

## 📱 Als App installieren

Nach dem Öffnen im Browser:
- **Chrome/Edge**: Menü → "App installieren" oder Banner
- **Safari iOS**: Teilen → "Zum Home-Bildschirm"
- **Firefox**: Adressleiste → Haus-Icon

## ✨ Features

- ✅ **Offline-fähig** - Funktioniert ohne Internet
- ✅ **Installierbar** - Als App auf Home-Screen
- ✅ **Responsive** - Optimiert für Handy & Desktop
- ✅ **Korrigierte Formeln** - Nach DIN VDE
- ✅ **Quiz-System** - Für Prüfungsvorbereitung

## 🔧 Berechnungen (alle korrigiert nach DIN VDE)

- Ohmsches Gesetz (U, I, R, P)
- Leitungsquerschnitt nach Belastbarkeit & Spannungsfall
- Spannungsfall (Einphasig & Drehstrom)
- Leistungsberechnung (DC, AC 1~, AC 3~)
- Absicherung & Sicherungswahl
- Erdungswiderstand
- Kurzschlussstrom
- Trafo-Dimensionierung
- Kabelgewicht
- Trassen-Dimensionierung

## 📐 Korrigierte Formeln

### Spannungsfall
- **Einphasig:** ΔU = (2 × L × I × cos φ) / (κ × A)
- **Drehstrom:** ΔU = (√3 × L × I × cos φ) / (κ × A)

### Kurzschlussstrom
- **Am Trafo:** Ik" = Sn / (√3 × Un × uk)
- **Leitungsimpedanz:** ZL = 2 × L / (κ × A)

## 📝 Lizenz

Frei zur Nutzung. Keine Gewähr für Berechnungsergebnisse.
Alle Berechnungen durch Fachkraft prüfen lassen!

---
Erstellt für ifm electronic - chh
