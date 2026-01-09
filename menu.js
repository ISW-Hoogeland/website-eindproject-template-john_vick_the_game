// =====================
// CUTSCENE ELEMENTEN
// =====================
const cutscene = document.getElementById("cutscene");
const cutsceneText = document.getElementById("cutscene-text");
const cutsceneNext = document.getElementById("cutscene-next");

// =====================
// MENU / TUTORIAL OVERLAYS
// =====================
const tutorial = document.getElementById("tutorial");
const tutorialStart = document.getElementById("tutorial-start");

const menuButtons = document.querySelector(".menu-buttons");
const startBtn = document.getElementById("start-btn");

// =====================
// CUTSCENE DATA
// =====================
const scenes = [
    "Jij... JIJ... bent precies waar ik naar op zoek ben.",
    "Maar je moet jezelf eerst bewijzen. Als hitman moet je slim zijn en je omgeving gebruiken.",
    "In de tuin ligt een geladen pistool begraven. Gebruik je hersenen."
];

let sceneIndex = 0;
let typingInterval = null;

// =====================
// TYPEWRITER EFFECT
// =====================
function typeText(text, speed = 40) {
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

// =====================
// START GAME → CUTSCENE
// =====================
function startGame() {
    menuButtons.style.display = "none";
    cutscene.classList.remove("hidden");

    sceneIndex = 0;
    typeText(scenes[sceneIndex]);
}

startBtn.addEventListener("click", startGame);

// =====================
// CUTSCENE NEXT
// =====================
cutsceneNext.addEventListener("click", () => {
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
        cutsceneText.textContent = scenes[sceneIndex];
        return;
    }

    sceneIndex++;

    if (sceneIndex < scenes.length) {
        typeText(scenes[sceneIndex]);
    } else {
        cutscene.classList.add("hidden");
        tutorial.classList.remove("hidden");
    }
});

// =====================
// TUTORIAL START
// =====================
tutorialStart.addEventListener("click", () => {
    tutorial.classList.add("hidden");
    tutorialScene.classList.remove("hidden");
    tutorialText.textContent = "Open het elektriciteitskastje.";
});

// =====================================================
// ===================== TUTORIAL GAME ==================
// =====================================================

// Tutorial scene elementen
const tutorialScene = document.getElementById("tutorial-scene");
const electricBox = document.getElementById("electric-box");
const shed = document.getElementById("shed");
const restrictedArea = document.getElementById("restricted-area");
const shovelItem = document.getElementById("shovel");
const gun = document.getElementById("gun");
const tutorialText = document.getElementById("tutorial-text");

// Tutorial state
let powerSolved = false;
let shedUnlocked = false;
let hasShovel = false;
let gunFound = false;

// =====================
// ELEKTRICITEITSKASTJE
// =====================
electricBox.addEventListener("click", () => {
    if (powerSolved) return;

    const answer = prompt("Vind x: e^ln(5) - 5x = 0");
    if (answer === "1") {
        powerSolved = true;
        shedUnlocked = true;
        tutorialText.textContent = "Het slot is uitgeschakeld. Ga naar het tuinhuisje.";
        alert("Elektriciteit uitgeschakeld!");
    } else {
        alert("Fout antwoord.");
    }
});

// =====================
// TUINHUISJE
// =====================
shed.addEventListener("click", () => {
    if (!shedUnlocked) {
        tutorialText.textContent = "Het tuinhuisje zit nog op slot.";
        return;
    }

    if (!hasShovel) {
        hasShovel = true;
        shovelItem.classList.remove("hidden");
        tutorialText.textContent = "Je hebt een schep. Graaf in het afgezette gebied.";
    }
});

// =====================
// GRAVEN
// =====================
restrictedArea.addEventListener("click", () => {
    if (!hasShovel || gunFound) return;

    gunFound = true;
    gun.classList.remove("hidden");
    tutorialText.textContent = "Je raakt iets hards onder de grond...";
});

// =====================
// GEWEER → NIEUWE CUTSCENE
// =====================
gun.addEventListener("click", () => {
    tutorialScene.classList.add("hidden");

    // nieuwe cutscene
    scenes.length = 0;
    scenes.push(
        "Nou, één ding is zeker, in een gevecht zou je in ieder geval van mijn dode oma kunnen winnen.",
        "Waar je daadwerkelijk het verschil maakt in dit vak is je schieten.",
        "Kijk eens hier: dummies. het neusje van de zalm. 10 meter, 20 meter en 30 meter. laat eens zien wat je kunt."

    );

    sceneIndex = 0;
    cutscene.classList.remove("hidden");
    typeText(scenes[sceneIndex]);
});
