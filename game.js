const steps = [
  "Bienvenido al juego contra la discriminación.",
  "Cada decisión afecta a las personas a tu alrededor.",
  "Ayuda a crear un mundo más justo.",
  "Todos merecemos respeto.",
  "¡Gracias por jugar!"
];

let current = 0;

const content = document.getElementById("content");
const progressBar = document.getElementById("progress-bar");
const nextBtn = document.getElementById("next-btn");

function updateUI() {
  content.textContent = steps[current];

  const pct = ((current + 1) / steps.length) * 100;
  progressBar.style.width = pct + "%";

  if (current === steps.length - 1) {
    nextBtn.textContent = "Finalizar";
  }
}

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current++;
    updateUI();
  } else {
    content.innerHTML = "✨ Has completado la experiencia ✨";
    nextBtn.style.display = "none";
  }
});

updateUI();
