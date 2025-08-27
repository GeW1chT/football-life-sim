// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const GameState = require('./backend/gameState');

let mainWindow;
let gameState;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (gameState.player) {
    mainWindow.loadFile(path.join(__dirname, 'frontend/index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, 'frontend/creation.html'));
  }
}

app.whenReady().then(() => {
  gameState = new GameState();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handler'ları ---
ipcMain.handle('get-player-info', async (event) => {
    return gameState.player;
});

ipcMain.handle('next-week', async (event) => {
    gameState.nextWeek();
    return {
        player: gameState.player,
        hasMediaEvent: gameState.hasMediaEvent
    };
});

ipcMain.handle('create-player', async (event, playerData) => {
    gameState.createPlayer(playerData);
    return gameState.player;
});

ipcMain.handle('get-latest-match-result', async (event) => {
    if (gameState.matchResults.length > 0) {
        return gameState.matchResults[gameState.matchResults.length - 1];
    }
    return null;
});

ipcMain.handle('train-player', async (event, statToTrain) => {
    gameState.trainPlayer(statToTrain);
    return gameState.player;
});

ipcMain.handle('get-transfer-offers', async (event) => {
    return gameState.getAllOffers();
});

ipcMain.handle('accept-offer', async (event, offerId) => {
    return gameState.acceptOffer(offerId);
});

ipcMain.handle('reject-offer', async (event, offerId) => {
    gameState.rejectOffer(offerId);
    return true;
});

ipcMain.handle('handle-media-event', async (event, choice) => {
    return gameState.handleMediaEvent(choice);
});

// Yeni eklenen handler: Lig sıralamasını döndürür
ipcMain.handle('get-league-rankings', async (event) => {
    return gameState.getLeagueRankings();
});