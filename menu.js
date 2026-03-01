// Deze objecten houden de huidige status van diverse objecten bij
let gameState = { currentDay: 1, currentChapter: 1, inventory: [], lastScene: 'tuin' };
let currentCutsceneIndex = 0;
let activeCutscene = null;
let activeBlock = null;
let offset = { x: 0, y: 0 };
const gridSize = 160;
const offsetMargin = 6;

// Teksten van de Cutscenes
const cutsceneData = {
    intro_dag1: {
        steps: [
            { gif: "assets/tuin_dicht.png", speaker: "Mason Bourne", text: "Jij... JIJ... Bent precies waar ik naar op zoek ben." },
            { gif: "assets/tuin_dicht.png", speaker: "Mason Bourne", text: "Maar, je moet jezelf wel eerst bewijzen. Als hitman moet je slim zijn." },
            { gif: "assets/tuin_dicht.png", speaker: "Mason Bourne", text: "In de tuin ligt een geladen pistool begraven. Gebruik je hersenen, dan praten we verder." }
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
            { gif: "assets/", speaker: "John Vick", text: "YEAH!!" },
            { gif: "assets/bo.png", speaker: " ", text: "DAG 2..." },
            { gif: "assets/huis_mason.gif", speaker: "John Vick", text: "Ik ben beniewd naar mijn missie." },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Hallo John. Ben je klaar voor je eerste missie?" },
            { gif: "assets/mason.gif", speaker: "John Vick", text: "Zeker." },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Iemand heeft mijn harde schijf met Josef gestolen." },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Jij moet hem terug halen." },
            { gif: "assets/mason.gif", speaker: "John Vick", text: "Weet je ook wie hem heeft gestolen?" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "We weten nog niet de naam van degene die je moet zoeken, maar we weten wel dat hij super klein is," },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "meestal spijkerbroeken draagt, veel bananen eet en een bril draagt." },
            { gif: "assets/mason.gif", speaker: "John Vick", text: "Heb je nog meer info? Er zijn namelijk veel mensen die er zo uitzien." },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Hij woont in Nederland en hij werkt bij ..." },
            { gif: "assets/tunnel_ingang.gif", speaker: "Mason Bourne", text: "WAT GEBEURT HIER?!?!" },
            { gif: "assets/tunnel_ingang.gif", speaker: "Wachter", text: "WE WORDEN AANGEVALLEN! SNEL, NAAR DE GANGEN!" },
            { gif: "assets/tunnel_ingang.gif", speaker: "Mason Bourne", text: "VOLG MIJ, JOHN!" },
            { gif: "assets/tunnel_ingang.gif", speaker: "John Vick", text: "IK ZIT VLAK ACHTER JE!" },
            { gif: "assets/tunnel_binnen.png", speaker: "Mason Bourne", text: "Ga snel naar binnen! We moeten opsplitsen!" },
            { gif: "assets/tunnel_binnen.png", speaker: "Mason Bourne", text: "Ga naar dit adres en zoek Rob, hij heeft misschien meer informatie over wie het geeft gedaan! Succes!" },
        ],
        nextStep: "chapter_3"
    },

    na_puzzel_club: {
        steps: [
            { gif: "assets/", speaker: " ", text: " " }, //stripclub - hotel
            { gif: "assets/", speaker: " ", text: " " },
            { gif: "assets/bo.png", speaker: " ", text: "DAG 3..." },
            { gif: "assets/hotel_john.png", speaker: " ", text: "John wordt wakker." },
        ],
        nextStep: "chapter_4"
    },

    na_doolhof: {
        steps: [
            { gif: "assets/huis_rob.gif", speaker: " ", text: "Het huis van Rob" },
            { gif: "assets/butler.gif", speaker: "Butler", text: "Goede ochtend. Wie moge u wezen?" },
            { gif: "assets/butler.gif", speaker: "John Vick", text: "John Vick. Ik ben gestuurd door Mason Bourne." },
            { gif: "assets/butler.gif", speaker: "Butler", text: "Ik ga het even navragen." },
            { gif: "assets/bo.png", speaker: " ", text: "Even later..." },
            { gif: "assets/butler.gif", speaker: "Butler", text: "Komen u verder." },
            { gif: "assets/butler.gif", speaker: "John Vick", text: "Danku." },
            { gif: "assets/rob.gif", speaker: "Rob", text: "Ik hoorde dat Mason je gestuurd heeft. Kijk maar even rond. Ik ben bijna klaar met het werk van je doelwit zoeken in de database." },
        ],
        nextStep: "chapter_5"
    },

    na_huis: {
        steps: [
            { gif: "assets/rob.gif", speaker: "Rob", text: "John, ik heb een collega van hem gevonden. Zijn naam is Jantje Hoeksma, misschien weet hij wie je zoekt." },
            { gif: "assets/rob.gif", speaker: "Rob", text: "Pak mijn auto maar, dan stuur ik je het adres door." },
            { gif: "assets/rob.gif", speaker: "John Vick", text: "Bedankt Rob. Ik ga terug naar mijn hotel en morgen ga ik direct achter hem aan" },
            { gif: "assets/", speaker: " ", text: " " }, // Terug naar hotel
            { gif: "assets/bo.png", speaker: " ", text: "DAG 4..." },
            { gif: "assets/", speaker: " ", text: " " }, // Wakker worden
        ],
        nextStep: "chapter_6"
    },

    /*
    [naam]: {
        steps: [
                { gif: "assets/", speaker: "", text: "" },
        ],
        nextStep: "chapter_[#]"
    },
    */
}

