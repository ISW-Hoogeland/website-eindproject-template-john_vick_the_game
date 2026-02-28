// Deze objecten houden de huidige status van de speler bij
let gameState = { currentDay: 1, currentChapter: 1, inventory: [], lastScene: 'tuin' };
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
    gameState = { currentDay: 1, inventory: [], lastScene: 'tuin' };
    playCutscene('intro_dag1');
    saveGame();
}

function startGameplay() {
    document.getElementById('cutscene-container').classList.add('hidden');
    showScreen('garden-screen');
    console.log("De gameplay is gestart. Zoek de schep!");
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
        showScreen('garden-screen');
    } else {
        alert("Geen opgeslagen spel gevonden.");
    }
}

// Update de 'laad spel' knop tekst als er een save is
function checkSaveGame() {
    const savedData = localStorage.getItem('johnVickSave');
    const loadBtn = document.querySelector("button[onclick*='load-menu']");

    if (savedData && loadBtn) {
        const data = JSON.parse(savedData);
        loadBtn.innerText = "LAAD SPEL (DAG " + data.currentDay + ")";
    }
}

// Teksten van de Cutscenes
const cutsceneData = {
    intro_dag1: {
        steps: [
            { gif: "assets/intro.gif", speaker: "Mason Bourne", text: "Jij... JIJ... Bent precies waar ik naar op zoek ben." },
            { gif: "assets/intro.gif", speaker: "Mason Bourne", text: "Maar, je moet jezelf wel eerst bewijzen. Als hitman moet je slim zijn." },
            { gif: "assets/tuin_dicht.gif", speaker: "Mason Bourne", text: "In de tuin ligt een geladen pistool begraven. Gebruik je hersenen, dan praten we verder." }
        ],
        nextStep: "chapter_1"
    },

    na_geweer_vinden: {
        steps: [
            { gif: "assets/", speaker: "Mason Bourne", text: "'klapt'" },
            { gif: "assets/", speaker: "Mason Bourne", text: "Nou, één ding is zeker, in een gevecht zou je in ieder geval van mijn dode oma kunnen winnen." },
            { gif: "assets/", speaker: "Mason Bourne", text: "Waar je daadwerkelijk het verschil maakt in dit vak is je schieten." },
            { gif: "assets/", speaker: "Mason Bourne", text: "Kijk hier eens: dummies. Het neusje van de zalm." },
            { gif: "assets/", speaker: "Mason Bourne", text: "10 meter, 20 meter en 30 meter. Laat maar zien wat je kunt." }
        ],
        nextStep: "chapter_2"
    },

    na_schieten: {
        steps: [
            { gif: "assets/", speaker: "Mason Bourne", text: "Ik ben serieus onder de indruk, voor hoever dat kan met stilstaande doelen natuurlijk." },
            { gif: "assets/", speaker: "Mason Bourne", text: "Zeg, zou je morgen op een echt doelwit willen jagen?" },
            { gif: "assets/", speaker: "John Vick", text: "YEAH!!" }
        ]
    }

}

// Speelt de cutscene af
function playCutscene(id) {
    activeCutscene = cutsceneData[id];
    currentCutsceneIndex = 0;
    document.getElementById('cutscene-container').classList.remove('hidden');
    updateCutsceneUI();
}

// Update de cutscene UI
let typewriterInterval;

function updateCutsceneUI() {
    const step = activeCutscene.steps[currentCutsceneIndex];
    const gifElement = document.getElementById('cutscene-gif');
    const textElement = document.getElementById('dialogue-text');
    const nameElement = document.getElementById('speaker-name');
    const nextBtn = document.getElementById('next-btn');

    nameElement.innerText = step.speaker || "*Onbekend*"

    gifElement.src = step.gif;
    let i = 0;
    textElement.innerText = "";
    nextBtn.style.display = "none";

    clearInterval(typewriterInterval);

    typewriterInterval = setInterval(() => {
        textElement.innerText += step.text.charAt(i);
        i++;

        if (i >= step.text.length) {
            clearInterval(typewriterInterval);
            nextBtn.style.display = "block";
        }
    }, 1);
}

