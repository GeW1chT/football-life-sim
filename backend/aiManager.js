// backend/aiManager.js

class AIManager {
    constructor() {
        this.recommendations = [];
        this.tacticalAdvice = [];
        this.careerGuidance = [];
    }

    /**
     * Generate comprehensive AI recommendations for the player
     */
    generateRecommendations(player, gameState, matchHistory = []) {
        this.recommendations = [];
        
        // Analyze current situation
        const analysis = this.analyzePlayerSituation(player, gameState, matchHistory);
        
        // Generate tactical recommendations
        this.generateTacticalRecommendations(player, analysis);
        
        // Generate training recommendations
        this.generateTrainingRecommendations(player, analysis);
        
        // Generate career guidance
        this.generateCareerGuidance(player, analysis);
        
        // Generate transfer advice
        this.generateTransferAdvice(player, analysis);
        
        return {
            recommendations: this.recommendations,
            analysis: analysis,
            tacticalAdvice: this.tacticalAdvice,
            careerGuidance: this.careerGuidance
        };
    }

    /**
     * Analyze player's current situation
     */
    analyzePlayerSituation(player, gameState, matchHistory) {
        const recentMatches = matchHistory.slice(-5); // Last 5 matches
        const totalMatches = matchHistory.length;
        
        // Calculate recent form
        const recentForm = this.calculateRecentForm(recentMatches);
        
        // Analyze stat distribution
        const statAnalysis = this.analyzeStatDistribution(player.stats);
        
        // Check development potential
        const developmentPotential = this.assessDevelopmentPotential(player);
        
        // Analyze team fit
        const teamFit = this.analyzeTeamFit(player, gameState);
        
        // Check injury risk
        const injuryRisk = this.assessInjuryRisk(player);
        
        return {
            recentForm,
            statAnalysis,
            developmentPotential,
            teamFit,
            injuryRisk,
            overallRating: this.calculateOverallRating(player),
            marketPosition: this.assessMarketPosition(player),
            weekInSeason: gameState.currentWeek,
            season: gameState.currentSeason
        };
    }

    /**
     * Calculate recent form based on match history
     */
    calculateRecentForm(recentMatches) {
        if (recentMatches.length === 0) return 'unknown';
        
        let totalRating = 0;
        let wins = 0;
        let goals = 0;
        let assists = 0;
        
        recentMatches.forEach(match => {
            if (match.result === 'Win') wins++;
            goals += match.playerPerformance.goals || 0;
            assists += match.playerPerformance.assists || 0;
            totalRating += match.performanceScore || 6;
        });
        
        const avgRating = totalRating / recentMatches.length;
        const winRate = wins / recentMatches.length;
        
        if (avgRating >= 8 && winRate >= 0.6) return 'excellent';
        if (avgRating >= 7 && winRate >= 0.4) return 'good';
        if (avgRating >= 6) return 'average';
        if (avgRating >= 5) return 'poor';
        return 'terrible';
    }

    /**
     * Analyze stat distribution to identify strengths and weaknesses
     */
    analyzeStatDistribution(stats) {
        const statEntries = Object.entries(stats);
        const avgStat = statEntries.reduce((sum, [key, value]) => sum + value, 0) / statEntries.length;
        
        const strengths = statEntries.filter(([key, value]) => value >= avgStat + 10);
        const weaknesses = statEntries.filter(([key, value]) => value <= avgStat - 10);
        const balanced = statEntries.filter(([key, value]) => 
            value > avgStat - 10 && value < avgStat + 10
        );
        
        return {
            strengths: strengths.map(([key]) => key),
            weaknesses: weaknesses.map(([key]) => key),
            balanced: balanced.map(([key]) => key),
            avgStat: Math.round(avgStat),
            distribution: this.assessStatDistribution(stats)
        };
    }

    /**
     * Assess stat distribution pattern
     */
    assessStatDistribution(stats) {
        const values = Object.values(stats);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min;
        
        if (range <= 15) return 'balanced';
        if (range <= 25) return 'specialized';
        return 'highly_specialized';
    }

