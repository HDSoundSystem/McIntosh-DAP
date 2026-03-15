<img width="1482" height="231" alt="banner" src="https://github.com/user-attachments/assets/87ed49b7-9437-4980-9dc6-4206d0007214" />

# McIntosh Reference Digital Audio Player

### Inspired by the McIntosh MSA5500 2-Channel Streaming Integrated Amplifier and DS200 Streaming DAC

A premium web-based audio player that faithfully recreates the McIntosh amplifier experience — animated dual VU meters with configurable physics, a 10-band parametric equalizer with rotary knob, stereo balance with mandatory center snap, A-B loop, mono mode, loudness compensation, signal bypass with full state restore, hi-res audio with automatic sample rate adaptation, and a fully modular component architecture running natively in the browser or as an Electron desktop app.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-3.5.0-blue)

![preview](https://github.com/user-attachments/assets/7bc36eb4-3abf-4167-862a-a5e87df7afc9)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Playback & Playlist](#playback--playlist)
  - [Visual Interface](#visual-interface)
  - [Audio Controls](#audio-controls)
- [Technical Architecture](#technical-architecture)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Script Loading Chain](#script-loading-chain)
  - [Audio Signal Graph](#audio-signal-graph)
  - [JavaScript Modules](#javascript-modules)
  - [HTML Components](#html-components)
  - [CSS Architecture](#css-architecture)
  - [State Management](#state-management)
  - [Service Worker & PWA](#service-worker--pwa)
- [Installation](#installation)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Credits](#credits)

---

## Overview

McIntosh DAP is a purely front-end application — no backend, no build step required. HTML components are loaded dynamically via `fetch()`, audio processing is handled entirely by the Web Audio API, and the app works offline once installed as a PWA. An Electron wrapper adds native desktop features (media keys, taskbar controls, file association). On first visit, an animated frosted-glass door intro with the McIntosh logo greets the user before revealing the player.

---

## Features

### Playback & Playlist

**Supported formats:** FLAC · MP3 · WAV · MP4/M4A · AAC · ALAC · OGG

**Loading methods:**
- **INPUT knob** — file picker, multiple selection
- **Drag & Drop** — drop files anywhere; added to the current playlist without replacing it. VFD confirms `+N FILE(S) ADDED`
- **`+` button** — inside the playlist popup header
- **"Open with"** — double-click a file in the file manager (Electron only); single-instance lock prevents duplicate windows

**Playlist popup** (click the track counter to open):
- Displays ARTIST / TITLE / ALBUM with embedded cover thumbnail
- Highlights the currently playing track
- **`-` button** on hover — removes a track; playback continues if a next track exists

**Playback controls:**
- Play/Pause · Stop · Previous · Next
- **Hold Prev/Next** — fast seek: ±3 s every 100 ms after a 500 ms activation delay
- **Repeat modes** — Off → REPEAT(1) → REPEAT(ALL)
- **Random** — shuffle with no immediate repeat

**A-B Loop:**
- Click 1 — set point A (VFD: `A-`)
- Click 2 — set point B, loop starts immediately (VFD: `A-B`)
- Click 3 — disable

**Hi-Res audio quality:**
- FLAC is decoded natively by the browser — bit-perfect, no transcoding
- On each track load, `audio.sampleRate` is read from `loadedmetadata` and `engine.reinitWithSampleRate()` recreates the AudioContext at the exact sample rate of the file (44.1 kHz, 96 kHz, 192 kHz...). All DSP settings are automatically reapplied after reinit

**System integration:**
- Media Session API — keyboard media keys, browser thumbnail controls, position state
- PWA — Service Worker for offline cache, installable from address bar
- Electron — `open-file` and `second-instance` IPC events

---

### Visual Interface

#### Animated Door Intro

Two frosted glass panels with a metallic central joint cover the screen on load. Clicking the McIntosh logo on the right panel adds `doors-open` class which slides both panels off screen via CSS transitions. Managed entirely in `css/door.css` with a single JS listener on `#enter-btn`.

#### Dual VU Meters

Animation is handled exclusively by `js/vu-meter.js`, fully decoupled from `script.js`. All physics are stored in `VU_METER_CONFIG` and applied every frame at ~60 fps via `requestAnimationFrame`.

| Parameter | Default | Description |
|---|---|---|
| `ANGLE_REST` | `-55 deg` | Needle rest position (no signal) |
| `ANGLE_MAX` | `110 deg` | Maximum sweep from rest |
| `SIGNAL_BOOST` | `3.5` | Raw level multiplier (sensitivity) |
| `RESPONSE_CURVE` | `0.7` | Less than 1 = logarithmic, 1 = linear, greater than 1 = exponential |
| `SMOOTHING_ATTACK` | `0.35` | Rise interpolation factor per frame |
| `SMOOTHING_RELEASE` | `0.1` | Fall interpolation factor on pause/stop |

Per-frame formula:
```
targetAngle  = ANGLE_REST + pow(min(255, level x BOOST) / 255, CURVE) x ANGLE_MAX
currentAngle += (targetAngle - currentAngle) x SMOOTHING_ATTACK    // playing
currentAngle += (ANGLE_REST  - currentAngle) x SMOOTHING_RELEASE   // stopped
```

#### VFD Display

- Large title line with auto-fit font (`fitText()`)
- Artist - Album line
- Format badge (FLAC / MP3 / WAV / AAC/ALAC / OGG) + estimated bitrate in kbps
- Processing badge: `| EQ ROCK` or `| EQ CUSTOM` or `| BYPASS`
- Bass/Treble indicator: `| B: +4dB  T: -2dB` — shown on BASS/TREBLE click, hidden on TONE RESET
- `| LOUDNESS` badge when active
- Elapsed / remaining time toggle (click time display)
- Track counter `n/total` — click to open playlist popup
- Status icon: PLAY / PAUSE / STOP
- **VFD mode column** (bottom-left) — 4 fixed rows always visible, lit or dimmed like real VFD inactive segments:

```
A-B          dimmed / A- / A-B
RANDOM       dimmed / lit
REPEAT(1)    dimmed / lit
REPEAT(ALL)  dimmed / lit
```

#### Display Modes

DISPLAY button toggles:
- **BRIGHT** — full illumination, color logos, green labels
- **DIMMED** — VFD dimmed, meters dimmed, logo in B&W, labels grayed

#### Album Art Popup

Clicking the track title opens a popup with the embedded cover art. Above the image: ALBUM NAME - ARTIST NAME displayed in gold color (`var(--mc-gold)`).

#### Visual Customization

BACK COLOR and SHADOW COLOR pickers in OPTIONS menu — real-time CSS update.

---

### Audio Controls

#### Volume Knob

- Click left/right half: ±0.01, hold for continuous adjustment (50 ms interval)
- Mouse wheel: ±0.05
- 270 degree visual rotation range
- Loudness compensation re-applied on every change

#### Mute

Instant audio mute. VFD shows MUTE. Volume value preserved.

#### 10-Band Graphic Equalizer

Frequencies: 32, 64, 125, 250, 500, 1k, 2k, 4k, 8k, 16k Hz — each a BiquadFilterNode of type `peaking`, Q = 1.4, ±12 dB.

- EQ popup: 10 vertical sliders + live bezier curve canvas (`drawEQCurve()`)
- **EQUALIZER rotary knob** (below INPUT): cycles FLAT → POP → ROCK → JAZZ → CLASSIC → LIVE (60 deg per step, hold or wheel supported)
- Presets also accessible as buttons inside the EQ popup
- Manual slider adjustment sets VFD to `| EQ CUSTOM`
- FLAT button resets all bands to 0 dB
- All filter changes use `setTargetAtTime(value, ctx.currentTime, 0.01)` for click-free transitions

#### Bass / Treble

- Bass: low shelf at 200 Hz, ±12 dB in 2 dB steps
- Treble: high shelf at 3000 Hz, ±12 dB in 2 dB steps
- Current values displayed live on VFD as `| B: +4dB  T: -2dB`
- **TONE RESET** — resets bass, treble, balance to 0 and hides the tone display

#### Balance

- **BALANCE knob** (below VOLUME): click left/right half or mouse wheel, ±0.02 per step
- **Mandatory center snap** — crossing 0 locks exactly to 0 before continuing; knob rotation resets to 0 deg
- Disabled when Mono mode is active

#### Mono Mode

Combines L+R into true mono using a ChannelSplitterNode + ChannelMergerNode chain — both output channels receive the identical mixed signal, eliminating all stereo imaging effects. Forces balance to center; previous balance restored on deactivation.

#### Loudness Compensation

Fletcher-Munson based, calculated in `updateEQ()`:
```javascript
const intensity = Math.max(0, (0.7 - volume) / 0.7);
finalBass   += intensity * 8;   // up to +8 dB at volume 0
finalTreble += intensity * 4;   // up to +4 dB at volume 0
```
Stacks additively with manual bass/treble values.

#### Signal Bypass

One click mutes all processing (10-band EQ + bass/treble + loudness set to 0 dB). Complete state saved in `bypassSnapshot`:
```javascript
bypassSnapshot = { bassGain, trebleGain, isLoudnessActive, eqBands: [...10 bands], vfdPresetText };
```
Deactivating Bypass restores every value exactly. All processing controls are locked while Bypass is active. VFD shows `| BYPASS`.

---

## Technical Architecture

### Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 — 7 modular component files loaded via fetch() |
| Styles | CSS3 — 13 modular files, CSS custom properties, no framework |
| Logic | Vanilla JavaScript ES6+, no framework |
| Audio | Web Audio API — AudioContext, BiquadFilter, StereoPanner, ChannelSplitter, ChannelMerger, AnalyserNode |
| Metadata | jsmediatags 3.9.5 — ID3 tags, embedded artwork |
| Icons | Font Awesome 7 (local) |
| Fonts | Bitcount Single, Roboto (Google Fonts) |
| Desktop | Electron 26 + electron-builder |
| PWA | Service Worker v3.5.0 + Web App Manifest |

---

### Project Structure

```
McIntosh-DAP-main/
|
+-- index.html              Entry point: door intro, CSS, script chain, SW registration
+-- script.js               Main application logic (~1150 lines)
+-- style.css               CSS entry point: @imports all css/ modules
+-- main.js                 Electron main process
+-- sw.js                   PWA Service Worker (v3.5.0)
+-- manifest.json           PWA manifest
+-- package.json            Electron 26 + electron-builder, file associations
|
+-- js/
|   +-- component-loader.js       Async HTML injector, fires componentsLoaded event
|   +-- mcintosh-audio-engine.js  Web Audio API engine (McIntoshAudioEngine class)
|   +-- vu-meter.js               VU meter animation loop
|
+-- components/
|   +-- meter-section.html        SVG VU meters + needle-l / needle-r elements
|   +-- display-area.html         VFD, status icon, counters, time, bitrate, tone display
|   +-- controls.html             All knobs and transport buttons
|   +-- options-menu.html         options-popup + playlist-popup
|   +-- modals.html               Album art popup, reboot modal, EQ popup
|   +-- info.html                 About overlay
|   +-- drop.html                 Drag & drop visual overlay
|
+-- css/
|   +-- root.css            CSS custom properties (colors, fonts, sizes)
|   +-- chassis.css         Outer chassis, panel layout, aluminum trim, border depth effect
|   +-- meters.css          VU meter containers and needle pivot
|   +-- display.css         VFD, status icon, badges, tone display
|   +-- controls.css        Knobs, buttons
|   +-- eq.css              EQ popup, sliders, curve canvas
|   +-- modals.css          Options menu, playlist, album popup
|   +-- states.css          stealth-mode, dimmed, blink-fast, blink-soft
|   +-- overlay.css         Full-screen overlays
|   +-- info.css            About overlay
|   +-- door.css            Animated frosted-glass door intro
|   +-- mobile.css          Responsive scale() transforms at breakpoints
|
+-- assets/
    +-- img/                Logos, favicon, VU meter background, door logo
    +-- windows/            Taskbar button icons (prev/play/pause/next/stop)
```

---

### Script Loading Chain

```
DOMContentLoaded
  +-- component-loader.js  (synchronous script tag)
       +-- ComponentLoader.loadAll()
            fetch() all components into DOM
            +-- dispatchEvent('componentsLoaded')
                 +-- [index.html inline listener]
                      +-- mcintosh-audio-engine.js  (createElement)
                           +-- vu-meter.js           (createElement)
                                +-- script.js         (createElement)
                                +-- enter-btn click listener attached

window.load
  +-- serviceWorker.register('/sw.js')
```

All HTML components are in the DOM before any application JS executes.

---

### Audio Signal Graph

```
<audio id="main-audio">  (native browser decoder: FLAC/MP3/WAV/AAC/OGG)
    |
    v
MediaElementSourceNode
    |
    v
StereoPannerNode                  setBalance(val)  pan in [-1, +1]
    |
    v
BiquadFilterNode  lowshelf  200 Hz    updateEQ()  bass  +-12 dB
    |
    v
BiquadFilterNode  highshelf 3000 Hz   updateEQ()  treble +-12 dB
    |
    v
BiquadFilterNode  peaking   32 Hz  ---+
BiquadFilterNode  peaking   64 Hz     |
BiquadFilterNode  peaking  125 Hz     |  setCustomFilter(freq, gain)
BiquadFilterNode  peaking  250 Hz     |  Q = 1.4  +-12 dB each
BiquadFilterNode  peaking  500 Hz     |  setTargetAtTime(v, t, 0.01)
BiquadFilterNode  peaking   1 kHz     |
BiquadFilterNode  peaking   2 kHz     |
BiquadFilterNode  peaking   4 kHz     |
BiquadFilterNode  peaking   8 kHz     |
BiquadFilterNode  peaking  16 kHz  ---+   (_lastNode)
    |
    +-- ChannelSplitterNode --> AnalyserL  getLevels()
    |                       --> AnalyserR  getLevels()
    |
    v (stereo, default)
AudioDestinationNode

Mono mode (setMono(true)):
_lastNode --> monoSplitter --> monoMerger (L+R summed on both channels)
                                   |
                                   v
                             AudioDestinationNode
```

AudioContext sample rate is adapted dynamically on each track load via `reinitWithSampleRate()`.

---

### JavaScript Modules

#### component-loader.js

```javascript
class ComponentLoader {
    constructor()              // defines components[] list and modalsComponent
    async loadComponent(file)  // fetch() returns HTML string, logs error on failure
    async loadAll()            // sequential inject into #amplifier-panel, then
                               // modals.html into #modals-section
                               // fires document.dispatchEvent('componentsLoaded')
}
```

#### mcintosh-audio-engine.js — McIntoshAudioEngine class

```javascript
// Initialization
init(sampleRate = null)           // build full node graph; guard: if (isInitialized) return
reinitWithSampleRate(sampleRate)  // close context, reset all nodes, call init(), reapply all gains

// Playback
play()                            // resume suspended context, return audio.play() Promise
pause()                           // audio.pause()
stop()                            // audio.pause() + currentTime = 0
setVolume(val)                    // audio.volume clamped [0, 1]

// DSP (all transitions via setTargetAtTime, timeConstant 0.01)
setBalance(val)                   // StereoPanner.pan clamped [-1, +1]
setMono(active)                   // true: ChannelSplitter + Merger (L+R sum on both channels)
                                  // false: direct to destination
updateEQ(bass, treble, loudness)  // shelf filters + loudness:
                                  //   intensity = max(0, (0.7 - volume) / 0.7)
                                  //   bass   += intensity x 8   (max +8 dB)
                                  //   treble += intensity x 4   (max +4 dB)
setCustomFilter(freq, gain)       // single EQ band by frequency key

// Analysis
getLevels()                       // returns { left, right } averaged over fftSize/2 bins (0-72)
```

#### vu-meter.js

```javascript
const VU_METER_CONFIG = {
    ANGLE_REST:        -55,   // needle rest angle (degrees)
    ANGLE_MAX:         110,   // total sweep from rest
    SIGNAL_BOOST:      3.5,   // raw level multiplier
    RESPONSE_CURVE:    0.7,   // power-law exponent
    SMOOTHING_ATTACK:  0.35,  // rise lerp factor per frame
    SMOOTHING_RELEASE: 0.1,   // fall lerp factor per frame
};

startVuMeter(engine, audio, needleL, needleR, getIsPoweredOn)
// Starts requestAnimationFrame loop.
// getIsPoweredOn is a function reference to always read live state from script.js.
```

#### script.js — Main application

Section map:

| Lines | Section |
|---|---|
| 1-11 | Electron/browser compatible import |
| 12-65 | DOM selectors |
| 35 | const engine = new McIntoshAudioEngine(audio) |
| 67-94 | State variables |
| 100-173 | Utility: fitText, showStatusBriefly, showTone, hideTone, showVolumeBriefly, updateStatusIcon, applyLoudnessEffect, updateVFDStatusDisplay |
| 174-189 | Power / reboot modal |
| 190-218 | Balance & tone: showBalanceStatus, setBalance, bass/treble listeners |
| 219-302 | loadTrack(index) — src, format, bitrate, sample rate reinit, jsmediatags, cover art |
| 303-322 | VFD clicks: album popup, time toggle |
| 323-339 | Audio events: timeupdate (A-B, MediaSession), onended (repeat/random) |
| 340-384 | Seeking: startSeeking, stopSeeking (500ms delay, +-3s / 100ms) |
| 385-521 | Playlist: readMetaForFiles, renderPlaylistItems, remove/add track |
| 522-582 | File loading: isAudioFile, addFilesToPlaylist, drag & drop |
| 583-679 | Electron open-with — IPC open-files to File objects |
| 620-679 | Playback controls: Play/Pause, Stop, Mute, Loudness, Bypass snapshot |
| 743-748 | startVuMeter(engine, audio, nl, nr, () => isPoweredOn) |
| 749-775 | Volume: updateVolumeDisplay, knob mousedown/wheel |
| 776-834 | Media Session: updateMediaMetadata(), action handlers |
| 835-891 | Options popup, Electron IPC media-control |
| 892-954 | Info overlay, color pickers |
| 955-1146 | 10-band EQ: drawEQCurve, applyPreset, slider listeners, EQUALIZER knob |
| 1147-1183 | Balance knob: applyBalance(isRight), center snap |
| ~1184 | Global window mouseup: clears all hold intervals |

Key functions:

`loadTrack(index)` — sets audio.src, reads format + bitrate on loadedmetadata, calls `engine.reinitWithSampleRate(audio.sampleRate)` if sample rate differs, reads jsmediatags for title/artist/album/cover, populates album popup, calls `engine.init()` + `engine.play()`.

`updateVFDStatusDisplay()` — creates or updates `#vfd-mode-indicator` with 4 fixed-height spans (A-B, RANDOM, REPEAT(1), REPEAT(ALL)). Each span is always rendered: lit (#74f1fc with glow) when active, dimmed (#0d2a2e) when inactive — simulating real VFD inactive segments.

`showTone()` / `hideTone()` — writes `| B: +4dB  T: -2dB` into `#vfd-tone-display` span inside the VFD sub-tech-row. Persists until `hideTone()` is called by TONE RESET.

`applyPreset(btnId)` — maps button id to gains array, updates 10 sliders + engine filters, writes `| EQ NAME` to `#vfd-preset-display`, calls `drawEQCurve()`.

`drawEQCurve()` — reads 10 slider values, maps to canvas x/y, draws quadratic bezier with #00c3ff glow on `#eq-curve` canvas.

Bypass save/restore:
```javascript
// On activate
bypassSnapshot = { bassGain, trebleGain, isLoudnessActive, eqBands: [...10], vfdPresetText };
engine.updateEQ(0, 0, false);
eqSliders.forEach(s => { s.value = 0; engine.setCustomFilter(freq, 0); });

// On deactivate
bassGain = bypassSnapshot.bassGain;
engine.updateEQ(bassGain, trebleGain, isLoudnessActive);
bypassSnapshot.eqBands.forEach(b => { slider.value = b.value; engine.setCustomFilter(b.freq, b.value); });
```

---

### HTML Components

| File | Target | Content |
|---|---|---|
| meter-section.html | #amplifier-panel | Two .meter divs, SVG backgrounds, #needle-l / #needle-r |
| display-area.html | #amplifier-panel | #vfd, text zones, bitrate, format, tone display, time |
| controls.html | #amplifier-panel | INPUT/VOLUME/EQ/BALANCE knobs, all buttons |
| options-menu.html | #amplifier-panel | #options-popup + #playlist-popup |
| info.html | #amplifier-panel | About overlay |
| drop.html | #amplifier-panel | #drop-overlay drag feedback |
| modals.html | #modals-section | Album art popup (title/artist in gold), reboot modal, EQ popup |

---

### CSS Architecture

| File | Scope |
|---|---|
| root.css | --mc-blue, --mc-gold, --vfd-color, --panel-black, --roboto, --bitcount, --release-number 3.5.0 |
| chassis.css | .chassis-wrapper, .amplifier-panel (glass effect), side trim (white anodized aluminum), border depth |
| meters.css | .meter-container, .needle pivot |
| display.css | .vfd, .vfd-large, badges, tone display, mode indicator |
| controls.css | Knobs, buttons |
| eq.css | EQ popup, sliders, canvas |
| modals.css | Options menu, playlist, album popup |
| states.css | .stealth-mode, .dimmed, .blink-fast, .blink-soft |
| overlay.css | Full-screen overlays |
| info.css | About overlay |
| door.css | #main-doors, .door-left/right, .doors-open animation, #enter-btn transparent |
| mobile.css | scale() transforms at 2000/1600/1400/1200 px breakpoints |

---

### State Management

All state is stored as let variables in script.js:

```javascript
// System
let isPoweredOn        = false
let isMuted            = false
let isLoudnessActive   = false
let isMonoActive       = false
let isBypassActive     = false
let bypassSnapshot     = null    // { bassGain, trebleGain, isLoudnessActive, eqBands[], vfdPresetText }

// Playlist
let playlist           = []      // File[] objects
let playlistMeta       = []      // { artist, title, album, cover } per index
let currentIndex       = 0
let isRandom           = false
let repeatMode         = 0       // 0=off | 1=one | 2=all
let abMode             = 0       // 0=off | 1=A set | 2=A-B active
let pointA             = 0       // seconds
let pointB             = 0       // seconds

// Audio
let currentVolume      = 0.05
let bassGain           = 0       // dB, -12 to +12
let trebleGain         = 0
let currentBalance     = 0       // -1 to +1

// Seek / hold timers
let seekInterval       = null
let isMouseDown        = false
let volHoldInterval    = null

// UI
let isShowingRemaining = false
let displayMode        = 0       // 0=bright | 1=dimmed
let dragCounter        = 0
```

A single `window.addEventListener('mouseup')` at the end of script.js clears all hold intervals — prevents stuck knobs on fast mouse releases.

---

### Service Worker & PWA

`sw.js` version 3.5.0, two caching strategies:

- **Network-first** for index.html — always fetches the latest version, falls back to cache when offline
- **Cache-first** for all other assets — instant load, updates cache dynamically on miss

Special requests ignored: blob: URLs, chrome-extension:, GoatCounter, Google Tag Manager.

To deploy an update, increment `CACHE_VERSION` in `sw.js` — the activate handler automatically deletes the old cache.

Registration added in index.html on window.load:
```javascript
navigator.serviceWorker.register('/sw.js')
```

---

## Installation

### Web / PWA

```bash
# Must be served — fetch() does not work on file://
git clone https://github.com/HDSoundSystem/McIntosh-DAP.git
cd McIntosh-DAP

python -m http.server 8000
# or: npx http-server -p 8000

# Open http://localhost:8000
```

Install as PWA: Chrome/Edge — install icon in address bar. Safari — Share > Add to Home Screen.

### Electron (Desktop)

```bash
npm install       # Electron 26 + electron-builder
npm start         # development mode
npm run dist      # build -> dist/McIntosh-DAP.exe (Windows portable)
```

File associations registered by the build: .mp3 .flac .wav .m4a .aac .ogg .mp4 — double-click to open directly in the player.

---

## Configuration

### CSS Custom Properties — css/root.css

```css
:root {
    --release-number:            "RELEASE 3.5.0";
    --background-color-app:      #454545;
    --chassis-shadow:            #6e6e6e;
    --vfd-color:                 #74f1fc;
    --mc-blue:                   #00c3ff;
    --mc-green:                  #02c705;
    --panel-black:               #080808;
    --mc-gold:                   #786b46;
    --roboto:                    'Roboto', sans-serif;
    --bitcount:                  'Bitcount Single', sans-serif;
}
```

### VU Meter Physics — js/vu-meter.js

Edit `VU_METER_CONFIG` directly in source for permanent defaults.

### Electron Build — package.json

```json
{
  "build": {
    "appId": "com.HDSoundSystem.McIntoshDAP",
    "productName": "McIntosh-DAP",
    "win": { "icon": "assets/img/favicon.ico", "target": "portable" }
  }
}
```

### PWA Cache Version — sw.js

```javascript
const CACHE_VERSION = '3.5.0'; // increment on each deployment
```

---

## Contributing

1. Fork the project
2. Create a branch: `git checkout -b feature/MyFeature`
3. Commit and push
4. Open a Pull Request

Conventions: ES6+, 4-space indent, camelCase variables, PascalCase classes. New CSS — add a file in css/ and @import it in style.css. Test in both browser and Electron before submitting.

---

## License

MIT License — Copyright (c) 2026 Yohann Zaoui. See `LICENSE` for full text.

---

## Disclaimer

Fan-made tribute project. Not affiliated with, endorsed by, or an official product of McIntosh Laboratory, Inc. McIntosh® is a registered trademark of McIntosh Laboratory, Inc. Created for educational and entertainment purposes only.

---

## Credits

Design inspiration: **McIntosh Laboratory** — American audio manufacturer since 1949.

Libraries and tools: jsmediatags · Font Awesome 7 · Google Fonts (Bitcount Single, Roboto) · Electron · Web Audio API · Media Session API · Service Worker API

---

<img width="1912" height="885" alt="screen-1" src="https://github.com/user-attachments/assets/ccc058ab-ab83-4bab-99d7-8428b2de1104" />

**Enjoy your premium web audio experience!**

*Made with love for audio enthusiasts everywhere*
