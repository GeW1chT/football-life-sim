// backend/childhoodDevelopment.js

class ChildhoodDevelopmentSystem {
    constructor() {
        this.developmentPhases = {};
        this.familyEnvironment = {};
        this.earlyExperiences = {};
        this.motorSkillProgress = {};
        this.socialDevelopment = {};
        this.geneticsSystem = null;
    }

    /**
     * Initialize childhood development with genetics influence
     */
    initialize(geneticsSystem, familyBackground = null) {
        this.geneticsSystem = geneticsSystem;
        this.generateFamilyEnvironment(familyBackground);
        this.simulateEarlyDevelopment();
        return this.getChildhoodSummary();
    }

    /**
     * Generate detailed family environment
     */
    generateFamilyEnvironment(familyBackground) {
        this.familyEnvironment = {
            // Parents
            parents: {
                father: this.generateParentProfile('father'),
                mother: this.generateParentProfile('mother'),
                relationship: this.generateParentRelationship(),
                combinedIncome: this.generateFamilyIncome(),
                educationLevel: this.generateParentEducation(),
                athleticBackground: this.getParentAthleticHistory()
            },

            // Home Environment
            home: {
                type: this.determineHousingType(),
                location: this.generateLocation(),
                yardSize: this.generateYardSize(),
                sportsEquipment: this.generateEarlySportsEquipment(),
                neighborhood: this.generateNeighborhood(),
                safetyLevel: Math.random() * 0.4 + 0.6, // 60-100% safety
                culturalExposure: this.generateCulturalExposure()
            },

            // Siblings
            siblings: this.generateSiblingStructure(),

            // Extended Family
            extendedFamily: {
                grandparentsPresent: Math.random() < 0.7,
                unclesAunts: Math.floor(Math.random() * 6) + 2,
                cousins: Math.floor(Math.random() * 8) + 1,
                familyTraditions: this.generateFamilyTraditions(),
                sportingTradition: this.checkSportingTradition()
            }
        };
    }

    /**
     * Simulate development from birth to age 6
     */
    simulateEarlyDevelopment() {
        // Phase 1: Birth to 2 years
        this.simulateBirthTo2Years();
        
        // Phase 2: Ages 2-4 years
        this.simulateAges2To4();
        
        // Phase 3: Ages 4-6 years
        this.simulateAges4To6();
    }

    /**
     * Birth to 2 years development
     */
    simulateBirthTo2Years() {
        const genetics = this.geneticsSystem.dnaProfile;
        
        this.developmentPhases.birth_to_2 = {
            // Birth circumstances
            birthDetails: {
                premature: Math.random() < 0.1,
                birthWeight: 2.5 + Math.random() * 2, // kg
                birthComplications: Math.random() < 0.05,
                season: this.getRandomSeason(),
                relativeBirthMonth: this.calculateRelativeAgeEffect()
            },

            // Motor development milestones
            motorMilestones: {
                sittingAge: this.calculateMilestone(6, genetics.physical.muscleMassGenes), // months
                crawlingAge: this.calculateMilestone(9, genetics.athletic.powerOutput),
                walkingAge: this.calculateMilestone(12, genetics.physical.boneDensity),
                runningAge: this.calculateMilestone(18, genetics.athletic.fastTwitchFibers),
                firstBallContact: this.calculateMilestone(15, genetics.athletic.reactionTime)
            },

            // Growth patterns
            growth: {
                heightPercentile: this.calculateGrowthPercentile(genetics.physical.heightPotential),
                weightGainPattern: genetics.physical.metabolismRate > 0.6 ? 'lean' : 'average',
                headCircumference: 'normal', // Assume normal for simplicity
                overallHealth: this.calculateEarlyHealth()
            },

            // Early behavioral patterns
            behavior: {
                activityLevel: genetics.athletic.powerOutput * 100,
                sleepQuality: genetics.mental.emotionalStability * 10,
                socialResponsiveness: genetics.mental.focusCapacity * 10,
                curiosity: genetics.mental.learningSpeed * 10,
                temperament: this.determineTemperament(genetics)
            }
        };
    }

