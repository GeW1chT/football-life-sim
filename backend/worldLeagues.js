// backend/worldLeagues.js

class WorldLeagueSystem {
    constructor() {
        this.continents = {};
        this.countries = {};
        this.leagues = {};
        this.teams = {};
        this.competitions = {};
        this.currentSeason = 1;
        this.playerCurrentLeague = null;
        this.playerCurrentTeam = null;
    }

    /**
     * Initialize the world league system
     */
    initialize() {
        this.createContinents();
        this.createCountries();
        this.createLeagues();
        this.createTeams();
        this.createCompetitions();
    }

    /**
     * Create continents
     */
    createContinents() {
        this.continents = {
            europe: {
                id: 'europe',
                name: 'Europe',
                prestige: 95,
                countries: ['england', 'spain', 'germany', 'italy', 'france', 'turkey', 'portugal', 'netherlands']
            },
            southAmerica: {
                id: 'southAmerica',
                name: 'South America',
                prestige: 85,
                countries: ['brazil', 'argentina', 'colombia', 'chile', 'uruguay']
            },
            asia: {
                id: 'asia',
                name: 'Asia',
                prestige: 70,
                countries: ['japan', 'southKorea', 'china', 'saudiArabia', 'qatar']
            },
            africa: {
                id: 'africa',
                name: 'Africa',
                prestige: 65,
                countries: ['egypt', 'morocco', 'southAfrica', 'nigeria', 'ghana']
            },
            northAmerica: {
                id: 'northAmerica',
                name: 'North America',
                prestige: 60,
                countries: ['usa', 'mexico', 'canada']
            }
        };
    }

    /**
     * Create countries and their league systems
     */
    createCountries() {
        this.countries = {
            // EUROPE
            england: {
                id: 'england',
                name: 'England',
                continent: 'europe',
                prestige: 100,
                currency: 'GBP',
                leagues: ['premier_league', 'championship', 'league_one', 'league_two']
            },
            spain: {
                id: 'spain',
                name: 'Spain',
                continent: 'europe',
                prestige: 98,
                currency: 'EUR',
                leagues: ['la_liga', 'segunda_division', 'segunda_b']
            },
            germany: {
                id: 'germany',
                name: 'Germany',
                continent: 'europe',
                prestige: 95,
                currency: 'EUR',
                leagues: ['bundesliga', 'bundesliga_2', 'liga_3']
            },
            italy: {
                id: 'italy',
                name: 'Italy',
                continent: 'europe',
                prestige: 92,
                currency: 'EUR',
                leagues: ['serie_a', 'serie_b', 'serie_c']
            },
            france: {
                id: 'france',
                name: 'France',
                continent: 'europe',
                prestige: 90,
                currency: 'EUR',
                leagues: ['ligue_1', 'ligue_2', 'national']
            },
            turkey: {
                id: 'turkey',
                name: 'Turkey',
                continent: 'europe',
                prestige: 75,
                currency: 'TRY',
                leagues: ['super_lig', 'lig_1', 'lig_2']
            },
            portugal: {
                id: 'portugal',
                name: 'Portugal',
                continent: 'europe',
                prestige: 78,
                currency: 'EUR',
                leagues: ['primeira_liga', 'segunda_liga']
            },
            netherlands: {
                id: 'netherlands',
                name: 'Netherlands',
                continent: 'europe',
                prestige: 82,
                currency: 'EUR',
                leagues: ['eredivisie', 'eerste_divisie']
            },

            // SOUTH AMERICA
            brazil: {
                id: 'brazil',
                name: 'Brazil',
                continent: 'southAmerica',
                prestige: 88,
                currency: 'BRL',
                leagues: ['brasileirao', 'serie_b_br', 'serie_c_br']
            },
            argentina: {
                id: 'argentina',
                name: 'Argentina',
                continent: 'southAmerica',
                prestige: 85,
                currency: 'ARS',
                leagues: ['primera_division_arg', 'nacional_b']
            },

            // ASIA
            japan: {
                id: 'japan',
                name: 'Japan',
                continent: 'asia',
                prestige: 72,
                currency: 'JPY',
                leagues: ['j1_league', 'j2_league', 'j3_league']
            },
            southKorea: {
                id: 'southKorea',
                name: 'South Korea',
                continent: 'asia',
                prestige: 70,
                currency: 'KRW',
                leagues: ['k_league_1', 'k_league_2']
            },

            // AFRICA
            egypt: {
                id: 'egypt',
                name: 'Egypt',
                continent: 'africa',
                prestige: 68,
                currency: 'EGP',
                leagues: ['egyptian_premier']
            },

            // NORTH AMERICA
            usa: {
                id: 'usa',
                name: 'United States',
                continent: 'northAmerica',
                prestige: 62,
                currency: 'USD',
                leagues: ['mls', 'usl_championship']
            }
        };
    }

