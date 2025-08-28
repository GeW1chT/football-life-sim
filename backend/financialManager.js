// backend/financialManager.js

class FinancialManager {
    constructor() {
        this.player = null;
        this.contracts = [];
        this.sponsorships = [];
        this.investments = [];
        this.expenses = [];
        this.taxes = [];
        this.manager = null;
        this.financialAdvisor = null;
    }

    /**
     * Initialize financial system for player
     */
    initialize(playerData) {
        this.player = playerData;
        this.initializeBasicContract();
        this.initializeExpenses();
        this.initializeSponsorshipOpportunities();
        this.initializeManagerOptions();
        this.initializeWealthProtection();
        this.initializeInvestmentStructures();
    }

    /**
     * Initialize basic contract
     */
    initializeBasicContract() {
        const playerLevel = this.player.attributes?.overall || 75;
        let baseSalary = 50000; // Weekly salary

        // Calculate salary based on player level and league
        if (playerLevel >= 90) baseSalary = 300000;
        else if (playerLevel >= 85) baseSalary = 200000;
        else if (playerLevel >= 80) baseSalary = 150000;
        else if (playerLevel >= 75) baseSalary = 100000;
        else if (playerLevel >= 70) baseSalary = 75000;

        this.contracts.push({
            id: 'initial_contract',
            type: 'playing_contract',
            club: this.player.team,
            weeklySalary: baseSalary,
            signingBonus: baseSalary * 10,
            goalBonus: 5000,
            assistBonus: 3000,
            cleanSheetBonus: 2000,
            appearanceBonus: 1000,
            startDate: new Date(),
            endDate: new Date(new Date().getFullYear() + 3, 5, 30),
            releaseClause: baseSalary * 500,
            status: 'active'
        });
    }

    /**
     * Initialize living expenses
     */
    initializeExpenses() {
        this.expenses = [
            {
                type: 'housing',
                amount: 5000,
                frequency: 'weekly',
                description: 'Rent/Mortgage',
                category: 'essential',
                automatic: true
            },
            {
                type: 'food',
                amount: 800,
                frequency: 'weekly',
                description: 'Food & Dining',
                category: 'essential',
                automatic: true
            },
            {
                type: 'transport',
                amount: 300,
                frequency: 'weekly',
                description: 'Transport & Fuel',
                category: 'essential',
                automatic: true
            },
            {
                type: 'utilities',
                amount: 400,
                frequency: 'weekly',
                description: 'Utilities & Bills',
                category: 'essential',
                automatic: true
            },
            {
                type: 'insurance',
                amount: 2000,
                frequency: 'weekly',
                description: 'Health & Career Insurance',
                category: 'important',
                automatic: true
            },
            {
                type: 'training',
                amount: 1500,
                frequency: 'weekly',
                description: 'Personal Training & Nutrition',
                category: 'career',
                automatic: true
            }
        ];
    }

    /**
     * Initialize sponsorship opportunities
     */
    initializeSponsorshipOpportunities() {
        const playerLevel = this.player.attributes?.overall || 75;
        const marketValue = this.player.marketValue || 1000000;
        
        const sponsorships = [
            {
                id: 'nike_deal',
                brand: 'Nike',
                type: 'apparel',
                weeklyAmount: Math.floor(marketValue * 0.001),
                duration: 104, // 2 years in weeks
                requirements: {
                    minRating: 75,
                    minAppearances: 20,
                    noCompetitor: true
                },
                benefits: {
                    money: true,
                    equipment: true,
                    marketing: true
                },
                status: 'available'
            },
            {
                id: 'adidas_deal',
                brand: 'Adidas',
                type: 'apparel',
                weeklyAmount: Math.floor(marketValue * 0.0012),
                duration: 156, // 3 years in weeks
                requirements: {
                    minRating: 78,
                    minAppearances: 25,
                    noCompetitor: true
                },
                benefits: {
                    money: true,
                    equipment: true,
                    marketing: true,
                    signature_boot: playerLevel >= 85
                },
                status: 'available'
            },
            {
                id: 'energy_drink',
                brand: 'RedBull',
                type: 'beverage',
                weeklyAmount: Math.floor(marketValue * 0.0008),
                duration: 52, // 1 year
                requirements: {
                    minRating: 70,
                    socialMedia: 10000 // followers
                },
                benefits: {
                    money: true,
                    events: true
                },
                status: 'available'
            },
            {
                id: 'car_deal',
                brand: 'BMW',
                type: 'automotive',
                weeklyAmount: 0,
                duration: 52,
                requirements: {
                    minRating: 80,
                    minMarketValue: 5000000
                },
                benefits: {
                    freeCar: true,
                    marketing: true
                },
                status: 'available'
            }
        ];

        this.sponsorships = sponsorships;
    }