    /**
     * Generate tactical recommendations
     */
    generateTacticalRecommendations(player, analysis) {
        this.tacticalAdvice = [];
        
        // Position-specific advice
        const positionAdvice = this.getPositionSpecificAdvice(player.position, player.stats);
        this.tacticalAdvice.push(...positionAdvice);
        
        // Form-based advice
        const formAdvice = this.getFormBasedAdvice(analysis.recentForm, player);
        this.tacticalAdvice.push(...formAdvice);
        
        // Stat-based tactical advice
        const statAdvice = this.getStatBasedTacticalAdvice(analysis.statAnalysis);
        this.tacticalAdvice.push(...statAdvice);
        
        this.recommendations.push({
            type: 'tactical',
            priority: 'high',
            title: 'Tactical Adjustments',
            description: 'AI-recommended tactical changes based on your current form and abilities',
            advice: this.tacticalAdvice.slice(0, 3) // Top 3 recommendations
        });
    }

    /**
     * Get position-specific advice
     */
    getPositionSpecificAdvice(position, stats) {
        const advice = {
            'Forward': [
                stats.shooting < 70 ? 'Focus on shooting drills to improve goal conversion rate' : null,
                stats.speed < 75 ? 'Work on acceleration to create better scoring opportunities' : null,
                stats.positioning < 80 ? 'Study striker movement patterns and positioning' : null
            ],
            'Midfielder': [
                stats.passing < 75 ? 'Develop passing range and accuracy for better playmaking' : null,
                stats.stamina < 80 ? 'Build endurance to maintain performance throughout matches' : null,
                stats.intelligence < 75 ? 'Study game situations to improve decision making' : null
            ],
            'Defender': [
                stats.defense < 80 ? 'Practice defensive positioning and timing' : null,
                stats.intelligence < 75 ? 'Work on reading the game and anticipating attacks' : null,
                stats.passing < 70 ? 'Improve ball distribution from defensive positions' : null
            ],
            'Goalkeeper': [
                stats.defense < 85 ? 'Focus on shot-stopping and positioning drills' : null,
                stats.intelligence < 80 ? 'Study opponent patterns and improve game reading' : null,
                stats.passing < 65 ? 'Work on distribution and starting attacks from the back' : null
            ]
        };
        
        return (advice[position] || []).filter(item => item !== null);
    }

    /**
     * Generate training recommendations
     */
    generateTrainingRecommendations(player, analysis) {
        const trainingPlan = [];
        
        // Priority training based on weaknesses
        if (analysis.statAnalysis.weaknesses.length > 0) {
            const weakestStat = analysis.statAnalysis.weaknesses[0];
            trainingPlan.push({
                type: 'intensive',
                stat: weakestStat,
                reason: `Addressing your weakest area: ${weakestStat}`,
                frequency: '3x per week',
                duration: '4 weeks'
            });
        }
        
        // Maintenance training for strengths
        if (analysis.statAnalysis.strengths.length > 0) {
            const strongestStat = analysis.statAnalysis.strengths[0];
            trainingPlan.push({
                type: 'light',
                stat: strongestStat,
                reason: `Maintaining your strength in ${strongestStat}`,
                frequency: '1x per week',
                duration: 'ongoing'
            });
        }
        
        // Age-specific recommendations
        if (player.age < 25) {
            trainingPlan.push({
                type: 'medium',
                stat: 'intelligence',
                reason: 'Young players should focus on game understanding',
                frequency: '2x per week',
                duration: '6 weeks'
            });
        } else if (player.age > 30) {
            trainingPlan.push({
                type: 'light',
                stat: 'stamina',
                reason: 'Experienced players need to maintain fitness',
                frequency: '2x per week',
                duration: 'ongoing'
            });
        }
        
        this.recommendations.push({
            type: 'training',
            priority: 'high',
            title: 'Personalized Training Plan',
            description: 'AI-optimized training schedule based on your current abilities and goals',
            plan: trainingPlan
        });
    }