// Laad het menu
window.onload = function () {
    showScreen('main-menu');
    document.getElementById('cutscene-container').classList.add('hidden');
    initClubPuzzle();
    initMaze();
};

window.addEventListener('mousemove', drag);
window.addEventListener('mouseup', endDrag);

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
}


// Slaat de huidige gameState op in de browser
function saveGame() {
    localStorage.setItem('johnVickSave', JSON.stringify(gameState));
}

// Laadt het spel vanuit de browser
function loadGame() {
    const savedData = localStorage.getItem('johnVickSave');

    if (savedData) {
        gameState = JSON.parse(savedData);
        alert("Spel geladen! Je bent bij Dag " + gameState.currentChapter);
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
        loadBtn.innerText = "LAAD SPEL (Hoofdstuk " + data.currentChapter + ")";
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
    const container = document.getElementById('cutscene-container');
    const textElement = document.getElementById('dialogue-text');
    const nameElement = document.getElementById('speaker-name');
    const nextBtn = document.getElementById('next-btn');

    nameElement.innerText = step.speaker || "*Onbekend*";

    if (step.gif) {
        container.style.backgroundImage = `url('${step.gif}')`;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";
        container.style.backgroundRepeat = "no-repeat";
    }

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

function nextCutsceneStep() {
    clearInterval(typewriterInterval);
    currentCutsceneIndex++;
    if (currentCutsceneIndex < activeCutscene.steps.length) {
        updateCutsceneUI();
    } else {
        const container = document.getElementById('cutscene-container');
        container.classList.add('hidden');

        container.style.backgroundImage = "none";

        switch (activeCutscene.nextStep) {
            case "chapter_1":
                showScreen('garden-screen');
                break;
            case "chapter_2":
                showScreen('shooting-range');
                break;
            case "chapter_3":
                showScreen('choice-screen');
                break;
            case "chapter_4":
                showScreen('hotel-screen');
                break;
            case "chapter_5":
                showScreen('rob-home');
                break;
            default:
                showScreen('main-menu');
                break;
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
    for (let i = 0; i < diskRotations.length; i++) {
        const randomRot = Math.floor(Math.random() * 4) * 90;
        diskRotations[i] = randomRot;
        setDiskRotation(i, randomRot);
    }
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

// Genereert de tekstboxen voor de teksten
function showGardenMessage(message) {
    const feedback = document.getElementById('garden-feedback');
    const text = document.getElementById('garden-feedback-text');

    text.innerText = message;
    feedback.classList.remove('hidden');

    if (window.gardenTimeout) clearTimeout(window.gardenTimeout);

    window.gardenTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
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
        showGardenMessage("De schakeling is compleet. Het tuinhuisje-slot klikt open!");
        closeElectricalPuzzleOverlay();
    } else {
        showGardenMessage("De stroom vloeit nog niet door... Controleer de schakeling.");
    }
}

// Interactie met het tuinhuisje
function interactWithShed() {
    if (!shedIsUnlocked) {
        showGardenMessage("Mason Bourne: 'Slim zijn, zeg ik toch!'. Het slot zit erop.");
    } else {
        if (!playerHasShovel) {
            showGardenMessage("Je opent het tuinhuisje. Binnenin staat een schep!");
            playerHasShovel = true;
            gameState.inventory.push("Schep");
            saveGame();
        } else {
            showGardenMessage("Er is niets meer te vinden.");
        }
    }
}

// Graven
function interactWithDigSite() {
    if (!playerHasShovel) {
        showGardenMessage("Mason Bourne: Graven met je handen duurt te lang...");
    } else {
        const gardenView = document.getElementById('garden-view');
        if (gardenView) {
            gardenView.style.backgroundImage = "url('assets/tuin_open.png')";

            gardenView.style.backgroundSize = "cover";
            gardenView.style.backgroundPosition = "center";
        }

        showGardenMessage("Gefeliciteerd, je hebt je geweer!");
        gameState.inventory.push("Geladen Pistool");

        gameState.currentChapter = 2;
        saveGame();

        setTimeout(() => {
            playCutscene('na_geweer_vinden');
        }, 3000);
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
            gameState.currentChapter = 3;
            saveGame();
            playCutscene('na_schieten');
        }, 800);
    }
}


// Tunnel "keuze"
function showTunnelText() {
    const feedback = document.getElementById('choice-feedback');
    const text = document.getElementById('choice-feedback-text');

    text.innerText = "Daar ga ik verdwaald raken...";
    feedback.classList.remove('hidden');
    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

// Start de Club puzzel
function startClubPuzzle() {
    showScreen('strip-club');
    document.getElementById('unblock-puzzle-overlay').classList.remove('hidden');
}

// Initialisatie van de blokken
const levelConfig = [
    { id: 0, top: 320, left: 0, orientation: "horizontal_target" },
    { id: 1, top: 0, left: 160, orientation: "vertical_short" },
    { id: 2, top: 320, left: 320, orientation: "vertical_long" },
    { id: 3, top: 0, left: 480, orientation: "horizontal" },
    { id: 4, top: 160, left: 640, orientation: "vertical_short" },
    { id: 5, top: 160, left: 800, orientation: "vertical_long" },
    { id: 6, top: 480, left: 0, orientation: "horizontal" },
    { id: 7, top: 640, left: 480, orientation: "vertical_short" },
    { id: 8, top: 640, left: 640, orientation: "horizontal" },
    { id: 9, top: 800, left: 160, orientation: "horizontal" }
];

// Initialisatie van de game
function initClubPuzzle() {
    levelConfig.forEach(config => {
        const block = document.querySelector(`.block[data-id="${config.id}"]`);
        if (block) {
            block.style.top = (config.top + offsetMargin) + "px";
            block.style.left = (config.left + offsetMargin) + "px";
            block.dataset.orientation = config.orientation;
            block.onmousedown = startDrag;
        }
    });
}

// Controleer of twee blokken elkaar overlappen
function isOverlapping(rect1, rect2) {
    return !(rect1.right <= rect2.left ||
        rect1.left >= rect2.right ||
        rect1.bottom <= rect2.top ||
        rect1.top >= rect2.bottom);
}

// Functies voor het bewegen van de blokken
function drag(e) {
    if (!activeBlock) return;

    const grid = document.getElementById('unblock-grid').getBoundingClientRect();
    const oldLeft = parseInt(activeBlock.style.left);
    const oldTop = parseInt(activeBlock.style.top);
    let newLeft = Math.round((e.clientX - grid.left - offset.x - offsetMargin) / gridSize) * gridSize + offsetMargin;
    let maxLeft = 972 - activeBlock.offsetWidth;

    if (activeBlock.classList.contains('target')) {
        const winRowTop = 320 + offsetMargin;
        if (oldTop === winRowTop) {
            maxLeft = 1100;
        } else {
            maxLeft = 972 - activeBlock.offsetWidth;
        }
    }

    newLeft = Math.max(offsetMargin, Math.min(newLeft, maxLeft));

    let newTop = Math.round((e.clientY - grid.top - offset.y - offsetMargin) / gridSize) * gridSize + offsetMargin;
    const maxTop = 972 - activeBlock.offsetHeight;
    newTop = Math.max(offsetMargin, Math.min(newTop, maxTop));

    activeBlock.style.left = newLeft + "px";
    activeBlock.style.top = newTop + "px";

    if (hasCollision(activeBlock)) {
        activeBlock.style.left = oldLeft + "px";
        activeBlock.style.top = oldTop + "px";
    }

    checkClubWin();
}

function startDrag(e) {
    activeBlock = e.target;
    const rect = activeBlock.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;
    activeBlock.style.zIndex = "100";
    activeBlock.style.cursor = 'grabbing';
}

function endDrag() {
    if (activeBlock) {
        activeBlock.style.zIndex = "10";
        activeBlock.style.cursor = 'grab';
        activeBlock = null;
    }
}

// Functie voor de collision
function hasCollision(currentBlock) {
    const allBlocks = document.querySelectorAll('.block');
    const currentRect = currentBlock.getBoundingClientRect();

    for (let other of allBlocks) {
        if (other === currentBlock) continue;

        const otherRect = other.getBoundingClientRect();
        const margin = 1;
        const adjustedOther = {
            left: otherRect.left + margin,
            right: otherRect.right - margin,
            top: otherRect.top + margin,
            bottom: otherRect.bottom - margin
        };

        if (isOverlapping(currentRect, adjustedOther)) {
            return true;
        }
    }
    return false;
}

// Win check
function checkClubWin() {
    const target = document.querySelector('.block.target');
    const currentLeft = parseInt(target.style.left);
    const currentTop = parseInt(target.style.top);

    const winThreshold = 960;
    const targetRowTop = 320 + offsetMargin;

    if (currentLeft >= winThreshold && currentTop === targetRowTop) {
        if (!target.classList.contains('solved')) {
            target.classList.add('solved');
            activeBlock = null;
            setTimeout(() => {
                gameState.currentChapter = 4;
                saveGame();
                playCutscene('na_puzzel_club');
            }, 1000);
        }
    }
}

function showHotelMessage(message) {
    const feedback = document.getElementById('hotel-feedback');
    const text = document.getElementById('hotel-feedback-text');

    text.innerText = message || "Zonder kaart weet ik niet waar ik heen moet";
    feedback.classList.remove('hidden');

    if (window.hotelTimeout) clearTimeout(window.hotelTimeout);

    window.hotelTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

// Initialiseer het doolhof
let mazeCanvas, mazeCtx, mazeImg;
let playerPos = { x: 949, y: 154 };
const playerSize = 10;
const moveSpeed = 4;

function initMaze() {
    mazeCanvas = document.getElementById('maze-canvas');
    mazeCanvas.width = 1920;
    mazeCanvas.height = 1080;

    mazeCtx = mazeCanvas.getContext('2d', { willReadFrequently: true });

    mazeImg = new Image();
    mazeImg.src = 'assets/maze.png';
    mazeImg.onload = function () {
        drawMazeFrame();
        window.addEventListener('keydown', handleMazeMovement);
    };
}

function startMazePuzzle() {
    showScreen('maze-screen');
    document.getElementById('maze-canvas').classList.remove('hidden');
}

function drawMazeFrame() {
    if (!mazeCtx) return;

    mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    mazeCtx.drawImage(mazeImg, 0, 0, mazeCanvas.width, mazeCanvas.height);

    mazeCtx.beginPath();
    mazeCtx.arc(playerPos.x, playerPos.y, playerSize / 2, 0, Math.PI * 2);
    mazeCtx.fillStyle = "#891717";
    mazeCtx.fill();
    mazeCtx.closePath();
}

// Funcites voor het bewegen
function handleMazeMovement(e) {
    const key = e.key.toLowerCase();
    let nextX = playerPos.x;
    let nextY = playerPos.y;

    if (key === 'arrowup' || key === 'w') nextY -= moveSpeed;
    if (key === 'arrowdown' || key === 's') nextY += moveSpeed;
    if (key === 'arrowleft' || key === 'a') nextX -= moveSpeed;
    if (key === 'arrowright' || key === 'd') nextX += moveSpeed;

    if (canMove(nextX, nextY)) {
        playerPos.x = nextX;
        playerPos.y = nextY;
        drawMazeFrame();
        checkMazeWin();
    }
}

function canMove(x, y) {
    const r = playerSize / 2;
    const points = [
        { x: x, y: y - r }, { x: x, y: y + r },
        { x: x - r, y: y }, { x: x + r, y: y },
        { x: x - r, y: y - r }, { x: x + r, y: y - r },
        { x: x - r, y: y + r }, { x: x + r, y: y + r }
    ];

    for (let p of points) {
        if (p.y < 0 || p.y > 1080) return true;
        if (p.x < 0 || p.x > 1920) return false;

        const pixel = mazeCtx.getImageData(p.x, p.y, 1, 1).data;
        if (pixel[0] < 120 && pixel[1] < 120 && pixel[2] < 120 && pixel[3] > 0) {
            return false;
        }
    }
    return true;
}

// Win-ceck
function checkMazeWin() {
    const distToExit = Math.sqrt(
        Math.pow(playerPos.x - 973, 2) + Math.pow(playerPos.y - 928, 2)
    );

    if (distToExit < 5) {
        window.removeEventListener('keydown', handleMazeMovement);

        if (!gameState.inventory.includes("Kaart")) {
            gameState.inventory.push("Kaart");
        }
        showHotelMessage("Je hebt de kaart gevonden!");
        saveGame();

        setTimeout(() => {
            showScreen('hotel-screen')
        }, 1000);
    }
}

// Interactie met de hoteldeur
function interactWithHotelDoor() {
    const hasMap = gameState.inventory.includes("Kaart");

    if (hasMap) {
        const feedback = document.getElementById('hotel-feedback');
        feedback.classList.add('hidden');
        gameState.currentChapter = 5;
        saveGame();
        playCutscene('na_doolhof');

    } else {
        showHotelMessage("Zonder kaart weet ik niet waar ik heen moet");
    }
}

// Teksten Rob Huis
function showRobMessage(message) {
    const feedback = document.getElementById('rob-feedback');
    const text = document.getElementById('rob-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.robTimeout) clearTimeout(window.robTimeout);

    window.robTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

// Functies voor de eastereggs
function interactWithEBS() {
    gameState.inventory.includes('EBS');
    gameState.inventory.push('EBS');
    showRobMessage("Ik denk dat Rob voor deze partij gaat. Ze hebben wel goede standpunten.");
}

function interactWithPWS() {
    gameState.inventory.includes('PWS');
    gameState.inventory.push('PWS');
    showRobMessage("Dat zullen wel andere werken van Rob zijn. Een over een F1 auto en een over een operatierobot.");
}

function interactWithNuclear() {
    gameState.inventory.includes('Nuclear Receiver');
    gameState.inventory.push('Nuclear Receiver');
    showRobMessage("Ik denk dat Rob fan is van deze band. Ik zal ook eens kijken naar hun muziek.");
}

function interactWithRobDoor() {
    const hasEBS = gameState.inventory.includes("EBS");
    const hasPWS = gameState.inventory.includes("PWS");
    const hasNuclear = gameState.inventory.includes("Nuclear Receiver");

    if (hasEBS && hasPWS && hasNuclear) {
        gameState.currentChapter = 6;
        saveGame();
        playCutscene('na_huis')

    } else {
        showRobMessage("Ik denk niet dat Rob al klaar is. Eerst maar even rondkijken dan.")
    }
}

// Skip-knop zodat ik niet elke keer de hele game hoef te spelen
function devSkip() {

    const cutsceneContainer = document.getElementById('cutscene-container');
    if (!cutsceneContainer.classList.contains('hidden')) {
        currentCutsceneIndex = activeCutscene.steps.length - 1;
        nextCutsceneStep();
        return;
    }

    const electricalPuzzel = document.getElementById('garden-screen');
    if (electricalPuzzel && !electricalPuzzel.classList.contains('hidden')) {
        gameState.currentChapter = 2;
        gameState.inventory.push("Schep");
        gameState.inventory.push("Geladen Pistool");
        saveGame();
        playCutscene('na_geweer_vinden');
        return;
    }

    const shootingScreen = document.getElementById('shooting-range');
    if (shootingScreen && !shootingScreen.classList.contains('hidden')) {
        gameState.currentChapter = 3;
        saveGame();
        playCutscene('na_schieten');
        return;
    }

    const choiceScreen = document.getElementById('choice-screen');
    if (choiceScreen && !choiceScreen.classList.contains('hidden')) {
        startClubPuzzle();
        return;
    }

    const clubOverlay = document.getElementById('strip-club');
    if (clubOverlay && !clubOverlay.classList.contains('hidden')) {
        gameState.currentChapter = 4;
        saveGame();
        playCutscene('na_puzzel_club');
        return;
    }

    const hotelScreen = document.getElementById('hotel-screen');
    if (hotelScreen && !hotelScreen.classList.contains('hidden')) {
        window.removeEventListener('keydown', handleMazeMovement);
        gameState.currentChapter = 5;
        gameState.inventory.push("Kaart");
        saveGame()
        playCutscene('na_doolhof');
        return;
    }

    const mazeScreen = document.getElementById('maze-screen');
    if (mazeScreen && !mazeScreen.classList.contains('hidden')) {
        window.removeEventListener('keydown', handleMazeMovement);
        gameState.currentChapter = 5;
        gameState.inventory.push("Kaart");
        saveGame()
        playCutscene('na_doolhof');
        return;
    }

    const robScreen = document.getElementById('rob-home');
    if (robScreen && !robScreen.classList.contains('hidden')) {
        gameState.currentChapter = 6;
        gameState.inventory.push("PWS");
        gameState.inventory.push("EBS");
        gameState.inventory.push("Nuclear Receiver");
        saveGame()
        playCutscene('na_huis');
        return;
    }

    alert("Niets om hier te skippen!");
}

// Check save game bij laden van script
checkSaveGame();