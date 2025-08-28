// backend/matches.js

const teams = require('../data/teams.json'); // Takım verilerini yükleyeceğiz
const players = require('../data/players.json'); // AI oyuncu verilerini yükleyeceğiz

class MatchSimulator {
  
  // Basit maç sonucu simülasyonu
  static simulateMatch(player, opponentTeam) {
    // Takım güçlerini burada kullanabiliriz, şimdilik rastgele bir sonuç dönelim.
    const playerTeam = teams.find(t => t.name === player.team);
    
    // Rastgele gol sayıları
    const myTeamGoals = Math.floor(Math.random() * 4);
    const opponentGoals = Math.floor(Math.random() * 4);
    
    // Maç sonucunu belirle
    let result = '';
    if (myTeamGoals > opponentGoals) {
      result = 'Win';
    } else if (myTeamGoals < opponentGoals) {
      result = 'Loss';
    } else {
      result = 'Draw';
    }
    
    // Oyuncunun bireysel performansını hesapla
    const playerPerformance = this.calculatePlayerPerformance(player);

    return {
      myTeamGoals,
      opponentGoals,
      result,
      playerPerformance
    };
  }
  
  // Oyuncunun gol ve asist performansını hesapla
  static calculatePlayerPerformance(player) {
    let goals = 0;
    let assists = 0;
    let passes = 0;
    let tackles = 0;
    let fouls = 0;
    let yellowCards = 0;
    let redCards = 0;

    // Base performance based on position
    const basePerformance = this.getBasePerformanceByPosition(player.position);
    
    // Apply player stats modifier
    const statsModifier = this.calculateStatsModifier(player.stats);
    
    // Calculate goals
    const goalChance = basePerformance.goalChance * statsModifier.shooting;
    if (Math.random() < goalChance) {
      goals = Math.random() < 0.3 ? 2 : 1; // 30% chance for 2 goals
      if (Math.random() < 0.05) goals = 3; // 5% chance for hat-trick
    }
    
    // Calculate assists
    const assistChance = basePerformance.assistChance * statsModifier.passing;
    if (Math.random() < assistChance) {
      assists = Math.random() < 0.2 ? 2 : 1; // 20% chance for 2 assists
    }
    
    // Calculate passes (based on position and passing stat)
    passes = Math.floor(basePerformance.basePasses * statsModifier.passing * (0.8 + Math.random() * 0.4));
    
    // Calculate tackles (mainly for defenders and midfielders)
    if (player.position === 'Defender' || player.position === 'Midfielder') {
      tackles = Math.floor(basePerformance.baseTackles * statsModifier.defense * (0.7 + Math.random() * 0.6));
    }
    
    // Calculate fouls (random with some stat influence)
    fouls = Math.floor(Math.random() * 3 * (1.2 - statsModifier.intelligence));
    
    // Calculate cards
    if (fouls > 2 && Math.random() < 0.3) yellowCards = 1;
    if (fouls > 4 && Math.random() < 0.05) {
      redCards = 1;
      yellowCards = 0; // Red card overrides yellow
    }

    return { 
      goals, 
      assists, 
      passes: Math.max(0, passes),
      tackles: Math.max(0, tackles),
      fouls: Math.max(0, fouls),
      yellowCards,
      redCards
    };
  }
  
  /**
   * Get base performance values by position
   */
  static getBasePerformanceByPosition(position) {
    const positionData = {
      'Forward': {
        goalChance: 0.35,
        assistChance: 0.15,
        basePasses: 25,
        baseTackles: 2
      },
      'Midfielder': {
        goalChance: 0.15,
        assistChance: 0.25,
        basePasses: 60,
        baseTackles: 5
      },
      'Defender': {
        goalChance: 0.05,
        assistChance: 0.08,
        basePasses: 45,
        baseTackles: 8
      },
      'Goalkeeper': {
        goalChance: 0.01,
        assistChance: 0.02,
        basePasses: 30,
        baseTackles: 1
      }
    };
    
    return positionData[position] || positionData['Midfielder'];
  }
  
  /**
   * Calculate stats modifier (0.5 to 1.5 based on stats)
   */
  static calculateStatsModifier(stats) {
    return {
      shooting: 0.5 + (stats.shooting / 100),
      passing: 0.5 + (stats.passing / 100),
      defense: 0.5 + (stats.defense / 100),
      intelligence: stats.intelligence ? (stats.intelligence / 100) : 0.75
    };
  }
  
}

module.exports = MatchSimulator;