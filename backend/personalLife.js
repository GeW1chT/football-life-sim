// backend/personalLife.js

class PersonalLifeSystem {
    constructor() {
        this.player = null;
        this.lifestyle = {
            happiness: 70,
            stress: 30,
            energy: 80,
            social: 60,
            luxury: 20
        };
        this.properties = {};
        this.vehicles = {};
        this.relationships = {};
        this.activities = {};
        this.shopping = {};
        this.investments = {};
    }

    /**
     * Initialize personal life system for player
     */
    initialize(playerData) {
        this.player = playerData;
        this.initializeLifestyle();
        this.initializeRealEstate();
        this.initializeVehicles();
        this.initializeNightlife();
        this.initializeShopping();
        this.initializeRelationships();
        this.initializeInvestments();
    }

    /**
     * Initialize basic lifestyle metrics
     */
    initializeLifestyle() {
        const overall = this.player.attributes?.overall || 
                       Math.floor((Object.values(this.player.stats).reduce((a, b) => a + b, 0)) / Object.keys(this.player.stats).length);
        
        this.lifestyle = {
            happiness: 70,
            stress: 30,
            energy: 80,
            social: 60,
            luxury: Math.max(20, overall - 50),
            reputation: overall || 50,
            health: 85,
            mentalState: 'Balanced'
        };
    }

    /**
     * Real Estate System
     */
    initializeRealEstate() {
        this.properties = {
            owned: [],
            available: [
                {
                    id: 'starter_apartment',
                    name: 'Modern City Apartment',
                    type: 'apartment',
                    price: 150000,
                    monthlyMaintenance: 800,
                    location: 'City Center',
                    size: '2 Bedroom',
                    luxury: 3,
                    benefits: { happiness: 5, energy: 3 },
                    description: 'A modern apartment in the heart of the city with great amenities.'
                },
                {
                    id: 'family_house',
                    name: 'Suburban Family Home',
                    type: 'house',
                    price: 350000,
                    monthlyMaintenance: 1200,
                    location: 'Suburbs',
                    size: '4 Bedroom',
                    luxury: 5,
                    benefits: { happiness: 10, social: 5, stress: -5 },
                    description: 'Perfect family home with garden and peaceful neighborhood.'
                },
                {
                    id: 'luxury_villa',
                    name: 'Luxury Villa with Pool',
                    type: 'villa',
                    price: 800000,
                    monthlyMaintenance: 3000,
                    location: 'Elite District',
                    size: '6 Bedroom + Pool',
                    luxury: 8,
                    benefits: { happiness: 20, luxury: 15, social: 10 },
                    description: 'Exclusive villa with pool, gym, and stunning views.'
                },
                {
                    id: 'penthouse',
                    name: 'Downtown Penthouse',
                    type: 'penthouse',
                    price: 1200000,
                    monthlyMaintenance: 4500,
                    location: 'Downtown Skyline',
                    size: '5 Bedroom + Terrace',
                    luxury: 10,
                    benefits: { happiness: 25, luxury: 20, reputation: 10 },
                    description: 'Ultimate luxury living with panoramic city views.'
                },
                {
                    id: 'mansion',
                    name: 'Celebrity Mansion',
                    type: 'mansion',
                    price: 2500000,
                    monthlyMaintenance: 8000,
                    location: 'Beverly Hills',
                    size: '10 Bedroom Estate',
                    luxury: 15,
                    benefits: { happiness: 35, luxury: 30, reputation: 20, social: 15 },
                    description: 'Exclusive mansion where celebrities live. Ultimate prestige.'
                }
            ]
        };
    }

