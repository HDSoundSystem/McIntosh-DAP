// --- SELECTEURS ---
const nl = document.getElementById('needle-l');
const nr = document.getElementById('needle-r');
const vfdLarge = document.querySelector('.vfd-large');
const vfdInfo = document.querySelector('.vfd-info');
const statusIcon = document.getElementById('vfd-status-icon');
const trackCount = document.getElementById('track-count');
const fileFormat = document.getElementById('file-format');
const bitrateDisplay = document.getElementById('bitrate');
const timeDisplay = document.getElementById('time-display');
const volDisplay = document.getElementById('volume-display');
const inputBtn = document.getElementById('input-knob');
const fileUpload = document.getElementById('audio-upload');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const stopBtn = document.getElementById('stop-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeKnob = document.getElementById('volume-knob');
const pwr = document.getElementById('pwr');
const powerLed = document.querySelector('.power-led');
const audio = document.getElementById('main-audio');

// --- SELECTEURS EQ ---
const bassDown = document.getElementById('bass-down');
const bassUp = document.getElementById('bass-up');
const trebleDown = document.getElementById('treble-down');
const trebleUp = document.getElementById('treble-up');
const toneReset = document.getElementById('tone-reset');

// --- SELECTEURS BALANCE ---
const balL = document.getElementById('balance-L');
const balR = document.getElementById('balance-R');

// --- SELECTEURS POPUP ---
const albumOverlay = document.getElementById('album-overlay');
const albumPopup = document.getElementById('album-popup');
const popupImg = document.getElementById('popup-img');

// --- VARIABLES ---
let playlist = [];
let currentIndex = 0;
let audioCtx = null;

// Analyseurs Stéréo
let analyserL = null;
let analyserR = null;
let dataArrayL = null;
let dataArrayR = null;

let source = null;
let isPoweredOn = false;
let isMuted = false;
let isShowingRemaining = false;
let volTimeout = null;

// Nodes Audio
let bassFilter = null;
let trebleFilter = null;
let balanceNode = null;

let bassGain = 0;   // en dB
let trebleGain = 0; // en dB
let currentBalance = 0; // -1 (L) à 1 (R)

// Variables pour avance/retour rapide
let seekInterval = null;
let isSeeking = false;
let seekStartTime = 0;
let isMouseDown = false;

let currentAngleL = -55;
let currentAngleR = -55;
let targetAngleL = -55;
let targetAngleR = -55;
let isRandom = false;
let repeatMode = 0;

// VARIABLES BOUCLE A-B
let abMode = 0; // 0: OFF, 1: A, 2: B (Loop)
let pointA = 0;
let pointB = 0;

let volHoldInterval = null;

// --- INITIALISATION VOLUME ---
let currentVolume = 0.05;
audio.volume = currentVolume;
if (volumeKnob) volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;

// --- FONCTION D'ADAPTATION DE LA TAILLE DU TEXTE ---
function fitText(element, maxFontSize) {
    if (!element) return;
    let fontSize = maxFontSize;
    element.style.fontSize = fontSize + "px";
    while (element.scrollWidth > element.offsetWidth && fontSize > 12) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

// Fonction pour afficher le volume, EQ ou le MUTE
function showStatusBriefly(text) {
    if (!isPoweredOn || !volDisplay) return;
    clearTimeout(volTimeout);
    volDisplay.textContent = text;
    volDisplay.style.opacity = "1";
    volTimeout = setTimeout(() => { volDisplay.style.opacity = "0"; }, 2000);
}

function showVolumeBriefly() {
    if (isMuted) showStatusBriefly("MUTE");
    else showStatusBriefly(`VOL: ${Math.round(currentVolume * 100)}%`);
}

// Fonction pour mettre à jour l'icône de statut
function updateStatusIcon(state) {
    if (!isPoweredOn || !statusIcon) return;
    statusIcon.className = "";
    if (state === 'play') {
        statusIcon.innerHTML = 'PLAY<i class="fas fa-play"></i>';
    } else if (state === 'pause') {
        statusIcon.innerHTML = 'PAUSE<i class="fas fa-pause"></i>';
        statusIcon.classList.add('blink-soft');
    } else if (state === 'stop') {
        statusIcon.innerHTML = 'STOP<i class="fas fa-stop"></i>';
    } else {
        statusIcon.innerHTML = "";
    }
}

// --- MISE À JOUR VFD (RANDOM / REPEAT / A-B) ---
function updateVFDStatusDisplay() {
    let modeIndicator = document.getElementById('vfd-mode-indicator');
    if (!modeIndicator) {
        modeIndicator = document.createElement('div');
        modeIndicator.id = 'vfd-mode-indicator';
        modeIndicator.style.cssText = "position: absolute; bottom: 8px; left: 15px; color: var(--mc-led-green, #00ff66); font-size: 11px; font-weight: bold; text-shadow: 0 0 5px rgba(0,255,102,0.5); display: flex; gap: 10px;";
        const vfd = document.getElementById('vfd');
        if (vfd) vfd.appendChild(modeIndicator);
    }

    let repeatText = "";
    if (repeatMode === 1) repeatText = "REPEAT(1)";
    else if (repeatMode === 2) repeatText = "REPEAT(ALL)";

    let abText = "";
    if (abMode === 1) abText = "A-";
    else if (abMode === 2) abText = "A-B";

    if (modeIndicator) {
        modeIndicator.innerHTML = `
            <span>${isRandom ? "RANDOM" : ""}</span>
            <span>${repeatText}</span>
            <span style="color: #00ff66;">${abText}</span>
        `;
    }
}

// --- POWER ON/OFF / REINITIALISATION ---
pwr.addEventListener('click', () => {
    isPoweredOn = !isPoweredOn;
    if (!isPoweredOn) {
        audio.pause();
        audio.src = "";
        fileUpload.value = "";
        playlist = [];
        currentIndex = 0;
        isMuted = false;
        audio.muted = false;
        isRandom = false;
        repeatMode = 0;
        abMode = 0;
        bassGain = 0;
        trebleGain = 0;
        currentBalance = 0;

        currentVolume = 0.05;
        audio.volume = currentVolume;
        volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;

        vfdLarge.textContent = "SYSTEM OFF";
        vfdInfo.textContent = "";
        statusIcon.innerHTML = "";
        trackCount.textContent = "0/0";
        fileFormat.textContent = "---";
        bitrateDisplay.textContent = "0 KBPS";
        if (volDisplay) volDisplay.style.opacity = "0";
        if (timeDisplay) timeDisplay.textContent = "00:00";
        const modeIndicator = document.getElementById('vfd-mode-indicator');
        if (modeIndicator) modeIndicator.textContent = "";

        targetAngleL = -55;
        targetAngleR = -55;
    } else {
        vfdLarge.textContent = "Push input to select your tracks";
        updateStatusIcon('stop');
    }
});

// --- MOTEUR AUDIO AVEC EQ, BALANCE ET STEREO REELLE ---
function initEngine() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        analyserL = audioCtx.createAnalyser();
        analyserR = audioCtx.createAnalyser();
        analyserL.fftSize = 1024;
        analyserR.fftSize = 1024;

        dataArrayL = new Uint8Array(analyserL.frequencyBinCount);
        dataArrayR = new Uint8Array(analyserR.frequencyBinCount);

        const splitter = audioCtx.createChannelSplitter(2);

        // NODE BALANCE
        balanceNode = audioCtx.createStereoPanner();
        balanceNode.pan.value = currentBalance;

        bassFilter = audioCtx.createBiquadFilter();
        bassFilter.type = "lowshelf";
        bassFilter.frequency.value = 200;
        bassFilter.gain.value = bassGain;

        trebleFilter = audioCtx.createBiquadFilter();
        trebleFilter.type = "highshelf";
        trebleFilter.frequency.value = 3000;
        trebleFilter.gain.value = trebleGain;

        source = audioCtx.createMediaElementSource(audio);

        // CHAINE : SOURCE -> BALANCE -> EQ -> SPLITTER (VISU) -> DESTINATION
        source.connect(balanceNode);
        balanceNode.connect(bassFilter);
        bassFilter.connect(trebleFilter);
        trebleFilter.connect(splitter);

        splitter.connect(analyserL, 0);
        splitter.connect(analyserR, 1);

        trebleFilter.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// --- LOGIQUE BALANCE ---
function showBalanceStatus() {
    let balText = "BAL: CENTER";
    if (currentBalance < -0.05) balText = `BAL: ${Math.round(Math.abs(currentBalance) * 100)}% L`;
    else if (currentBalance > 0.05) balText = `BAL: ${Math.round(currentBalance * 100)}% R`;
    showStatusBriefly(balText);
}

function setBalance(val) {
    if (!isPoweredOn) return;
    currentBalance = Math.max(-1, Math.min(1, val));
    if (balanceNode) balanceNode.pan.value = currentBalance;
    showBalanceStatus();
}

// Touches clavier
window.addEventListener('keydown', (e) => {
    if (!isPoweredOn) return;
    if (e.key === "ArrowLeft") setBalance(currentBalance - 0.1);
    if (e.key === "ArrowRight") setBalance(currentBalance + 0.1);
});

// Boutons Balance
if (balL) {
    balL.addEventListener('click', () => setBalance(currentBalance - 0.1));
    balL.addEventListener('mouseenter', () => { if (isPoweredOn) showBalanceStatus(); });
}
if (balR) {
    balR.addEventListener('click', () => setBalance(currentBalance + 0.1));
    balR.addEventListener('mouseenter', () => { if (isPoweredOn) showBalanceStatus(); });
}

// --- LOGIQUE EQ ---
if (bassUp) {
    bassUp.addEventListener('click', () => {
        if (!isPoweredOn) return;
        bassGain = Math.min(12, bassGain + 2);
        if (bassFilter) bassFilter.gain.value = bassGain;
        showStatusBriefly(`BASS: ${bassGain > 0 ? '+' : ''}${bassGain}dB`);
    });
    bassUp.addEventListener('mouseenter', () => {
        if (isPoweredOn) showStatusBriefly(`BASS: ${bassGain > 0 ? '+' : ''}${bassGain}dB`);
    });
}

if (bassDown) {
    bassDown.addEventListener('click', () => {
        if (!isPoweredOn) return;
        bassGain = Math.max(-12, bassGain - 2);
        if (bassFilter) bassFilter.gain.value = bassGain;
        showStatusBriefly(`BASS: ${bassGain > 0 ? '+' : ''}${bassGain}dB`);
    });
    bassDown.addEventListener('mouseenter', () => {
        if (isPoweredOn) showStatusBriefly(`BASS: ${bassGain > 0 ? '+' : ''}${bassGain}dB`);
    });
}

if (trebleUp) {
    trebleUp.addEventListener('click', () => {
        if (!isPoweredOn) return;
        trebleGain = Math.min(12, trebleGain + 2);
        if (trebleFilter) trebleFilter.gain.value = trebleGain;
        showStatusBriefly(`TREBLE: ${trebleGain > 0 ? '+' : ''}${trebleGain}dB`);
    });
    trebleUp.addEventListener('mouseenter', () => {
        if (isPoweredOn) showStatusBriefly(`TREBLE: ${trebleGain > 0 ? '+' : ''}${trebleGain}dB`);
    });
}

if (trebleDown) {
    trebleDown.addEventListener('click', () => {
        if (!isPoweredOn) return;
        trebleGain = Math.max(-12, trebleGain - 2);
        if (trebleFilter) trebleFilter.gain.value = trebleGain;
        showStatusBriefly(`TREBLE: ${trebleGain > 0 ? '+' : ''}${trebleGain}dB`);
    });
    trebleDown.addEventListener('mouseenter', () => {
        if (isPoweredOn) showStatusBriefly(`TREBLE: ${trebleGain > 0 ? '+' : ''}${trebleGain}dB`);
    });
}

if (toneReset) {
    toneReset.addEventListener('click', () => {
        if (!isPoweredOn) return;
        bassGain = 0; trebleGain = 0; currentBalance = 0;
        if (bassFilter) bassFilter.gain.value = 0;
        if (trebleFilter) trebleFilter.gain.value = 0;

        showStatusBriefly("TONE FLAT");
    });
    toneReset.addEventListener('mouseenter', () => {
        if (isPoweredOn) showStatusBriefly("TONE RESET");
    });
}

// --- CHARGEMENT FICHIER ---
function loadTrack(index) {
    if (playlist.length === 0 || !isPoweredOn) return;
    currentIndex = index;
    abMode = 0;
    updateVFDStatusDisplay();

    const file = playlist[currentIndex];
    trackCount.textContent = `${currentIndex + 1}/${playlist.length}`;
    fileFormat.textContent = file.name.split('.').pop().toUpperCase();
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.onloadedmetadata = () => {
        bitrateDisplay.textContent = Math.round(((file.size * 8) / audio.duration) / 1000) + " KBPS";
    };
    if (window.jsmediatags) {
        window.jsmediatags.read(file, {
            onSuccess: (tag) => {
                const t = tag.tags;
                vfdLarge.textContent = (t.title || file.name).toUpperCase();
                vfdInfo.textContent = `${t.artist || "UNKNOWN"} – ${t.album || "UNKNOWN"}`.toUpperCase();
                setTimeout(() => fitText(vfdLarge, 30), 10);
            },
            onError: () => {
                vfdLarge.textContent = file.name.toUpperCase();
                vfdInfo.textContent = "ARTIST – ALBUM";
                setTimeout(() => fitText(vfdLarge, 30), 10);
            }
        });
    }
    initEngine();
    audio.play().then(() => updateStatusIcon('play')).catch(e => console.warn("Interaction requise"));
}

// --- GESTION AVANCE / RETOUR RAPIDE ---
function startSeeking(direction) {
    if (!isPoweredOn || playlist.length === 0) return;
    isMouseDown = true;
    isSeeking = false;
    seekStartTime = Date.now();
    clearInterval(seekInterval);
    seekInterval = setInterval(() => {
        if (isMouseDown && Date.now() - seekStartTime > 500) {
            isSeeking = true;
            audio.currentTime += (direction === 'next' ? 3 : -3);
        }
    }, 100);
}

function stopSeeking(direction) {
    if (!isMouseDown) return;
    clearInterval(seekInterval);
    if (isPoweredOn && playlist.length > 0 && !isSeeking) {
        if (direction === 'next') {
            if (isRandom && playlist.length > 1) {
                let nextIndex;
                do { nextIndex = Math.floor(Math.random() * playlist.length); } while (nextIndex === currentIndex);
                loadTrack(nextIndex);
            } else if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
            else if (repeatMode === 2) loadTrack(0);
        } else if (direction === 'prev' && currentIndex > 0) loadTrack(currentIndex - 1);
    }
    isSeeking = false;
    isMouseDown = false;
}

// --- EVENEMENTS ---
inputBtn.addEventListener('click', () => { fileUpload.click(); });
fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        if (!isPoweredOn) { isPoweredOn = true; powerLed.classList.add('active'); }
        playlist = Array.from(e.target.files);
        loadTrack(0);
    }
});
playPauseBtn.addEventListener('click', () => {
    if (!isPoweredOn || playlist.length === 0) return;
    initEngine();
    if (audio.paused) { audio.play(); updateStatusIcon('play'); }
    else { audio.pause(); updateStatusIcon('pause'); }
});

