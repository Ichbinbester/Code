// Referenzen zu HTML-Elementen
const collectBtn = document.getElementById('collectBtn');
const counterText = document.getElementById('counter');
let collected = 0; // Anzahl der eingesammelten Modelle
const total = 3;   // Gesamtzahl der Modelle

// IDs der AR-Modelle
const modelIds = ['model1', 'model2', 'model3'];
const collectedModels = new Set(); // Bereits eingesammelte Modelle

// Klick auf den Einsammel-Button
collectBtn.addEventListener('click', () => {
  const cam = document.querySelector('[gps-camera]');
  const camPos = cam.components['gps-camera'].currentCoords;

  modelIds.forEach(id => {
    if (collectedModels.has(id)) return;

    const model = document.getElementById(id);
    const entityCoords = model.getAttribute('gps-entity-place');

    // Entfernung zwischen Kamera und Modell berechnen
    const dist = getDistance(
      camPos.latitude, camPos.longitude,
      entityCoords.latitude, entityCoords.longitude
    );

    // Wenn in Reichweite (15 Meter)
    if (dist < 15) {
      model.parentNode.removeChild(model); // Modell aus Szene entfernen
      collectedModels.add(id);
      collected++;
      counterText.innerText = `${collected} / ${total}`;

      // Wenn alle Modelle eingesammelt → Endbildschirm zeigen
      if (collected === total) {
        document.getElementById('endScreen').style.display = 'flex';
      }
    }
  });
});

// Haversine-Formel zur Entfernungsberechnung zwischen zwei GPS-Punkten
function getDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  const R = 6371e3; // Erdradius in Metern
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Timer
const timerElement = document.getElementById('timer');
let secondsElapsed = 0;
let timerStarted = false;
let timerInterval = null;

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  // Timer starten
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const seconds = String(secondsElapsed % 60).padStart(2, '0');
    timerElement.innerText = `${minutes}:${seconds}`;
  }, 1000);

  // Tipp-Button sichtbar machen
  const tipBtn = document.getElementById('tipBtn');
  if (tipBtn) tipBtn.style.display = 'block';
}

// Ladebildschirm beim Start
const gpsLoading = document.getElementById('gpsLoading');

document.querySelector('[gps-camera]').addEventListener('gps-camera-update-position', () => {
  if (gpsLoading) gpsLoading.style.display = 'none';
  startTimer();  // Timer startet, sobald GPS gefunden
});

// Fallback: Startet Timer nach 15 Sekunden trotzdem
setTimeout(() => {
  if (gpsLoading) gpsLoading.style.display = 'none';
  startTimer();  // Falls GPS zu lange braucht
}, 15000);

// Öffnet das Tipp-Fenster
function showTip() {
  document.getElementById('popupOverlay').classList.add('active');
  document.getElementById('tipPopup').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Schließt das Tipp-Fenster
function hideTip() {
  document.getElementById('popupOverlay').classList.remove('active');
  document.getElementById('tipPopup').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Tippfenster mit ESC schließen
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') hideTip();
});