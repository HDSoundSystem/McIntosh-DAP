// ============================================================================
// MCINTOSH AUDIO PLAYER - SCRIPT PRINCIPAL
// ============================================================================

// ============================================================================
// 1. IMPORT ET CONFIGURATION DU MOTEUR AUDIO
// ============================================================================

let McIntoshAudioEngine;

if (typeof require !== 'undefined') {
    // Environnement Electron
    McIntoshAudioEngine = require('./js/mcintosh-audio-engine.js');
} else {
    // Environnement Web
    McIntoshAudioEngine = window.McIntoshAudioEngine;
}

// ============================================================================
// 2. SÉLECTEURS DOM - ÉLÉMENTS PRINCIPAUX
// ============================================================================

// --- Aiguilles VU-mètres ---
const nl = document.getElementById('needle-l');
const nr = document.getElementById('needle-r');

// --- Affichage VFD ---
const vfdLarge = document.querySelector('.vfd-large');
const vfdInfo = document.querySelector('.vfd-info');
const statusIcon = document.getElementById('vfd-status-icon');
const trackCount = document.getElementById('track-count');
const fileFormat = document.getElementById('file-format');
const bitrateDisplay = document.getElementById('bitrate');
const timeDisplay = document.getElementById('time-display');
const volDisplay = document.getElementById('volume-display');

// --- Contrôles audio ---
const audio = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const stopBtn = document.getElementById('stop-btn');
const muteBtn = document.getElementById('mute-btn');

// --- Contrôles d'entrée ---
const inputBtn = document.getElementById('input-knob');
const fileUpload = document.getElementById('audio-upload');

// --- Volume et alimentation ---
const volumeKnob = document.getElementById('volume-knob');
const pwr = document.getElementById('pwr');
const powerLed = document.querySelector('.power-led');

// ============================================================================
// 3. SÉLECTEURS DOM - FONCTIONNALITÉS AVANCÉES
// ============================================================================

// --- Modal Reboot ---
const rebootModal = document.getElementById('reboot-modal');
const btnYes = document.getElementById('reboot-yes');
const btnNo = document.getElementById('reboot-no');

// --- Égaliseur 2 bandes (Bass/Treble) ---
const bassDown = document.getElementById('bass-down');
const bassUp = document.getElementById('bass-up');
const trebleDown = document.getElementById('treble-down');
const trebleUp = document.getElementById('treble-up');
const toneReset = document.getElementById('tone-reset');

// --- Balance ---
const balL = document.getElementById('balance-L');
const balR = document.getElementById('balance-R');

// --- Popup pochette d'album ---
const albumOverlay = document.getElementById('album-overlay');
const albumPopup = document.getElementById('album-popup');
const popupImg = document.getElementById('popup-img');
const noCoverText = document.getElementById('no-cover-text');

// --- Bibliothèque musicale ---
const libBtn = document.getElementById('library-btn');
const modal = document.getElementById('library-modal');
const closeBtn = document.querySelector('.close-btn');
const folderInput = document.getElementById('folder-input');
const fileList = document.getElementById('file-list');

// --- Égaliseur 10 bandes ---
const eqBtn = document.getElementById('eq-btn');
const eqPopup = document.getElementById('eq-popup');
const closeEq = document.getElementById('close-eq');
const eqResetBtn = document.getElementById('eq-reset-btn');
const eqSliders = document.querySelectorAll('.eq-band input');
const eqCanvas = document.getElementById('eq-curve');
const eqCtx = eqCanvas?.getContext('2d');
const displayElement = document.getElementById('eq-preset-name-display');

// ============================================================================
// 4. VARIABLES GLOBALES - ÉTAT DE L'APPLICATION
// ============================================================================

// --- Playlist et lecture ---
let playlist = [];
let currentIndex = 0;
let isPoweredOn = false;
let isMuted = false;
let isShowingRemaining = false;

// --- Volume et audio ---
let currentVolume = 0.05;
let volTimeout = null;

// --- Égaliseur et balance ---
let bassGain = 0;
let trebleGain = 0;
let currentBalance = 0;
let isLoudnessActive = false;
let isMonoActive = false;

