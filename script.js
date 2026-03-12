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
    intro: {
        steps: [
            { gif: "assets/mason_jij.gif", speaker: "Mason Bourne", text: "Jij...", audio: "assets/jij.wav" },
            { gif: "assets/mason_jij.gif", speaker: "Mason Bourne", text: "JIJ...", audio: "assets/jij.wav" },
            { gif: "assets/mason_jij.gif", speaker: "Mason Bourne", text: "Jij  bent precies waar ik naar opzoek ben.", audio: "assets/jij-ben.wav" },
            { gif: "assets/mason_jij.gif", speaker: "Mason Bourne", text: "Maar, je moet jezelf wel eerst kunnen bewijzen. Als hitman moet je slim zijn en je omgeving kunnen gebruiken ten gunste van jezelf.", audio: "assets/maar-jezelf.wav" },
            { gif: "assets/tuin_dicht.png", speaker: "Mason Bourne", text: "In de tuin ligt een geladen pistool begraven. Gebruik je hersenen, dan praten we verder.", audio: "assets/in-verder.wav" }
        ],
        nextStep: "chapter_1"
    },

    na_geweer_vinden: {
        steps: [
            { gif: "assets/mason_buiten.gif", speaker: "Mason Bourne", text: "*klapt*", audio: "assets/klappen.wav" },
            { gif: "assets/mason_range.gif", speaker: "Mason Bourne", text: "Nou, één ding is zeker, in een gevecht zou je in ieder geval van mijn dode oma kunnen winnen.", audio: "assets/nou-winnen.wav" },
            { gif: "assets/mason_range.gif", speaker: "Mason Bourne", text: "Waar je daadwerkelijk het verschil maakt in dit vak is je schieten.", audio: "assets/waar-schieten.wav" },
            { gif: "assets/mason_range.gif", speaker: "Mason Bourne", text: "Kijk hier eens: dummies. Het neusje van de zalm.", audio: "assets/kijk-zalm.wav" },
            { gif: "assets/mason_range.gif", speaker: "Mason Bourne", text: "10 meter, 20 meter en 30 meter. Laat maar zien wat je kunt.", audio: "assets/10-kunt.wav" }
        ],
        nextStep: "chapter_2"
    },

    na_schieten: {
        steps: [
            { gif: "assets/mason_range.gif", speaker: "Mason Bourne", text: "Ik ben serieus onder de indruk, voor hoever dat kan met stilstaande doelen natuurlijk.", audio: "assets/ik-natuurlijk.wav" },
            { gif: "assets/mason_range.gif", speaker: "Mason Bourne", text: "Zeg, zou je morgen op een echt doelwit willen jagen?", audio: "assets/zeg-jagen.wav" },
            { gif: "assets/mason_range.gif", speaker: "John Vick", text: "YEAH!!", audio: "assets/yeah.wav" },
            { gif: "assets/bo.png", speaker: " ", text: "DAG 2..." },
            { gif: "assets/huis_mason.gif", speaker: "John Vick", text: "Ik ben beniewd naar mijn missie.", audio: "assets/ik-missie.wav" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Hallo John. Ben je klaar voor je eerste missie?", audio: "assets/hallo-missie.wav" },
            { gif: "assets/mason.gif", speaker: "John Vick", text: "Zeker.", audio: "assets/zeker.wav" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Iemand heeft mijn harde schijf met Jozef gestolen.", audio: "assets/iemand-getolen.wav" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Jij moet hem terug halen.", audio: "assets/jij-halen.wav" },
            { gif: "assets/mason.gif", speaker: "John Vick", text: "Weet je ook wie hem heeft gestolen?", audio: "assets/weet-gestolen.wav" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "We weten nog niet de naam van degene die je moet zoeken, maar we weten wel dat hij super klein is,", audio: "assets/we-is.wav" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "meestal spijkerbroeken draagt, veel bananen eet en een bril draagt.", audio: "assets/meestal-draagt.wav" },
            { gif: "assets/mason.gif", speaker: "John Vick", text: "Heb je nog meer info? Er zijn namelijk veel mensen die er zo uitzien.", audio: "assets/is-uitzien.wav" },
            { gif: "assets/mason.gif", speaker: "Mason Bourne", text: "Hij woont in Nederland en hij werkt bij ...", audio: "assets/hij-bij.wav" },
            { gif: "assets/tunnel_ingang.gif", speaker: "Mason Bourne", text: "WAT GEBEURT HIER?!?!", audio: "assets/wat-er.wav" },
            { gif: "assets/tunnel_ingang.gif", speaker: "Wachter", text: "WE WORDEN AANGEVALLEN! SNEL, NAAR DE GANGEN!", audio: "assets/we-aangevallen.wav" },
            { gif: "assets/tunnel_ingang.gif", speaker: "Mason Bourne", text: "VOLG MIJ, JOHN!", audio: "assets/volg-john.wav" },
            { gif: "assets/tunnel_ingang.gif", speaker: "John Vick", text: "IK ZIT VLAK ACHTER JE!", audio: "assets/ik-je.wav" },
            { gif: "assets/tunnel_binnen.png", speaker: "Mason Bourne", text: "Ga snel naar binnen! We moeten opsplitsen!", audio: "assets/ga-opsplitsen.wav" },
            { gif: "assets/tunnel_binnen.png", speaker: "Mason Bourne", text: "Ga naar dit adres en zoek Rob, hij heeft misschien meer informatie over wie het geeft gedaan! Succes!" },
        ],
        nextStep: "chapter_3"
    },

    na_puzzel_club: {
        steps: [
            { gif: "assets/stripclub.gif", speaker: "John Vick", text: "Laat ik maar naar een hotel gaan en morgen Rob opzoeken." },
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
            { gif: "assets/rob.gif", speaker: "John Vick", text: "Bedankt Rob. Ik ga terug naar mijn hotel en morgen ga ik direct achter hem aan." },
            { gif: "assets/hotel_john.png", speaker: " ", text: "John komt terug in zijn hotel." },
            { gif: "assets/bo.png", speaker: " ", text: "DAG 4..." },
            { gif: "assets/hotel_john.png", speaker: " ", text: "John wordt wakker en gaat naar Jantje." },
        ],
        nextStep: "chapter_6"
    },

    na_doodswens: {
        steps: [
            { gif: "assets/huis_jantje_buiten.png", speaker: "John Vick", text: "Hier woont Jantje. Ik moet hier binnen zien te komen." },
        ],
        nextStep: "chapter_7"
    },

    na_jantje: {
        steps: [
            { gif: "assets/huis_jantje_binnen.png", speaker: "John Vick", text: "Shit! Ik hoor iemand! Ik moet hier weg." },
            { gif: "assets/huis_jantje_binnen_no_gun.png", speaker: " ", text: "John pakt het wapen van de tafel." },
            { gif: "assets/huis_jantje_binnen_no_gun.png", speaker: " ", text: "Hij vlucht naar zijn auto en gaat naar een ander hotel." },
            { gif: "assets/bo.png", speaker: " ", text: "DAG 5..." },
            { gif: "assets/bo.png", speaker: "John Vick", text: "*gaapt*" },
            { gif: "assets/bo.png", speaker: " ", text: "*klik*" },
            { gif: "assets/bo.png", speaker: " ", text: "*klik*" },
            { gif: "assets/bo.png", speaker: " ", text: "*klik klik klik klik klik klik*" },
            { gif: "assets/bo.png", speaker: "John Vick", text: "Oh shit..." },
            { gif: "assets/ngd_hotel_kijken.gif", speaker: "John Vick", text: "De NGD!" },
            { gif: "assets/ngd_hotel_deur.gif", speaker: "John Vick", text: "Een elektronisch slot, niemand kan naar binnen of naar buiten..." },
        ],
        nextStep: "chapter_8"
    },

    na_touw: {
        steps: [
            { gif: "assets/touw_bewegend.gif", speaker: "John Vick", text: "Je moet wel gek zijn dit te doen." },
            { gif: "assets/touw_stilstaand.gif", speaker: "John Vick", text: "De olietruck gaat rijden!" },
            { gif: "assets/weg_achtervolging.gif", speaker: " ", text: "De NGD achtervolgt je! Schakel ze uit door op ze te schieten!" },

        ],
        nextStep: "chapter_9"
    },

    na_chase: {
        steps: [
            { gif: "assets/weg_achtervolging_lek.gif", speaker: " ", text: "Het laatste schot raakte de auto!" },
            { gif: "assets/weg_achtervolging_lek.gif", speaker: "John Vick", text: "HIJ GAAT PLOFFEN!" },
            { gif: "assets/greppel_dicht.png", speaker: " ", text: "John springt van de vrachtwagen af en belandt in een greppel." },
            { gif: "assets/greppel_dicht.png", speaker: "John Vick", text: "AAH, FUCK!" },
        ],
        nextStep: "chapter_10"
    },

    na_greppel: {
        steps: [
            { gif: "assets/greppel_open.png", speaker: " ", text: "De gereedschapskist breekt open en er zit een tang in! John gebruikt dit om het prikkeldraad van zijn been af te knippen." },
            { gif: "assets/greppel_draad.png", speaker: "John Vick", text: "Eindelijk dat prikkeldraad van mijn been af." },
            { gif: "assets/frederik_kwam.gif", speaker: "John Vick", text: "Ahh, nee! Niet de NGD!" },
            { gif: "assets/frederik_kwam.gif", speaker: "Frederick van der Heuvel", text: "Dus, meneertje Vick, u dacht zomaar bij agent Jantje Hoeksma in te kunnen breken en zijn geweer mee te nemen?" },
            { gif: "assets/frederik_zag.gif", speaker: "Frederick van der Heuvel", text: "Wat ik je nu ga zeggen is heel belangrijke informatie: Ons hoofdkwartier is zeer geheim, we zouden niet willen dat iemand weet waar het is, toch?" },
            { gif: "assets/frederik_overwon.gif", speaker: " ", text: "Frederick slaat John met een metalen pijp..." },
            { gif: "assets/bo.png", speaker: " ", text: " " },
            { gif: "assets/interrogatiekamer_dicht.gif", speaker: " ", text: " " },
            { gif: "assets/interrogatiekamer_open.gif", speaker: " ", text: " " },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "Victor van der Koning", text: "Victor van der Koning, hoofd van de NGD. John Vick, toch? Goeie naam voor een actieheld." },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "Victor van der Koning", text: "Jammer dat je je kansen hebt verspeeld door relaties met gangsterbaas Mason Bourne aan te gaan. Dat is een bekende naam bij de NGD:" },
            { gif: "assets/interrogatiekamer_victor_lezen.gif", speaker: "Victor van der Koning", text: "Drugssmokkel, moord, mensenhandel, aanslag tegen het rijk," },
            { gif: "assets/bo.png", speaker: "Victor van der Koning", text: "meerdere bankkraken, gijzeling, belastingfraude, witwassen..." },
            { gif: "assets/interrogatiekamer_victor_water.gif", speaker: "Victor van der Koning", text: "Wel bij de les blijven hè!" },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "Victor van der Koning", text: "Ik zal toegeven, ik had het liever met een natte doek op je hoofd gedaan, maar dat bewaren we wel voor zometeen." },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "Victor van der Koning", text: "Je bent ver gekomen John, jammer van de tracker op het geweer van Jantje Hoeksma." },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "Victor van der Koning", text: "De rest van Masons kartel is al gevangengenomen of vermoord, en Mason Bourne zelf zit ergens op een godvergeten boerderij in Brabant." },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "Victor van der Koning", text: "Aan jou nu de vraag, waar is deze boerderij?" },
            { gif: "assets/interrogatiekamer_victor.gif", speaker: "John Vick", text: "Ik weet het niet, meneer Van der Koning. Ik ben afgelopen dinsdag pas in dienst gegaan, ik kan u niks vertellen." },
            { gif: "assets/interrogatiekamer_assistent.gif", speaker: "Victor van der Koning", text: "Assistent! Breng mijn overtuigingsmateriaal!" },


        ],
        nextStep: "chapter_11"
    },

    na_torture: {
        steps: [
            { gif: "assets/bo.png", speaker: " ", text: "DAG 6..." },
        ],
        nextStep: "chapter_12"
    },

    na_victor: {
        steps: [
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "Victor van der Koning", text: "Lekker geslapen, John Vick?" },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "Victor van der Koning", text: "Aangezien je geen zwakte hebt voor onze traditionele methodes blijk je een uitstekende NGD-agent. Wat gaf Mason Bourne je om bij hem te werken?" },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "John Vick", text: "Vrijheid van corrupten zoals jullie." },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "Victor van der Koning", text: "Ik verzeker je, wij zijn niet zo corrupt als jullie denken. Wij beschermen alleen het land en de koninklijke familie." },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "John Vick", text: "De enige koning die jullie beschermen is Victor van der Koning. De rest van het geld gaat in jullie eigen zak." },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "Victor van der Koning", text: "Je gelooft die leugens toch niet?! Weet je wat, meneer Vick, ik heb een baan voor je. 10.000 euro per maand netto. Jouw vaardigheden als ex-huurmoordenaar kunnen wij zeker gebruiken." },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "Victor van der Koning", text: "Stel je voor: Het hele volk staat te kijken hoe je heldhaftig en nonchalant terroristen en oplichters oppakt. En daarna ga je naar je huis in Wassenaar om lekker te genieten van je Bourbon." },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "John Vick", text: "De grootste terrorist en oplichter staat recht voor mij." },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "Victor van der Koning", text: "10.000 euro! Stel je voor!" },
            { gif: "assets/interrogatiekamer_geen_pen.gif", speaker: "John Vick", text: "Nee! En ik blijf erbij! De moordende stelende frauduleuze drugbaas Mason Bourne zal altijd een eerlijker persoon zijn dan jij!" },
            { gif: "assets/pen_1.gif", speaker: " ", text: "" },
            { gif: "assets/pen_2.gif", speaker: " ", text: "" },
            { gif: "assets/pen_3.gif", speaker: " ", text: "" },
            { gif: "assets/gangen.gif", speaker: " ", text: "Je moet de 4 NGD-agenten doodschieten!" },
        ],
        nextStep: "chapter_13"
    },

    kantoor: {
        steps: [
            { gif: "assets/kantoor_1.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_2.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_3.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_4.png", speaker: "John Vick", text: "Natuurlijk, de klassieke tunnel achter de poster." },
            { gif: "assets/kantoor_5.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_6.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_7.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_8.png", speaker: "John Vick", text: "Geen klassiek trucje, maar wel een klassieker!" },
            { gif: "assets/kantoor_9.png", speaker: " ", text: " " },
            { gif: "assets/kantoor_10.gif", speaker: "John Vick", text: "Ze noemen me niet voor niets HITman!" },
            { gif: "assets/bo.png", speaker: "John Vick", text: "Dit moet de uitweg zijn!" },
            { gif: "assets/buiten.gif", speaker: "John Vick", text: "Het is tijd om naar huis te gaan." },
            { gif: "assets/bo.png", speaker: " ", text: " " },
            { gif: "assets/bo.png", speaker: " ", text: "DAG 7..." },
            { gif: "assets/mason_belt.gif", speaker: "Mason Bourne", text: "Hoor ik daar een nieuwe werknemer van de maand?!" },
            { gif: "assets/mason_belt.gif", speaker: "John Vick", text: "Weet je welke dag het is? Zondag." },
            { gif: "assets/mason_hangen.gif", speaker: "John Vick", text: "*hangt op*" },
        ],
        nextStep: "chapter_14"
    },

    na_shop: {
        steps: [
            { gif: "assets/pepper.gif", speaker: "John Vick", text: "Is deze nog te koop?" },
            { gif: "assets/shop.gif", speaker: "Winkeleigenaar", text: "Jazeker! Eindelijk genoeg geld bij elkaar John?" },
            { gif: "assets/shop.gif", speaker: "John Vick", text: "Nu wel." },
            { gif: "assets/shop.gif", speaker: "Winkeleigenaar", text: "Neem maar mee dan." },
            { gif: "assets/pepper.gif", speaker: "John Vick", text: "Hehehe, Pepper, eindelijk heb ik je! Ik zal ervoor zorgen dat jou nooit iets aangedaan wordt." },
            { gif: "assets/einde.gif", speaker: " ", text: "EINDE!" },
        ],
        nextStep: "chapter_15"
    }
}

