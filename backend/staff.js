// backend/staff.js

class StaffManager {
    constructor() {
        this.currentStaff = [];
        this.availableStaff = [];
        this.staffBudget = 50000; // Monthly budget for staff
        this.totalStaffCost = 0;
    }

    /**
     * Initialize staff system with default data
     */
    initialize() {
        this.generateAvailableStaff();
        
        // Add some default staff
        this.currentStaff = [
            {
                id: 'default_coach_001',
                name: 'Roberto Silva',
                type: 'coach',
                specialization: 'Attacking',
                experience: 5,
                rating: 75,
                salary: 8000,
                hiredDate: new Date().toISOString().split('T')[0],
                contract: 24,
                bonus: {
                    development: 12,
                    morale: 8
                }
            }
        ];
        
        this.updateTotalCost();
    }

    /**
     * Generate available staff for hiring
     */
    generateAvailableStaff() {
        const staffTypes = ['coach', 'physiotherapist', 'scout', 'analyst'];
        const specializations = {
            coach: ['Attacking', 'Defensive', 'Tactical', 'Youth Development', 'Fitness'],
            physiotherapist: ['Injury Prevention', 'Recovery', 'Performance', 'Nutrition'],
            scout: ['Domestic', 'International', 'Youth', 'Tactical Analysis'],
            analyst: ['Performance', 'Tactical', 'Opposition', 'Data Science']
        };
        
        const firstNames = [
            'Antonio', 'Marco', 'Paolo', 'Giovanni', 'Roberto', 'Fabio', 'Andrea',
            'Maria', 'Elena', 'Francesca', 'Giulia', 'Sara', 'Valentina',
            'Carlos', 'Miguel', 'Fernando', 'Diego', 'Luis', 'Pablo',
            'Hans', 'Erik', 'Lars', 'Johan', 'Sven', 'Magnus',
            'Jean', 'Pierre', 'François', 'Claude', 'Michel',
            'James', 'David', 'Michael', 'John', 'Robert', 'William'
        ];
        
        const lastNames = [
            'Silva', 'Santos', 'Oliveira', 'Rossi', 'Bianchi', 'Romano',
            'Rodriguez', 'Martinez', 'Lopez', 'Garcia', 'Hernandez',
            'Schmidt', 'Mueller', 'Weber', 'Wagner', 'Becker',
            'Dubois', 'Martin', 'Bernard', 'Thomas', 'Robert',
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'
        ];

        this.availableStaff = [];
        
        for (let i = 0; i < 20; i++) {
            const type = staffTypes[Math.floor(Math.random() * staffTypes.length)];
            const typeSpecializations = specializations[type];
            const specialization = typeSpecializations[Math.floor(Math.random() * typeSpecializations.length)];
            const experience = Math.floor(Math.random() * 15) + 1;
            const rating = Math.floor(Math.random() * 40) + 60; // 60-99 rating
            
            // Calculate salary based on type, experience, and rating
            const baseSalary = this.getBaseSalary(type);
            const salary = baseSalary + (experience * 500) + (rating * 100);
            
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            
            this.availableStaff.push({
                id: 'available_' + (i + 1),
                name: `${firstName} ${lastName}`,
                type: type,
                specialization: specialization,
                experience: experience,
                rating: rating,
                salary: salary,
                signingBonus: Math.floor(salary * 0.5),
                available: true,
                description: this.generateStaffDescription(type, specialization, experience, rating)
            });
        }
    }

    /**
     * Get base salary by staff type
     */
    getBaseSalary(type) {
        const baseSalaries = {
            coach: 8000,
            physiotherapist: 6000,
            scout: 5000,
            analyst: 5500
        };
        return baseSalaries[type] || 5000;
    }

    /**
     * Generate staff description
     */
    generateStaffDescription(type, specialization, experience, rating) {
        const descriptions = {
            coach: {
                'Attacking': 'Specializes in developing offensive tactics and improving shooting accuracy. Focuses on creating goal-scoring opportunities.',
                'Defensive': 'Expert in defensive formations and improving defensive skills. Helps players become solid defenders.',
                'Tactical': 'Focuses on game strategy and tactical awareness development. Improves team coordination and positioning.',
                'Youth Development': 'Specializes in nurturing young talent and maximizing potential growth over time.',
                'Fitness': 'Improves stamina, speed, and overall physical conditioning. Prevents fatigue-related performance drops.'
            },
            physiotherapist: {
                'Injury Prevention': 'Reduces injury risk through specialized training programs and proper conditioning.',
                'Recovery': 'Accelerates recovery time from injuries and reduces fatigue between matches.',
                'Performance': 'Optimizes physical performance and endurance through advanced techniques.',
                'Nutrition': 'Provides nutrition guidance and meal planning for peak performance and recovery.'
            },
            scout: {
                'Domestic': 'Identifies promising talent in domestic leagues and provides detailed player reports.',
                'International': 'Scouts international markets for hidden gems and upcoming talents.',
                'Youth': 'Specializes in discovering young prospects with high potential for development.',
                'Tactical Analysis': 'Provides detailed opponent analysis and tactical insights for match preparation.'
            },
            analyst: {
                'Performance': 'Analyzes player performance data to identify improvement areas and track progress.',
                'Tactical': 'Studies game tactics, formations, and strategic approaches for optimal team performance.',
                'Opposition': 'Provides detailed analysis of upcoming opponents, their strengths and weaknesses.',
                'Data Science': 'Uses advanced analytics and machine learning for player development insights.'
            }
        };
        
        return descriptions[type][specialization] || 'Experienced professional in their field.';
    }

