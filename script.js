// --- IMPORT COMPATIBLE ---
let McIntoshAudioEngine;

if (typeof require !== 'undefined') {
    // On est dans Electron
    McIntoshAudioEngine = require('./js/mcintosh-audio-engine.js');
} else {
    // On est dans le Web (le fichier doit être chargé dans le HTML avant script.js)
    McIntoshAudioEngine = window.McIntoshAudioEngine;
}

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

// --- INITIALISATION DU MOTEUR ---
const engine = new McIntoshAudioEngine(audio);

// --- SELECTEURS REBOOT ---
const rebootModal = document.getElementById('reboot-modal');
const btnYes = document.getElementById('reboot-yes');
const btnNo = document.getElementById('reboot-no');

// --- SELECTEURS EQ (BASS/TREBLE) ---
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
const noCoverText = document.getElementById('no-cover-text');

// --- SELECTEURS LIBRARY ---
const libBtn = document.getElementById('library-btn');
const modal = document.getElementById('library-modal');
const closeBtn = document.querySelector('.close-btn');
const folderInput = document.getElementById('folder-input');
const fileList = document.getElementById('file-list');

// --- VARIABLES ---
let playlist = [];
let currentIndex = 0;
let isPoweredOn = false;
let isMuted = false;
let isShowingRemaining = false;
let volTimeout = null;
let bassGain = 0;
let trebleGain = 0;
let currentBalance = 0;
let isLoudnessActive = false;
let isMonoActive = false;
let isBypassActive = false;
let bypassSnapshot = null;

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
let abMode = 0;
let pointA = 0;
let pointB = 0;
let volHoldInterval = null;

// --- INITIALISATION VOLUME ---
let currentVolume = 0.05;
engine.setVolume(currentVolume);
if (volumeKnob) volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;

