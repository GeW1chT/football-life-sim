// backend/facilities.js

class FacilityManager {
    constructor() {
        this.facilities = {
            training: {
                level: 1,
                maxLevel: 5,
                benefits: {
                    development: 5,
                    efficiency: 10
                },
                maintenanceCost: 2000,
                description: 'Basic training equipment and facilities for player development.'
            },
            stadium: {
                level: 1,
                maxLevel: 5,
                benefits: {
                    morale: 3,
                    revenue: 5,
                    capacity: 15000
                },
                maintenanceCost: 3000,
                description: 'Basic stadium with standard amenities for home matches.'
            },
            medical: {
                level: 1,
                maxLevel: 5,
                benefits: {
                    recovery: 10,
                    prevention: 5,
                    monitoring: 'Basic'
                },
                maintenanceCost: 1500,
                description: 'Basic medical equipment for injury treatment and prevention.'
            },
            analysis: {
                level: 1,
                maxLevel: 5,
                benefits: {
                    intelligence: 5,
                    tactical: 3,
                    dataQuality: 'Standard'
                },
                maintenanceCost: 1200,
                description: 'Basic performance analysis tools and video equipment.'
            }
        };
        
        this.equipment = {
            training: [],
            match: [],
            recovery: []
        };
        
        this.maintenance = {
            schedule: [],
            costs: {
                training: 2000,
                stadium: 3000,
                medical: 1500,
                analysis: 1200,
                total: 7700
            }
        };
        
        this.activeUpgrades = [];
        this.totalInvestment = 0;
    }

    /**
     * Initialize facility system with default data
     */
    initialize() {
        this.generateEquipment();
        this.generateMaintenanceSchedule();
        this.updateMaintenanceCosts();
    }

    /**
     * Generate available equipment
     */
    generateEquipment() {
        // Training Equipment
        this.equipment.training = [
            {
                id: 'training_eq_001',
                name: 'Advanced Treadmills',
                description: 'High-tech treadmills with speed and incline control for stamina training.',
                cost: 25000,
                maintenance: 500,
                benefits: { speed: 8, endurance: 12 },
                owned: false
            },
            {
                id: 'training_eq_002',
                name: 'Strength Training System',
                description: 'Complete weight training system for building muscle strength.',
                cost: 35000,
                maintenance: 700,
                benefits: { strength: 15, power: 10 },
                owned: false
            },
            {
                id: 'training_eq_003',
                name: 'Agility Ladder Set',
                description: 'Professional agility training equipment for footwork and coordination.',
                cost: 5000,
                maintenance: 100,
                benefits: { agility: 10, coordination: 8 },
                owned: true
            },
            {
                id: 'training_eq_004',
                name: 'Shooting Accuracy System',
                description: 'Electronic target system for improving shooting precision.',
                cost: 15000,
                maintenance: 300,
                benefits: { accuracy: 20, focus: 5 },
                owned: false
            }
        ];

        // Match Equipment
        this.equipment.match = [
            {
                id: 'match_eq_001',
                name: 'Professional Goal Posts',
                description: 'FIFA-standard goal posts with advanced net technology.',
                cost: 8000,
                maintenance: 200,
                benefits: { accuracy: 5, confidence: 3 },
                owned: true
            },
            {
                id: 'match_eq_002',
                name: 'Premium Match Balls',
                description: 'High-quality match balls that improve ball control and touch.',
                cost: 2000,
                maintenance: 50,
                benefits: { passing: 8, control: 10 },
                owned: false
            },
            {
                id: 'match_eq_003',
                name: 'Video Analysis Cameras',
                description: 'Multi-angle camera system for detailed match analysis.',
                cost: 45000,
                maintenance: 1000,
                benefits: { intelligence: 15, tactical: 12 },
                owned: false
            },
            {
                id: 'match_eq_004',
                name: 'Electronic Scoreboard',
                description: 'Digital scoreboard with advanced statistics display.',
                cost: 12000,
                maintenance: 300,
                benefits: { morale: 8, focus: 5 },
                owned: false
            }
        ];

        // Recovery Equipment
        this.equipment.recovery = [
            {
                id: 'recovery_eq_001',
                name: 'Ice Bath System',
                description: 'Professional ice bath setup for faster muscle recovery.',
                cost: 18000,
                maintenance: 400,
                benefits: { recovery: 25, stamina: 8 },
                owned: false
            },
            {
                id: 'recovery_eq_002',
                name: 'Massage Tables',
                description: 'High-quality massage tables for physiotherapy sessions.',
                cost: 6000,
                maintenance: 150,
                benefits: { recovery: 15, relaxation: 10 },
                owned: true
            },
            {
                id: 'recovery_eq_003',
                name: 'Hyperbaric Chamber',
                description: 'Advanced oxygen therapy chamber for enhanced recovery.',
                cost: 80000,
                maintenance: 2000,
                benefits: { recovery: 40, endurance: 15 },
                owned: false
            },
            {
                id: 'recovery_eq_004',
                name: 'Nutrition Supplements',
                description: 'Professional-grade supplements for optimal player nutrition.',
                cost: 3000,
                maintenance: 300,
                benefits: { recovery: 12, stamina: 10 },
                owned: false
            }
        ];
    }

