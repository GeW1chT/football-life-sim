// backend/relationshipManager.js

class RelationshipManager {
    constructor() {
        this.player = null;
        this.family = {};
        this.relationships = [];
        this.socialCircle = [];
        this.mediaRelationship = 50;
        this.publicImage = 50;
        this.socialMediaFollowers = 1000;
        this.scandals = [];
        this.lifeEvents = [];
    }

    /**
     * Initialize relationship system
     */
    initialize(playerData) {
        this.player = playerData;
        this.initializeFamily();
        this.initializeSocialCircle();
        this.initializeMediaRelationship();
        this.generateRandomRelationshipOpportunities();
    }

    /**
     * Initialize family background
     */
    initializeFamily() {
        // Parents
        this.family.parents = {
            father: {
                name: this.generateName('male'),
                alive: Math.random() > 0.05, // 95% chance alive
                relationship: 70 + Math.random() * 20, // 70-90
                supportLevel: Math.random() * 100,
                occupation: this.getRandomOccupation(),
                influence: Math.random() * 50 + 25 // 25-75
            },
            mother: {
                name: this.generateName('female'),
                alive: Math.random() > 0.03, // 97% chance alive
                relationship: 75 + Math.random() * 20, // 75-95
                supportLevel: Math.random() * 100,
                occupation: this.getRandomOccupation(),
                influence: Math.random() * 50 + 30 // 30-80
            }
        };

        // Siblings (0-3 siblings)
        const siblingCount = Math.floor(Math.random() * 4);
        this.family.siblings = [];
        for (let i = 0; i < siblingCount; i++) {
            this.family.siblings.push({
                name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
                age: this.player.age + (Math.random() * 10 - 5), // ±5 years
                relationship: 60 + Math.random() * 30, // 60-90
                occupation: this.getRandomOccupation(),
                jealousy: Math.random() * 40, // How jealous of player's success
                support: Math.random() * 80 + 20 // 20-100
            });
        }

        // Extended family
        this.family.extended = {
            grandparents: Math.random() > 0.3, // 70% chance of living grandparents
            uncles_aunts: Math.floor(Math.random() * 6), // 0-5
            cousins: Math.floor(Math.random() * 10) // 0-9
        };
    }

    /**
     * Initialize social circle
     */
    initializeSocialCircle() {
        // Childhood friends
        for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
            this.socialCircle.push({
                id: `childhood_${i}`,
                name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
                type: 'childhood_friend',
                relationship: 60 + Math.random() * 30,
                trustLevel: 70 + Math.random() * 25,
                loyalty: 80 + Math.random() * 20,
                influence: Math.random() * 30,
                metAt: 'childhood',
                yearsKnown: this.player.age - (5 + Math.random() * 10)
            });
        }