// Laad het menu
window.onload = function () {
    showScreen('main-menu');
    document.getElementById('cutscene-container').classList.add('hidden');
    initClubPuzzle();
    initMaze();
    initShootingRange();
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
    playCutscene('intro');
    saveGame();
}

function startGameplay() {
    document.getElementById('cutscene-container').classList.add('hidden');
    showScreen('garden-screen');
}


// Slaat de huidige gameState op in de browser
function saveGame() {
    gameState.currentDamage = window.currentDamagePercent;
    localStorage.setItem('johnVickSave', JSON.stringify(gameState));
}

// Vertaalt de "Chapters" van de technische kant naar de "Dagen" van het script
function getDayDisplay(chapter) {
    if (chapter <= 2) return 1;
    if (chapter === 3) return 2;
    if (chapter <= 5) return 3;
    if (chapter <= 7) return 4;
    if (chapter <= 11) return 5;
    if (chapter <= 13) return 6;
    return 7;
}

// Laadt het spel vanuit de browser
function loadGame() {
    const savedData = localStorage.getItem('johnVickSave');

    if (savedData) {
        gameState = JSON.parse(savedData);
        if (gameState.currentDamage !== undefined) {
            updateGlobalDamage(gameState.currentDamage);
        }
        goToChapter(gameState.currentChapter);
    }
}