    /**
     * Generate career guidance
     */
    generateCareerGuidance(player, analysis) {
        this.careerGuidance = [];
        
        // Career stage analysis
        const careerStage = this.determineCareerStage(player.age, analysis.overallRating);
        
        // Goals and milestones
        const goals = this.suggestCareerGoals(player, analysis, careerStage);
        
        // Development pathway
        const pathway = this.suggestDevelopmentPathway(player, analysis);
        
        this.careerGuidance.push({
            stage: careerStage,
            goals: goals,
            pathway: pathway,
            timeframe: this.calculateTimeframe(careerStage, player.age)
        });
        
        this.recommendations.push({
            type: 'career',
            priority: 'medium',
            title: 'Career Development Path',
            description: 'Long-term career planning and milestone suggestions',
            guidance: this.careerGuidance[0]
        });
    }

    /**
     * Generate transfer advice
     */
    generateTransferAdvice(player, analysis) {
        const transferAdvice = {
            shouldConsiderTransfer: false,
            reasons: [],
            suggestedTeamTypes: [],
            timing: 'not_recommended'
        };
        
        // Analyze current team fit
        if (analysis.teamFit < 0.6) {
            transferAdvice.shouldConsiderTransfer = true;
            transferAdvice.reasons.push('Poor fit with current team tactics');
        }
        
        // Market value considerations
        if (analysis.marketPosition === 'undervalued') {
            transferAdvice.shouldConsiderTransfer = true;
            transferAdvice.reasons.push('Current market value below potential');
        }
        
        // Performance-based advice
        if (analysis.recentForm === 'excellent' && player.marketValue > 1000000) {
            transferAdvice.timing = 'good_time';
            transferAdvice.reasons.push('Strong recent form increases market appeal');
        }
        
        // Suggest team types
        transferAdvice.suggestedTeamTypes = this.suggestTeamTypes(player, analysis);
        
        if (transferAdvice.shouldConsiderTransfer || transferAdvice.timing === 'good_time') {
            this.recommendations.push({
                type: 'transfer',
                priority: transferAdvice.shouldConsiderTransfer ? 'high' : 'low',
                title: 'Transfer Market Analysis',
                description: 'Strategic advice on potential career moves',
                advice: transferAdvice
            });
        }
    }

    /**
     * Calculate overall rating
     */
    calculateOverallRating(player) {
        const stats = player.stats;
        const weights = {
            'Forward': { speed: 0.2, shooting: 0.3, passing: 0.15, defense: 0.05, stamina: 0.2, intelligence: 0.1 },
            'Midfielder': { speed: 0.15, shooting: 0.15, passing: 0.3, defense: 0.15, stamina: 0.15, intelligence: 0.1 },
            'Defender': { speed: 0.1, shooting: 0.05, passing: 0.15, defense: 0.4, stamina: 0.2, intelligence: 0.1 },
            'Goalkeeper': { speed: 0.05, shooting: 0.0, passing: 0.1, defense: 0.5, stamina: 0.25, intelligence: 0.1 }
        };
        
        const positionWeights = weights[player.position] || weights['Midfielder'];
        
        let weightedSum = 0;
        let totalWeight = 0;
        
        Object.entries(positionWeights).forEach(([stat, weight]) => {
            if (stats[stat] !== undefined) {
                weightedSum += stats[stat] * weight;
                totalWeight += weight;
            }
        });
        
        return Math.round(weightedSum / totalWeight);
    }

    /**
     * Helper methods
     */
    assessDevelopmentPotential(player) {
        const ageFactor = Math.max(0, (30 - player.age) / 12); // Higher potential for younger players
        const currentLevel = this.calculateOverallRating(player);
        const potential = player.potential || 85;
        
        return {
            ceiling: potential,
            current: currentLevel,
            remaining: Math.max(0, potential - currentLevel),
            likelihood: ageFactor * 0.8 + 0.2 // 20-100% based on age
        };
    }

    analyzeTeamFit(player, gameState) {
        // Simplified team fit analysis
        return 0.7 + Math.random() * 0.3; // Mock value between 0.7-1.0
    }

