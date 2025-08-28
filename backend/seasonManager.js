// backend/seasonManager.js

class SeasonManager {
    constructor() {
        this.currentSeason = null;
        this.seasonHistory = [];
        this.currentWeek = 1;
        this.maxWeeksPerSeason = 38; // Standard football season length
        this.seasonStarted = false;
    }

    /**
     * Initialize a new season
     */
    startNewSeason(playerData, leagueInfo) {
        const seasonId = this.generateSeasonId();
        
        this.currentSeason = {
            id: seasonId,
            startDate: new Date(),
            seasonNumber: this.seasonHistory.length + 1,
            currentWeek: 1,
            totalWeeks: this.maxWeeksPerSeason,
            status: 'active',
            
            // League Information
            league: {
                name: leagueInfo?.name || 'Premier League',
                country: leagueInfo?.country || 'England',
                division: leagueInfo?.division || 1,
                prestige: leagueInfo?.prestige || 90
            },
            
            // Player Season Stats
            playerStats: {
                playerId: playerData.id,
                playerName: playerData.name,
                team: playerData.team,
                position: playerData.position,
                
                // Match Statistics
                matchesPlayed: 0,
                matchesStarted: 0,
                minutesPlayed: 0,
                
                // Attacking Stats
                goals: 0,
                assists: 0,
                shotsOnTarget: 0,
                shotsTotal: 0,
                keyPasses: 0,
                dribbles: 0,
                
                // Defensive Stats
                tackles: 0,
                interceptions: 0,
                clearances: 0,
                blocks: 0,
                
                // Discipline
                yellowCards: 0,
                redCards: 0,
                
                // Performance Ratings
                averageRating: 0,
                bestRating: 0,
                worstRating: 10,
                totalRating: 0,
                
                // Awards & Achievements
                playerOfTheMonth: 0,
                manOfTheMatch: 0,
                hatTricks: 0,
                
                // Team Performance
                wins: 0,
                draws: 0,
                losses: 0,
                
                // Milestones
                milestones: []
            },
            
            // Team Season Performance
            teamStats: {
                teamName: playerData.team,
                leaguePosition: 0,
                points: 0,
                matchesPlayed: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                
                // Cups & Competitions
                competitions: [
                    {
                        name: 'League Cup',
                        status: 'active',
                        round: 'First Round'
                    },
                    {
                        name: 'FA Cup',
                        status: 'active',
                        round: 'First Round'
                    }
                ]
            },
            
            // Season Objectives
            objectives: this.generateSeasonObjectives(playerData),
            
            // Market & Financial
            financial: {
                startingSalary: playerData.salary || 50000,
                currentSalary: playerData.salary || 50000,
                bonusesEarned: 0,
                transferValue: playerData.marketValue || 1000000,
                contractExpiry: new Date(new Date().getFullYear() + 2, 5, 30)
            },
            
            // Key Matches
            keyMatches: [],
            
            // Season Events
            events: []
        };
        
        this.seasonStarted = true;
        this.currentWeek = 1;
        
        // Add season start event
        this.addSeasonEvent('season_start', `New season started: ${this.currentSeason.league.name}`, 'info');
        
        return this.currentSeason;
    }

    /**
     * Process weekly activities in the season
     */
    processWeek(matchResult = null) {
        if (!this.currentSeason) {
            throw new Error('No active season found');
        }

        this.currentWeek++;
        this.currentSeason.currentWeek = this.currentWeek;

        // Process match if provided
        if (matchResult) {
            this.processMatchResult(matchResult);
        }

        // Check for season events
        this.checkSeasonMilestones();
        
        // Check if season should end
        if (this.currentWeek > this.maxWeeksPerSeason) {
            this.endSeason();
        }

        return {
            week: this.currentWeek,
            seasonProgress: (this.currentWeek / this.maxWeeksPerSeason) * 100,
            remainingWeeks: Math.max(0, this.maxWeeksPerSeason - this.currentWeek)
        };
    }