    /**
     * Ages 2-4 development phase
     */
    simulateAges2To4() {
        const genetics = this.geneticsSystem.dnaProfile;
        const environment = this.familyEnvironment;
        
        this.developmentPhases.ages_2_to_4 = {
            // Physical development
            physicalDevelopment: {
                coordinationLevel: this.calculateCoordination(genetics, environment),
                balanceSkills: genetics.athletic.reactionTime * 10,
                jumpingAbility: genetics.athletic.powerOutput * 10,
                throwingSkills: this.calculateThrowing(genetics),
                ballSkills: this.calculateEarlyBallSkills(genetics, environment)
            },

            // Playground behavior
            playgroundBehavior: {
                climbingPreference: genetics.athletic.powerOutput > 0.7,
                swingCoordination: genetics.physical.jointFlexibility * 10,
                slideConfidence: genetics.mental.competitiveDrive > 0.6,
                socialInteraction: this.calculateEarlySocial(genetics),
                riskTaking: genetics.mental.competitiveDrive * 10,
                groupPlay: environment.siblings.total > 0 ? 8 : 6
            },

            // First sports exposure
            sportsExposure: {
                ballAvailability: environment.home.sportsEquipment.balls,
                parentParticipation: this.calculateParentParticipation(),
                organizedActivity: this.checkOrganizedActivity(),
                naturalInclination: genetics.athletic.fastTwitchFibers > 0.6,
                preferredActivity: this.determinePreferredActivity(genetics),
                attentionSpan: genetics.mental.focusCapacity * 15 // minutes
            },

            // Social development
            socialDevelopment: {
                peerInteraction: this.calculatePeerInteraction(),
                sharingBehavior: genetics.mental.emotionalStability > 0.6,
                leadershipSigns: genetics.mental.competitiveDrive > 0.7,
                conflictResolution: genetics.mental.emotionalStability * 10,
                empathy: this.calculateEmpathy(genetics),
                communication: genetics.mental.learningSpeed * 10
            }
        };
    }

    /**
     * Ages 4-6 development phase
     */
    simulateAges4To6() {
        const genetics = this.geneticsSystem.dnaProfile;
        const environment = this.familyEnvironment;
        
        this.developmentPhases.ages_4_to_6 = {
            // Advanced motor skills
            motorSkills: {
                runningForm: this.calculateRunningForm(genetics),
                jumpingVariety: genetics.athletic.powerOutput * 10,
                balanceChallenge: genetics.physical.jointFlexibility * 10,
                ballControl: this.calculateBallControl(genetics, environment),
                coordinationComplexity: genetics.athletic.reactionTime * 10,
                bilateralDevelopment: this.calculateBilateralSkills(genetics)
            },

            // Organized sports introduction
            organizedSports: {
                firstTeamExperience: this.checkFirstTeamExperience(),
                instructionFollowing: genetics.mental.focusCapacity * 10,
                ruleUnderstanding: genetics.mental.learningSpeed * 10,
                teamConcept: this.calculateTeamConcept(),
                competitiveSpirit: genetics.mental.competitiveDrive * 10,
                skillRetention: genetics.mental.memoryRetention * 10
            },

            // School readiness
            schoolReadiness: {
                fineMotoSkills: this.calculateFineMotor(genetics),
                attentionSpan: genetics.mental.focusCapacity * 20,
                socialSkills: this.calculateAdvancedSocial(),
                academicReadiness: genetics.mental.learningSpeed > 0.7,
                physicalConfidence: this.calculatePhysicalConfidence(),
                emotionalMaturity: genetics.mental.emotionalStability * 10
            },

            // Family sports culture
            familySportsParticipation: {
                parentCoaching: environment.parents.athleticBackground.combined > 0.5,
                familyGameNights: environment.parents.relationship.quality > 0.7,
                sportingEvents: this.calculateSportingEventExposure(),
                equipmentQuality: this.determineEquipmentQuality(),
                encouragementLevel: this.calculateFamilyEncouragement(),
                sportsKnowledge: this.calculateEarlySportsKnowledge()
            }
        };
    }

    /**
     * Calculate milestone achievement age with genetic influence
     */
    calculateMilestone(averageAge, geneticFactor) {
        const variation = (geneticFactor - 0.5) * 4; // ±2 months variation
        return Math.max(1, averageAge + variation + (Math.random() * 2 - 1));
    }

    /**
     * Calculate early ball skills
     */
    calculateEarlyBallSkills(genetics, environment) {
        let ballSkills = genetics.athletic.reactionTime * 5;
        
        // Environmental bonuses
        if (environment.home.sportsEquipment.balls > 3) ballSkills += 1;
        if (environment.parents.athleticBackground.combined > 0.5) ballSkills += 2;
        if (environment.home.yardSize === 'large') ballSkills += 1;
        
        return Math.min(10, ballSkills);
    }