// --- FONCTIONS UTILITAIRES ---
function fitText(element, maxFontSize) {
    if (!element) return;
    let fontSize = maxFontSize;
    element.style.fontSize = fontSize + "px";
    while (element.scrollWidth > element.offsetWidth && fontSize > 12) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

function showStatusBriefly(text) {
    if (!isPoweredOn || !volDisplay) return;
    clearTimeout(volTimeout);
    volDisplay.textContent = text;
    volDisplay.style.opacity = "1";
    volTimeout = setTimeout(() => { volDisplay.style.opacity = "0"; }, 2000);
}

function showVolumeBriefly() {
    if (isMuted) {
        clearTimeout(volTimeout);
        volDisplay.textContent = "MUTE";
        volDisplay.style.opacity = "1";
    } else {
        showStatusBriefly(`VOL: ${Math.round(currentVolume * 100)}%`);
    }
}

function updateStatusIcon(state) {
    if (!isPoweredOn || !statusIcon) return;
    statusIcon.className = "";
    if (state === 'play') statusIcon.innerHTML = 'PLAY<i class="fas fa-play"></i>';
    else if (state === 'pause') { statusIcon.innerHTML = 'PAUSE<i class="fas fa-pause"></i>'; statusIcon.classList.add('blink-soft'); }
    else if (state === 'stop') statusIcon.innerHTML = 'STOP<i class="fas fa-stop"></i>';
}

function applyLoudnessEffect() {
    engine.updateEQ(bassGain, trebleGain, isLoudnessActive);
}

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

// --- POWER (avec popup reboot) ---
pwr?.addEventListener('click', () => {
    rebootModal.style.display = 'flex';
});
btnYes?.addEventListener('click', () => {
    location.reload();
});
btnNo?.addEventListener('click', () => {
    rebootModal.style.display = 'none';
});

// --- ENGINE INIT ---
function initEngine() {
    engine.init();
}

// --- BALANCE & EQ (BASS/TREBLE) ---
function showBalanceStatus() {
    let balText = "BAL: CENTER";
    if (currentBalance < -0.05) balText = `BAL: ${Math.round(Math.abs(currentBalance) * 100)}% L`;
    else if (currentBalance > 0.05) balText = `BAL: ${Math.round(currentBalance * 100)}% R`;
    showStatusBriefly(balText);
}
function setBalance(val) {
    if (isPoweredOn && !isMonoActive) {
        currentBalance = Math.max(-1, Math.min(1, val));
        engine.setBalance(currentBalance);
        showBalanceStatus();
    }
}

// balance listeners définis plus bas avec le knob

const eqBtns = [
    { b: bassUp, f: () => bassGain = Math.min(12, bassGain + 2), t: 'BASS' },
    { b: bassDown, f: () => bassGain = Math.max(-12, bassGain - 2), t: 'BASS' },
    { b: trebleUp, f: () => trebleGain = Math.min(12, trebleGain + 2), t: 'TREBLE' },
    { b: trebleDown, f: () => trebleGain = Math.max(-12, trebleGain - 2), t: 'TREBLE' }
];
eqBtns.forEach(item => {
    item.b?.addEventListener('click', () => { if (isPoweredOn && !isBypassActive) { item.f(); applyLoudnessEffect(); showStatusBriefly(`${item.t}: ${(item.t === 'BASS' ? bassGain : trebleGain) > 0 ? '+' : ''}${item.t === 'BASS' ? bassGain : trebleGain}dB`); } });
    item.b?.addEventListener('mouseenter', () => { if (isPoweredOn) { showStatusBriefly(`${item.t}: ${(item.t === 'BASS' ? bassGain : trebleGain) > 0 ? '+' : ''}${item.t === 'BASS' ? bassGain : trebleGain}dB`); } });
});
toneReset?.addEventListener('click', () => { if (isPoweredOn) { bassGain = 0; trebleGain = 0; currentBalance = 0; if (!isMonoActive) engine.setBalance(0); applyLoudnessEffect(); showStatusBriefly("TONE FLAT"); } });
toneReset?.addEventListener('mouseenter', () => isPoweredOn && showStatusBriefly("TONE RESET"));

// --- TRACK LOADING & COVERS ---
function loadTrack(index) {
    if (playlist.length === 0 || !isPoweredOn) return;
    currentIndex = index; abMode = 0; updateVFDStatusDisplay();
    const file = playlist[currentIndex];
    trackCount.textContent = `${currentIndex + 1}/${playlist.length}`;

    // Format affiché
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    fileFormat.textContent = (ext === 'm4a') ? "AAC/ALAC" : ext.toUpperCase();

    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const kbps = Math.round(((file.size * 8) / audio.duration) / 1000);
            bitrateDisplay.textContent = kbps + " KBPS";
        } else {
            bitrateDisplay.textContent = "—";
        }
    };

    if (window.jsmediatags) {
        window.jsmediatags.read(file, {
            onSuccess: (tag) => {
                const t = tag.tags;
                vfdLarge.textContent = (t.title || file.name).toUpperCase();
                vfdInfo.textContent = `${t.artist || "UNKNOWN"} – ${t.album || "UNKNOWN"}`.toUpperCase();
                setTimeout(() => fitText(vfdLarge, 30), 10);
                const img = t.picture;
                if (img) {
                    let s = ""; for (let i = 0; i < img.data.length; i++) s += String.fromCharCode(img.data[i]);
                    popupImg.src = `data:${img.format};base64,${window.btoa(s)}`;
                    popupImg.style.display = 'block';
                    noCoverText && (noCoverText.style.display = 'none');
                } else {
                    popupImg.src = "";
                    popupImg.style.display = 'none';
                    noCoverText && (noCoverText.style.display = 'flex');
                }
                updateMediaMetadata();
            },
            onError: () => {
                vfdLarge.textContent = file.name.toUpperCase();
                vfdInfo.textContent = "ARTIST – ALBUM";
                setTimeout(() => fitText(vfdLarge, 30), 10);
                popupImg.src = "";
                popupImg.style.display = 'none';
                noCoverText && (noCoverText.style.display = 'flex');
                updateMediaMetadata();
            }
        });
    }
    engine.init();
    engine.play().then(() => updateStatusIcon('play'));
}

// --- CLICS INTERACTIFS ---
vfdLarge?.addEventListener('click', (e) => {
    if (!isPoweredOn) return;
    e.stopPropagation(); albumOverlay.style.display = 'block'; albumPopup.style.display = 'block';
});
albumOverlay?.addEventListener('click', () => { albumOverlay.style.display = 'none'; albumPopup.style.display = 'none'; });

timeDisplay?.addEventListener('click', (e) => {
    if (!isPoweredOn) return;
    e.stopPropagation(); isShowingRemaining = !isShowingRemaining;
    showStatusBriefly(isShowingRemaining ? "REMAINING TIME" : "ELAPSED TIME");
});

