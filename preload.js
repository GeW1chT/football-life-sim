// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('footballAPI', {
  getPlayerInfo: () => ipcRenderer.invoke('get-player-info'),
  nextWeek: () => ipcRenderer.invoke('next-week'),
  createPlayer: (playerData) => ipcRenderer.invoke('create-player', playerData),
  getLatestMatchResult: () => ipcRenderer.invoke('get-latest-match-result'),
  trainPlayer: (stat) => ipcRenderer.invoke('train-player', stat),
  getTransferOffers: () => ipcRenderer.invoke('get-transfer-offers'),
  acceptOffer: (offerId) => ipcRenderer.invoke('accept-offer', offerId),
  rejectOffer: (offerId) => ipcRenderer.invoke('reject-offer', offerId),
  handleMediaEvent: (choice) => ipcRenderer.invoke('handle-media-event', choice)
});