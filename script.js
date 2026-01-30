// --- SÃ‰LECTEURS ---
const nl = document.getElementById('needle-l');
const nr = document.getElementById('needle-r');
const vfdLarge = document.querySelector('.vfd-large');
const vfdSmall = document.querySelector('.vfd-small');
const vfdInfo = document.querySelector('.vfd-info');
const trackCount = document.getElementById('track-count');
const fileFormat = document.getElementById('file-format');
const bitrateDisplay = document.getElementById('bitrate');
const inputBtn = document.getElementById('input-knob'); 
const fileUpload = document.getElementById('audio-upload');
const playPauseBtn = document.getElementById('play-pause');
const pwr = document.getElementById('pwr');
const audio = document.getElementById('main-audio');

// --- VARIABLES ---
let playlist = [];
let currentIndex = 0;
let audioCtx = null;
let analyser = null;
let dataArray = null;
let source = null;

let currentAngleL = -55;
let currentAngleR = -55;

// --- MOTEUR AUDIO (SIMPLE & DIRECT) ---
function initEngine() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // Petit buffer = Grande rÃ©activitÃ©
        analyser.smoothingTimeConstant = 0.3; // TrÃ¨s peu de lissage pour marquer le rythme
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// --- CHARGEMENT SANS Ã‰CHEC ---
function loadTrack(index) {
    if (playlist.length === 0) return;
    
    currentIndex = index;
    const file = playlist[currentIndex];

    // Reset interface
    trackCount.textContent = `${currentIndex + 1}/${playlist.length}`;
    fileFormat.textContent = file.name.split('.').pop().toUpperCase();
    vfdSmall.textContent = "NOW PLAYING";

    // Chargement propre
    const url = URL.createObjectURL(file);
    audio.src = url;
    
    audio.onloadedmetadata = () => {
        bitrateDisplay.textContent = Math.round(((file.size * 8) / audio.duration) / 1000) + " KBPS";
    };

    // Lecture ID3 Tags
    if (window.jsmediatags) {
        window.jsmediatags.read(file, {
            onSuccess: (tag) => {
                const t = tag.tags;
                vfdLarge.textContent = (t.title || file.name).toUpperCase().substring(0, 25);
                vfdInfo.textContent = `${t.artist || "UNKNOWN"} â€” ${t.album || "UNKNOWN"}`.toUpperCase();
            },
            onError: () => {
                vfdLarge.textContent = file.name.toUpperCase().substring(0, 25);
            }
        });
    }

    // DÃ©blocage et lecture forcÃ©e
    initEngine();
    audio.play().catch(e => console.warn("Cliquez sur Play pour dÃ©marrer"));
}

// --- Ã‰VÃ‰NEMENTS ---
inputBtn.addEventListener('click', () => fileUpload.click());

fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        playlist = Array.from(e.target.files);
        loadTrack(0);
    }
});

playPauseBtn.addEventListener('click', () => {
    initEngine();
    audio.paused ? audio.play() : audio.pause();
});

pwr.addEventListener('click', () => window.location.reload());

audio.onended = () => {
    if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
};

// --- ANIMATION "BEAT-SYNC" (RÃ‰ACTION AUX BASSES) ---
function animate() {
    requestAnimationFrame(animate);
    
    if (analyser && !audio.paused) {
        analyser.getByteFrequencyData(dataArray);
        
        // On cible uniquement les 3 premiÃ¨res bandes (Basses trÃ¨s profondes / Kick)
        let bass = 0;
        for (let i = 0; i < 3; i++) { bass += dataArray[i]; }
        let level = bass / 3;

        // Calcul de l'angle cible
        let targetAngle = -55 + (level / 1.2); 
        if (targetAngle > 40) targetAngle = 40;

        // "Attack" rapide (0.4) et "Release" un peu plus lente (0.2)
        let speed = (targetAngle > currentAngleL) ? 0.4 : 0.2;

        currentAngleL += (targetAngle - currentAngleL) * speed;
        currentAngleR += (targetAngle - currentAngleR) * (speed * 0.95);
        
        const jitter = (Math.random() * 0.5);
        nl.style.transform = `rotate(${currentAngleL + jitter}deg)`;
        nr.style.transform = `rotate(${currentAngleR + jitter}deg)`;
    } else {
        // Retour progressif au repos
        currentAngleL += (-55 - currentAngleL) * 0.1;
        currentAngleR += (-55 - currentAngleR) * 0.1;
        nl.style.transform = `rotate(${currentAngleL}deg)`;
        nr.style.transform = `rotate(${currentAngleR}deg)`;
    }
}

animate();