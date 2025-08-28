// backend/geneticsSystem.js

class GeneticsSystem {
    constructor() {
        this.dnaProfile = null;
        this.familyTree = null;
        this.inheritedTraits = {};
        this.geneticPotential = {};
        this.healthPredispositions = {};
    }

    /**
     * Generate comprehensive DNA profile for player
     */
    generateDNAProfile(parentalData = null) {
        this.dnaProfile = {
            // Athletic Performance Genes
            athletic: {
                fastTwitchFibers: this.generateGeneticValue(parentalData?.athletic?.fastTwitchFibers),
                slowTwitchFibers: this.generateGeneticValue(parentalData?.athletic?.slowTwitchFibers),
                vo2MaxPotential: this.generateGeneticValue(parentalData?.athletic?.vo2MaxPotential),
                lacticAcidTolerance: this.generateGeneticValue(parentalData?.athletic?.lacticAcidTolerance),
                powerOutput: this.generateGeneticValue(parentalData?.athletic?.powerOutput),
                reactionTime: this.generateGeneticValue(parentalData?.athletic?.reactionTime)
            },

            // Physical Characteristics
            physical: {
                heightPotential: this.generateHeightGenes(parentalData),
                muscleMassGenes: this.generateGeneticValue(parentalData?.physical?.muscleMassGenes),
                boneDensity: this.generateGeneticValue(parentalData?.physical?.boneDensity),
                jointFlexibility: this.generateGeneticValue(parentalData?.physical?.jointFlexibility),
                tendonElasticity: this.generateGeneticValue(parentalData?.physical?.tendonElasticity),
                metabolismRate: this.generateGeneticValue(parentalData?.physical?.metabolismRate)
            },

            // Injury Susceptibility
            health: {
                ligamentStrength: this.generateGeneticValue(parentalData?.health?.ligamentStrength),
                muscleRecovery: this.generateGeneticValue(parentalData?.health?.muscleRecovery),
                cardiovascularHealth: this.generateGeneticValue(parentalData?.health?.cardiovascularHealth),
                injuryResistance: this.generateGeneticValue(parentalData?.health?.injuryResistance),
                longevityGenes: this.generateGeneticValue(parentalData?.health?.longevityGenes),
                inflammationResponse: this.generateGeneticValue(parentalData?.health?.inflammationResponse)
            },

            // Mental Characteristics
            mental: {
                focusCapacity: this.generateGeneticValue(parentalData?.mental?.focusCapacity),
                stressTolerance: this.generateGeneticValue(parentalData?.mental?.stressTolerance),
                learningSpeed: this.generateGeneticValue(parentalData?.mental?.learningSpeed),
                competitiveDrive: this.generateGeneticValue(parentalData?.mental?.competitiveDrive),
                emotionalStability: this.generateGeneticValue(parentalData?.mental?.emotionalStability),
                memoryRetention: this.generateGeneticValue(parentalData?.mental?.memoryRetention)
            }
        };

        return this.dnaProfile;
    }

    /**
     * Generate family tree with athletic history
     */
    generateFamilyTree() {
        this.familyTree = {
            // Paternal Side
            father: {
                athleticHistory: this.generateParentAthleticHistory(),
                profession: this.generateParentProfession(),
                nationality: this.generateNationality(),
                physicalTraits: this.generatePhysicalTraits(),
                mentalTraits: this.generateMentalTraits(),
                healthHistory: this.generateHealthHistory()
            },
            
            // Maternal Side
            mother: {
                athleticHistory: this.generateParentAthleticHistory(),
                profession: this.generateParentProfession(),
                nationality: this.generateNationality(),
                physicalTraits: this.generatePhysicalTraits(),
                mentalTraits: this.generateMentalTraits(),
                healthHistory: this.generateHealthHistory()
            },

            // Grandparents
            paternalGrandfather: this.generateGrandparentProfile(),
            paternalGrandmother: this.generateGrandparentProfile(),
            maternalGrandfather: this.generateGrandparentProfile(),
            maternalGrandmother: this.generateGrandparentProfile(),

            // Siblings
            siblings: this.generateSiblings()
        };

        return this.familyTree;
    }

