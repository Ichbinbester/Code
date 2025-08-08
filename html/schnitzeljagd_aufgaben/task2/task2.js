    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') || localStorage.getItem('code');
    const name = params.get('player');
    const playercode = params.get('playercode');

  // Falls nötig, in localStorage sichern
  if (code) localStorage.setItem("code", code);
  if (name) localStorage.setItem("name", name);
  if (playercode) localStorage.setItem("playercode", playercode);


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

// Prüft die ausgewählten Antworten
function checkAnswer() {
  const selected = Array.from(document.querySelectorAll('input[name="item"]:checked')).map(cb => cb.value);
  const correct = ['Brot', 'Bandagen', 'Gewehre'];
  const warning = document.getElementById('warningMessage');

  // Wenn weniger als 3 ausgewählt wurden – Hinweis anzeigen
  if (selected.length < 3) {
    warning.style.display = 'block';
    return;
  }

  // Hinweis ausblenden, falls vorher gezeigt
  warning.style.display = 'none';

  const isCorrect = selected.length === correct.length && correct.every(item => selected.includes(item));

  if (isCorrect) {
    window.location.href = "../../speeches/speech_task2_ok.html";
  } else {
    window.location.href = "../../speeches/speech_task2_nok.html";
  }
}