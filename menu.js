// menu.js
const cutscene = document.getElementById("cutscene");
const cutsceneText = document.getElementById("cutscene-text");
const cutsceneNext = document.getElementById("cutscene-next");

const tutorial = document.getElementById("tutorial");
const tutorialStart = document.getElementById("tutorial-start");

const menuButtons = document.querySelector(".menu-buttons");
const startBtn = document.getElementById("start-btn");

// scenes
const scenes = [
    "Jij... JIJ... bent precies waar ik naar op zoek ben.",
    "Maar, je moet jezelf wel eerst bewijzen. Als hitman moet je silm zijn en je omgeving ten gunste van jezelf gebruiken.",
    "In de tuin ligt een geladen pistool begraven. Gebruik je hersenen, pas dan praten we verder."
];

let sceneIndex = 0;
let typingInterval = null;

function typeText(text, speed = 40) {
    // clear previous interval indien aanwezig
    if (typingInterval) clearInterval(typingInterval);
    cutsceneText.textContent = "";
    let i = 0;
    typingInterval = setInterval(() => {
        cutsceneText.textContent += text[i] ?? "";
        i++;
        if (i >= text.length) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
    }, speed);
}

function startGame() {
    // verberg alleen het menu
    menuButtons.style.display = "none";

    // toon cutscene (remove hidden)
    cutscene.classList.remove("hidden");
    sceneIndex = 0;
    typeText(scenes[sceneIndex]);
}

startBtn.addEventListener("click", startGame);

// next button
cutsceneNext.addEventListener("click", () => {
    // als sedang typen, completeer snel (optioneel)
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
        // toon volledige tekst direct
        cutsceneText.textContent = scenes[sceneIndex];
        return;
    }

    sceneIndex++;
    if (sceneIndex < scenes.length) {
        typeText(scenes[sceneIndex]);
    } else {
        // einde cutscene -> laat tutorial zien
        cutscene.classList.add("hidden");
        tutorial.classList.remove("hidden");
    }
});

// tutorial start
tutorialStart.addEventListener("click", () => {
    tutorial.classList.add("hidden");
    // hier start je eigen spellogica
    console.log("Tutorial klaar — start het echte spel.");
});
