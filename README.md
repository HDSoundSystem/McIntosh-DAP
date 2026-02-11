# McIntosh MSA5500
## Inspired by the high-end McIntosh MSA5500 2-Channel Streaming Integrated Amplifier

A premium web-based audio player inspired by the legendary McIntosh amplifier design, featuring authentic VU meters, professional 10-band equalizer, stereo balance, A-B loop functionality, mono mode, loudness compensation, power guard protection, customizable visual themes, and a stunning interface that captures the essence of high-end audio equipment.

![McIntosh MSA5500](https://img.shields.io/badge/McIntosh-MSA5500-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)

![McIntosh_Logo](https://github.com/user-attachments/assets/9f65f1d2-5f77-458b-b0fc-5ec35e992042)
<img width="1812" height="819" alt="1" src="https://github.com/user-attachments/assets/743fc39f-b688-4ed0-83db-9edfe5c5664f" />

## ✨ Features

### 🎵 Audio Playback

- **Multi-format support**: FLAC, MP3, MP4/M4A, WAV, AAC, ALAC, OGG
- **Multiple loading methods**: 
  - INPUT knob: Click to select individual files (multiple selection supported)
  - LIBRARY button: Load entire folders and browse tracks in organized modal
- **Playlist management**: 
  - Load and manage multiple audio files with visual playlist browser
  - Interactive playlist popup - click track counter to browse and select tracks
  - Visual indicator shows currently playing track
  - Library modal with organized file list display
- **Comprehensive playback controls**: Play, pause, stop, previous, next
- **Fast seeking**: Press and hold previous/next buttons for rapid track navigation (3-second jumps)
  - 500ms hold delay to prevent accidental seeks
  - 3-second jumps every 100ms while holding
- **Repeat modes**:
  - Off
  - Repeat single track - REPEAT(1)
  - Repeat all tracks - REPEAT(ALL)
- **Random playback**: Shuffle mode with intelligent track selection (avoids immediate repeats)
- **A-B Loop**: Set loop points for practicing or repeated listening
  - First click: Set point A
  - Second click: Set point B and activate loop
  - Third click: Disable loop
  - Automatic validation (B must be after A)
  - Visual indicator "A-B" in VFD display
- **Media session integration**: Control playback from keyboard media keys and system controls
  - Native browser controls support
  - Chrome/Edge position state tracking
  - Previous/Next track navigation
  - Play/Pause control
- **Automatic track progression**: Respects repeat and random modes when track ends
- **Progressive Web App (PWA)**: Installable with service worker for offline caching
- **Electron desktop app**: Cross-platform desktop application with system integration
  - Windows taskbar thumbnail buttons (Previous, Play/Pause, Next)
  - Media key support (Play/Pause, Next, Previous)
  - Native window controls and menu bar

### 📺 Visual Interface

- **Animated stereo VU meters**:
  - Real-time dual-channel audio visualization
  - Smooth needle animation with realistic physics (25% smoothing)
  - Authentic McIntosh meter design with custom background image
  - Power-law response curve for natural meter movement
  - Automatic return to rest position when stopped
  - Alternate background mode available (meter-alt-bg)
- **VFD Display**: Premium vacuum fluorescent display showing:
  - Track title with dynamic text sizing (auto-fits content)
  - Artist and album information
  - Current track number and total tracks (clickable for playlist)
  - File format indicator (FLAC, MP3, WAV, MP4, AAC/ALAC, OGG)
  - Bitrate calculation (estimated for VBR files)
  - Playback time with elapsed/remaining toggle (clickable)
  - Playback status icons (PLAY, PAUSE, STOP) with blinking pause indicator
  - Mode indicators (RANDOM, REPEAT, REPEAT(1), REPEAT(ALL), A-B LOOP) in bottom left corner
  - Loudness indicator when active
  - Volume display overlay (auto-hides after 2 seconds)
- **Display modes**:
  - Normal mode with full illumination
  - Alternate logo display (toggle between mc-logo.png and mc-logo-off.png)
  - Alternate VU meter backgrounds
  - Complete VFD blackout mode
  - Label dimming (all green labels turn gray when display is off)
- **Album art viewer**: Click track title to view embedded album artwork in popup modal
- **Interactive playlist**: Click track counter to browse and select tracks from popup menu
- **Status LEDs**:
  - Power LED (red) - indicates system on/off state
  - MONO LED (green) - active when mono mode enabled
  - POWER GUARD LEDs (red, left and right) - blink rapidly when volume ≥ 90%
- **Reboot confirmation modal**: Safety popup to confirm system restart
- **Visual theme customization**:
  - Background color picker - customize app background
  - Shadow color picker - adjust chassis shadow color
  - Real-time color preview in buttons
  - Persistent across sessions

### 🎛️ Audio Controls

- **Volume control**:
  - Interactive rotary knob with metallic chrome finish
  - Click and hold left/right for continuous adjustment (0.01 steps at 50ms intervals)
  - Mouse wheel support for precise control (0.05 steps)
  - Visual feedback with knob rotation animation (270° range)
  - Temporary display overlay (auto-hides after 2 seconds)
  - Hover to show current volume level
  - Integrated with loudness compensation
- **Mute function**: 
  - Instant audio muting with status display
  - Shows "MUTE" in volume display area
  - Preserves volume setting
- **10-Band Graphic Equalizer**:
  - Professional frequency control across the entire audio spectrum
  - Frequencies: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz
  - Range: ±12dB per band
  - Musical Q factor (1.4) for natural sound shaping
  - Real-time Web Audio API processing with Peaking filters
  - Dedicated popup interface with vertical sliders
  - Visual frequency labels and gain indicators
  - FLAT reset button to restore all bands to 0dB
  - Independent from bass/treble tone controls
- **2-Band Tone Controls** (Classic McIntosh style):
  - Bass control: ±12dB at 200Hz (low shelf filter)
    - Adjustable in 2dB steps
    - Range: -12dB to +12dB
  - Treble control: ±12dB at 3000Hz (high shelf filter)
    - Adjustable in 2dB steps
    - Range: -12dB to +12dB
  - Real-time audio processing with Web Audio API biquad filters
  - Visual feedback in options menu
- **Stereo Balance**:
  - Left/Right balance adjustment (-1 to +1)
  - Web Audio API StereoPanner for precise control
  - Step-based adjustment (0.1 increments)
  - Disabled when Mono mode is active
- **Mono Mode**:
  - Converts stereo to mono output
  - Automatically centers balance when activated
  - Green LED indicator
  - Restores previous balance when deactivated
- **Loudness Compensation**:
  - Fletcher-Munson based bass/treble boost at low volumes
  - Automatic compensation based on current volume level
  - Maximum effect at 0% volume, progressively decreases
  - Bass boost: up to +8dB additional gain
  - Treble boost: up to +4dB additional gain
  - Works in conjunction with manual EQ settings
  - Visual indicator in VFD display when active
- **Tone Reset**: One-click restoration to flat EQ (0dB) and center balance (0)
- **Power Guard Protection**: 
  - Visual warning when volume exceeds 90%
  - Rapid blinking red LEDs (left and right)
  - Prevents accidental speaker/hearing damage

### ⚙️ Advanced Features

- **Library Management**:
  - Dedicated LIBRARY button for folder-based loading
  - Modal interface for browsing and selecting tracks
  - Automatic audio file filtering (supports all audio/* MIME types + M4A/AAC/OGG)
  - Track list displayed with green play indicators
  - Click any track to load and start playback
  - Displays total track count on load
  - Requires system to be powered on
  - Close button and click-outside-to-close functionality
- **Web Audio API processing**: Professional audio graph with:
  - MediaElementSourceNode for audio input
  - StereoPanner for balance control
  - Two BiquadFilter nodes for bass/treble tone controls
  - Ten BiquadFilter nodes for 10-band graphic equalizer (Peaking type)
  - ChannelSplitter for stereo separation
  - Dual AnalyserNodes for independent L/R VU meters
  - Real-time frequency analysis (FFT size: 1024)
  - Complete signal chain with seamless integration
- **ID3 tag extraction**: 
  - Automatic metadata reading with jsmediatags 3.9.5 library
  - Extracts title, artist, album, and embedded artwork
  - Displays album art in popup viewer
  - Base64 image decoding for artwork
- **Responsive controls**: 
  - Tactile button feedback with press animation
  - Smooth knob rotation with CSS transforms
  - Visual LED states with glow effects
- **Options menu**: 
  - Hidden panel with advanced controls
  - Positioned to the right of main interface
  - Gold border McIntosh styling
  - Includes logo, dividers, and organized button groups
  - Access to EQ, Loudness, Mono, Balance, and visual customization
- **Info display**:
  - Dedicated INFO button in options menu
  - Full-screen overlay with application information
  - Click anywhere to close
- **Persistent power state**: 
  - LED indicator shows system status
  - Complete system reset on power off
  - Clears playlist and resets all modes
  - Confirmation modal prevents accidental reboot
- **Professional UI**: 
  - McIntosh-inspired design with authentic colors
  - Chrome-finished side trims with realistic shadows
  - Bitcount Single font for VFD display
  - Roboto font for labels and controls
  - Blue (#00c3ff) and green (#00ff41) accent colors
  - Gold (#786b46) highlights for special elements
  - Customizable background and shadow colors
- **Click-outside-to-close**: 
  - Options menu closes when clicking outside
  - Playlist popup closes when clicking outside
  - Album art popup closes on overlay click
  - Library modal closes on overlay click or X button
  - EQ popup closes on overlay click or X button
- **Seek Hold Feature**:
  - Hold previous/next buttons for 500ms to activate seeking
  - 3-second jumps every 100ms while holding
  - Prevents accidental seeks with delay detection
- **Service Worker Integration**:
  - Offline caching of all static assets
  - Progressive Web App capabilities
  - Cache versioning and management
  - Force update support via message API
- **Electron Desktop Integration**:
  - Native application window with auto-hide menu bar
  - Windows taskbar thumbnail buttons with custom icons
  - Global keyboard shortcut support for media keys
  - Proper window lifecycle management
  - Cross-platform support (Windows, macOS, Linux)
- **iPad & Tablet Compatibility**:
  - Responsive scaling (0.85x on screens < 1100px, 0.7x on < 800px)
  - Touch-optimized controls with tap-highlight disabled
  - Automatic scroll handling on smaller displays
  - Side trims hidden on portrait mode to save space
  - Adaptive VFD display width (90vw on tablets)

## 🚀 Getting Started

### Web Version (Browser)

#### Prerequisites

- **Modern web browser** with Web Audio API support:
  - Chrome 57+ (recommended)
  - Firefox 53+
  - Safari 14.1+
  - Edge 79+
- **Local web server** (for testing):
  - Python: `python -m http.server 8000`
  - Node.js: `npx http-server`
  - PHP: `php -S localhost:8000`
- **HTTPS required** for PWA installation (localhost exempt)

#### Installation

1. **Clone** the repository:
   
   ```bash
   git clone https://github.com/yourusername/mcintosh-msa5500.git
   cd mcintosh-msa5500
   ```

2. **Serve** the files via a local web server:
   
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open** your browser:
   
   ```
   http://localhost:8000
   ```

#### PWA Installation

For offline access and app-like experience:

1. **Serve via HTTPS** (required for service worker):
   - Use a hosting service (GitHub Pages, Netlify, Vercel)
   - Or use local HTTPS with tools like `mkcert`

2. **Install the app**:
   - Chrome: Click the install icon in the address bar
   - Firefox: Look for "Install" in the page menu
   - Safari: Share → Add to Home Screen
   - Edge: Click the app icon in the address bar

3. **Enjoy offline access** to the interface (audio files loaded per session)

### Desktop Version (Electron)

#### Prerequisites

- **Node.js** 16+ and npm
- **Git** for cloning the repository

#### Installation

1. **Clone** the repository:
   
   ```bash
   git clone https://github.com/yourusername/mcintosh-msa5500.git
   cd mcintosh-msa5500
   ```

2. **Install** dependencies:
   
   ```bash
   npm install
   ```

3. **Run** the application:
   
   ```bash
   npm start
   ```

#### Building Executables

Create standalone executables for distribution:

```bash
# Build for current platform
npm run dist

# Output will be in the 'dist' folder
```

**Build configuration** (in `package.json`):
- Windows: Portable executable (.exe)
- Icon assets required in `assets/windows/` folder:
  - `prev.png` - Previous track button
  - `play.png` - Play button
  - `pause.png` - Pause button
  - `next.png` - Next track button
- Output directory: `dist/`

#### Desktop Features

The Electron version includes additional features:

- **Taskbar thumbnail buttons** (Windows only):
  - Previous track
  - Play/Pause with dynamic icon
  - Next track
- **Global media key support**:
  - MediaPlayPause - Toggle play/pause
  - MediaNextTrack - Skip to next
  - MediaPreviousTrack - Go to previous
- **Native window integration**:
  - Auto-hiding menu bar for cleaner interface
  - Proper window state management
  - Native file dialogs

## 🎮 Usage Guide

### Quick Start

1. **Power On**: Click the POWER button (red LED lights up)
2. **Load Music**: 
   - Click INPUT knob to select files, OR
   - Click LIBRARY button to load a folder
3. **Play**: Click the PLAY/PAUSE button
4. **Adjust**: Use VOLUME knob and controls in OPTIONS menu

### Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│  VU METER (L)    │   McIntosh Logo   │   VU METER (R)  │
│                  │   [POWER GUARD]   │                  │
│                  │      [MONO]       │                  │
├─────────────────────────────────────────────────────────┤
│                  VFD DISPLAY AREA                       │
│  Track 1/10      Title - Artist - Album      --:--     │
│  FLAC 1411 KBPS                              [STATUS]  │
├─────────────────────────────────────────────────────────┤
│ [INPUT] [◄◄] [►►] [▶/❚❚] [■] [MUTE] [OPTIONS] [VOL]  │
└─────────────────────────────────────────────────────────┘
```

### Control Functions

#### Basic Controls

| Control | Function | Notes |
|---------|----------|-------|
| **POWER** | System on/off | Shows confirmation modal |
| **INPUT** | Select audio files | Multiple selection supported |
| **LIBRARY** | Load folder | Browse and select tracks |
| **◄◄ (PREV)** | Previous track | Hold 500ms for seek backward |
| **►► (NEXT)** | Next track | Hold 500ms for seek forward |
| **▶/❚❚ (PLAY/PAUSE)** | Toggle playback | - |
| **■ (STOP)** | Stop playback | Resets to track start |
| **MUTE** | Toggle mute | Preserves volume level |
| **VOLUME** | Adjust volume | Click/hold or mouse wheel |
| **DISPLAY** | Toggle display modes | Cycles through visual states |

#### OPTIONS Menu Controls

| Control | Function | Range/Steps |
|---------|----------|-------------|
| **RANDOM** | Shuffle mode | On/Off |
| **REPEAT** | Repeat modes | Off → (1) → (ALL) |
| **A-B LOOP** | Set loop points | A → A-B → Off |
| **LIBRARY** | Open folder browser | - |
| **EQ** | 10-band equalizer | ±12dB per band |
| **LOUDNESS** | Fletcher-Munson curve | Automatic at low volumes |
| **MONO** | Mono/stereo mode | Green LED when active |
| **BASS ↑/↓** | Adjust bass tone | ±12dB in 2dB steps |
| **TONE RESET** | Reset tone & balance | Flat 0dB, center balance |
| **TREBLE ↑/↓** | Adjust treble tone | ±12dB in 2dB steps |
| **BALANCE L/R** | Stereo balance | -100% to +100% in 10% steps |
| **BACK COLOR** | Background color | Color picker |
| **SHADOW COLOR** | Chassis shadow | Color picker |
| **INFO** | Application info | Full-screen overlay |

### Equalizer Panel (EQ Popup)

| Frequency | Type | Q Factor | Range |
|-----------|------|----------|-------|
| **32 Hz** | Peaking | 1.4 | ±12dB |
| **64 Hz** | Peaking | 1.4 | ±12dB |
| **125 Hz** | Peaking | 1.4 | ±12dB |
| **250 Hz** | Peaking | 1.4 | ±12dB |
| **500 Hz** | Peaking | 1.4 | ±12dB |
| **1 kHz** | Peaking | 1.4 | ±12dB |
| **2 kHz** | Peaking | 1.4 | ±12dB |
| **4 kHz** | Peaking | 1.4 | ±12dB |
| **8 kHz** | Peaking | 1.4 | ±12dB |
| **16 kHz** | Peaking | 1.4 | ±12dB |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **← (Left Arrow)** | Balance left |
| **→ (Right Arrow)** | Balance right |
| **MediaPlayPause** | Play/Pause (desktop) |
| **MediaNextTrack** | Next track (desktop) |
| **MediaPreviousTrack** | Previous track (desktop) |

### Interactive Elements

- **Click track count**: Opens playlist popup
- **Click track title**: Opens album art viewer (if available)
- **Click time display**: Toggle elapsed/remaining time
- **Click VFD modes**: Displays current settings
- **Hover volume knob**: Shows current volume level
- **Hover tone controls**: Shows current tone values
- **Hover balance controls**: Shows current balance value

### Tips & Tricks

1. **Professional EQ**: Use the 10-band equalizer for precise frequency control
2. **Quick Tone**: Use BASS/TREBLE for fast adjustments, EQ for detailed shaping
3. **Visual Themes**: Customize colors to match your setup or mood
4. **Loudness**: Automatically enhances bass/treble at low volumes
5. **Power Guard**: Red LEDs warn when volume ≥90%
6. **Seek Mode**: Hold ◄◄ or ►► for 500ms to jump through track
7. **A-B Practice**: Perfect for musicians - loop difficult sections
8. **Mono Mode**: Useful for checking mixes and voice-over work
9. **Display Toggle**: Cycle through different visual states for ambiance
10. **Tablet Mode**: Works great on iPad - optimized responsive design

## 🛠️ Technical Details

### Architecture

```
McIntosh MSA5500
│
├── Frontend (HTML/CSS/JS)
│   ├── index.html          - Main structure
│   ├── style.css           - Visual styling
│   ├── script.js           - Core logic and UI control
│   ├── main.js             - Electron main process (desktop only)
│   └── mcintosh-audio-engine.js - Audio processing engine
│
├── Audio Engine
│   └── Web Audio API Graph:
│       MediaElement → StereoPanner → BiquadFilter(Bass) 
│       → BiquadFilter(Treble) → 10x BiquadFilter(EQ Bands)
│       → ChannelSplitter → AnalyserNode(L/R) → Destination
│
├── Service Worker (PWA)
│   └── sw.js               - Offline caching
│
└── Assets
    ├── img/                - Logos, VU meter backgrounds
    ├── fontawesome7/       - Icon library
    ├── windows/            - Electron taskbar icons (desktop)
    └── info/               - Application info image
```

### Web Audio API Graph

```
┌──────────────┐
│ MediaElement │ (HTML5 Audio)
└──────┬───────┘
       │
┌──────▼────────┐
│ StereoPanner  │ (Balance Control)
└──────┬────────┘
       │
┌──────▼────────┐
│ BiquadFilter  │ (Bass - Low Shelf 200Hz)
└──────┬────────┘
       │
┌──────▼────────┐
│ BiquadFilter  │ (Treble - High Shelf 3000Hz)
└──────┬────────┘
       │
┌──────▼────────┐
│ 10-Band EQ    │ (Peaking Filters)
│ 32Hz-16kHz    │
└──────┬────────┘
       │
┌──────▼───────────┐
│ ChannelSplitter  │ (Stereo Separation)
└──────┬───────────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│ AL  │ │ AR  │ (AnalyserNodes)
└─────┘ └─────┘
   │       │
   └───┬───┘
       │
┌──────▼────────┐
│  Destination  │ (Output)
└───────────────┘
```

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| **Web Audio API** | ✅ 57+ | ✅ 53+ | ✅ 14.1+ | ✅ 79+ |
| **File API** | ✅ | ✅ | ✅ | ✅ |
| **Service Worker** | ✅ | ✅ | ✅ | ✅ |
| **Media Session** | ✅ | ✅ | ✅ | ✅ |
| **FLAC Support** | ✅ | ✅ | ❌* | ✅ |
| **AAC/ALAC** | ✅ | ✅ | ✅ | ✅ |
| **OGG Vorbis** | ✅ | ✅ | ❌ | ✅ |

\* Safari requires QuickTime for FLAC and doesn't support OGG

### File Format Support

| Format | Container | Codec | Bitrate | Notes |
|--------|-----------|-------|---------|-------|
| **FLAC** | FLAC | FLAC | Lossless | Preferred for audiophile |
| **WAV** | WAV | PCM | Lossless | Universal support |
| **MP3** | MP3 | MPEG-1/2 Layer 3 | 32-320 kbps | Most compatible |
| **MP4/M4A** | MP4 | AAC/ALAC | 64-320 kbps | Good quality/size ratio |
| **AAC** | AAC | AAC | 64-320 kbps | High quality |
| **OGG** | OGG | Vorbis | 64-500 kbps | Open format |

### Performance Specifications

- **Audio Processing Latency**: <10ms (typical)
- **VU Meter Refresh Rate**: 60fps (requestAnimationFrame)
- **Frequency Analysis**: 1024-point FFT
- **Volume Steps**: 0.01 (1% increments)
- **Tone Control Resolution**: 2dB steps
- **EQ Resolution**: 1dB steps (10-band graphic EQ)
- **Balance Resolution**: 0.1 (10% steps)
- **Service Worker Cache**: ~5MB (static assets only)
- **EQ Bands**: 10 (32Hz to 16kHz)
- **EQ Q Factor**: 1.4 (musical bandwidth)

### Security & Privacy

- **No tracking**: Zero analytics or telemetry
- **Local processing**: All audio processing happens in-browser
- **No uploads**: Files never leave your device
- **No server**: Pure client-side application
- **No cookies**: No data storage beyond PWA cache
- **Color preferences**: Stored in CSS variables only

## 🔧 Development

### Project Structure

```
mcintosh-msa5500/
│
├── index.html                   # Main HTML structure
├── style.css                    # All styling and animations
├── script.js                    # Core application logic
├── main.js                      # Electron main process
├── mcintosh-audio-engine.js     # Audio processing engine
├── package.json                 # Node.js dependencies & build config
├── manifest.json                # PWA manifest
├── sw.js                        # Service Worker for offline functionality
├── README.md                    # This file
├── LICENSE                      # MIT License
│
└── assets/
    ├── img/
    │   ├── mc-logo.png          # McIntosh logo (on state)
    │   ├── mc-logo-off.png      # McIntosh logo (off state)
    │   ├── logo_b.png           # Brand logo variant
    │   ├── logo_cover.png       # Cover logo
    │   ├── favicon.png          # App icon
    │   ├── favicon.ico          # Windows icon
    │   ├── vumeter-new.png      # VU meter background (normal)
    │   └── vumeter-new-off.png  # VU meter background (alt)
    │
    ├── fontawesome7/            # Font Awesome 7 icon library
    │   ├── css/
    │   └── webfonts/
    │
    ├── windows/                 # Electron desktop icons
    │   ├── prev.png             # Previous button icon
    │   ├── play.png             # Play button icon
    │   ├── pause.png            # Pause button icon
    │   └── next.png             # Next button icon
    │
    └── info/                    # Application information
        └── info.png             # Info overlay image
```

### Technology Stack

**Frontend:**
- HTML5 (Audio API, File API)
- CSS3 (Animations, Transforms, Gradients, Custom Properties)
- Vanilla JavaScript (ES6+)
- Web Audio API (Extended with 10-band EQ)
- Service Worker API
- Media Session API

**Desktop:**
- Electron 26.0.0
- electron-builder 24.6.4

**Dependencies:**
- [jsmediatags](https://github.com/aadsm/jsmediatags) 3.9.5 - ID3 tag extraction
- [Font Awesome](https://fontawesome.com/) 7 - Icon library

**Fonts:**
- [Bitcount Single](https://fonts.google.com/) - VFD display font
- [Roboto](https://fonts.google.com/) - UI labels and controls

### Code Style

- **JavaScript**: ES6+ features, 4-space indentation
- **CSS**: BEM-inspired naming, CSS custom properties
- **HTML**: Semantic markup, accessibility attributes
- **Comments**: Inline for complex logic, JSDoc for functions

### Build Process

#### Web Version

No build process required - direct file serving:

```bash
# Development
python -m http.server 8000

# Production
# Simply upload files to any static hosting service
```

#### Electron Desktop

```bash
# Install dependencies
npm install

# Development mode
npm start

# Build executable
npm run dist
```

**electron-builder** configuration handles:
- Packaging application with assets
- Creating native installers/executables
- Code signing (optional)
- Multi-platform builds

### Extending the Application

#### Adding New Audio Formats

1. Update `accept` attribute in `index.html`:
```html
<input type="file" id="audio-upload" accept=".flac,.mp3,.mp4,.wav,.m4a,.aac,.ogg">
```

2. Add format detection in `script.js`:
```javascript
const ext = file.name.split('.').pop().toLowerCase();
fileFormat.textContent = (ext === 'm4a') ? "AAC/ALAC" : ext.toUpperCase();
```

#### Customizing VU Meters

Modify the meter response in the audio engine:

```javascript
// Adjust smoothing (0-1, lower = more responsive)
const SMOOTHING = 0.25;

// Adjust power curve (higher = more dramatic movement)
const POWER = 1.5;
```

#### Adding New EQ Bands

Modify `mcintosh-audio-engine.js`:

```javascript
// Add new frequencies to the array
this.eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000, 20000];
```

#### Adding New Themes

Create alternate color schemes in `style.css`:

```css
:root {
  --mc-blue: #00c3ff;           /* Primary accent */
  --mc-green: #00ff41;          /* Secondary accent */
  --mc-gold: #786b46;           /* Highlights */
  --background-color-app: #1b1b1b;  /* App background */
  --chassis-shadow: #2e2e2e;    /* Chassis shadow */
}
```

## 📋 Requirements

### Web Version

- **Browser**: Chrome 57+, Firefox 53+, Safari 14.1+, Edge 79+
- **JavaScript**: Must be enabled
- **Storage**: ~5MB for PWA cache (optional)
- **Network**: Required for initial load (offline after PWA install)
- **Display**: 1280x800 minimum (responsive down to tablet sizes)

### Desktop Version

- **Operating System**:
  - Windows 10/11 (64-bit)
  - macOS 10.13+ (High Sierra or later)
  - Linux (Ubuntu 18.04+, Debian 10+, Fedora 32+)
- **RAM**: 512MB minimum, 1GB recommended
- **Disk Space**: 100MB for application
- **Display**: 1280x800 minimum resolution

### Audio Files

- **Supported formats**: FLAC, MP3, MP4/M4A, WAV, AAC, ALAC, OGG
- **Embedded metadata**: ID3v2 tags recommended for full functionality
- **Album art**: Embedded in file (JPEG/PNG)
- **File size**: No theoretical limit (browser memory dependent)

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements, your help makes this project better.

### How to Contribute

1. **Fork** the repository

2. **Create** a feature branch:
   
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make** your changes

4. **Test** thoroughly across browsers
   - Chrome, Firefox, Safari minimum
   - Test on mobile/tablet if changing UI
   - Test all EQ bands and audio controls

5. **Commit** with clear messages:
   
   ```bash
   git commit -m "Add amazing feature: detailed description"
   ```

6. **Push** to your fork:
   
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Submit** a pull request with:
   - Clear description of changes
   - Screenshots/GIFs if visual changes
   - Test results

### Contribution Guidelines

- Test in Chrome, Firefox, and Safari at minimum
- Maintain existing code style (ES6+, 4-space indent)
- Update README if adding features
- Add comments for complex logic
- Ensure backwards compatibility
- Don't break existing features
- Test PWA functionality if modifying service worker
- Test EQ functionality if modifying audio engine
- Update version number in manifest.json if applicable

### Bug Reports

When reporting bugs, include:

- **Browser and version** (e.g., Chrome 120.0.6099.129)
- **Operating system** (e.g., Windows 11, macOS 14.2)
- **Steps to reproduce**:
  1. First step
  2. Second step
  3. What happened
- **Expected vs actual behavior**
- **Console errors** (if any) - press F12 → Console tab
- **Screenshots** (if visual issue)
- **Audio file format** (if playback issue)

### Feature Requests

When requesting features:

- Check if already on the roadmap
- Explain the use case
- Describe expected behavior
- Consider implementation complexity
- Open to discussion and alternatives

## 📄 License

This project is released under the **MIT License**.

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

## ⚠️ Disclaimer

This is a **fan-made tribute project** and is:

- **NOT affiliated** with McIntosh Laboratory, Inc.
- **NOT endorsed** by McIntosh Laboratory, Inc.
- **NOT an official** McIntosh product
- **NOT intended for commercial use**

McIntosh® is a registered trademark of McIntosh Laboratory, Inc. This project is created solely for educational and entertainment purposes as a tribute to their iconic design legacy.

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

## 📞 Support & Contact

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/mcintosh-msa5500/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mcintosh-msa5500/discussions)
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
A: Use TONE RESET in the options menu to reset BASS/TREBLE and balance. Use FLAT in the EQ popup to reset all 10 bands to 0dB.

**Q: Can I customize the visual appearance?**
A: Yes! Use the BACK COLOR and SHADOW COLOR pickers in the options menu. The DISPLAY button also cycles through different visual states.

**Q: Does this work on iPad?**
A: Yes! The interface is optimized for tablets with responsive scaling and touch-friendly controls.

-----
<img width="1802" height="834" alt="3" src="https://github.com/user-attachments/assets/051d8e51-095d-4744-8215-b81dbdce3987" />
<img width="1817" height="846" alt="4" src="https://github.com/user-attachments/assets/bcdfa958-d939-455c-8b29-2b90c4ed9ab0" />
<img width="1816" height="839" alt="5" src="https://github.com/user-attachments/assets/fbe8e2bf-213e-4ccc-8873-e1abd337719e" />
<img width="1797" height="921" alt="6" src="https://github.com/user-attachments/assets/788185d2-cb92-4f22-92be-bacb34523776" />
<img width="1804" height="821" alt="7" src="https://github.com/user-attachments/assets/0b5a41f4-96ba-489c-a4fa-b0774b818d35" />
<img width="1805" height="805" alt="8" src="https://github.com/user-attachments/assets/41eba24d-5876-47da-aef7-0403661302e0" />
<img width="1806" height="888" alt="9" src="https://github.com/user-attachments/assets/2087c738-5dc8-4959-b2f6-957eb6706373" />
<img width="1828" height="902" alt="2" src="https://github.com/user-attachments/assets/c3491534-3d01-4904-a78c-7428fc1fe291" />


**Enjoy your premium web audio experience! 🎵🎛️**

*Made with ❤️ for audio enthusiasts everywhere*