    assessInjuryRisk(player) {
        const age = player.age;
        const stamina = player.stats.stamina;
        const injuryHistory = player.injuries?.length || 0;
        
        let risk = 0.1; // Base 10% risk
        
        if (age > 30) risk += 0.1;
        if (age > 35) risk += 0.2;
        if (stamina < 60) risk += 0.15;
        if (stamina < 40) risk += 0.2;
        risk += injuryHistory * 0.05;
        
        return Math.min(0.8, risk); // Cap at 80%
    }

    assessMarketPosition(player) {
        const rating = this.calculateOverallRating(player);
        const marketValue = player.marketValue || 0;
        
        // Simplified market position assessment
        if (rating > 85 && marketValue < 2000000) return 'undervalued';
        if (rating < 70 && marketValue > 1000000) return 'overvalued';
        return 'fair_value';
    }

    determineCareerStage(age, rating) {
        if (age <= 22) return 'prospect';
        if (age <= 27) return 'developing';
        if (age <= 32) return 'peak';
        return 'veteran';
    }

    suggestCareerGoals(player, analysis, stage) {
        const goals = [];
        
        switch (stage) {
            case 'prospect':
                goals.push('Reach 75+ overall rating');
                goals.push('Secure regular first-team spot');
                goals.push('Score 10+ goals this season');
                break;
            case 'developing':
                goals.push('Become team\'s key player');
                goals.push('Reach 80+ overall rating');
                goals.push('Attract interest from bigger clubs');
                break;
            case 'peak':
                goals.push('Lead team to trophies');
                goals.push('Maintain 85+ rating');
                goals.push('Maximize earning potential');
                break;
            case 'veteran':
                goals.push('Mentor younger players');
                goals.push('Maintain fitness levels');
                goals.push('Plan post-career transition');
                break;
        }
        
        return goals;
    }

    suggestDevelopmentPathway(player, analysis) {
        return {
            shortTerm: 'Focus on immediate weaknesses and team contribution',
            mediumTerm: 'Build on strengths while addressing development areas',
            longTerm: 'Achieve peak performance and sustained excellence'
        };
    }

    calculateTimeframe(stage, age) {
        switch (stage) {
            case 'prospect': return '2-3 years to establish yourself';
            case 'developing': return '3-5 years to reach peak potential';
            case 'peak': return '4-6 years of prime performance';
            case 'veteran': return '2-4 years remaining at top level';
            default: return 'Ongoing development';
        }
    }

    suggestTeamTypes(player, analysis) {
        const rating = analysis.overallRating;
        const types = [];
        
        if (rating >= 85) types.push('Top-tier clubs');
        if (rating >= 75) types.push('European competition teams');
        if (rating >= 65) types.push('Mid-table established clubs');
        if (rating < 65) types.push('Development-focused teams');
        
        return types;
    }

    getFormBasedAdvice(form, player) {
        const advice = [];
        
        switch (form) {
            case 'excellent':
                advice.push('Maintain current training intensity');
                advice.push('Consider increasing role in team tactics');
                break;
            case 'good':
                advice.push('Continue current approach with minor adjustments');
                break;
            case 'average':
                advice.push('Analyze recent performances for improvement areas');
                advice.push('Consider changing training focus');
                break;
            case 'poor':
                advice.push('Review fundamental skills and techniques');
                advice.push('Increase training intensity in weak areas');
                break;
            case 'terrible':
                advice.push('Complete tactical and training overhaul needed');
                advice.push('Focus on building confidence through basic drills');
                break;
        }
        
        return advice;
    }

    getStatBasedTacticalAdvice(statAnalysis) {
        const advice = [];
        
        if (statAnalysis.distribution === 'balanced') {
            advice.push('Versatile player - consider utility role flexibility');
        } else if (statAnalysis.distribution === 'specialized') {
            advice.push('Focus on maximizing your specialized strengths');
        }
        
        statAnalysis.strengths.forEach(strength => {
            advice.push(`Leverage your ${strength} advantage in match situations`);
        });
        
        return advice;
    }
}

module.exports = AIManager;