// Update de tekst in het hoofdmenu en het laadmenu
function checkSaveGame() {
    const savedData = localStorage.getItem('johnVickSave');
    const mainMenuLoadBtn = document.querySelector("button[onclick*='showScreen(\\'load-menu\\')']");
    const saveStatusText = document.getElementById('save-status-text');
    const executeLoadBtn = document.getElementById('execute-load-btn');

    if (savedData) {
        const data = JSON.parse(savedData);
        const dagNummer = getDayDisplay(data.currentChapter);

        if (mainMenuLoadBtn) {
            mainMenuLoadBtn.innerText = "LAAD SPEL (Dag " + dagNummer + ")";
        }

        if (saveStatusText) {
            saveStatusText.innerText = "Spel gevonden: Dag " + dagNummer;
        }

        if (executeLoadBtn) {
            executeLoadBtn.classList.remove('hidden');
            executeLoadBtn.innerText = "START DAG " + dagNummer;
        }
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

    if (step.audio) {
        playCutsceneAudio(step.audio);
    } else {
        playCutsceneAudio(null);
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
    }, 40);
}

function goToChapter(chapterNumber) {
    updateGlobalDamage(0);

    switch (chapterNumber) {
        case 1:
            showScreen('garden-screen');
            showGardenMessage('Mason Bourne: El Patrón, El Chapo, Al Capone, weet je wat ze gemeen hadden? Ze gebruikten hun hersens!');
            playCutsceneAudio('assets/el-hersens.wav')
            break;
        case 2:
            showScreen('shooting-range');
            break;
        case 3:
            showScreen('choice-screen');
            break;
        case 4:
            showScreen('hotel-screen');
            break;
        case 5:
            showScreen('rob-home');
            break;
        case 6:
            showScreen('highway-screen');
            startHighwayGame();
            break;
        case 7:
            showScreen('jantje-home');
            break;
        case 8:
            showScreen('NGD-hotel-screen');
            break;
        case 9:
            showScreen('chase-screen');
            currentSequenceIndex = 0;
            startChaseGame(chaseSequence[0]);
            break;
        case 10:
            showScreen('ditch-screen');
            let damageBefore = window.currentDamagePercent;
            if (damageBefore === 0 && gameState.currentDamage) {
                damageBefore = gameState.currentDamage;
            }
            let finalDamage = Number(damageBefore) + 20;
            if (finalDamage > 100) finalDamage = 100;
            updateGlobalDamage(finalDamage);
            break;
        case 11:
            showScreen('torture-screen');
            let currentVal = window.currentDamagePercent;
            if (currentVal > 40) {
                updateGlobalDamage(40);
            }
            break;
        case 12:
            showScreen('after-torture-screen');
            break;
        case 13:
            showScreen('building-screen');
            startAgentLogic();
            break;

        case 14:
            showScreen('shop-screen');
            updateGlobalDamage(0);
            break;
        case 15:
            showScreen('main-menu');
            break;
        default:
            showScreen('main-menu');
            break;
    }
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
        const chapterNum = parseInt(activeCutscene.nextStep.replace("chapter_", ""));
        playCutsceneAudio(null)
            ; goToChapter(chapterNum);
    }
}

let currentCutsceneAudio = null;

function playCutsceneAudio(file) {
    if (currentCutsceneAudio) {
        currentCutsceneAudio.pause();
        currentCutsceneAudio.currentTime = 0;
    }

    if (!file) {
        currentCutsceneAudio = null;
        return;
    }

    currentCutsceneAudio = new Audio(file);

    currentCutsceneAudio.play().catch(error => {
        console.error("Audio afspelen mislukt:", error);
    });
}

// Houdt de status van de speler bij
let playerHasShovel = false;
let shedIsUnlocked = false;
let currentDamagePercent = 0;
let toiletLights = {
    leftBroken: false,
    rightBroken: false
};

// Houdt de rotatie van de 8 schijven bij
let diskRotations = [0, 0, 0, 0, 0, 0, 0, 0];

// Maakt de overlays/cursors werkend
let previousDamagePercent = 0;

function updateGlobalDamage(percent) {
    percent = Math.max(0, Math.min(100, Math.round(percent)));

    window.currentDamagePercent = percent;
    currentDamagePercent = percent;

    const overlay = document.getElementById('global-damage-overlay');
    const retryBtn = document.getElementById('retry-button');
    const body = document.body;

    if (!overlay) return;
    if (percent > (window.previousDamagePercent || 0) && percent > 0) {
        body.classList.remove('damage-shake');
        void body.offsetWidth;
        body.classList.add('damage-shake');
        setTimeout(() => body.classList.remove('damage-shake'), 400);
    }
    window.previousDamagePercent = percent;

    const visualLevel = Math.floor(percent / 20) * 20;

    if (percent === 0) {
        overlay.classList.remove('active');
        overlay.style.backgroundImage = 'none';
        body.style.setProperty('cursor', "url('assets/cursor_0.gif') 16 16, auto", 'important');
        if (retryBtn) retryBtn.classList.add('hidden');
    } else {
        overlay.classList.add('active');

        overlay.style.backgroundImage = `url('assets/overlay_${visualLevel}.gif')`;
        body.style.setProperty('cursor', `url('assets/cursor_${visualLevel}.gif') 16 16, auto`, 'important');

        if (percent < 100 && retryBtn) {
            retryBtn.classList.add('hidden');
        }
    }

    if (percent >= 100) {

        if (typeof carsActive !== 'undefined') {
            Object.keys(carsActive).forEach(id => {
                if (carsActive[id].interval) clearInterval(carsActive[id].interval);
                carsActive[id].active = false;
            });
        }

        if (retryBtn) {
            retryBtn.classList.remove('hidden');
            retryBtn.style.pointerEvents = 'auto';
        }
    }
}

