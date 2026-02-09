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

// --- SELECTEURS LIBRARY (AJOUTÉS) ---
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
        modeIndicator.style.cssText = "position: absolute; bottom: 8px; left: 15px; color: var(--mc-led-green, #00ff66); font-size: 11px; font-weight: bold; text-shadow: 0 0 5px rgba(0,255,102,0.5); display: flex; gap: 10px;";
        document.getElementById('vfd')?.appendChild(modeIndicator);
    }
    let repeatText = repeatMode === 1 ? "REPEAT(1)" : (repeatMode === 2 ? "REPEAT(ALL)" : "");
    let abText = abMode === 1 ? "A-" : (abMode === 2 ? "A-B" : "");
    modeIndicator.innerHTML = `<span>${isRandom ? "RANDOM" : ""}</span><span>${repeatText}</span><span style="color: #00ff66;">${abText}</span>`;
}

// --- POWER (MODIFIÉ AVEC POPUP REBOOT) ---
pwr.addEventListener('click', () => {
    rebootModal.style.display = 'flex';
});

btnYes.addEventListener('click', () => {
    location.reload();
});

btnNo.addEventListener('click', () => {
    rebootModal.style.display = 'none';
});

// --- ENGINE INIT ---
function initEngine() {
    engine.init();
}

// --- BALANCE & EQ ---
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

balL?.addEventListener('click', () => setBalance(currentBalance - 0.1));
balR?.addEventListener('click', () => setBalance(currentBalance + 0.1));
balL?.addEventListener('mouseenter', () => isPoweredOn && showBalanceStatus());
balR?.addEventListener('mouseenter', () => isPoweredOn && showBalanceStatus());

const eqBtns = [
    { b: bassUp, f: () => bassGain = Math.min(12, bassGain + 2), t: 'BASS' },
    { b: bassDown, f: () => bassGain = Math.max(-12, bassGain - 2), t: 'BASS' },
    { b: trebleUp, f: () => trebleGain = Math.min(12, trebleGain + 2), t: 'TREBLE' },
    { b: trebleDown, f: () => trebleGain = Math.max(-12, trebleGain - 2), t: 'TREBLE' }
];
eqBtns.forEach(item => {
    item.b?.addEventListener('click', () => { if (isPoweredOn) { item.f(); applyLoudnessEffect(); showStatusBriefly(`${item.t}: ${(item.t === 'BASS' ? bassGain : trebleGain) > 0 ? '+' : ''}${item.t === 'BASS' ? bassGain : trebleGain}dB`); } });
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
    fileFormat.textContent = file.name.split('.').pop().toUpperCase();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => bitrateDisplay.textContent = Math.round(((file.size * 8) / audio.duration) / 1000) + " KBPS";

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
                } else { popupImg.src = ""; }
                updateMediaMetadata();
            },
            onError: () => { vfdLarge.textContent = file.name.toUpperCase(); vfdInfo.textContent = "ARTIST – ALBUM"; setTimeout(() => fitText(vfdLarge, 30), 10); }
        });
    }
    engine.init(); 
    engine.play().then(() => updateStatusIcon('play'));
}

// --- CLICS INTERACTIFS ---
vfdLarge.addEventListener('click', (e) => {
    if (!isPoweredOn || !popupImg.src.includes('data:')) return;
    e.stopPropagation(); albumOverlay.style.display = 'block'; albumPopup.style.display = 'block';
});
albumOverlay.addEventListener('click', () => { albumOverlay.style.display = 'none'; albumPopup.style.display = 'none'; });

timeDisplay.addEventListener('click', (e) => {
    if (!isPoweredOn) return;
    e.stopPropagation(); isShowingRemaining = !isShowingRemaining;
    showStatusBriefly(isShowingRemaining ? "REMAINING TIME" : "ELAPSED TIME");
});