    /**
     * Vehicle System
     */
    initializeVehicles() {
        this.vehicles = {
            owned: [],
            garage: [], // For storing multiple vehicles
            available: [
                {
                    id: 'economy_car',
                    name: 'Toyota Corolla',
                    type: 'economy',
                    price: 25000,
                    monthlyInsurance: 200,
                    fuel: 'Gasoline',
                    luxury: 2,
                    benefits: { happiness: 5 },
                    description: 'Reliable and economical transportation.'
                },
                {
                    id: 'sports_car',
                    name: 'BMW M3',
                    type: 'sports',
                    price: 80000,
                    monthlyInsurance: 800,
                    fuel: 'Gasoline',
                    luxury: 6,
                    benefits: { happiness: 15, reputation: 5 },
                    description: 'High-performance sports car for thrilling drives.'
                },
                {
                    id: 'luxury_sedan',
                    name: 'Mercedes-Benz S-Class',
                    type: 'luxury',
                    price: 120000,
                    monthlyInsurance: 1000,
                    fuel: 'Gasoline',
                    luxury: 8,
                    benefits: { happiness: 20, luxury: 10, reputation: 8 },
                    description: 'Ultimate comfort and prestige in luxury sedan.'
                },
                {
                    id: 'supercar',
                    name: 'Lamborghini Huracán',
                    type: 'supercar',
                    price: 250000,
                    monthlyInsurance: 2500,
                    fuel: 'Gasoline',
                    luxury: 12,
                    benefits: { happiness: 30, luxury: 20, reputation: 15 },
                    description: 'Exotic supercar that turns heads everywhere.'
                },
                {
                    id: 'hypercar',
                    name: 'Bugatti Chiron',
                    type: 'hypercar',
                    price: 3000000,
                    monthlyInsurance: 15000,
                    fuel: 'Gasoline',
                    luxury: 20,
                    benefits: { happiness: 50, luxury: 35, reputation: 25 },
                    description: 'The pinnacle of automotive engineering and luxury.'
                },
                {
                    id: 'electric_luxury',
                    name: 'Tesla Model S Plaid',
                    type: 'electric_luxury',
                    price: 150000,
                    monthlyInsurance: 1200,
                    fuel: 'Electric',
                    luxury: 9,
                    benefits: { happiness: 25, luxury: 12, reputation: 10 },
                    description: 'Cutting-edge electric luxury with incredible performance.'
                }
            ]
        };
    }

    /**
     * Nightlife & Entertainment System
     */
    initializeNightlife() {
        this.activities = {
            nightlife: [
                {
                    id: 'casual_bar',
                    name: 'Local Sports Bar',
                    type: 'bar',
                    cost: 100,
                    duration: 3, // hours
                    effects: { happiness: 5, stress: -3, social: 8 },
                    requirements: { energy: 30 },
                    description: 'Relax with friends at a casual sports bar.'
                },
                {
                    id: 'upscale_club',
                    name: 'VIP Nightclub',
                    type: 'club',
                    cost: 500,
                    duration: 5,
                    effects: { happiness: 15, stress: -8, social: 15, energy: -20 },
                    requirements: { energy: 50, reputation: 30 },
                    description: 'Party at an exclusive nightclub with VIP treatment.'
                },
                {
                    id: 'casino_night',
                    name: 'Luxury Casino',
                    type: 'casino',
                    cost: 1000,
                    duration: 4,
                    effects: { happiness: 10, stress: 5, luxury: 8 },
                    requirements: { energy: 40, luxury: 20 },
                    risk: 0.3, // 30% chance of losing money
                    description: 'Try your luck at high-stakes gambling.'
                },
                {
                    id: 'private_party',
                    name: 'Celebrity Private Party',
                    type: 'private',
                    cost: 2000,
                    duration: 6,
                    effects: { happiness: 25, social: 20, reputation: 10, luxury: 15 },
                    requirements: { energy: 60, reputation: 50, luxury: 30 },
                    description: 'Exclusive party with celebrities and elite society.'
                }
            ],
            entertainment: [
                {
                    id: 'movie_theater',
                    name: 'Cinema Experience',
                    type: 'cinema',
                    cost: 50,
                    duration: 3,
                    effects: { happiness: 8, stress: -5 },
                    requirements: { energy: 20 },
                    description: 'Enjoy the latest blockbuster movie.'
                },
                {
                    id: 'concert',
                    name: 'Live Concert',
                    type: 'concert',
                    cost: 200,
                    duration: 4,
                    effects: { happiness: 15, social: 10, stress: -8 },
                    requirements: { energy: 30 },
                    description: 'Experience live music from top artists.'
                },
                {
                    id: 'theater',
                    name: 'Theater Show',
                    type: 'theater',
                    cost: 150,
                    duration: 3,
                    effects: { happiness: 12, luxury: 5, stress: -6 },
                    requirements: { energy: 25 },
                    description: 'Sophisticated evening at the theater.'
                }
            ]
        };
    }