function resetGameToMenu() {
    const retryBtn = document.getElementById('retry-button');
    if (retryBtn) retryBtn.classList.add('hidden');
    updateGlobalDamage(0);
    showScreen('main-menu');
}

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
    const gardenView = document.getElementById('garden-view');
    if (!shedIsUnlocked) {
        showGardenMessage("Mason Bourne: 'Slim zijn, zeg ik toch!'. Het slot zit erop.");
    } else {
        if (!playerHasShovel) {
            gardenView.style.backgroundImage = "url('assets/tuin_dicht_schep.png')";
            gardenView.style.backgroundSize = "cover";
            gardenView.style.backgroundPosition = "center";

            setTimeout(() => {
                gardenView.style.backgroundImage = "url('assets/tuin_dicht_geen_schep.png')";
                gardenView.style.backgroundSize = "cover";
                gardenView.style.backgroundPosition = "center";
                playerHasShovel = true;
                if (!gameState.inventory.includes("Schep")) {
                    gameState.inventory.push("Schep");
                }
                saveGame();
            }, 1500);
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
            gardenView.style.backgroundImage = "url('assets/tuin_open_pistool.png')";
            gardenView.style.backgroundSize = "cover";
            gardenView.style.backgroundPosition = "center";
            showGardenMessage("Gefeliciteerd, je hebt je geweer!");
        }

        setTimeout(() => {
            gardenView.style.backgroundImage = "url('assets/tuin_open_geen_pistool.png')";
            gardenView.style.backgroundSize = "cover";
            gardenView.style.backgroundPosition = "center";
            gameState.inventory.push("Geladen Pistool");
            gameState.currentChapter = 2;
            saveGame();
        }, 1500);

        setTimeout(() => {
            playCutscene('na_geweer_vinden');
        }, 3000);
    }
}



// Schieten op de dummies
function initShootingRange() {
    setTimeout(() => {
        const dummies = document.querySelectorAll('.dummy');

        dummies.forEach(dummy => {
            dummy.classList.remove('hit');

            dummy.style.backgroundImage = "";

            if (dummy.classList.contains('large')) {
                dummy.style.backgroundImage = "url('assets/dummy_large.gif')";
            } else if (dummy.classList.contains('medium')) {
                dummy.style.backgroundImage = "url('assets/dummy_medium.gif')";
            } else if (dummy.classList.contains('small')) {
                dummy.style.backgroundImage = "url('assets/dummy_small.gif')";
            }

            dummy.onclick = function (e) {
                e.stopPropagation();
                shootDummy(this);
            };
        });
    }, 50);
}

