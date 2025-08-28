// frontend/ai-manager.js
let playerData = null;
let aiAnalysis = null;
let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeAIManager();
    setupEventListeners();
});

/**
 * Initialize AI Manager dashboard
 */
async function initializeAIManager() {
    try {
        playerData = await window.footballAPI.getPlayerInfo();
        
        if (playerData) {
            // Generate AI analysis and recommendations
            aiAnalysis = await generateAIAnalysis(playerData);
            
            // Update all sections
            updateAnalysisOverview(aiAnalysis.analysis);
            updatePriorityRecommendations(aiAnalysis.recommendations);
            updateTacticalAdvice(aiAnalysis.tacticalAdvice);
            updateTrainingPlan(aiAnalysis.recommendations);
            updateCareerGuidance(aiAnalysis.careerGuidance);
            updateTransferAdvice(aiAnalysis.recommendations);
            
            // Add entrance animations
            animateElements();
        } else {
            showNoPlayerMessage();
        }
    } catch (error) {
        console.error('Error loading AI Manager data:', error);
        showErrorMessage();
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        navigateWithTransition('index.html');
    });
    
    // Quick question buttons
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const question = e.target.dataset.question;
            handleQuickQuestion(question);
        });
    });
    
    // Chat input
    document.getElementById('sendChatBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

/**
 * Generate AI analysis (mock implementation - would integrate with backend)
 */
async function generateAIAnalysis(player) {
    // Mock AI analysis - in real implementation, this would call the backend AIManager
    const mockAnalysis = {
        analysis: {
            overallRating: calculateOverallRating(player),
            recentForm: 'good',
            developmentPotential: {
                current: calculateOverallRating(player),
                ceiling: player.potential || 85,
                likelihood: 0.7
            },
            injuryRisk: 0.15,
            statAnalysis: analyzeStats(player.stats),
            teamFit: 0.8
        },
        recommendations: generateMockRecommendations(player),
        tacticalAdvice: generateMockTacticalAdvice(player),
        careerGuidance: generateMockCareerGuidance(player)
    };
    
    return mockAnalysis;
}

/**
 * Calculate overall rating
 */
function calculateOverallRating(player) {
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
 * Analyze player stats
 */
function analyzeStats(stats) {
    const statEntries = Object.entries(stats);
    const avgStat = statEntries.reduce((sum, [key, value]) => sum + value, 0) / statEntries.length;
    
    const strengths = statEntries.filter(([key, value]) => value >= avgStat + 10);
    const weaknesses = statEntries.filter(([key, value]) => value <= avgStat - 10);
    
    return {
        strengths: strengths.map(([key]) => key),
        weaknesses: weaknesses.map(([key]) => key),
        avgStat: Math.round(avgStat)
    };
}

/**
 * Generate mock recommendations
 */
function generateMockRecommendations(player) {
    return [
        {
            type: 'training',
            priority: 'high',
            title: 'Focus on Weak Areas',
            description: 'Intensive training recommended for shooting and passing',
            details: 'Your shooting (' + (player.stats.shooting || 65) + ') and passing (' + (player.stats.passing || 60) + ') are below average for your position. Focus 70% of training time on these areas.',
            urgency: 'next_2_weeks'
        },
        {
            type: 'tactical',
            priority: 'medium',
            title: 'Positioning Adjustment',
            description: 'Consider playing deeper to utilize your passing ability',
            details: 'Your defensive awareness is strong. Playing a deeper role could help create more opportunities.',
            urgency: 'next_match'
        },
        {
            type: 'career',
            priority: 'medium',
            title: 'Market Value Growth',
            description: 'Your market value has potential to increase by 25-30% this season',
            details: 'Consistent performances and stat improvements could significantly boost your value.',
            urgency: 'season_goal'
        }
    ];
}

/**
 * Generate mock tactical advice
 */
function generateMockTacticalAdvice(player) {
    return {
        position: [
            'Focus on making diagonal runs behind the defense',
            'Use your pace to stretch the opposition backline',
            'Work on your first touch when receiving in tight spaces'
        ],
        performance: [
            'Your recent form shows improvement in decision-making',
            'Continue current shooting practice routine',
            'Maintain high work rate in defensive phases'
        ],
        immediate: [
            'Practice shooting with your weaker foot this week',
            'Study opponent\'s defensive patterns before next match',
            'Focus on communication with midfield during training'
        ]
    };
}

/**
 * Generate mock career guidance
 */
function generateMockCareerGuidance(player) {
    return {
        stage: 'developing',
        timeframe: '3-5 years to reach peak potential',
        goals: [
            'Reach 80+ overall rating within 2 seasons',
            'Become a regular starter and key player',
            'Attract interest from top-tier clubs',
            'Develop leadership qualities'
        ],
        pathway: {
            shortTerm: 'Focus on fundamental skill improvements',
            mediumTerm: 'Build reputation and consistency',
            longTerm: 'Establish yourself as a top player'
        }
    };
}

/**
 * Update analysis overview
 */
function updateAnalysisOverview(analysis) {
    document.getElementById('overallRating').textContent = analysis.overallRating;
    document.getElementById('ratingTrend').textContent = 'Above average for position';
    
    document.getElementById('recentForm').textContent = analysis.recentForm.charAt(0).toUpperCase() + analysis.recentForm.slice(1);
    document.getElementById('formTrend').textContent = 'Steady improvement';
    
    const potential = analysis.developmentPotential;
    document.getElementById('devPotential').textContent = potential.current + '/' + potential.ceiling;
    document.getElementById('potentialTrend').textContent = Math.round(potential.likelihood * 100) + '% achievable';
    
    document.getElementById('injuryRisk').textContent = Math.round(analysis.injuryRisk * 100) + '%';
    document.getElementById('riskTrend').textContent = analysis.injuryRisk < 0.2 ? 'Low risk' : 'Moderate risk';
}

/**
 * Update priority recommendations
 */
function updatePriorityRecommendations(recommendations) {
    const container = document.getElementById('priorityRecommendations');
    
    container.innerHTML = recommendations.map(rec => {
        return '<div class="recommendation-card ' + rec.priority + '">' +
            '<div class="rec-header">' +
                '<div class="rec-priority ' + rec.priority + '">' + rec.priority.toUpperCase() + '</div>' +
                '<div class="rec-type">' + getRecommendationIcon(rec.type) + ' ' + rec.type.toUpperCase() + '</div>' +
            '</div>' +
            '<h3>' + rec.title + '</h3>' +
            '<p class="rec-description">' + rec.description + '</p>' +
            '<div class="rec-details">' + rec.details + '</div>' +
            '<div class="rec-urgency">' +
                '<span class="urgency-label">Timeline:</span>' +
                '<span class="urgency-value">' + formatUrgency(rec.urgency) + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

/**
 * Update tactical advice
 */
function updateTacticalAdvice(tacticalAdvice) {
    document.getElementById('positionAdvice').innerHTML = 
        tacticalAdvice.position.map(advice => '<div class="advice-item">' + advice + '</div>').join('');
        
    document.getElementById('performanceAdvice').innerHTML = 
        tacticalAdvice.performance.map(advice => '<div class="advice-item">' + advice + '</div>').join('');
        
    document.getElementById('immediateActions').innerHTML = 
        tacticalAdvice.immediate.map(advice => '<div class="advice-item">' + advice + '</div>').join('');
}

/**
 * Update training plan
 */
function updateTrainingPlan(recommendations) {
    const trainingRec = recommendations.find(rec => rec.type === 'training');
    
    if (trainingRec) {
        // Generate weekly schedule
        const schedule = generateWeeklySchedule(trainingRec);
        document.getElementById('weekSchedule').innerHTML = schedule;
        
        // Show training recommendations
        document.getElementById('trainingRecommendations').innerHTML = 
            '<div class="training-rec-card">' +
                '<h4>🎯 Primary Focus</h4>' +
                '<p>' + trainingRec.details + '</p>' +
                '<div class="training-stats">' +
                    '<div class="stat-focus">Shooting: 70% effort</div>' +
                    '<div class="stat-focus">Passing: 70% effort</div>' +
                    '<div class="stat-focus">Other stats: 30% effort</div>' +
                '</div>' +
            '</div>';
    }
}

/**
 * Generate weekly training schedule
 */
function generateWeeklySchedule(trainingRec) {
    const schedule = [
        { day: 'Monday', activity: 'Shooting Practice (Intensive)', duration: '2 hours' },
        { day: 'Tuesday', activity: 'Passing Drills (Medium)', duration: '1.5 hours' },
        { day: 'Wednesday', activity: 'Rest Day', duration: 'Recovery' },
        { day: 'Thursday', activity: 'Tactical Training', duration: '2 hours' },
        { day: 'Friday', activity: 'Light Fitness', duration: '1 hour' },
        { day: 'Saturday', activity: 'Match Day', duration: 'Competition' },
        { day: 'Sunday', activity: 'Active Recovery', duration: '30 mins' }
    ];
    
    return schedule.map(item => {
        return '<div class="schedule-item ' + (item.activity.includes('Rest') ? 'rest-day' : '') + '">' +
            '<div class="schedule-day">' + item.day + '</div>' +
            '<div class="schedule-activity">' + item.activity + '</div>' +
            '<div class="schedule-duration">' + item.duration + '</div>' +
        '</div>';
    }).join('');
}

/**
 * Update career guidance
 */
function updateCareerGuidance(careerGuidance) {
    // Career stage
    document.getElementById('careerStage').innerHTML = 
        '<div class="stage-badge ' + careerGuidance.stage + '">' + careerGuidance.stage.toUpperCase() + '</div>' +
        '<div class="stage-description">' + careerGuidance.timeframe + '</div>';
    
    // Career timeline
    document.getElementById('careerTimeline').innerHTML = 
        '<div class="timeline-item current">' +
            '<div class="timeline-dot"></div>' +
            '<div class="timeline-content">' +
                '<h4>Current Stage</h4>' +
                '<p>' + careerGuidance.pathway.shortTerm + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="timeline-item future">' +
            '<div class="timeline-dot"></div>' +
            '<div class="timeline-content">' +
                '<h4>Next 2-3 Years</h4>' +
                '<p>' + careerGuidance.pathway.mediumTerm + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="timeline-item future">' +
            '<div class="timeline-dot"></div>' +
            '<div class="timeline-content">' +
                '<h4>Peak Career</h4>' +
                '<p>' + careerGuidance.pathway.longTerm + '</p>' +
            '</div>' +
        '</div>';
    
    // Career goals
    document.getElementById('careerGoals').innerHTML = 
        careerGuidance.goals.map(goal => 
            '<div class="goal-item">' +
                '<div class="goal-checkbox">☐</div>' +
                '<div class="goal-text">' + goal + '</div>' +
            '</div>'
        ).join('');
}

/**
 * Update transfer advice
 */
function updateTransferAdvice(recommendations) {
    const transferRec = recommendations.find(rec => rec.type === 'transfer');
    
    if (transferRec) {
        document.getElementById('transferAdviceSection').style.display = 'block';
        
        document.getElementById('marketAnalysis').innerHTML = 
            '<div class="market-status good">' +
                '<h4>Market Position: Rising</h4>' +
                '<p>Your current form and stats indicate strong market appeal</p>' +
            '</div>';
        
        document.getElementById('transferRecommendations').innerHTML = 
            '<div class="transfer-advice-card">' +
                '<h4>💡 AI Recommendation</h4>' +
                '<p>' + transferRec.description + '</p>' +
                '<div class="transfer-details">' + transferRec.details + '</div>' +
            '</div>';
    }
}

/**
 * Handle quick questions
 */
function handleQuickQuestion(question) {
    addMessageToChat('user', question);
    
    // Generate AI response based on question
    setTimeout(() => {
        const response = generateAIResponse(question);
        addMessageToChat('ai', response);
    }, 1000);
}

/**
 * Send chat message
 */
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessageToChat('user', message);
        input.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessageToChat('ai', response);
        }, 1000);
    }
}

/**
 * Add message to chat
 */
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender + '-message';
    
    if (sender === 'ai') {
        messageDiv.innerHTML = 
            '<div class="message-avatar">🤖</div>' +
            '<div class="message-content">' +
                '<p>' + message + '</p>' +
            '</div>';
    } else {
        messageDiv.innerHTML = 
            '<div class="message-content user-msg">' +
                '<p>' + message + '</p>' +
            '</div>' +
            '<div class="message-avatar">👤</div>';
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Generate AI response
 */
function generateAIResponse(question) {
    const responses = {
        'shooting': "Based on your current shooting stat, I recommend focusing on accuracy drills and power training. Practice shooting from different angles and distances. Your recent match data shows you're getting into good positions, so improving conversion rate is key.",
        'transfer': "Your current market value and performance trajectory suggest you should focus on development rather than immediate transfer. However, if a top-tier club shows interest, it could accelerate your career growth.",
        'training': "Your AI-optimized training plan prioritizes shooting and passing development. Follow the intensive schedule for these areas while maintaining other stats. This approach should yield 8-12 point improvements over 6-8 weeks.",
        'career': "You're in the 'developing' phase of your career. Focus on consistency and skill improvement. Your potential ceiling is achievable with dedicated training and smart career decisions over the next 3-4 years."
    };
    
    // Simple keyword matching for responses
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('shooting') || lowerQuestion.includes('goal')) return responses.shooting;
    if (lowerQuestion.includes('transfer') || lowerQuestion.includes('move')) return responses.transfer;
    if (lowerQuestion.includes('training') || lowerQuestion.includes('practice')) return responses.training;
    if (lowerQuestion.includes('career') || lowerQuestion.includes('development')) return responses.career;
    
    return "That's an interesting question! Based on your current situation, I'd recommend focusing on the priority recommendations above. Each area has been analyzed specifically for your player profile and current needs.";
}

/**
 * Helper functions
 */
function getRecommendationIcon(type) {
    const icons = {
        'training': '🏋️',
        'tactical': '🧭',
        'career': '🎯',
        'transfer': '💰'
    };
    return icons[type] || '📌';
}

function formatUrgency(urgency) {
    const formats = {
        'next_2_weeks': 'Next 2 weeks',
        'next_match': 'Before next match',
        'season_goal': 'Season objective',
        'immediate': 'This week'
    };
    return formats[urgency] || urgency.replace('_', ' ');
}

function animateElements() {
    const sections = document.querySelectorAll('.analytics-section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function navigateWithTransition(url) {
    const dashboard = document.querySelector('.dashboard-container');
    
    dashboard.style.transition = 'all 0.5s ease';
    dashboard.style.opacity = '0';
    dashboard.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

function showNoPlayerMessage() {
    document.querySelector('.ai-manager-dashboard').innerHTML = 
        '<div class="no-data-message">' +
            '<h2>🤖 AI Manager Not Available</h2>' +
            '<p>Create a player first to access AI-powered career guidance.</p>' +
            '<button onclick="navigateWithTransition(\'creation.html\')" class="create-player-btn">' +
                'Create Player' +
            '</button>' +
        '</div>';
}

function showErrorMessage() {
    document.querySelector('.ai-manager-dashboard').innerHTML = 
        '<div class="error-message">' +
            '<h2>❌ AI Manager Error</h2>' +
            '<p>Unable to load AI analysis. Please try again.</p>' +
            '<button onclick="location.reload()" class="retry-btn">' +
                'Retry' +
            '</button>' +
        '</div>';
}