    /**
     * Process match result and update statistics
     */
    processMatchResult(matchResult) {
        const stats = this.currentSeason.playerStats;
        const teamStats = this.currentSeason.teamStats;

        // Update player match stats
        stats.matchesPlayed++;
        if (matchResult.started) stats.matchesStarted++;
        stats.minutesPlayed += matchResult.minutesPlayed || 90;
        
        // Update performance stats
        stats.goals += matchResult.goals || 0;
        stats.assists += matchResult.assists || 0;
        stats.yellowCards += matchResult.yellowCards || 0;
        stats.redCards += matchResult.redCards || 0;
        
        // Update rating
        const rating = matchResult.rating || 6.0;
        stats.totalRating += rating;
        stats.averageRating = stats.totalRating / stats.matchesPlayed;
        if (rating > stats.bestRating) stats.bestRating = rating;
        if (rating < stats.worstRating) stats.worstRating = rating;
        
        // Update team stats
        teamStats.matchesPlayed++;
        if (matchResult.result === 'win') {
            stats.wins++;
            teamStats.wins++;
            teamStats.points += 3;
        } else if (matchResult.result === 'draw') {
            stats.draws++;
            teamStats.draws++;
            teamStats.points += 1;
        } else {
            stats.losses++;
            teamStats.losses++;
        }

        // Check for special achievements
        this.checkMatchAchievements(matchResult);
        
        // Add match to key matches if significant
        if (this.isKeyMatch(matchResult)) {
            this.currentSeason.keyMatches.push({
                week: this.currentWeek,
                opponent: matchResult.opponent,
                result: matchResult.result,
                score: matchResult.score,
                playerRating: rating,
                significance: matchResult.significance || 'important'
            });
        }
    }

    /**
     * Check for match achievements and milestones
     */
    checkMatchAchievements(matchResult) {
        const stats = this.currentSeason.playerStats;
        
        // Hat-trick detection
        if (matchResult.goals >= 3) {
            stats.hatTricks++;
            stats.milestones.push({
                type: 'hat_trick',
                date: new Date(),
                description: `Hat-trick against ${matchResult.opponent}`,
                week: this.currentWeek
            });
            this.addSeasonEvent('achievement', `Hat-trick scored against ${matchResult.opponent}!`, 'success');
        }
        
        // Man of the Match
        if (matchResult.manOfTheMatch) {
            stats.manOfTheMatch++;
            this.addSeasonEvent('achievement', 'Man of the Match award!', 'success');
        }
        
        // Milestone goals
        if (stats.goals === 10) {
            stats.milestones.push({
                type: 'goals_milestone',
                date: new Date(),
                description: 'First 10 goals of the season',
                week: this.currentWeek
            });
        }
    }

    /**
     * Check for season milestones
     */
    checkSeasonMilestones() {
        const stats = this.currentSeason.playerStats;
        
        // Mid-season check
        if (this.currentWeek === Math.floor(this.maxWeeksPerSeason / 2)) {
            this.addSeasonEvent('milestone', 'Mid-season reached', 'info');
            
            // Mid-season statistics summary
            const midSeasonStats = {
                goals: stats.goals,
                assists: stats.assists,
                averageRating: stats.averageRating.toFixed(1),
                matchesPlayed: stats.matchesPlayed
            };
            
            this.currentSeason.events.push({
                type: 'mid_season_review',
                date: new Date(),
                data: midSeasonStats,
                week: this.currentWeek
            });
        }
        
        // Final third of season
        if (this.currentWeek === Math.floor(this.maxWeeksPerSeason * 0.75)) {
            this.addSeasonEvent('milestone', 'Entering final quarter of the season', 'warning');
        }
    }

    /**
     * End the current season
     */
    endSeason() {
        if (!this.currentSeason) return null;

        this.currentSeason.endDate = new Date();
        this.currentSeason.status = 'completed';
        
        // Calculate final season summary
        const seasonSummary = this.calculateSeasonSummary();
        this.currentSeason.summary = seasonSummary;
        
        // Move to history
        this.seasonHistory.push(this.currentSeason);
        
        // Generate season awards and achievements
        const awards = this.generateSeasonAwards();
        this.currentSeason.awards = awards;
        
        // Reset for next season
        const completedSeason = this.currentSeason;
        this.currentSeason = null;
        this.seasonStarted = false;
        this.currentWeek = 1;
        
        return {
            completedSeason,
            seasonSummary,
            awards,
            readyForNewSeason: true
        };
    }