    /**
     * Initialize wealth protection strategies
     */
    initializeWealthProtection() {
        this.wealthProtection = {
            insurance: {
                lifeInsurance: {
                    available: [
                        {
                            id: 'term_life_basic',
                            type: 'Term Life Insurance',
                            coverage: 1000000,
                            monthlyPremium: 200,
                            benefits: ['Family protection', 'Estate planning', 'Tax benefits']
                        },
                        {
                            id: 'whole_life_premium',
                            type: 'Whole Life Insurance', 
                            coverage: 5000000,
                            monthlyPremium: 1500,
                            benefits: ['Wealth transfer', 'Investment component', 'Tax advantages']
                        },
                        {
                            id: 'universal_life',
                            type: 'Universal Life Insurance',
                            coverage: 10000000,
                            monthlyPremium: 3500,
                            benefits: ['Flexible premiums', 'Investment growth', 'Estate planning']
                        }
                    ],
                    owned: []
                },
                disabilityCoverage: {
                    available: [
                        {
                            id: 'career_ending_insurance',
                            type: 'Career-Ending Injury Insurance',
                            coverage: 10000000,
                            monthlyPremium: 3000,
                            benefits: ['Income protection', 'Lifestyle maintenance', 'Family security']
                        },
                        {
                            id: 'partial_disability',
                            type: 'Partial Disability Coverage',
                            coverage: 5000000,
                            monthlyPremium: 1800,
                            benefits: ['Reduced capacity protection', 'Skill deterioration coverage']
                        }
                    ],
                    owned: []
                },
                liabilityInsurance: {
                    available: [
                        {
                            id: 'personal_liability',
                            type: 'Personal Liability Insurance',
                            coverage: 50000000,
                            monthlyPremium: 2500,
                            benefits: ['Lawsuit protection', 'Asset defense', 'Reputation management']
                        },
                        {
                            id: 'professional_liability',
                            type: 'Professional Liability Coverage',
                            coverage: 25000000,
                            monthlyPremium: 1500,
                            benefits: ['Career mistake protection', 'Contract disputes', 'Media liability']
                        }
                    ],
                    owned: []
                },
                propertyInsurance: {
                    available: [
                        {
                            id: 'luxury_property',
                            type: 'Luxury Property Insurance',
                            coverage: 20000000,
                            monthlyPremium: 4000,
                            benefits: ['High-value coverage', 'Art & jewelry', 'Global protection']
                        },
                        {
                            id: 'business_property',
                            type: 'Business Property Insurance',
                            coverage: 15000000,
                            monthlyPremium: 2800,
                            benefits: ['Commercial coverage', 'Equipment protection', 'Business interruption']
                        }
                    ],
                    owned: []
                },
                umbrellaPolicy: {
                    available: [
                        {
                            id: 'umbrella_basic',
                            type: 'Basic Umbrella Policy',
                            coverage: 100000000,
                            monthlyPremium: 5000,
                            benefits: ['Extended coverage', 'Maximum protection', 'Peace of mind']
                        },
                        {
                            id: 'umbrella_premium',
                            type: 'Premium Umbrella Policy',
                            coverage: 250000000,
                            monthlyPremium: 12000,
                            benefits: ['Ultra-high coverage', 'Global protection', 'Crisis management']
                        }
                    ],
                    owned: []
                },
                internationalCoverage: {
                    available: [
                        {
                            id: 'global_coverage',
                            type: 'Global Protection Plan',
                            coverage: 75000000,
                            monthlyPremium: 6000,
                            benefits: ['Worldwide coverage', 'Multi-jurisdiction', 'Travel protection']
                        }
                    ],
                    owned: []
                },
                careerInsurance: {
                    available: [
                        {
                            id: 'skill_protection',
                            type: 'Football Skill Protection',
                            coverage: 50000000,
                            monthlyPremium: 8000,
                            benefits: ['Technical ability coverage', 'Performance guarantee', 'Talent preservation']
                        },
                        {
                            id: 'contract_protection',
                            type: 'Contract Value Protection',
                            coverage: 30000000,
                            monthlyPremium: 5500,
                            benefits: ['Deal protection', 'Transfer insurance', 'Opportunity coverage']
                        }
                    ],
                    owned: []
                },
                keyPersonInsurance: {
                    available: [
                        {
                            id: 'business_key_person',
                            type: 'Key Person Business Insurance',
                            coverage: 40000000,
                            monthlyPremium: 4500,
                            benefits: ['Business continuity', 'Partner protection', 'Investor confidence']
                        }
                    ],
                    owned: []
                }
            },
            assetProtection: {
                trustStructures: {
                    available: [
                        {
                            id: 'revocable_trust',
                            type: 'Revocable Living Trust',
                            setupCost: 25000,
                            annualCost: 5000,
                            benefits: ['Probate avoidance', 'Privacy protection', 'Flexibility']
                        },
                        {
                            id: 'irrevocable_trust',
                            type: 'Irrevocable Life Insurance Trust',
                            setupCost: 50000,
                            annualCost: 15000,
                            benefits: ['Estate tax reduction', 'Asset protection', 'Generation-skipping']
                        },
                        {
                            id: 'offshore_trust',
                            type: 'Offshore Asset Protection Trust',
                            setupCost: 150000,
                            annualCost: 75000,
                            benefits: ['Maximum protection', 'Tax efficiency', 'Privacy enhancement']
                        }
                    ],
                    owned: []
                },
                entities: {
                    available: [
                        {
                            id: 'llc_structure',
                            type: 'Limited Liability Company',
                            setupCost: 15000,
                            annualCost: 8000,
                            benefits: ['Personal separation', 'Tax flexibility', 'Operational ease']
                        },
                        {
                            id: 'family_office',
                            type: 'Family Office Structure',
                            setupCost: 500000,
                            annualCost: 200000,
                            benefits: ['Comprehensive management', 'Multi-generational', 'Professional oversight']
                        }
                    ],
                    owned: []
                }
            }
        };
        
        // Initialize lifestyle management
        this.initializeLifestyleManagement();
        
        // Initialize charitable foundation options
        this.initializeCharitableOptions();
    }
    
    /**
     * Initialize lifestyle management system
     */
    initializeLifestyleManagement() {
        this.lifestyleManagement = {
            housing: {
                primaryResidence: {
                    available: [
                        {
                            id: 'luxury_penthouse',
                            type: 'Luxury Penthouse',
                            cost: 5000000,
                            monthlyMaintenance: 15000,
                            features: ['Security systems', 'Smart home', 'Gym', 'Entertainment room'],
                            location: 'City Center',
                            prestigeValue: 40
                        },
                        {
                            id: 'private_estate',
                            type: 'Private Estate',
                            cost: 12000000,
                            monthlyMaintenance: 35000,
                            features: ['Gated community', 'Tennis court', 'Pool', 'Guest house'],
                            location: 'Exclusive Suburbs',
                            prestigeValue: 70
                        },
                        {
                            id: 'waterfront_mansion',
                            type: 'Waterfront Mansion',
                            cost: 25000000,
                            monthlyMaintenance: 60000,
                            features: ['Private beach', 'Yacht dock', 'Helicopter pad', 'Wine cellar'],
                            location: 'Coastal Premium',
                            prestigeValue: 100
                        }
                    ],
                    owned: null
                },
                staff: {
                    available: [
                        {
                            id: 'housekeeper',
                            type: 'Professional Housekeeper',
                            monthlyCost: 3500,
                            benefits: ['Daily cleaning', 'Organization', 'Laundry service']
                        },
                        {
                            id: 'private_chef',
                            type: 'Private Chef',
                            monthlyCost: 8000,
                            benefits: ['Personalized nutrition', 'Meal planning', 'Special events']
                        },
                        {
                            id: 'security_team',
                            type: 'Personal Security',
                            monthlyCost: 15000,
                            benefits: ['24/7 protection', 'Family safety', 'Threat assessment']
                        },
                        {
                            id: 'personal_assistant',
                            type: 'Personal Assistant',
                            monthlyCost: 6000,
                            benefits: ['Schedule management', 'Travel planning', 'Administrative support']
                        },
                        {
                            id: 'groundskeeper',
                            type: 'Groundskeeper',
                            monthlyCost: 4000,
                            benefits: ['Garden maintenance', 'Pool care', 'Property upkeep']
                        }
                    ],
                    hired: []
                }
            },
            transportation: {
                dailyVehicles: {
                    available: [
                        {
                            id: 'luxury_sedan',
                            type: 'Mercedes S-Class',
                            cost: 150000,
                            monthlyMaintenance: 1200,
                            features: ['Comfort', 'Security', 'Efficiency']
                        },
                        {
                            id: 'electric_luxury',
                            type: 'Tesla Model S Plaid',
                            cost: 130000,
                            monthlyMaintenance: 800,
                            features: ['Eco-friendly', 'Technology', 'Performance']
                        }
                    ],
                    owned: []
                },
                luxuryCollection: {
                    available: [
                        {
                            id: 'ferrari_collection',
                            type: 'Ferrari Collection',
                            cost: 2000000,
                            monthlyMaintenance: 8000,
                            features: ['Status symbol', 'Investment potential', 'Track days']
                        },
                        {
                            id: 'classic_cars',
                            type: 'Classic Car Collection',
                            cost: 1500000,
                            monthlyMaintenance: 5000,
                            features: ['Historical value', 'Appreciation', 'Cultural significance']
                        }
                    ],
                    owned: []
                },
                professionalTransport: {
                    available: [
                        {
                            id: 'private_driver',
                            type: 'Professional Chauffeur',
                            monthlyCost: 5000,
                            benefits: ['Convenience', 'Safety', 'Productivity']
                        },
                        {
                            id: 'helicopter_service',
                            type: 'Helicopter Transport',
                            monthlyCost: 20000,
                            benefits: ['Time saving', 'Traffic avoidance', 'Prestige']
                        }
                    ],
                    subscribed: []
                }
            },
            personalServices: {
                healthWellness: {
                    available: [
                        {
                            id: 'personal_trainer',
                            type: 'Elite Personal Trainer',
                            monthlyCost: 4000,
                            benefits: ['Fitness optimization', 'Injury prevention', 'Performance enhancement']
                        },
                        {
                            id: 'nutritionist',
                            type: 'Sports Nutritionist',
                            monthlyCost: 2500,
                            benefits: ['Meal planning', 'Supplement guidance', 'Performance fuel']
                        },
                        {
                            id: 'massage_therapist',
                            type: 'Massage Therapist',
                            monthlyCost: 1800,
                            benefits: ['Recovery assistance', 'Stress relief', 'Injury prevention']
                        },
                        {
                            id: 'mental_health_coach',
                            type: 'Sports Psychologist',
                            monthlyCost: 3000,
                            benefits: ['Performance mindset', 'Stress management', 'Mental resilience']
                        }
                    ],
                    hired: []
                },
                imageManagement: {
                    available: [
                        {
                            id: 'personal_stylist',
                            type: 'Fashion Stylist',
                            monthlyCost: 3500,
                            benefits: ['Image enhancement', 'Event preparation', 'Brand consistency']
                        },
                        {
                            id: 'pr_specialist',
                            type: 'PR Specialist',
                            monthlyCost: 8000,
                            benefits: ['Media management', 'Crisis control', 'Brand building']
                        },
                        {
                            id: 'photographer',
                            type: 'Personal Photographer',
                            monthlyCost: 2000,
                            benefits: ['Professional photos', 'Social media content', 'Brand imagery']
                        }
                    ],
                    hired: []
                }
            }
        };
    }
    
