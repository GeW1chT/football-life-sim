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
  
  // World Leagues API
  getWorldLeaguesData: () => ipcRenderer.invoke('get-world-leagues-data'),
  getTransferTargets: () => ipcRenderer.invoke('get-transfer-targets'),
  getLeagueTable: (leagueId) => ipcRenderer.invoke('get-league-table', leagueId),
  getLeaguesByPrestige: (minPrestige) => ipcRenderer.invoke('get-leagues-by-prestige', minPrestige),
  
  // Personal Life API
  getPersonalLifeData: () => ipcRenderer.invoke('get-personal-life-data'),
  purchaseProperty: (propertyId) => ipcRenderer.invoke('purchase-property', propertyId),
  purchaseVehicle: (vehicleId) => ipcRenderer.invoke('purchase-vehicle', vehicleId),
  goOut: (activityId) => ipcRenderer.invoke('go-out', activityId),
  buyItem: (itemId, category) => ipcRenderer.invoke('buy-item', itemId, category),
  makePersonalInvestment: (investmentId) => ipcRenderer.invoke('make-personal-investment', investmentId),
  getLifestylePerformanceImpact: () => ipcRenderer.invoke('get-lifestyle-performance-impact'),
  
  // Staff Management APIs
  getStaffData: () => ipcRenderer.invoke('get-staff-data'),
  hireStaff: (staffId) => ipcRenderer.invoke('hire-staff', staffId),
  fireStaff: (staffId) => ipcRenderer.invoke('fire-staff', staffId),
  refreshAvailableStaff: () => ipcRenderer.invoke('refresh-available-staff'),
  getStaffEffects: () => ipcRenderer.invoke('get-staff-effects'),
  
  // Facility Management APIs
  getFacilitiesData: () => ipcRenderer.invoke('get-facilities-data'),
  upgradeFacility: (facilityType) => ipcRenderer.invoke('upgrade-facility', facilityType),
  purchaseEquipment: (equipmentId) => ipcRenderer.invoke('purchase-equipment', equipmentId),
  getFacilityEffects: () => ipcRenderer.invoke('get-facility-effects'),
  
  // Language System APIs
  setLanguage: (languageCode) => ipcRenderer.invoke('set-language', languageCode),
  getCurrentLanguage: () => ipcRenderer.invoke('get-current-language'),
  getAvailableLanguages: () => ipcRenderer.invoke('get-available-languages'),
  translate: (key) => ipcRenderer.invoke('translate', key),
  getAllTranslations: () => ipcRenderer.invoke('get-all-translations'),
  
  // Season Management APIs
  getCurrentSeason: () => ipcRenderer.invoke('get-current-season'),
  getSeasonStats: () => ipcRenderer.invoke('get-season-stats'),
  getSeasonHistory: () => ipcRenderer.invoke('get-season-history'),
  startNewSeason: (leagueInfo) => ipcRenderer.invoke('start-new-season', leagueInfo),
  endCurrentSeason: () => ipcRenderer.invoke('end-current-season'),
  
  // Financial Management APIs
  getFinancialDashboard: () => ipcRenderer.invoke('get-financial-dashboard'),
  signSponsorship: (sponsorshipId) => ipcRenderer.invoke('sign-sponsorship', sponsorshipId),
  hireManager: (managerId) => ipcRenderer.invoke('hire-manager', managerId),
  negotiateContract: (salary, bonuses, length) => ipcRenderer.invoke('negotiate-contract', salary, bonuses, length),
  makeInvestment: (investmentId, amount) => ipcRenderer.invoke('make-investment', investmentId, amount),
  getInvestmentOpportunities: () => ipcRenderer.invoke('get-investment-opportunities'),
  purchaseLuxuryItem: (itemType, cost, name) => ipcRenderer.invoke('purchase-luxury-item', itemType, cost, name),
  getLuxuryItems: () => ipcRenderer.invoke('get-luxury-items'),
  purchaseLuxuryItemById: (itemId) => ipcRenderer.invoke('purchase-luxury-item-by-id', itemId),
  getBusinessVentures: () => ipcRenderer.invoke('get-business-ventures'),
  startBusinessVenture: (ventureId) => ipcRenderer.invoke('start-business-venture', ventureId),
  
  // Relationship Management APIs
  getFamilyStatus: () => ipcRenderer.invoke('get-family-status'),
  getSocialMediaStats: () => ipcRenderer.invoke('get-social-media-stats'),
  startRelationship: (partnerType) => ipcRenderer.invoke('start-relationship', partnerType),
  progressRelationship: (partnerId, action) => ipcRenderer.invoke('progress-relationship', partnerId, action),
  postSocialMedia: (platform, contentType, message) => ipcRenderer.invoke('post-social-media', platform, contentType, message),
  handleMediaInterview: (topic, approach) => ipcRenderer.invoke('handle-media-interview', topic, approach),
  
  // Ultra-Detailed Life Simulation APIs
  createPlayerWithLifeSimulation: (playerData) => ipcRenderer.invoke('create-player-with-life-simulation', playerData),
  getPlayerLifeHistory: () => ipcRenderer.invoke('get-player-life-history'),
  getGeneticProfile: () => ipcRenderer.invoke('get-genetic-profile'),
  getChildhoodSummary: () => ipcRenderer.invoke('get-childhood-summary'),
  getElementarySchoolHistory: () => ipcRenderer.invoke('get-elementary-school-history'),
  getPreAcademyDevelopment: () => ipcRenderer.invoke('get-pre-academy-development'),
  
  // Advanced Injury System APIs
  getInjuryPredispositions: () => ipcRenderer.invoke('get-injury-predispositions'),
  simulateInjuryRisk: (activityType, conditions) => ipcRenderer.invoke('simulate-injury-risk', activityType, conditions),
  getRecoveryProtocols: (injuryId) => ipcRenderer.invoke('get-recovery-protocols', injuryId),
  updateRecoveryProgress: (injuryId) => ipcRenderer.invoke('update-recovery-progress', injuryId),
  
  // Wealth Protection APIs
  getInsuranceOptions: () => ipcRenderer.invoke('get-insurance-options'),
  purchaseInsurance: (insuranceId) => ipcRenderer.invoke('purchase-insurance', insuranceId),
  getInvestmentStructures: () => ipcRenderer.invoke('get-investment-structures'),
  createInvestmentPortfolio: (portfolioType) => ipcRenderer.invoke('create-investment-portfolio', portfolioType),
  getAssetProtectionOptions: () => ipcRenderer.invoke('get-asset-protection-options'),
  establishAssetProtection: (protectionType) => ipcRenderer.invoke('establish-asset-protection', protectionType),
  
  // Lifestyle Management APIs
  getLifestyleOptions: () => ipcRenderer.invoke('get-lifestyle-options'),
  purchaseResidence: (residenceId) => ipcRenderer.invoke('purchase-residence', residenceId),
  hireStaff: (staffId) => ipcRenderer.invoke('hire-staff', staffId),
  hirePersonalService: (serviceId, category) => ipcRenderer.invoke('hire-personal-service', serviceId, category),
  getLifestyleDashboard: () => ipcRenderer.invoke('get-lifestyle-dashboard'),
  
  // Charitable Foundation APIs
  getCharitableOptions: () => ipcRenderer.invoke('get-charitable-options'),
  establishFoundation: (foundationType) => ipcRenderer.invoke('establish-foundation', foundationType),
  launchCharitableProgram: (programId, category) => ipcRenderer.invoke('launch-charitable-program', programId, category),
  getCharitableDashboard: () => ipcRenderer.invoke('get-charitable-dashboard'),
});