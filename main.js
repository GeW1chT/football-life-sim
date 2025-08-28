// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const GameState = require('./backend/gameState');
const WorldLeagueSystem = require('./backend/worldLeagues');
const PersonalLifeSystem = require('./backend/personalLife');
const LanguageManager = require('./backend/languageManager');
const SeasonManager = require('./backend/seasonManager');
const FinancialManager = require('./backend/financialManager');
const RelationshipManager = require('./backend/relationshipManager');

let mainWindow;
let gameState;
let worldLeagues;
let personalLife;
let languageManager;
let seasonManager;
let financialManager;
let relationshipManager;

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
  worldLeagues = new WorldLeagueSystem();
  personalLife = new PersonalLifeSystem();
  languageManager = new LanguageManager();
  seasonManager = new SeasonManager();
  financialManager = new FinancialManager();
  relationshipManager = new RelationshipManager();
  
  // Initialize systems
  worldLeagues.initialize();
  languageManager.initialize();
  if (gameState.player) {
    personalLife.initialize(gameState.player);
    financialManager.initialize(gameState.player);
    relationshipManager.initialize(gameState.player);
    
    // Start season if player exists and no active season
    if (!seasonManager.getCurrentSeason()) {
      const leagueInfo = {
        name: gameState.player.currentLeague || 'Premier League',
        country: 'England',
        division: 1,
        prestige: 90
      };
      seasonManager.startNewSeason(gameState.player, leagueInfo);
    }
  } else {
    // Initialize with empty/default data when no player exists
    financialManager.player = null;
  }
  
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
    try {
        // Process the game week
        const weekResult = gameState.nextWeek();
        
        // Process weekly updates for new systems if player exists
        if (gameState.player) {
            // Process personal life weekly activities
            if (personalLife && typeof personalLife.processWeeklyLifestyle === 'function') {
                personalLife.processWeeklyLifestyle();
            }
            
            // Process world leagues weekly results  
            if (worldLeagues && typeof worldLeagues.processWeeklyLeagueResults === 'function') {
                worldLeagues.processWeeklyLeagueResults(gameState.player.currentTeam);
            }
            
            // Process financial activities
            let financialSummary = null;
            if (financialManager && typeof financialManager.processWeeklyFinances === 'function') {
                financialSummary = financialManager.processWeeklyFinances();
                // Sync player money back to gameState
                if (financialManager.player && financialManager.player.money !== undefined) {
                    gameState.player.money = financialManager.player.money;
                }
            }
            
            // Process relationship updates
            if (relationshipManager && typeof relationshipManager.processWeeklyRelationships === 'function') {
                relationshipManager.processWeeklyRelationships();
            }
            
            // Process season week
            let seasonUpdate = null;
            if (seasonManager && seasonManager.getCurrentSeason()) {
                // Create a match result from the game state
                const latestMatch = gameState.matchResults[gameState.matchResults.length - 1];
                if (latestMatch) {
                    const matchResult = {
                        opponent: latestMatch.opponent,
                        result: latestMatch.playerTeamScore > latestMatch.opponentScore ? 'win' : 
                               latestMatch.playerTeamScore < latestMatch.opponentScore ? 'loss' : 'draw',
                        score: `${latestMatch.playerTeamScore}-${latestMatch.opponentScore}`,
                        goals: latestMatch.goals || 0,
                        assists: latestMatch.assists || 0,
                        rating: latestMatch.rating || 6.0,
                        minutesPlayed: 90,
                        started: true
                    };
                    if (typeof seasonManager.processWeek === 'function') {
                        seasonUpdate = seasonManager.processWeek(matchResult);
                    }
                } else {
                    if (typeof seasonManager.processWeek === 'function') {
                        seasonUpdate = seasonManager.processWeek();
                    }
                }
            }
            
            // Update player reference in all systems
            if (personalLife) personalLife.player = gameState.player;
            if (financialManager) financialManager.player = gameState.player;
            if (relationshipManager) relationshipManager.player = gameState.player;
            
            return {
                player: gameState.player,
                hasMediaEvent: gameState.hasMediaEvent,
                seasonUpdate: seasonUpdate,
                seasonStats: seasonManager ? seasonManager.getSeasonStats() : null,
                financialSummary: financialSummary,
                relationshipUpdates: relationshipManager ? relationshipManager.getFamilyStatus() : null,
                matchResult: weekResult.matchResult,
                performanceScore: weekResult.performanceScore
            };
        }
        
        return {
            player: gameState.player,
            hasMediaEvent: gameState.hasMediaEvent,
            matchResult: weekResult.matchResult,
            performanceScore: weekResult.performanceScore
        };
    } catch (error) {
        console.error('Error in next-week handler:', error);
        return {
            error: true,
            message: error.message,
            player: gameState.player,
            hasMediaEvent: false
        };
    }
});