function shootDummy(element) {
    if (element.classList.contains('hit')) return;

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
function showTunnelMessage(message) {
    const feedback = document.getElementById('choice-feedback');
    const text = document.getElementById('choice-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.tunnelTimeout) clearTimeout(window.tunnelTimeout);

    window.tunnelTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function interactWithDoor() {
    const hasLock = gameState.inventory.includes("Slot");

    if (hasLock) {
        const feedback = document.getElementById('choice-feedback');
        feedback.classList.add('hidden');
        gameState.currentChapter = 4;
        saveGame();
        playCutscene('na_puzzel_club');

    } else {
        showTunnelMessage("Het slot zit er op...");
        startClubPuzzle();
    }
}

// Start de Club puzzel
function startClubPuzzle() {
    showScreen('strip-club');
    document.getElementById('unblock-grid').classList.remove('hidden');
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

    const isHorizontal = activeBlock.offsetWidth > activeBlock.offsetHeight;

    if (isHorizontal) {
        let newLeft = Math.round((e.clientX - grid.left - offset.x - offsetMargin) / gridSize) * gridSize + offsetMargin;
        let maxLeft = 972 - activeBlock.offsetWidth;

        if (activeBlock.classList.contains('target')) {
            const winRowTop = 320 + offsetMargin;
            if (oldTop === winRowTop) {
                maxLeft = 1100;
            }
        }

        newLeft = Math.max(offsetMargin, Math.min(newLeft, maxLeft));

        activeBlock.style.left = newLeft + "px";
        activeBlock.style.top = oldTop + "px";

    } else {
        let newTop = Math.round((e.clientY - grid.top - offset.y - offsetMargin) / gridSize) * gridSize + offsetMargin;
        const maxTop = 972 - activeBlock.offsetHeight;

        newTop = Math.max(offsetMargin, Math.min(newTop, maxTop));

        activeBlock.style.top = newTop + "px";
        activeBlock.style.left = oldLeft + "px";
    }

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
}

function endDrag() {
    if (activeBlock) {
        activeBlock.style.zIndex = "10";
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
                gameState.inventory.push('Slot');
                saveGame();
                showScreen('choice-screen');
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

// Doodswens
let highwayCanvas, ctx;
let highwayActive = false;
let highwayTime = 90;
let highwayTimerInterval;
let traffic = [];
let keys = {};
let isInvincible = false;

const allLanes = [
    103, 213, 323, 433,
    605, 715, 825, 935,
];

const bgImg = new Image();
bgImg.src = 'assets/weg.png';
let bgX = 0;
const scrollSpeed = 4;

const carTypes = [
    { color: 'green', speed: 8 },
    { color: 'yellow', speed: 12 },
    { color: 'blue', speed: 16 },
    { color: 'purple', speed: 20 }
];

let currentLaneIndex = 5;
const player = {
    x: 200,
    y: allLanes[5],
    width: 160,
    height: 56,
    speed: 16,
    color: 'red'
};

let canMoveVertical = true;
let canMoveHorizontal = true;

const carImages = {};
const colors = ['red', 'green', 'yellow', 'blue', 'purple'];
colors.forEach(color => {
    carImages[color] = new Image();
    carImages[color].src = `assets/car_${color}.gif`;
});

function showHighwayMessage(message) {
    const feedback = document.getElementById('highway-feedback');
    const text = document.getElementById('highway-feedback-text');

    text.innerText = message;
    feedback.classList.remove('hidden');

    if (window.highwayTimeout) clearTimeout(window.highwayTimeout);

    window.highwayTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function startHighwayGame() {
    const screen = document.getElementById('highway-screen');
    if (screen) screen.classList.remove('hidden');

    highwayCanvas = document.getElementById('highway-canvas');
    highwayCanvas.width = 1920;
    highwayCanvas.height = 1080;
    ctx = highwayCanvas.getContext('2d');

    highwayActive = true;
    highwayTime = 90;
    traffic = [];
    currentLaneIndex = 5;
    player.x = 200;
    player.y = allLanes[currentLaneIndex];

    if (!window.highwayInputAdded) {
        window.addEventListener('keydown', (e) => keys[e.code] = true);
        window.addEventListener('keyup', (e) => keys[e.code] = false);
        window.highwayInputAdded = true;
    }

    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) timerDisplay.innerText = `TIJD OVER: ${highwayTime}s`;

    clearInterval(highwayTimerInterval);
    highwayTimerInterval = setInterval(() => {
        if (!highwayActive) return;
        highwayTime--;
        if (timerDisplay) timerDisplay.innerText = `TIJD OVER: ${highwayTime}s`;
        if (highwayTime <= 0) finishHighway(true);
    }, 1000);

    spawnTraffic();
    requestAnimationFrame(updateHighway);
}

function updateHighway() {
    if (!highwayActive) return;

    ctx.clearRect(0, 0, 1920, 1080);

    bgX -= scrollSpeed;
    if (bgX <= -1920) {
        bgX = 0;
    }

    if (bgImg.complete) {
        ctx.drawImage(bgImg, bgX, 0, 1920, 1080);
        ctx.drawImage(bgImg, bgX + 1920, 0, 1920, 1080);
    }

    if (canMoveVertical) {
        if (keys['KeyW'] || keys['ArrowUp']) {
            if (currentLaneIndex > 0) {
                currentLaneIndex--;
                player.y = allLanes[currentLaneIndex];
                lockVertical();
            }
        } else if (keys['KeyS'] || keys['ArrowDown']) {
            if (currentLaneIndex < allLanes.length - 1) {
                currentLaneIndex++;
                player.y = allLanes[currentLaneIndex];
                lockVertical();
            }
        }
    }

    if (canMoveHorizontal) {
        if (keys['KeyA'] || keys['ArrowLeft']) if (player.x > 20) player.x -= player.speed;
        if (keys['KeyD'] || keys['ArrowRight']) if (player.x < 1740) player.x += player.speed;
    }

    for (let i = traffic.length - 1; i >= 0; i--) {
        let car = traffic[i];

        car.x += car.speed;

        const img = carImages[car.color];
        if (img && img.complete) {
            if (car.speed < 0) {
                ctx.save();
                ctx.translate(car.x + car.width, car.y);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, car.width, car.height);
                ctx.restore();
            } else {
                ctx.drawImage(img, car.x, car.y, car.width, car.height);
            }
        }

        if (!isInvincible) {
            if (player.x + 15 < car.x + car.width - 15 &&
                player.x + player.width - 15 > car.x + 15 &&
                player.y + 5 < car.y + car.height - 5 &&
                player.y + player.height - 5 > car.y + 5) {
                finishHighway(false);
            }
        }

        if (car.x < -500 || car.x > 2500) traffic.splice(i, 1);
    }

    const pImg = carImages.red;
    if (pImg && pImg.complete) {
        ctx.drawImage(pImg, player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(updateHighway);
}

function spawnTraffic() {
    if (!highwayActive) return;

    const laneIdx = Math.floor(Math.random() * allLanes.length);
    const isTop = laneIdx < 4;
    const type = carTypes[Math.floor(Math.random() * carTypes.length)];

    traffic.push({
        x: isTop ? 2000 : -200,
        y: allLanes[laneIdx],
        width: 160,
        height: 56,
        speed: isTop ? -type.speed : type.speed,
        color: type.color
    });

    let nextSpawnTime;

    if (highwayTime > 60) {
        nextSpawnTime = Math.random() * 300 + 300;
    } else if (highwayTime > 30) {
        nextSpawnTime = Math.random() * 200 + 200;
    } else {
        nextSpawnTime = Math.random() * 100 + 100;
    }
    setTimeout(spawnTraffic, nextSpawnTime);

    if (highwayTime === 60 || highwayTime === 30) showHighwayMessage('Het wordt drukker!');
}

function lockVertical() {
    canMoveVertical = false;
    setTimeout(() => { canMoveVertical = true; }, 150);
}

function lockHorizontal() {
    canMoveHorizontal = false;
    setTimeout(() => { canMoveVertical = true; }, 150);
}

function finishHighway(success) {
    if (success) {
        highwayActive = false;
        clearInterval(highwayTimerInterval);
        showHighwayMessage('Je bent veilig aangekomen bij Jantje!');
        gameState.currentChapter = 7;
        saveGame();
        setTimeout(() => playCutscene('na_doodswens'), 1500);
    } else {
        handleCrash();
    }
}

function handleCrash() {
    if (isInvincible) return;

    isInvincible = true;
    canMoveVertical = false;
    canMoveHorizontal = false;
    highwayTime += 3;

    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.innerText = `TIJD OVER: ${highwayTime}s`;
        timerDisplay.style.color = "red";
        setTimeout(() => timerDisplay.style.color = "white", 500);
    }

    showHighwayMessage('Gecrasht! 3 seconden straftijd...');

    setTimeout(() => {
        canMoveVertical = true;
        canMoveHorizontal = true;
        isInvincible = false;
        const feedbackBtn = document.getElementById('highway-feedback');
        if (feedbackBtn) {
            feedbackBtn.classList.add('hidden');
        }
    }, 2000);
}

// Jantje's huis
function showJantjeMessage(message) {
    const feedback = document.getElementById('jantje-feedback');
    const text = document.getElementById('jantje-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.jantjeTimeout) clearTimeout(window.jantjeTimeout);

    window.jantjeTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}


function interactWithPlant() {
    const jantjeView = document.getElementById('jantje-view')
    jantjeView.style.backgroundImage = "url('assets/huis_jantje_buiten_key.png')";
    showJantjeMessage("Typisch...");
    jantjeView.style.backgroundSize = "cover";
    jantjeView.style.backgroundPosition = "center";

    setTimeout(() => {
        jantjeView.style.backgroundImage = "url('assets/huis_jantje_buiten_no_key.png')";
        jantjeView.style.backgroundSize = "cover";
        jantjeView.style.backgroundPosition = "center";
        playerHasKey = true;
        gameState.inventory.includes('Sleutel');
        gameState.inventory.push('Sleutel');
        saveGame();
    }, 1500);
}

function interactWithJantjeDoor() {
    const hasKey = gameState.inventory.includes("Sleutel");

    if (hasKey) {
        saveGame();
        showScreen('jantje-binnen');

    } else {
        showJantjeMessage("Er moet een manier zijn binnen te komen")
    }
}

function showJantjeBMessage(message) {
    const feedback = document.getElementById('jantje-binnen-feedback');
    const text = document.getElementById('jantje-binnen-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.jantjeBTimeout) clearTimeout(window.jantjeBTimeout);

    window.jantjeBTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function showJantjeLaptopMessage(message) {
    const feedback = document.getElementById('jantje-laptop-feedback');
    const text = document.getElementById('jantje-laptop-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.jantjeLaptopTimeout) clearTimeout(window.jantjeLaptopTimeout);

    window.jantjeLaptopTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 5000);
}

function interactWithLaptop() {
    gameState.inventory.includes('Laptop');
    gameState.inventory.push('Laptop');
    saveGame();
    showScreen('jantje-laptop');
    showJantjeLaptopMessage("Om dit soort informatie op deze manier te delen moeten die Victor en Jantje wel hele goede vrienden zijn geweest.");
}

function interactWithScreen() {
    showScreen('jantje-binnen');
    setTimeout(() => {
        gameState.currentChapter = 8;
        saveGame();
        playCutscene('na_jantje')
    }, 3000)

}

//NGD-scenes
function showMagazineMessage(message) {
    const feedback = document.getElementById('magazines-feedback');
    const text = document.getElementById('magazines-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.magazinesTimeout) clearTimeout(window.magazinesTimeout);

    window.magazinesTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function interactWithCurtain() {
    const NGDView = document.getElementById('NGD-hotel-screen-view');
    const curtainView = document.getElementById('curtain-click');
    NGDView.style.backgroundImage = "url('assets/ngd_hotel_open.png')";
    NGDView.style.backgroundSize = "cover";
    NGDView.style.backgroundPosition = "center";
    curtainView.style.zIndex = 1;
}

function interactWithWindow() {
    gameState.currentChapter = 9;
    saveGame();
    playCutscene('na_touw');
}

function interactWithLady() {
    const LadyView = document.getElementById('lady-click');
    LadyView.style.zIndex = 50;
    showMagazineMessage('Hmm, deze bladzijden lijken wel aan elkaar vastgeplakt.')
}

function interactWithHoogeblad() {
    const HoogebladView = document.getElementById('hoogeblad-click');
    const MagazinesView = document.getElementById('magazines-view');
    HoogebladView.style.zIndex = 75;
    MagazinesView.style.backgroundImage = "url('assets/magazines_hoogeblad.png')";
    setTimeout(() => {
        MagazinesView.style.backgroundImage = "url('assets/magazines.png')";
    }, 2000)
}

function interactWithManual() {
    const ManualView = document.getElementById('manual-click');
    const MagazinesView = document.getElementById('magazines-view');
    ManualView.style.zIndex = 25;
    MagazinesView.style.backgroundImage = "url('assets/magazines_handboek.png')";
    setTimeout(() => {
        MagazinesView.style.backgroundImage = "url('assets/magazines.png')";
    }, 7500)
}

//Chase-scene
let currentSequenceIndex = 0;
const chaseSequence = [
    { type: 'single' },
    { type: 'single' },
    { type: 'double' },
    { type: 'double' }
];

let carsActive = {
    1: { driverAlive: true, passengerAlive: true, active: false, interval: null },
    2: { driverAlive: true, passengerAlive: true, active: false, interval: null }
};

const policeImages = {
    bothAlive: 'assets/car_both.gif',
    driverOnly: 'assets/car_driver_only.gif',
    passengerOnly: 'assets/car_passenger_only.gif',
    bothDead: 'assets/car_both_dead.gif'
};

function startChaseGame(wave) {
    const screen = document.getElementById('chase-screen');
    screen.classList.remove('hidden');

    resetCarStatus(1);
    resetCarStatus(2);

    const container1 = document.getElementById('chase-container-1');
    const container2 = document.getElementById('chase-container-2');

    if (wave.type === 'single') {
        container1.className = 'chase-container pos-center';
        container2.classList.add('hidden');
        initiateVehicle(1);
    } else if (wave.type === 'double') {
        container1.className = 'chase-container pos-left';
        container2.className = 'chase-container pos-right';
        container2.classList.remove('hidden');
        initiateVehicle(1);
        initiateVehicle(2);
    }
}

function initiateVehicle(id) {
    const container = document.getElementById(`chase-container-${id}`);
    carsActive[id].active = true;

    updateCarImg(id);

    setTimeout(() => {
        container.classList.remove('retreating');
        container.classList.add('approaching');

        setTimeout(() => startAgentShooting(id), 750);
    }, 50);
}

function startAgentShooting(id) {
    if (carsActive[id].interval) clearInterval(carsActive[id].interval);

    carsActive[id].interval = setInterval(() => {
        const car = carsActive[id];

        if (car.active && car.passengerAlive) {
            if (Math.random() < 0.25) {
                let newDamage = currentDamagePercent + 20;
                if (newDamage > 100) newDamage = 100;
                updateGlobalDamage(newDamage);

                const overlay = document.getElementById('global-damage-overlay');
                setTimeout(() => overlay.style.backgroundColor = "transparent", 100);
            }
        } else {
            clearInterval(carsActive[id].interval);
        }
    }, 2000);
}

function shootAgent(carId, role) {
    const car = carsActive[carId];
    if (!car.active) return;
    if (role === 'driver') {
        car.driverAlive = false;
    } else {
        car.passengerAlive = false;
    }

    updateCarImg(carId);

    if (!car.driverAlive) {
        car.active = false;
        if (car.interval) clearInterval(car.interval);

        const container = document.getElementById(`chase-container-${carId}`);

        container.classList.remove('approaching');

        void container.offsetWidth;

        container.classList.add('retreating');

        checkWaveProgress();
    }
}

function updateCarImg(id) {
    const imgDiv = document.getElementById(`police-car-img-${id}`);
    const car = carsActive[id];

    let imgUrl = policeImages.bothAlive;

    if (car.driverAlive && !car.passengerAlive) {
        imgUrl = policeImages.driverOnly;
    }
    else if (!car.driverAlive && car.passengerAlive) {
        imgUrl = policeImages.passengerOnly;
    }
    else if (!car.driverAlive && !car.passengerAlive) {
        imgUrl = policeImages.bothDead;
    }

    imgDiv.style.backgroundImage = `url('${imgUrl}')`;
}

function checkWaveProgress() {
    const allCarsDown = !carsActive[1].active && !carsActive[2].active;

    if (allCarsDown) {
        setTimeout(() => {
            currentSequenceIndex++;
            if (currentSequenceIndex < chaseSequence.length) {
                startChaseGame(chaseSequence[currentSequenceIndex]);
            } else {
                gameState.currentChapter = 10;
                saveGame();
                playCutscene('na_chase');
            }
        }, 3000);
    }
}

function resetCarStatus(id) {
    carsActive[id].driverAlive = true;
    carsActive[id].passengerAlive = true;
    carsActive[id].active = false;
    if (carsActive[id].interval) {
        clearInterval(carsActive[id].interval);
        carsActive[id].interval = null;
    }

    const container = document.getElementById(`chase-container-${id}`);
    if (container) container.classList.remove('approaching', 'retreating');
}

// Greppel
function showDitchMessage(message) {
    const feedback = document.getElementById('ditch-feedback');
    const text = document.getElementById('ditch-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.ditchTimeout) clearTimeout(window.ditchTimeout);

    window.ditchTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function interactWithToolbox() {
    const hasCrowbar = gameState.inventory.includes("Crowbar");

    if (hasCrowbar) {
        gameState.currentChapter = 11;
        saveGame();
        playCutscene('na_greppel')

    } else {
        showDitchMessage("Hmm, deze zit op slot.")
    }
}

function interactWithCrowbar() {
    const ditchView = document.getElementById('ditch-screen-view');
    ditchView.style.backgroundImage = "url('assets/greppel_dicht_no_crowbar.png')";;
    gameState.inventory.includes('Crowbar');
    gameState.inventory.push('Crowbar');
}

// Torture!!
function showTortureMessage(message) {
    const feedback = document.getElementById('torture-feedback');
    const text = document.getElementById('torture-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.tortureTimeout) clearTimeout(window.tortureTimeout);

    window.tortureTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 10000);
}

function interactWithElectrocution() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/electro_1.gif')";

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/electro_2.gif')";
        document.body.classList.add('rumble-effect');
        let damageBefore = window.currentDamagePercent;

        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 1000)

    setTimeout(() => {
        showTortureMessage('Victor: ZEG HET!');
    }, 4000)

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;

        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 6000)

    setTimeout(() => {
        document.body.classList.remove('rumble-effect');
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 8500)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 10500)
}

function interactWithWaterboard() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/water_1.gif')";
    document.body.classList.add('heavy-rumble-effect');

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/water_2.gif')";
        document.body.classList.remove('heavy-rumble-effect');
        document.body.classList.add('rumble-effect');
    }, 1500)

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;
        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 7500)

    setTimeout(() => {
        document.body.classList.remove('rumble-effect');
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 14500)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 16500)
}

function interactWithWrench() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/wrench_1.gif')";

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/wrench_2.gif')";
    }, 1000)

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;
        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 2000)

    setTimeout(() => {
        showTortureMessage('Victor: ZEG HET!');
    }, 2500)

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;
        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 4500)

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 8000)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 10000)
}