    /**
     * Create detailed league information
     */
    createLeagues() {
        this.leagues = {
            // ENGLAND
            premier_league: {
                id: 'premier_league',
                name: 'Premier League',
                country: 'england',
                level: 1,
                teams: 20,
                prestige: 100,
                averageSalary: 80000,
                promotion: null,
                relegation: 'championship'
            },
            championship: {
                id: 'championship',
                name: 'Championship',
                country: 'england',
                level: 2,
                teams: 24,
                prestige: 70,
                averageSalary: 25000,
                promotion: 'premier_league',
                relegation: 'league_one'
            },
            league_one: {
                id: 'league_one',
                name: 'League One',
                country: 'england',
                level: 3,
                teams: 24,
                prestige: 45,
                averageSalary: 8000,
                promotion: 'championship',
                relegation: 'league_two'
            },

            // SPAIN
            la_liga: {
                id: 'la_liga',
                name: 'La Liga',
                country: 'spain',
                level: 1,
                teams: 20,
                prestige: 98,
                averageSalary: 75000,
                promotion: null,
                relegation: 'segunda_division'
            },
            segunda_division: {
                id: 'segunda_division',
                name: 'Segunda División',
                country: 'spain',
                level: 2,
                teams: 22,
                prestige: 65,
                averageSalary: 20000,
                promotion: 'la_liga',
                relegation: 'segunda_b'
            },

            // GERMANY
            bundesliga: {
                id: 'bundesliga',
                name: 'Bundesliga',
                country: 'germany',
                level: 1,
                teams: 18,
                prestige: 95,
                averageSalary: 70000,
                promotion: null,
                relegation: 'bundesliga_2'
            },
            bundesliga_2: {
                id: 'bundesliga_2',
                name: '2. Bundesliga',
                country: 'germany',
                level: 2,
                teams: 18,
                prestige: 60,
                averageSalary: 18000,
                promotion: 'bundesliga',
                relegation: 'liga_3'
            },

            // ITALY
            serie_a: {
                id: 'serie_a',
                name: 'Serie A',
                country: 'italy',
                level: 1,
                teams: 20,
                prestige: 92,
                averageSalary: 65000,
                promotion: null,
                relegation: 'serie_b'
            },

            // TURKEY
            super_lig: {
                id: 'super_lig',
                name: 'Süper Lig',
                country: 'turkey',
                level: 1,
                teams: 20,
                prestige: 75,
                averageSalary: 15000,
                promotion: null,
                relegation: 'lig_1'
            },
            lig_1: {
                id: 'lig_1',
                name: '1. Lig',
                country: 'turkey',
                level: 2,
                teams: 20,
                prestige: 45,
                averageSalary: 5000,
                promotion: 'super_lig',
                relegation: 'lig_2'
            },

            // BRAZIL
            brasileirao: {
                id: 'brasileirao',
                name: 'Brasileirão',
                country: 'brazil',
                level: 1,
                teams: 20,
                prestige: 88,
                averageSalary: 25000,
                promotion: null,
                relegation: 'serie_b_br'
            },

            // JAPAN
            j1_league: {
                id: 'j1_league',
                name: 'J1 League',
                country: 'japan',
                level: 1,
                teams: 18,
                prestige: 72,
                averageSalary: 12000,
                promotion: null,
                relegation: 'j2_league'
            },

            // USA
            mls: {
                id: 'mls',
                name: 'MLS',
                country: 'usa',
                level: 1,
                teams: 30,
                prestige: 62,
                averageSalary: 20000,
                promotion: null,
                relegation: null // MLS doesn't have relegation
            }
        };
    }