    /**
     * Generate genetic value with parental influence
     */
    generateGeneticValue(parentalInfluence = null) {
        if (parentalInfluence) {
            // 70% inheritance from parents, 30% random variation
            const inheritance = parentalInfluence * 0.7;
            const variation = (Math.random() * 0.6 - 0.3); // -30% to +30% variation
            return Math.max(0.1, Math.min(1.0, inheritance + variation));
        }
        
        // Pure random if no parental data
        return Math.random();
    }

    /**
     * Generate height genes based on parental data
     */
    generateHeightGenes(parentalData) {
        const baseHeight = 175; // cm average
        let heightPotential = baseHeight;

        if (parentalData && parentalData.family) {
            // Father's influence (stronger for boys)
            const fatherHeight = parentalData.family.father?.height || 178;
            const motherHeight = parentalData.family.mother?.height || 165;
            
            // Genetic height calculation with random variation
            heightPotential = (fatherHeight * 0.6 + motherHeight * 0.4) + (Math.random() * 20 - 10);
        } else {
            // Random height with normal distribution
            heightPotential = baseHeight + (Math.random() * 30 - 15);
        }

        return {
            potential: Math.max(160, Math.min(200, heightPotential)),
            growthRate: 0.3 + Math.random() * 0.4, // How fast they reach potential
            earlyBloomer: Math.random() < 0.3 // 30% chance of early growth spurt
        };
    }

    /**
     * Calculate genetic potential for football attributes
     */
    calculateGeneticPotential() {
        const dna = this.dnaProfile;
        
        this.geneticPotential = {
            speed: this.calculateSpeedPotential(dna),
            shooting: this.calculateShootingPotential(dna),
            passing: this.calculatePassingPotential(dna),
            defense: this.calculateDefensivePotential(dna),
            stamina: this.calculateStaminaPotential(dna),
            intelligence: this.calculateIntelligencePotential(dna),
            
            // Overall potential range
            overallMin: 60,
            overallMax: 95,
            
            // Development characteristics
            peakAge: 26 + Math.floor(dna.health.longevityGenes * 6), // 26-32 peak
            declineRate: 0.5 + (1 - dna.health.longevityGenes) * 0.5, // How fast decline
            injuryProneness: 1 - dna.health.injuryResistance,
            recoverySpeed: dna.health.muscleRecovery
        };

        return this.geneticPotential;
    }

    /**
     * Calculate speed potential based on genetics
     */
    calculateSpeedPotential(dna) {
        const fastTwitch = dna.athletic.fastTwitchFibers;
        const tendonElasticity = dna.physical.tendonElasticity;
        const reactionTime = dna.athletic.reactionTime;
        
        const potential = (fastTwitch * 0.4 + tendonElasticity * 0.3 + reactionTime * 0.3) * 100;
        return {
            min: Math.max(40, potential - 20),
            max: Math.min(99, potential + 10),
            trainability: (dna.mental.learningSpeed + dna.athletic.powerOutput) / 2
        };
    }

    /**
     * Calculate shooting potential based on genetics
     */
    calculateShootingPotential(dna) {
        const powerOutput = dna.athletic.powerOutput;
        const focusCapacity = dna.mental.focusCapacity;
        const coordination = (dna.athletic.reactionTime + dna.physical.jointFlexibility) / 2;
        
        const potential = (powerOutput * 0.4 + focusCapacity * 0.3 + coordination * 0.3) * 100;
        return {
            min: Math.max(30, potential - 25),
            max: Math.min(99, potential + 15),
            trainability: (dna.mental.learningSpeed + dna.mental.focusCapacity) / 2
        };
    }

    /**
     * Generate parent athletic history
     */
    generateParentAthleticHistory() {
        const athleticTypes = [
            { type: 'football', level: 'professional', influence: 0.8 },
            { type: 'football', level: 'semi-professional', influence: 0.6 },
            { type: 'football', level: 'amateur', influence: 0.4 },
            { type: 'running', level: 'competitive', influence: 0.5 },
            { type: 'swimming', level: 'competitive', influence: 0.4 },
            { type: 'basketball', level: 'professional', influence: 0.6 },
            { type: 'tennis', level: 'competitive', influence: 0.5 },
            { type: 'none', level: 'recreational', influence: 0.1 }
        ];

        const choice = athleticTypes[Math.floor(Math.random() * athleticTypes.length)];
        
        return {
            sport: choice.type,
            level: choice.level,
            geneticInfluence: choice.influence,
            achievements: this.generateAchievements(choice.type, choice.level),
            retirementAge: choice.type !== 'none' ? 28 + Math.floor(Math.random() * 10) : null
        };
    }

