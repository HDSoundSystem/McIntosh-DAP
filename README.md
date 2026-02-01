# McIntosh MSA5500 - Audio Player

A high-fidelity web-based audio player inspired by the iconic McIntosh amplifier design, featuring vintage VU meters, equalizer controls, and a sleek interface reminiscent of premium audio equipment.

![McIntosh MSA5500](https://img.shields.io/badge/McIntosh-MSA5500-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)

![McIntosh_Logo](https://github.com/user-attachments/assets/9f65f1d2-5f77-458b-b0fc-5ec35e992042)

<img width="1818" height="802" alt="1" src="https://github.com/user-attachments/assets/2a6ba9bb-eacb-4a78-a232-f426d74042f9" />

## Features

### Audio Playback

- **Multi-format support**: FLAC, MP3, MP4, WAV
- **Playlist management**: Load and manage multiple audio files
- **Playback controls**: Play, pause, stop, previous, next
- **Fast seeking**: Hold previous/next buttons for rapid navigation
- **Repeat modes**: Single track, all tracks, or off
- **Random playback**: Shuffle through your playlist

### Visual Interface

- **Animated VU meters**: Real-time audio level visualization with smooth needle animation
- **VFD display**: Vintage-style vacuum fluorescent display showing:
  - Track title, artist, and album information
  - Current track number and total tracks
  - File format (FLAC, MP3, etc.)
  - Bitrate information
  - Playback time (elapsed/remaining toggle)
  - Playback status icons
  - Mode indicators (Random, Repeat)
- **Display mode**: Toggle between full display and stealth mode (blackout)
- **Album art viewer**: Click on track title to view embedded album artwork

### Audio Controls

- **Volume control**: Interactive rotary knob with mouse wheel support
- **Mute function**: Quick audio muting
- **Equalizer**: 2-band EQ with bass and treble controls (±12dB range)
- **Tone reset**: Instant flat EQ restoration

### Advanced Features

- **Web Audio API integration**: High-quality audio processing
- **Frequency analysis**: Real-time spectrum analysis for VU meter animation
- **Metadata extraction**: Automatic reading of ID3 tags using jsmediatags
- **Responsive controls**: Tactile button feedback and smooth animations
- **Playlist popup**: Click track counter to view and navigate full playlist

## Installation

1. **Clone or download** this repository
1. **Ensure you have the following file structure**:
   
   ```
   project/
   ├── index.html
   ├── script.js
   ├── style.css
   ├── img/
   │   ├── mc-logo.png
   │   └── vu-meter-2.png
   └── README.md
   ```
1. **Add required images** to the `img/` folder:
- `mc-logo.png`: McIntosh logo for the center panel
- `vu-meter-2.png`: VU meter dial background
1. **Open `index.html`** in a modern web browser

## Usage

### Getting Started

1. **Power on**: Click the red STANDBY/ON button
1. **Load audio files**: Click the INPUT knob to select audio files from your computer
1. **Control playback**: Use the center control buttons

### Control Reference

#### Main Controls

- **INPUT knob**: Click to load audio files
- **VOLUME knob**:
  - Click and hold left/right side to adjust
  - Use mouse wheel to change volume
  - Hover to display current level
- **Play/Pause**: Toggle playback
- **Stop**: Stop playback and reset position
- **Previous/Next**:
  - Click to skip tracks
  - Hold for fast seeking within current track
- **Mute**: Toggle audio muting
- **Display**: Toggle VFD and VU meter visibility (stealth mode)

#### OPTIONS Menu

Access by clicking the OPTIONS button:

- **Random**: Toggle shuffle mode
- **Repeat**: Cycle through off → repeat one → repeat all
- **Bass +/-**: Adjust low frequencies (±12dB)
- **Treble +/-**: Adjust high frequencies (±12dB)
- **Tone Reset**: Reset EQ to flat (0dB)

#### Interactive Display Elements

- **Track title**: Click to view album artwork (if embedded)
- **Track counter**: Click to open playlist view
- **Time display**: Click to toggle between elapsed and remaining time

### Keyboard Shortcuts

Currently, all controls are mouse-operated. Keyboard support may be added in future versions.

## Technical Details

### Dependencies

- **Font Awesome 6.5.1**: Icon library
- **jsmediatags 3.9.5**: Audio metadata extraction
- **Google Fonts**: Bitcount Single and Roboto typefaces

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (requires user interaction for autoplay)
- Opera: Full support

### Web Audio API Features

- **AnalyserNode**: Real-time frequency analysis for VU meters
- **BiquadFilterNode**: High-quality bass and treble shelving filters
- **AudioContext**: Professional audio graph processing

### File Support

- **FLAC**: Lossless audio codec
- **MP3**: Standard lossy compression
- **MP4/M4A**: AAC audio container
- **WAV**: Uncompressed audio

## Customization

### Color Scheme

Edit CSS variables in `style.css`:

```css
:root {
    --mc-blue: #00c3ff;        /* VFD text color */
    --mc-green: #00ff41;       /* Label color */
    --mc-vumeter: #00aef2;     /* VU meter background */
    --mc-led-green: #00ff00;   /* Counter displays */
}
```

### VU Meter Sensitivity

Adjust in `script.js` (line ~470):

```javascript
let normalized = Math.pow(Math.min(255, level * 1.8) / 255, 0.7);
```

### EQ Range

Modify bass/treble gain limits in `script.js`:

```javascript
bassGain = Math.min(12, bassGain + 2);  // Change 12 to desired max dB
```

## Known Issues

- Bitrate calculation is estimated for variable bitrate files
- Some browsers may require user interaction before audio playback
- Album artwork display depends on proper ID3 tag embedding

## Future Enhancements

- [ ] Keyboard shortcuts
- [ ] Customizable VU meter colors
- [ ] Spectrum analyzer visualization
- [ ] Save/load EQ presets
- [ ] Drag-and-drop file loading
- [ ] Dark/light theme toggle
- [ ] Export playlist as M3U
- [ ] Gapless playback
- [ ] Crossfade between tracks

## Credits

### Design Inspiration

Inspired by the legendary McIntosh Laboratory audio equipment, known for their distinctive blue meters and premium build quality.

### Libraries Used

- [Font Awesome](https://fontawesome.com/) - Icons
- [jsmediatags](https://github.com/aadsm/jsmediatags) - Metadata reading
- [Google Fonts](https://fonts.google.com/) - Typography

## License

This project is released under the MIT License. See LICENSE file for details.

**Note**: This is a fan-made tribute project and is not affiliated with, endorsed by, or connected to McIntosh Laboratory, Inc.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Setup

1. Fork the repository
1. Create a feature branch
1. Make your changes
1. Test thoroughly in multiple browsers
1. Submit a pull request

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the code documentation

-----

**Enjoy your premium web audio experience! 🎵**