    /**
     * Initialize charitable foundation options
     */
    initializeCharitableOptions() {
        this.charitableFoundation = {
            establishment: {
                available: [
                    {
                        id: 'basic_foundation',
                        type: 'Private Foundation',
                        setupCost: 100000,
                        minimumAnnualGiving: 50000,
                        benefits: ['Tax deduction', 'Legacy building', 'Social impact'],
                        focusAreas: ['Youth development', 'Education', 'Sports access']
                    },
                    {
                        id: 'family_foundation',
                        type: 'Family Foundation',
                        setupCost: 500000,
                        minimumAnnualGiving: 250000,
                        benefits: ['Multi-generational', 'Family engagement', 'Perpetual impact'],
                        focusAreas: ['Community development', 'Health', 'Education', 'Sports']
                    },
                    {
                        id: 'global_foundation',
                        type: 'Global Impact Foundation',
                        setupCost: 2000000,
                        minimumAnnualGiving: 1000000,
                        benefits: ['International reach', 'Maximum impact', 'Global recognition'],
                        focusAreas: ['Global health', 'Poverty alleviation', 'Education access', 'Youth sports']
                    }
                ],
                established: null
            },
            programs: {
                youthDevelopment: {
                    available: [
                        {
                            id: 'soccer_academy',
                            name: 'Youth Soccer Academy',
                            annualCost: 200000,
                            impact: 'High',
                            beneficiaries: 100,
                            description: 'Free soccer training for underprivileged youth'
                        },
                        {
                            id: 'scholarship_program',
                            name: 'Educational Scholarships',
                            annualCost: 300000,
                            impact: 'High',
                            beneficiaries: 50,
                            description: 'University scholarships for talented students'
                        }
                    ],
                    active: []
                },
                healthInitiatives: {
                    available: [
                        {
                            id: 'fitness_program',
                            name: 'Community Fitness Centers',
                            annualCost: 150000,
                            impact: 'Medium',
                            beneficiaries: 500,
                            description: 'Free fitness facilities in underserved areas'
                        },
                        {
                            id: 'nutrition_education',
                            name: 'Nutrition Education Program',
                            annualCost: 100000,
                            impact: 'Medium',
                            beneficiaries: 1000,
                            description: 'Healthy eating education in schools'
                        }
                    ],
                    active: []
                }
            }
        };
    }
    
    /**
     * Initialize investment structures
     */
    initializeInvestmentStructures() {
        this.investmentStructures = {
            portfolios: {
                conservative: {
                    name: 'Conservative Growth Portfolio',
                    riskLevel: 'low',
                    expectedReturn: 0.06,
                    minimumInvestment: 100000
                },
                aggressive: {
                    name: 'Aggressive Growth Portfolio',
                    riskLevel: 'high', 
                    expectedReturn: 0.12,
                    minimumInvestment: 500000
                }
            },
            alternatives: {
                realEstate: {
                    available: [
                        {
                            id: 'residential_rental',
                            type: 'Residential Rental Properties',
                            minimumInvestment: 500000,
                            expectedReturn: 0.08
                        },
                        {
                            id: 'commercial_real_estate', 
                            type: 'Commercial Real Estate',
                            minimumInvestment: 2000000,
                            expectedReturn: 0.10
                        }
                    ],
                    owned: []
                }
            }
        };
    }

    /**
     * Initialize manager options
     */
    initializeManagerOptions() {
        const managers = [
            {
                id: 'basic_agent',
                name: 'John Smith',
                experience: 'Beginner',
                commission: 5, // percentage
                skills: {
                    negotiation: 60,
                    marketing: 50,
                    connections: 40
                },
                specialties: ['contract_negotiation'],
                cost: 500, // weekly retainer
                available: true
            },
            {
                id: 'experienced_agent',
                name: 'Maria Rodriguez',
                experience: 'Experienced',
                commission: 8,
                skills: {
                    negotiation: 80,
                    marketing: 75,
                    connections: 70
                },
                specialties: ['transfer_deals', 'sponsorships'],
                cost: 2000,
                available: true,
                requirements: {
                    minMarketValue: 2000000
                }
            },
            {
                id: 'super_agent',
                name: 'Jorge Mendes Jr.',
                experience: 'World Class',
                commission: 12,
                skills: {
                    negotiation: 95,
                    marketing: 90,
                    connections: 95
                },
                specialties: ['mega_transfers', 'brand_building', 'crisis_management'],
                cost: 5000,
                available: true,
                requirements: {
                    minMarketValue: 10000000,
                    minRating: 85
                }
            }
        ];

        this.managerOptions = managers;
    }

    /**
     * Sign sponsorship deal
     */
    signSponsorshipDeal(sponsorshipId) {
        const sponsorship = this.sponsorships.find(s => s.id === sponsorshipId);
        if (!sponsorship || sponsorship.status !== 'available') {
            return { success: false, message: 'Sponsorship not available' };
        }

        // Check requirements
        const meetsRequirements = this.checkSponsorshipRequirements(sponsorship);
        if (!meetsRequirements.success) {
            return meetsRequirements;
        }

        // Check for conflicts
        const hasConflict = this.checkSponsorshipConflicts(sponsorship);
        if (hasConflict) {
            return { success: false, message: 'Conflicts with existing sponsorship' };
        }

        // Sign the deal
        sponsorship.status = 'active';
        sponsorship.startDate = new Date();
        sponsorship.endDate = new Date(Date.now() + (sponsorship.duration * 7 * 24 * 60 * 60 * 1000));
        sponsorship.totalEarned = 0;

        return {
            success: true,
            message: `Signed ${sponsorship.brand} deal worth €${sponsorship.weeklyAmount * sponsorship.duration}`,
            sponsorship: sponsorship
        };
    }

