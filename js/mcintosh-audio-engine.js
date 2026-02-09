/**
 * Moteur Audio McIntosh MSA5500
 * Gère la lecture, les filtres EQ et l'analyse spectrale pour les VU-mètres.
 * Compatible Web (Browser) et Electron (Node.js)
 */

// Protection contre la double déclaration (pour éviter l'erreur SyntaxError)
if (typeof window.McIntoshAudioEngine === 'undefined' && typeof McIntoshAudioEngine === 'undefined') {

    class McIntoshAudioEngine {
        constructor(audioElement) {
            this.audio = audioElement;
            this.audioCtx = null;
            this.analyserL = null;
            this.analyserR = null;
            this.bassFilter = null;
            this.trebleFilter = null;
            this.balanceNode = null;
            this.source = null;
            
            // États
            this.bassGain = 0;
            this.trebleGain = 0;
            this.currentBalance = 0;
            this.isLoudnessActive = false;
            
            this.isInitialized = false;
        }

        /**
         * Initialise le pipeline Web Audio
         * Doit être appelé après un geste utilisateur (clic)
         */
        init() {
            if (this.isInitialized) return;

            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.analyserL = this.audioCtx.createAnalyser();
                this.analyserR = this.audioCtx.createAnalyser();
                this.analyserL.fftSize = 1024;
                this.analyserR.fftSize = 1024;

                const splitter = this.audioCtx.createChannelSplitter(2);
                this.balanceNode = this.audioCtx.createStereoPanner();
                this.balanceNode.pan.value = this.currentBalance;

                this.bassFilter = this.audioCtx.createBiquadFilter();
                this.bassFilter.type = "lowshelf";
                this.bassFilter.frequency.value = 200;
                this.bassFilter.gain.value = this.bassGain;

                this.trebleFilter = this.audioCtx.createBiquadFilter();
                this.trebleFilter.type = "highshelf";
                this.trebleFilter.frequency.value = 3000;
                this.trebleFilter.gain.value = this.trebleGain;

                this.source = this.audioCtx.createMediaElementSource(this.audio);

                // Connexions : Source -> Balance -> Bass -> Treble -> Splitter -> Analysers -> Out
                this.source.connect(this.balanceNode);
                this.balanceNode.connect(this.bassFilter);
                this.bassFilter.connect(this.trebleFilter);
                this.trebleFilter.connect(splitter);
                
                splitter.connect(this.analyserL, 0);
                splitter.connect(this.analyserR, 1);
                
                this.trebleFilter.connect(this.audioCtx.destination);

                this.isInitialized = true;
                console.log("McIntosh Audio Engine Initialized");
            } catch (e) {
                console.error("Failed to initialize Audio Context:", e);
            }
        }

        // --- COMMANDES DE LECTURE ---
        play() {
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            return this.audio.play();
        }

        pause() {
            this.audio.pause();
        }

        stop() {
            this.audio.pause();
            this.audio.currentTime = 0;
        }

        // --- REGLAGES AUDIO ---
        setVolume(val) {
            this.audio.volume = Math.max(0, Math.min(1, val));
        }

        setBalance(val) {
            this.currentBalance = Math.max(-1, Math.min(1, val));
            if (this.balanceNode && this.audioCtx) {
                this.balanceNode.pan.setTargetAtTime(this.currentBalance, this.audioCtx.currentTime, 0.01);
            }
        }

        updateEQ(bass, treble, loudnessActive) {
            this.bassGain = bass;
            this.trebleGain = treble;
            this.isLoudnessActive = loudnessActive;

            if (!this.bassFilter || !this.trebleFilter || !this.audioCtx) return;

            let finalBass = this.bassGain;
            let finalTreble = this.trebleGain;

            if (this.isLoudnessActive) {
                // Effet Loudness compensé selon le volume (plus fort à bas volume)
                const intensity = Math.max(0, (0.7 - this.audio.volume) / 0.7);
                finalBass += (intensity * 8);
                finalTreble += (intensity * 4);
            }

            this.bassFilter.gain.setTargetAtTime(finalBass, this.audioCtx.currentTime, 0.01);
            this.trebleFilter.gain.setTargetAtTime(finalTreble, this.audioCtx.currentTime, 0.01);
        }

        // --- DATA POUR VU-METRES ---
        getLevels() {
            if (!this.isInitialized) return { left: 0, right: 0 };

            const dataL = new Uint8Array(this.analyserL.frequencyBinCount);
            const dataR = new Uint8Array(this.analyserR.frequencyBinCount);
            
            this.analyserL.getByteFrequencyData(dataL);
            this.analyserR.getByteFrequencyData(dataR);

            const avgL = dataL.reduce((a, b) => a + b, 0) / dataL.length;
            const avgR = dataR.reduce((a, b) => a + b, 0) / dataR.length;

            return { left: avgL, right: avgR };
        }
    }

    // --- EXPORT COMPATIBLE ---
    if (typeof module !== 'undefined' && module.exports) {
        // Mode Electron / Node
        module.exports = McIntoshAudioEngine;
    } else {
        // Mode Navigateur Web
        window.McIntoshAudioEngine = McIntoshAudioEngine;
    }
}