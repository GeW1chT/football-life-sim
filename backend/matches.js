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

    // Oyuncunun pozisyonu ve ilgili statlarına göre gol/asist olasılığı
    switch (player.position) {
      case 'FWD':
        if (player.stats.shooting >= 75 && Math.random() < 0.4) goals = Math.floor(Math.random() * 3);
        else if (player.stats.shooting >= 60 && Math.random() < 0.2) goals = 1;
        break;
      case 'MID':
        if (player.stats.passing >= 70 && Math.random() < 0.3) assists = Math.floor(Math.random() * 2);
        else if (player.stats.passing >= 60 && Math.random() < 0.1) assists = 1;
        break;
      // Diğer pozisyonlar için benzer mantıklar eklenebilir
    }

    return { goals, assists };
  }
  
}

module.exports = MatchSimulator;