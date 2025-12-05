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
    "Het is een donkere nacht in Westland.",
    "John Vick staat op het punt om wraak te nemen op degenen die zijn boot hebben gestolen.",
    "Maar voordat hij zijn missie kan beginnen, moet hij eerst leren overleven."
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
