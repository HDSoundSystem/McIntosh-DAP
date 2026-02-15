/**
 * McIntosh MSA5500 Audio Engine - 10-Band EQ Update
 * Controls playback, 10-band graphic EQ, loudness, and VU meters..
 */

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

            // --- ADD 10-BAND EQ ---
            this.eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
            this.filters = {}; // Stores the BiquadFilterNodes by frequency

            this.bassGain = 0;
            this.trebleGain = 0;
            this.currentBalance = 0;
            this.isLoudnessActive = false;
            this.isInitialized = false;
        }

        init() {
            if (this.isInitialized) return;

            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.analyserL = this.audioCtx.createAnalyser();
                this.analyserR = this.audioCtx.createAnalyser();
                this.analyserL.fftSize = 1024;
                this.analyserR.fftSize = 1024;

                this.source = this.audioCtx.createMediaElementSource(this.audio);
                this.balanceNode = this.audioCtx.createStereoPanner();

                // Filtres de tonalité classiques
                this.bassFilter = this.audioCtx.createBiquadFilter();
                this.bassFilter.type = "lowshelf";
                this.bassFilter.frequency.value = 200;

                this.trebleFilter = this.audioCtx.createBiquadFilter();
                this.trebleFilter.type = "highshelf";
                this.trebleFilter.frequency.value = 3000;

                // --- CREATION OF THE 10-BAND EQ CHAIN ---
                let lastNode = this.source;

                // Connection Source -> Balance -> Bass -> Treble
                lastNode.connect(this.balanceNode);
                this.balanceNode.connect(this.bassFilter);
                this.bassFilter.connect(this.trebleFilter);
                lastNode = this.trebleFilter;

                // Creation and insertion of the 10 Peaking filters
                this.eqBands.forEach(freq => {
                    const filter = this.audioCtx.createBiquadFilter();
                    filter.type = "peaking";
                    filter.frequency.value = freq;
                    filter.Q.value = 1.4; // Music bandwidth
                    filter.gain.value = 0;

                    this.filters[freq] = filter;
                    lastNode.connect(filter);
                    lastNode = filter;
                });

                const splitter = this.audioCtx.createChannelSplitter(2);
                lastNode.connect(splitter);
                splitter.connect(this.analyserL, 0);
                splitter.connect(this.analyserR, 1);

                lastNode.connect(this.audioCtx.destination);

                this.isInitialized = true;
                console.log("McIntosh Audio Engine 10-Band EQ Initialized");
            } catch (e) {
                console.error("Failed to initialize Audio Context:", e);
            }
        }

        // --- NEW METHOD FOR THE 10-BAND EQ ---
        setCustomFilter(freq, gain) {
            const filter = this.filters[freq];
            if (filter && this.audioCtx) {
                filter.gain.setTargetAtTime(gain, this.audioCtx.currentTime, 0.01);
            }
        }

        play() {
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            return this.audio.play();
        }

        pause() { this.audio.pause(); }

        stop() {
            this.audio.pause();
            this.audio.currentTime = 0;
        }

        setVolume(val) { this.audio.volume = Math.max(0, Math.min(1, val)); }

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
                const intensity = Math.max(0, (0.7 - this.audio.volume) / 0.7);
                finalBass += (intensity * 8);
                finalTreble += (intensity * 4);
            }

            this.bassFilter.gain.setTargetAtTime(finalBass, this.audioCtx.currentTime, 0.01);
            this.trebleFilter.gain.setTargetAtTime(finalTreble, this.audioCtx.currentTime, 0.01);
        }

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

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = McIntoshAudioEngine;
    } else {
        window.McIntoshAudioEngine = McIntoshAudioEngine;
    }
}