function interactWithTax() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/tax.gif')";

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;
        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 40;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 1000)

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 3000)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 5000)
}

function interactWithKnife() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/knife_1.gif')";

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/knife_2.gif')";
    }, 500)

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;
        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 1500)

    setTimeout(() => {
        let damageBefore = window.currentDamagePercent;
        if (damageBefore === 0 && gameState.currentDamage) {
            damageBefore = gameState.currentDamage;
        }

        let finalDamage = Number(damageBefore) + 20;
        if (finalDamage > 100) finalDamage = 100;
        updateGlobalDamage(finalDamage);
    }, 3500)


    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 5500)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 7500)
}

function interactWithUSB() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/usb_1.gif')";
    showTortureMessage('Victor: O Hemeltje, ik heb hier wel een hele dappere man voor mij zitten. Weet je, ik ga je een gunst doen, puur omdat ik het niemand gun om zijn LO PO terug te zien.')

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/usb_2.gif')";
    }, 10500)


    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 11000)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 13000)
}

function interactWithChromebook() {
    const tortureView = document.getElementById('torture-screen-view');
    tortureView.style.backgroundImage = "url('assets/chromebook.gif')";
    showTortureMessage('Silvius: Welkom, John Vick bij het blokuur wiskunde via Microsoft Teams. We beginnen met parabolen. En om dat te demonstreren...')

    setTimeout(() => {
        tortureView.style.backgroundImage = "url('assets/bo.png')";
    }, 10050)

    setTimeout(() => {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
    }, 12050)
}

