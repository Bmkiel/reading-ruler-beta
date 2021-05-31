import * as electron from 'electron';
import * as path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow = null;
let overlayWindow = null;

const createWindows = () => {
  overlayWindow = new electron.BrowserWindow({
    frame: false,
    transparent: true,
    resizable: false,
    fullscreen: true,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.setAlwaysOnTop(true, 'screen');

  overlayWindow.webContents.openDevTools({
    mode: 'undocked',
  });

  if (isDevelopment) {
    overlayWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    overlayWindow.loadURL(`file://${__dirname}/index.html}`);
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
};

electron.app.on('ready', () => {
  createWindows();

  const updateLoop = () => {
    const mousePosition = electron.screen.getCursorScreenPoint();
    overlayWindow.webContents.send('mouseMove', {
      x: mousePosition.x,
      y: mousePosition.y,
    });
    setTimeout(updateLoop, 1000 / 60);
  };
  updateLoop();

  electron.globalShortcut.register('Ctrl+Alt+-', () => {
    overlayWindow.webContents.send('toggleRuler');
  });
});

electron.app.on('activate', () => {
  // On macOS it is common to re-create a window even after all windows have been closed
  if (overlayWindow === null) {
    createWindows();
  }
});