// Maakt de 'verder' knop werkend in de cutscenes
function nextCutsceneStep() {
    currentCutsceneIndex++;

    if (currentCutsceneIndex < activeCutscene.steps.length) {
        updateCutsceneUI();
    } else {
        document.getElementById('cutscene-container').classList.add('hidden');
        if (activeCutscene.nextStep === "chapter_1") {
            showScreen('garden-screen');
        } else if (activeCutscene.nextStep === "chapter_2") {
            showScreen('shooting-range');
        } else {
            showScreen('main-menu');
        }
    }
}

// Houdt de status van de speler bij
let playerHasShovel = false;
let shedIsUnlocked = false;

// Houdt de rotatie van de 8 schijven bij
let diskRotations = [0, 0, 0, 0, 0, 0, 0, 0];

// De puzzelacties
function openElectricalPuzzleOverLay() {
    document.getElementById('electrical-puzzle-overlay').classList.remove('hidden');
    diskRotations.forEach((index) => {
        const randomRot = Math.floor(Math.random() * 4) * 90;
        setDiskRotation(index, randomRot);
    });
}

function closeElectricalPuzzleOverlay() {
    document.getElementById('electrical-puzzle-overlay').classList.add('hidden');
}

// Draait de schijven in stappen van 90 graden
function rotateDisk(index) {
    diskRotations[index] = diskRotations[index] + 90;
    setDiskRotation(index, diskRotations[index]);
}

function setDiskRotation(index, rot) {
    const diskElement = document.getElementById(`disk-${index}`);
    if (diskElement) {
        diskElement.style.transform = `rotate(${rot}deg)`;
    }
}

// Controleert of de schijven goed zijn
function checkElectricalPuzzle() {
    let allCorrect = true;

    for (let i = 0; i < diskRotations.length; i++) {
        let currentPos = diskRotations[i] % 360;
        if (currentPos < 0) currentPos += 360;
        let isDiskCorrect = false;
        switch (i) {
            case 0: isDiskCorrect = true; break;
            case 1: if (currentPos === 0) isDiskCorrect = true; break;
            case 2: if (currentPos === 0 || currentPos === 180) isDiskCorrect = true; break;
            case 3: if (currentPos === 180) isDiskCorrect = true; break;
            case 4: if (currentPos === 180) isDiskCorrect = true; break;
            case 5: if (currentPos === 0) isDiskCorrect = true; break;
            case 6: if (currentPos === 180 || currentPos === 270) isDiskCorrect = true; break;
            case 7: isDiskCorrect = true; break;
        }
        if (!isDiskCorrect) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        shedIsUnlocked = true;
        alert("De schakeling is compleet. Het tuinhuisje-slot klikt open!");
        closeElectricalPuzzleOverlay();
    } else {
        alert("De stroom vloeit nog niet door... Controleer de schakeling.");
    }
}

// Interactie met het tuinhuisje
function interactWithShed() {
    if (!shedIsUnlocked) {
        alert("Mason Bourne: 'Slim zijn, zeg ik toch!'. Het slot zit erop.");
    } else {
        if (!playerHasShovel) {
            alert("Je opent het tuinhuisje. Binnenin staat een schep!");
            playerHasShovel = true;
            gameState.inventory.push("Schep");
            saveGame();
        } else {
            alert("Er is niets meer te vinden.");
        }
    }
}

// Graven
function interactWithDigSite() {
    if (!playerHasShovel) {
        alert("Mason Bourne: Graven met je handen duurt te lang...");
    } else {
        alert("Gefeliciteerd, je hebt je geweer!");
        gameState.inventory.push("Geladen Pistool");
        gameState.currentChapter = 2;
        saveGame();
        playCutscene('na_geweer_vinden');
    }
}

// Schieten op de dummies
function shootDummy(element) {
    const range = document.getElementById('shooting-range');
    range.classList.add('flash-active');
    setTimeout(() => {
        range.classList.remove('flash-active');
    }, 100);
    element.classList.add('hit');
    const activeDummies = document.querySelectorAll('.dummy:not(.hit)');
    if (activeDummies.length === 0) {
        setTimeout(() => {
            playCutscene('na_schieten');
        }, 800);
    }
}

// Check save game bij laden van script
checkSaveGame();