        // School friends
        for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
            this.socialCircle.push({
                id: `school_${i}`,
                name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
                type: 'school_friend',
                relationship: 50 + Math.random() * 40,
                trustLevel: 60 + Math.random() * 30,
                loyalty: 60 + Math.random() * 30,
                influence: Math.random() * 40,
                metAt: 'school',
                yearsKnown: this.player.age - (12 + Math.random() * 6)
            });
        }
    }

    /**
     * Initialize media relationship
     */
    initializeMediaRelationship() {
        this.mediaProfile = {
            reputation: 50,
            likeability: 50,
            controversy: 0,
            mediaTraining: 30,
            interviewSkill: 40,
            socialMediaSkill: 60,
            publicSpeaking: 35
        };

        this.socialMedia = {
            instagram: {
                followers: 1000,
                posts: 0,
                engagement: 2.5,
                controversies: 0
            },
            twitter: {
                followers: 500,
                tweets: 0,
                engagement: 1.8,
                controversies: 0
            },
            tiktok: {
                followers: 100,
                videos: 0,
                engagement: 8.5,
                controversies: 0
            }
        };
    }

    /**
     * Start romantic relationship
     */
    startRomanticRelationship(partnerType = 'random') {
        if (this.getCurrentPartner()) {
            return { success: false, message: 'You are already in a relationship' };
        }

        const partner = this.generateRomanticPartner(partnerType);
        this.relationships.push(partner);

        this.addLifeEvent('relationship_start', `Started dating ${partner.name}`, 'romance');

        return {
            success: true,
            message: `You started dating ${partner.name}!`,
            partner: partner
        };
    }

    /**
     * Generate romantic partner
     */
    generateRomanticPartner(type) {
        const partnerTypes = {
            random: { fame: 0, wealth: 'average', occupation: 'normal' },
            celebrity: { fame: 80, wealth: 'rich', occupation: 'celebrity' },
            model: { fame: 40, wealth: 'good', occupation: 'model' },
            athlete: { fame: 60, wealth: 'rich', occupation: 'athlete' },
            normal: { fame: 0, wealth: 'average', occupation: 'normal' }
        };

        const partnerProfile = partnerTypes[type] || partnerTypes.random;
        
        return {
            id: `partner_${Date.now()}`,
            name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
            type: 'romantic_partner',
            relationshipType: type,
            age: this.player.age + (Math.random() * 8 - 4), // ±4 years
            fame: partnerProfile.fame + (Math.random() * 20 - 10),
            wealth: partnerProfile.wealth,
            occupation: partnerProfile.occupation,
            personality: {
                supportive: Math.random() * 100,
                jealous: Math.random() * 60,
                ambitious: Math.random() * 80,
                loyal: Math.random() * 90 + 10,
                social: Math.random() * 100,
                materialistic: Math.random() * 70
            },
            relationship: 70,
            trustLevel: 60,
            compatibility: Math.random() * 80 + 20,
            publicRelationship: Math.random() > 0.3, // 70% chance public
            startDate: new Date(),
            status: 'dating',
            children: [],
            marriageDesire: Math.random() * 100,
            pressureLevel: Math.random() * 50
        };
    }

    /**
     * Progress relationship
     */
    progressRelationship(partnerId, action) {
        const partner = this.relationships.find(r => r.id === partnerId && r.type === 'romantic_partner');
        if (!partner) {
            return { success: false, message: 'Partner not found' };
        }

        let relationshipChange = 0;
        let message = '';
        let specialEvent = null;

        switch (action) {
            case 'spend_quality_time':
                relationshipChange = 5 + Math.random() * 10;
                message = `You spent quality time with ${partner.name}. Relationship improved!`;
                break;
                
            case 'expensive_gift':
                relationshipChange = 8 + Math.random() * 12;
                this.player.money -= 5000 + Math.random() * 20000;
                message = `Expensive gift made ${partner.name} very happy!`;
                break;
                
            case 'surprise_vacation':
                relationshipChange = 15 + Math.random() * 10;
                this.player.money -= 20000 + Math.random() * 50000;
                message = `Surprise vacation was a huge success!`;
                break;
                
            case 'propose':
                if (partner.relationship >= 80 && partner.marriageDesire >= 60) {
                    partner.status = 'engaged';
                    relationshipChange = 20;
                    specialEvent = 'engagement';
                    message = `${partner.name} said YES! You're now engaged!`;
                    this.addLifeEvent('engagement', `Got engaged to ${partner.name}`, 'romance');
                } else {
                    relationshipChange = -20;
                    message = `${partner.name} rejected your proposal. Relationship damaged.`;
                }
                break;
                
            case 'marry':
                if (partner.status === 'engaged') {
                    partner.status = 'married';
                    relationshipChange = 25;
                    specialEvent = 'marriage';
                    message = `You married ${partner.name}! Congratulations!`;
                    this.addLifeEvent('marriage', `Married ${partner.name}`, 'romance');
                    this.player.money -= 100000 + Math.random() * 200000; // Wedding costs
                } else {
                    return { success: false, message: 'You need to be engaged first!' };
                }
                break;
                
            case 'have_child':
                if (partner.status === 'married' || (partner.status === 'dating' && partner.relationship >= 90)) {
                    const child = {
                        name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
                        birthDate: new Date(),
                        age: 0,
                        relationship: 100
                    };
                    partner.children.push(child);
                    specialEvent = 'child_birth';
                    message = `Congratulations! ${child.name} was born!`;
                    this.addLifeEvent('child_birth', `${child.name} was born`, 'family');
                    relationshipChange = 15;
                } else {
                    return { success: false, message: 'Not ready for children yet' };
                }
                break;
        }

        partner.relationship = Math.max(0, Math.min(100, partner.relationship + relationshipChange));

        return {
            success: true,
            message: message,
            relationshipChange: relationshipChange,
            specialEvent: specialEvent,
            partner: partner
        };
    }

    /**
     * Handle social media activity
     */
    postSocialMedia(platform, contentType, message = '') {
        if (!this.socialMedia[platform]) {
            return { success: false, message: 'Platform not supported' };
        }

        const platformData = this.socialMedia[platform];
        let followerChange = 0;
        let engagementChange = 0;
        let controversyRisk = 0;
        let cost = 0;

        switch (contentType) {
            case 'training_video':
                followerChange = Math.floor(platformData.followers * 0.01); // 1% increase
                engagementChange = 0.2;
                controversyRisk = 0;
                break;
                
            case 'family_photo':
                followerChange = Math.floor(platformData.followers * 0.005); // 0.5% increase
                engagementChange = 0.5;
                controversyRisk = 0;
                break;
                
            case 'luxury_lifestyle':
                followerChange = Math.floor(platformData.followers * 0.02); // 2% increase
                engagementChange = 0.3;
                controversyRisk = 30; // Risk of backlash
                break;
                
            case 'charity_work':
                followerChange = Math.floor(platformData.followers * 0.015); // 1.5% increase
                engagementChange = 0.8;
                controversyRisk = 0;
                this.mediaProfile.reputation += 5;
                break;
                
            case 'controversial_opinion':
                followerChange = Math.floor(platformData.followers * 0.03); // 3% increase
                engagementChange = 1.5;
                controversyRisk = 70; // High risk
                break;
                
            case 'sponsored_content':
                followerChange = Math.floor(platformData.followers * -0.005); // -0.5% (slight decrease)
                engagementChange = -0.2;
                controversyRisk = 10;
                cost = -5000 - Math.random() * 15000; // Earn money
                break;
        }

        // Apply changes
        platformData.followers = Math.max(0, platformData.followers + followerChange);
        platformData.engagement = Math.max(0, platformData.engagement + engagementChange);
        platformData.posts++;

        // Handle controversy
        let controversyResult = null;
        if (Math.random() * 100 < controversyRisk) {
            controversyResult = this.createControversy(contentType, platform);
            platformData.controversies++;
        }

        // Update player money if sponsored content
        if (cost !== 0) {
            this.player.money -= cost; // Negative cost means earning money
        }

        return {
            success: true,
            followerChange: followerChange,
            engagementChange: engagementChange,
            controversy: controversyResult,
            earnings: -cost
        };
    }

    /**
     * Create controversy
     */
    createControversy(contentType, platform) {
        const controversy = {
            id: `controversy_${Date.now()}`,
            type: contentType,
            platform: platform,
            date: new Date(),
            severity: Math.random() * 100,
            description: this.generateControversyDescription(contentType),
            mediaAttention: Math.random() * 80 + 20,
            publicBacklash: Math.random() * 60,
            resolved: false
        };

        this.scandals.push(controversy);
        this.mediaProfile.controversy += controversy.severity * 0.5;
        this.mediaProfile.reputation -= controversy.severity * 0.3;

        return controversy;
    }

    /**
     * Handle media interview
     */
    handleMediaInterview(topic, approach) {
        const interviewSkill = this.mediaProfile.interviewSkill;
        const mediaTraining = this.mediaProfile.mediaTraining;
        
        let successRate = (interviewSkill + mediaTraining) / 2;
        let reputationChange = 0;
        let message = '';

        // Adjust based on approach
        switch (approach) {
            case 'honest':
                successRate += 10;
                reputationChange = Math.random() > 0.5 ? 5 : -3;
                break;
            case 'diplomatic':
                successRate += 20;
                reputationChange = 2;
                break;
            case 'controversial':
                successRate -= 10;
                reputationChange = Math.random() > 0.3 ? -8 : 10;
                break;
            case 'humorous':
                successRate += 5;
                reputationChange = Math.random() > 0.4 ? 6 : -2;
                break;
        }

        const success = Math.random() * 100 < successRate;

        if (success) {
            this.mediaProfile.reputation += Math.abs(reputationChange);
            this.mediaProfile.interviewSkill += 1;
            message = 'Great interview! Your media reputation improved.';
        } else {
            this.mediaProfile.reputation -= Math.abs(reputationChange);
            message = 'The interview didn\'t go well. Your reputation took a hit.';
            
            // Risk of creating controversy
            if (Math.random() < 0.3) {
                this.createControversy('interview_gaffe', 'media');
            }
        }

        return {
            success: success,
            reputationChange: reputationChange,
            message: message
        };
    }

    /**
     * Get current romantic partner
     */
    getCurrentPartner() {
        return this.relationships.find(r => r.type === 'romantic_partner' && ['dating', 'engaged', 'married'].includes(r.status));
    }

    /**
     * Get family status
     */
    getFamilyStatus() {
        const partner = this.getCurrentPartner();
        let children = [];
        
        if (partner) {
            children = partner.children || [];
        }

        return {
            relationshipStatus: partner ? partner.status : 'single',
            partner: partner,
            children: children,
            parents: this.family.parents,
            siblings: this.family.siblings
        };
    }

    /**
     * Get social media stats
     */
    getSocialMediaStats() {
        return {
            platforms: this.socialMedia,
            totalFollowers: Object.values(this.socialMedia).reduce((sum, platform) => sum + platform.followers, 0),
            mediaProfile: this.mediaProfile,
            recentControversies: this.scandals.slice(-5)
        };
    }

    /**
     * Process weekly relationship updates
     */
    processWeeklyRelationships() {
        // Update romantic relationships
        this.relationships.forEach(relationship => {
            if (relationship.type === 'romantic_partner') {
                // Natural relationship decay/growth
                const personalityFactor = (relationship.personality.supportive - relationship.personality.jealous) / 100;
                const careerPressure = this.player.attributes?.overall >= 85 ? 2 : 0; // High-profile players face more pressure
                
                const relationshipChange = personalityFactor - careerPressure + (Math.random() * 4 - 2);
                relationship.relationship = Math.max(0, Math.min(100, relationship.relationship + relationshipChange));
                
                // Check for breakup
                if (relationship.relationship < 20 && Math.random() < 0.3) {
                    relationship.status = 'broken_up';
                    this.addLifeEvent('breakup', `Broke up with ${relationship.name}`, 'romance');
                }
            }
        });

        // Update social media followers based on performance
        const playerPerformance = this.player.attributes?.overall || 75;
        const performanceBonus = playerPerformance > 80 ? 1.02 : playerPerformance > 70 ? 1.01 : 1.0;
        
        Object.values(this.socialMedia).forEach(platform => {
            platform.followers = Math.floor(platform.followers * performanceBonus);
        });

        // Resolve old controversies
        this.scandals.forEach(scandal => {
            if (!scandal.resolved && (Date.now() - scandal.date.getTime()) > (30 * 24 * 60 * 60 * 1000)) { // 30 days
                scandal.resolved = true;
                this.mediaProfile.controversy = Math.max(0, this.mediaProfile.controversy - scandal.severity * 0.2);
            }
        });
    }

    /**
     * Helper methods
     */
    generateName(gender) {
        const maleNames = ['Alex', 'David', 'Michael', 'John', 'James', 'Robert', 'William', 'Richard', 'Joseph', 'Thomas'];
        const femaleNames = ['Sarah', 'Emma', 'Jessica', 'Ashley', 'Emily', 'Samantha', 'Amanda', 'Elizabeth', 'Taylor', 'Megan'];
        
        return gender === 'male' ? 
            maleNames[Math.floor(Math.random() * maleNames.length)] :
            femaleNames[Math.floor(Math.random() * femaleNames.length)];
    }

    getRandomOccupation() {
        const occupations = ['Teacher', 'Engineer', 'Doctor', 'Lawyer', 'Business Owner', 'Accountant', 'Nurse', 'Manager', 'Consultant', 'Artist'];
        return occupations[Math.floor(Math.random() * occupations.length)];
    }

    generateControversyDescription(type) {
        const descriptions = {
            luxury_lifestyle: 'Fans criticized your lavish spending while many struggle financially',
            controversial_opinion: 'Your political/social views sparked heated debate online',
            sponsored_content: 'Accused of promoting inappropriate products to young fans',
            interview_gaffe: 'Made inappropriate comments during live interview'
        };
        return descriptions[type] || 'Unspecified controversial incident';
    }

    addLifeEvent(type, description, category) {
        this.lifeEvents.push({
            type: type,
            description: description,
            category: category,
            date: new Date(),
            week: this.getCurrentWeek()
        });
    }

    getCurrentWeek() {
        // This would be integrated with the season manager
        return 1;
    }

    generateRandomRelationshipOpportunities() {
        // Generate potential romantic interests that might appear throughout career
        this.relationshipOpportunities = [
            {
                type: 'childhood_sweetheart',
                name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
                description: 'Your childhood friend wants to reconnect',
                availability: 'random'
            },
            {
                type: 'celebrity_crush',
                name: this.generateName(Math.random() > 0.5 ? 'male' : 'female'),
                description: 'A famous celebrity is interested in you',
                availability: 'high_fame'
            }
        ];
    }
}

module.exports = RelationshipManager;