// --- Contrôles de lecture avancés ---
let isRandom = false;
let repeatMode = 0;
let abMode = 0;
let pointA = 0;
let pointB = 0;

// --- Seeking et VU-mètres ---
let seekInterval = null;
let isSeeking = false;
let seekStartTime = 0;
let isMouseDown = false;
let currentAngleL = -55;
let currentAngleR = -55;
let targetAngleL = -55;
let targetAngleR = -55;
let volHoldInterval = null;

// ============================================================================
// 5. INITIALISATION DU MOTEUR AUDIO
// ============================================================================

const engine = new McIntoshAudioEngine(audio);

// Initialisation du volume
engine.setVolume(currentVolume);
if (volumeKnob) volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;

// Initialisation du moteur
function initEngine() {
    engine.init();
}

// ============================================================================
// 6. FONCTIONS UTILITAIRES - AFFICHAGE
// ============================================================================

/**
 * Ajuste la taille du texte pour qu'il rentre dans son conteneur
 */
function fitText(element, maxFontSize) {
    if (!element) return;
    let fontSize = maxFontSize;
    element.style.fontSize = fontSize + "px";
    while (element.scrollWidth > element.offsetWidth && fontSize > 12) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

/**
 * Affiche un message temporaire sur l'écran VFD
 */
function showStatusBriefly(text) {
    if (!isPoweredOn || !volDisplay) return;
    clearTimeout(volTimeout);
    volDisplay.textContent = text;
    volDisplay.style.opacity = "1";
    volTimeout = setTimeout(() => { volDisplay.style.opacity = "0"; }, 2000);
}

/**
 * Affiche le volume actuel ou MUTE
 */
function showVolumeBriefly() {
    if (isMuted) {
        clearTimeout(volTimeout);
        volDisplay.textContent = "MUTE";
        volDisplay.style.opacity = "1";
    } else {
        showStatusBriefly(`VOL: ${Math.round(currentVolume * 100)}%`);
    }
}

/**
 * Met à jour l'icône de statut (Play/Pause/Stop)
 */
function updateStatusIcon(state) {
    if (!isPoweredOn || !statusIcon) return;
    statusIcon.className = "";
    if (state === 'play') statusIcon.innerHTML = 'PLAY<i class="fas fa-play"></i>';
    else if (state === 'pause') { 
        statusIcon.innerHTML = 'PAUSE<i class="fas fa-pause"></i>'; 
        statusIcon.classList.add('blink-soft'); 
    }
    else if (state === 'stop') statusIcon.innerHTML = 'STOP<i class="fas fa-stop"></i>';
}

/**
 * Met à jour l'affichage des modes (Random, Repeat, A-B)
 */
function updateVFDStatusDisplay() {
    let modeIndicator = document.getElementById('vfd-mode-indicator');
    if (!modeIndicator) {
        modeIndicator = document.createElement('div');
        modeIndicator.id = 'vfd-mode-indicator';
        modeIndicator.style.cssText = "position: absolute; bottom: 8px; left: 15px; color: var(--mc-blue, #00c3ff); font-size: 11px; font-weight: bold; text-shadow: 0 0 5px rgba(0,255,102,0.5); display: flex; gap: 10px;";
        document.getElementById('vfd')?.appendChild(modeIndicator);
    }
    let repeatText = repeatMode === 1 ? "REPEAT(1)" : (repeatMode === 2 ? "REPEAT(ALL)" : "");
    let abText = abMode === 1 ? "A-" : (abMode === 2 ? "A-B" : "");
    modeIndicator.innerHTML = `<span>${isRandom ? "RANDOM" : ""}</span><span>${repeatText}</span><span style="color: #00c3ff">${abText}</span>`;
}

// ============================================================================
// 7. FONCTIONS AUDIO - ÉGALISEUR ET BALANCE
// ============================================================================

/**
 * Applique l'effet loudness à l'égaliseur
 */
function applyLoudnessEffect() {
    engine.updateEQ(bassGain, trebleGain, isLoudnessActive);
}

/**
 * Affiche le statut de la balance
 */
function showBalanceStatus() {
    let balText = "BAL: CENTER";
    if (currentBalance < -0.05) balText = `BAL: ${Math.round(Math.abs(currentBalance) * 100)}% L`;
    else if (currentBalance > 0.05) balText = `BAL: ${Math.round(currentBalance * 100)}% R`;
    showStatusBriefly(balText);
}

/**
 * Définit la balance L/R
 */
function setBalance(val) {
    if (isPoweredOn && !isMonoActive) {
        currentBalance = Math.max(-1, Math.min(1, val));
        engine.setBalance(currentBalance);
        showBalanceStatus();
    }
}

// ============================================================================
// 8. FONCTIONS DE GESTION DES PISTES
// ============================================================================

/**
 * Charge une piste de la playlist
 */
function loadTrack(index) {
    if (playlist.length === 0 || !isPoweredOn) return;
    currentIndex = index; 
    abMode = 0; 
    updateVFDStatusDisplay();
    
    const file = playlist[currentIndex];
    trackCount.textContent = `${currentIndex + 1}/${playlist.length}`;
    
    // Détection du format
    const ext = file.name.split('.').pop().toLowerCase();
    fileFormat.textContent = (ext === 'm4a') ? "AAC/ALAC" : ext.toUpperCase();
    
    audio.src = URL.createObjectURL(file);
    audio.load();
    
    // Extraction des métadonnées et pochette
    jsmediatags.read(file, {
        onSuccess: (tag) => {
            const artist = tag.tags.artist || "Unknown Artist";
            const title = tag.tags.title || file.name.replace(/\.[^/.]+$/, "");
            const album = tag.tags.album || "";
            
            vfdLarge.textContent = title;
            vfdInfo.textContent = artist + (album ? ` - ${album}` : "");
            fitText(vfdLarge, 26);
            fitText(vfdInfo, 14);
            
            // Pochette d'album
            const picture = tag.tags.picture;
            if (picture && albumPopup && popupImg && noCoverText) {
                const base64 = picture.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                const imgSrc = `data:${picture.format};base64,${btoa(base64)}`;
                popupImg.src = imgSrc;
                popupImg.style.display = 'block';
                noCoverText.style.display = 'none';
            } else if (albumPopup && popupImg && noCoverText) {
                popupImg.style.display = 'none';
                noCoverText.style.display = 'flex';
            }
        },
        onError: () => {
            const fname = file.name.replace(/\.[^/.]+$/, "");
            vfdLarge.textContent = fname;
            vfdInfo.textContent = "Unknown Artist";
            fitText(vfdLarge, 26);
            fitText(vfdInfo, 14);
            if (albumPopup && popupImg && noCoverText) {
                popupImg.style.display = 'none';
                noCoverText.style.display = 'flex';
            }
        }
    });
    
    audio.play().catch(err => console.error("Erreur lecture:", err));
}

/**
 * Piste suivante (avec gestion random et repeat)
 */
function nextTrack() {
    if (playlist.length === 0) return;
    if (repeatMode === 1) { 
        audio.currentTime = 0; 
        audio.play(); 
        return; 
    }
    if (isRandom) {
        currentIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentIndex = (currentIndex + 1) % playlist.length;
    }
    loadTrack(currentIndex);
}

/**
 * Piste précédente
 */
function prevTrack() {
    if (playlist.length === 0) return;
    if (audio.currentTime > 3) { 
        audio.currentTime = 0; 
        return; 
    }
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
}

// ============================================================================
// 9. FONCTIONS DE CONTRÔLE DE LECTURE
// ============================================================================

/**
 * Lecture/Pause
 */
function togglePlayPause() {
    if (!isPoweredOn) return;
    if (audio.paused) {
        audio.play().catch(err => console.error("Erreur play:", err));
    } else {
        audio.pause();
    }
}

/**
 * Stop
 */
function stopAudio() {
    if (!isPoweredOn) return;
    audio.pause();
    audio.currentTime = 0;
    updateStatusIcon('stop');
}

/**
 * Mute/Unmute
 */
function toggleMute() {
    if (!isPoweredOn) return;
    isMuted = !isMuted;
    engine.setVolume(isMuted ? 0 : currentVolume);
    showVolumeBriefly();
}

/**
 * Ajustement du volume
 */
function adjustVolume(delta) {
    if (!isPoweredOn) return;
    currentVolume = Math.max(0, Math.min(1, currentVolume + delta));
    if (!isMuted) {
        engine.setVolume(currentVolume);
    }
    if (volumeKnob) {
        volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;
    }
    showVolumeBriefly();
}

// ============================================================================
// 10. FONCTIONS DE L'ÉGALISEUR 10 BANDES
// ============================================================================

/**
 * Presets de l'égaliseur
 */
const eqPresets = {
    'eq-pop-btn':     [-2, -1, 2, 4, 5, 5, 4, 2, -1, -2],
    'eq-rock-btn':    [7, 5, 3, -1, -3, -3, 1, 4, 6, 8],
    'eq-jazz-btn':    [4, 2, 0, 2, 4, 4, 2, 0, 2, 4],
    'eq-classic-btn': [5, 4, 2, 0, 0, 0, 0, 2, 4, 5],
    'eq-reset-btn':   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

const presetLabels = {
    'eq-pop-btn': 'POP',
    'eq-rock-btn': 'ROCK',
    'eq-jazz-btn': 'JAZZ',
    'eq-classic-btn': 'CLASSIC',
    'eq-reset-btn': 'FLAT'
};

/**
 * Dessine la courbe de l'égaliseur
 */
function drawEQCurve() {
    if (!eqCanvas || !eqCtx) return;
    const width = eqCanvas.width = eqCanvas.offsetWidth;
    const height = eqCanvas.height = eqCanvas.offsetHeight;
    eqCtx.clearRect(0, 0, width, height);

    // Grille de fond
    eqCtx.strokeStyle = "#1a1a1a";
    eqCtx.lineWidth = 1;
    eqCtx.beginPath();
    for(let i = 1; i < 4; i++) {
        let y = (height / 4) * i;
        eqCtx.moveTo(0, y); 
        eqCtx.lineTo(width, y);
    }
    eqCtx.stroke();

    // Points de la courbe
    const points = Array.from(eqSliders).map((slider, index) => {
        const x = (width / (eqSliders.length - 1)) * index;
        const y = (height / 2) - (slider.value * (height / 26)); 
        return {x, y};
    });

    // Dessin de la courbe bleue
    eqCtx.beginPath();
    eqCtx.strokeStyle = "#00c3ff";
    eqCtx.lineWidth = 3;
    eqCtx.lineCap = "round";
    eqCtx.shadowBlur = 10;
    eqCtx.shadowColor = "#00ff66";
    eqCtx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        eqCtx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    eqCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    eqCtx.stroke();
    eqCtx.shadowBlur = 0;
}

/**
 * Applique un preset d'égaliseur
 */
function applyPreset(btnId) {
    if (!isPoweredOn) return;
    const gains = eqPresets[btnId];
    if (!gains) return;

    eqSliders.forEach((slider, index) => {
        if (gains[index] !== undefined) {
            slider.value = gains[index];
            const freq = slider.getAttribute('data-freq');
            if (engine && engine.setCustomFilter) {
                engine.setCustomFilter(freq, gains[index]);
            }
        }
    });

    // Mise à jour de l'affichage
    let presetName = btnId.replace('eq-', '').replace('-btn', '').toUpperCase();
    if (presetName === 'RESET') presetName = 'FLAT';
    if (displayElement) displayElement.innerText = presetName;

    showStatusBriefly("PRESET: " + presetName);
    drawEQCurve();
}

// ============================================================================
// 11. EVENT LISTENERS - ALIMENTATION ET REBOOT
// ============================================================================

pwr.addEventListener('click', () => {
    rebootModal.style.display = 'flex';
});

btnYes.addEventListener('click', () => {
    location.reload();
});

btnNo.addEventListener('click', () => {
    rebootModal.style.display = 'none';
});

// ============================================================================
// 12. EVENT LISTENERS - BALANCE
// ============================================================================

balL?.addEventListener('click', () => setBalance(currentBalance - 0.1));
balR?.addEventListener('click', () => setBalance(currentBalance + 0.1));
balL?.addEventListener('mouseenter', () => isPoweredOn && showBalanceStatus());
balR?.addEventListener('mouseenter', () => isPoweredOn && showBalanceStatus());

// ============================================================================
// 13. EVENT LISTENERS - ÉGALISEUR 2 BANDES (BASS/TREBLE)
// ============================================================================

const eqBtns = [
    { b: bassUp, f: () => bassGain = Math.min(12, bassGain + 2), t: 'BASS' },
    { b: bassDown, f: () => bassGain = Math.max(-12, bassGain - 2), t: 'BASS' },
    { b: trebleUp, f: () => trebleGain = Math.min(12, trebleGain + 2), t: 'TREBLE' },
    { b: trebleDown, f: () => trebleGain = Math.max(-12, trebleGain - 2), t: 'TREBLE' }
];

eqBtns.forEach(item => {
    item.b?.addEventListener('click', () => { 
        if (isPoweredOn) { 
            item.f(); 
            applyLoudnessEffect(); 
            showStatusBriefly(`${item.t}: ${(item.t === 'BASS' ? bassGain : trebleGain) > 0 ? '+' : ''}${item.t === 'BASS' ? bassGain : trebleGain}dB`); 
        } 
    });
    item.b?.addEventListener('mouseenter', () => { 
        if (isPoweredOn) { 
            showStatusBriefly(`${item.t}: ${(item.t === 'BASS' ? bassGain : trebleGain) > 0 ? '+' : ''}${item.t === 'BASS' ? bassGain : trebleGain}dB`); 
        } 
    });
});

toneReset?.addEventListener('click', () => { 
    if (isPoweredOn) { 
        bassGain = 0; 
        trebleGain = 0; 
        currentBalance = 0; 
        if (!isMonoActive) engine.setBalance(0); 
        applyLoudnessEffect(); 
        showStatusBriefly("TONE FLAT"); 
    } 
});

toneReset?.addEventListener('mouseenter', () => isPoweredOn && showStatusBriefly("TONE RESET"));

// ============================================================================
// 14. EVENT LISTENERS - ÉGALISEUR 10 BANDES
// ============================================================================

// Sliders individuels
eqSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        const freq = e.target.getAttribute('data-freq');
        const gain = e.target.value;
        if (engine.setCustomFilter) engine.setCustomFilter(freq, gain);
        drawEQCurve();
        if (displayElement) displayElement.innerText = "CUSTOM";
        showStatusBriefly(`${freq}Hz: ${gain > 0 ? '+' : ''}${gain}dB`);
    });
});