    /**
     * Hire manager
     */
    hireManager(managerId) {
        if (this.manager) {
            return { success: false, message: 'You already have a manager' };
        }

        const manager = this.managerOptions.find(m => m.id === managerId);
        if (!manager || !manager.available) {
            return { success: false, message: 'Manager not available' };
        }

        // Check requirements
        if (manager.requirements) {
            if (manager.requirements.minMarketValue && this.player.marketValue < manager.requirements.minMarketValue) {
                return { success: false, message: 'Market value too low for this manager' };
            }
            if (manager.requirements.minRating && this.player.attributes.overall < manager.requirements.minRating) {
                return { success: false, message: 'Rating too low for this manager' };
            }
        }

        this.manager = {
            ...manager,
            hireDate: new Date(),
            relationshipLevel: 50,
            dealsNegotiated: 0,
            successRate: 0
        };

        // Add weekly manager cost
        this.expenses.push({
            type: 'manager',
            amount: manager.cost,
            frequency: 'weekly',
            description: `Manager: ${manager.name}`,
            category: 'professional',
            automatic: true
        });

        return {
            success: true,
            message: `Hired ${manager.name} as your manager`,
            manager: this.manager
        };
    }

    /**
     * Negotiate contract renewal
     */
    negotiateContract(demandedSalary, demandedBonuses, contractLength) {
        if (!this.manager) {
            return { success: false, message: 'You need a manager to negotiate contracts' };
        }

        const currentContract = this.contracts.find(c => c.status === 'active');
        const playerValue = this.player.marketValue || 1000000;
        const playerRating = this.player.attributes?.overall || 75;

        // Calculate reasonable salary range
        const maxWeeklySalary = Math.floor(playerValue * 0.0005);
        const minWeeklySalary = Math.floor(currentContract.weeklySalary * 0.8);

        // Manager skill affects negotiation
        const managerBonus = this.manager.skills.negotiation / 100;
        const negotiationPower = 0.5 + (managerBonus * 0.5);

        const success = demandedSalary <= (maxWeeklySalary * negotiationPower);

        if (success) {
            // Create new contract
            const newContract = {
                id: `contract_${Date.now()}`,
                type: 'playing_contract',
                club: this.player.team,
                weeklySalary: demandedSalary,
                signingBonus: demandedSalary * 20,
                goalBonus: demandedBonuses.goal || 5000,
                assistBonus: demandedBonuses.assist || 3000,
                appearanceBonus: demandedBonuses.appearance || 1000,
                startDate: new Date(),
                endDate: new Date(new Date().getFullYear() + contractLength, 5, 30),
                releaseClause: demandedSalary * 400,
                status: 'active'
            };

            // Deactivate old contract
            currentContract.status = 'expired';
            this.contracts.push(newContract);

            // Manager gets commission
            const commission = newContract.signingBonus * (this.manager.commission / 100);
            this.player.money -= commission;

            return {
                success: true,
                message: `New contract signed! €${demandedSalary}/week for ${contractLength} years`,
                contract: newContract,
                managerCommission: commission
            };
        } else {
            return {
                success: false,
                message: 'Club rejected your demands. Lower your expectations or improve your performance.',
                maxOffered: Math.floor(maxWeeklySalary * negotiationPower)
            };
        }
    }

    /**
     * Process weekly financial activities
     */
    processWeeklyFinances() {
        // Return empty summary if player is not initialized
        if (!this.player) {
            return {
                week: new Date(),
                grossIncome: 0,
                expenses: 0,
                taxes: 0,
                netIncome: 0,
                totalWealth: 0,
                businessIncome: 0,
                sponsorshipIncome: 0,
                salaryIncome: 0
            };
        }

        let weeklyIncome = 0;
        let weeklyExpenses = 0;

        // Process salary
        const activeContract = this.contracts.find(c => c.status === 'active');
        if (activeContract) {
            weeklyIncome += activeContract.weeklySalary;
            
            // Add appearance bonus if played
            if (this.player.lastMatchPlayed) {
                weeklyIncome += activeContract.appearanceBonus;
            }
        }

        // Process sponsorships
        this.sponsorships.forEach(sponsorship => {
            if (sponsorship.status === 'active') {
                weeklyIncome += sponsorship.weeklyAmount;
                sponsorship.totalEarned += sponsorship.weeklyAmount;
                
                // Check if sponsorship expired
                if (new Date() > sponsorship.endDate) {
                    sponsorship.status = 'expired';
                }
            }
        });

        // Process business venture income
        const businessIncome = this.processBusinessVentures();
        weeklyIncome += businessIncome;

        // Process investment returns (simplified weekly calculation)
        this.investments.forEach(investment => {
            if (investment.status === 'active') {
                const weeklyReturn = (investment.investedAmount * (investment.expectedReturn / 100)) / 52;
                weeklyIncome += weeklyReturn;
                investment.totalReturns += weeklyReturn;
                investment.currentValue += weeklyReturn;
            }
        });

        // Process expenses
        this.expenses.forEach(expense => {
            if (expense.automatic && expense.frequency === 'weekly') {
                weeklyExpenses += expense.amount;
            }
        });

        // Calculate taxes (progressive tax system)
        const grossIncome = weeklyIncome;
        const taxRate = this.calculateTaxRate(grossIncome * 52); // Annual calculation
        const taxes = grossIncome * taxRate;
        weeklyExpenses += taxes;

        // Update player money
        const netIncome = weeklyIncome - weeklyExpenses;
        this.player.money = (this.player.money || 0) + netIncome;

        // Record financial summary
        const financialSummary = {
            week: new Date(),
            grossIncome: weeklyIncome,
            expenses: weeklyExpenses,
            taxes: taxes,
            netIncome: netIncome,
            totalWealth: this.player.money,
            businessIncome: businessIncome,
            sponsorshipIncome: this.sponsorships
                .filter(s => s.status === 'active')
                .reduce((sum, s) => sum + s.weeklyAmount, 0),
            salaryIncome: activeContract ? activeContract.weeklySalary : 0
        };

        this.addFinancialRecord(financialSummary);

        return financialSummary;
    }

    /**
     * Calculate tax rate based on income
     */
    calculateTaxRate(annualIncome) {
        if (annualIncome <= 50000) return 0.20;
        if (annualIncome <= 150000) return 0.30;
        if (annualIncome <= 500000) return 0.40;
        return 0.45; // Top earners
    }

    /**
     * Add financial record
     */
    addFinancialRecord(record) {
        if (!this.financialHistory) {
            this.financialHistory = [];
        }
        this.financialHistory.push(record);
        
        // Keep only last 52 weeks
        if (this.financialHistory.length > 52) {
            this.financialHistory = this.financialHistory.slice(-52);
        }
    }

    /**
     * Get financial dashboard data
     */
    getFinancialDashboard() {
        // Return empty data if player is not initialized
        if (!this.player) {
            return {
                currentWealth: 0,
                weeklyIncome: 0,
                weeklyExpenses: 0,
                netWeekly: 0,
                annualProjection: 0,
                activeContract: null,
                activeSponsorships: [],
                manager: null,
                availableSponsorships: [],
                financialHistory: []
            };
        }

        const activeContract = this.contracts.find(c => c.status === 'active');
        const activeSponsorships = this.sponsorships.filter(s => s.status === 'active');
        const weeklyExpenses = this.expenses.reduce((sum, exp) => {
            return exp.frequency === 'weekly' && exp.automatic ? sum + exp.amount : sum;
        }, 0);

        // Calculate annual projections
        const weeklyIncome = (activeContract?.weeklySalary || 0) + 
                           activeSponsorships.reduce((sum, s) => sum + s.weeklyAmount, 0);
        const annualIncome = weeklyIncome * 52;
        const annualExpenses = weeklyExpenses * 52;

        return {
            currentWealth: this.player.money || 0,
            weeklyIncome: weeklyIncome,
            weeklyExpenses: weeklyExpenses,
            netWeekly: weeklyIncome - weeklyExpenses,
            annualProjection: annualIncome - annualExpenses,
            activeContract: activeContract,
            activeSponsorships: activeSponsorships,
            manager: this.manager,
            availableSponsorships: this.sponsorships.filter(s => s.status === 'available'),
            financialHistory: this.financialHistory || []
        };
    }