    /**
     * Generate maintenance schedule
     */
    generateMaintenanceSchedule() {
        const tasks = [
            {
                facility: 'Training Center',
                task: 'Equipment calibration and safety check',
                dueDate: '2024-09-15',
                cost: 2500,
                urgency: 'medium'
            },
            {
                facility: 'Stadium',
                task: 'Pitch maintenance and irrigation system check',
                dueDate: '2024-09-10',
                cost: 5000,
                urgency: 'high'
            },
            {
                facility: 'Medical Center',
                task: 'Medical equipment certification renewal',
                dueDate: '2024-09-25',
                cost: 1800,
                urgency: 'low'
            },
            {
                facility: 'Analysis Center',
                task: 'Software updates and data backup',
                dueDate: '2024-09-12',
                cost: 800,
                urgency: 'medium'
            }
        ];

        this.maintenance.schedule = tasks;
    }

    /**
     * Upgrade a facility
     */
    upgradeFacility(facilityType, playerBudget) {
        const facility = this.facilities[facilityType];
        if (!facility) {
            return { success: false, message: 'Invalid facility type' };
        }

        if (facility.level >= facility.maxLevel) {
            return { success: false, message: 'Facility is already at maximum level' };
        }

        const upgradeInfo = this.getUpgradeCost(facilityType, facility.level);
        
        if (playerBudget < upgradeInfo.cost) {
            return { success: false, message: 'Insufficient funds for upgrade' };
        }

        // Check if facility is already being upgraded
        const existingUpgrade = this.activeUpgrades.find(u => u.facility === facilityType);
        if (existingUpgrade) {
            return { success: false, message: 'Facility is already being upgraded' };
        }

        // Start upgrade process
        const upgrade = {
            facility: facilityType,
            startWeek: Date.now(), // In real implementation, this would be game week
            completionWeek: Date.now() + (upgradeInfo.constructionTime * 7 * 24 * 60 * 60 * 1000),
            cost: upgradeInfo.cost,
            newLevel: facility.level + 1
        };

        this.activeUpgrades.push(upgrade);
        this.totalInvestment += upgradeInfo.cost;

        // For immediate completion in demo
        this.completeUpgrade(facilityType);

        return {
            success: true,
            message: `${this.formatFacilityName(facilityType)} upgrade started!`,
            cost: upgradeInfo.cost,
            completionTime: upgradeInfo.constructionTime
        };
    }

    /**
     * Complete facility upgrade
     */
    completeUpgrade(facilityType) {
        const facility = this.facilities[facilityType];
        const newLevel = facility.level + 1;

        // Update facility level and benefits
        facility.level = newLevel;
        const newBenefits = this.getFacilityBenefitsForLevel(facilityType, newLevel);
        facility.benefits = newBenefits.benefits;
        facility.maintenanceCost = newBenefits.maintenanceCost;
        facility.description = newBenefits.description;

        // Remove from active upgrades
        this.activeUpgrades = this.activeUpgrades.filter(u => u.facility !== facilityType);

        // Update maintenance costs
        this.updateMaintenanceCosts();

        return facility;
    }

    /**
     * Get upgrade cost for facility level
     */
    getUpgradeCost(facilityType, currentLevel) {
        const upgradeCosts = {
            training: {
                costs: [50000, 120000, 250000, 500000],
                constructionTime: [2, 3, 4, 6]
            },
            stadium: {
                costs: [100000, 300000, 750000, 1500000],
                constructionTime: [4, 6, 8, 12]
            },
            medical: {
                costs: [75000, 180000, 400000, 800000],
                constructionTime: [3, 4, 6, 8]
            },
            analysis: {
                costs: [60000, 150000, 350000, 700000],
                constructionTime: [2, 3, 5, 7]
            }
        };

        const facilityData = upgradeCosts[facilityType];
        const upgradeIndex = currentLevel - 1; // Array is 0-indexed

        return {
            cost: facilityData.costs[upgradeIndex],
            constructionTime: facilityData.constructionTime[upgradeIndex],
            additionalMaintenance: Math.floor(facilityData.costs[upgradeIndex] * 0.02) // 2% of upgrade cost
        };
    }