    /**
     * Hire a staff member
     */
    hireStaff(staffId, playerBudget) {
        const staff = this.availableStaff.find(s => s.id === staffId);
        if (!staff || !staff.available) {
            return { success: false, message: 'Staff member not available' };
        }

        const totalCost = staff.salary + staff.signingBonus;
        if (playerBudget < totalCost) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Check if already at staff limit
        if (this.currentStaff.length >= 8) {
            return { success: false, message: 'Maximum staff limit reached (8 members)' };
        }

        // Create new staff member
        const newStaff = {
            ...staff,
            id: 'staff_' + Date.now(),
            hiredDate: new Date().toISOString().split('T')[0],
            contract: 24, // 2 year contract in months
            bonus: this.generateStaffBonus(staff.type, staff.rating)
        };

        // Add to current staff
        this.currentStaff.push(newStaff);
        
        // Remove from available staff
        this.availableStaff = this.availableStaff.filter(s => s.id !== staffId);
        
        // Update total cost
        this.updateTotalCost();

        return { 
            success: true, 
            message: `Successfully hired ${newStaff.name}`,
            staff: newStaff,
            cost: totalCost
        };
    }

    /**
     * Fire a staff member
     */
    fireStaff(staffId) {
        const staffIndex = this.currentStaff.findIndex(s => s.id === staffId);
        if (staffIndex === -1) {
            return { success: false, message: 'Staff member not found' };
        }

        const staff = this.currentStaff[staffIndex];
        const severancePay = Math.floor(staff.salary * (staff.contract / 12)); // Remaining contract value
        
        // Remove from current staff
        this.currentStaff.splice(staffIndex, 1);
        
        // Update total cost
        this.updateTotalCost();

        return {
            success: true,
            message: `${staff.name} has been released`,
            severancePay: severancePay
        };
    }

    /**
     * Generate staff bonus effects
     */
    generateStaffBonus(type, rating) {
        const baseBonus = Math.floor(rating / 10);
        
        switch (type) {
            case 'coach':
                return {
                    development: baseBonus,
                    morale: Math.floor(baseBonus * 0.7),
                    training: Math.floor(baseBonus * 0.5)
                };
            case 'physiotherapist':
                return {
                    injuryPrevention: baseBonus + 5,
                    recovery: baseBonus + 10,
                    stamina: Math.floor(baseBonus * 0.8)
                };
            case 'scout':
                return {
                    scouting: baseBonus,
                    negotiation: Math.floor(baseBonus * 0.5),
                    marketKnowledge: Math.floor(baseBonus * 0.6)
                };
            case 'analyst':
                return {
                    analysis: baseBonus,
                    tactical: Math.floor(baseBonus * 0.8),
                    performance: Math.floor(baseBonus * 0.7)
                };
            default:
                return { general: baseBonus };
        }
    }

    /**
     * Calculate total development boost from all staff
     */
    calculateDevelopmentBoost() {
        let totalBoost = 0;
        
        this.currentStaff.forEach(staff => {
            // Each staff member contributes based on their rating
            const baseBoost = Math.floor(staff.rating / 10);
            totalBoost += baseBoost;
        });
        
        return Math.min(totalBoost, 50); // Cap at 50% boost
    }

    /**
     * Calculate injury prevention bonus
     */
    calculateInjuryPrevention() {
        let totalPrevention = 0;
        
        this.currentStaff.forEach(staff => {
            if (staff.type === 'physiotherapist' && staff.bonus.injuryPrevention) {
                totalPrevention += staff.bonus.injuryPrevention;
            }
        });
        
        return Math.min(totalPrevention, 80); // Cap at 80% injury prevention
    }

    /**
     * Calculate recovery speed bonus
     */
    calculateRecoveryBonus() {
        let totalRecovery = 0;
        
        this.currentStaff.forEach(staff => {
            if (staff.type === 'physiotherapist' && staff.bonus.recovery) {
                totalRecovery += staff.bonus.recovery;
            }
        });
        
        return Math.min(totalRecovery, 90); // Cap at 90% faster recovery
    }

    /**
     * Get staff effects for player development
     */
    getStaffEffects() {
        return {
            developmentBoost: this.calculateDevelopmentBoost(),
            injuryPrevention: this.calculateInjuryPrevention(),
            recoveryBonus: this.calculateRecoveryBonus(),
            moraleBoost: this.calculateMoraleBoost(),
            trainingEfficiency: this.calculateTrainingEfficiency()
        };
    }