ipcMain.handle('create-player', async (event, playerData) => {
    gameState.createPlayer(playerData);
    // Initialize personal life system for new player
    personalLife.initialize(gameState.player);
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

// Staff Management IPC Handlers
ipcMain.handle('get-staff-data', async (event) => {
    return gameState.getStaffData();
});

ipcMain.handle('hire-staff', async (event, staffId) => {
    return gameState.hireStaff(staffId);
});

ipcMain.handle('fire-staff', async (event, staffId) => {
    return gameState.fireStaff(staffId);
});

ipcMain.handle('refresh-available-staff', async (event) => {
    return gameState.refreshAvailableStaff();
});

ipcMain.handle('get-staff-effects', async (event) => {
    return gameState.applyStaffEffects();
});

// Facility Management IPC Handlers
ipcMain.handle('get-facilities-data', async (event) => {
    return gameState.getFacilitiesData();
});

ipcMain.handle('upgrade-facility', async (event, facilityType) => {
    return gameState.upgradeFacility(facilityType);
});

ipcMain.handle('purchase-equipment', async (event, equipmentId) => {
    return gameState.purchaseEquipment(equipmentId);
});

ipcMain.handle('get-facility-effects', async (event) => {
    return gameState.applyFacilityEffects();
});

// World Leagues IPC Handlers
ipcMain.handle('get-world-leagues-data', async (event) => {
    return worldLeagues.getAllWorldData();
});

ipcMain.handle('get-transfer-targets', async (event) => {
    if (!gameState.player) return [];
    return worldLeagues.getTransferTargets(
        gameState.player.attributes.overall,
        gameState.player.currentLeague || 'premier_league'
    );
});

ipcMain.handle('get-league-table', async (event, leagueId) => {
    return worldLeagues.getLeagueTable(leagueId);
});

ipcMain.handle('get-leagues-by-prestige', async (event, minPrestige) => {
    return worldLeagues.getLeaguesByPrestige(minPrestige || 0);
});

// Personal Life IPC Handlers
ipcMain.handle('get-personal-life-data', async (event) => {
    return personalLife.getPersonalLifeData();
});

ipcMain.handle('purchase-property', async (event, propertyId) => {
    const result = personalLife.purchaseProperty(propertyId);
    if (result.success) {
        gameState.player = personalLife.player; // Update player money
    }
    return result;
});

ipcMain.handle('purchase-vehicle', async (event, vehicleId) => {
    const result = personalLife.purchaseVehicle(vehicleId);
    if (result.success) {
        gameState.player = personalLife.player; // Update player money
    }
    return result;
});

ipcMain.handle('go-out', async (event, activityId) => {
    const result = personalLife.goOut(activityId);
    if (result.success) {
        gameState.player = personalLife.player; // Update player money
    }
    return result;
});

ipcMain.handle('buy-item', async (event, itemId, category) => {
    const result = personalLife.buyItem(itemId, category);
    if (result.success) {
        gameState.player = personalLife.player; // Update player money
    }
    return result;
});

ipcMain.handle('make-personal-investment', async (event, investmentId) => {
    const result = personalLife.makeInvestment(investmentId);
    if (result.success) {
        gameState.player = personalLife.player; // Update player money
    }
    return result;
});

ipcMain.handle('get-lifestyle-performance-impact', async (event) => {
    return personalLife.getPerformanceImpact();
});

// Language System IPC Handlers
ipcMain.handle('set-language', async (event, languageCode) => {
    return languageManager.setLanguage(languageCode);
});

ipcMain.handle('get-current-language', async (event) => {
    return languageManager.getCurrentLanguage();
});

ipcMain.handle('get-available-languages', async (event) => {
    return languageManager.getAvailableLanguages();
});

ipcMain.handle('translate', async (event, key) => {
    return languageManager.translate(key);
});

ipcMain.handle('get-all-translations', async (event) => {
    return languageManager.getAllTranslations();
});

// Season Management IPC Handlers
ipcMain.handle('get-current-season', async (event) => {
    return seasonManager.getCurrentSeason();
});

ipcMain.handle('get-season-stats', async (event) => {
    return seasonManager.getSeasonStats();
});

ipcMain.handle('get-season-history', async (event) => {
    return seasonManager.getSeasonHistory();
});

ipcMain.handle('start-new-season', async (event, leagueInfo) => {
    if (!gameState.player) {
        return { success: false, message: 'No player found' };
    }
    
    const season = seasonManager.startNewSeason(gameState.player, leagueInfo);
    return { success: true, season };
});

ipcMain.handle('end-current-season', async (event) => {
    const result = seasonManager.endSeason();
    return result;
});

// Financial Management IPC Handlers
ipcMain.handle('get-financial-dashboard', async (event) => {
    return financialManager.getFinancialDashboard();
});

ipcMain.handle('sign-sponsorship', async (event, sponsorshipId) => {
    return financialManager.signSponsorshipDeal(sponsorshipId);
});

ipcMain.handle('hire-manager', async (event, managerId) => {
    return financialManager.hireManager(managerId);
});

ipcMain.handle('negotiate-contract', async (event, salary, bonuses, length) => {
    return financialManager.negotiateContract(salary, bonuses, length);
});

ipcMain.handle('make-investment', async (event, investmentId, amount) => {
    return financialManager.makeInvestment(investmentId, amount);
});

ipcMain.handle('get-investment-opportunities', async (event) => {
    return financialManager.getInvestmentOpportunities();
});

ipcMain.handle('purchase-luxury-item', async (event, itemType, cost, name) => {
    const result = financialManager.purchaseLuxuryItem(itemType, cost, name);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
    }
    return result;
});

ipcMain.handle('get-luxury-items', async (event) => {
    return financialManager.getLuxuryItems();
});

ipcMain.handle('purchase-luxury-item-by-id', async (event, itemId) => {
    const result = financialManager.purchaseLuxuryItem(itemId);
    if (result.success) {
        gameState.player = financialManager.player;
    }
    return result;
});

ipcMain.handle('get-business-ventures', async (event) => {
    return financialManager.getBusinessVentures();
});

ipcMain.handle('start-business-venture', async (event, ventureId) => {
    const result = financialManager.startBusinessVenture(ventureId);
    if (result.success) {
        gameState.player = financialManager.player;
    }
    return result;
});

// Relationship Management IPC Handlers
ipcMain.handle('get-family-status', async (event) => {
    return relationshipManager.getFamilyStatus();
});

ipcMain.handle('get-social-media-stats', async (event) => {
    return relationshipManager.getSocialMediaStats();
});

ipcMain.handle('start-relationship', async (event, partnerType) => {
    return relationshipManager.startRomanticRelationship(partnerType);
});

ipcMain.handle('progress-relationship', async (event, partnerId, action) => {
    return relationshipManager.progressRelationship(partnerId, action);
});

ipcMain.handle('post-social-media', async (event, platform, contentType, message) => {
    return relationshipManager.postSocialMedia(platform, contentType, message);
});

ipcMain.handle('handle-media-interview', async (event, topic, approach) => {
    return relationshipManager.handleMediaInterview(topic, approach);
});

// Ultra-Detailed Life Simulation IPC Handlers
ipcMain.handle('create-player-with-life-simulation', async (event, playerData) => {
    const player = gameState.createPlayerWithLifeSimulation(playerData);
    // Initialize all systems with the new detailed player
    personalLife.initialize(player);
    financialManager.initialize(player);
    relationshipManager.initialize(player);
    return player;
});

ipcMain.handle('get-player-life-history', async (event) => {
    return gameState.player?.lifeHistory || null;
});

ipcMain.handle('get-genetic-profile', async (event) => {
    return gameState.player?.lifeHistory?.genetics || null;
});

ipcMain.handle('get-childhood-summary', async (event) => {
    return gameState.player?.lifeHistory?.phases?.childhood || null;
});

ipcMain.handle('get-elementary-school-history', async (event) => {
    return gameState.player?.lifeHistory?.phases?.elementary || null;
});

ipcMain.handle('get-pre-academy-development', async (event) => {
    return gameState.player?.lifeHistory?.phases?.preAcademy || null;
});

// Advanced Injury System IPC Handlers
ipcMain.handle('get-injury-predispositions', async (event) => {
    return gameState.player?.injuryPredispositions || null;
});

ipcMain.handle('simulate-injury-risk', async (event, activityType, conditions) => {
    if (!gameState.player?.injurySystem) {
        return { risk: 'low', factors: [] };
    }
    return gameState.player.injurySystem.calculateInjuryRisk(
        gameState.player, 
        conditions.trainingLoad || 'moderate',
        conditions.matchFrequency || 1,
        conditions
    );
});

ipcMain.handle('get-recovery-protocols', async (event, injuryId) => {
    if (!gameState.player?.injurySystem) return null;
    const injury = gameState.player.injurySystem.currentInjuries.find(inj => inj.id === injuryId);
    return injury ? injury.treatmentPlan : null;
});

ipcMain.handle('update-recovery-progress', async (event, injuryId) => {
    if (!gameState.player?.injurySystem) return null;
    const injury = gameState.player.injurySystem.currentInjuries.find(inj => inj.id === injuryId);
    if (injury) {
        return gameState.player.injurySystem.processWeeklyRecovery(injury);
    }
    return null;
});

// Wealth Protection IPC Handlers
ipcMain.handle('get-insurance-options', async (event) => {
    return financialManager.wealthProtection?.insurance || null;
});

ipcMain.handle('purchase-insurance', async (event, insuranceId) => {
    const result = financialManager.purchaseInsurance(insuranceId);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
    }
    return result;
});

