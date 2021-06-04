import * as electron from 'electron';
import * as path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

const defaultConfig = {
  rulerColor: '#0095ff',
  rulerOpacity: 0.14,
  rulerHeight: 34,
  invertedRuler: false,
};

let mainWindow = null;
let overlayWindow = null;

let rulerEnabled = true;
let config = {...defaultConfig};

const validateConfig = (config) => {
  const maxRulerOpacity = 0.9;
  config.rulerOpacity =
      Math.max(0, Math.min(maxRulerOpacity, config.rulerOpacity));
};

const createMainWindow = () => {
  mainWindow = new electron.BrowserWindow({
    title: 'Reading Ruler',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setSize(400, 300);

  if (isDevelopment) {
    mainWindow.webContents.openDevTools({
      mode: 'undocked',
    });
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('setConfig', {
      config: config,
    });
    mainWindow.webContents.send('setPage', {
      page: '/menu',
    });
  });

  if (isDevelopment) {
    mainWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  electron.ipcMain.on('configChanged', (event, data) => {
    config = data.config;
    validateConfig(config);
    if (overlayWindow) {
      overlayWindow.webContents.send('setConfig', {
        config: config,
      });
    }
  });
  electron.ipcMain.on('rulerEnabledChanged', (event, data) => {
    rulerEnabled = data.rulerEnabled;
    if (overlayWindow) {
      overlayWindow.webContents.send('setRulerEnabled', {
        rulerEnabled: rulerEnabled,
      });
    }
  });
  electron.ipcMain.on('configReset', (event) => {
    config = {...defaultConfig};
    if (mainWindow) {
      mainWindow.webContents.send('setConfig', {
        config: config,
      });
    }
    if (overlayWindow) {
      overlayWindow.webContents.send('setConfig', {
        config: config,
      });
    }
  });

  mainWindow.on('close', () => {
    if (mainWindow.isDevToolsOpened()) {
      mainWindow.closeDevTools();
    }
    if (overlayWindow.isDevToolsOpened()) {
      overlayWindow.closeDevTools();
    }
    electron.app.exit();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createOverlayWindow = () => {
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

  if (isDevelopment) {
    overlayWindow.webContents.openDevTools({
      mode: 'undocked',
    });
  }

  overlayWindow.webContents.on('did-finish-load', () => {
    overlayWindow.webContents.send('setConfig', {
      config: config,
    });
    overlayWindow.webContents.send('setPage', {
      page: '/overlay',
    });
  });

  if (isDevelopment) {
    overlayWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    overlayWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  const updateLoopId = setInterval(() => {
    const mousePosition = electron.screen.getCursorScreenPoint();
    overlayWindow.webContents.send('mouseMove', {
      mousePosition: {
        x: mousePosition.x,
        y: mousePosition.y,
      },
    });
  }, 1000 / 30);

  overlayWindow.on('closed', () => {
    clearInterval(updateLoopId);
    overlayWindow = null;
  });
};

electron.app.on('ready', () => {
  createMainWindow();
  createOverlayWindow();

  electron.globalShortcut.register('Ctrl+Alt+-', () => {
    rulerEnabled = !rulerEnabled;
    if (mainWindow) {
      mainWindow.webContents.send('setRulerEnabled', {
        rulerEnabled: rulerEnabled,
      });
    }
    if (overlayWindow) {
      overlayWindow.webContents.send('setRulerEnabled', {
        rulerEnabled: rulerEnabled,
      });
    }
  });
});

electron.app.on('activate', () => {
  // On macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    createMainWindow();
  }
  if (overlayWindow === null) {
    createOverlayWindow();
  }
});
