const text = [
  "Bienvenido al juego educativo contra la discriminación.",
  "Aprenderás cómo las acciones pequeñas generan un impacto grande.",
  "Todas las personas merecen respeto y trato justo.",
  "¡Juntos podemos crear un mundo más igualitario!",
  "Has completado el juego. ¡Gracias por jugar!"
];

let index = 0;

const gameText = document.getElementById("game-text");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");

function updateGame() {
  gameText.textContent = text[index];

  const percent = Math.floor((index / (text.length - 1)) * 100);
  progressBar.style.width = percent + "%";

  if (index === text.length - 1) {
    nextBtn.textContent = "Reiniciar";
  }
}

nextBtn.addEventListener("click", () => {
  if (index < text.length - 1) {
    index++;
  } else {
    index = 0;
  }
  updateGame();
});

updateGame();