    /**
     * Shopping System
     */
    initializeShopping() {
        this.shopping = {
            clothing: [
                {
                    id: 'casual_wear',
                    name: 'Casual Designer Outfit',
                    category: 'clothing',
                    price: 500,
                    luxury: 3,
                    benefits: { happiness: 5, reputation: 2 },
                    description: 'Stylish casual wear from premium brands.'
                },
                {
                    id: 'formal_suit',
                    name: 'Tailored Business Suit',
                    category: 'clothing',
                    price: 2000,
                    luxury: 6,
                    benefits: { happiness: 10, reputation: 8, luxury: 5 },
                    description: 'Perfect for formal events and business meetings.'
                },
                {
                    id: 'luxury_collection',
                    name: 'High-End Fashion Collection',
                    category: 'clothing',
                    price: 10000,
                    luxury: 12,
                    benefits: { happiness: 20, reputation: 15, luxury: 15 },
                    description: 'Exclusive designer collection from top fashion houses.'
                }
            ],
            accessories: [
                {
                    id: 'luxury_watch',
                    name: 'Swiss Luxury Watch',
                    category: 'accessories',
                    price: 15000,
                    luxury: 10,
                    benefits: { reputation: 12, luxury: 12 },
                    description: 'Prestigious timepiece that commands respect.'
                },
                {
                    id: 'jewelry_set',
                    name: 'Diamond Jewelry Set',
                    category: 'accessories',
                    price: 50000,
                    luxury: 15,
                    benefits: { reputation: 18, luxury: 20, happiness: 15 },
                    description: 'Exquisite diamonds that showcase your success.'
                }
            ],
            electronics: [
                {
                    id: 'gaming_setup',
                    name: 'Ultimate Gaming Setup',
                    category: 'electronics',
                    price: 5000,
                    luxury: 4,
                    benefits: { happiness: 15, stress: -10 },
                    description: 'High-end gaming equipment for relaxation.'
                },
                {
                    id: 'home_theater',
                    name: 'Premium Home Theater',
                    category: 'electronics',
                    price: 25000,
                    luxury: 8,
                    benefits: { happiness: 20, luxury: 10 },
                    description: 'Cinema-quality entertainment at home.'
                }
            ]
        };
    }

    /**
     * Relationships System
     */
    initializeRelationships() {
        this.relationships = {
            friends: [],
            family: {
                parents: { relationship: 80, contact: 'weekly' },
                siblings: { relationship: 70, contact: 'monthly' }
            },
            romantic: null,
            professional: []
        };
    }

    /**
     * Investment System
     */
    initializeInvestments() {
        this.investments = {
            portfolio: [],
            available: [
                {
                    id: 'restaurant_business',
                    name: 'Upscale Restaurant',
                    type: 'business',
                    initialCost: 200000,
                    monthlyReturn: 8000,
                    risk: 'medium',
                    description: 'Own a popular restaurant in the city center.'
                },
                {
                    id: 'real_estate_fund',
                    name: 'Real Estate Investment Fund',
                    type: 'fund',
                    initialCost: 100000,
                    monthlyReturn: 3000,
                    risk: 'low',
                    description: 'Diversified real estate portfolio.'
                },
                {
                    id: 'tech_startup',
                    name: 'Tech Startup Investment',
                    type: 'startup',
                    initialCost: 500000,
                    monthlyReturn: 15000,
                    risk: 'high',
                    description: 'High-risk, high-reward tech investment.'
                }
            ]
        };
    }

    /**
     * Purchase property
     */
    purchaseProperty(propertyId) {
        const property = this.properties.available.find(p => p.id === propertyId);
        if (!property) {
            return { success: false, message: 'Property not found' };
        }

        if (this.player.money < property.price) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Check if player already owns this type of property
        const existingProperty = this.properties.owned.find(p => p.type === property.type);
        if (existingProperty) {
            return { success: false, message: 'You already own a similar property' };
        }

        // Purchase property
        this.player.money -= property.price;
        this.properties.owned.push({
            ...property,
            purchaseDate: new Date(),
            condition: 100
        });

        // Apply benefits
        this.applyLifestyleEffects(property.benefits);

        // Remove from available
        this.properties.available = this.properties.available.filter(p => p.id !== propertyId);

        return {
            success: true,
            message: `Successfully purchased ${property.name}!`,
            property: property
        };
    }

