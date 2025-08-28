// backend/lifePhaseManager.js

const GeneticsSystem = require('./geneticsSystem');
const ChildhoodDevelopmentSystem = require('./childhoodDevelopment');
const ElementarySchoolSystem = require('./elementarySchool');
const PreAcademyDevelopmentSystem = require('./preAcademyDevelopment');
const AcademySelectionSystem = require('./academySelectionSystem');
const UltraAcademyLifeSystem = require('./ultraAcademyLifeSystem');
const AdvancedInjurySystem = require('./advancedInjurySystem');

class LifePhaseManager {
    constructor() {
        this.currentPhase = 'childhood';
        this.lifeHistory = {};
        this.geneticsSystem = new GeneticsSystem();
        this.childhoodSystem = new ChildhoodDevelopmentSystem();
        this.elementarySystem = new ElementarySchoolSystem();
        this.preAcademySystem = new PreAcademyDevelopmentSystem();
        this.academySelectionSystem = new AcademySelectionSystem();
        this.ultraAcademyLifeSystem = new UltraAcademyLifeSystem();
        this.injurySystem = new AdvancedInjurySystem();
        
        this.playerLifeData = {
            currentAge: 16,
            startingAge: 16,
            genetics: null,
            childhood: null,
            elementary: null,
            preAcademy: null,
            academySelection: null,
            ultraAcademyLife: null,
            academy: null,
            professional: null
        };
    }

    /**
     * Initialize complete life simulation from birth
     */
    initializeCompleteLifeSimulation(playerCreationData) {
        console.log('🌟 Initializing ultra-detailed football life simulation...');
        
        // Generate genetic foundation
        this.generateGeneticFoundation(playerCreationData);
        
        // Simulate childhood development (0-6)
        this.simulateChildhoodPhase();
        
        // Simulate elementary school (6-11)  
        this.simulateElementaryPhase();
        
        // Simulate pre-academy development (11-14)
        this.simulatePreAcademyPhase();
        
        // Simulate academy selection process (14-16)
        this.simulateAcademySelectionPhase();
        
        // Simulate ultra-detailed academy life (16-21)
        this.simulateUltraAcademyLifePhase();
        
        // Calculate final starting attributes
        this.calculateFinalStartingAttributes(playerCreationData);
        
        return this.getComprehensiveLifeSummary();
    }

    /**
     * Generate genetic foundation for the player
     */
    generateGeneticFoundation(playerData) {
        console.log('🧬 Generating genetic profile and family tree...');
        
        // Generate DNA profile with potential parental influence
        const parentalData = this.generateParentalGeneticData(playerData);
        this.playerLifeData.genetics = this.geneticsSystem.generateDNAProfile(parentalData);
        
        // Generate detailed family tree
        this.playerLifeData.familyTree = this.geneticsSystem.generateFamilyTree();
        
        // Calculate genetic potential for football
        this.playerLifeData.geneticPotential = this.geneticsSystem.calculateGeneticPotential();
        
        console.log(`✅ Genetics: Athletic potential ${Math.floor(this.playerLifeData.geneticPotential.overallMax)}%`);
    }

    /**
     * Simulate childhood development phase (0-6 years)
     */
    simulateChildhoodPhase() {
        console.log('👶 Simulating childhood development (0-6 years)...');
        
        this.playerLifeData.childhood = this.childhoodSystem.initialize(
            this.geneticsSystem,
            this.playerLifeData.familyTree
        );
        
        // Track early talent indicators
        const earlyTalent = this.playerLifeData.childhood.earlyIndicators;
        console.log(`✅ Childhood: Athletic potential ${Math.floor(earlyTalent.athleticPotential * 100)}%, Ball affinity ${earlyTalent.ballAffinity}/10`);
    }

    /**
     * Simulate elementary school phase (6-11 years)
     */
    simulateElementaryPhase() {
        console.log('🏫 Simulating elementary school period (6-11 years)...');
        
        this.playerLifeData.elementary = this.elementarySystem.initialize(
            this.playerLifeData.childhood,
            this.playerLifeData.childhood.familyEnvironment
        );
        
        // Track athletic development
        const athletic = this.playerLifeData.elementary.athleticDevelopment;
        console.log(`✅ Elementary: Skill progression noted, ${athletic.leadershipEmergence ? 'leadership emerging' : 'team player developing'}`);
    }

    /**
     * Simulate pre-academy development phase (11-14 years)
     */
    simulatePreAcademyPhase() {
        console.log('⚽ Simulating pre-academy development (11-14 years)...');
        
        this.playerLifeData.preAcademy = this.preAcademySystem.initialize(
            this.playerLifeData.elementary,
            this.playerLifeData.childhood.familyEnvironment,
            this.geneticsSystem
        );
        
        // Check for academy readiness
        const readiness = this.playerLifeData.preAcademy.academyReadiness;
        console.log(`✅ Pre-Academy: ${readiness.overallReadiness ? 'Ready for academy' : 'Continuing local development'}`);
    }
    