    /**
     * Check sponsorship requirements
     */
    checkSponsorshipRequirements(sponsorship) {
        const playerRating = this.player.attributes?.overall || 75;
        const playerValue = this.player.marketValue || 1000000;

        if (sponsorship.requirements.minRating && playerRating < sponsorship.requirements.minRating) {
            return { success: false, message: 'Player rating too low' };
        }

        if (sponsorship.requirements.minMarketValue && playerValue < sponsorship.requirements.minMarketValue) {
            return { success: false, message: 'Market value too low' };
        }

        if (sponsorship.requirements.socialMedia && (!this.player.socialMediaFollowers || this.player.socialMediaFollowers < sponsorship.requirements.socialMedia)) {
            return { success: false, message: 'Not enough social media followers' };
        }

        return { success: true };
    }

    /**
     * Check for sponsorship conflicts
     */
    checkSponsorshipConflicts(newSponsorship) {
        const activeSponsorships = this.sponsorships.filter(s => s.status === 'active');
        
        return activeSponsorships.some(existing => {
            // Same type conflict (can't have two apparel deals)
            if (existing.type === newSponsorship.type && newSponsorship.requirements?.noCompetitor) {
                return true;
            }
            return false;
        });
    }

    /**
     * Purchase luxury item
     */
    purchaseLuxuryItem(itemType, itemCost, itemName) {
        if (this.player.money < itemCost) {
            return { success: false, message: 'Insufficient funds' };
        }

        this.player.money -= itemCost;

        // Add to expenses as one-time purchase
        this.expenses.push({
            type: itemType,
            amount: itemCost,
            frequency: 'one-time',
            description: itemName,
            category: 'luxury',
            automatic: false,
            date: new Date()
        });

        return {
            success: true,
            message: `Purchased ${itemName} for €${itemCost.toLocaleString()}`,
            remainingMoney: this.player.money
        };
    }

    /**
     * Investment opportunities
     */
    getInvestmentOpportunities() {
        return [
            // Traditional Investments
            {
                id: 'real_estate_fund',
                name: 'Premium Real Estate Fund',
                type: 'fund',
                minInvestment: 100000,
                expectedReturn: 8,
                risk: 'Low',
                description: 'Diversified real estate portfolio in prime locations',
                category: 'traditional'
            },
            {
                id: 'stock_portfolio',
                name: 'Diversified Stock Portfolio',
                type: 'stocks',
                minInvestment: 50000,
                expectedReturn: 12,
                risk: 'Medium',
                description: 'Professional managed stock portfolio',
                category: 'traditional'
            },
            {
                id: 'government_bonds',
                name: 'Government Bonds',
                type: 'bonds',
                minInvestment: 25000,
                expectedReturn: 4,
                risk: 'Very Low',
                description: 'Safe government-backed securities',
                category: 'traditional'
            },
            
            // Business Ventures
            {
                id: 'restaurant_chain',
                name: 'Premium Restaurant Chain',
                type: 'business',
                minInvestment: 500000,
                expectedReturn: 18,
                risk: 'Medium',
                description: 'Upscale restaurant chain in major cities',
                category: 'business',
                monthlyIncome: 25000,
                monthlyExpenses: 15000,
                prestigeGain: 15
            },
            {
                id: 'fashion_brand',
                name: 'Fashion & Lifestyle Brand',
                type: 'business',
                minInvestment: 300000,
                expectedReturn: 22,
                risk: 'High',
                description: 'Launch your own clothing and lifestyle brand',
                category: 'business',
                monthlyIncome: 20000,
                monthlyExpenses: 12000,
                prestigeGain: 25
            },
            {
                id: 'fitness_franchise',
                name: 'Fitness Center Franchise',
                type: 'business',
                minInvestment: 400000,
                expectedReturn: 16,
                risk: 'Medium',
                description: 'Chain of premium fitness centers',
                category: 'business',
                monthlyIncome: 22000,
                monthlyExpenses: 14000,
                prestigeGain: 10
            },
            {
                id: 'sports_academy',
                name: 'Youth Football Academy',
                type: 'academy',
                minInvestment: 800000,
                expectedReturn: 8,
                risk: 'Low',
                description: 'Establish a world-class youth football academy',
                category: 'sports',
                monthlyIncome: 18000,
                monthlyExpenses: 25000,
                prestigeGain: 35
            },
            
            // High-Tech Investments
            {
                id: 'tech_startup',
                name: 'Sports Tech Startup',
                type: 'startup',
                minInvestment: 750000,
                expectedReturn: 35,
                risk: 'Very High',
                description: 'Revolutionary sports performance tracking technology',
                category: 'technology',
                monthlyIncome: 35000,
                monthlyExpenses: 20000,
                prestigeGain: 30
            },
            {
                id: 'esports_team',
                name: 'Professional Esports Team',
                type: 'sports',
                minInvestment: 600000,
                expectedReturn: 25,
                risk: 'High',
                description: 'Own and manage a professional esports team',
                category: 'sports',
                monthlyIncome: 30000,
                monthlyExpenses: 18000,
                prestigeGain: 20
            },
            
            // Real Estate Development
            {
                id: 'luxury_real_estate',
                name: 'Luxury Real Estate Development',
                type: 'real_estate',
                minInvestment: 1500000,
                expectedReturn: 14,
                risk: 'Low',
                description: 'Develop luxury residential complexes',
                category: 'real_estate',
                monthlyIncome: 60000,
                monthlyExpenses: 25000,
                prestigeGain: 20
            },
            {
                id: 'commercial_properties',
                name: 'Commercial Property Portfolio',
                type: 'real_estate',
                minInvestment: 1000000,
                expectedReturn: 11,
                risk: 'Low',
                description: 'Prime commercial properties in business districts',
                category: 'real_estate',
                monthlyIncome: 45000,
                monthlyExpenses: 18000,
                prestigeGain: 15
            },
            
            // Alternative Investments
            {
                id: 'crypto_portfolio',
                name: 'Cryptocurrency Portfolio',
                type: 'crypto',
                minInvestment: 100000,
                expectedReturn: 40,
                risk: 'Very High',
                description: 'Diversified cryptocurrency investments with high volatility',
                category: 'alternative'
            },
            {
                id: 'art_collection',
                name: 'Fine Art Investment Collection',
                type: 'art',
                minInvestment: 200000,
                expectedReturn: 9,
                risk: 'Medium',
                description: 'Curated collection of appreciating artworks',
                category: 'alternative',
                prestigeGain: 40
            },
            {
                id: 'wine_investment',
                name: 'Vintage Wine Investment',
                type: 'luxury',
                minInvestment: 150000,
                expectedReturn: 12,
                risk: 'Medium',
                description: 'Premium vintage wines with strong appreciation potential',
                category: 'alternative',
                prestigeGain: 15
            }
        ];
    }