    /**
     * Calculate morale boost from coaches
     */
    calculateMoraleBoost() {
        let totalMorale = 0;
        
        this.currentStaff.forEach(staff => {
            if (staff.type === 'coach' && staff.bonus.morale) {
                totalMorale += staff.bonus.morale;
            }
        });
        
        return Math.min(totalMorale, 30); // Cap at 30% morale boost
    }

    /**
     * Calculate training efficiency from all staff
     */
    calculateTrainingEfficiency() {
        let totalEfficiency = 0;
        
        this.currentStaff.forEach(staff => {
            if (staff.bonus.training) {
                totalEfficiency += staff.bonus.training;
            }
            if (staff.bonus.development) {
                totalEfficiency += staff.bonus.development * 0.5;
            }
        });
        
        return Math.min(totalEfficiency, 40); // Cap at 40% training efficiency
    }

    /**
     * Update total monthly staff cost
     */
    updateTotalCost() {
        this.totalStaffCost = this.currentStaff.reduce((total, staff) => total + staff.salary, 0);
    }

    /**
     * Process monthly staff payments and contract updates
     */
    processMonthlyUpdate() {
        this.currentStaff.forEach(staff => {
            // Reduce contract time
            staff.contract -= 1;
            
            // Check if contract is expiring soon (3 months)
            if (staff.contract === 3) {
                // Staff might ask for renewal or leave
                if (Math.random() < 0.3) {
                    staff.wantsRenewal = true;
                    staff.renewalDemands = {
                        salaryIncrease: Math.floor(staff.salary * 0.1), // 10% increase
                        contractLength: 24
                    };
                }
            }
            
            // If contract expired, staff leaves
            if (staff.contract <= 0) {
                staff.leaving = true;
            }
        });
        
        // Remove staff with expired contracts
        const leavingStaff = this.currentStaff.filter(staff => staff.leaving);
        this.currentStaff = this.currentStaff.filter(staff => !staff.leaving);
        
        this.updateTotalCost();
        
        return {
            totalCost: this.totalStaffCost,
            leavingStaff: leavingStaff,
            renewalRequests: this.currentStaff.filter(staff => staff.wantsRenewal)
        };
    }

    /**
     * Get all staff data
     */
    getAllStaffData() {
        return {
            currentStaff: this.currentStaff,
            availableStaff: this.availableStaff.filter(staff => staff.available),
            totalCost: this.totalStaffCost,
            budget: this.staffBudget,
            effects: this.getStaffEffects(),
            stats: {
                totalStaff: this.currentStaff.length,
                averageRating: this.currentStaff.length > 0 ? 
                    (this.currentStaff.reduce((sum, staff) => sum + staff.rating, 0) / this.currentStaff.length).toFixed(1) : 0,
                monthlyBudgetUsed: this.totalStaffCost,
                budgetRemaining: this.staffBudget - this.totalStaffCost
            }
        };
    }

    /**
     * Refresh available staff list (generate new candidates)
     */
    refreshAvailableStaff() {
        // Keep some existing staff but add new ones
        this.availableStaff = this.availableStaff.filter(() => Math.random() < 0.3); // Keep 30%
        
        // Generate new staff to fill up to 15-20 available
        const currentCount = this.availableStaff.length;
        const targetCount = 18;
        
        for (let i = currentCount; i < targetCount; i++) {
            this.generateSingleStaff(i);
        }
    }

    /**
     * Generate a single staff member
     */
    generateSingleStaff(index) {
        const staffTypes = ['coach', 'physiotherapist', 'scout', 'analyst'];
        const specializations = {
            coach: ['Attacking', 'Defensive', 'Tactical', 'Youth Development', 'Fitness'],
            physiotherapist: ['Injury Prevention', 'Recovery', 'Performance', 'Nutrition'],
            scout: ['Domestic', 'International', 'Youth', 'Tactical Analysis'],
            analyst: ['Performance', 'Tactical', 'Opposition', 'Data Science']
        };
        
        const firstNames = ['Antonio', 'Marco', 'Paolo', 'Maria', 'Elena', 'Carlos', 'Hans', 'Jean', 'James'];
        const lastNames = ['Silva', 'Santos', 'Rodriguez', 'Schmidt', 'Dubois', 'Smith', 'Johnson'];

        const type = staffTypes[Math.floor(Math.random() * staffTypes.length)];
        const typeSpecializations = specializations[type];
        const specialization = typeSpecializations[Math.floor(Math.random() * typeSpecializations.length)];
        const experience = Math.floor(Math.random() * 15) + 1;
        const rating = Math.floor(Math.random() * 40) + 60;
        
        const baseSalary = this.getBaseSalary(type);
        const salary = baseSalary + (experience * 500) + (rating * 100);
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        const newStaff = {
            id: 'available_new_' + Date.now() + '_' + index,
            name: `${firstName} ${lastName}`,
            type: type,
            specialization: specialization,
            experience: experience,
            rating: rating,
            salary: salary,
            signingBonus: Math.floor(salary * 0.5),
            available: true,
            description: this.generateStaffDescription(type, specialization, experience, rating)
        };
        
        this.availableStaff.push(newStaff);
    }
}

module.exports = StaffManager;