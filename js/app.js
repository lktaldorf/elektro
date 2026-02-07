/**
 * ElektroProfi Ultimate - Haupt-App
 * PWA mit Offline-Support
 */

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registriert:', reg.scope);
        
        // Update verfügbar?
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(err => console.error('SW Registrierung fehlgeschlagen:', err));
  });
}

// Offline-Status anzeigen
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const indicator = document.getElementById('offline-indicator');
  if (indicator) {
    if (!navigator.onLine) {
      indicator.classList.add('show');
    } else {
      indicator.classList.remove('show');
    }
  }
}

// Update-Benachrichtigung
function showUpdateNotification() {
  if (confirm('Eine neue Version ist verfügbar. Jetzt aktualisieren?')) {
    window.location.reload();
  }
}

// Tab-Navigation
function showTab(tabId) {
  const container = event.target.closest('.container') || document;
  
  // Alle Contents ausblenden
  container.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  
  // Gewählten Tab aktivieren
  const content = document.getElementById(tabId);
  if (content) {
    content.classList.add('active');
  }
  event.target.classList.add('active');
}

// Seiten-Navigation (für Multi-Page PWA)
function loadPage(pageUrl) {
  // Bei echter Multi-Page App: window.location.href = pageUrl;
  // Bei SPA: fetch und inject
}

// Troubleshoot Toggle
function toggleTroubleshoot(card) {
  const solutions = card.querySelector('.troubleshoot-solutions');
  const wasVisible = solutions.classList.contains('visible');
  
  // Alle schließen
  document.querySelectorAll('.troubleshoot-solutions').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.troubleshoot-card').forEach(c => c.classList.remove('expanded'));
  
  // Gewählte öffnen (wenn nicht schon offen)
  if (!wasVisible) {
    solutions.classList.add('visible');
    card.classList.add('expanded');
  }
}

// Formatierung Hilfsfunktionen
function formatNumber(num, decimals = 2) {
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function formatWithUnit(value, unit, decimals = 2) {
  return `${formatNumber(value, decimals)} ${unit}`;
}

// Validierung
function validateNumber(value, min = null, max = null) {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
}

function showError(message) {
  alert(message);
}

// Speichern/Laden von Einstellungen (localStorage)
function saveSettings(key, value) {
  try {
    localStorage.setItem(`elektropro_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage nicht verfügbar');
  }
}

function loadSettings(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(`elektropro_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
  // Offline-Status prüfen
  updateOnlineStatus();
  
  // Letzte Einstellungen laden
  const lastTab = loadSettings('lastTab');
  if (lastTab) {
    const tabBtn = document.querySelector(`[data-tab="${lastTab}"]`);
    if (tabBtn) tabBtn.click();
  }
  
  // Felder initialisieren
  if (typeof updateOhmFields === 'function') updateOhmFields();
  if (typeof updateLeistungFields === 'function') updateLeistungFields();
  
  console.log('ElektroProfi Ultimate geladen');
});

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showTab, toggleTroubleshoot, formatNumber, validateNumber };
}
