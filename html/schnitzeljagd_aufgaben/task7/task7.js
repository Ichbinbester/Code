function checkAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) return;

  const answer = selectedOption.value;
  const totalPoints = 200;//parseInt(localStorage.getItem("points")) || 0;

  // Entscheidungslogik:
  if (totalPoints >= 264 && answer === "verteidigen") {
    window.location.href = "../../speeches/speech_task7_case1.html";
  } else if (totalPoints >= 264 && answer === "zerstören") {
    window.location.href = "../../speeches/speech_task7_case2.html";
  } else if (totalPoints < 264 && answer === "verteidigen") {
    window.location.href = "../../speeches/speech_task7_case3.html";
  } else if (totalPoints < 264 && answer === "zerstören") {
    window.location.href = "../../speeches/speech_task7_case4.html";
  } else {
    alert("Unbekannter Fehler.");
  }
}