    /**
     * Calculate comprehensive season summary
     */
    calculateSeasonSummary() {
        const stats = this.currentSeason.playerStats;
        const teamStats = this.currentSeason.teamStats;
        
        return {
            // Player Performance Grade
            performanceGrade: this.calculatePerformanceGrade(stats),
            
            // Key Statistics
            keyStats: {
                goalsPerGame: (stats.goals / Math.max(stats.matchesPlayed, 1)).toFixed(2),
                assistsPerGame: (stats.assists / Math.max(stats.matchesPlayed, 1)).toFixed(2),
                averageRating: stats.averageRating.toFixed(1),
                appearancePercentage: ((stats.matchesPlayed / this.maxWeeksPerSeason) * 100).toFixed(1)
            },
            
            // Team Achievement
            teamPerformance: {
                finalPosition: teamStats.leaguePosition || 'TBD',
                pointsPerGame: (teamStats.points / Math.max(teamStats.matchesPlayed, 1)).toFixed(1),
                qualification: this.determineQualification(teamStats.leaguePosition)
            },
            
            // Objectives Completion
            objectivesCompleted: this.checkObjectivesCompletion(),
            
            // Memorable Moments
            highlights: this.getSeasonHighlights(),
            
            // Growth & Development
            playerDevelopment: this.calculatePlayerDevelopment()
        };
    }

    /**
     * Generate season objectives based on player level and team
     */
    generateSeasonObjectives(playerData) {
        const objectives = [];
        const playerRating = playerData.attributes?.overall || 75;
        
        // Goals objectives
        if (playerData.position === 'Forward') {
            if (playerRating >= 85) {
                objectives.push({ type: 'goals', target: 25, description: 'Score 25+ goals this season', priority: 'primary' });
            } else if (playerRating >= 75) {
                objectives.push({ type: 'goals', target: 15, description: 'Score 15+ goals this season', priority: 'primary' });
            } else {
                objectives.push({ type: 'goals', target: 8, description: 'Score 8+ goals this season', priority: 'primary' });
            }
        } else if (playerData.position === 'Midfielder') {
            objectives.push({ type: 'assists', target: 10, description: 'Provide 10+ assists this season', priority: 'primary' });
            objectives.push({ type: 'goals', target: 5, description: 'Score 5+ goals this season', priority: 'secondary' });
        }
        
        // Performance objectives
        objectives.push({ type: 'rating', target: 7.0, description: 'Maintain 7.0+ average rating', priority: 'primary' });
        objectives.push({ type: 'appearances', target: 30, description: 'Make 30+ appearances', priority: 'secondary' });
        
        // Team objectives
        objectives.push({ type: 'team_position', target: 10, description: 'Finish in top 10', priority: 'secondary' });
        
        return objectives;
    }

    /**
     * Generate season awards
     */
    generateSeasonAwards() {
        const stats = this.currentSeason.playerStats;
        const awards = [];
        
        // Performance-based awards
        if (stats.averageRating >= 8.0) {
            awards.push({ type: 'excellence', name: 'Season Excellence Award', description: 'Outstanding average rating' });
        }
        
        if (stats.goals >= 20) {
            awards.push({ type: 'top_scorer', name: 'Top Scorer Candidate', description: '20+ goals scored' });
        }
        
        if (stats.assists >= 15) {
            awards.push({ type: 'playmaker', name: 'Playmaker Award', description: '15+ assists provided' });
        }
        
        if (stats.matchesPlayed >= 35) {
            awards.push({ type: 'reliability', name: 'Iron Man Award', description: 'Exceptional availability' });
        }
        
        return awards;
    }