// --- AUDIO EVENTS ---
audio.addEventListener('timeupdate', () => {
    if (!isPoweredOn || isNaN(audio.currentTime)) return;
    if (abMode === 2 && audio.currentTime >= pointB) audio.currentTime = pointA;

    // Position state (Chrome)
    if ('mediaSession' in navigator && !isNaN(audio.duration)) {
        navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate,
            position: audio.currentTime
        });
    }

    let s = isShowingRemaining ? audio.duration - audio.currentTime : audio.currentTime;
    s = Math.max(0, s);
    const m = Math.floor(s / 60).toString().padStart(2, '0'), sec = Math.floor(s % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${isShowingRemaining ? '-' : ''}${m}:${sec}`;
});

// --- MONO ---
document.getElementById('mono-btn')?.addEventListener('click', () => {
    if (!isPoweredOn) return;
    engine.init();
    isMonoActive = !isMonoActive;
    const ledMono = document.getElementById('led-mono');
    if (isMonoActive) {
        engine.setBalance(0);
        ledMono?.classList.add('active'); showStatusBriefly("MODE: MONO");
    } else {
        engine.setBalance(currentBalance);
        ledMono?.classList.remove('active'); showStatusBriefly("MODE: STEREO");
    }
});

// --- SEEKING ---
function startSeeking(dir) {
    if (!isPoweredOn || playlist.length === 0) return;
    isMouseDown = true; isSeeking = false; seekStartTime = Date.now();
    clearInterval(seekInterval);
    seekInterval = setInterval(() => {
        if (isMouseDown && Date.now() - seekStartTime > 500) {
            isSeeking = true; audio.currentTime += (dir === 'next' ? 3 : -3);
        }
    }, 100);
}

function stopSeeking(dir) {
    if (!isMouseDown) return;
    clearInterval(seekInterval);

    if (isPoweredOn && playlist.length > 0 && !isSeeking) {
        if (dir === 'next') {
            if (isRandom && playlist.length > 1) {
                let n; do { n = Math.floor(Math.random() * playlist.length); } while (n === currentIndex);
                loadTrack(n);
            } else if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
            else if (repeatMode === 2) loadTrack(0);
        } else {
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
                if (audio.paused) engine.play();
            } else {
                if (currentIndex > 0) { loadTrack(currentIndex - 1); }
                else if (repeatMode === 2) { loadTrack(playlist.length - 1); }
                else { audio.currentTime = 0; }
            }
        }
    }
    isSeeking = false;
    isMouseDown = false;
}

nextBtn?.addEventListener('mousedown', () => startSeeking('next'));
nextBtn?.addEventListener('mouseup', () => stopSeeking('next'));
nextBtn?.addEventListener('mouseleave', () => stopSeeking('next'));
prevBtn?.addEventListener('mousedown', () => startSeeking('prev'));
prevBtn?.addEventListener('mouseup', () => stopSeeking('prev'));
prevBtn?.addEventListener('mouseleave', () => stopSeeking('prev'));

// --- PLAYLIST POPUP ---
trackCount?.addEventListener('click', (e) => {
    if (!isPoweredOn || playlist.length === 0) return;
    e.stopPropagation();
    const container = document.getElementById('playlist-items');
    if (!container) return;
    container.innerHTML = "";
    playlist.forEach((f, i) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${i === currentIndex ? 'active-track' : ''}`;
        item.innerHTML = `<span>${i + 1}. ${f.name.toUpperCase()}</span>`;
        item.onclick = () => { loadTrack(i); const pp = document.getElementById('playlist-popup'); if (pp) pp.style.display = 'none'; };
        container.appendChild(item);
    });
    const pp = document.getElementById('playlist-popup');
    if (pp) pp.style.display = 'block';
});

