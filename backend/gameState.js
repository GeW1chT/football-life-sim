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
    
    // Generate base stats based on position
    const baseStats = this.generatePositionalStats(playerData.position);
    
    // Calculate market value based on stats and potential
    const marketValue = this.calculateMarketValue(baseStats, 18);

    this.player = {
      name: playerData.name,
      position: playerData.position,
      age: 18,
      stats: {
        speed: baseStats.speed + this.randomVariation(),
        shooting: baseStats.shooting + this.randomVariation(),
        passing: baseStats.passing + this.randomVariation(),
        defense: baseStats.defense + this.randomVariation(),
        stamina: baseStats.stamina + this.randomVariation(),
        intelligence: 75 + this.randomVariation(10), // New intelligence stat
      },
      team: randomTeam.name,
      reputation: 50,
      marketValue: marketValue,
      potential: Math.floor(Math.random() * 20) + 80, // Potential ceiling
      form: 7, // Current form (1-10)
      morale: 8, // Player morale (1-10)
      injuries: [], // Injury history
      careerStats: {
        goals: 0,
        assists: 0,
        matches: 0,
        wins: 0,
        losses: 0,
        draws: 0
      },
      contracts: {
        salary: marketValue * 0.1, // 10% of market value as yearly salary
        contractLength: 3, // Years remaining
        bonuses: {
          goalBonus: 5000,
          assistBonus: 3000,
          cleanSheetBonus: 2000
        }
      }
    };
  }
  
  /**
   * Generate position-specific base stats
   */
  generatePositionalStats(position) {
    const statTemplates = {
      'Goalkeeper': { speed: 45, shooting: 20, passing: 55, defense: 80, stamina: 65 },
      'Defender': { speed: 55, shooting: 35, passing: 65, defense: 85, stamina: 70 },
      'Midfielder': { speed: 65, shooting: 60, passing: 85, defense: 55, stamina: 80 },
      'Forward': { speed: 80, shooting: 85, passing: 60, defense: 35, stamina: 75 }
    };
    
    return statTemplates[position] || statTemplates['Midfielder'];
  }
  
  /**
   * Add random variation to stats
   */
  randomVariation(range = 15) {
    return Math.floor(Math.random() * range) - Math.floor(range / 2);
  }
  
  /**
   * Calculate market value based on stats and age
   */
  calculateMarketValue(stats, age) {
    const avgStat = Object.values(stats).reduce((a, b) => a + b, 0) / Object.values(stats).length;
    const ageFactor = age < 25 ? 1.2 : age > 30 ? 0.8 : 1.0;
    const baseValue = avgStat * 10000 * ageFactor;
    
    return Math.floor(baseValue + (Math.random() * baseValue * 0.3));
  }

  nextWeek() {
    this.currentWeek++;
    this.hasMediaEvent = false;
    
    // Check for active injuries
    this.player.injuries = this.player.injuries.filter(injury => {
      const weeksPassedSinceInjury = this.currentWeek - injury.week;
      return weeksPassedSinceInjury < injury.recoveryWeeks;
    });
    
    // If injured, skip match
    if (this.player.injuries.length > 0) {
      console.log(`Player is injured and cannot play this week.`);
      return { hasMediaEvent: false, injured: true, injury: this.player.injuries[0] };
    }

    // Select opponent team
    const opponentTeam = this.league.teams.find(t => t.name !== this.player.team);
    const matchResult = MatchSimulator.simulateMatch(this.player, opponentTeam);

    this.matchResults.push(matchResult);
    this.updateStatsBasedOnPerformance(matchResult.playerPerformance);
    this.updateCareerStats(matchResult);
    this.updateForm(matchResult);

    // Update league table
    this.league.updateTable(this.player.team, matchResult.result);
    this.league.updateTable(opponentTeam.name, 
      matchResult.result === 'Win' ? 'Loss' : 
      matchResult.result === 'Loss' ? 'Win' : 'Draw'
    );

    // Media event probability based on performance
    const performanceScore = this.calculatePerformanceScore(matchResult.playerPerformance);
    if (performanceScore > 7 || matchResult.playerPerformance.goals > 1) {
      if (Math.random() < 0.7) {
        this.hasMediaEvent = true;
      }
    }

    console.log(`Match Result: Your team ${matchResult.myTeamGoals} - ${matchResult.opponentGoals} Opponent`);
    console.log(`Player Performance: Goals - ${matchResult.playerPerformance.goals}, Assists - ${matchResult.playerPerformance.assists}`);
    console.log(`Performance Rating: ${performanceScore}/10`);
    console.log('Player Stats Updated.');

    // Generate transfer offers periodically
    if (this.currentWeek % 4 === 0) {
      const newOffers = TransferSystem.generateOffers(this.player);
      this.transferOffers = newOffers;
      if (newOffers.length > 0) {
        console.log(`New transfer offers received!`);
      }
    }
    
    // Update market value based on recent form
    this.updateMarketValue();
    
    // Weekly player development
    this.developPlayer();
    
    return { 
      hasMediaEvent: this.hasMediaEvent, 
      matchResult: matchResult,
      performanceScore: performanceScore,
      injured: false,
      developmentUpdate: this.getWeeklyDevelopmentSummary()
    };
  }
  
  /**
   * Calculate performance score (1-10)
   */
  calculatePerformanceScore(performance) {
    let score = 6; // Base score
    
    score += performance.goals * 1.5;
    score += performance.assists * 1.0;
    score += performance.passes * 0.01;
    score += performance.tackles * 0.5;
    score -= performance.fouls * 0.3;
    score -= performance.yellowCards * 0.5;
    score -= performance.redCards * 2;
    
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  }
  
  /**
   * Update career statistics
   */
  updateCareerStats(matchResult) {
    this.player.careerStats.matches++;
    this.player.careerStats.goals += matchResult.playerPerformance.goals;
    this.player.careerStats.assists += matchResult.playerPerformance.assists;
    
    if (matchResult.result === 'Win') {
      this.player.careerStats.wins++;
    } else if (matchResult.result === 'Loss') {
      this.player.careerStats.losses++;
    } else {
      this.player.careerStats.draws++;
    }
  }
  
  /**
   * Update player form based on recent performances
   */
  updateForm(matchResult) {
    const performanceScore = this.calculatePerformanceScore(matchResult.playerPerformance);
    
    if (performanceScore >= 8) {
      this.player.form = Math.min(10, this.player.form + 0.5);
    } else if (performanceScore <= 5) {
      this.player.form = Math.max(1, this.player.form - 0.5);
    }
    
    // Form affects morale
    if (this.player.form >= 8) {
      this.player.morale = Math.min(10, this.player.morale + 0.2);
    } else if (this.player.form <= 4) {
      this.player.morale = Math.max(1, this.player.morale - 0.2);
    }
  }
  
  /**
   * Enhanced player development system
   */
  developPlayer() {
    if (!this.player) return;
    
    // Age-based development
    this.handleAgeBasedDevelopment();
    
    // Natural growth (weekly small improvements)
    this.handleNaturalGrowth();
    
    // Experience-based development
    this.handleExperienceBasedDevelopment();
    
    // Update traits and specializations
    this.updatePlayerTraits();
    
    // Recalculate market value
    this.updateMarketValue();
  }
  
  /**
   * Handle age-based development
   */
  handleAgeBasedDevelopment() {
    const age = this.player.age;
    let developmentFactor = 1.0;
    
    if (age <= 20) {
      developmentFactor = 1.5; // Rapid development
    } else if (age <= 25) {
      developmentFactor = 1.2; // Good development
    } else if (age <= 30) {
      developmentFactor = 1.0; // Stable
    } else if (age <= 33) {
      developmentFactor = 0.8; // Slight decline
    } else {
      developmentFactor = 0.6; // Noticeable decline
    }
    
    // Apply slight stat changes based on age
    if (age > 32) {
      // Physical decline
      this.player.stats.speed = Math.max(20, this.player.stats.speed - 0.1);
      this.player.stats.stamina = Math.max(20, this.player.stats.stamina - 0.1);
      
      // Experience growth
      this.player.stats.intelligence = Math.min(99, this.player.stats.intelligence + 0.2);
    }
    
    this.player.developmentFactor = developmentFactor;
  }
  
  /**
   * Handle natural weekly growth
   */
  handleNaturalGrowth() {
    if (this.player.age > 30) return; // No natural growth after 30
    
    // Small random improvements
    Object.keys(this.player.stats).forEach(stat => {
      if (this.player.stats[stat] < this.player.potential) {
        const growthChance = 0.1; // 10% chance per week
        if (Math.random() < growthChance) {
          const improvement = Math.random() * 0.5; // 0-0.5 improvement
          this.player.stats[stat] = Math.min(this.player.potential, this.player.stats[stat] + improvement);
        }
      }
    });
  }
  
  /**
   * Handle experience-based development
   */
  handleExperienceBasedDevelopment() {
    const careerStats = this.player.careerStats;
    
    // Striker experience
    if (this.player.position === 'Forward' && careerStats.goals > 0) {
      const goalExperience = Math.min(5, careerStats.goals * 0.1);
      this.player.stats.shooting = Math.min(99, this.player.stats.shooting + goalExperience * 0.01);
    }
    
    // Playmaker experience
    if (careerStats.assists > 0) {
      const assistExperience = Math.min(5, careerStats.assists * 0.15);
      this.player.stats.passing = Math.min(99, this.player.stats.passing + assistExperience * 0.01);
    }
    
    // Match experience
    if (careerStats.matches > 0) {
      const matchExperience = Math.min(10, careerStats.matches * 0.05);
      this.player.stats.intelligence = Math.min(99, this.player.stats.intelligence + matchExperience * 0.01);
    }
  }
  
  /**
   * Update player traits based on performance and training
   */
  updatePlayerTraits() {
    if (!this.player.traits) {
      this.player.traits = [];
    }
    
    // Goalscorer trait
    if (this.player.careerStats.goals >= 10 && this.player.stats.shooting >= 80) {
      if (!this.player.traits.includes('Clinical Finisher')) {
        this.player.traits.push('Clinical Finisher');
        console.log('New trait acquired: Clinical Finisher');
      }
    }
    
    // Playmaker trait
    if (this.player.careerStats.assists >= 5 && this.player.stats.passing >= 85) {
      if (!this.player.traits.includes('Playmaker')) {
        this.player.traits.push('Playmaker');
        console.log('New trait acquired: Playmaker');
      }
    }
    
    // Speed demon trait
    if (this.player.stats.speed >= 90) {
      if (!this.player.traits.includes('Speed Demon')) {
        this.player.traits.push('Speed Demon');
        console.log('New trait acquired: Speed Demon');
      }
    }
    
    // Leader trait
    if (this.player.careerStats.matches >= 50 && this.player.stats.intelligence >= 85) {
      if (!this.player.traits.includes('Natural Leader')) {
        this.player.traits.push('Natural Leader');
        console.log('New trait acquired: Natural Leader');
      }
    }
    
    // Veteran trait
    if (this.player.age >= 32 && this.player.careerStats.matches >= 100) {
      if (!this.player.traits.includes('Veteran Experience')) {
        this.player.traits.push('Veteran Experience');
        console.log('New trait acquired: Veteran Experience');
      }
    }
  }
  
  /**
   * Get development recommendations
   */
  getDevelopmentRecommendations() {
    const recommendations = [];
    const stats = this.player.stats;
    const age = this.player.age;
    const position = this.player.position;
    
    // Age-specific recommendations
    if (age <= 22) {
      recommendations.push({
        type: 'development',
        priority: 'high',
        title: 'Young Talent Development',
        description: 'Focus on well-rounded skill development',
        suggestion: 'Train all attributes equally to build a strong foundation'
      });
    } else if (age <= 28) {
      recommendations.push({
        type: 'development',
        priority: 'medium',
        title: 'Peak Development Phase',
        description: 'Specialize in position-specific skills',
        suggestion: 'Focus on your strongest attributes to reach elite level'
      });
    } else {
      recommendations.push({
        type: 'development',
        priority: 'medium',
        title: 'Experience Phase',
        description: 'Maintain physical attributes and develop intelligence',
        suggestion: 'Focus on tactical awareness and leadership skills'
      });
    }
    
    // Position-specific development advice
    switch (position) {
      case 'Forward':
        if (stats.shooting < 80) {
          recommendations.push({
            type: 'skill',
            priority: 'high',
            title: 'Shooting Development',
            description: 'Essential for forwards to be clinical finishers',
            suggestion: 'Practice shooting from various angles and distances'
          });
        }
        break;
      case 'Midfielder':
        if (stats.passing < 80) {
          recommendations.push({
            type: 'skill',
            priority: 'high',
            title: 'Passing Mastery',
            description: 'Midfielders need excellent passing range',
            suggestion: 'Work on short, medium, and long-range passing accuracy'
          });
        }
        break;
      case 'Defender':
        if (stats.defense < 80) {
          recommendations.push({
            type: 'skill',
            priority: 'high',
            title: 'Defensive Positioning',
            description: 'Core skill for all defenders',
            suggestion: 'Practice reading the game and positioning drills'
          });
        }
        break;
    }
    
    return recommendations;
  }
  
  /**
   * Get weekly development summary
   */
  getWeeklyDevelopmentSummary() {
    return {
      age: this.player.age,
      developmentFactor: this.player.developmentFactor || 1.0,
      newTraits: this.getRecentTraits(),
      potentialProgress: this.calculatePotentialProgress(),
      recommendations: this.getDevelopmentRecommendations().slice(0, 2)
    };
  }
  
  /**
   * Get recently acquired traits
   */
  getRecentTraits() {
    // In a full implementation, this would track when traits were acquired
    return this.player.traits || [];
  }
  
  /**
   * Calculate potential progress
   */
  calculatePotentialProgress() {
    const currentOverall = this.calculateOverallRating(this.player.stats, this.player.age);
    const potential = this.player.potential || 85;
    const progress = (currentOverall / potential) * 100;
    
    return {
      current: currentOverall,
      potential: potential,
      progressPercentage: Math.min(100, Math.round(progress)),
      remainingGrowth: Math.max(0, potential - currentOverall)
    };
  }
  
  /**
   * Update market value based on form and recent performances
   */
  updateMarketValue() {
    const baseValue = this.calculateMarketValue(this.player.stats, this.player.age);
    const formMultiplier = 0.8 + (this.player.form / 10) * 0.4; // 0.8 to 1.2
    const reputationMultiplier = 0.9 + (this.player.reputation / 100) * 0.2; // 0.9 to 1.1
    
    this.player.marketValue = Math.floor(baseValue * formMultiplier * reputationMultiplier);
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

  trainPlayer(statToTrain, intensity = 'medium') {
    if (!this.player || !this.player.stats[statToTrain]) {
      return { success: false, message: 'Invalid stat or no player found' };
    }
    
    const intensityMultipliers = {
      'light': { gain: 1, stamina: 0.5, injury: 0.01 },
      'medium': { gain: 2, stamina: 1, injury: 0.03 },
      'intensive': { gain: 4, stamina: 2, injury: 0.08 }
    };
    
    const multiplier = intensityMultipliers[intensity] || intensityMultipliers['medium'];
    
    // Check for potential injury
    if (Math.random() < multiplier.injury) {
      const injury = this.generateInjury();
      this.player.injuries.push(injury);
      this.player.morale = Math.max(1, this.player.morale - 2);
      return {
        success: false,
        message: `Training resulted in ${injury.type}! Recovery time: ${injury.recoveryWeeks} weeks`,
        injury: injury
      };
    }
    
    // Calculate improvement based on age, potential, and current stat
    const ageFactor = this.player.age < 25 ? 1.2 : this.player.age > 30 ? 0.7 : 1.0;
    const potentialFactor = this.player.stats[statToTrain] < this.player.potential ? 1.0 : 0.3;
    const improvement = Math.floor(multiplier.gain * ageFactor * potentialFactor);
    
    // Apply improvement
    const oldValue = this.player.stats[statToTrain];
    this.player.stats[statToTrain] = Math.min(99, this.player.stats[statToTrain] + improvement);
    
    // Small improvements to other stats
    Object.keys(this.player.stats).forEach(stat => {
      if (stat !== statToTrain && this.player.stats[stat] < 99) {
        const randomImprovement = Math.random() < 0.3 ? 1 : 0;
        this.player.stats[stat] = Math.min(99, this.player.stats[stat] + randomImprovement);
      }
    });
    
    // Adjust stamina and morale
    this.player.stats.stamina = Math.max(10, this.player.stats.stamina - multiplier.stamina);
    this.player.morale = Math.min(10, this.player.morale + 0.5);
    
    // Update market value
    this.player.marketValue = this.calculateMarketValue(this.player.stats, this.player.age);
    
    console.log(`Player trained ${statToTrain} (${intensity}). ${oldValue} -> ${this.player.stats[statToTrain]}`);
    
    return {
      success: true,
      message: `${statToTrain} improved from ${oldValue} to ${this.player.stats[statToTrain]}!`,
      improvement: this.player.stats[statToTrain] - oldValue,
      newMarketValue: this.player.marketValue
    };
  }
  
  /**
   * Generate random injury
   */
  generateInjury() {
    const injuries = [
      { type: 'Muscle Strain', recoveryWeeks: 1, severity: 'minor' },
      { type: 'Ankle Sprain', recoveryWeeks: 2, severity: 'minor' },
      { type: 'Hamstring Pull', recoveryWeeks: 3, severity: 'moderate' },
      { type: 'Knee Injury', recoveryWeeks: 6, severity: 'major' },
      { type: 'Broken Bone', recoveryWeeks: 8, severity: 'major' }
    ];
    
    const injury = injuries[Math.floor(Math.random() * injuries.length)];
    injury.week = this.currentWeek;
    
    return injury;
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