nextBtn.addEventListener('mousedown', (e) => { if (e.button === 0) startSeeking('next'); });
nextBtn.addEventListener('mouseup', () => stopSeeking('next'));
nextBtn.addEventListener('mouseleave', () => { isMouseDown = false; clearInterval(seekInterval); });
prevBtn.addEventListener('mousedown', (e) => { if (e.button === 0) startSeeking('prev'); });
prevBtn.addEventListener('mouseup', () => stopSeeking('prev'));
prevBtn.addEventListener('mouseleave', () => { isMouseDown = false; clearInterval(seekInterval); });

stopBtn.addEventListener('click', () => {
    if (!isPoweredOn) return;
    audio.pause(); audio.currentTime = 0; updateStatusIcon('stop');
});
muteBtn.addEventListener('click', () => {
    if (!isPoweredOn) return;
    isMuted = !isMuted; audio.muted = isMuted; showVolumeBriefly();
});

document.getElementById('random-btn')?.addEventListener('click', () => {
    if (!isPoweredOn) return;
    isRandom = !isRandom; updateVFDStatusDisplay();
});
document.getElementById('repeat-btn')?.addEventListener('click', () => {
    if (!isPoweredOn) return;
    repeatMode = (repeatMode + 1) % 3; updateVFDStatusDisplay();
});