function interactWithPen() {
    gameState.currentChapter = 13;
    saveGame();
    playCutscene('na_victor')
}

// Schietoefening in de gangen
let agents = {
    arnold: { alive: true, behavior: 'static', elementId: 'agent-arnold' },
    gertjan: { alive: true, behavior: 'static', elementId: 'agent-gertjan' },
    diederik: { alive: true, behavior: 'static', elementId: 'agent-diederik' },
    kevin: { alive: true, behavior: 'cover', elementId: 'agent-kevin', isCovered: false }
};

function startAgentLogic() {
    startEnemyFire();
    const kevin = agents.kevin;
    const kevinEl = document.getElementById(kevin.elementId);
    let timer = 0;

    function syncKevin() {
        if (!kevin.alive) return;

        timer++;

        if (timer <= 2) {
            kevin.isCovered = false;

            if (timer === 1 && kevinEl) {
                const timestamp = new Date().getTime();
                kevinEl.style.backgroundImage = `url('assets/kevin.gif?t=${timestamp}')`;
            }
        } else {
            kevin.isCovered = true;
            timer = 0;
        }
    }

    syncKevin();
    const kevinInterval = setInterval(() => {
        if (!kevin.alive) {
            clearInterval(kevinInterval);
            return;
        }
        syncKevin();
    }, 1000);
}

function shootAgent(name) {
    const agent = agents[name];

    if (!agent.alive) return;

    if (agent.behavior === 'cover' && agent.isCovered) {
        return;
    }

    agent.alive = false;
    const el = document.getElementById(agent.elementId);

    if (el) {
        el.style.pointerEvents = 'none';

        if (name === 'kevin') {
            el.style.backgroundImage = "url('assets/kevin_dead.png')";
            el.classList.add('dead');
            el.classList.remove('in-cover');
        } else {
            el.classList.add('dead');
        }
    }

    checkAllAgentsDead();
}

function checkAllAgentsDead() {
    const allDead = Object.values(agents).every(a => !a.alive);

    if (allDead) {
        stopEnemyFire();
        const allAgentElements = document.querySelectorAll('.agent');
        allAgentElements.forEach(el => {
            el.classList.add('fade-out');
        });

        setTimeout(() => {
            document.getElementById('office-click').classList.add('doors-active');
            document.getElementById('toilet-click').classList.add('doors-active');
            document.getElementById('conference-click').classList.add('doors-active');
        }, 2500);
    }
}

let enemyFireInterval = null;

function startEnemyFire() {
    if (enemyFireInterval) return;

    enemyFireInterval = setInterval(() => {
        let hits = 0;

        Object.values(agents).forEach(a => {
            if (a.alive && Math.random() < 0.10) hits++;
        });

        Object.values(officeAgents).forEach(a => {
            if (a.alive && Math.random() < 0.10) hits++;
        });

        if (hits > 0) {
            let currentDamage = window.currentDamagePercent || 0;
            let newDamage = currentDamage + (hits * 20);

            updateGlobalDamage(newDamage);

            if (newDamage >= 100) {
                clearInterval(enemyFireInterval);
                enemyFireInterval = null;
            }
        }
    }, 1000);
}

function stopEnemyFire() {
    clearInterval(enemyFireInterval);
    enemyFireInterval = null;
}

