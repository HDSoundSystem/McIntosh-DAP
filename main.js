const { app, BrowserWindow, globalShortcut, nativeImage, ipcMain } = require('electron');
const path = require('path');

let win;
let pendingFiles = []; // Files received before the window was ready

function sendFilesToRenderer(filePaths) {
    if (win && win.webContents) {
        win.webContents.send('open-files', filePaths);
    } else {
        pendingFiles = filePaths;
    }
}

// "Open with" — files passed as arguments at startup
const openWithFiles = process.argv.slice(2).filter(f => !f.startsWith('--'));
if (openWithFiles.length) pendingFiles = openWithFiles;

// Fichiers glissés sur l'icône de l'app (macOS / Windows)
app.on('open-file', (event, filePath) => {
    event.preventDefault();
    sendFilesToRenderer([filePath]);
});

// Second instance (Windows: "Open with" from Explorer)
app.on('second-instance', (event, argv) => {
    const files = argv.slice(2).filter(f => !f.startsWith('--'));
    if (files.length) sendFilesToRenderer(files);
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
      if (pendingFiles.length) {
          sendFilesToRenderer(pendingFiles);
          pendingFiles = [];
      }
  });

  // --- Taskbar buttons (Windows) ---
  win.once('ready-to-show', () => {
    setThumbar(false);
  });

  ipcMain.on('update-thumbar', (event, isPlaying) => {
    setThumbar(isPlaying);
  });

  // --- Keyboard multimedia controls ---
  globalShortcut.register('MediaPlayPause', () => {
    win.webContents.send('media-control', 'play-pause');
  });

  globalShortcut.register('MediaNextTrack', () => {
    win.webContents.send('media-control', 'next');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    win.webContents.send('media-control', 'prev');
  });
}

function setThumbar(isPlaying) {
  if (!win) return;
  win.setThumbarButtons([
    {
      tooltip: 'Précédent',
      icon: path.join(__dirname, 'assets/windows/prev.png'),
      click() { win.webContents.send('media-control', 'prev'); }
    },
    {
      tooltip: isPlaying ? 'Pause' : 'Play',
      icon: isPlaying ? path.join(__dirname, 'assets/windows/pause.png') : path.join(__dirname, 'assets/windows/play.png'),
      click() { win.webContents.send('media-control', 'play-pause'); }
    },
    {
      tooltip: 'Suivant',
      icon: path.join(__dirname, 'assets/windows/next.png'),
      click() { win.webContents.send('media-control', 'next'); }
    }
  ]);
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});