    /**
     * Simulate academy selection phase (14-16 years)
     */
    simulateAcademySelectionPhase() {
        console.log('🏆 Simulating academy selection process (14-16 years)...');
        
        this.playerLifeData.academySelection = this.academySelectionSystem.initialize(
            this.playerLifeData.preAcademy,
            this.geneticsSystem,
            this.playerLifeData.childhood.familyEnvironment
        );
        
        // Check if player was accepted to an academy
        const finalChoice = this.playerLifeData.academySelection.finalSelection.finalChoice;
        console.log('✅ Academy Selection: ' + (finalChoice.choice === 'academy_accepted' ? 
            `Accepted to ${finalChoice.chosenAcademy.name}` : 'Continuing alternative path'));
    }
    
    /**
     * Simulate ultra-detailed academy life phase (16-21 years)
     */
    simulateUltraAcademyLifePhase() {
        const academyChoice = this.playerLifeData.academySelection.finalSelection.finalChoice;
        
        if (academyChoice.choice === 'academy_accepted') {
            console.log('🌟 Simulating ultra-detailed academy life (16-21 years)...');
            
            this.playerLifeData.ultraAcademyLife = this.ultraAcademyLifeSystem.initialize(
                this.playerLifeData.academySelection,
                this.geneticsSystem,
                this.injurySystem
            );
            
            // Track academy development
            const careerReadiness = this.playerLifeData.ultraAcademyLife.careerReadiness;
            console.log('✅ Academy Life: Professional readiness achieved - ' + 
                (careerReadiness.overallReadiness > 85 ? 'Elite level' : 'Professional level'));
        } else {
            console.log('📚 Simulating alternative development path (16-21 years)...');
            
            // Simulate alternative path (college, lower league, etc.)
            this.playerLifeData.ultraAcademyLife = {
                alternativePath: true,
                pathType: 'college_scholarship',
                development: this.simulateAlternativeDevelopment(),
                professionalEntry: this.simulateAlternativeProfessionalEntry()
            };
            
            console.log('✅ Alternative Path: College scholarship secured');
        }
    }

    /**
     * Calculate final starting attributes based on complete life simulation
     */
    calculateFinalStartingAttributes(playerCreationData) {
        console.log('📊 Calculating final player attributes from life simulation...');
        
        // Start with base positional stats
        const baseStats = this.generateBaseStatsFromPosition(playerCreationData.position);
        
        // Apply genetic influences
        const geneticallyModifiedStats = this.geneticsSystem.applyGeneticInfluences(
            baseStats, 
            playerCreationData.age || 16
        );
        
        // Apply childhood development bonuses
        const childhoodBonuses = this.calculateChildhoodBonuses();
        
        // Apply elementary school bonuses
        const elementaryBonuses = this.calculateElementaryBonuses();
        
        // Apply pre-academy development bonuses
        const preAcademyBonuses = this.calculatePreAcademyBonuses();
        
        // Combine all influences
        this.playerLifeData.finalStats = this.combineAllInfluences(
            geneticallyModifiedStats,
            childhoodBonuses,
            elementaryBonuses,
            preAcademyBonuses
        );
        
        // Calculate potential range
        this.playerLifeData.potentialRange = this.calculatePotentialRange();
        
        console.log(`✅ Final Stats: Overall ${Math.floor(this.calculateOverallRating())}, Potential ${this.playerLifeData.potentialRange.max}`);
    }

    /**
     * Calculate childhood development bonuses
     */
    calculateChildhoodBonuses() {
        const childhood = this.playerLifeData.childhood;
        const bonuses = {
            speed: 0,
            shooting: 0,
            passing: 0,
            defense: 0,
            stamina: 0,
            intelligence: 0
        };
        
        // Early ball skills bonus
        if (childhood.earlyIndicators.ballAffinity > 7) {
            bonuses.shooting += 3;
            bonuses.passing += 2;
        }
        
        // Athletic potential bonus
        if (childhood.earlyIndicators.athleticPotential > 0.7) {
            bonuses.speed += 4;
            bonuses.stamina += 3;
        }
        
        // Social leadership bonus
        if (childhood.earlyIndicators.socialLeadership) {
            bonuses.intelligence += 5;
            bonuses.defense += 2; // Leadership often correlates with defensive understanding
        }
        
        // Physical confidence bonus
        if (childhood.earlyIndicators.physicalConfidence > 7) {
            bonuses.shooting += 2;
            bonuses.speed += 1;
        }
        
        return bonuses;
    }