ipcMain.handle('get-investment-structures', async (event) => {
    return financialManager.investmentStructures || null;
});

ipcMain.handle('create-investment-portfolio', async (event, portfolioType) => {
    const result = financialManager.createInvestmentPortfolio(portfolioType);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
    }
    return result;
});

ipcMain.handle('get-asset-protection-options', async (event) => {
    return financialManager.assetProtection || null;
});

ipcMain.handle('establish-asset-protection', async (event, protectionType) => {
    const result = financialManager.establishAssetProtection(protectionType);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
    }
    return result;
});

// Lifestyle Management IPC Handlers
ipcMain.handle('get-lifestyle-options', async (event) => {
    return financialManager.lifestyleManagement || null;
});

ipcMain.handle('purchase-residence', async (event, residenceId) => {
    const result = financialManager.purchaseResidence(residenceId);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
        gameState.player.prestige = financialManager.player.prestige;
    }
    return result;
});

ipcMain.handle('hire-staff', async (event, staffId) => {
    const result = financialManager.hireStaff(staffId);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
    }
    return result;
});

ipcMain.handle('hire-personal-service', async (event, serviceId, category) => {
    const result = financialManager.hirePersonalService(serviceId, category);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
    }
    return result;
});

ipcMain.handle('get-lifestyle-dashboard', async (event) => {
    return financialManager.getLifestyleDashboard();
});

// Charitable Foundation IPC Handlers
ipcMain.handle('get-charitable-options', async (event) => {
    return financialManager.charitableFoundation || null;
});

ipcMain.handle('establish-foundation', async (event, foundationType) => {
    const result = financialManager.establishFoundation(foundationType);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
        gameState.player.prestige = financialManager.player.prestige;
    }
    return result;
});

ipcMain.handle('launch-charitable-program', async (event, programId, category) => {
    const result = financialManager.launchCharitableProgram(programId, category);
    if (result.success) {
        gameState.player.money = financialManager.player.money;
        gameState.player.prestige = financialManager.player.prestige;
    }
    return result;
});

ipcMain.handle('get-charitable-dashboard', async (event) => {
    return financialManager.getCharitableDashboard();
});