const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // You may adjust this based on your security needs
      enableRemoteModule: true,
    },
  });

  // Load the Angular app
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/heic-conversion/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();

  // Close the window when the app is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron will call this function when the app is initialized
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
