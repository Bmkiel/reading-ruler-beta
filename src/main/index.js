import * as electron from 'electron';
import * as path from 'path';
import * as Store from 'electron-store';

const isDevelopment = process.env.NODE_ENV !== 'production';

const defaultConfig = {
  rulerColor: '#0095ff',
  rulerOpacity: 0.14,
  rulerHeight: 34,
  invertedRuler: false,
};

let store = null;
let mainWindow = null;
let mainWindowLoaded = false;
let overlayWindow = null;
let overlayWindowLoaded = false;

const state = {
  config: null,
  rulerEnabled: false,
  mousePosition: {x: 0, y: 0},
};

electron.app.on('ready', () => {
  store = new Store();

  createMainWindow();
  createOverlayWindow();

  state.config = store.get('config');
  if (!state.config) {
    state.config = {...defaultConfig};
  }

  electron.globalShortcut.register('CommandOrControl+Alt+-', () => {
    toggleRulerEnabled();
  });

  const mouseUpdateInterval = 1000 / 30;
  setInterval(() => {
    const mousePosition = electron.screen.getCursorScreenPoint();
    setMousePosition({
      x: mousePosition.x,
      y: mousePosition.y,
    });
  }, mouseUpdateInterval);
});

electron.app.on('activate', () => {
  // For macOS.
  if (!mainWindow) {
    createMainWindow();
    handleWindowsLoaded();
  }
});

electron.ipcMain.on('rulerEnabledChanged', (event, data) => {
  setRulerEnabled(data.rulerEnabled);
});

electron.ipcMain.on('configChanged', (event, data) => {
  setConfig(data.config);
});

electron.ipcMain.on('configReset', (event) => {
  setConfig({...defaultConfig});
});

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

  if (isDevelopment) {
    mainWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindowLoaded = true;
    handleWindowLoaded();
  });

  mainWindow.on('close', () => {
    quit();
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

  if (isDevelopment) {
    overlayWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    overlayWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  overlayWindow.webContents.on('did-finish-load', () => {
    overlayWindowLoaded = true;
    handleWindowLoaded();
  });

  overlayWindow.on('close', () => {
    quit();
  });

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
};

const handleWindowLoaded = () => {
  if (mainWindowLoaded && overlayWindowLoaded) {
    handleAllWindowsLoaded();
  }
};

// Sends initial state to the windows when they have finished loading.
const handleAllWindowsLoaded = () => {
  if (mainWindow) {
    mainWindow.webContents.send('setPage', {
      page: '/menu',
    });
  }
  if (overlayWindow) {
    overlayWindow.webContents.send('setPage', {
      page: '/overlay',
    });
  }

  setConfig(state.config);
  setRulerEnabled(true);
};

const quit = () => {
  if (mainWindow.isDevToolsOpened()) {
    mainWindow.closeDevTools();
  }
  if (overlayWindow.isDevToolsOpened()) {
    overlayWindow.closeDevTools();
  }
  electron.app.exit();
};

const sendToAllWindows = (name, value) => {
  if (mainWindow) {
    mainWindow.webContents.send(name, value);
  }
  if (overlayWindow) {
    overlayWindow.webContents.send(name, value);
  }
};

const setConfig = (config) => {
  state.config = config;
  validateConfig(state.config);
  sendToAllWindows('setConfig', {
    config: state.config,
  });
  store.set('config', state.config);
};

const validateConfig = (config) => {
  const maxRulerOpacity = 0.9;
  config.rulerOpacity =
      Math.max(0, Math.min(maxRulerOpacity, config.rulerOpacity));
};

const setRulerEnabled = (rulerEnabled) => {
  state.rulerEnabled = rulerEnabled;
  sendToAllWindows('setRulerEnabled', {
    rulerEnabled: state.rulerEnabled,
  });
};

const toggleRulerEnabled = () => {
  setRulerEnabled(!state.rulerEnabled);
};

const setMousePosition = (mousePosition) => {
  state.mousePosition = mousePosition;
  sendToAllWindows('setMousePosition', {
    mousePosition: {
      x: mousePosition.x,
      y: mousePosition.y,
    },
  });
};