// --- AUDIO EVENTS ---
audio.addEventListener('timeupdate', () => {
    if (!isPoweredOn || isNaN(audio.currentTime)) return;
    if (abMode === 2 && audio.currentTime >= pointB) audio.currentTime = pointA;
    let s = isShowingRemaining ? audio.duration - audio.currentTime : audio.currentTime;
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

nextBtn.addEventListener('mousedown', () => startSeeking('next'));
nextBtn.addEventListener('mouseup', () => stopSeeking('next'));
prevBtn.addEventListener('mousedown', () => startSeeking('prev'));
prevBtn.addEventListener('mouseup', () => stopSeeking('prev'));

// --- PLAYLIST POPUP ---
trackCount.addEventListener('click', (e) => {
    if (!isPoweredOn || playlist.length === 0) return;
    e.stopPropagation();
    const container = document.getElementById('playlist-items');
    container.innerHTML = "";
    playlist.forEach((f, i) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${i === currentIndex ? 'active-track' : ''}`;
        item.innerHTML = `<span>${i + 1}. ${f.name.toUpperCase()}</span>`;
        item.onclick = () => { loadTrack(i); document.getElementById('playlist-popup').style.display = 'none'; };
        container.appendChild(item);
    });
    document.getElementById('playlist-popup').style.display = 'block';
});

// --- AUTRES CONTROLES ---
inputBtn.addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', (e) => { if (e.target.files.length > 0) { if (!isPoweredOn) { isPoweredOn = true; } playlist = Array.from(e.target.files); loadTrack(0); } });
playPauseBtn.addEventListener('click', () => { if (!isPoweredOn || playlist.length === 0) return; engine.init(); audio.paused ? (engine.play(), updateStatusIcon('play')) : (engine.pause(), updateStatusIcon('pause')); });
stopBtn.addEventListener('click', () => { if (isPoweredOn) { engine.stop(); updateStatusIcon('stop'); } });
muteBtn.addEventListener('click', () => { if (isPoweredOn) { isMuted = !isMuted; audio.muted = isMuted; showVolumeBriefly(); } });
document.getElementById('loudness-btn')?.addEventListener('click', () => { if (isPoweredOn) { isLoudnessActive = !isLoudnessActive; document.getElementById('vfd-loudness-text')?.classList.toggle('loudness-visible', isLoudnessActive); applyLoudnessEffect(); } });

// --- FONCTION LIBRARY ---
libBtn.onclick = () => { if (isPoweredOn) modal.style.display = "block"; else showStatusBriefly("POWER ON FIRST"); };
closeBtn.onclick = () => modal.style.display = "none";

folderInput.onchange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
    if (files.length > 0) {
        playlist = files;
        fileList.innerHTML = "";
        playlist.forEach((file, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span style="color:var(--mc-led-green)">▶</span> ${file.name.toUpperCase()}`;
            li.onclick = () => { loadTrack(index); modal.style.display = "none"; };
            fileList.appendChild(li);
        });
        showStatusBriefly(`${playlist.length} TRACKS LOADED`);
    }
};

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
    nl.style.transform = `rotate(${currentAngleL}deg)`; 
    nr.style.transform = `rotate(${currentAngleR}deg)`;
}
animate();

// --- VOLUME ---
function updateVolumeDisplay() {
    engine.setVolume(currentVolume);
    volumeKnob.style.transform = `rotate(${currentVolume * 270 - 135}deg)`;
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
volumeKnob.addEventListener('mousedown', (e) => {
    if (!isPoweredOn) return;
    const rect = volumeKnob.getBoundingClientRect();
    const isRight = (e.clientX - rect.left) > rect.width / 2;
    const change = () => { currentVolume = isRight ? Math.min(1, currentVolume + 0.01) : Math.max(0, currentVolume - 0.01); updateVolumeDisplay(); };
    change(); volHoldInterval = setInterval(change, 50);
});
window.addEventListener('mouseup', () => clearInterval(volHoldInterval));
volumeKnob.addEventListener('wheel', (e) => { if (isPoweredOn) { e.preventDefault(); currentVolume = e.deltaY < 0 ? Math.min(1, currentVolume + 0.05) : Math.max(0, currentVolume - 0.05); updateVolumeDisplay(); } });
volumeKnob.addEventListener('mouseenter', () => { if (isPoweredOn) showVolumeBriefly(); });

// --- MEDIA SESSION ---
function updateMediaMetadata() { if ('mediaSession' in navigator && playlist.length > 0) { navigator.mediaSession.metadata = new MediaMetadata({ title: vfdLarge.textContent, artist: vfdInfo.textContent.split('–')[0].trim() }); } }

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
    if (!optionsPopup?.contains(e.target)) optionsPopup.style.display = 'none';
    if (!document.getElementById('playlist-popup')?.contains(e.target)) document.getElementById('playlist-popup').style.display = 'none';
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
                } else {
                    engine.pause();
                    updateStatusIcon('pause');
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