    /**
     * Create teams for each league
     */
    createTeams() {
        // Premier League Teams
        this.createLeagueTeams('premier_league', [
            'Manchester City', 'Arsenal', 'Liverpool', 'Aston Villa', 'Tottenham',
            'Chelsea', 'Newcastle', 'Manchester United', 'West Ham', 'Crystal Palace',
            'Brighton', 'Bournemouth', 'Fulham', 'Wolves', 'Everton',
            'Brentford', 'Nottingham Forest', 'Luton Town', 'Burnley', 'Sheffield United'
        ]);

        // La Liga Teams
        this.createLeagueTeams('la_liga', [
            'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad',
            'Real Betis', 'Valencia', 'Villarreal', 'Osasuna', 'Getafe',
            'Sevilla', 'Girona', 'Rayo Vallecano', 'Las Palmas', 'Alaves',
            'Mallorca', 'Celta Vigo', 'Cadiz', 'Granada', 'Almeria'
        ]);

        // Bundesliga Teams
        this.createLeagueTeams('bundesliga', [
            'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Union Berlin', 'SC Freiburg',
            'Bayer Leverkusen', 'Eintracht Frankfurt', 'VfL Wolfsburg', 'FC Augsburg', 'Heidenheim',
            'Borussia Monchengladbach', 'VfB Stuttgart', 'Mainz 05', 'FC Koln', 'Werder Bremen',
            'Hoffenheim', 'VfL Bochum', 'SV Darmstadt'
        ]);

        // Süper Lig Teams
        this.createLeagueTeams('super_lig', [
            'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 'Başakşehir',
            'Adana Demirspor', 'Sivasspor', 'Konyaspor', 'Kayserispor', 'Alanyaspor',
            'Antalyaspor', 'Gaziantep FK', 'Kasımpaşa', 'Fatih Karagümrük', 'Rizespor',
            'Hatayspor', 'Ankaragücü', 'İstanbulspor', 'Pendikspor', 'Samsunspor'
        ]);

        // Add more leagues...
        this.generateLowerLeagueTeams();
    }

    /**
     * Create teams for a specific league
     */
    createLeagueTeams(leagueId, teamNames) {
        const league = this.leagues[leagueId];
        if (!league) return;

        league.teamIds = [];
        
        teamNames.forEach((name, index) => {
            const teamId = `${leagueId}_${index + 1}`;
            const team = {
                id: teamId,
                name: name,
                league: leagueId,
                country: league.country,
                prestige: league.prestige + Math.floor(Math.random() * 20) - 10,
                budget: this.calculateTeamBudget(league.prestige),
                stadium: `${name} Stadium`,
                founded: 1900 + Math.floor(Math.random() * 100),
                stats: {
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    points: 0,
                    goalsFor: 0,
                    goalsAgainst: 0
                }
            };
            
            this.teams[teamId] = team;
            league.teamIds.push(teamId);
        });
    }

    /**
     * Generate teams for lower leagues
     */
    generateLowerLeagueTeams() {
        const lowerLeagues = ['championship', 'league_one', 'segunda_division', 'bundesliga_2', 'lig_1'];
        
        lowerLeagues.forEach(leagueId => {
            const league = this.leagues[leagueId];
            if (!league || league.teamIds) return;

            const teamNames = this.generateGenericTeamNames(league.country, league.teams);
            this.createLeagueTeams(leagueId, teamNames);
        });
    }