    /**
     * Get luxury items catalog
     */
    getLuxuryItems() {
        return [
            // Transportation
            {
                id: 'private_jet',
                name: 'Bombardier Global 7500',
                cost: 75000000,
                category: 'transportation',
                prestigeValue: 100,
                maintenanceCost: 150000,
                description: 'Ultimate luxury travel with global range'
            },
            {
                id: 'super_yacht',
                name: 'Custom Super Yacht (180ft)',
                cost: 50000000,
                category: 'leisure',
                prestigeValue: 90,
                maintenanceCost: 200000,
                description: 'Luxury floating palace for entertainment'
            },
            {
                id: 'luxury_car_collection',
                name: 'Luxury Car Collection',
                cost: 5000000,
                category: 'transportation',
                prestigeValue: 35,
                maintenanceCost: 25000,
                description: 'Ferrari, Lamborghini, McLaren collection'
            },
            
            // Real Estate
            {
                id: 'private_island',
                name: 'Private Island in Caribbean',
                cost: 25000000,
                category: 'real_estate',
                prestigeValue: 80,
                maintenanceCost: 50000,
                description: 'Your own tropical paradise'
            },
            {
                id: 'penthouse_collection',
                name: 'Global Penthouse Collection',
                cost: 15000000,
                category: 'real_estate',
                prestigeValue: 60,
                maintenanceCost: 40000,
                description: 'Penthouses in New York, London, Dubai'
            },
            {
                id: 'mountain_estate',
                name: 'Alpine Mountain Estate',
                cost: 8000000,
                category: 'real_estate',
                prestigeValue: 45,
                maintenanceCost: 20000,
                description: 'Private ski resort and mountain retreat'
            },
            
            // Investment & Collections
            {
                id: 'art_collection',
                name: 'Fine Art Masterpiece Collection',
                cost: 10000000,
                category: 'investment',
                prestigeValue: 70,
                maintenanceCost: 15000,
                description: 'Curated collection of museum-quality art'
            },
            {
                id: 'watch_collection',
                name: 'Luxury Watch Collection',
                cost: 3000000,
                category: 'luxury',
                prestigeValue: 30,
                maintenanceCost: 8000,
                description: 'Rare timepieces from Patek Philippe, Rolex'
            },
            {
                id: 'wine_cellar',
                name: 'World-Class Wine Cellar',
                cost: 1000000,
                category: 'luxury',
                prestigeValue: 25,
                maintenanceCost: 5000,
                description: 'Vintage wines from legendary vineyards'
            },
            
            // Entertainment & Lifestyle
            {
                id: 'private_stadium',
                name: 'Private Football Stadium',
                cost: 100000000,
                category: 'sports',
                prestigeValue: 150,
                maintenanceCost: 300000,
                description: 'Your own professional football stadium'
            },
            {
                id: 'nightclub_chain',
                name: 'Exclusive Nightclub Chain',
                cost: 20000000,
                category: 'business',
                prestigeValue: 50,
                maintenanceCost: 60000,
                description: 'Premium nightclubs in major cities'
            },
            {
                id: 'private_jet_fleet',
                name: 'Private Jet Fleet',
                cost: 200000000,
                category: 'transportation',
                prestigeValue: 200,
                maintenanceCost: 500000,
                description: 'Fleet of luxury private jets worldwide'
            }
        ];
    }

    /**
     * Get business ventures
     */
    getBusinessVentures() {
        return [
            {
                id: 'restaurant_empire',
                name: 'Global Restaurant Empire',
                description: 'Build a worldwide chain of upscale restaurants',
                initialCost: 2000000,
                monthlyIncome: 150000,
                monthlyExpenses: 80000,
                riskLevel: 'medium',
                prestigeGain: 40,
                timeToBreakEven: 18,
                category: 'hospitality',
                requirements: { minWealth: 5000000, minPrestige: 50 }
            },
            {
                id: 'fashion_empire',
                name: 'Fashion & Lifestyle Empire',
                description: 'Launch a global fashion and lifestyle brand',
                initialCost: 1500000,
                monthlyIncome: 120000,
                monthlyExpenses: 65000,
                riskLevel: 'high',
                prestigeGain: 60,
                timeToBreakEven: 15,
                category: 'fashion',
                requirements: { minWealth: 3000000, minPrestige: 40 }
            },
            {
                id: 'tech_conglomerate',
                name: 'Sports Technology Conglomerate',
                description: 'Build a technology empire in sports innovation',
                initialCost: 5000000,
                monthlyIncome: 300000,
                monthlyExpenses: 150000,
                riskLevel: 'high',
                prestigeGain: 80,
                timeToBreakEven: 24,
                category: 'technology',
                requirements: { minWealth: 10000000, minPrestige: 70 }
            },
            {
                id: 'real_estate_empire',
                name: 'Luxury Real Estate Empire',
                description: 'Develop premium properties worldwide',
                initialCost: 10000000,
                monthlyIncome: 500000,
                monthlyExpenses: 200000,
                riskLevel: 'low',
                prestigeGain: 50,
                timeToBreakEven: 30,
                category: 'real_estate',
                requirements: { minWealth: 20000000, minPrestige: 60 }
            },
            {
                id: 'entertainment_empire',
                name: 'Entertainment & Media Empire',
                description: 'Build a multimedia entertainment conglomerate',
                initialCost: 8000000,
                monthlyIncome: 400000,
                monthlyExpenses: 180000,
                riskLevel: 'medium',
                prestigeGain: 70,
                timeToBreakEven: 20,
                category: 'entertainment',
                requirements: { minWealth: 15000000, minPrestige: 80 }
            },
            {
                id: 'sports_conglomerate',
                name: 'Global Sports Conglomerate',
                description: 'Own sports teams, academies, and facilities worldwide',
                initialCost: 25000000,
                monthlyIncome: 800000,
                monthlyExpenses: 300000,
                riskLevel: 'low',
                prestigeGain: 100,
                timeToBreakEven: 36,
                category: 'sports',
                requirements: { minWealth: 50000000, minPrestige: 90 }
            }
        ];
    }

    /**
     * Purchase luxury item
     */
    purchaseLuxuryItem(itemId) {
        const item = this.getLuxuryItems().find(i => i.id === itemId);
        if (!item) {
            return { success: false, message: 'Luxury item not found' };
        }

        if (this.player.money < item.cost) {
            return { success: false, message: 'Insufficient funds' };
        }

        this.player.money -= item.cost;
        
        // Add prestige
        if (!this.player.prestige) this.player.prestige = 0;
        this.player.prestige += item.prestigeValue;

        // Add to player's luxury items
        if (!this.player.luxuryItems) this.player.luxuryItems = [];
        this.player.luxuryItems.push({
            ...item,
            purchaseDate: new Date(),
            currentValue: item.cost
        });

        // Add monthly maintenance cost
        if (item.maintenanceCost > 0) {
            this.expenses.push({
                type: 'luxury_maintenance',
                amount: item.maintenanceCost / 4.33, // Convert monthly to weekly
                frequency: 'weekly',
                description: `${item.name} Maintenance`,
                category: 'luxury',
                automatic: true,
                itemId: item.id
            });
        }

        return {
            success: true,
            message: `Purchased ${item.name} for €${item.cost.toLocaleString()}`,
            item: item,
            prestigeGained: item.prestigeValue,
            remainingMoney: this.player.money
        };
    }