    /**
     * Calculate elementary school bonuses
     */
    calculateElementaryBonuses() {
        const elementary = this.playerLifeData.elementary;
        const bonuses = {
            speed: 0,
            shooting: 0,
            passing: 0,
            defense: 0,
            stamina: 0,
            intelligence: 0
        };
        
        // Athletic development bonuses
        if (elementary.athleticDevelopment) {
            if (elementary.athleticDevelopment.skillProgression > 7) {
                bonuses.shooting += 2;
                bonuses.passing += 2;
            }
            
            if (elementary.athleticDevelopment.leadershipEmergence) {
                bonuses.intelligence += 3;
                bonuses.passing += 1;
            }
            
            if (elementary.athleticDevelopment.teamworkSkills > 7) {
                bonuses.passing += 2;
                bonuses.defense += 1;
            }
        }
        
        // Academic performance bonus (intelligence)
        if (elementary.academicProgress) {
            const avgAcademic = this.calculateAverageAcademicPerformance(elementary);
            if (avgAcademic > 7) {
                bonuses.intelligence += 4;
            }
        }
        
        return bonuses;
    }

    /**
     * Calculate pre-academy development bonuses
     */
    calculatePreAcademyBonuses() {
        const preAcademy = this.playerLifeData.preAcademy;
        const bonuses = {
            speed: 0,
            shooting: 0,
            passing: 0,
            defense: 0,
            stamina: 0,
            intelligence: 0
        };
        
        // Skill development bonuses
        if (preAcademy.skillDevelopmentProgression) {
            const skillProg = preAcademy.skillDevelopmentProgression;
            
            if (skillProg.technical.currentLevel > 7) {
                bonuses.shooting += 3;
                bonuses.passing += 2;
            }
            
            if (skillProg.tactical.currentLevel > 6) {
                bonuses.intelligence += 4;
                bonuses.defense += 2;
            }
            
            if (skillProg.physical.currentLevel > 7) {
                bonuses.speed += 3;
                bonuses.stamina += 3;
            }
            
            if (skillProg.mental.currentLevel > 6) {
                bonuses.intelligence += 2;
                // Mental strength helps all attributes slightly
                Object.keys(bonuses).forEach(key => bonuses[key] += 1);
            }
        }
        
        // Academy readiness bonus
        if (preAcademy.academyReadiness && preAcademy.academyReadiness.overallReadiness) {
            // Players ready for academy get a general boost
            Object.keys(bonuses).forEach(key => bonuses[key] += 2);
        }
        
        return bonuses;
    }

    /**
     * Combine all influences into final stats
     */
    combineAllInfluences(geneticStats, childhoodBonuses, elementaryBonuses, preAcademyBonuses) {
        const finalStats = { ...geneticStats };
        
        // Apply all bonuses
        Object.keys(finalStats).forEach(stat => {
            finalStats[stat] += (childhoodBonuses[stat] || 0);
            finalStats[stat] += (elementaryBonuses[stat] || 0);
            finalStats[stat] += (preAcademyBonuses[stat] || 0);
            
            // Ensure stats stay within reasonable bounds
            finalStats[stat] = Math.max(30, Math.min(85, finalStats[stat]));
        });
        
        return finalStats;
    }

    /**
     * Calculate potential range based on genetics and development
     */
    calculatePotentialRange() {
        const genetics = this.playerLifeData.geneticPotential;
        const development = this.assessDevelopmentQuality();
        
        return {
            min: Math.max(genetics.overallMin, 65),
            max: Math.min(genetics.overallMax + development.bonus, 99),
            peakAge: genetics.peakAge,
            declineRate: genetics.declineRate
        };
    }

    /**
     * Assess overall development quality
     */
    assessDevelopmentQuality() {
        let qualityScore = 0;
        let bonus = 0;
        
        // Childhood quality
        const childhood = this.playerLifeData.childhood;
        if (childhood.earlyIndicators.athleticPotential > 0.7) qualityScore += 2;
        if (childhood.earlyIndicators.ballAffinity > 7) qualityScore += 2;
        if (childhood.familyEnvironment.parents.combinedIncome.amount > 75000) qualityScore += 1;
        
        // Elementary quality
        const elementary = this.playerLifeData.elementary;
        if (elementary.schoolEnvironment.school.quality > 0.7) qualityScore += 1;
        if (elementary.athleticDevelopment.skillProgression > 7) qualityScore += 2;
        
        // Pre-academy quality
        const preAcademy = this.playerLifeData.preAcademy;
        if (preAcademy.academyReadiness && preAcademy.academyReadiness.overallReadiness) qualityScore += 3;
        
        // Convert quality score to potential bonus
        if (qualityScore >= 8) bonus = 5; // Exceptional development
        else if (qualityScore >= 6) bonus = 3; // Good development  
        else if (qualityScore >= 4) bonus = 1; // Average development
        else bonus = -2; // Poor development
        
        return { qualityScore, bonus };
    }