    /**
     * Generate generic team names for lower leagues
     */
    generateGenericTeamNames(country, count) {
        const cityNames = {
            england: ['Birmingham', 'Leeds', 'Leicester', 'Norwich', 'Middlesbrough', 'Hull', 'Preston', 'Blackburn'],
            spain: ['Valladolid', 'Zaragoza', 'Málaga', 'Córdoba', 'Oviedo', 'Tenerife', 'Lugo', 'Huesca'],
            germany: ['Hamburger SV', 'Hannover', 'Kaiserslautern', 'Nürnberg', 'St. Pauli', 'Düsseldorf', 'Karlsruhe'],
            turkey: ['Bursaspor', 'Eskişehirspor', 'Denizlispor', 'Gençlerbirliği', 'Göztepe', 'Erzurumspor', 'Giresunspor']
        };

        const cities = cityNames[country] || ['City FC', 'United FC', 'Athletic', 'Rovers', 'Town FC'];
        const teams = [];
        
        for (let i = 0; i < count; i++) {
            if (i < cities.length) {
                teams.push(cities[i]);
            } else {
                teams.push(`${country.charAt(0).toUpperCase()}${country.slice(1)} FC ${i - cities.length + 1}`);
            }
        }
        
        return teams;
    }

    /**
     * Calculate team budget based on league prestige
     */
    calculateTeamBudget(prestige) {
        const baseAmount = prestige * 100000;
        const variation = Math.random() * 0.5 + 0.75; // 75% to 125%
        return Math.floor(baseAmount * variation);
    }

    /**
     * Create international competitions
     */
    createCompetitions() {
        this.competitions = {
            champions_league: {
                id: 'champions_league',
                name: 'UEFA Champions League',
                type: 'continental',
                continent: 'europe',
                prestige: 100,
                prize: 50000000,
                qualifyingLeagues: ['premier_league', 'la_liga', 'bundesliga', 'serie_a', 'ligue_1'],
                teamsPerLeague: { premier_league: 4, la_liga: 4, bundesliga: 4, serie_a: 4 }
            },
            europa_league: {
                id: 'europa_league',
                name: 'UEFA Europa League',
                type: 'continental',
                continent: 'europe',
                prestige: 80,
                prize: 15000000,
                qualifyingLeagues: ['premier_league', 'la_liga', 'bundesliga', 'serie_a', 'super_lig'],
                teamsPerLeague: { premier_league: 2, la_liga: 2, bundesliga: 2, serie_a: 2, super_lig: 1 }
            },
            copa_libertadores: {
                id: 'copa_libertadores',
                name: 'Copa Libertadores',
                type: 'continental',
                continent: 'southAmerica',
                prestige: 90,
                prize: 20000000,
                qualifyingLeagues: ['brasileirao', 'primera_division_arg'],
                teamsPerLeague: { brasileirao: 8, primera_division_arg: 6 }
            },
            world_cup: {
                id: 'world_cup',
                name: 'FIFA World Cup',
                type: 'international',
                prestige: 100,
                prize: 100000000,
                frequency: 4 // Every 4 years
            }
        };
    }

    /**
     * Get player's potential transfer targets
     */
    getTransferTargets(playerPrestige, playerLeague) {
        const currentLeague = this.leagues[playerLeague];
        const targets = [];

        // Same level leagues in different countries
        Object.values(this.leagues).forEach(league => {
            if (league.level === currentLeague.level && league.id !== playerLeague) {
                if (league.prestige >= playerPrestige - 10) {
                    targets.push(...this.getTopTeamsFromLeague(league.id, 3));
                }
            }
        });

        // Higher level leagues
        Object.values(this.leagues).forEach(league => {
            if (league.level < currentLeague.level && league.prestige >= playerPrestige - 15) {
                targets.push(...this.getTopTeamsFromLeague(league.id, 2));
            }
        });

        return targets.slice(0, 10); // Return top 10 targets
    }

    /**
     * Get top teams from a league
     */
    getTopTeamsFromLeague(leagueId, count = 5) {
        const league = this.leagues[leagueId];
        if (!league || !league.teamIds) return [];

        return league.teamIds
            .map(teamId => this.teams[teamId])
            .sort((a, b) => b.prestige - a.prestige)
            .slice(0, count);
    }