    /**
     * Start business venture
     */
    startBusinessVenture(ventureId) {
        const venture = this.getBusinessVentures().find(v => v.id === ventureId);
        if (!venture) {
            return { success: false, message: 'Business venture not found' };
        }

        // Check requirements
        if (venture.requirements) {
            if (venture.requirements.minWealth && this.player.money < venture.requirements.minWealth) {
                return { success: false, message: 'Insufficient wealth for this venture' };
            }
            if (venture.requirements.minPrestige && (this.player.prestige || 0) < venture.requirements.minPrestige) {
                return { success: false, message: 'Insufficient prestige for this venture' };
            }
        }

        if (this.player.money < venture.initialCost) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Check if already owns this type of venture
        if (!this.player.businessVentures) this.player.businessVentures = [];
        const existingVenture = this.player.businessVentures.find(v => v.category === venture.category);
        if (existingVenture) {
            return { success: false, message: `You already own a ${venture.category} business` };
        }

        this.player.money -= venture.initialCost;
        
        // Add prestige
        if (!this.player.prestige) this.player.prestige = 0;
        this.player.prestige += venture.prestigeGain;

        // Add business venture
        this.player.businessVentures.push({
            ...venture,
            startDate: new Date(),
            totalProfit: 0,
            monthsOperating: 0
        });

        return {
            success: true,
            message: `Started ${venture.name} for €${venture.initialCost.toLocaleString()}`,
            venture: venture,
            prestigeGained: venture.prestigeGain,
            remainingMoney: this.player.money
        };
    }

    /**
     * Process business venture income
     */
    processBusinessVentures() {
        if (!this.player || !this.player.businessVentures || this.player.businessVentures.length === 0) {
            return 0;
        }

        let totalIncome = 0;
        this.player.businessVentures.forEach(venture => {
            const monthlyProfit = venture.monthlyIncome - venture.monthlyExpenses;
            const weeklyProfit = monthlyProfit / 4.33;
            
            // Apply risk factor (random fluctuation)
            let riskMultiplier = 1;
            if (venture.riskLevel === 'high') {
                riskMultiplier = 0.7 + Math.random() * 0.6; // 70% - 130%
            } else if (venture.riskLevel === 'medium') {
                riskMultiplier = 0.85 + Math.random() * 0.3; // 85% - 115%
            } else {
                riskMultiplier = 0.95 + Math.random() * 0.1; // 95% - 105%
            }
            
            const actualProfit = weeklyProfit * riskMultiplier;
            totalIncome += actualProfit;
            venture.totalProfit += actualProfit;
        });

        return totalIncome;
    }

    /**
     * Make investment
     */
    makeInvestment(investmentId, amount) {
        const opportunity = this.getInvestmentOpportunities().find(inv => inv.id === investmentId);
        if (!opportunity) {
            return { success: false, message: 'Investment opportunity not found' };
        }

        if (amount < opportunity.minInvestment) {
            return { success: false, message: `Minimum investment is €${opportunity.minInvestment.toLocaleString()}` };
        }

        if (this.player.money < amount) {
            return { success: false, message: 'Insufficient funds' };
        }

        this.player.money -= amount;

        const investment = {
            ...opportunity,
            investedAmount: amount,
            investmentDate: new Date(),
            currentValue: amount,
            totalReturns: 0,
            status: 'active'
        };

        this.investments.push(investment);

        return {
            success: true,
            message: `Invested €${amount.toLocaleString()} in ${opportunity.name}`,
            investment: investment
        };
    }
    
    /**
     * Purchase insurance policy
     */
    purchaseInsurance(insuranceId) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        // Find insurance in available options
        let insurance = null;
        let category = null;
        
        // Search through all insurance categories
        for (const [cat, insuranceData] of Object.entries(this.wealthProtection.insurance)) {
            const found = insuranceData.available.find(ins => ins.id === insuranceId);
            if (found) {
                insurance = found;
                category = cat;
                break;
            }
        }
        
        if (!insurance) {
            return { success: false, message: 'Insurance policy not found' };
        }
        
        // Check if player can afford the setup cost or first premium
        const cost = insurance.setupCost || insurance.monthlyPremium || 0;
        if (this.player.money < cost) {
            return { success: false, message: 'Insufficient funds' };
        }
        
        // Purchase insurance
        this.player.money -= cost;
        
        // Move from available to owned
        this.wealthProtection.insurance[category].owned.push({
            ...insurance,
            purchaseDate: new Date(),
            status: 'active'
        });
        
