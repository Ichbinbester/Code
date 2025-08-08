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

// Prüft die ausgewählte Antwort
function checkAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) return; // Nichts tun, wenn keine Auswahl

  const answer = selectedOption.value;
  if (answer === 'unbrauchbar') {
    window.location.href = "../../speeches/speech_task4_ok.html";
  } else {
    window.location.href = "../../speeches/speech_task4_nok.html";
  }
}