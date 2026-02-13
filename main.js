const { app, BrowserWindow, globalShortcut, nativeImage, ipcMain } = require('electron');
const path = require('path');

let win;

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

  // --- Boutons de la barre des tâches (Windows) ---
  win.once('ready-to-show', () => {
    setThumbar(false); // Initialise en mode "Play"
  });

  // Écouter les mises à jour de statut depuis le renderer
  ipcMain.on('update-thumbar', (event, isPlaying) => {
    setThumbar(isPlaying);
  });

  // --- Contrôles multimédias du clavier ---
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

// Fonction pour mettre à jour les boutons Thumbar (Windows)
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