document.getElementById('ab-loop-btn')?.addEventListener('click', () => {
    if (!isPoweredOn || playlist.length === 0) return;
    abMode = (abMode + 1) % 3;
    if (abMode === 1) {
        pointA = audio.currentTime;
        showStatusBriefly("POINT A SET");
    } else if (abMode === 2) {
        pointB = audio.currentTime;
        if (pointB <= pointA) pointB = pointA + 1;
        audio.currentTime = pointA;
        showStatusBriefly("LOOP ACTIVE");
    } else {
        showStatusBriefly("LOOP OFF");
    }
    updateVFDStatusDisplay();
});

audio.addEventListener('timeupdate', () => {
    if (isPoweredOn && timeDisplay && !isNaN(audio.currentTime)) {
        if (abMode === 2 && audio.currentTime >= pointB) {
            audio.currentTime = pointA;
        }
        let displaySeconds = (isShowingRemaining && !isNaN(audio.duration)) ? audio.duration - audio.currentTime : audio.currentTime;
        const mins = Math.floor(displaySeconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(displaySeconds % 60).toString().padStart(2, '0');
        timeDisplay.textContent = `${isShowingRemaining ? '-' : ''}${mins}:${secs}`;
    }
});

function updateVolumeDisplay() {
    audio.volume = currentVolume;
    volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;
    showVolumeBriefly();
}

volumeKnob.addEventListener('mousedown', (e) => {
    if (!isPoweredOn) return;
    const rect = volumeKnob.getBoundingClientRect();
    const isRightSide = (e.clientX - rect.left) > rect.width / 2;
    currentVolume = isRightSide ? Math.min(1, currentVolume + 0.01) : Math.max(0, currentVolume - 0.01);
    updateVolumeDisplay();
    clearInterval(volHoldInterval);
    volHoldInterval = setInterval(() => {
        currentVolume = isRightSide ? Math.min(1, currentVolume + 0.01) : Math.max(0, currentVolume - 0.01);
        updateVolumeDisplay();
    }, 50);
});

window.addEventListener('mouseup', () => clearInterval(volHoldInterval));
volumeKnob.addEventListener('mouseenter', showVolumeBriefly);
volumeKnob.addEventListener('wheel', (e) => {
    if (!isPoweredOn) return;
    e.preventDefault();
    currentVolume = e.deltaY < 0 ? Math.min(1, currentVolume + 0.05) : Math.max(0, currentVolume - 0.05);
    updateVolumeDisplay();
});

audio.onended = () => {
    if (!isPoweredOn) return;
    if (repeatMode === 1) loadTrack(currentIndex);
    else if (isRandom && playlist.length > 1) {
        let n; do { n = Math.floor(Math.random() * playlist.length); } while (n === currentIndex);
        loadTrack(n);
    } else if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
    else if (repeatMode === 2) loadTrack(0);
    else updateStatusIcon('stop');
};

function animate() {
    requestAnimationFrame(animate);
    if (analyserL && analyserR && !audio.paused && isPoweredOn) {
        analyserL.getByteFrequencyData(dataArrayL);
        let levelL = dataArrayL.reduce((a, b) => a + b) / dataArrayL.length;
        let normalizedL = Math.pow(Math.min(255, levelL * 1.8) / 255, 0.7);
        targetAngleL = -55 + normalizedL * 95;

        analyserR.getByteFrequencyData(dataArrayR);
        let levelR = dataArrayR.reduce((a, b) => a + b) / dataArrayR.length;
        let normalizedR = Math.pow(Math.min(255, levelR * 1.8) / 255, 0.7);
        targetAngleR = -55 + normalizedR * 95;

        currentAngleL += (targetAngleL - currentAngleL) * 0.25;
        currentAngleR += (targetAngleR - currentAngleR) * 0.25;
    } else {
        currentAngleL += (-55 - currentAngleL) * 0.1;
        currentAngleR += (-55 - currentAngleR) * 0.1;
    }
    nl.style.transform = `rotate(${currentAngleL}deg)`;
    nr.style.transform = `rotate(${currentAngleR}deg)`;
}
animate();

const optionsPopup = document.getElementById('options-popup');
const btnOpt = document.getElementById('options-btn');
function toggleOptions(e) {
    if (!isPoweredOn) return;
    e.stopPropagation();
    const isVisible = optionsPopup.style.display === 'block';
    optionsPopup.style.display = isVisible ? 'none' : 'block';
}
btnOpt?.addEventListener('click', toggleOptions);

const displayBtn = document.getElementById('display-btn');
if (displayBtn) {
    displayBtn.addEventListener('click', () => {
        if (!isPoweredOn) return;
        const vfd = document.getElementById('vfd');
        const meterContainer = document.querySelector('.meter-container');
        vfd.classList.toggle('vfd-off');
        meterContainer.classList.toggle('stealth-mode');
    });
}

const playlistPopup = document.getElementById('playlist-popup');
const playlistItemsContainer = document.getElementById('playlist-items');
const trackCountTrigger = document.getElementById('track-count');

trackCountTrigger.style.cursor = "pointer";
trackCountTrigger.addEventListener('click', (e) => {
    if (!isPoweredOn || playlist.length === 0) return;
    e.stopPropagation();
    playlistItemsContainer.innerHTML = "";
    playlist.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentIndex ? 'active-track' : ''}`;
        item.innerHTML = `<span>${index + 1}. ${file.name.toUpperCase()}</span>`;
        item.addEventListener('click', () => {
            loadTrack(index);
            playlistPopup.style.display = 'none';
        });
        playlistItemsContainer.appendChild(item);
    });
    playlistPopup.style.display = 'block';
});

document.addEventListener('click', (e) => {
    if (optionsPopup?.style.display === 'block' && !optionsPopup.contains(e.target) && e.target !== btnOpt) {
        optionsPopup.style.display = 'none';
    }
    if (playlistPopup.style.display === 'block' && !playlistPopup.contains(e.target)) {
        playlistPopup.style.display = 'none';
    }
});

if (vfdLarge) {
    vfdLarge.style.cursor = "pointer";
    vfdLarge.addEventListener('click', (e) => {
        if (!isPoweredOn || playlist.length === 0) return;
        e.stopPropagation();
        const file = playlist[currentIndex];
        if (window.jsmediatags) {
            window.jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const image = tag.tags.picture;
                    if (image) {
                        let base64String = "";
                        for (let i = 0; i < image.data.length; i++) {
                            base64String += String.fromCharCode(image.data[i]);
                        }
                        const base64 = window.btoa(base64String);
                        popupImg.src = `data:${image.format};base64,${base64}`;
                        albumOverlay.style.display = 'block';
                        albumPopup.style.display = 'block';
                    } else {
                        showStatusBriefly("NO ALBUM ART");
                    }
                },
                onError: () => showStatusBriefly("TAG ERROR")
            });
        }
    });
}

if (albumOverlay) {
    albumOverlay.addEventListener('click', () => {
        albumOverlay.style.display = 'none';
        albumPopup.style.display = 'none';
    });
}

if (timeDisplay) {
    timeDisplay.style.cursor = "pointer";
    timeDisplay.addEventListener('click', (e) => {
        if (!isPoweredOn) return;
        e.stopPropagation();
        isShowingRemaining = !isShowingRemaining;
        showStatusBriefly(isShowingRemaining ? "REMAINING TIME" : "ELAPSED TIME");
    });
}

function updateMediaMetadata() {
    if ('mediaSession' in navigator && playlist.length > 0) {
        const file = playlist[currentIndex];
        navigator.mediaSession.metadata = new MediaMetadata({
            title: vfdLarge.textContent || file.name,
            artist: vfdInfo.textContent.split('–')[0].trim() || "McIntosh",
            album: "McIntosh Hi-Fi System",
            artwork: [{ src: popupImg.src, sizes: '512x512', type: 'image/png' }]
        });
    }
}

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => { if (isPoweredOn) audio.play(); updateStatusIcon('play'); });
    navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); updateStatusIcon('pause'); });
    navigator.mediaSession.setActionHandler('previoustrack', () => { if (isPoweredOn && currentIndex > 0) loadTrack(currentIndex - 1); });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (!isPoweredOn) return;
        if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
        else if (repeatMode === 2) loadTrack(0);
    });
}

const originalLoadTrack = loadTrack;
loadTrack = function (index) {
    originalLoadTrack(index);
    setTimeout(updateMediaMetadata, 500);
};