// --- AUTRES CONTROLES ---
inputBtn?.addEventListener('click', () => fileUpload?.click());
fileUpload?.addEventListener('change', (e) => { if (e.target.files.length > 0) { if (!isPoweredOn) { isPoweredOn = true; } playlist = Array.from(e.target.files); loadTrack(0); } });
playPauseBtn?.addEventListener('click', () => { 
    if (!isPoweredOn || playlist.length === 0) return; 
    engine.init(); 
    if (audio.paused) {
        engine.play();
        updateStatusIcon('play');
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('update-thumbar', true);
        }
    } else {
        engine.pause();
        updateStatusIcon('pause');
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('update-thumbar', false);
        }
    }
});
stopBtn?.addEventListener('click', () => { 
    if (isPoweredOn) { 
        engine.stop(); 
        updateStatusIcon('stop');
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('update-thumbar', false);
        }
    } 
});
muteBtn?.addEventListener('click', () => { if (isPoweredOn) { isMuted = !isMuted; audio.muted = isMuted; showVolumeBriefly(); } });
document.getElementById('loudness-btn')?.addEventListener('click', () => { if (isPoweredOn && !isBypassActive) { isLoudnessActive = !isLoudnessActive; document.getElementById('vfd-loudness-text')?.classList.toggle('loudness-visible', isLoudnessActive); applyLoudnessEffect(); } });

document.getElementById('bypass-btn')?.addEventListener('click', () => {
    if (!isPoweredOn) return;
    isBypassActive = !isBypassActive;
    const vfdPreset = document.getElementById('vfd-preset-display');
    const eqSliders = document.querySelectorAll('.eq-band input');

    if (isBypassActive) {
        // Sauvegarder l'état complet
        bypassSnapshot = {
            bassGain,
            trebleGain,
            isLoudnessActive,
            eqBands: Array.from(eqSliders).map(s => ({ freq: s.getAttribute('data-freq'), value: parseFloat(s.value) })),
            vfdPresetText: vfdPreset?.innerText || ''
        };
        // Tout couper
        engine.updateEQ(0, 0, false);
        eqSliders.forEach(s => {
            s.value = 0;
            if (engine.setCustomFilter) engine.setCustomFilter(s.getAttribute('data-freq'), 0);
        });
        // VFD
        if (vfdPreset) vfdPreset.innerText = ' | BYPASS';
        document.getElementById('vfd-loudness-text')?.classList.remove('loudness-visible');
        showStatusBriefly('BYPASS ON');
    } else {
        // Restaurer l'état sauvegardé
        if (bypassSnapshot) {
            bassGain = bypassSnapshot.bassGain;
            trebleGain = bypassSnapshot.trebleGain;
            isLoudnessActive = bypassSnapshot.isLoudnessActive;
            bypassSnapshot.eqBands.forEach(b => {
                const slider = document.querySelector(`.eq-band input[data-freq="${b.freq}"]`);
                if (slider) slider.value = b.value;
                if (engine.setCustomFilter) engine.setCustomFilter(b.freq, b.value);
            });
            engine.updateEQ(bassGain, trebleGain, isLoudnessActive);
            if (vfdPreset) vfdPreset.innerText = bypassSnapshot.vfdPresetText;
            document.getElementById('vfd-loudness-text')?.classList.toggle('loudness-visible', isLoudnessActive);
        }
        showStatusBriefly('BYPASS OFF');
    }
});

// --- FONCTION LIBRARY ---
libBtn && (libBtn.onclick = () => { if (isPoweredOn) modal.style.display = "block"; else showStatusBriefly("POWER ON FIRST"); });
closeBtn && (closeBtn.onclick = () => modal.style.display = "none");