    /**
     * Generate parent profile
     */
    generateParentProfile(type) {
        return {
            age: 25 + Math.floor(Math.random() * 15),
            profession: this.generateProfession(),
            athleticHistory: this.generateParentAthletics(),
            education: this.generateEducationLevel(),
            personality: {
                supportive: Math.random() * 0.4 + 0.6,
                demanding: Math.random(),
                patient: Math.random(),
                athletic: Math.random()
            },
            involvement: Math.random() * 0.5 + 0.5, // 50-100% involvement
            healthStatus: 'good' // Assume good for simplicity
        };
    }

    /**
     * Generate family income based on parents
     */
    generateFamilyIncome() {
        const incomeRanges = [
            { range: 'low', min: 25000, max: 45000, probability: 0.3 },
            { range: 'middle', min: 45000, max: 85000, probability: 0.5 },
            { range: 'high', min: 85000, max: 150000, probability: 0.15 },
            { range: 'very_high', min: 150000, max: 300000, probability: 0.05 }
        ];

        const rand = Math.random();
        let cumulative = 0;
        
        for (const range of incomeRanges) {
            cumulative += range.probability;
            if (rand <= cumulative) {
                return {
                    category: range.range,
                    amount: range.min + Math.random() * (range.max - range.min),
                    stability: Math.random() * 0.3 + 0.7 // 70-100% stable
                };
            }
        }
        
        return incomeRanges[1]; // Default to middle
    }

    /**
     * Calculate relative age effect (birth month impact)
     */
    calculateRelativeAgeEffect() {
        const birthMonth = Math.floor(Math.random() * 12) + 1;
        const cutoffMonth = 9; // September cutoff common in many systems
        
        let relativeAge;
        if (birthMonth >= cutoffMonth) {
            relativeAge = (12 - birthMonth + cutoffMonth) / 12; // Older in age group
        } else {
            relativeAge = (birthMonth + 12 - cutoffMonth) / 12; // Younger in age group
        }
        
        return {
            birthMonth,
            relativeAge,
            advantage: relativeAge > 0.5 ? 'older' : 'younger',
            impact: Math.abs(relativeAge - 0.5) * 2 // 0-1 impact scale
        };
    }

    /**
     * Get childhood development summary
     */
    getChildhoodSummary() {
        return {
            familyEnvironment: this.familyEnvironment,
            developmentPhases: this.developmentPhases,
            earlyIndicators: this.calculateEarlyTalentIndicators(),
            personalityTraits: this.calculateEarlyPersonality(),
            physicalDevelopment: this.calculatePhysicalSummary(),
            socialDevelopment: this.calculateSocialSummary(),
            recommendations: this.generateEarlyRecommendations()
        };
    }

    /**
     * Calculate early talent indicators
     */
    calculateEarlyTalentIndicators() {
        const genetics = this.geneticsSystem.dnaProfile;
        const phases = this.developmentPhases;
        
        return {
            athleticPotential: (genetics.athletic.fastTwitchFibers + genetics.athletic.powerOutput) / 2,
            coordinationLevel: phases.ages_4_to_6?.motorSkills.coordinationComplexity || 5,
            competitiveNature: genetics.mental.competitiveDrive,
            learningSpeed: genetics.mental.learningSpeed,
            socialLeadership: phases.ages_2_to_4?.socialDevelopment.leadershipSigns || false,
            ballAffinity: phases.ages_4_to_6?.motorSkills.ballControl || 5,
            attentionCapacity: genetics.mental.focusCapacity,
            physicalConfidence: phases.ages_4_to_6?.schoolReadiness.physicalConfidence || 5
        };
    }

    /**
     * Generate early recommendations for parents
     */
    generateEarlyRecommendations() {
        const indicators = this.calculateEarlyTalentIndicators();
        const recommendations = [];

        if (indicators.athleticPotential > 0.7) {
            recommendations.push({
                category: 'athletics',
                priority: 'high',
                action: 'Enroll in organized sports activities',
                reason: 'High athletic potential detected'
            });
        }

        if (indicators.coordinationLevel > 7) {
            recommendations.push({
                category: 'skill_development',
                priority: 'medium',
                action: 'Focus on ball skills and coordination games',
                reason: 'Excellent coordination development'
            });
        }

        if (indicators.socialLeadership) {
            recommendations.push({
                category: 'social',
                priority: 'medium',
                action: 'Encourage team activities and group leadership',
                reason: 'Natural leadership qualities observed'
            });
        }

        return recommendations;
    }
}

module.exports = ChildhoodDevelopmentSystem;