    /**
     * Generate achievements based on sport and level
     */
    generateAchievements(sport, level) {
        const achievements = [];
        
        if (sport === 'football' && level === 'professional') {
            const possibleAchievements = [
                'League Championship',
                'Cup Winner',
                'International Caps',
                'Top Scorer',
                'Player of the Year'
            ];
            
            // Higher level athletes have more achievements
            const numAchievements = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numAchievements; i++) {
                const achievement = possibleAchievements[Math.floor(Math.random() * possibleAchievements.length)];
                if (!achievements.includes(achievement)) {
                    achievements.push(achievement);
                }
            }
        }
        
        return achievements;
    }

    /**
     * Apply genetic influences to player creation
     */
    applyGeneticInfluences(playerStats, age) {
        const genetics = this.calculateGeneticPotential();
        const dna = this.dnaProfile;
        
        // Apply genetic modifications to base stats
        const modifiedStats = { ...playerStats };
        
        // Speed influenced by fast-twitch fibers and tendon elasticity
        modifiedStats.speed *= (0.7 + dna.athletic.fastTwitchFibers * 0.6);
        
        // Stamina influenced by slow-twitch fibers and cardiovascular health
        modifiedStats.stamina *= (0.7 + dna.athletic.slowTwitchFibers * 0.6);
        
        // Shooting influenced by power output and focus
        modifiedStats.shooting *= (0.8 + dna.athletic.powerOutput * 0.4);
        
        // Passing influenced by mental traits
        modifiedStats.passing *= (0.8 + dna.mental.focusCapacity * 0.4);
        
        // Defense influenced by reaction time and competitive drive
        modifiedStats.defense *= (0.8 + dna.athletic.reactionTime * 0.4);
        
        // Intelligence influenced by learning speed and memory
        modifiedStats.intelligence *= (0.7 + dna.mental.learningSpeed * 0.6);

        // Apply age-based genetic expression
        this.applyAgeBasedGenetics(modifiedStats, age);

        return modifiedStats;
    }

    /**
     * Apply age-based genetic expression
     */
    applyAgeBasedGenetics(stats, age) {
        const dna = this.dnaProfile;
        
        if (age < 18) {
            // Youth have potential but haven't fully developed
            const developmentFactor = 0.7 + (age - 16) * 0.15; // 70% at 16, 100% at 18
            Object.keys(stats).forEach(stat => {
                stats[stat] *= developmentFactor;
            });
        }
        
        if (age > 30) {
            // Physical decline based on longevity genes
            const declineFactor = 1 - ((age - 30) * 0.02 * (1 - dna.health.longevityGenes));
            stats.speed *= declineFactor;
            stats.stamina *= declineFactor;
            
            // Experience growth
            stats.intelligence *= 1 + ((age - 30) * 0.01);
        }
    }

    /**
     * Get genetic injury predispositions
     */
    getInjuryPredispositions() {
        const dna = this.dnaProfile;
        
        return {
            muscleStrains: {
                risk: 1 - dna.physical.tendonElasticity,
                recoveryTime: 1 - dna.health.muscleRecovery,
                frequency: 'medium'
            },
            ligamentInjuries: {
                risk: 1 - dna.health.ligamentStrength,
                recoveryTime: 1 - dna.health.muscleRecovery,
                frequency: 'low'
            },
            boneInjuries: {
                risk: 1 - dna.physical.boneDensity,
                recoveryTime: 1 - dna.health.muscleRecovery,
                frequency: 'very_low'
            },
            overuseInjuries: {
                risk: 1 - dna.health.inflammationResponse,
                recoveryTime: 1 - dna.health.muscleRecovery,
                frequency: 'medium'
            }
        };
    }
}

module.exports = GeneticsSystem;