    /**
     * Get facility benefits for specific level
     */
    getFacilityBenefitsForLevel(facilityType, level) {
        const benefitsByLevel = {
            training: {
                benefits: [
                    { development: 5, efficiency: 10 },
                    { development: 10, efficiency: 20 },
                    { development: 18, efficiency: 35 },
                    { development: 30, efficiency: 50 },
                    { development: 45, efficiency: 75 }
                ],
                maintenanceCosts: [2000, 3000, 5500, 10000, 18000],
                descriptions: [
                    'Basic training equipment and facilities for player development.',
                    'Improved training equipment with better monitoring systems.',
                    'Advanced training center with specialized equipment.',
                    'State-of-the-art facility with cutting-edge technology.',
                    'World-class training complex with AI-powered systems.'
                ]
            },
            stadium: {
                benefits: [
                    { morale: 3, revenue: 5, capacity: 15000 },
                    { morale: 8, revenue: 12, capacity: 30000 },
                    { morale: 15, revenue: 25, capacity: 50000 },
                    { morale: 25, revenue: 40, capacity: 75000 },
                    { morale: 40, revenue: 60, capacity: 100000 }
                ],
                maintenanceCosts: [3000, 5000, 10000, 18000, 30000],
                descriptions: [
                    'Basic stadium with standard amenities for home matches.',
                    'Modern stadium with improved facilities and seating.',
                    'Premium stadium with luxury boxes and enhanced amenities.',
                    'Elite stadium with state-of-the-art facilities.',
                    'Iconic world-class stadium with cutting-edge technology.'
                ]
            },
            medical: {
                benefits: [
                    { recovery: 10, prevention: 5, monitoring: 'Basic' },
                    { recovery: 25, prevention: 15, monitoring: 'Advanced' },
                    { recovery: 45, prevention: 30, monitoring: 'Premium' },
                    { recovery: 70, prevention: 50, monitoring: 'Elite' },
                    { recovery: 100, prevention: 75, monitoring: 'World-Class' }
                ],
                maintenanceCosts: [1500, 2500, 4500, 8000, 15000],
                descriptions: [
                    'Basic medical equipment for injury treatment and prevention.',
                    'Advanced medical center with modern diagnostic equipment.',
                    'Premium medical facility with specialized treatment rooms.',
                    'Elite medical center with cutting-edge technology.',
                    'World-class medical complex with research capabilities.'
                ]
            },
            analysis: {
                benefits: [
                    { intelligence: 5, tactical: 3, dataQuality: 'Standard' },
                    { intelligence: 12, tactical: 8, dataQuality: 'Advanced' },
                    { intelligence: 22, tactical: 18, dataQuality: 'Premium' },
                    { intelligence: 35, tactical: 30, dataQuality: 'Elite' },
                    { intelligence: 50, tactical: 45, dataQuality: 'World-Class' }
                ],
                maintenanceCosts: [1200, 2200, 4000, 7500, 14000],
                descriptions: [
                    'Basic performance analysis tools and video equipment.',
                    'Advanced analysis center with AI-powered insights.',
                    'Premium analytics facility with real-time data processing.',
                    'Elite analysis center with predictive modeling.',
                    'World-class analytics complex with machine learning.'
                ]
            }
        };

        const facilityData = benefitsByLevel[facilityType];
        const index = level - 1;

        return {
            benefits: facilityData.benefits[index],
            maintenanceCost: facilityData.maintenanceCosts[index],
            description: facilityData.descriptions[index]
        };
    }

    /**
     * Purchase equipment
     */
    purchaseEquipment(equipmentId, playerBudget) {
        const equipment = this.findEquipmentById(equipmentId);
        if (!equipment) {
            return { success: false, message: 'Equipment not found' };
        }

        if (equipment.owned) {
            return { success: false, message: 'Equipment already owned' };
        }

        if (playerBudget < equipment.cost) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Purchase equipment
        equipment.owned = true;
        
        // Add to maintenance costs
        this.addEquipmentMaintenance(equipment);

        return {
            success: true,
            message: `Successfully purchased ${equipment.name}!`,
            cost: equipment.cost,
            equipment: equipment
        };
    }

    /**
     * Find equipment by ID
     */
    findEquipmentById(equipmentId) {
        const allEquipment = [
            ...this.equipment.training,
            ...this.equipment.match,
            ...this.equipment.recovery
        ];
        return allEquipment.find(item => item.id === equipmentId);
    }

