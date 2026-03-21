<img width="1482" height="231" alt="banner" src="https://github.com/user-attachments/assets/87ed49b7-9437-4980-9dc6-4206d0007214" />

# McIntosh Reference Digital Audio Player

### Inspired by the McIntosh MSA5500 2-Channel Streaming Integrated Amplifier and DS200 Streaming DAC

A premium web-based audio player that faithfully recreates the McIntosh amplifier experience — animated dual VU meters with configurable physics, a 10-band parametric equalizer, stereo balance, A-B loop, mono mode with true channel mixing, loudness compensation, signal bypass, hi-res audio with automatic sample rate adaptation, keyboard shortcuts, persistent preferences, and a fully modular component architecture running natively in the browser or as an Electron desktop app.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-3.5.2-blue)

![preview](https://github.com/user-attachments/assets/7bc36eb4-3abf-4167-862a-a5e87df7afc9)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Playback & Playlist](#playback--playlist)
  - [Visual Interface](#visual-interface)
  - [Audio Controls](#audio-controls)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Preferences](#preferences)
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

McIntosh DAP is a purely front-end application — no backend, no build step required. HTML components are loaded dynamically via `fetch()`, audio processing is handled entirely by the Web Audio API, and the app works offline once installed as a PWA. An Electron wrapper adds native desktop features (custom title bar, media keys, taskbar controls, file associations). On first visit, an animated frosted-glass door intro with the McIntosh logo reveals the player.

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
- Draggable — click and hold the header `CURRENT PLAYLIST` to move the popup anywhere on screen
- Displays ARTIST / TITLE / ALBUM with embedded cover thumbnail per track
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

**Hi-Res audio:**
- FLAC decoded natively by the browser — bit-perfect, no transcoding
- On each track load, `audio.sampleRate` is read from `loadedmetadata` and `engine.reinitWithSampleRate()` recreates the AudioContext at the exact sample rate of the file (44.1 kHz, 96 kHz, 192 kHz...). All DSP settings are automatically reapplied after reinit

---

### Visual Interface

#### Animated Door Intro

Two frosted-glass panels with a metallic central joint cover the screen on load. Clicking the McIntosh logo triggers the `doors-open` CSS animation. Managed in `css/door.css` with a single JS listener on `#enter-btn`.

#### Dual VU Meters

Animation handled exclusively by `js/vu-meter.js`, fully decoupled from `script.js`. All physics are stored in `VU_METER_CONFIG`:

| Parameter | Default | Description |
|---|---|---|
| `ANGLE_REST` | `-55 deg` | Needle rest position |
| `ANGLE_MAX` | `110 deg` | Maximum sweep from rest |
| `SIGNAL_BOOST` | `3.5` | Raw level multiplier |
| `RESPONSE_CURVE` | `0.7` | Less than 1 = logarithmic, 1 = linear, greater than 1 = exponential |
| `SMOOTHING_ATTACK` | `0.35` | Rise interpolation factor per frame |
| `SMOOTHING_RELEASE` | `0.1` | Fall interpolation factor on pause/stop |

#### VFD Display

- Large title line with auto-fit font (`fitText()`)
- Artist - Album line
- Format badge + estimated bitrate in kbps
- Processing badge: `| EQ ROCK` / `| EQ CUSTOM` / `| BYPASS`
- Bass/Treble indicator: `| B: +4dB  T: -2dB` — shown on change, hidden on TONE RESET
- `| LOUDNESS` badge when active
- Elapsed / remaining time toggle (click time display)
- Track counter `n/total` — click to open playlist popup
- Status icon: PLAY / PAUSE / STOP
- **VFD mode column** (bottom-left) — 4 fixed rows, lit or dimmed like real VFD inactive segments:

```
A-B          dimmed / A- / A-B
RANDOM       dimmed / lit
REPEAT(1)    dimmed / lit
REPEAT(ALL)  dimmed / lit
```

#### Display Modes

DISPLAY button toggles BRIGHT / DIMMED. In DIMMED: VFD dimmed, meters dimmed, logo in B&W, all labels (including `.mini-label-green`) grayed via `.label-dimmed` class.

#### Album Art Popup

Click the track title to open. Shows embedded cover art with above it: `ALBUM NAME — ARTIST NAME` and below: `TRACK CURRENTLY PLAYING: TITLE` — all in gold color.

#### Visual Customization

BACK COLOR and SHADOW COLOR pickers in OPTIONS — real-time CSS update.

---

### Audio Controls

#### Volume Knob

- Click left/right half: ±0.01, hold for continuous (50 ms)
- Mouse wheel: ±0.05
- 270 degree visual rotation range

#### Mute

Instant mute. VFD shows `MUTE`. Volume preserved.

#### 10-Band Graphic Equalizer

Frequencies: 32 · 64 · 125 · 250 · 500 · 1k · 2k · 4k · 8k · 16k Hz — each a `BiquadFilterNode` peaking, Q = 1.4, ±12 dB.

- EQ popup is **draggable** (click and hold `.eq-header`)
- Live bezier curve canvas (`drawEQCurve()`)
- **EQUALIZER rotary knob**: cycles FLAT → POP → ROCK → JAZZ → CLASSIC → LIVE (60 deg/step, hold or wheel)
- Manual slider adjustment sets VFD to `| EQ CUSTOM`
- FLAT button resets all bands to 0 dB
- All filter changes use `setTargetAtTime(v, t, 0.01)` — no audio clicks

#### Bass / Treble

- Bass: low shelf @ 200 Hz, ±12 dB in 2 dB steps
- Treble: high shelf @ 3000 Hz, ±12 dB in 2 dB steps
- Live VFD display: `| B: +4dB  T: -2dB`, hidden by TONE RESET
- **TONE RESET** — resets bass, treble, balance to 0

#### Balance

- **BALANCE knob**: click left/right or wheel, ±0.02/step
- **Mandatory center snap** — crossing 0 locks exactly to 0 before continuing
- Disabled when Mono mode is active

#### Mono Mode

True mono via `ChannelSplitterNode` + `ChannelMergerNode` — L+R summed on both output channels, eliminating all stereo imaging. Forces balance to center; previous balance restored on deactivation.

#### Loudness Compensation

Fletcher-Munson based:
```javascript
const intensity = Math.max(0, (0.7 - volume) / 0.7);
finalBass   += intensity * 8;   // up to +8 dB at volume 0
finalTreble += intensity * 4;   // up to +4 dB at volume 0
```

#### Signal Bypass

One click cuts all processing (EQ + bass/treble + loudness → 0 dB). State saved in `bypassSnapshot` and fully restored on deactivation. All processing controls locked while active. VFD shows `| BYPASS`.

---

### Keyboard Shortcuts

All shortcuts are ignored when focus is in an input field.

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `ArrowRight` | Next track |
| `ArrowLeft` | Previous track |
| `Shift + ArrowRight` | Seek +10 s |
| `Shift + ArrowLeft` | Seek -10 s |
| `ArrowUp` | Volume +5% |
| `ArrowDown` | Volume -5% |
| `M` | Mute toggle |
| `B` | Bypass toggle |
| `L` | Loudness toggle |
| `R` | Random toggle |
| `S` | Cycle Repeat mode |

---

### Preferences

All user settings are persisted in `localStorage` under the key `mcintosh-dap-prefs`. Saved automatically with a 1 second debounce after any change.

**Saved values:** volume, bass gain, treble gain, balance, loudness on/off, mono on/off, random on/off, repeat mode, all 10 EQ bands, EQ preset name, VFD preset badge text.

**Restored on startup** — 300 ms after engine init, all values are applied back to the engine and UI (including VFD badges, tone display, knob angles, EQ curve redraw).

**Reset preferences** — button **RST PREFS** in OPTIONS menu → VFD shows `PREFS RESET`. Also accessible via browser DevTools: Application → Local Storage → delete `mcintosh-dap-prefs`.

**Viewing saved preferences** — INFO popup (OPTIONS → INFO) shows a gold-bordered panel `SAVED PREFERENCES` displaying all current saved values: VOLUME, LOUDNESS, EQ PRESET, BASS, TREBLE, BALANCE, MONO, RANDOM, REPEAT.

---

## Technical Architecture

### Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 — 7 modular component files loaded via fetch() |
| Styles | CSS3 — 13 modular files, CSS custom properties |
| Logic | Vanilla JavaScript ES6+, no framework |
| Audio | Web Audio API — AudioContext, BiquadFilter, StereoPanner, ChannelSplitter, ChannelMerger, AnalyserNode |
| Metadata | jsmediatags 3.9.5 — ID3 tags, embedded artwork |
| Icons | Font Awesome 7 (local) |
| Fonts | Bitcount Single, Roboto (Google Fonts) |
| Storage | localStorage — user preferences (key: `mcintosh-dap-prefs`) |
| Desktop | Electron 26 + electron-builder |
| PWA | Service Worker v3.5.2 + Web App Manifest |

---

### Project Structure

```
McIntosh-DAP/
|
+-- index.html              Entry point: door intro, script chain, SW registration
+-- script.js               Main application logic (~1500 lines)
+-- style.css               CSS entry point: @imports all css/ modules
+-- main.js                 Electron main process (custom title bar, IPC, media keys)
+-- sw.js                   PWA Service Worker v3.5.2
+-- manifest.json           PWA manifest
+-- package.json            Electron 26, electron-builder, file associations
|
+-- js/
|   +-- component-loader.js       Async HTML injector, fires componentsLoaded event
|   +-- mcintosh-audio-engine.js  Web Audio API engine (McIntoshAudioEngine class)
|   +-- vu-meter.js               VU meter animation loop
|
+-- components/
|   +-- meter-section.html        SVG VU meters + needle-l / needle-r
|   +-- display-area.html         VFD, badges, tone display, time, bitrate
|   +-- controls.html             All knobs and transport buttons
|   +-- options-menu.html         options-popup (includes RST PREFS button)
|   +-- modals.html               playlist-popup, album-popup, reboot modal, EQ popup
|   +-- info.html                 About overlay with saved preferences panel
|   +-- drop.html                 Drag & drop overlay
|
+-- css/
|   +-- root.css            CSS custom properties
|   +-- chassis.css         Chassis layout, aluminum trim, border depth effect
|   +-- meters.css          VU meter containers and needle pivot
|   +-- display.css         VFD, badges, tone display
|   +-- controls.css        Knobs, buttons
|   +-- eq.css              EQ popup (draggable, position:fixed, z-index:10000)
|   +-- modals.css          Playlist popup (draggable), album popup
|   +-- states.css          .label-dimmed, .stealth-mode, .blink-fast, .blink-soft
|   +-- overlay.css         Full-screen overlays
|   +-- info.css            About overlay + saved preferences panel styles
|   +-- door.css            Frosted-glass door intro animation
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
            fetch() all components into #amplifier-panel + #modals-section
            +-- dispatchEvent('componentsLoaded')
                 +-- mcintosh-audio-engine.js  (createElement)
                      +-- vu-meter.js           (createElement)
                           +-- script.js         (createElement)
                           +-- enter-btn listener (door open)

window.load
  +-- serviceWorker.register('/sw.js')  (production only, disabled on localhost)
```

The playlist-popup and EQ popup are both in `modals.html` injected into `#modals-section` — a direct child of `<body>`. This ensures their `z-index: 10000` applies globally and they render above the chassis side trims. Drag listeners use event delegation (`e.target.closest()`) so they work regardless of component load timing.

---

### Audio Signal Graph

```
<audio id="main-audio">  (native browser FLAC/MP3/WAV/AAC/OGG decoder)
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
BiquadFilterNode  peaking   32 Hz  -+
BiquadFilterNode  peaking   64 Hz   |
BiquadFilterNode  peaking  125 Hz   |  setCustomFilter(freq, gain)
BiquadFilterNode  peaking  250 Hz   |  Q = 1.4  +-12 dB each
BiquadFilterNode  peaking  500 Hz   |  setTargetAtTime(v, t, 0.01)
BiquadFilterNode  peaking   1 kHz   |
BiquadFilterNode  peaking   2 kHz   |
BiquadFilterNode  peaking   4 kHz   |
BiquadFilterNode  peaking   8 kHz   |
BiquadFilterNode  peaking  16 kHz  -+  (_lastNode)
    |
    +-- ChannelSplitterNode --> AnalyserL  getLevels() -> VU meter
    |                       --> AnalyserR  getLevels() -> VU meter
    |
    v (stereo, default)
AudioDestinationNode

Mono mode (setMono(true)):
_lastNode --> monoSplitter --> monoMerger (L+R summed on both channels)
                                   |
                                   v
                             AudioDestinationNode
```

AudioContext sample rate adapts dynamically on each track load via `reinitWithSampleRate(sr)`.
All parameter transitions use `setTargetAtTime` (timeConstant 0.01) for click-free changes.

---

### JavaScript Modules

#### component-loader.js

```javascript
class ComponentLoader {
    constructor()              // defines components[] + modalsComponent
    async loadComponent(file)  // fetch() returns HTML string
    async loadAll()            // inject into #amplifier-panel then #modals-section
                               // fires dispatchEvent('componentsLoaded')
}
```

#### mcintosh-audio-engine.js

```javascript
// Init
init(sampleRate = null)           // build node graph; guard: if (isInitialized) return
reinitWithSampleRate(sampleRate)  // close context, reset nodes, re-init, reapply all settings

// Playback
play()                            // resume suspended context, return audio.play() Promise
pause()                           // audio.pause()
stop()                            // audio.pause() + currentTime = 0
setVolume(val)                    // audio.volume clamped [0, 1]

// DSP
setBalance(val)                   // StereoPanner.pan clamped [-1, +1]
setMono(active)                   // true: ChannelSplitter + Merger (L+R sum on both ch.)
updateEQ(bass, treble, loudness)  // shelf filters + loudness:
                                  //   intensity = max(0, (0.7 - volume) / 0.7)
                                  //   bass   += intensity x 8
                                  //   treble += intensity x 4
setCustomFilter(freq, gain)       // single EQ band by frequency key

// Analysis
getLevels()                       // returns { left, right } 0-72 (averaged frequency bins)
```

#### vu-meter.js

```javascript
const VU_METER_CONFIG = {
    ANGLE_REST: -55, ANGLE_MAX: 110,
    SIGNAL_BOOST: 3.5, RESPONSE_CURVE: 0.7,
    SMOOTHING_ATTACK: 0.35, SMOOTHING_RELEASE: 0.1
};

startVuMeter(engine, audio, needleL, needleR, getIsPoweredOn)
// requestAnimationFrame loop at ~60 fps
// getIsPoweredOn is a function reference for live state reading
```

#### script.js section map

| Lines | Section |
|---|---|
| 1-11 | Electron/browser compatible import |
| 12-65 | DOM selectors |
| 67-100 | State variables + volume init |
| 101-173 | Utility: fitText, showStatusBriefly, showTone, hideTone, showVolumeBriefly, updateStatusIcon, applyLoudnessEffect, updateVFDStatusDisplay |
| 175-189 | Power / reboot modal |
| 191-218 | Balance & tone: showBalanceStatus, setBalance, bass/treble listeners |
| 221-296 | loadTrack(index) — src, format, bitrate, sample rate reinit, jsmediatags, cover art, album popup |
| 297-329 | VFD clicks: album popup, time toggle |
| 330-346 | Audio events: timeupdate (A-B, MediaSession), onended (repeat/random) |
| 347-390 | Seeking: startSeeking, stopSeeking (500 ms delay, +-3 s / 100 ms) |
| 392-528 | Playlist: readMetaForFiles, renderPlaylistItems, remove/add track |
| 529-568 | Playlist drag (event delegation on .playlist-header) |
| 569-603 | EQ popup drag (event delegation on .eq-header) |
| 604-760 | File loading: isAudioFile, addFilesToPlaylist, drag & drop, Electron open-with |
| 720-760 | Bypass: snapshot save / full state restore |
| 825-830 | startVuMeter(engine, audio, nl, nr, () => isPoweredOn) |
| 831-857 | Volume: updateVolumeDisplay, knob mousedown/wheel |
| 859-916 | Media Session: updateMediaMetadata(), action handlers |
| 917-930 | Options popup open/close, global click dismiss |
| 931-977 | Electron IPC: media-control, update-thumbar |
| 978-1012 | renderInfoPrefs() — populates saved preferences panel in INFO popup |
| 1013-1076 | openInfo(), color pickers (BACK COLOR, SHADOW COLOR) |
| 1077-1118 | drawEQCurve() — quadratic bezier on canvas with cyan glow |
| 1119-1268 | applyPreset(btnId), EQUALIZER knob (hold/wheel, 60 deg/step) |
| 1269-1291 | applyBalance(isRight), center snap, BALANCE knob |
| 1293-1413 | savePrefs, loadPrefs, resetPrefs, scheduleSavePrefs (1 s debounce) |
| 1414-1502 | Keyboard shortcuts (Space, arrows, M, B, L, R, S) |

---

### HTML Components

| File | Target | Content |
|---|---|---|
| meter-section.html | #amplifier-panel | SVG VU meters + #needle-l / #needle-r |
| display-area.html | #amplifier-panel | #vfd, badges, tone display, time, bitrate, #vfd-tone-display |
| controls.html | #amplifier-panel | INPUT/VOLUME/EQ/BALANCE knobs, all buttons |
| options-menu.html | #amplifier-panel | #options-popup with all controls including RST PREFS button |
| modals.html | #modals-section | #playlist-popup (draggable), album popup, reboot modal, #eq-popup (draggable) |
| info.html | #amplifier-panel | About overlay + #info-prefs-box (saved preferences panel) |
| drop.html | #amplifier-panel | #drop-overlay drag feedback |

Note: `#playlist-popup` and `#eq-popup` are in `#modals-section` (direct child of body) so their `z-index: 10000` applies globally, placing them above the chassis side trims.

---

### CSS Architecture

| File | Key rules |
|---|---|
| root.css | --mc-gold, --vfd-color #74f1fc, --panel-black, --roboto, --bitcount, --release-number "3.5.2" |
| chassis.css | .chassis-wrapper z-index:1, .amplifier-panel glass effect, white anodized trim, border depth |
| meters.css | .meter-container, .needle pivot |
| display.css | .vfd, .vfd-large, badges, #vfd-tone-display, #volume-display |
| controls.css | Knobs, buttons |
| eq.css | #eq-popup position:fixed z-index:10000, .eq-header cursor:grab |
| modals.css | #playlist-popup position:fixed z-index:10000, .playlist-header cursor:grab |
| states.css | .label-dimmed (color:#555 opacity:0.5), .blink-fast, .blink-soft |
| info.css | About overlay + #info-prefs-box gold border, .info-pref-row grid layout |
| door.css | #main-doors, .doors-open animation, #enter-btn transparent background |
| mobile.css | scale() transforms at 2000/1600/1400/1200 px |

---

### State Management

All state as `let` variables in `script.js`:

```javascript
// System
let isPoweredOn, isMuted, isLoudnessActive, isMonoActive
let isBypassActive, bypassSnapshot   // bypassSnapshot: { bassGain, trebleGain, isLoudnessActive, eqBands[], vfdPresetText }

// Playlist
let playlist, playlistMeta, currentIndex
let isRandom, repeatMode  // 0=off | 1=one | 2=all
let abMode, pointA, pointB

// Audio
let currentVolume, bassGain, trebleGain, currentBalance

// UI
let isShowingRemaining, displayMode, dragCounter
let volHoldInterval, balHoldInterval, prefsSaveTimeout

// Knobs
let eqKnobAngle, balKnobAngle, currentPresetIndex

// Media
let currentCoverBlobUrl   // blob: URL for Media Session API artwork (Chrome requires non-data: URL)
```

Single `window.addEventListener('mouseup')` at end of `script.js` clears all hold intervals.

---

### Service Worker & PWA

`sw.js` version `3.5.2`, two strategies:

- **Network-first** for `index.html` — always fetches latest, falls back to cache offline
- **Cache-first** for all other assets — instant load, updates cache on miss

Disabled automatically on `localhost` / `127.0.0.1` / `file:` so local development is never blocked by cache. On first local load, any existing SW is unregistered.

To update cache after a deployment, increment `CACHE_VERSION` in `sw.js`.

---

## Installation

### Web / PWA

```bash
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
npm start         # development
npm run dist      # build -> dist/McIntosh-DAP.exe (Windows portable)
```

File associations: `.mp3` `.flac` `.wav` `.m4a` `.aac` `.ogg` `.mp4` — double-click to open directly.

The Electron window uses a custom title bar (`titleBarStyle: 'hidden'`) with overlay buttons colored to match the McIntosh aesthetic:
```javascript
titleBarOverlay: {
    color: '#080808',        // panel black
    symbolColor: '#786b46',  // mc-gold
    height: 32
}
```

---

## Configuration

### CSS Custom Properties — css/root.css

```css
:root {
    --release-number:            "RELEASE 3.5.2";
    --background-color-app:      #191301;
    --chassis-shadow:            #a5a1a1;
    --vfd-color:                 #74f1fc;
    --mc-blue:                   #00c3ff;
    --mc-gold:                   #786b46;
    --panel-black:               #080808;
    --roboto:                    'Roboto', sans-serif;
    --bitcount:                  'Bitcount Single', sans-serif;
}
```

### VU Meter Physics — js/vu-meter.js

Edit `VU_METER_CONFIG` directly in source to change needle behavior permanently.

### Preferences Reset

Click **RST PREFS** in OPTIONS menu, or clear `mcintosh-dap-prefs` from localStorage in browser DevTools.

### PWA Cache — sw.js

```javascript
const CACHE_VERSION = '3.5.2'; // increment on each deployment
```

---

## Contributing

1. Fork, branch `git checkout -b feature/MyFeature`
2. Commit, push, open a Pull Request

Conventions: ES6+, 4-space indent, camelCase, PascalCase for classes. New CSS file — add to `css/` and `@import` in `style.css`. Test in both browser and Electron.

---

## License

MIT License — Copyright (c) 2026 Yohann Zaoui. See `LICENSE` for full text.

---

## Disclaimer

Fan-made tribute project. Not affiliated with McIntosh Laboratory, Inc. McIntosh® is a registered trademark of McIntosh Laboratory, Inc.

---

## Credits

Design inspiration: **McIntosh Laboratory** — American audio manufacturer since 1949.

Libraries: jsmediatags · Font Awesome 7 · Google Fonts (Bitcount Single, Roboto) · Electron · Web Audio API · Media Session API · Service Worker API

---

<img width="1912" height="885" alt="screen-1" src="https://github.com/user-attachments/assets/ccc058ab-ab83-4bab-99d7-8428b2de1104" />

**Enjoy your premium web audio experience!**

*Made with love for audio enthusiasts everywhere*
