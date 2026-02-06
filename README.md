# McIntosh MSA5500
## Inspired by the high-end McIntosh MSA5500 2-Channel Streaming Integrated Amplifier

A premium web-based audio player inspired by the legendary McIntosh amplifier design, featuring authentic VU meters, professional equalizer controls, stereo balance, A-B loop functionality, mono mode, loudness compensation, power guard protection, and a stunning interface that captures the essence of high-end audio equipment.

![McIntosh MSA5500](https://img.shields.io/badge/McIntosh-MSA5500-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)

![McIntosh_Logo](https://github.com/user-attachments/assets/9f65f1d2-5f77-458b-b0fc-5ec35e992042)

<img width="1816" height="799" alt="1" src="https://github.com/user-attachments/assets/6a6ff571-4bf8-4ad5-b307-fd850861a055" />

## ✨ Features

### 🎵 Audio Playback

- **Multi-format support**: FLAC, MP3, MP4, WAV
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
- **Automatic track progression**: Respects repeat and random modes when track ends
- **Progressive Web App (PWA)**: Installable with service worker for offline caching

### 📺 Visual Interface

- **Animated stereo VU meters**:
  - Real-time dual-channel audio visualization
  - Smooth needle animation with realistic physics (25% smoothing)
  - Authentic McIntosh meter design with custom background image
  - Power-law response curve for natural meter movement
  - Automatic return to rest position when stopped
- **VFD Display**: Premium vacuum fluorescent display showing:
  - Track title with dynamic text sizing (auto-fits content)
  - Artist and album information
  - Current track number and total tracks (clickable for playlist)
  - File format indicator (FLAC, MP3, WAV, MP4)
  - Bitrate calculation (estimated for VBR files)
  - Playback time with elapsed/remaining toggle (clickable)
  - Playback status icons (PLAY, PAUSE, STOP) with blinking pause indicator
  - Mode indicators (RANDOM, REPEAT, REPEAT(1), REPEAT(ALL), A-B LOOP) in bottom left corner
  - Loudness indicator when active
  - Volume display overlay (auto-hides after 2 seconds)
- **Display modes**:
  - Normal mode with full illumination
  - Stealth mode (complete blackout - VFD and VU meters dimmed)
- **Album art viewer**: Click track title to view embedded album artwork in popup modal
- **Interactive playlist**: Click track counter to browse and select tracks from popup menu
- **Status LEDs**:
  - Power LED (red) - indicates system on/off state
  - MONO LED (green) - active when mono mode enabled
  - POWER GUARD LEDs (red, left and right) - blink rapidly when volume ≥ 90%

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
- **2-Band Equalizer**:
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
  - Keyboard shortcuts (Arrow keys)
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
  - Automatic audio file filtering (supports all audio/* MIME types)
  - Track list displayed with green play indicators
  - Click any track to load and start playback
  - Displays total track count on load
  - Requires system to be powered on
  - Close button and click-outside-to-close functionality
- **Web Audio API processing**: Professional audio graph with:
  - MediaElementSourceNode for audio input
  - StereoPanner for balance control
  - Two BiquadFilter nodes for bass/treble EQ
  - ChannelSplitter for stereo separation
  - Dual AnalyserNodes for independent L/R VU meters
  - Real-time frequency analysis (FFT size: 1024)
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
- **Persistent power state**: 
  - LED indicator shows system status
  - Complete system reset on power off
  - Clears playlist and resets all modes
- **Professional UI**: 
  - McIntosh-inspired design with authentic colors
  - Chrome-finished side trims with realistic shadows
  - Bitcount Single font for VFD display
  - Roboto font for labels and controls
  - Blue (#00c3ff) and green (#00ff41) accent colors
  - Gold (#ffd700) highlights for special elements
- **Click-outside-to-close**: 
  - Options menu closes when clicking outside
  - Playlist popup closes when clicking outside
  - Album art popup closes on overlay click
  - Library modal closes on overlay click or X button
- **Seek Hold Feature**:
  - Hold previous/next buttons for 500ms to activate seeking
  - 3-second jumps every 100ms while holding
  - Prevents accidental seeks with delay detection
- **Service Worker Integration**:
  - Offline caching of all static assets
  - Progressive Web App capabilities
  - Cache versioning and management
  - Force update support via message API

### 🎹 Input Controls Summary

#### Mouse/Click Interactions
- **INPUT Knob**: Click to select audio files (multiple selection supported)
- **LIBRARY Button**: Open folder browser modal to load entire directories
- **VOLUME Knob**: 
  - Click left half: Decrease volume
  - Click right half: Increase volume
  - Hold: Continuous adjustment
  - Scroll wheel: Fine adjustment
  - Hover: Show current volume
- **Play/Pause Button**: Toggle playback
- **Stop Button**: Stop and reset to beginning
- **Previous Button**: Click for previous track, hold for rewind
- **Next Button**: Click for next track, hold for fast forward
- **Mute Button**: Toggle mute
- **OPTIONS Button**: Open/close options menu
- **DISPLAY Button**: Toggle stealth mode
- **POWER Button**: System on/off
- **Track Title (VFD)**: Click to view album art
- **Track Counter**: Click to open playlist browser
- **Time Display**: Click to toggle elapsed/remaining time

#### Options Menu Buttons
- **RANDOM**: Toggle shuffle mode
- **REPEAT**: Cycle through repeat modes
- **A-B**: Set loop points
- **LOUDNESS**: Toggle loudness compensation
- **MONO**: Toggle mono mode
- **BASS +/-**: Adjust bass EQ
- **TREBLE +/-**: Adjust treble EQ
- **BALANCE L/R**: Adjust stereo balance
- **TONE RESET**: Reset EQ and balance

#### Keyboard Shortcuts
- **Left Arrow**: Balance left
- **Right Arrow**: Balance right
- **Media Keys**: Control playback (play/pause/stop/next/previous)

## 🚀 Installation

### Quick Start

1. **Clone or download** this repository:
   
   ```bash
   git clone https://github.com/yourusername/mcintosh-msa5500.git
   ```
1. **Verify file structure**:
   
   ```
   mcintosh-msa5500/
   ├── index.html
   ├── script.js
   ├── style.css
   ├── README.md
   ├── manifest.json
   ├── sw.js (service worker)
   ├── img/
   │   ├── mc-logo.png
   │   ├── logo_b.png
   │   ├── favicon.png
   │   └── vumeter-new.png
   └── fontawesome7/
       └── css/
           └── all.min.css
   ```
1. **Add required assets**:
- **McIntosh logo** (`mc-logo.png`): Main brand logo for center display
- **Options logo** (`logo_b.png`): Logo for options menu
- **VU meter background** (`vumeter-new.png`): Authentic meter dial image
- **Favicon** (`favicon.png`): Browser tab icon (192x192 and 512x512 for PWA)
1. **Install Font Awesome** (if not included):
- Download Font Awesome 7 or use CDN
- Place in `fontawesome7/css/` directory
1. **Open in browser**:
- Simply open `index.html` in any modern web browser
- For PWA features, serve via HTTPS or localhost
- No server or build process required!

### PWA Installation (Optional)

1. Serve the application via HTTPS (required for service workers)
2. Browser will prompt to "Install" or "Add to Home Screen"
3. Once installed, app works offline with cached assets
4. Icon will appear in app drawer/start menu

## 📖 User Guide

### Getting Started

1. **Power On**: Click the red **STANDBY/ON** button
   - Power LED will illuminate
   - VFD will show "Push input to select your tracks"
2. **Load Tracks**: Click the **INPUT** knob to select audio files
   - Multiple file selection supported
   - Supports FLAC, MP3, MP4, WAV formats
3. **Play Music**: Use center control buttons for playback
   - Play/Pause, Stop, Previous, Next
4. **Access Options**: Click **OPTIONS** button for EQ and advanced features
   - EQ controls, balance, loudness, mono mode

### Main Controls

#### Input Section

- **INPUT Knob**:
  - Click to open file selector
  - Supports multiple file selection
  - Displays "PUSH" indicator below knob
  - Auto-powers on system if off

#### Playback Controls

- **⏮ Previous**:
  - Click: Skip to previous track (or restart if at beginning)
  - Hold 500ms: Fast rewind within track (3s jumps)
- **⏭ Next**:
  - Click: Skip to next track (respects random/repeat modes)
  - Hold 500ms: Fast forward within track (3s jumps)
- **▶/⏸ Play/Pause**: 
  - Toggle playback
  - Initializes audio engine on first play
  - Shows play/pause icon in VFD
- **⏹ Stop**: 
  - Stop playback and reset to start
  - Updates VFD status icon
- **MUTE**: 
  - Toggle audio muting
  - Shows "MUTE" in volume display
  - Preserves volume setting

#### Volume Section

- **VOLUME Knob**:
  - Click left side: Decrease volume (continuous when held)
  - Click right side: Increase volume (continuous when held)
  - Hold for continuous adjustment (0.01 steps at 50ms)
  - Mouse wheel: Fine volume control (0.05 steps)
  - Hover to display current level (shows for 2 seconds)
  - Shows "ADJUST" indicator below knob
  - Rotates visually from -135° to +135° (270° range)
  - Triggers Power Guard LEDs when volume ≥ 90%

#### System Controls

- **OPTIONS**: Open/close advanced controls menu
  - Displays to the right of main panel
  - Click outside to close
- **DISPLAY**: Toggle stealth mode (blackout)
  - Dims VFD display
  - Reduces VU meter visibility
  - Hides needles
- **STANDBY/ON**: Power on/off with full system reset
  - Power LED indicates state
  - Complete system reset on power off
  - Clears playlist and all modes
  - Long press RESET (below button) for factory reset

### OPTIONS Menu

Click **OPTIONS** to reveal advanced controls organized in sections:

#### Playback Modes

- **RANDOM**: 
  - Toggle shuffle playback order
  - Avoids repeating same track twice in a row
  - Status shown in VFD bottom left
- **REPEAT**: 
  - Cycle through modes (click to advance):
    - Off → Repeat One → Repeat All → Off
  - "REPEAT(1)" or "REPEAT(ALL)" shown in VFD
- **A-B**: 
  - Set loop points (three-state button):
    - First click: Set point A (shows "POINT A SET")
    - Second click: Set point B and start loop (shows "LOOP ACTIVE", auto-validates B > A)
    - Third click: Disable loop (shows "LOOP OFF")
  - Status shown as "A-" or "A-B" in VFD
  - Automatic jump to point A when reaching point B

#### Audio Processing

- **LOUDNESS**: 
  - Toggle Fletcher-Munson loudness compensation
  - Automatically boosts bass (+8dB max) and treble (+4dB max) at low volumes
  - Effect decreases as volume increases
  - "(LOUDNESS ON)" indicator appears in VFD tech corner
  - Works in conjunction with manual EQ settings
- **MONO**: 
  - Toggle mono mode
  - Combines stereo channels to mono
  - Green LED indicator activates
  - Automatically centers balance when enabled
  - Restores previous balance when disabled

#### Equalizer Controls

- **BASS +**: Increase low frequencies (+2dB steps, max +12dB at 200Hz)
- **BASS -**: Decrease low frequencies (-2dB steps, min -12dB at 200Hz)
- **TREBLE +**: Increase high frequencies (+2dB steps, max +12dB at 3000Hz)
- **TREBLE -**: Decrease high frequencies (-2dB steps, min -12dB at 3000Hz)
- **TONE RESET**: Red button - Reset EQ to flat (0dB) and balance to center (0)
  - Single click restores all tone controls to default

#### Balance Controls

- **BALANCE L**: Shift audio to left channel (-0.1 steps)
- **BALANCE R**: Shift audio to right channel (+0.1 steps)
- **Keyboard Alternative**: Use Left/Right arrow keys
- **Note**: Balance is disabled when MONO mode is active

### Interactive Display Elements

The VFD display has several clickable areas:

- **Track Title** (VFD center): 
  - Click to view album artwork in popup
  - Shows embedded album art from ID3 tags
  - Click overlay to close
- **Track Counter** (top left): 
  - Shows "current/total" format (e.g., "3/12")
  - Click to open playlist browser
  - Select track to play instantly
  - Active track highlighted in green
  - Click outside or on track to close
- **Time Display** (top right): 
  - Shows elapsed time by default (MM:SS)
  - Click to toggle to remaining time (-MM:SS)
  - Shows "ELAPSED TIME" or "REMAINING TIME" briefly when toggled
- **Volume Display** (bottom center): 
  - Auto-shows during volume changes
  - Displays "VOL: XX%" or "MUTE"
  - Auto-hides after 2 seconds
- **Status Icons** (bottom right): 
  - Shows PLAY ▶, PAUSE ⏸ (blinking), or STOP ⏹
  - Auto-updates based on playback state
- **Mode Indicators** (bottom left): 
  - Shows RANDOM, REPEAT(1), REPEAT(ALL), A-B status
  - Updates in real-time as modes change
- **Technical Data** (top sections):
  - Track counter (green, tabular numbers)
  - File format (FLAC/MP3/WAV/MP4)
  - Bitrate estimation
  - Loudness indicator (when active)

### Keyboard Shortcuts

- **Left Arrow**: Balance audio to left channel
- **Right Arrow**: Balance audio to right channel
- **Media Keys**: If browser supports MediaSession API:
  - Play/Pause
  - Stop
  - Previous Track
  - Next Track

### Visual Indicators

#### LEDs
- **Power LED** (red, above STANDBY/ON button): System power state
- **MONO LED** (green, center under logo): Mono mode active
- **POWER GUARD LEDs** (red, left and right under logo): Volume ≥ 90% (rapid blink)

#### VU Meters
- **Dual Stereo Meters**: Show real-time audio levels for left and right channels
- **Smooth Animation**: Needles move with realistic physics and smoothing
- **Custom Background**: Authentic McIntosh meter dial design
- **Auto-Return**: Needles return to rest position when stopped

## 🔧 Technical Details

### Technology Stack

#### Core Technologies

- Pure JavaScript (ES6+)
- HTML5 Audio API
- Web Audio API (AudioContext, BiquadFilter, StereoPanner, ChannelSplitter, AnalyserNode)
- CSS3 with animations and transforms
- Service Workers for PWA functionality

#### External Libraries

- **Font Awesome 7**: Icon library for control symbols (play, pause, stop, etc.)
- **jsmediatags 3.9.5**: ID3 tag and metadata extraction
- **Google Fonts**:
  - Bitcount Single (VFD display - monospace bitmap style)
  - Roboto (labels and UI elements)

### Browser Compatibility

|Browser|Version|Support|Notes|
|-------|-------|-------|-----|
|Chrome |90+    |✅ Full |Recommended browser|
|Edge   |90+    |✅ Full |Chromium-based|
|Firefox|88+    |✅ Full |Full Web Audio API support|
|Safari |14+    |✅ Full*|*Requires user interaction before autoplay|
|Opera  |76+    |✅ Full |Chromium-based|

*Safari requires user interaction before audio playback (browser security policy)
*All browsers require HTTPS for service workers (PWA features)

### Web Audio API Architecture

```
Audio Element Source (MediaElementSourceNode)
       ↓
StereoPanner (Balance: -1.0 to +1.0)
       ↓
Biquad Filter (Bass - Low Shelf 200Hz, ±12dB)
       ↓
Biquad Filter (Treble - High Shelf 3000Hz, ±12dB)
       ↓
Channel Splitter (Stereo → L/R)
       ↓          ↓
  Analyser L  Analyser R  (FFT 1024, for VU meters)
       ↓          ↓
   Merger → Destination (AudioContext output)
```

### Supported File Formats

|Format |Extension |Quality     |Notes                     |ID3 Tags|
|-------|----------|------------|--------------------------|--------|
|FLAC   |.flac     |Lossless    |Best quality, larger files|✅ Yes   |
|WAV    |.wav      |Uncompressed|Studio quality            |❌ No    |
|MP3    |.mp3      |Lossy       |Universal compatibility   |✅ Yes   |
|MP4/M4A|.mp4, .m4a|Lossy (AAC) |Apple ecosystem           |✅ Yes   |

### Performance Characteristics

- **VU Meter Update Rate**: 60 FPS (requestAnimationFrame)
- **Audio Analysis**: 1024-point FFT, real-time stereo analysis
- **Volume Steps**: 
  - Click: 0.01 (1%) per step at 50ms intervals
  - Wheel: 0.05 (5%) per scroll
- **EQ/Balance Steps**:
  - Bass/Treble: 2dB per click
  - Balance: 0.1 per click
- **Seek Speed**: 3 seconds per 100ms when holding prev/next
- **Needle Smoothing**: 25% interpolation (smooth, realistic movement)
- **Loudness Calculation**: Real-time based on current volume (0-70% range)

### Audio Processing Details

#### Equalizer
```javascript
// Bass filter (Low Shelf)
bassFilter.type = "lowshelf";
bassFilter.frequency.value = 200;  // Hz
bassFilter.gain.value = bassGain;  // -12 to +12 dB (2dB steps)

// Treble filter (High Shelf)
trebleFilter.type = "highshelf";
trebleFilter.frequency.value = 3000;  // Hz
trebleFilter.gain.value = trebleGain; // -12 to +12 dB (2dB steps)
```

#### Loudness Compensation
```javascript
// Applied only when isLoudnessActive = true
// Maximum effect at volume 0, linearly decreases to 0 at volume 70%
intensity = max(0, (0.7 - currentVolume) / 0.7);
actualBassGain = bassGain + (intensity * 8);  // Up to +8dB boost
actualTrebleGain = trebleGain + (intensity * 4);  // Up to +4dB boost
```

#### Balance Control
```javascript
// StereoPanner API
balanceNode.pan.value = currentBalance;  // -1.0 (full left) to +1.0 (full right)
// Disabled (forced to 0) when mono mode is active
```

#### VU Meter Response
```javascript
// Power-law response for natural meter movement
targetAngle = -55 + (min(255, level * 1.8) / 255) ^ 0.7 * 95;
// Smoothing: 25% interpolation per frame
currentAngle += (targetAngle - currentAngle) * 0.25;
```

## 🎨 Customization Guide

### Colors

Modify CSS custom properties in `style.css`:

```css
:root {
    --background-color-app: #3f3f3f;  /* Page background */
    --mc-blue: #00c3ff;                /* VFD text, primary accent */
    --mc-green: #00ff41;               /* Labels, time, track counter */
    --mc-vumeter: #00aef2;             /* VU meter background */
    --panel-black: #080808;            /* Main panel background */
    --mc-led-green: #00ff00;           /* Green LED glow */
    --mc-led-red: #ff0000;             /* Red LED glow */
    --mc-gold: #ffd700;                /* Gold accents (PUSH/ADJUST) */
    --police-size-counter: 30px;       /* Track/time counter size */
    --police-size-label-counter: 12px; /* Label text size */
}
```

### VU Meter Sensitivity

Adjust needle response in `script.js`:

```javascript
// Line ~345-346: Modify level multiplier and power curve
targetAngleL = -55 + Math.pow(Math.min(255, lvlL * 1.8) / 255, 0.7) * 95;
// 1.8 = sensitivity multiplier (increase for more sensitive meters)
// 0.7 = power curve exponent (lower = more responsive to quiet sounds)
// 95 = maximum angle range (degrees from rest position)

// Line ~347: Modify smoothing factor
currentAngleL += (targetAngleL - currentAngleL) * 0.25;
// 0.25 = 25% interpolation (higher = faster response, lower = smoother)
```

### EQ Filter Frequencies

Modify filter parameters in `script.js`:

```javascript
// Lines ~167-171: EQ filter setup
bassFilter.frequency.value = 200;  // Hz (lower = deeper bass)
bassFilter.gain.value = bassGain;  // -12 to +12 dB

trebleFilter.frequency.value = 3000;  // Hz (higher = brighter treble)
trebleFilter.gain.value = trebleGain; // -12 to +12 dB
```

### Font Sizes

Adjust display text sizes in `style.css`:

```css
:root {
    --police-size-counter: 30px;       /* Track/time counters */
    --police-size-label-counter: 12px; /* Label text */
}

.vfd-large {
    font-size: 30px;  /* Main track title */
}

.vfd-info {
    font-size: 14px;  /* Artist/album info */
}

.small-label {
    font-size: 10px;  /* Button labels */
}
```

### Volume/EQ Step Sizes

Adjust control increments in `script.js`:

```javascript
// Volume steps
currentVolume += 0.01;  // Click/hold step (line ~376)
currentVolume += 0.05;  // Mouse wheel step (line ~380)

// Bass/Treble steps
bassGain += 2;  // 2dB per click (can be modified)
trebleGain += 2;  // 2dB per click (can be modified)

// Balance steps
currentBalance += 0.1;  // Per click (lines ~178-186)
```

## 🐛 Known Issues & Limitations

### Current Limitations

- Bitrate calculation is estimated for variable bitrate (VBR) files
- Some browsers require user interaction before auto-playing audio (security policy)
- Album artwork display depends on proper ID3v2 tag embedding
- Playlist order is not persistent across page reloads
- WAV files typically don't support ID3 tags (metadata won't display)
- Service worker requires HTTPS (or localhost) to function
- Power Guard LEDs trigger at fixed 90% threshold (not adjustable)

### Browser-Specific Issues

- **Safari**: 
  - May show security warnings for local file access
  - Requires user interaction before audio playback
  - MediaSession API support may be limited
- **Mobile browsers**: 
  - Limited support for file input (use desktop for best experience)
  - Touch events may not work perfectly with hold-to-seek
  - PWA installation varies by platform
- **Firefox**: 
  - May require manual service worker enable in about:config

### Workarounds

- **Autoplay blocked**: Click any button after loading to initialize audio context
- **Missing album art**: Ensure files have embedded artwork in ID3v2 tags (not ID3v1)
- **Bitrate accuracy**: Use constant bitrate (CBR) encoding for accurate display
- **Metadata not showing**: Check file tags with a tool like Mp3tag or MusicBrainz Picard
- **PWA not installing**: Ensure serving via HTTPS (not HTTP)
- **Service worker not caching**: Hard refresh (Ctrl+F5) and check browser console

## 👨‍💻 Development

### Project Structure

```
src/
├── index.html          # Main HTML structure (~280 lines)
├── script.js           # Application logic (~398 lines)
├── style.css          # All styling and animations (~673 lines)
├── manifest.json      # PWA manifest
├── sw.js              # Service worker for offline caching
├── img/               # Image assets
│   ├── mc-logo.png      # Main McIntosh logo
│   ├── logo_b.png       # Options menu logo
│   ├── favicon.png      # App icon (192x192, 512x512)
│   └── vumeter-new.png  # VU meter background dial
└── fontawesome7/      # Icon library
    └── css/
        └── all.min.css
```

### Code Organization

**script.js sections** (in order):

1. DOM selectors (lines 1-38)
2. Variable initialization (lines 40-80)
3. Power on/off logic (lines 139-154)
4. Audio engine setup (lines 156-177)
5. Balance controls (lines 178-194)
6. EQ controls (lines 195-210)
7. File loading & metadata (lines 211-236)
8. Interactive VFD clicks (lines 237-248)
9. Audio time update (lines 250-257)
10. Mono mode toggle (lines 259-272)
11. Seeking (hold prev/next) (lines 274-302)
12. Playlist popup (lines 304-318)
13. Main control buttons (lines 320-337)
14. VU meter animation loop (lines 339-351)
15. Volume control (lines 353-383)
16. Media session integration (lines 385-394)
17. Options menu toggle (lines 396-398)

### Building & Testing

No build process required! Simply:

1. Edit source files
2. Refresh browser (Ctrl+F5 for hard reload to bypass service worker)
3. Test in multiple browsers (Chrome, Firefox, Safari)
4. Validate HTML/CSS/JS with online validators
5. Test PWA features via lighthouse or browser DevTools

### Coding Standards

- ES6+ JavaScript syntax (const/let, arrow functions, template literals)
- Meaningful variable names (camelCase)
- Comments for complex logic (especially audio processing)
- Consistent indentation (4 spaces)
- CSS organized by component (structure → visual → interactive)
- Single-letter variables only for iterators (i, j) or well-known abbreviations (L/R for left/right)

### Testing Checklist

- [ ] Power on/off functionality
- [ ] File loading (single and multiple)
- [ ] Play/pause/stop controls
- [ ] Previous/next track navigation
- [ ] Hold-to-seek functionality
- [ ] Volume control (click, hold, wheel)
- [ ] Mute function
- [ ] EQ adjustments (bass, treble, reset)
- [ ] Balance control (buttons and keyboard)
- [ ] Random/repeat modes
- [ ] A-B loop functionality
- [ ] Loudness compensation
- [ ] Mono mode toggle
- [ ] Display toggle (stealth mode)
- [ ] VU meter animation
- [ ] VFD display updates
- [ ] Album art viewer
- [ ] Playlist browser
- [ ] Time display toggle
- [ ] Power Guard LEDs
- [ ] Options menu open/close
- [ ] Click-outside-to-close behavior
- [ ] Service worker caching
- [ ] PWA installation
- [ ] MediaSession integration
- [ ] Keyboard shortcuts
- [ ] Mobile responsiveness (if applicable)

## 🤝 Contributing

Contributions are welcome! Here's how to help:

### How to Contribute

1. **Fork** the repository
1. **Create** a feature branch:
   
   ```bash
   git checkout -b feature/amazing-feature
   ```
1. **Make** your changes
1. **Test** thoroughly across browsers
   - Chrome, Firefox, Safari minimum
   - Test on mobile if changing UI
1. **Commit** with clear messages:
   
   ```bash
   git commit -m "Add amazing feature: detailed description"
   ```
1. **Push** to your fork:
   
   ```bash
   git push origin feature/amazing-feature
   ```
1. **Submit** a pull request with:
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

### Special Thanks

- The open-source community for tools and inspiration
- Audio enthusiasts and HiFi collectors for feedback
- McIntosh Laboratory for decades of design excellence
- All contributors, testers, and users
- The Web Audio API community and documentation authors

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

### FAQ

**Q: Why won't my audio files play?**
A: Check that they're in a supported format (FLAC/MP3/WAV/MP4). Some browsers require user interaction before playing audio.

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

-----
<img width="1802" height="801" alt="2" src="https://github.com/user-attachments/assets/ce179959-13f4-4ace-882e-d8877527082c" />
<img width="1814" height="806" alt="3" src="https://github.com/user-attachments/assets/5980d1d2-ab1a-4d6b-83ce-74fc6e878475" />
<img width="1806" height="802" alt="4" src="https://github.com/user-attachments/assets/9b8b0531-eaee-4158-8b36-50bd2d0ad99a" />
<img width="1804" height="804" alt="5" src="https://github.com/user-attachments/assets/ecbd3bba-0e1e-484c-8dcb-e3ff7f5d7811" />
<img width="1792" height="799" alt="6" src="https://github.com/user-attachments/assets/dfebed7a-c5db-4a4d-be2f-b3a5b08cf3fe" />
<img width="1804" height="805" alt="9" src="https://github.com/user-attachments/assets/f07515b8-d461-4921-892b-9902fa4131c9" />

**Enjoy your premium web audio experience! 🎵🎛️**

*Made with ❤️ for audio enthusiasts everywhere*