folderInput && (folderInput.onchange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('audio/') || f.name.endsWith('.m4a') || f.name.endsWith('.aac') || f.name.endsWith('.ogg'));
    if (files.length > 0) {
        playlist = files;
        if (fileList) fileList.innerHTML = "";
        playlist.forEach((file, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span style="color:var(--mc-led-green)">▶</span> ${file.name.toUpperCase()}`;
            li.onclick = () => { loadTrack(index); modal.style.display = "none"; };
            fileList?.appendChild(li);
        });
        showStatusBriefly(`${playlist.length} TRACKS LOADED`);
    }
});

// --- DISPLAY BUTTON ---
document.getElementById('display-btn')?.addEventListener('click', () => {
    if (!isPoweredOn) return;
    const mainLogo = document.getElementById('logo-main');
    const altLogo = document.getElementById('logo-alt');
    if (mainLogo && altLogo) {
        const isMainHidden = mainLogo.style.display === 'none';
        mainLogo.style.setProperty('display', isMainHidden ? 'block' : 'none', 'important');
        altLogo.style.setProperty('display', isMainHidden ? 'none' : 'block', 'important');
    }
    document.querySelectorAll('.meter').forEach(m => m.classList.toggle('meter-alt-bg'));
    document.getElementById('vfd')?.classList.toggle('force-off');
    document.querySelectorAll('.label-green, .small-label').forEach(el => el.classList.toggle('label-off'));
});

document.getElementById('random-btn')?.addEventListener('click', () => { if (isPoweredOn) { isRandom = !isRandom; updateVFDStatusDisplay(); } });
document.getElementById('repeat-btn')?.addEventListener('click', () => { if (isPoweredOn) { repeatMode = (repeatMode + 1) % 3; updateVFDStatusDisplay(); } });
document.getElementById('ab-loop-btn')?.addEventListener('click', () => {
    if (!isPoweredOn || playlist.length === 0) return;
    abMode = (abMode + 1) % 3;
    if (abMode === 1) { pointA = audio.currentTime; showStatusBriefly("POINT A SET"); }
    else if (abMode === 2) { pointB = audio.currentTime; if (pointB <= pointA) pointB = pointA + 1; audio.currentTime = pointA; showStatusBriefly("LOOP ACTIVE"); }
    else { showStatusBriefly("LOOP OFF"); }
    updateVFDStatusDisplay();
});

// --- VU-METRES ---
function animate() {
    requestAnimationFrame(animate);
    const levels = engine.getLevels();

    if (!audio.paused && isPoweredOn) {
        targetAngleL = -55 + Math.pow(Math.min(255, levels.left * 1.8) / 255, 0.7) * 95;
        targetAngleR = -55 + Math.pow(Math.min(255, levels.right * 1.8) / 255, 0.7) * 95;
        currentAngleL += (targetAngleL - currentAngleL) * 0.25;
        currentAngleR += (targetAngleR - currentAngleR) * 0.25;
    } else {
        currentAngleL += (-55 - currentAngleL) * 0.1;
        currentAngleR += (-55 - currentAngleR) * 0.1;
    }
    nl && (nl.style.transform = `rotate(${currentAngleL}deg)`);
    nr && (nr.style.transform = `rotate(${currentAngleR}deg)`);
}
animate();

// --- VOLUME ---
function updateVolumeDisplay() {
    engine.setVolume(currentVolume);
    if (volumeKnob) volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;
    applyLoudnessEffect();
    showVolumeBriefly();
    const pgL = document.getElementById('led-pg-l');
    const pgR = document.getElementById('led-pg-r');
    if (isPoweredOn && currentVolume >= 0.90) {
        pgL?.classList.add('blink-fast'); pgR?.classList.add('blink-fast');
    } else {
        pgL?.classList.remove('blink-fast'); pgR?.classList.remove('blink-fast');
    }
}
volumeKnob?.addEventListener('mousedown', (e) => {
    if (!isPoweredOn) return;
    const rect = volumeKnob.getBoundingClientRect();
    const isRight = (e.clientX - rect.left) > rect.width / 2;
    clearInterval(volHoldInterval);
    const change = () => { currentVolume = isRight ? Math.min(1, currentVolume + 0.01) : Math.max(0, currentVolume - 0.01); updateVolumeDisplay(); };
    change(); volHoldInterval = setInterval(change, 50);
});
window.addEventListener('mouseup', () => clearInterval(volHoldInterval));
volumeKnob?.addEventListener('mouseleave', () => clearInterval(volHoldInterval));
volumeKnob?.addEventListener('wheel', (e) => { if (isPoweredOn) { e.preventDefault(); currentVolume = e.deltaY < 0 ? Math.min(1, currentVolume + 0.05) : Math.max(0, currentVolume - 0.05); updateVolumeDisplay(); } });
volumeKnob?.addEventListener('mouseenter', () => { if (isPoweredOn) showVolumeBriefly(); });

// --- MEDIA SESSION ---
function updateMediaMetadata() { 
    if ('mediaSession' in navigator && playlist.length > 0) { 
        navigator.mediaSession.metadata = new MediaMetadata({ 
            title: vfdLarge.textContent, 
            artist: (vfdInfo.textContent.split('–')[0] || '').trim(),
            artwork: [
                { src: popupImg.src && popupImg.src.startsWith('data:') ? popupImg.src : 'assets/img/default.png', sizes: '512x512', type: 'image/png' }
            ]
        }); 
        
        navigator.mediaSession.setActionHandler('play', () => { 
            engine.play(); 
            updateStatusIcon('play');
            if (typeof require !== 'undefined') {
                const { ipcRenderer } = require('electron');
                ipcRenderer.send('update-thumbar', true);
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => { 
            engine.pause(); 
            updateStatusIcon('pause');
            if (typeof require !== 'undefined') {
                const { ipcRenderer } = require('electron');
                ipcRenderer.send('update-thumbar', false);
            }
        });
        
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
            } else if (currentIndex > 0) {
                loadTrack(currentIndex - 1);
            } else if (repeatMode === 2) {
                loadTrack(playlist.length - 1);
            }
        });
        
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            if (isRandom && playlist.length > 1) {
                let n; do { n = Math.floor(Math.random() * playlist.length); } while (n === currentIndex);
                loadTrack(n);
            } else if (currentIndex < playlist.length - 1) {
                loadTrack(currentIndex + 1);
            } else if (repeatMode === 2) {
                loadTrack(0);
            }
        });
    } 
}

audio.onended = () => {
    if (repeatMode === 1) loadTrack(currentIndex);
    else if (isRandom && playlist.length > 1) { let n; do { n = Math.floor(Math.random() * playlist.length); } while (n === currentIndex); loadTrack(n); }
    else if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
    else if (repeatMode === 2) loadTrack(0);
    else updateStatusIcon('stop');
};

// --- GESTION OPTION ET CLICS GLOBAUX ---
const optionsPopup = document.getElementById('options-popup');
document.getElementById('options-btn')?.addEventListener('click', (e) => {
    if (isPoweredOn) {
        e.stopPropagation();
        optionsPopup.style.display = optionsPopup.style.display === 'block' ? 'none' : 'block';
    }
});

document.addEventListener('click', (e) => {
    if (optionsPopup && !optionsPopup.contains(e.target)) optionsPopup.style.display = 'none';
    const pp = document.getElementById('playlist-popup');
    if (pp && !pp.contains(e.target)) pp.style.display = 'none';
    if (e.target == modal) modal.style.display = "none";
});

// --- ELECTRON SPECIFIC ---
if (typeof require !== 'undefined') {
    const { ipcRenderer } = require('electron');

    ipcRenderer.on('media-control', (event, action) => {
        if (!isPoweredOn) return;

        if (action === 'play-pause') {
            if (playlist.length > 0) {
                engine.init();
                if (audio.paused) {
                    engine.play();
                    updateStatusIcon('play');
                    ipcRenderer.send('update-thumbar', true);
                } else {
                    engine.pause();
                    updateStatusIcon('pause');
                    ipcRenderer.send('update-thumbar', false);
                }
            }
        }
        else if (action === 'next') {
            if (isRandom && playlist.length > 1) {
                let n; do { n = Math.floor(Math.random() * playlist.length); } while (n === currentIndex);
                loadTrack(n);
            } else if (currentIndex < playlist.length - 1) {
                loadTrack(currentIndex + 1);
            } else if (repeatMode === 2) {
                loadTrack(0);
            }
        }
        else if (action === 'prev') {
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
            } else if (currentIndex > 0) {
                loadTrack(currentIndex - 1);
            } else if (repeatMode === 2) {
                loadTrack(playlist.length - 1);
            }
        }
    });
}

function openInfo() {
    if (typeof isPoweredOn !== 'undefined' && !isPoweredOn) return;
    const overlay = document.getElementById('info-overlay-fix');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Changement de la couleur de fond de l'application
const bgPicker = document.getElementById('bg-picker');
bgPicker?.addEventListener('input', (e) => {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    const bgBtn = document.getElementById('background-color-btn');
    if (bgBtn) bgBtn.style.background = color;
});

// Changement de la couleur de l'ombre du châssis
const shadowPicker = document.getElementById('shadow-picker');
shadowPicker?.addEventListener('input', (e) => {
    const color = e.target.value;
    const chassis = document.querySelector('.amplifier-panel');
    if (chassis) {
        chassis.style.boxShadow = `0 60px 120px ${color}`;
    }
    const shBtn = document.getElementById('shadow-color-btn');
    if (shBtn) shBtn.style.background = color;
});

/* ------------------------------------------------------------------
   GESTION DE L'ÉGALISEUR 10 BANDES  (FUSION DES DEUX BLOCS)
------------------------------------------------------------------- */

// Sélecteurs uniques (pas de redéclarations)
const eqBtn = document.getElementById('eq-btn');
const eqPopup = document.getElementById('eq-popup');
const closeEq = document.getElementById('close-eq');
const eqResetBtn = document.getElementById('eq-reset-btn');
const eqSliders = document.querySelectorAll('.eq-band input'); // cible uniquement les sliders EQ
const eqCanvas = document.getElementById('eq-curve');
const eqCtx = eqCanvas?.getContext('2d');
const displayElement = document.getElementById('eq-preset-name-display');


const presetLabels = {
    'eq-pop-btn': 'POP',
    'eq-rock-btn': 'ROCK',
    'eq-jazz-btn': 'JAZZ',
    'eq-classic-btn': 'CLASSIC',
    'eq-live-btn': 'LIVE',
    'eq-reset-btn': 'FLAT'
};

const eqPresets = {
    'eq-pop-btn':     [3, 2, 1, 0, 1, 2, 2, 1, 1, 2],
    'eq-rock-btn':    [5, 4, 2, 0, -1, 0, 1, 2, 4, 5],
    'eq-jazz-btn':    [2, 1, 0, 1, 2, 2, 1, 0, 0, -1],
    'eq-classic-btn': [4, 3, 2, 0, 0, 0, 0, 2, 3, 4],
    'eq-live-btn':    [6, 4, 2, 0, 1, 2, 4, 5, 3, 2],
    'eq-reset-btn':   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};


function drawEQCurve() {
    if (!eqCanvas || !eqCtx) return;
    const width = eqCanvas.width = eqCanvas.offsetWidth;
    const height = eqCanvas.height = eqCanvas.offsetHeight;
    eqCtx.clearRect(0, 0, width, height);

    // Grille
    eqCtx.strokeStyle = "#1a1a1a";
    eqCtx.lineWidth = 1;
    eqCtx.beginPath();
    for(let i = 1; i < 4; i++) {
        let y = (height / 4) * i;
        eqCtx.moveTo(0, y); eqCtx.lineTo(width, y);
    }
    eqCtx.stroke();

    // Points
    const points = Array.from(eqSliders).map((slider, index) => {
        const x = (width / (eqSliders.length - 1)) * index;
        const y = (height / 2) - (slider.value * (height / 26));
        return {x, y};
    });

    // Courbe "McIntosh"
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

// Appliquer un preset (unique, fusion des comportements)
function applyPreset(btnId) {
    if (!isPoweredOn) return;
    
    const gains = eqPresets[btnId];
    if (!gains) return;

    // 1. Appliquer les gains aux sliders et au moteur audio
    eqSliders.forEach((slider, index) => {
        slider.value = gains[index];
        const freq = slider.getAttribute('data-freq');
        if (engine?.setCustomFilter) engine.setCustomFilter(freq, gains[index]);
    });

    // 2. Préparer le nom du preset pour l'affichage
    // On transforme "eq-rock-btn" en "ROCK"
    let presetName = btnId.replace('eq-', '').replace('-btn', '').toUpperCase();
    
    // 3. Logique d'affichage sur le VFD (à côté du bitrate)
    const vfdPresetElement = document.getElementById('vfd-preset-display');
    if (vfdPresetElement) {
        if (presetName === 'RESET' || presetName === 'FLAT') {
            vfdPresetElement.innerText = ""; // On cache si c'est FLAT
        } else {
            vfdPresetElement.innerText = " | EQ " + presetName; // On affiche avec un séparateur
        }
    }

    // 4. Mise à jour de ton grand affichage central (optionnel)
    if (displayElement) {
        displayElement.innerText = (presetName === 'RESET') ? 'FLAT' : presetName;
    }

    // Feedback visuel
    showStatusBriefly("PRESET: " + (presetName === 'RESET' ? 'FLAT' : presetName));
    if (typeof drawEQCurve === 'function') drawEQCurve();
}

// Ouvrir la pop-up EQ
eqBtn?.addEventListener('click', (e) => {
    if (isPoweredOn) {
        e.stopPropagation();
        eqPopup.style.display = 'block';
        setTimeout(drawEQCurve, 50); // s'assurer que canvas est visible
    } else {
        showStatusBriefly("POWER ON FIRST");
    }
});

// Fermer la pop-up EQ
closeEq?.addEventListener('click', () => {
    eqPopup.style.display = 'none';
});
eqPopup?.addEventListener('click', (e) => e.stopPropagation());

// Sliders (manuel)
eqSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        if (isBypassActive) return;
        const freq = e.target.getAttribute('data-freq');
        const gain = e.target.value;
        if (engine.setCustomFilter) engine.setCustomFilter(freq, gain);
        drawEQCurve();
        if (displayElement) displayElement.innerText = "CUSTOM";
        const vfdPresetElement = document.getElementById('vfd-preset-display');
        if (vfdPresetElement) vfdPresetElement.innerText = " | EQ CUSTOM";
        showStatusBriefly(`${freq}Hz: ${gain > 0 ? '+' : ''}${gain}dB`);
    });
});

// Bouton RESET (FLAT)
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
    if (displayElement) displayElement.innerText = 'FLAT';
    showStatusBriefly("EQ FLAT (0dB)");
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

// (Optionnel) Mise à jour du label si clic sur bouton (sans appliquer, au cas où)
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

// Init EQ
if (displayElement) displayElement.innerText = "FLAT";

// ================================
// EQUALIZER & BALANCE — même logique que VOLUME
// mousedown gauche/droite + wheel
// ================================
const eqPresetKeys = ['eq-reset-btn', 'eq-pop-btn', 'eq-rock-btn', 'eq-jazz-btn', 'eq-classic-btn', 'eq-live-btn'];
let currentPresetIndex = 0;
let eqKnobAngle = 0;
let eqHoldInterval = null;
const equalizerKnob = document.getElementById('equalizer-knob');

equalizerKnob?.addEventListener('mousedown', (e) => {
    if (!isPoweredOn) return;
    const rect = equalizerKnob.getBoundingClientRect();
    const isRight = (e.clientX - rect.left) > rect.width / 2;
    clearInterval(eqHoldInterval);
    const change = () => {
        eqKnobAngle += isRight ? 60 : -60;
        equalizerKnob.style.transform = `rotate(${eqKnobAngle}deg)`;
        currentPresetIndex = (currentPresetIndex + (isRight ? 1 : -1) + eqPresetKeys.length) % eqPresetKeys.length;
        applyPreset(eqPresetKeys[currentPresetIndex]);
    };
    change();
    eqHoldInterval = setInterval(change, 300);
});
window.addEventListener('mouseup', () => clearInterval(eqHoldInterval));
equalizerKnob?.addEventListener('mouseleave', () => clearInterval(eqHoldInterval));
equalizerKnob?.addEventListener('wheel', (e) => {
    if (!isPoweredOn) return;
    e.preventDefault();
    eqKnobAngle += e.deltaY < 0 ? 60 : -60;
    equalizerKnob.style.transform = `rotate(${eqKnobAngle}deg)`;
    currentPresetIndex = (currentPresetIndex + (e.deltaY < 0 ? 1 : -1) + eqPresetKeys.length) % eqPresetKeys.length;
    applyPreset(eqPresetKeys[currentPresetIndex]);
});

let balKnobAngle = 0;
let balHoldInterval = null;
const balanceKnob = document.getElementById('balance-knob');

function applyBalance(isRight) {
    const step = 0.02;
    const prev = currentBalance;
    const next = currentBalance + (isRight ? step : -step);
    // Snap au centre si on croise 0
    if ((prev < 0 && next > 0) || (prev > 0 && next < 0)) {
        setBalance(0);
        balKnobAngle = 0;
    } else {
        setBalance(next);
        balKnobAngle += isRight ? 4 : -4;
    }
    balanceKnob.style.transform = `rotate(${balKnobAngle}deg)`;
}

balanceKnob?.addEventListener('mousedown', (e) => {
    if (!isPoweredOn) return;
    const rect = balanceKnob.getBoundingClientRect();
    const isRight = (e.clientX - rect.left) > rect.width / 2;
    clearInterval(balHoldInterval);
    const change = () => applyBalance(isRight);
    change();
    balHoldInterval = setInterval(change, 50);
});
window.addEventListener('mouseup', () => clearInterval(balHoldInterval));
balanceKnob?.addEventListener('mouseleave', () => clearInterval(balHoldInterval));
balanceKnob?.addEventListener('wheel', (e) => {
    if (!isPoweredOn) return;
    e.preventDefault();
    applyBalance(e.deltaY < 0);
});
balanceKnob?.addEventListener('mouseenter', () => isPoweredOn && showBalanceStatus());