    /**
     * Get current season data
     */
    getCurrentSeason() {
        return this.currentSeason;
    }

    /**
     * Get season history
     */
    getSeasonHistory() {
        return this.seasonHistory;
    }

    /**
     * Get season statistics
     */
    getSeasonStats() {
        if (!this.currentSeason) return null;
        
        return {
            current: this.currentSeason,
            progress: {
                week: this.currentWeek,
                percentage: (this.currentWeek / this.maxWeeksPerSeason) * 100,
                remaining: this.maxWeeksPerSeason - this.currentWeek
            },
            stats: this.currentSeason.playerStats,
            teamStats: this.currentSeason.teamStats
        };
    }

    /**
     * Helper methods
     */
    generateSeasonId() {
        return `season_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addSeasonEvent(type, description, severity = 'info') {
        if (this.currentSeason) {
            this.currentSeason.events.push({
                type,
                description,
                severity,
                date: new Date(),
                week: this.currentWeek
            });
        }
    }

    isKeyMatch(matchResult) {
        return matchResult.significance === 'important' || 
               matchResult.goals >= 2 || 
               matchResult.rating >= 8.5 ||
               matchResult.result === 'win' && matchResult.opponent.includes('rival');
    }

    calculatePerformanceGrade(stats) {
        let score = 0;
        
        // Rating component (40%)
        score += (stats.averageRating / 10) * 40;
        
        // Goals component (30%)
        const goalTarget = 15; // Baseline
        score += Math.min((stats.goals / goalTarget) * 30, 30);
        
        // Assists component (20%)
        const assistTarget = 10; // Baseline
        score += Math.min((stats.assists / assistTarget) * 20, 20);
        
        // Appearances component (10%)
        const appearanceTarget = 30; // Baseline
        score += Math.min((stats.matchesPlayed / appearanceTarget) * 10, 10);
        
        // Convert to letter grade
        if (score >= 90) return 'A+';
        if (score >= 85) return 'A';
        if (score >= 80) return 'A-';
        if (score >= 75) return 'B+';
        if (score >= 70) return 'B';
        if (score >= 65) return 'B-';
        if (score >= 60) return 'C+';
        if (score >= 55) return 'C';
        return 'D';
    }

    determineQualification(position) {
        if (!position) return 'Unknown';
        if (position <= 4) return 'Champions League';
        if (position <= 6) return 'Europa League';
        if (position >= 18) return 'Relegation Battle';
        return 'Mid-table';
    }

    checkObjectivesCompletion() {
        const stats = this.currentSeason.playerStats;
        const completed = [];
        
        this.currentSeason.objectives.forEach(obj => {
            let achieved = false;
            
            switch (obj.type) {
                case 'goals':
                    achieved = stats.goals >= obj.target;
                    break;
                case 'assists':
                    achieved = stats.assists >= obj.target;
                    break;
                case 'rating':
                    achieved = stats.averageRating >= obj.target;
                    break;
                case 'appearances':
                    achieved = stats.matchesPlayed >= obj.target;
                    break;
            }
            
            if (achieved) {
                completed.push(obj);
            }
        });
        
        return completed;
    }

    getSeasonHighlights() {
        const highlights = [];
        
        // Add key matches
        this.currentSeason.keyMatches.forEach(match => {
            highlights.push({
                type: 'match',
                description: `${match.result} vs ${match.opponent} (${match.score})`,
                significance: match.significance
            });
        });
        
        // Add milestones
        this.currentSeason.playerStats.milestones.forEach(milestone => {
            highlights.push({
                type: 'milestone',
                description: milestone.description,
                date: milestone.date
            });
        });
        
        return highlights.slice(0, 10); // Top 10 highlights
    }

    calculatePlayerDevelopment() {
        // This would integrate with the player's attribute system
        return {
            skillImprovement: 'Moderate',
            experienceGained: this.currentSeason.playerStats.matchesPlayed * 10,
            marketValueChange: '+5%',
            potentialGrowth: 'On Track'
        };
    }
}

module.exports = SeasonManager;