    /**
     * Add equipment maintenance to costs
     */
    addEquipmentMaintenance(equipment) {
        // Determine equipment category
        let category = 'training';
        if (this.equipment.match.includes(equipment)) category = 'stadium';
        if (this.equipment.recovery.includes(equipment)) category = 'medical';

        this.maintenance.costs[category] += equipment.maintenance;
        this.updateMaintenanceCosts();
    }

    /**
     * Update total maintenance costs
     */
    updateMaintenanceCosts() {
        this.maintenance.costs.total = 
            this.maintenance.costs.training +
            this.maintenance.costs.stadium +
            this.maintenance.costs.medical +
            this.maintenance.costs.analysis;
    }

    /**
     * Get facility effects for player development
     */
    getFacilityEffects() {
        const effects = {
            developmentBoost: this.facilities.training.benefits.development,
            trainingEfficiency: this.facilities.training.benefits.efficiency,
            moraleBoost: this.facilities.stadium.benefits.morale,
            recoverySpeed: this.facilities.medical.benefits.recovery,
            injuryPrevention: this.facilities.medical.benefits.prevention,
            intelligenceBoost: this.facilities.analysis.benefits.intelligence,
            tacticalBonus: this.facilities.analysis.benefits.tactical
        };

        // Add equipment effects
        const ownedEquipment = this.getAllOwnedEquipment();
        ownedEquipment.forEach(equipment => {
            Object.keys(equipment.benefits).forEach(benefit => {
                if (effects[benefit + 'Boost']) {
                    effects[benefit + 'Boost'] += equipment.benefits[benefit];
                } else if (effects[benefit]) {
                    effects[benefit] += equipment.benefits[benefit];
                }
            });
        });

        return effects;
    }

    /**
     * Get all owned equipment
     */
    getAllOwnedEquipment() {
        const allEquipment = [
            ...this.equipment.training,
            ...this.equipment.match,
            ...this.equipment.recovery
        ];
        return allEquipment.filter(item => item.owned);
    }

    /**
     * Process weekly facility updates
     */
    processWeeklyUpdate() {
        // Check for completed upgrades
        const completedUpgrades = [];
        this.activeUpgrades.forEach(upgrade => {
            if (Date.now() >= upgrade.completionWeek) {
                this.completeUpgrade(upgrade.facility);
                completedUpgrades.push(upgrade);
            }
        });

        // Update maintenance schedule
        this.updateMaintenanceSchedule();

        return {
            completedUpgrades: completedUpgrades,
            maintenanceCost: this.maintenance.costs.total,
            facilityEffects: this.getFacilityEffects()
        };
    }

    /**
     * Update maintenance schedule
     */
    updateMaintenanceSchedule() {
        // Remove completed maintenance tasks
        const currentDate = new Date();
        this.maintenance.schedule = this.maintenance.schedule.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate > currentDate;
        });

        // Add new maintenance tasks if needed
        if (this.maintenance.schedule.length < 3) {
            this.generateAdditionalMaintenanceTasks();
        }
    }

    /**
     * Generate additional maintenance tasks
     */
    generateAdditionalMaintenanceTasks() {
        const facilityNames = ['Training Center', 'Stadium', 'Medical Center', 'Analysis Center'];
        const tasks = [
            'Routine equipment inspection',
            'Software updates and maintenance',
            'Safety system check',
            'Deep cleaning and sanitization',
            'Performance optimization',
            'Security system update'
        ];

        const newTask = {
            facility: facilityNames[Math.floor(Math.random() * facilityNames.length)],
            task: tasks[Math.floor(Math.random() * tasks.length)],
            dueDate: this.getRandomFutureDate(),
            cost: Math.floor(Math.random() * 3000) + 500,
            urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        };

        this.maintenance.schedule.push(newTask);
    }

    /**
     * Get random future date
     */
    getRandomFutureDate() {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 7); // 1-5 weeks ahead
        return futureDate.toISOString().split('T')[0];
    }

    /**
     * Format facility name
     */
    formatFacilityName(facilityType) {
        const names = {
            training: 'Training Center',
            stadium: 'Stadium',
            medical: 'Medical Center',
            analysis: 'Analysis Center'
        };
        return names[facilityType] || facilityType;
    }

    /**
     * Get all facility data
     */
    getAllFacilityData() {
        return {
            facilities: this.facilities,
            equipment: this.equipment,
            maintenance: this.maintenance,
            activeUpgrades: this.activeUpgrades,
            totalInvestment: this.totalInvestment,
            effects: this.getFacilityEffects()
        };
    }
}

module.exports = FacilityManager;