        return {
            success: true,
            message: `Successfully purchased ${insurance.type}`,
            insurance: insurance,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Create investment portfolio
     */
    createInvestmentPortfolio(portfolioType) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        const portfolio = this.investmentStructures.portfolios[portfolioType];
        if (!portfolio) {
            return { success: false, message: 'Portfolio type not found' };
        }
        
        if (this.player.money < portfolio.minimumInvestment) {
            return { success: false, message: 'Insufficient funds for minimum investment' };
        }
        
        // Create portfolio
        const portfolioId = 'portfolio_' + Date.now();
        const investment = {
            id: portfolioId,
            type: portfolioType,
            name: portfolio.name,
            amount: portfolio.minimumInvestment,
            purchaseDate: new Date(),
            expectedReturn: portfolio.expectedReturn,
            riskLevel: portfolio.riskLevel
        };
        
        // Deduct money
        this.player.money -= portfolio.minimumInvestment;
        
        // Add to investments
        if (!this.investments) this.investments = [];
        this.investments.push(investment);
        
        return {
            success: true,
            message: `Successfully created ${portfolio.name}`,
            portfolio: investment,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Establish asset protection structure
     */
    establishAssetProtection(protectionType) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        return {
            success: true,
            message: `Asset protection structure established`,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Purchase luxury residence
     */
    purchaseResidence(residenceId) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        const residence = this.lifestyleManagement.housing.primaryResidence.available.find(r => r.id === residenceId);
        if (!residence) {
            return { success: false, message: 'Residence not found' };
        }
        
        if (this.player.money < residence.cost) {
            return { success: false, message: 'Insufficient funds' };
        }
        
        // Check if already owns a primary residence
        if (this.lifestyleManagement.housing.primaryResidence.owned) {
            return { success: false, message: 'You already own a primary residence. Sell it first.' };
        }
        
        this.player.money -= residence.cost;
        
        // Add prestige
        if (!this.player.prestige) this.player.prestige = 0;
        this.player.prestige += residence.prestigeValue;
        
        // Set as owned
        this.lifestyleManagement.housing.primaryResidence.owned = {
            ...residence,
            purchaseDate: new Date(),
            currentValue: residence.cost
        };
        
        // Add monthly maintenance cost
        this.expenses.push({
            type: 'residence_maintenance',
            amount: residence.monthlyMaintenance / 4.33, // Convert to weekly
            frequency: 'weekly',
            description: `${residence.type} Maintenance`,
            category: 'luxury',
            automatic: true
        });
        
        return {
            success: true,
            message: `Purchased ${residence.type} for €${residence.cost.toLocaleString()}`,
            residence: residence,
            prestigeGained: residence.prestigeValue,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Hire lifestyle staff
     */
    hireStaff(staffId) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        const staff = this.lifestyleManagement.housing.staff.available.find(s => s.id === staffId);
        if (!staff) {
            return { success: false, message: 'Staff member not found' };
        }
        
        // Check if already hired this type of staff
        const alreadyHired = this.lifestyleManagement.housing.staff.hired.find(s => s.id === staffId);
        if (alreadyHired) {
            return { success: false, message: 'You already have this type of staff member' };
        }
        
        // Add to hired staff
        this.lifestyleManagement.housing.staff.hired.push({
            ...staff,
            hireDate: new Date(),
            satisfaction: 85
        });
        
        // Add weekly cost
        this.expenses.push({
            type: 'staff_salary',
            amount: staff.monthlyCost / 4.33, // Convert to weekly
            frequency: 'weekly',
            description: `${staff.type} Salary`,
            category: 'lifestyle',
            automatic: true,
            staffId: staff.id
        });
        
        return {
            success: true,
            message: `Hired ${staff.type} for €${staff.monthlyCost.toLocaleString()}/month`,
            staff: staff,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Hire personal services
     */
    hirePersonalService(serviceId, category) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        const serviceCategory = this.lifestyleManagement.personalServices[category];
        if (!serviceCategory) {
            return { success: false, message: 'Service category not found' };
        }
        
        const service = serviceCategory.available.find(s => s.id === serviceId);
        if (!service) {
            return { success: false, message: 'Service not found' };
        }
        
        // Check if already hired
        const alreadyHired = serviceCategory.hired.find(s => s.id === serviceId);
        if (alreadyHired) {
            return { success: false, message: 'You already have this service' };
        }
        
        // Add to hired services
        serviceCategory.hired.push({
            ...service,
            hireDate: new Date(),
            performance: 85
        });
        
        // Add weekly cost
        this.expenses.push({
            type: 'personal_service',
            amount: service.monthlyCost / 4.33, // Convert to weekly
            frequency: 'weekly',
            description: `${service.type} Fee`,
            category: 'lifestyle',
            automatic: true,
            serviceId: service.id
        });
        
        return {
            success: true,
            message: `Hired ${service.type} for €${service.monthlyCost.toLocaleString()}/month`,
            service: service,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Establish charitable foundation
     */
    establishFoundation(foundationType) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        if (this.charitableFoundation.establishment.established) {
            return { success: false, message: 'You already have a charitable foundation' };
        }
        
        const foundation = this.charitableFoundation.establishment.available.find(f => f.id === foundationType);
        if (!foundation) {
            return { success: false, message: 'Foundation type not found' };
        }
        
        if (this.player.money < foundation.setupCost) {
            return { success: false, message: 'Insufficient funds to establish foundation' };
        }
        
        this.player.money -= foundation.setupCost;
        
        // Add prestige for social responsibility
        if (!this.player.prestige) this.player.prestige = 0;
        this.player.prestige += 25;
        
        // Establish foundation
        this.charitableFoundation.establishment.established = {
            ...foundation,
            establishedDate: new Date(),
            totalDonated: 0,
            impactScore: 0
        };
        
        // Add minimum annual giving as expense
        this.expenses.push({
            type: 'charitable_giving',
            amount: foundation.minimumAnnualGiving / 52, // Convert to weekly
            frequency: 'weekly',
            description: `${foundation.type} Annual Giving`,
            category: 'charity',
            automatic: true
        });
        
        return {
            success: true,
            message: `Established ${foundation.type} for €${foundation.setupCost.toLocaleString()}`,
            foundation: foundation,
            prestigeGained: 25,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Launch charitable program
     */
    launchCharitableProgram(programId, category) {
        if (!this.player) {
            return { success: false, message: 'No player data available' };
        }
        
        if (!this.charitableFoundation.establishment.established) {
            return { success: false, message: 'You must establish a foundation first' };
        }
        
        const programCategory = this.charitableFoundation.programs[category];
        if (!programCategory) {
            return { success: false, message: 'Program category not found' };
        }
        
        const program = programCategory.available.find(p => p.id === programId);
        if (!program) {
            return { success: false, message: 'Program not found' };
        }
        
        // Check if already running this program
        const alreadyActive = programCategory.active.find(p => p.id === programId);
        if (alreadyActive) {
            return { success: false, message: 'This program is already active' };
        }
        
        // Check funding capacity
        const weeklyProgramCost = program.annualCost / 52;
        if (this.player.money < program.annualCost * 0.25) { // Require 3 months upfront
            return { success: false, message: 'Insufficient funds to launch this program' };
        }
        
        // Launch program
        programCategory.active.push({
            ...program,
            launchDate: new Date(),
            totalSpent: 0,
            peopleHelped: 0
        });
        
        // Add program cost as expense
        this.expenses.push({
            type: 'charitable_program',
            amount: weeklyProgramCost,
            frequency: 'weekly',
            description: `${program.name} Program`,
            category: 'charity',
            automatic: true,
            programId: program.id
        });
        
        // Add prestige for social impact
        if (!this.player.prestige) this.player.prestige = 0;
        this.player.prestige += 15;
        
        return {
            success: true,
            message: `Launched ${program.name} with annual budget of €${program.annualCost.toLocaleString()}`,
            program: program,
            prestigeGained: 15,
            remainingMoney: this.player.money
        };
    }
    
    /**
     * Get lifestyle management dashboard
     */
    getLifestyleDashboard() {
        if (!this.player) {
            return {
                housing: null,
                staff: [],
                services: [],
                monthlyLifestyleCosts: 0,
                prestigeLevel: 0
            };
        }
        
        const housingCosts = this.lifestyleManagement.housing.primaryResidence.owned ? 
            this.lifestyleManagement.housing.primaryResidence.owned.monthlyMaintenance : 0;
            
        const staffCosts = this.lifestyleManagement.housing.staff.hired.reduce((sum, staff) => 
            sum + staff.monthlyCost, 0);
            
        const serviceCosts = Object.values(this.lifestyleManagement.personalServices)
            .reduce((total, category) => {
                return total + category.hired.reduce((sum, service) => sum + service.monthlyCost, 0);
            }, 0);
        
        return {
            housing: this.lifestyleManagement.housing.primaryResidence.owned,
            staff: this.lifestyleManagement.housing.staff.hired,
            services: {
                healthWellness: this.lifestyleManagement.personalServices.healthWellness.hired,
                imageManagement: this.lifestyleManagement.personalServices.imageManagement.hired
            },
            monthlyLifestyleCosts: housingCosts + staffCosts + serviceCosts,
            prestigeLevel: this.player.prestige || 0
        };
    }
    
    /**
     * Get charitable foundation dashboard
     */
    getCharitableDashboard() {
        if (!this.player || !this.charitableFoundation.establishment.established) {
            return {
                foundation: null,
                programs: [],
                totalImpact: 0,
                annualGiving: 0
            };
        }
        
        const activePrograms = Object.values(this.charitableFoundation.programs)
            .reduce((all, category) => [...all, ...category.active], []);
            
        const annualGiving = this.charitableFoundation.establishment.established.minimumAnnualGiving +
            activePrograms.reduce((sum, program) => sum + program.annualCost, 0);
            
        const totalBeneficiaries = activePrograms.reduce((sum, program) => sum + program.beneficiaries, 0);
        
        return {
            foundation: this.charitableFoundation.establishment.established,
            programs: activePrograms,
            totalImpact: totalBeneficiaries,
            annualGiving: annualGiving
        };
    }
}

module.exports = FinancialManager;