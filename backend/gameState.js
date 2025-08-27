// backend/gameState.js
const fs = require('fs');
const path = require('path');
const MatchSimulator = require('./matches');
const TransferSystem = require('./transfers');
const League = require('./leagues'); // Yeni eklenen satır

class GameState {
  constructor() {
    this.player = null;
    this.currentWeek = 1;
    this.currentSeason = 1;
    this.transferOffers = [];
    this.matchResults = [];
    this.hasMediaEvent = false;
    this.league = new League(); // Yeni eklenen satır: Lig objesi oluşturuldu
  }

  createPlayer(playerData) {
    const teams = this.league.teams;
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];

    this.player = {
      name: playerData.name,
      position: playerData.position,
      age: 18,
      stats: {
        speed: 70,
        shooting: 65,
        passing: 60,
        defense: 55,
        stamina: 75,
      },
      team: randomTeam.name, // Oyuncu rastgele bir takıma katılıyor
      reputation: 50,
    };
  }

  nextWeek() {
    this.currentWeek++;
    this.hasMediaEvent = false;

    // Rakip takımı ligden rastgele seç
    const opponentTeam = this.league.teams.find(t => t.name !== this.player.team);
    const matchResult = MatchSimulator.simulateMatch(this.player, opponentTeam);

    this.matchResults.push(matchResult);
    this.updateStatsBasedOnPerformance(matchResult.playerPerformance);

    // Lig tablosunu güncelle
    this.league.updateTable(this.player.team, matchResult.result);
    this.league.updateTable(opponentTeam.name, matchResult.result === 'Win' ? 'Loss' : matchResult.result === 'Loss' ? 'Win' : 'Draw');

    if (matchResult.playerPerformance.goals > 0 || matchResult.playerPerformance.assists > 0) {
      if (Math.random() < 0.6) {
        this.hasMediaEvent = true;
      }
    }

    console.log(`Match Result: Your team ${matchResult.myTeamGoals} - ${matchResult.opponentGoals} Opponent`);
    console.log(`Player Performance: Goals - ${matchResult.playerPerformance.goals}, Assists - ${matchResult.playerPerformance.assists}`);
    console.log('Player Stats Updated.');

    if (this.currentWeek % 4 === 0) {
      const newOffers = TransferSystem.generateOffers(this.player);
      this.transferOffers = newOffers;
      if (newOffers.length > 0) {
        console.log(`New transfer offers received!`);
      }
    }
  }

  updateStatsBasedOnPerformance(performance) {
    if (performance.goals > 0) {
      this.player.stats.shooting += performance.goals;
    }
    if (performance.assists > 0) {
      this.player.stats.passing += performance.assists;
    }
    this.player.stats.stamina -= 1;
    if (this.player.stats.stamina < 0) this.player.stats.stamina = 0;
  }

  trainPlayer(statToTrain) {
    if (this.player && this.player.stats[statToTrain] !== undefined) {
      this.player.stats[statToTrain] += 2;

      for (const stat in this.player.stats) {
        if (stat !== statToTrain && this.player.stats[stat] < 100) {
          this.player.stats[stat] += 1;
        }
      }

      console.log(`Player trained ${statToTrain}. New value: ${this.player.stats[statToTrain]}`);
    }
  }

  acceptOffer(offerId) {
    const acceptedOffer = this.transferOffers.find(offer => offer.id === offerId);
    if (acceptedOffer) {
      this.player.team = acceptedOffer.teamName;
      this.transferOffers = [];
      console.log(`Accepted offer from ${acceptedOffer.teamName}!`);
      return true;
    }
    return false;
  }

  rejectOffer(offerId) {
    this.transferOffers = this.transferOffers.filter(offer => offer.id !== offerId);
    console.log(`Rejected offer.`);
  }

  getAllOffers() {
      return this.transferOffers;
  }

  handleMediaEvent(choice) {
    switch(choice) {
      case 'modest':
        this.player.reputation += 5;
        break;
      case 'confident':
        this.player.reputation += 2;
        break;
      case 'controversial':
        this.player.reputation -= 5;
        break;
    }
    if (this.player.reputation > 100) this.player.reputation = 100;
    if (this.player.reputation < 0) this.player.reputation = 0;

    this.hasMediaEvent = false;
    return this.player;
  }

  // Yeni eklenen metot: Lig tablosunu döndürür
  getLeagueRankings() {
      return this.league.getRankings();
  }
}

module.exports = GameState;