    /**
     * Purchase vehicle
     */
    purchaseVehicle(vehicleId) {
        const vehicle = this.vehicles.available.find(v => v.id === vehicleId);
        if (!vehicle) {
            return { success: false, message: 'Vehicle not found' };
        }

        if (this.player.money < vehicle.price) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Purchase vehicle
        this.player.money -= vehicle.price;
        this.vehicles.owned.push({
            ...vehicle,
            purchaseDate: new Date(),
            condition: 100,
            mileage: 0
        });

        // Apply benefits
        this.applyLifestyleEffects(vehicle.benefits);

        return {
            success: true,
            message: `Successfully purchased ${vehicle.name}!`,
            vehicle: vehicle
        };
    }

    /**
     * Engage in nightlife activity
     */
    goOut(activityId) {
        const activity = this.findActivity(activityId);
        if (!activity) {
            return { success: false, message: 'Activity not found' };
        }

        // Check requirements
        const requirementCheck = this.checkRequirements(activity.requirements);
        if (!requirementCheck.success) {
            return requirementCheck;
        }

        if (this.player.money < activity.cost) {
            return { success: false, message: 'Insufficient funds for this activity' };
        }

        // Pay for activity
        this.player.money -= activity.cost;

        // Apply effects
        this.applyLifestyleEffects(activity.effects);

        // Handle special cases (casino risk, etc.)
        let specialResult = null;
        if (activity.risk && Math.random() < activity.risk) {
            const loss = activity.cost * (1 + Math.random());
            this.player.money -= loss;
            specialResult = `Lost an additional €${loss.toLocaleString()} gambling!`;
        }

        return {
            success: true,
            message: `Enjoyed ${activity.name}! ${specialResult || ''}`,
            activity: activity,
            specialResult: specialResult
        };
    }

    /**
     * Shopping purchase
     */
    buyItem(itemId, category) {
        const item = this.shopping[category]?.find(i => i.id === itemId);
        if (!item) {
            return { success: false, message: 'Item not found' };
        }

        if (this.player.money < item.price) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Purchase item
        this.player.money -= item.price;
        
        // Add to inventory (create if doesn't exist)
        if (!this.shopping.inventory) {
            this.shopping.inventory = [];
        }
        this.shopping.inventory.push({
            ...item,
            purchaseDate: new Date()
        });

        // Apply benefits
        this.applyLifestyleEffects(item.benefits);

        return {
            success: true,
            message: `Successfully purchased ${item.name}!`,
            item: item
        };
    }

    /**
     * Make investment
     */
    makeInvestment(investmentId) {
        const investment = this.investments.available.find(i => i.id === investmentId);
        if (!investment) {
            return { success: false, message: 'Investment not found' };
        }

        if (this.player.money < investment.initialCost) {
            return { success: false, message: 'Insufficient funds for this investment' };
        }

        // Make investment
        this.player.money -= investment.initialCost;
        this.investments.portfolio.push({
            ...investment,
            investmentDate: new Date(),
            totalReturns: 0
        });

        return {
            success: true,
            message: `Successfully invested in ${investment.name}!`,
            investment: investment
        };
    }

    /**
     * Process weekly lifestyle updates
     */
    processWeeklyLifestyle() {
        // Property maintenance
        this.properties.owned.forEach(property => {
            this.player.money -= property.monthlyMaintenance / 4; // Weekly cost
        });

        // Vehicle insurance
        this.vehicles.owned.forEach(vehicle => {
            this.player.money -= vehicle.monthlyInsurance / 4; // Weekly cost
        });

        // Investment returns
        this.investments.portfolio.forEach(investment => {
            const weeklyReturn = investment.monthlyReturn / 4;
            this.player.money += weeklyReturn;
            investment.totalReturns += weeklyReturn;
        });

        // Natural lifestyle decay/improvement
        this.lifestyle.stress = Math.min(100, this.lifestyle.stress + 2);
        this.lifestyle.happiness = Math.max(0, this.lifestyle.happiness - 1);
        this.lifestyle.energy = Math.max(0, this.lifestyle.energy - 3);

        // Update based on owned luxuries
        const luxuryBonus = this.calculateLuxuryBonus();
        this.lifestyle.happiness += luxuryBonus.happiness;
        this.lifestyle.luxury += luxuryBonus.luxury;
    }

