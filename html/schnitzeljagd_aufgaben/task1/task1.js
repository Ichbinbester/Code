let tipUsed = false;

// Aus URL holen
const params = new URLSearchParams(window.location.search);
const code = params.get('code');
const name = params.get('player');
const playercode = params.get('playercode');

// In localStorage speichern (nur falls vorhanden)
if (code) localStorage.setItem("code", code);
if (name) localStorage.setItem("name", name);
if (playercode) localStorage.setItem("playercode", playercode);

// Prüft, ob Eingabe korrekt ist
function checkAnswer() {
  const input = document.getElementById("userInput").value.trim().toLowerCase();
  const solution = "der wagen im park ist blockiert";

  if (input === solution) {
    document.getElementById("playerName").value = localStorage.getItem("name");
    document.getElementById("playerCode").value = localStorage.getItem("code");
    document.getElementById("playerCodeHidden").value = localStorage.getItem("playercode"); // <--- Wichtig
    document.getElementById("usedTip").value = tipUsed ? "1" : "0";
    document.getElementById("taskAction").value = "solve";

    document.getElementById("taskForm").submit();
  } else {
    window.location.href = "../../speeches/speech_task1_nok.html";
  }
}

// Beendet Aufgabe manuell
function skipTask() {
  document.getElementById("playerName").value = localStorage.getItem("name");
  document.getElementById("playerCode").value = localStorage.getItem("code");
  document.getElementById("playerCodeHidden").value = localStorage.getItem("playercode"); // <--- Wichtig
  document.getElementById("usedTip").value = tipUsed ? "1" : "0";
  document.getElementById("taskAction").value = "giveup";

  document.getElementById("taskForm").submit();
}

// Zeigt Tippfenster
function showTip() {
  document.getElementById("popupOverlay").classList.add("active");
  document.getElementById("tipPopup").classList.add("active");
  document.body.style.overflow = "hidden";
  tipUsed = true;
}

// Versteckt Tippfenster
function hideTip() {
  document.getElementById("popupOverlay").classList.remove("active");
  document.getElementById("tipPopup").classList.remove("active");
  document.body.style.overflow = "hidden";
}

// Ermöglicht Schließen des Popups per ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") hideTip();
});
