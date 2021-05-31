import * as electron from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow = null;
let overlayWindow = null;

const createMainWindow = () => {
  mainWindow = new electron.BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.setSize(400, 300);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('setPage', {
      page: '/menu',
    });
  });

  if (isDevelopment) {
    mainWindow.webContents.openDevTools({
      mode: 'undocked',
    });
  }

  if (isDevelopment) {
    mainWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html}`);
  }

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
      nodeIntegration: true,
    },
  });
  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.setAlwaysOnTop(true, 'screen');

  overlayWindow.webContents.on('did-finish-load', () => {
    overlayWindow.webContents.send('setPage', {
      page: '/overlay',
    });
  });

  if (isDevelopment) {
    overlayWindow.webContents.openDevTools({
      mode: 'undocked',
    });
  }

  if (isDevelopment) {
    overlayWindow.loadURL(
        `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    overlayWindow.loadURL(`file://${__dirname}/index.html}`);
  }

  const updateLoopId = setInterval(() => {
    const mousePosition = electron.screen.getCursorScreenPoint();
    overlayWindow.webContents.send('mouseMove', {
      mousePosition: {
        x: mousePosition.x,
        y: mousePosition.y,
      },
    });
  }, 1000 / 60);

  overlayWindow.on('closed', () => {
    clearInterval(updateLoopId);
    overlayWindow = null;
  });
};

electron.app.on('ready', () => {
  createMainWindow();
  createOverlayWindow();

  electron.globalShortcut.register('Ctrl+Alt+-', () => {
    if (overlayWindow) {
      overlayWindow.webContents.send('toggleRuler');
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