    /**
     * Calculate luxury bonus from owned items
     */
    calculateLuxuryBonus() {
        let happiness = 0;
        let luxury = 0;

        this.properties.owned.forEach(property => {
            happiness += property.benefits.happiness || 0;
            luxury += property.benefits.luxury || 0;
        });

        this.vehicles.owned.forEach(vehicle => {
            happiness += vehicle.benefits.happiness || 0;
            luxury += vehicle.benefits.luxury || 0;
        });

        return { happiness: Math.floor(happiness / 4), luxury: Math.floor(luxury / 4) };
    }

    /**
     * Apply lifestyle effects
     */
    applyLifestyleEffects(effects) {
        Object.keys(effects).forEach(key => {
            if (this.lifestyle.hasOwnProperty(key)) {
                this.lifestyle[key] = Math.max(0, Math.min(100, this.lifestyle[key] + effects[key]));
            }
        });
    }

    /**
     * Check activity requirements
     */
    checkRequirements(requirements) {
        if (!requirements) return { success: true };

        for (const [key, value] of Object.entries(requirements)) {
            if (this.lifestyle[key] < value) {
                return {
                    success: false,
                    message: `Insufficient ${key}. Required: ${value}, Current: ${this.lifestyle[key]}`
                };
            }
        }

        return { success: true };
    }

    /**
     * Find activity by ID
     */
    findActivity(activityId) {
        for (const category of Object.values(this.activities)) {
            const activity = category.find(a => a.id === activityId);
            if (activity) return activity;
        }
        return null;
    }

    /**
     * Get all personal life data
     */
    getPersonalLifeData() {
        return {
            lifestyle: this.lifestyle,
            properties: this.properties,
            vehicles: this.vehicles,
            relationships: this.relationships,
            activities: this.activities,
            shopping: this.shopping,
            investments: this.investments,
            monthlyExpenses: this.calculateMonthlyExpenses(),
            netWorth: this.calculateNetWorth()
        };
    }

    /**
     * Calculate monthly expenses
     */
    calculateMonthlyExpenses() {
        let total = 0;
        
        this.properties.owned.forEach(property => {
            total += property.monthlyMaintenance;
        });
        
        this.vehicles.owned.forEach(vehicle => {
            total += vehicle.monthlyInsurance;
        });
        
        return total;
    }

    /**
     * Calculate net worth
     */
    calculateNetWorth() {
        let totalValue = this.player.money;
        
        this.properties.owned.forEach(property => {
            totalValue += property.price * 0.9; // Slight depreciation
        });
        
        this.vehicles.owned.forEach(vehicle => {
            totalValue += vehicle.price * 0.8; // Vehicle depreciation
        });
        
        this.investments.portfolio.forEach(investment => {
            totalValue += investment.initialCost + investment.totalReturns;
        });
        
        return totalValue;
    }

    /**
     * Get lifestyle impact on football performance
     */
    getPerformanceImpact() {
        const impact = {
            overall: 0,
            stamina: 0,
            focus: 0,
            morale: 0
        };

        // Happiness affects overall performance
        if (this.lifestyle.happiness > 80) {
            impact.overall += 5;
            impact.morale += 10;
        } else if (this.lifestyle.happiness < 40) {
            impact.overall -= 5;
            impact.morale -= 10;
        }

        // Stress affects focus and stamina
        if (this.lifestyle.stress > 70) {
            impact.focus -= 8;
            impact.stamina -= 5;
        } else if (this.lifestyle.stress < 30) {
            impact.focus += 5;
        }

        // Energy affects stamina
        if (this.lifestyle.energy > 80) {
            impact.stamina += 8;
        } else if (this.lifestyle.energy < 40) {
            impact.stamina -= 10;
        }

        return impact;
    }
}

module.exports = PersonalLifeSystem;