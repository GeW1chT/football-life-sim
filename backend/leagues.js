// backend/leagues.js
const teamsData = require('../data/teams.json');

class League {
    constructor() {
        this.teams = teamsData.map(team => ({
            ...team,
            points: 0,
            wins: 0,
            losses: 0,
            draws: 0
        }));
    }

    // Maç sonucuna göre puan tablosunu günceller
    updateTable(teamName, result) {
        const team = this.teams.find(t => t.name === teamName);
        if (team) {
            if (result === 'Win') {
                team.points += 3;
                team.wins += 1;
            } else if (result === 'Draw') {
                team.points += 1;
                team.draws += 1;
            } else {
                team.losses += 1;
            }
        }
    }

    // Puan tablosunu sıralar
    getRankings() {
        return this.teams.sort((a, b) => b.points - a.points);
    }
}

module.exports = League;