// deuren in het gebouw
function showBuildingMessage(message) {
    const feedback = document.getElementById('building-feedback');
    const text = document.getElementById('building-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.buildingTimeout) clearTimeout(window.buildingTimeout);

    window.buildingTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function interactWithOfficeDoor() {
    const hasKeychain = gameState.inventory.includes("Sleutelbos");
    const buildingView = document.getElementById('building-screen-view');
    if (hasKeychain) {
        buildingView.style.backgroundImage = "url('assets/kantoor_1.png')";
        document.querySelectorAll('.door-zone').forEach(d => d.classList.remove('doors-active'));
        setTimeout(() => {
            gameState.currentChapter = 14;
            saveGame();
            playCutscene('kantoor');
        }, 2000);
    } else {
        showBuildingMessage("De deur zit op slot...")
    }
}

function interactWithToiletDoor() {
    const hasCode = gameState.inventory.includes("Code");
    const buildingView = document.getElementById('building-screen-view');
    if (hasCode) {
        showBuildingMessage("???: Oké, oké, ik vertel het! De code voor de vergaderruimte is 20153.");
    } else {
        buildingView.style.backgroundImage = "url('assets/toiletten.png')";
        document.querySelectorAll('.door-zone').forEach(d => d.classList.remove('doors-active'));
        document.getElementById('toilet-hallway-click').classList.add('doors-active');
        document.getElementById('light-left-click').classList.add('doors-active');
        document.getElementById('light-right-click').classList.add('doors-active');
        updateToiletBackground();

    }
}

function shootToiletLight(side) {
    if (side === 'left') toiletLights.leftBroken = true;
    if (side === 'right') toiletLights.rightBroken = true;

    updateToiletBackground();
}

function updateToiletBackground() {
    const buildingView = document.getElementById('building-screen-view');

    if (toiletLights.leftBroken && toiletLights.rightBroken) {
        buildingView.style.backgroundImage = "url('assets/toiletten_beide.png')";
        showBuildingMessage("???: Oké, oké, ik vertel het! De code voor de vergaderruimte is 20153.");
        gameState.inventory.push('Code');
    }
    else if (toiletLights.leftBroken || toiletLights.rightBroken) {
        if (toiletLights.leftBroken) {
            buildingView.style.backgroundImage = "url('assets/toiletten_links.png')";
        } else {
            buildingView.style.backgroundImage = "url('assets/toiletten_rechts.png')";
        }

        showBuildingMessage("???: AAAh!");
    }
    else {
        buildingView.style.backgroundImage = "url('assets/toiletten.png')";
    }
}

function interactWithToiletHallway() {
    const buildingView = document.getElementById('building-screen-view');
    buildingView.style.backgroundImage = "url('assets/gangen.gif')";
    document.querySelectorAll('.door-zone').forEach(d => d.classList.remove('doors-active'));
    document.getElementById('office-click').classList.add('doors-active');
    document.getElementById('toilet-click').classList.add('doors-active');
    document.getElementById('conference-click').classList.add('doors-active');

}

function interactWithConferenceDoor() {
    const hasCode = gameState.inventory.includes("Code");
    if (hasCode) {
        document.getElementById('keypad-container').classList.remove('hidden');
    } else {
        showBuildingMessage("Er moet een code ingevoerd worden...")
    }
}

let currentInput = "";
const correctCode = "20153";

function pressKey(key) {
    const display = document.getElementById('keypad-display');

    if (key === 'back') {
        currentInput = currentInput.slice(0, -1);
    } else if (key === 'ok') {
        if (currentInput === correctCode) {
            display.style.color = "#66ff66";
            display.innerText = "TOEGANG";
            setTimeout(() => {
                document.getElementById('keypad-container').classList.add('hidden');
                unlockOfficeDoor();
            }, 1000);
        } else {
            display.style.color = "#ff6666";
            display.innerText = "FOUT";
            currentInput = "";
            setTimeout(() => {
                display.style.color = "#4df04d";
                display.innerText = "____";
            }, 1000);
        }
        return;
    } else {
        if (currentInput.length < 5) {
            currentInput += key;
        }
    }

    display.innerText = currentInput.length > 0 ? currentInput : "CODE INVOEREN:";
}


// Agenten in de vergaderruimte
const officeAgents = {
    arnold2: { id: 'agent-arnold2', alive: true },
    matthijs: { id: 'agent-matthijs', alive: true },
    denise: { id: 'agent-denise', alive: true },
    gertjan2: { id: 'agent-gertjan2', alive: true },
    dimitri: { id: 'agent-dimitri', alive: true }
};

function unlockOfficeDoor() {
    document.querySelectorAll('.door-zone').forEach(el => {
        el.classList.remove('doors-active');
    });

    const buildingView = document.getElementById('building-screen-view');
    buildingView.style.backgroundImage = "url('assets/vergaderruimte_geen_mes_sleutels.png')";

    Object.keys(officeAgents).forEach(key => {
        const el = document.getElementById(officeAgents[key].id);
        if (el) {
            el.className = 'office-agent active';
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
            startEnemyFire();
        }
    });
}

function shootOfficeAgent(name) {
    const agent = officeAgents[name];
    if (!agent || !agent.alive) return;

    agent.alive = false;
    const el = document.getElementById(agent.id);
    if (el) {
        el.classList.add('office-dead');
    }

    checkOfficeBattleFinished();
}

function checkOfficeBattleFinished() {
    const buildingView = document.getElementById('building-screen-view');
    const allDead = Object.values(officeAgents).every(a => !a.alive);

    if (allDead) {
        stopEnemyFire();
        setTimeout(() => {
            Object.keys(officeAgents).forEach(key => {
                const el = document.getElementById(officeAgents[key].id);
                if (el) {
                    el.classList.add('office-fade');
                }
            });

            setTimeout(() => {
                document.querySelectorAll('.office-agent').forEach(el => el.style.display = 'none');
                document.getElementById('mes-click').classList.add('doors-active');
                document.getElementById('keychain-click').classList.add('doors-active');
                document.getElementById('drive-click').classList.add('doors-active');
                document.getElementById('office-exit').classList.add('doors-active');
                buildingView.style.backgroundImage = "url('assets/vergaderruimte.png')";
            }, 2000);
        }, 1000);
    }
}

function interactWithMes() {
    if (gameState.inventory.includes('Mes')) return;
    showBuildingMessage('Een... mes?')
    gameState.inventory.push('Mes');
    document.getElementById('mes-click').classList.remove('doors-active');
    updateOfficeBackground();
}

function interactWithDrive() {
    if (gameState.inventory.includes('Schijf')) return;
    showBuildingMessage('Missie volbracht. Snel weg hier.')
    gameState.inventory.push('Schijf');
    document.getElementById('drive-click').classList.remove('doors-active');
    updateOfficeBackground();
}

function interactWithKeychain() {
    if (gameState.inventory.includes('Sleutelbos')) return;
    showBuildingMessage('Dit is vast de sleutel van het kantoor!')
    gameState.inventory.push('Sleutelbos');
    document.getElementById('keychain-click').classList.remove('doors-active');
    updateOfficeBackground();
}

function updateOfficeBackground() {
    const buildingView = document.getElementById('building-screen-view');

    const hasMes = gameState.inventory.includes('Mes');
    const hasSchijf = gameState.inventory.includes('Schijf');
    const hasSleutels = gameState.inventory.includes('Sleutelbos');

    let bg = "vergaderruimte";

    if (hasMes && hasSchijf && hasSleutels) {
        bg += "_leeg";
    } else if (hasMes && hasSchijf) {
        bg += "_geen_mes_schijf";
    } else if (hasMes && hasSleutels) {
        bg += "_geen_mes_sleutels";
    } else if (hasSchijf && hasSleutels) {
        bg += "_geen_schijf_sleutels";
    } else if (hasMes) {
        bg += "_geen_mes";
    } else if (hasSchijf) {
        bg += "_geen_schijf";
    } else if (hasSleutels) {
        bg += "_geen_sleutels";
    }

    buildingView.style.backgroundImage = `url('assets/${bg}.png')`;
}


function exitOffice() {
    const buildingView = document.getElementById('building-screen-view');
    if (gameState.inventory.includes('Schijf') && gameState.inventory.includes('Sleutelbos') && gameState.inventory.includes('Mes')) {
        buildingView.style.backgroundImage = "url('assets/gangen.gif')";
        document.querySelectorAll('.door-zone').forEach(d => d.classList.remove('doors-active'));
        document.getElementById('office-click').classList.add('doors-active');
    } else {
        showBuildingMessage("Ik mis nog wat denk ik...");
    }
}

// Dierenwinkel
function showShopMessage(message) {
    const feedback = document.getElementById('shop-feedback');
    const text = document.getElementById('shop-feedback-text');

    text.innerText = message
    feedback.classList.remove('hidden');

    if (window.shopTimeout) clearTimeout(window.shopTimeout);

    window.shopTimeout = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
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
        saveGame();
        playCutscene('na_doolhof');
        return;
    }

    const mazeScreen = document.getElementById('maze-screen');
    if (mazeScreen && !mazeScreen.classList.contains('hidden')) {
        window.removeEventListener('keydown', handleMazeMovement);
        gameState.currentChapter = 5;
        gameState.inventory.push("Kaart");
        saveGame();
        playCutscene('na_doolhof');
        return;
    }

    const robScreen = document.getElementById('rob-home');
    if (robScreen && !robScreen.classList.contains('hidden')) {
        gameState.currentChapter = 6;
        gameState.inventory.push("PWS");
        gameState.inventory.push("EBS");
        gameState.inventory.push("Nuclear Receiver");
        saveGame();
        playCutscene('na_huis');
        return;
    }

    const highwayScreen = document.getElementById('highway-screen');
    if (highwayScreen && !highwayScreen.classList.contains('hidden')) {
        gameState.currentChapter = 7;
        saveGame();
        playCutscene('na_doodswens');
        return;
    }

    const jantjeBuiten = document.getElementById('jantje-home');
    if (jantjeBuiten && !jantjeBuiten.classList.contains('hidden')) {
        gameState.inventory.push("Sleutel");
        saveGame();
        showScreen('jantje-binnen');
        return;
    }

    const jantjeBinnen = document.getElementById('jantje-binnen');
    if (jantjeBinnen && !jantjeBinnen.classList.contains('hidden')) {
        gameState.currentChapter = 8;
        gameState.inventory.push("Laptop");
        saveGame();
        playCutscene('na_jantje');
        return;
    }

    const ngdBinnen = document.getElementById('NGD-hotel-screen');
    if (ngdBinnen && !ngdBinnen.classList.contains('hidden')) {
        gameState.currentChapter = 9;
        saveGame();
        playCutscene('na_touw');
        return;
    }

    const chase = document.getElementById('chase-screen');
    if (chase && !chase.classList.contains('hidden')) {
        [1, 2].forEach(id => {
            const car = carsActive[id];
            car.active = false;
            if (car.interval) {
                clearInterval(car.interval);
                car.interval = null;
            }
        });
        gameState.currentChapter = 10;
        saveGame();
        playCutscene('na_chase');
        return;
    }

    const ditch = document.getElementById('ditch-screen');
    if (ditch && !ditch.classList.contains('hidden')) {
        gameState.currentChapter = 11;
        gameState.inventory.push("Crowbar");
        saveGame();
        playCutscene('na_greppel');
        return;
    }

    const torture = document.getElementById('torture-screen');
    if (torture && !torture.classList.contains('hidden')) {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_torture');
        return;
    }

    const aftertorture = document.getElementById('after-torture-screen');
    if (aftertorture && !aftertorture.classList.contains('hidden')) {
        updateGlobalDamage(40);
        gameState.currentChapter = 12;
        saveGame();
        playCutscene('na_victor');
        return;
    }

    const building = document.getElementById('building-screen');
    if (building && !building.classList.contains('hidden')) {
        gameState.currentChapter = 14;
        stopEnemyFire();
        gameState.inventory.push("Code");
        gameState.inventory.push("Sleutelbos");
        gameState.inventory.push("Schijf");
        gameState.inventory.push("Mes");
        saveGame();
        playCutscene('kantoor');
        return;
    }

    const shop = document.getElementById('shop-screen');
    if (shop && !shop.classList.contains('hidden')) {
        gameState.currentChapter = 15;
        saveGame();
        playCutscene('na_shop');
        return;
    }

    alert("Niets om hier te skippen!");
}

// Check save game bij laden van script
checkSaveGame();