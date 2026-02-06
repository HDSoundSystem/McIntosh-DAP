const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // On charge votre fichier HTML
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées (sauf sur Mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});