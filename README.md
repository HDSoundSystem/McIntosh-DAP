# McIntosh MSA5500
## Inspired by the high-end McIntosh MSA5500 2-Channel Streaming Integrated Amplifier

A premium web-based audio player inspired by the legendary McIntosh amplifier design, featuring authentic VU meters, professional equalizer controls, stereo balance, A-B loop functionality, mono mode, loudness compensation, power guard protection, and a stunning interface that captures the essence of high-end audio equipment.

![McIntosh MSA5500](https://img.shields.io/badge/McIntosh-MSA5500-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)

![McIntosh_Logo](https://github.com/user-attachments/assets/9f65f1d2-5f77-458b-b0fc-5ec35e992042)

<img width="1821" height="824" alt="1" src="https://github.com/user-attachments/assets/6720d65d-98d0-45ab-891c-92034c604524" />

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
- **Reboot confirmation modal**: Safety popup to confirm system restart

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
  - Confirmation modal prevents accidental reboot
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
- **Electron Desktop Integration**:
  - Native application window with auto-hide menu bar
  - Windows taskbar thumbnail buttons with custom icons
  - Global keyboard shortcut support for media keys
  - Proper window lifecycle management
  - Cross-platform support (Windows, macOS, Linux)

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
4. **Adjust**: Use VOLUME knob and tone controls in OPTIONS menu

### Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│  VU METER (L)    │   McIntosh Logo   │   VU METER (R)  │
│                  │   [POWER GUARD]   │                  │
│                  │      [MONO]       │                  │
├─────────────────────────────────────────────────────────┤
│                  VFD DISPLAY AREA                       │
│  Track 1/10      Title - Artist - Album      --:--     │
│  FLAC 1411 KBPS                                         │
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

#### OPTIONS Menu Controls

| Control | Function | Range/Steps |
|---------|----------|-------------|
| **BASS ↑/↓** | Adjust bass EQ | ±12dB in 2dB steps |
| **TREBLE ↑/↓** | Adjust treble EQ | ±12dB in 2dB steps |
| **BALANCE L/R** | Stereo balance | -100% to +100% in 10% steps |
| **TONE RESET** | Reset EQ and balance | Flat 0dB, center balance |
| **MONO** | Mono/stereo mode | Green LED when active |
| **LOUDNESS** | Fletcher-Munson curve | Automatic at low volumes |
| **STEALTH** | Display blackout | Dims all lights |
| **REPEAT** | Repeat modes | Off → (1) → (ALL) |
| **RANDOM** | Shuffle playback | Avoids immediate repeats |
| **A-B LOOP** | Set loop points | A → A-B → Off |

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
- **Hover EQ controls**: Shows current EQ values

### Tips & Tricks

1. **Accurate EQ**: Hover over BASS/TREBLE controls to see exact dB values
2. **Quick Reset**: Use TONE RESET to return to neutral audio
3. **Loudness**: Automatically enhances bass/treble at low volumes
4. **Power Guard**: Red LEDs warn when volume ≥90%
5. **Seek Mode**: Hold ◄◄ or ►► for 500ms to jump through track
6. **A-B Practice**: Perfect for musicians - loop difficult sections
7. **Mono Mode**: Useful for checking mixes and voice-over work
8. **Stealth Mode**: Minimalist listening with display off

## 🛠️ Technical Details

### Architecture

```
McIntosh MSA5500
│
├── Frontend (HTML/CSS/JS)
│   ├── index.html          - Main structure
│   ├── style.css           - Visual styling
│   ├── script.js           - Core logic and UI control
│   └── main.js             - Electron main process (desktop only)
│
├── Audio Engine
│   └── Web Audio API Graph:
│       MediaElement → StereoPanner → BiquadFilter(Bass) 
│       → BiquadFilter(Treble) → ChannelSplitter 
│       → AnalyserNode(L/R) → Destination
│
├── Service Worker (PWA)
│   └── sw.js               - Offline caching
│
└── Assets
    ├── img/                - Logos, VU meter backgrounds
    ├── fontawesome7/       - Icon library
    └── windows/            - Electron taskbar icons (desktop)
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
│ BiquadFilter  │ (Bass - Low Shelf)
└──────┬────────┘
       │
┌──────▼────────┐
│ BiquadFilter  │ (Treble - High Shelf)
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

\* Safari requires QuickTime for FLAC

### File Format Support

| Format | Container | Codec | Bitrate | Notes |
|--------|-----------|-------|---------|-------|
| **FLAC** | FLAC | FLAC | Lossless | Preferred for audiophile |
| **WAV** | WAV | PCM | Lossless | Universal support |
| **MP3** | MP3 | MPEG-1/2 Layer 3 | 32-320 kbps | Most compatible |
| **MP4/M4A** | MP4 | AAC | 64-320 kbps | Good quality/size ratio |

### Performance Specifications

- **Audio Processing Latency**: <10ms (typical)
- **VU Meter Refresh Rate**: 60fps (requestAnimationFrame)
- **Frequency Analysis**: 1024-point FFT
- **Volume Steps**: 0.01 (1% increments)
- **EQ Resolution**: 2dB steps
- **Balance Resolution**: 0.1 (10% steps)
- **Service Worker Cache**: ~5MB (static assets only)

### Security & Privacy

- **No tracking**: Zero analytics or telemetry
- **Local processing**: All audio processing happens in-browser
- **No uploads**: Files never leave your device
- **No server**: Pure client-side application
- **No cookies**: No data storage beyond PWA cache

## 🔧 Development

### Project Structure

```
mcintosh-msa5500/
│
├── index.html              # Main HTML structure
├── style.css               # All styling and animations
├── script.js               # Core application logic
├── main.js                 # Electron main process
├── package.json            # Node.js dependencies & build config
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker for offline functionality
├── README.md               # This file
├── LICENSE                 # MIT License
│
└── assets/
    ├── img/
    │   ├── mc-logo.png     # McIntosh logo (on state)
    │   ├── mc-logo-off.png # McIntosh logo (off state)
    │   ├── logo_b.png      # Brand logo variant
    │   ├── favicon.png     # App icon
    │   ├── favicon.ico     # Windows icon
    │   └── vumeter-new.png # VU meter background image
    │
    ├── fontawesome7/       # Font Awesome 7 icon library
    │   ├── css/
    │   └── webfonts/
    │
    └── windows/            # Electron desktop icons
        ├── prev.png        # Previous button icon
        ├── play.png        # Play button icon
        ├── pause.png       # Pause button icon
        └── next.png        # Next button icon
```

### Technology Stack

**Frontend:**
- HTML5 (Audio API, File API)
- CSS3 (Animations, Transforms, Gradients)
- Vanilla JavaScript (ES6+)
- Web Audio API
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
<input type="file" id="audio-upload" accept=".flac,.mp3,.mp4,.wav,.ogg">
```

2. Add format detection in `script.js`:
```javascript
fileFormat.textContent = file.name.split('.').pop().toUpperCase();
```

#### Customizing VU Meters

Modify the meter response in the audio engine:

```javascript
// Adjust smoothing (0-1, lower = more responsive)
const SMOOTHING = 0.25;

// Adjust power curve (higher = more dramatic movement)
const POWER = 1.5;
```

#### Adding New Themes

Create alternate color schemes in `style.css`:

```css
:root {
  --mc-led-blue: #00c3ff;    /* Primary accent */
  --mc-led-green: #00ff41;   /* Secondary accent */
  --mc-gold: #ffd700;        /* Highlights */
}
```

## 📋 Requirements

### Web Version

- **Browser**: Chrome 57+, Firefox 53+, Safari 14.1+, Edge 79+
- **JavaScript**: Must be enabled
- **Storage**: ~5MB for PWA cache (optional)
- **Network**: Required for initial load (offline after PWA install)

### Desktop Version

- **Operating System**:
  - Windows 10/11 (64-bit)
  - macOS 10.13+ (High Sierra or later)
  - Linux (Ubuntu 18.04+, Debian 10+, Fedora 32+)
- **RAM**: 512MB minimum, 1GB recommended
- **Disk Space**: 100MB for application
- **Display**: 1280x800 minimum resolution

### Audio Files

- **Supported formats**: FLAC, MP3, MP4/M4A, WAV
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
1. **Make** your changes
2. **Test** thoroughly across browsers
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

**Q: How do I build the desktop app?**
A: Install Node.js, run `npm install`, then `npm run dist`. See the Desktop Version section for details.

**Q: Do the taskbar buttons work on macOS/Linux?**
A: Taskbar thumbnail buttons are Windows-only. However, global media key shortcuts work on all platforms.

-----
<img width="1827" height="822" alt="2" src="https://github.com/user-attachments/assets/1451b7e9-3075-4fec-a4e4-048125788bfd" />
<img width="1842" height="862" alt="3" src="https://github.com/user-attachments/assets/7d10e7c2-d6cf-46a1-89bf-13fa474eb961" />
<img width="1829" height="823" alt="4" src="https://github.com/user-attachments/assets/bee9ec8c-6485-4f8c-b523-044c14632fb3" />
<img width="1825" height="860" alt="5" src="https://github.com/user-attachments/assets/ee865f48-5028-4b6a-859d-5b9db2bba930" />
<img width="1828" height="839" alt="6" src="https://github.com/user-attachments/assets/578bcfd3-4595-4ea7-8023-11bd68721737" />
<img width="1809" height="866" alt="7" src="https://github.com/user-attachments/assets/71bfeadd-fcf1-457e-b4b8-5c6ec14b47f7" />
<img width="1799" height="806" alt="8" src="https://github.com/user-attachments/assets/71fa6119-9539-4417-b3a0-3f762483b370" />

**Enjoy your premium web audio experience! 🎵🎛️**

*Made with ❤️ for audio enthusiasts everywhere*
