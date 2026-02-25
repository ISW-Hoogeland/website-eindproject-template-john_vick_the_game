// Deze objecten houden de huidige status van de speler bij
let gameState = { currentDay: 1, inventory: [], lastScene: 'tuin' };
let currentCutsceneIndex = 0;
let activeCutscene = [];

// Dit zorgt ervoor dat bij het opstarten altijd het menu opent
window.onload = function () {
    showScreen('main-menu');
    document.getElementById('cutscene-container').classList.add('hidden');
};

// Functies voor het menu
function showScreen(screenId) {
    const screens = document.querySelectorAll('.menu-screen');
    screens.forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Start een volledig nieuw spel
function startGame() {
    document.getElementById('cutscene-container').classList.add('hidden');
    showScreen('game-screen');
    playCutscene('intro_dag1');
    console.log("De gameplay is gestart. Zoek de schep!");
    saveGame
}

// Functies voor het opslaan en laden

// Slaat de huidige gameState op in de browser
function saveGame() {
    localStorage.setItem('johnVickSave', JSON.stringify(gameState));
    console.log("Spel opgeslagen!");
}

// Laadt het spel vanuit de browser
function loadGame() {
    const savedData = localStorage.getItem('johnVickSave');

    if (savedData) {
        gameState = JSON.parse(savedData);
        alert("Spel geladen! Je bent bij Dag " + gameState.currentDay);
        loadScene(gameState.lastScene);
    } else {
        alert("Geen opgeslagen spel gevonden.");
    }
}

// Update de 'laad spel' knop tekst als er een save is
function checkSaveGame() {
    const savedData = localStorage.getItem('johnVickSave');
    const loadBtn = document.querySelector("button[onclick*='load-menu']");

    if (savedData) {
        const data = JSON.parse(savedData);
        loadBtn.innerText = "LAAD SPEL (DAG " + data.currentDay + ")";
    }
}

// Teksten van de Cutscenes
const cutsceneData = {
    intro_dag1: [
        { gif: "assets/mason_intro.gif", text: "Jij... JIJ... Bent precies waar ik naar op zoek ben." },
        { gif: "assets/mason_intro.gif", text: "Maar, je moet jezelf wel eerst bewijzen. Als hitman moet je slim zijn." },
        { gif: "assets/tuin_shot.gif", text: "In de tuin ligt een geladen pistool begraven. Gebruik je hersenen, dan praten we verder." }
    ]
}

// Speelt de cutscene af
function playCutscene(id) {
    activeCutscene = cutsceneData[id];
    currentCutsceneIndex = 0;
    document.getElementById('cutscene-container').classList.remove('hidden');
    updateCutsceneUI();
}

// Update de cutscene UI
function updateCutsceneUI() {
    const step = activeCutscene[currentCutsceneIndex];
    document.getElementById('cutscene-gif').src = step.gif;
    document.getElementById('dialogue-text').innerText = step.text;
}

// Maakt de 'verder' knop werkend in de cutscenes
function nextCutsceneStep() {
    currentCutsceneIndex++;

    if (currentCutsceneIndex < activeCutscene.length) {
        updateCutsceneUI();
    } else {
        // Einde van de cutscene
        document.getElementById('cutscene-container').classList.add('hidden');
        startGameplay(); // De functie die de tuin laat zien
    }
}

checkSaveGame();