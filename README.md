<img width="1494" height="242" alt="12" src="https://github.com/user-attachments/assets/564c8f77-dc5a-476a-85d6-43ced526b60b" />

# McIntosh Digital Audio Player
## Inspired by the high-end McIntosh MSA5500 2-Channel Streaming Integrated Amplifier and DS200 STREAMING DAC

A premium web-based audio player inspired by the legendary McIntosh amplifier design, featuring authentic VU meters, professional 10-band equalizer with dedicated rotary knob, stereo balance with precision control and mandatory center snap, A-B loop functionality, mono mode, loudness compensation, power guard protection, customizable visual themes, and a stunning interface that captures the essence of high-end audio equipment.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-2.6.0-blue)


![543375630-9f65f1d2-5f77-458b-b0fc-5ec35e992042](https://github.com/user-attachments/assets/7bc36eb4-3abf-4167-862a-a5e87df7afc9)
<img width="1792" height="808" alt="1" src="https://github.com/user-attachments/assets/9898310a-5166-4970-8872-cb47436dbb11" />

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
  - [Audio Playback](#-audio-playback)
  - [Visual Interface](#-visual-interface)
  - [Audio Controls](#-audio-controls)
  - [Advanced Features](#-advanced-features)
- [Technical Architecture](#-technical-architecture)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Audio Architecture](#audio-architecture)
  - [Modular Components](#modular-components)
- [Installation and Usage](#-installation-and-usage)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#-disclaimer)
- [Credits](#-credits)

---

## 🎯 Overview

The **McIntosh DAP** is a premium web-based audio application that recreates the experience of using an authentic McIntosh amplifier. It combines modern web technologies with iconic vintage design to deliver an immersive and visually stunning listening experience.

### Key Highlights
- **Authentic Interface**: Faithful design to McIntosh amplifiers with animated VU meters and VFD display
- **Professional Audio Processing**: 10-band equalizer with rotary knob, tone controls, precision stereo balance
- **Multi-platform**: Web app (PWA) and desktop application (Electron)
- **Multiple Audio Formats**: FLAC, MP3, WAV, MP4/M4A, AAC, ALAC, OGG support
- **Real-time Visualization**: VU meters with realistic physics and spectrum analyzer

---

## ✨ Core Features

### 🎵 Audio Playback

#### Multi-format Support
- **Supported Formats**: FLAC, MP3, MP4/M4A, WAV, AAC, ALAC, OGG
- **Quality**: High-resolution audio support with complete metadata
- **Automatic Analysis**: Bitrate, format, and ID3 metadata extraction

#### Playlist Management
- **Multiple Loading Methods**:
  - **INPUT knob**: Individual file selection (multiple selection supported)
  - **LIBRARY button**: Complete folder loading with organized navigation
- **Playlist Interface**:
  - Interactive popup - click track counter to browse
  - Visual indicator for currently playing track
  - Library modal with organized file list

#### Playback Controls
- **Basic Controls**: Play, Pause, Stop, Previous, Next
- **Fast Seek**: Press and hold previous/next buttons for quick navigation
  - 500ms hold delay to prevent accidental jumps
  - 3-second jumps every 100ms while holding
- **Repeat Modes**:
  - **Off**: Normal playback
  - **REPEAT(1)**: Repeat single track
  - **REPEAT(ALL)**: Repeat all tracks
- **Random Playback**: Shuffle mode with intelligent selection (avoids immediate repeats)

#### A-B Loop
- **First click**: Set point A
- **Second click**: Set point B and activate loop
- **Third click**: Disable loop
- **Automatic validation**: B must be after A
- **Visual indicator**: "A-B" in VFD display

#### System Integration
- **Media Session API**: Control from keyboard media keys
- **Native Controls**: Browser media controls support
- **Position Tracking**: Position state for Chrome/Edge
- **Progressive Web App**: Installation with service worker for offline cache
- **Desktop Application**: Electron version with complete system integration

### 📺 Visual Interface

#### Animated Stereo VU Meters
- **Real-time Visualization**: Dual-channel audio analysis
- **Smooth Animation**: Realistic physics with 25% smoothing
- **Authentic Design**: Custom McIntosh-style meter background image
- **Response Curve**: Power-law for natural meter movement
- **Auto Return**: Rest position when stopped
- **Alternate Mode**: Alternative meter background available (meter-alt-bg)

#### VFD Display (Vacuum Fluorescent Display)
- **Track Information**:
  - Title with dynamic text sizing (auto-fit content)
  - Artist and album information
  - Track number and total (clickable for playlist)
- **Technical Information**:
  - File format indicator (FLAC, MP3, WAV, MP4, AAC/ALAC, OGG)
  - Bitrate calculation (estimated for VBR files)
  - Playback time with elapsed/remaining toggle (clickable)
- **Status Indicators**:
  - Playback status icons (PLAY, PAUSE with blinking, STOP)
  - Mode indicators (RANDOM, REPEAT, REPEAT(1), REPEAT(ALL), A-B LOOP) in bottom left
  - Loudness indicator when active
  - Volume display overlay (auto-hides after 2 seconds)
  - EQ preset indicator: `| EQ ROCK`, `| EQ JAZZ`, `| EQ CUSTOM`, etc. — displayed when any non-flat EQ is active

#### Display Modes
- **Normal Mode**: Full illumination
- **Alternate Logo**: Toggle between mc-logo.png and mc-logo-off.png
- **Alternate VU Backgrounds**: Different meter designs
- **VFD Blackout Mode**: Complete display shutdown
- **Label Dimming**: All green labels turn gray when display is off

#### Interactive Elements
- **Album Art Viewer**: Click track title to view embedded artwork in popup
- **Interactive Playlist**: Click track counter to browse and select tracks
- **Status LEDs**:
  - Power LED (red) - indicates system on/off state
  - MONO LED (green) - active when mono mode enabled
  - POWER GUARD LEDs (red, left and right) - blink rapidly when volume ≥ 90%

#### Visual Customization
- **Background Color Picker**: Customize app background
- **Shadow Color Picker**: Adjust chassis shadow color
- **Real-time Preview**: Color preview in buttons
- **Persistence**: Saved across sessions
- **Reboot Confirmation Modal**: Safety popup to confirm system restart

### 🎛️ Audio Controls

#### Volume Control
- **Interactive Rotary Knob**:
  - Metallic chrome finish
  - Click and hold left/right for continuous adjustment (0.01 steps at 50ms intervals)
  - Mouse wheel support for precise control (0.05 steps)
  - Visual feedback with rotation animation (270° range)
- **Temporary Display**: Overlay auto-hides after 2 seconds
- **Hover Info**: Shows current volume level
- **Loudness Integration**: Automatic compensation
- **Layout**: ADJUST label displayed directly below the knob

#### Mute Function
- **Instant Muting**: Audio mute with status display
- **Visual Indicator**: Shows "MUTE" in volume display area
- **Preservation**: Volume setting preserved

#### 10-Band Graphic Equalizer
- **Professional Control**: Covers entire audio spectrum
- **Frequencies**: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz
- **Range**: ±12dB per band
- **Musical Q Factor**: 1.4 for natural sound shaping
- **Real-time Processing**: Web Audio API with Peaking filters
- **Dedicated Interface**: Popup with vertical sliders
- **Visual Labels**: Frequency and gain indicators
- **FLAT Button**: Restore all bands to 0dB
- **Independence**: Separate from bass/treble tone controls
- **EQUALIZER Rotary Knob**: Dedicated chrome rotary knob below INPUT button
  - Same interaction model as VOLUME knob
  - Click left half to cycle to previous preset, right half for next preset
  - Mouse wheel support
  - Visual rotation animation (60° per preset step)
  - Presets in order: FLAT → POP → ROCK → JAZZ → CLASSIC → LIVE
- **EQ CUSTOM Mode**: When sliders are adjusted manually, VFD displays `| EQ CUSTOM` status — identical behavior to named presets

#### 2-Band Tone Controls (Classic McIntosh Style)
- **Bass**: ±12dB at 200Hz (low shelf filter)
  - Adjustable in 2dB steps
  - Range: -12dB to +12dB
- **Treble**: ±12dB at 3000Hz (high shelf filter)
  - Adjustable in 2dB steps
  - Range: -12dB to +12dB
- **Real-time Processing**: Web Audio API biquad filters
- **Visual Feedback**: Display in options menu

#### Stereo Balance
- **Left/Right Adjustment**: -1 to +1
- **Web Audio StereoPanner**: Precise control
- **BALANCE Rotary Knob**: Dedicated chrome rotary knob below VOLUME button
  - Same interaction model as VOLUME knob
  - Click left half to move balance left, right half to move right
  - Mouse wheel support for fine control
  - Visual rotation animation (4° per step)
- **Precision Step**: 2% increments (0.02) for fine-grained control
- **Mandatory Center Snap**: When crossing 0, balance locks exactly to center before continuing — knob resets to 0° rotation
- **Smart Disable**: Disabled when Mono mode is active

#### Mono Mode
- **Stereo to Mono Conversion**: Combined mono output
- **Auto-center**: Balance centered on activation
- **Green LED**: Visual indicator
- **Restoration**: Previous balance restored on deactivation

#### Loudness Compensation
- **Fletcher-Munson Based**: Bass/treble boost at low volumes
- **Automatic Compensation**: Based on current volume level
- **Maximum Effect**: At 0% volume, progressively decreases
- **Bass Boost**: Up to +8dB additional gain
- **Treble Boost**: Up to +4dB additional gain
- **EQ Combination**: Works with manual EQ settings
- **Visual Indicator**: VFD display when active

#### Reset and Protection
- **Tone Reset**: One-click restoration to flat EQ (0dB) and center balance (0)
- **Power Guard Protection**:
  - Visual warning when volume > 90%
  - Rapid blinking red LEDs (left and right)
  - Prevents speaker/hearing damage

### ⚙️ Advanced Features

#### Library Management
- **Dedicated LIBRARY Button**: Folder-based loading
- **Modal Interface**: Browse and select tracks
- **Automatic Filtering**: Support all audio/* MIME types + M4A/AAC/OGG
- **Track List**: Display with green play indicators
- **Direct Playback**: Click any track to load and start
- **Total Counter**: Shows total track count on load
- **Security**: Requires system to be powered on
- **Close**: Close button and click-outside-to-close functionality

#### Web Audio API Processing
Professional audio graph with:
- **MediaElementSourceNode**: Audio input source
- **StereoPanner**: Balance control
- **Two BiquadFilter Nodes**: Bass/treble tone controls
- **Ten BiquadFilter Nodes**: 10-band graphic equalizer (Peaking type)
- **ChannelSplitter**: Channel separation for analysis
- **Two AnalyserNode**: VU meter visualization
- **AudioDestination**: Final audio output

#### Progressive Web App (PWA)
- **Service Worker**: Offline cache for static resources
- **Installable**: Add to home screen
- **Manifest**: Complete app configuration
- **Offline Mode**: Works without connection after installation
- **Adaptive Icons**: Support for all screen sizes

#### Electron Desktop Application
- **Windows Thumbnail Buttons**: Taskbar controls (Previous, Play/Pause, Next)
- **Media Keys**: System key support (Play/Pause, Next, Previous)
- **Native Window Controls**: Native menu bar
- **System Integration**: Complete native application
- **Portable Build**: Windows portable version

---

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend
- **HTML5**: Semantic structure with modular components
- **CSS3**: Responsive design with CSS variables and animations
- **JavaScript (ES6+)**: Modern application logic with modules
- **Web Audio API**: Professional real-time audio processing
- **jsmediatags**: Audio metadata extraction (ID3 tags, artwork)
- **Font Awesome 7**: Complete icon library

#### Backend/Runtime
- **Electron 26**: Cross-platform desktop framework
- **Node.js**: JavaScript runtime for desktop app
- **electron-builder**: Packaging tool for distribution

#### Web APIs Used
- **Media Session API**: System media controls
- **Service Worker API**: PWA offline cache
- **Web Audio API**: Audio processing and analysis
- **File System Access API**: Local file access
- **Canvas API**: VU meter rendering (optional)

### Project Structure

```
McIntosh-DAP-main/
├── index.html                 # Main entry point
├── main.js                    # Electron entry point
├── script.js                  # Main application logic
├── style.css                  # Global styles
├── sw.js                      # PWA Service Worker
├── manifest.json              # PWA Manifest
├── package.json               # npm/Electron configuration
│
├── assets/                    # Static resources
│   ├── fontawesome7/          # Icon library
│   │   ├── css/               # FA stylesheets
│   │   └── webfonts/          # FA fonts
│   ├── img/                   # Images and logos
│   │   ├── favicon.ico        # App icon
│   │   ├── favicon.png        # PNG icon
│   │   ├── logo.png           # McIntosh logo
│   │   ├── mc-logo*.png       # Logo variations
│   │   └── vumeter*.png       # VU meter backgrounds
│   ├── info/                  # Information images
│   └── windows/               # Windows control icons
│
├── components/                # Modular HTML components
│   ├── controls.html          # Controls section (knobs, buttons)
│   ├── display-area.html      # VFD display area
│   ├── meter-section.html     # VU meters section
│   ├── modals.html            # Modals and popups
│   └── options-menu.html      # Options menu and EQ
│
├── css/                       # Modular stylesheets
│   ├── root.css               # Global CSS variables
│   ├── chassis.css            # Chassis and panel styles
│   ├── controls.css           # Control and button styles
│   ├── display.css            # VFD display styles
│   ├── meters.css             # VU meter styles
│   ├── eq.css                 # Equalizer styles
│   ├── modals.css             # Modal and popup styles
│   ├── states.css             # Visual states (on/off/hover)
│   └── mobile.css             # Responsive mobile/tablet
│
└── js/                        # JavaScript modules
    ├── component-loader.js    # HTML component loader
    └── mcintosh-audio-engine.js # Web Audio API engine
```

### Audio Architecture

The audio system is built around a sophisticated Web Audio API graph:

```
Audio File (HTML5 Audio Element)
        ↓
MediaElementSourceNode
        ↓
StereoPannerNode (Balance ±1)
        ↓
BiquadFilterNode (Bass: Low Shelf @ 200Hz, ±12dB)
        ↓
BiquadFilterNode (Treble: High Shelf @ 3000Hz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 1: Peaking @ 32Hz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 2: Peaking @ 64Hz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 3: Peaking @ 125Hz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 4: Peaking @ 250Hz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 5: Peaking @ 500Hz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 6: Peaking @ 1kHz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 7: Peaking @ 2kHz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 8: Peaking @ 4kHz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 9: Peaking @ 8kHz, ±12dB)
        ↓
BiquadFilterNode (EQ Band 10: Peaking @ 16kHz, ±12dB)
        ↓
ChannelSplitterNode (L/R Separation)
        ↓              ↓
AnalyserNode (L)  AnalyserNode (R)
        ↓
AudioDestinationNode (Speakers)
```

#### McIntoshAudioEngine Class

**Core Properties**:
```javascript
{
  audio: HTMLAudioElement,         // HTML5 audio element
  audioCtx: AudioContext,           // Web Audio context
  source: MediaElementSourceNode,   // Audio source
  balanceNode: StereoPannerNode,    // Balance control
  bassFilter: BiquadFilterNode,     // Bass filter
  trebleFilter: BiquadFilterNode,   // Treble filter
  filters: Object,                  // Map of 10 EQ filters {freq: filter}
  analyserL: AnalyserNode,          // Left channel analyzer
  analyserR: AnalyserNode,          // Right channel analyzer
  eqBands: Array,                   // [32, 64, 125, 250, 500, 1k, 2k, 4k, 8k, 16k]
}
```

**Core Methods**:
- `init()`: Initialize audio context and graph
- `play()`: Start playback
- `pause()`: Pause playback
- `stop()`: Stop and reset
- `setVolume(val)`: Set volume (0-1)
- `setBalance(val)`: Set balance (-1 to +1)
- `updateEQ(bass, treble, loudness)`: Update tone filters
- `setCustomFilter(freq, gain)`: Set EQ band gain
- `getLevels()`: Return audio levels {left, right}

### Modular Components

#### 1. Component Loader (component-loader.js)
**Role**: Dynamically loads HTML components into main page

**How it Works**:
```javascript
// List of components to load
const components = [
  { file: 'meter-section.html', target: '#amplifier-panel' },
  { file: 'display-area.html', target: '#amplifier-panel' },
  { file: 'controls.html', target: '#amplifier-panel' },
  { file: 'modals.html', target: '#modals-section' },
  { file: 'options-menu.html', target: '#modals-section' }
];

// Loading with fetch and insertion
components.forEach(async comp => {
  const html = await fetch(`components/${comp.file}`).then(r => r.text());
  document.querySelector(comp.target).insertAdjacentHTML('beforeend', html);
});

// Event triggered when all components are loaded
document.dispatchEvent(new Event('componentsLoaded'));
```

**Benefits**:
- Separation of concerns
- Improved maintainability
- Asynchronous loading
- Component reusability

#### 2. Main Script (script.js)
**Role**: Orchestrates all application logic

**Structure**:
```javascript
// --- IMPORT & INIT ---
const engine = new McIntoshAudioEngine(audio);

// --- STATE VARIABLES ---
let playlist = [];
let currentIndex = 0;
let isPoweredOn = false;
let currentVolume = 0.05;
let bassGain = 0;
let trebleGain = 0;
let currentBalance = 0;
// ... etc

// --- EVENT LISTENERS ---
// Control buttons
playPauseBtn.addEventListener('click', handlePlayPause);
prevBtn.addEventListener('click', handlePrevious);
nextBtn.addEventListener('click', handleNext);

// Knobs
volumeKnob.addEventListener('mousedown', handleVolumeStart);
inputBtn.addEventListener('click', () => fileUpload.click());

// Audio element
audio.addEventListener('timeupdate', updateTimeDisplay);
audio.addEventListener('ended', handleTrackEnd);

// --- BUSINESS FUNCTIONS ---
function loadTrack(index) { /* ... */ }
function updateVUMeters() { /* ... */ }
function applyLoudnessEffect() { /* ... */ }
// ... etc
```

**Responsibilities**:
- Playlist management
- Playback controls
- Interface updates
- VU meter animation
- Metadata handling
- Playback modes (repeat, random, A-B)

#### 3. Electron Main (main.js)
**Role**: Electron application entry point

**Features**:
```javascript
const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  win.loadFile('index.html');
  
  // Windows thumbnail buttons
  win.setThumbarButtons([
    { icon: 'prev.png', click: () => win.webContents.send('prev') },
    { icon: 'play.png', click: () => win.webContents.send('play-pause') },
    { icon: 'next.png', click: () => win.webContents.send('next') }
  ]);
  
  // Global keyboard shortcuts
  globalShortcut.register('MediaPlayPause', () => { /* ... */ });
  globalShortcut.register('MediaNextTrack', () => { /* ... */ });
}

app.whenReady().then(createWindow);
```

#### 4. Service Worker (sw.js)
**Role**: PWA cache management for offline functionality

**Cache Strategy**:
```javascript
const CACHE_NAME = 'mcintosh-dap-v2.5.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/js/mcintosh-audio-engine.js',
  '/js/component-loader.js',
  '/assets/fontawesome7/css/all.min.css',
  // ... all static resources
];

// Install: initial caching
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});
```

### State Management System

#### Global States
```javascript
// System state
isPoweredOn: boolean        // System on/off
isMuted: boolean            // Audio muted
isLoudnessActive: boolean   // Loudness compensation active
isMonoActive: boolean       // Mono mode active

// Playback state
currentIndex: number        // Current track index
playlist: Array             // Track list
isRandom: boolean           // Random mode
repeatMode: 0|1|2          // 0: off, 1: repeat(1), 2: repeat(all)
abMode: 0|1|2              // 0: off, 1: A set, 2: A-B active
pointA: number             // Point A position (seconds)
pointB: number             // Point B position (seconds)

// Audio state
currentVolume: number      // Current volume (0-1)
bassGain: number           // Bass gain (-12 to +12 dB)
trebleGain: number         // Treble gain (-12 to +12 dB)
currentBalance: number     // Balance (-1 to +1)

// Visual state
isShowingRemaining: boolean // Show remaining/elapsed time
currentAngleL: number       // Left VU needle angle
currentAngleR: number       // Right VU needle angle
```

#### Data Flow
```
User Action (Event)
        ↓
Event Handler
        ↓
State Update
        ↓
Engine Update (if needed)
        ↓
UI Update
        ↓
Visual Feedback
```

### Performance Optimizations

#### 1. VU Meter Animation
```javascript
// Smoothing with requestAnimationFrame
function animateMeters() {
  const { left, right } = engine.getLevels();
  
  // Conversion with power-law for natural response
  const dbL = Math.pow(left / 255, 1.5) * 110;
  const dbR = Math.pow(right / 255, 1.5) * 110;
  
  // 25% smoothing for fluid movement
  targetAngleL = dbL - 55;
  targetAngleR = dbR - 55;
  currentAngleL += (targetAngleL - currentAngleL) * 0.25;
  currentAngleR += (targetAngleR - currentAngleR) * 0.25;
  
  // Apply with CSS transform (GPU accelerated)
  nl.style.transform = `rotate(${currentAngleL}deg)`;
  nr.style.transform = `rotate(${currentAngleR}deg)`;
  
  requestAnimationFrame(animateMeters);
}
```

#### 2. Control Debouncing
```javascript
// Volume display auto-hide
let volTimeout = null;
function showVolumeBriefly() {
  clearTimeout(volTimeout);
  volDisplay.style.opacity = "1";
  volTimeout = setTimeout(() => {
    volDisplay.style.opacity = "0";
  }, 2000);
}

// Fast seek with interval
let seekInterval = null;
function startSeeking(direction) {
  setTimeout(() => {
    if (!isMouseDown) return;
    seekInterval = setInterval(() => {
      audio.currentTime += direction * 3; // ±3 seconds
    }, 100);
  }, 500); // 500ms delay
}
```

#### 3. Lazy Loading of Metadata
```javascript
function loadTrack(index) {
  // Immediate audio loading
  audio.src = URL.createObjectURL(playlist[index]);
  
  // Asynchronous metadata extraction
  jsmediatags.read(playlist[index], {
    onSuccess: tag => {
      updateMetadataDisplay(tag);
      extractAlbumArt(tag);
    }
  });
}
```

---

## 📥 Installation and Usage

### Web Version (PWA)

#### Prerequisites
- Modern browser (Chrome, Edge, Firefox, Safari)
- Web Audio API support
- Service worker support (for PWA)

#### Installation
1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/mcintosh-dap.git
cd mcintosh-dap
```

2. **Serve the application**:
```bash
# With Python 3
python -m http.server 8000

# Or with Node.js http-server
npx http-server -p 8000
```

3. **Access**: Open `http://localhost:8000`

4. **Install as PWA** (optional):
   - Chrome: Click install icon in address bar
   - Edge: Menu → Apps → Install this app
   - Safari: Share → Add to Home Screen

### Desktop Version (Electron)

#### Prerequisites
- Node.js 14+ and npm

#### Installation and Build
```bash
# 1. Install dependencies
npm install

# 2. Launch in development mode
npm start

# 3. Build portable application (Windows)
npm run dist
```

#### Executable File
After build, the portable app is in:
```
dist/McIntosh-dap.exe
```

### Usage

#### Getting Started
1. **Power on the system**: Click STANDBY/ON button (red LED)
2. **Load audio files**:
   - Click INPUT knob to select individual files
   - OR click LIBRARY to load a folder
3. **Start playback**: Click PLAY/PAUSE

#### Main Controls
- **INPUT**: Load individual files
- **LIBRARY**: Load complete folder
- **PLAY/PAUSE**: Play/Pause
- **PREV/NEXT**: Previous/next track (hold for fast seek)
- **STOP**: Stop playback
- **VOLUME**: Click left/right or use mouse wheel — PUSH label above, ADJUST label below
- **EQUALIZER**: Rotary knob below INPUT — click left/right or mouse wheel to cycle EQ presets
- **BALANCE**: Rotary knob below VOLUME — click left/right or mouse wheel to adjust in 2% steps
- **MUTE**: Mute audio
- **OPTIONS**: Open options menu (EQ, balance, etc.)
- **DISPLAY**: Change display mode
- **RESET**: Restart application (with confirmation)

#### OPTIONS Menu
- **Bass/Treble**: Tone controls (±12dB in 2dB steps)
- **Balance L/R**: Stereo balance (0.1 increments)
- **TONE RESET**: Reset EQ and balance
- **MONO**: Mono mode on/off
- **LOUDNESS**: Loudness compensation on/off
- **10-BAND EQ**: Open graphic equalizer
- **REPEAT**: Cycle OFF → REPEAT(1) → REPEAT(ALL)
- **RANDOM**: Random mode on/off
- **A-B LOOP**: Cycle OFF → A set → A-B active
- **BACK COLOR**: Customize background color
- **SHADOW COLOR**: Customize shadow color

#### Direct Rotary Controls (no menu required)
- **EQUALIZER knob** (below INPUT): Cycle through EQ presets directly — FLAT, POP, ROCK, JAZZ, CLASSIC, LIVE
- **BALANCE knob** (below VOLUME): Adjust stereo balance in 2% steps with mandatory center snap

---

## ⚙️ Configuration

### Customizable CSS Variables

File `/css/root.css`:
```css
:root {
  /* Main colors */
  --panel-black: #1a1a1a;          /* Panel background */
  --mc-blue: #00c3ff;               /* McIntosh signature blue */
  --mc-green: #00ff66;              /* Label and LED green */
  --chassis-shadow: rgba(0,0,0,0.7); /* Chassis shadow */
  
  /* VFD colors */
  --vfd-bg: #0a0a0a;               /* VFD background */
  --vfd-text: #00c3ff;             /* VFD text */
  --vfd-glow: rgba(0,195,255,0.3); /* VFD glow */
  
  /* Button colors */
  --btn-black: #000000;            /* Black buttons */
  --btn-hover: #1a1a1a;            /* Button hover */
  --btn-active: #2a2a2a;           /* Active buttons */
  
  /* Dimensions */
  --panel-width: 1650px;
  --panel-height: 750px;
  --knob-size: 80px;
}
```

### Electron Configuration

File `package.json`:
```json
{
  "build": {
    "appId": "com.yohann.mcintosh",
    "productName": "McIntosh-DAP",
    "win": {
      "icon": "assets/img/favicon.ico",
      "target": "portable"
    },
    "directories": {
      "output": "dist"
    }
  }
}
```

### Service Worker Cache

File `sw.js` - Modify to customize cache:
```javascript
const CACHE_NAME = 'mcintosh-dap-v2.5.1';
const urlsToCache = [
  // Add or remove URLs to cache
];
```
---

## 🤝 Contributing

Contributions are welcome! Here's how to participate:

### Contribution Guidelines

1. **Fork** the project
2. **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Standards

#### JavaScript
- Modern ES6+
- Indentation: 4 spaces
- Semicolons required
- JSDoc comments for main functions
- Naming: camelCase for variables/functions, PascalCase for classes

#### CSS
- BEM naming convention when appropriate
- CSS variables for reusable values
- Mobile-first for responsive
- Comments for main sections

#### HTML
- Semantic HTML5
- ARIA attributes for accessibility
- Indentation: 4 spaces

### Pull Request Process

1. **Update** documentation if needed
2. **Add tests** for new features
3. **Verify** code works in web and desktop
4. **Describe** changes clearly in PR
5. **Wait** for review and feedback

### Bug Reporting

When reporting a bug, include:

- **Browser/OS** (e.g., Windows 11, Chrome 120)
- **Steps to reproduce**:
  1. First step
  2. Second step
  3. What happened
- **Expected vs actual behavior**
- **Console errors** (if any) - F12 → Console
- **Screenshots** (if visual issue)
- **Audio file format** (if playback issue)

### Feature Requests

When requesting a feature:

- Check if already on roadmap
- Explain the use case
- Describe expected behavior
- Consider implementation complexity
- Open to discussion and alternatives

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Yohann Zaoui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⚠️ Disclaimer

This is a **fan-made tribute project** and:

- **IS NOT affiliated** with McIntosh Laboratory, Inc.
- **IS NOT endorsed** by McIntosh Laboratory, Inc.
- **IS NOT an official** McIntosh product
- **IS NOT intended for commercial use**

McIntosh® is a registered trademark of McIntosh Laboratory, Inc. This project is created solely for educational and entertainment purposes as a tribute to their iconic design legacy.

---

## 🙏 Credits & Acknowledgments

### Design Inspiration

This project pays homage to **McIntosh Laboratory**, legendary American manufacturer of high-end audio equipment since 1949, renowned for:

- Iconic blue watt meters with illuminated scales
- Premium build quality and craftsmanship
- Timeless design aesthetics (black glass, chrome, illuminated meters)
- Audiophile-grade performance and sound quality
- Power Guard® technology for speaker protection
- Hand-built in Binghamton, New York, USA

### Libraries & Resources

- **[Font Awesome](https://fontawesome.com/)** - Comprehensive icon library (v7)
- **[jsmediatags](https://github.com/aadsm/jsmediatags)** - Audio metadata extraction library
- **[Google Fonts](https://fonts.google.com/)** - Web typography (Bitcount Single, Roboto)
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Mozilla Developer Network documentation
- **[HTML5 Audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)** - W3C specification
- **[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)** - PWA offline functionality
- **[Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)** - System media controls integration
- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop application framework

### Special Thanks

- The open-source community for tools and inspiration
- Audio enthusiasts and HiFi collectors for feedback
- McIntosh Laboratory for decades of design excellence
- All contributors, testers, and users
- The Web Audio API community and documentation authors
- Electron.js team for desktop integration capabilities

---

## 📞 Support & Contact

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/mcintosh-dap/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mcintosh-dap/discussions)
- **Documentation**: This README and inline code comments

### Useful Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTML5 Audio Guide](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [jsmediatags Documentation](https://github.com/aadsm/jsmediatags)
- [Service Worker Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [BiquadFilter API](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)
- [StereoPanner API](https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode)
- [Electron Documentation](https://www.electronjs.org/docs/latest)

### FAQ

**Q: Why won't my audio files play?**
A: Check that they're in a supported format (FLAC/MP3/WAV/MP4/AAC/OGG). Some browsers require user interaction before playing audio.

**Q: Why can't I see album art?**
A: Album art must be embedded in the file's ID3 tags. Use a tag editor like Mp3tag to add artwork.

**Q: What's the difference between REPEAT and REPEAT(1)?**
A: REPEAT(1) repeats the current track. REPEAT(ALL) repeats the entire playlist.

**Q: How do I install as a PWA?**
A: Serve via HTTPS, then look for "Install" option in your browser menu (usually in the address bar).

**Q: Why don't VU meters move?**
A: Ensure audio is playing and system is powered on. Check browser console for Web Audio API errors.

**Q: Can I use this offline?**
A: Yes, once installed as a PWA. However, audio files must be loaded each session (not cached).

**Q: How do I build the desktop app?**
A: Install Node.js, run `npm install`, then `npm run dist`. See the Desktop Version section for details.

**Q: Do the taskbar buttons work on macOS/Linux?**
A: Taskbar thumbnail buttons are Windows-only. However, global media key shortcuts work on all platforms.

**Q: What's the difference between the 10-band EQ and BASS/TREBLE?**
A: BASS/TREBLE are classic tone controls (shelf filters) for quick adjustments. The 10-band EQ provides precise frequency control across the entire audio spectrum. They work together.

**Q: How do I reset all EQ settings?**
A: Use TONE RESET in the options menu to reset BASS/TREBLE and balance. Use FLAT in the EQ popup to reset all 10 bands to 0dB. The EQUALIZER knob will also select the FLAT preset when cycled to position 0.

**Q: Can I customize the visual appearance?**
A: Yes! Use the BACK COLOR and SHADOW COLOR pickers in the options menu. The DISPLAY button also cycles through different visual states.

**Q: How do I set the balance exactly to center?**
A: The BALANCE knob features a mandatory center snap — when turning from left to right (or right to left), it automatically locks to 0 (center) before continuing. This ensures you never miss the center position.


---
<img width="1803" height="834" alt="2" src="https://github.com/user-attachments/assets/a130d215-2d24-4ea1-96f0-d44cc9b4afd8" />
<img width="1807" height="831" alt="3" src="https://github.com/user-attachments/assets/30af6be4-ef6b-435b-93b6-d70ea4edeb15" />
<img width="1797" height="826" alt="4" src="https://github.com/user-attachments/assets/56d0c643-1a89-4ef9-bcaa-bbc0542c2023" />
<img width="1807" height="840" alt="5" src="https://github.com/user-attachments/assets/830a9b4f-64fe-4f6a-b1e5-5f04ffae8491" />
<img width="1796" height="831" alt="6" src="https://github.com/user-attachments/assets/9441912f-24a2-4f74-b4bd-c20f3a8f4e0a" />
<img width="1791" height="820" alt="7" src="https://github.com/user-attachments/assets/7fcd8bb5-fc39-4ce2-aa6f-291988130ee3" />
<img width="1780" height="877" alt="8" src="https://github.com/user-attachments/assets/ae88b2ab-c54b-415a-888b-0aa4cddcddbc" />
<img width="1793" height="833" alt="9" src="https://github.com/user-attachments/assets/0d2fedd1-9f84-4150-b5e0-e42c1e7ce49c" />
<img width="1807" height="840" alt="10" src="https://github.com/user-attachments/assets/9b2009c8-4aeb-48c9-b25d-a4e7c85e8ab4" />
<img width="1796" height="831" alt="11" src="https://github.com/user-attachments/assets/bf2fbe72-a51e-43b3-921e-05b337901f37" />
---

**Enjoy your premium web audio experience! 🎵🎛️**

*Made with ❤️ for audio enthusiasts everywhere*