    /**
     * Get league table
     */
    getLeagueTable(leagueId) {
        const league = this.leagues[leagueId];
        if (!league || !league.teamIds) return [];

        return league.teamIds
            .map(teamId => this.teams[teamId])
            .sort((a, b) => {
                if (b.stats.points !== a.stats.points) {
                    return b.stats.points - a.stats.points;
                }
                const goalDiffA = a.stats.goalsFor - a.stats.goalsAgainst;
                const goalDiffB = b.stats.goalsFor - b.stats.goalsAgainst;
                return goalDiffB - goalDiffA;
            });
    }

    /**
     * Simulate league progression
     */
    processWeeklyLeagueResults(playerTeamId) {
        // Simulate matches for all leagues
        Object.keys(this.leagues).forEach(leagueId => {
            this.simulateLeagueWeek(leagueId, playerTeamId);
        });
    }

    /**
     * Simulate one week of matches for a league
     */
    simulateLeagueWeek(leagueId, playerTeamId) {
        const league = this.leagues[leagueId];
        if (!league || !league.teamIds) return;

        league.teamIds.forEach(teamId => {
            if (teamId === playerTeamId) return; // Player's match is simulated separately

            // Simulate match result
            const opponent = this.getRandomOpponent(teamId, league.teamIds);
            if (opponent) {
                const result = this.simulateMatchResult(teamId, opponent.id);
                this.updateTeamStats(teamId, result.homeGoals, result.awayGoals, true);
                this.updateTeamStats(opponent.id, result.awayGoals, result.homeGoals, false);
            }
        });
    }

    /**
     * Get random opponent for team
     */
    getRandomOpponent(teamId, teamIds) {
        const availableOpponents = teamIds.filter(id => id !== teamId);
        const randomIndex = Math.floor(Math.random() * availableOpponents.length);
        return this.teams[availableOpponents[randomIndex]];
    }

    /**
     * Simulate match result between two teams
     */
    simulateMatchResult(homeTeamId, awayTeamId) {
        const homeTeam = this.teams[homeTeamId];
        const awayTeam = this.teams[awayTeamId];
        
        const homeAdvantage = 1.2;
        const homeStrength = homeTeam.prestige * homeAdvantage;
        const awayStrength = awayTeam.prestige;
        
        const totalStrength = homeStrength + awayStrength;
        const homeWinProb = homeStrength / totalStrength;
        
        const random = Math.random();
        let homeGoals, awayGoals;
        
        if (random < homeWinProb * 0.7) {
            // Home win
            homeGoals = Math.floor(Math.random() * 3) + 1;
            awayGoals = Math.floor(Math.random() * homeGoals);
        } else if (random < homeWinProb * 0.7 + 0.2) {
            // Draw
            const goals = Math.floor(Math.random() * 4);
            homeGoals = awayGoals = goals;
        } else {
            // Away win
            awayGoals = Math.floor(Math.random() * 3) + 1;
            homeGoals = Math.floor(Math.random() * awayGoals);
        }
        
        return { homeGoals, awayGoals };
    }

    /**
     * Update team statistics
     */
    updateTeamStats(teamId, goalsFor, goalsAgainst, isHome) {
        const team = this.teams[teamId];
        if (!team) return;

        team.stats.goalsFor += goalsFor;
        team.stats.goalsAgainst += goalsAgainst;

        if (goalsFor > goalsAgainst) {
            team.stats.wins++;
            team.stats.points += 3;
        } else if (goalsFor === goalsAgainst) {
            team.stats.draws++;
            team.stats.points += 1;
        } else {
            team.stats.losses++;
        }
    }

    /**
     * Get all world data
     */
    getAllWorldData() {
        return {
            continents: this.continents,
            countries: this.countries,
            leagues: this.leagues,
            teams: this.teams,
            competitions: this.competitions,
            currentSeason: this.currentSeason
        };
    }

    /**
     * Get leagues by prestige
     */
    getLeaguesByPrestige(minPrestige = 0) {
        return Object.values(this.leagues)
            .filter(league => league.prestige >= minPrestige)
            .sort((a, b) => b.prestige - a.prestige);
    }

    /**
     * Get player's league options for transfer
     */
    getTransferLeagueOptions(playerPrestige) {
        return this.getLeaguesByPrestige(Math.max(0, playerPrestige - 20));
    }
}

module.exports = WorldLeagueSystem;