// Boutons de presets
Object.keys(eqPresets).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyPreset(id);
        });
    }
});

// Mise à jour du nom du preset affiché
Object.keys(presetLabels).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', () => {
            if (displayElement) {
                displayElement.innerText = presetLabels[id];
            }
        });
    }
});

// Reset de l'égaliseur
eqResetBtn?.addEventListener('click', () => {
    if (!isPoweredOn) return;

    eqSliders.forEach(slider => {
        slider.value = 0; 
        const freq = slider.getAttribute('data-freq');
        if (engine.setCustomFilter) {
            engine.setCustomFilter(freq, 0);
        }
    });

    drawEQCurve();
    showStatusBriefly("EQ FLAT (0dB)");
});

// Ouverture/fermeture de la popup
eqBtn?.addEventListener('click', (e) => {
    if (isPoweredOn) {
        e.stopPropagation();
        eqPopup.style.display = 'block';
        setTimeout(drawEQCurve, 50);
    } else {
        showStatusBriefly("POWER ON FIRST");
    }
});

closeEq?.addEventListener('click', () => eqPopup.style.display = 'none');
eqPopup?.addEventListener('click', (e) => e.stopPropagation());

// ============================================================================
// 15. INITIALISATION AU DÉMARRAGE
// ============================================================================

// Initialisation du nom du preset
if (displayElement) displayElement.innerText = "FLAT";
