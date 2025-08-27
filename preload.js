// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('footballAPI', {
  // Oyuncunun mevcut bilgilerini ister
  getPlayerInfo: () => ipcRenderer.invoke('get-player-info'),
  
  // Oyunda bir hafta ilerlemeyi tetikler
  nextWeek: () => ipcRenderer.invoke('next-week'),
  
  // Yeni bir oyuncu oluşturur
  createPlayer: (playerData) => ipcRenderer.invoke('create-player', playerData),
  
  // Son oynanan maçın sonucunu ister
  getLatestMatchResult: () => ipcRenderer.invoke('get-latest-match-result'),
  
  // Seçilen statta antrenman yapmayı tetikler
  trainPlayer: (stat) => ipcRenderer.invoke('train-player', stat),
  
  // Transfer tekliflerini ister
  getTransferOffers: () => ipcRenderer.invoke('get-transfer-offers'),
  
  // Teklifi kabul etmeyi tetikler
  acceptOffer: (offerId) => ipcRenderer.invoke('accept-offer', offerId),
  
  // Teklifi reddetmeyi tetikler
  rejectOffer: (offerId) => ipcRenderer.invoke('reject-offer', offerId),
  
  // Medya olayını yönetir
  handleMediaEvent: (choice) => ipcRenderer.invoke('handle-media-event', choice),
  
  // Yeni eklenen metot: Lig sıralamasını ister
  getLeagueRankings: () => ipcRenderer.invoke('get-league-rankings'),
});