    /**
     * Get comprehensive life summary
     */
    getComprehensiveLifeSummary() {
        return {
            // Genetic foundation
            genetics: {
                dnaProfile: this.playerLifeData.genetics,
                familyTree: this.playerLifeData.familyTree,
                geneticPotential: this.playerLifeData.geneticPotential
            },
            
            // Life phases
            phases: {
                childhood: this.playerLifeData.childhood,
                elementary: this.playerLifeData.elementary,
                preAcademy: this.playerLifeData.preAcademy
            },
            
            // Final player attributes
            playerAttributes: {
                stats: this.playerLifeData.finalStats,
                potential: this.playerLifeData.potentialRange,
                overallRating: this.calculateOverallRating(),
                developmentQuality: this.assessDevelopmentQuality()
            },
            
            // Key characteristics developed
            characteristics: this.identifyKeyCharacteristics(),
            
            // Injury predispositions
            injuryProfile: this.geneticsSystem.getInjuryPredispositions(),
            
            // Recommendations for future development
            recommendations: this.generateLifeBasedRecommendations()
        };
    }

    /**
     * Identify key characteristics developed through life phases
     */
    identifyKeyCharacteristics() {
        const characteristics = [];
        
        // From genetics
        if (this.playerLifeData.genetics.mental.competitiveDrive > 0.8) {
            characteristics.push('Natural Competitor');
        }
        if (this.playerLifeData.genetics.mental.learningSpeed > 0.8) {
            characteristics.push('Fast Learner');
        }
        
        // From childhood
        if (this.playerLifeData.childhood.earlyIndicators.socialLeadership) {
            characteristics.push('Natural Leader');
        }
        if (this.playerLifeData.childhood.earlyIndicators.ballAffinity > 8) {
            characteristics.push('Ball Magnet');
        }
        
        // From elementary
        if (this.playerLifeData.elementary.athleticDevelopment.teamworkSkills > 7) {
            characteristics.push('Team Player');
        }
        
        // From pre-academy
        if (this.playerLifeData.preAcademy.academyReadiness?.overallReadiness) {
            characteristics.push('Academy Ready');
        }
        
        return characteristics;
    }

    /**
     * Generate recommendations based on complete life simulation
     */
    generateLifeBasedRecommendations() {
        const recommendations = [];
        
        // Training recommendations
        const weakestStat = this.findWeakestStat();
        recommendations.push({
            category: 'training',
            priority: 'high',
            action: `Focus on ${weakestStat} development`,
            reason: 'Identified as area for improvement from life analysis'
        });
        
        // Position recommendations
        const recommendedPosition = this.recommendOptimalPosition();
        recommendations.push({
            category: 'tactical',
            priority: 'medium',
            action: `Consider specializing in ${recommendedPosition}`,
            reason: 'Based on genetic and developmental characteristics'
        });
        
        // Injury prevention
        const highRiskInjuries = this.identifyHighRiskInjuries();
        if (highRiskInjuries.length > 0) {
            recommendations.push({
                category: 'health',
                priority: 'high',
                action: `Focus on ${highRiskInjuries[0]} injury prevention`,
                reason: 'Genetic predisposition identified'
            });
        }
        
        return recommendations;
    }

    /**
     * Initialize injury system with genetic predispositions
     */
    initializeInjurySystem(player) {
        this.injurySystem.initialize(this.geneticsSystem, player);
        return this.injurySystem;
    }

    /**
     * Calculate overall rating from stats
     */
    calculateOverallRating() {
        const stats = this.playerLifeData.finalStats;
        if (!stats) return 0;
        
        const values = Object.values(stats);
        return Math.floor(values.reduce((sum, val) => sum + val, 0) / values.length);
    }

    /**
     * Generate base stats from position
     */
    generateBaseStatsFromPosition(position) {
        const baseStats = {
            'GK': { speed: 45, shooting: 30, passing: 50, defense: 70, stamina: 60, intelligence: 65 },
            'DEF': { speed: 55, shooting: 35, passing: 60, defense: 75, stamina: 65, intelligence: 60 },
            'MID': { speed: 60, shooting: 55, passing: 70, defense: 50, stamina: 75, intelligence: 70 },
            'FWD': { speed: 70, shooting: 70, passing: 55, defense: 35, stamina: 65, intelligence: 60 }
        };
        
        return baseStats[position] || baseStats['MID'];
    }

    /**
     * Find weakest stat for recommendations
     */
    findWeakestStat() {
        const stats = this.playerLifeData.finalStats;
        let weakestStat = 'speed';
        let lowestValue = stats[weakestStat];
        
        Object.keys(stats).forEach(stat => {
            if (stats[stat] < lowestValue) {
                lowestValue = stats[stat];
                weakestStat = stat;
            }
        });
        
        return weakestStat;
    }
}

module.exports = LifePhaseManager;