// frontend/analytics.js
let playerData = null;
let performanceHistory = [];
let heatmapData = {};

document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
    setupEventListeners();
    setupHeatmapControls();
    setupTrendControls();
});

/**
 * Initialize analytics dashboard
 */
async function initializeAnalytics() {
    try {
        playerData = await window.footballAPI.getPlayerInfo();
        
        if (playerData) {
            // Generate mock performance history for demonstration
            performanceHistory = generateMockPerformanceHistory();
            heatmapData = generateMockHeatmapData();
            
            updatePerformanceOverview(playerData);
            updateFormAndMorale(playerData);
            updateCareerStats(playerData);
            drawAttributeChart(playerData.stats);
            drawPerformanceTrendChart();
            generateHeatmap('all');
            updatePredictiveAnalytics();
            updateComparisonMetrics();
            updateMatchHistory();
            updateInjuryHistory(playerData.injuries);
            
            // Add entrance animations
            animateElements();
        } else {
            showNoDataMessage();
        }
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showErrorMessage();
    }
}

/**
 * Generate mock performance history for demonstration
 */
function generateMockPerformanceHistory() {
    const history = [];
    for (let i = 10; i >= 0; i--) {
        history.push({
            week: (new Date().getTime() - (i * 7 * 24 * 60 * 60 * 1000)),
            goals: Math.floor(Math.random() * 3),
            assists: Math.floor(Math.random() * 2),
            rating: 5 + Math.random() * 5,
            stamina: 60 + Math.random() * 40
        });
    }
    return history;
}

/**
 * Generate mock heatmap data
 */
function generateMockHeatmapData() {
    return {
        all: generateRandomHeatPoints(15),
        goals: generateRandomHeatPoints(5, 'forward'),
        assists: generateRandomHeatPoints(8, 'midfield'),
        passes: generateRandomHeatPoints(25, 'all'),
        tackles: generateRandomHeatPoints(12, 'defensive')
    };
}

/**
 * Generate random heat points for visualization
 */
function generateRandomHeatPoints(count, area = 'all') {
    const points = [];
    for (let i = 0; i < count; i++) {
        let x, y;
        
        switch (area) {
            case 'forward':
                x = 60 + Math.random() * 35;
                y = 20 + Math.random() * 60;
                break;
            case 'midfield':
                x = 30 + Math.random() * 40;
                y = 15 + Math.random() * 70;
                break;
            case 'defensive':
                x = 5 + Math.random() * 40;
                y = 20 + Math.random() * 60;
                break;
            default:
                x = Math.random() * 95;
                y = 10 + Math.random() * 80;
        }
        
        points.push({
            x: x,
            y: y,
            intensity: Math.random() * 0.8 + 0.2
        });
    }
    return points;
}

/**
 * Setup heat map controls
 */
function setupHeatmapControls() {
    const heatButtons = document.querySelectorAll('.heat-btn');
    heatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            heatButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const type = e.target.dataset.type;
            generateHeatmap(type);
        });
    });
}

/**
 * Setup trend chart controls
 */
function setupTrendControls() {
    const trendButtons = document.querySelectorAll('.trend-btn');
    trendButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            trendButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            drawPerformanceTrendChart(e.target.dataset.period);
        });
    });
    
    const metricCheckboxes = document.querySelectorAll('[data-metric]');
    metricCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            drawPerformanceTrendChart();
        });
    });
}

/**
 * Generate heat map visualization
 */
function generateHeatmap(type) {
    const heatOverlay = document.getElementById('heatOverlay');
    heatOverlay.innerHTML = '';
    
    const points = heatmapData[type] || [];
    
    points.forEach(point => {
        const heatPoint = document.createElement('div');
        heatPoint.className = 'heat-point';
        heatPoint.style.left = `${point.x}%`;
        heatPoint.style.top = `${point.y}%`;
        heatPoint.style.opacity = point.intensity;
        
        // Add size variation based on intensity
        const size = 20 + (point.intensity * 30);
        heatPoint.style.width = `${size}px`;
        heatPoint.style.height = `${size}px`;
        
        heatOverlay.appendChild(heatPoint);
    });
}

/**
 * Draw performance trend chart
 */
function drawPerformanceTrendChart(period = 'week') {
    const canvas = document.getElementById('performanceTrendChart');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get selected metrics
    const selectedMetrics = Array.from(document.querySelectorAll('[data-metric]:checked'))
        .map(cb => cb.dataset.metric);
    
    if (selectedMetrics.length === 0) return;
    
    // Draw chart background
    drawChartBackground(ctx, canvas.width, canvas.height);
    
    // Draw trend lines for each selected metric
    const colors = {
        goals: '#00d4ff',
        assists: '#10b981',
        rating: '#7c3aed',
        stamina: '#f59e0b'
    };
    
    selectedMetrics.forEach(metric => {
        drawTrendLine(ctx, performanceHistory, metric, colors[metric], canvas.width, canvas.height);
    });
    
    // Draw legend
    drawTrendLegend(ctx, selectedMetrics, colors, canvas.width);
}

/**
 * Draw chart background with grid
 */
function drawChartBackground(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

/**
 * Draw trend line for a specific metric
 */
function drawTrendLine(ctx, data, metric, color, width, height) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxValue = Math.max(...data.map(d => d[metric]));
    const stepX = width / (data.length - 1);
    
    data.forEach((point, index) => {
        const x = index * stepX;
        const y = height - (point[metric] / maxValue) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw data points
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    });
    
    ctx.stroke();
}

/**
 * Draw trend chart legend
 */
function drawTrendLegend(ctx, metrics, colors, width) {
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    
    metrics.forEach((metric, index) => {
        const x = width - 150;
        const y = 20 + (index * 20);
        
        // Draw color indicator
        ctx.fillStyle = colors[metric];
        ctx.fillRect(x, y - 5, 12, 12);
        
        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.fillText(metric.charAt(0).toUpperCase() + metric.slice(1), x + 20, y + 4);
    });
}

/**
 * Update predictive analytics
 */
function updatePredictiveAnalytics() {
    // Mock predictions based on current performance
    const avgGoals = performanceHistory.reduce((sum, h) => sum + h.goals, 0) / performanceHistory.length;
    const avgAssists = performanceHistory.reduce((sum, h) => sum + h.assists, 0) / performanceHistory.length;
    
    const seasonGoals = Math.round(avgGoals * 38); // 38 weeks in a season
    const seasonAssists = Math.round(avgAssists * 38);
    
    document.getElementById('predictedGoals').textContent = `${Math.max(1, seasonGoals - 3)}-${seasonGoals + 5}`;
    document.getElementById('predictedAssists').textContent = `${Math.max(0, seasonAssists - 2)}-${seasonAssists + 3}`;
    document.getElementById('predictedValue').textContent = `+${Math.round(15 + Math.random() * 20)}%`;
    
    // Development areas
    updateDevelopmentAreas();
    
    // Risk analysis
    updateRiskAnalysis();
}

/**
 * Update development areas
 */
function updateDevelopmentAreas() {
    const areas = [
        { area: 'Shooting Accuracy', priority: 'high', description: 'Focus on finishing training' },
        { area: 'Passing Range', priority: 'medium', description: 'Practice long-range passes' },
        { area: 'Physical Condition', priority: 'low', description: 'Maintain fitness levels' }
    ];
    
    const container = document.getElementById('developmentAreas');
    container.innerHTML = areas.map(area => `
        <div class="development-item ${area.priority}">
            <div class="development-area">${area.area}</div>
            <div class="development-priority">${area.priority.toUpperCase()}</div>
            <div class="development-desc">${area.description}</div>
        </div>
    `).join('');
}

/**
 * Update risk analysis
 */
function updateRiskAnalysis() {
    const risks = [
        { risk: 'Injury Risk', level: 'low', percentage: '12%' },
        { risk: 'Form Drop', level: 'medium', percentage: '28%' },
        { risk: 'Morale Issues', level: 'low', percentage: '8%' }
    ];
    
    const container = document.getElementById('riskAnalysis');
    container.innerHTML = risks.map(risk => `
        <div class="risk-item ${risk.level}">
            <div class="risk-type">${risk.risk}</div>
            <div class="risk-level ${risk.level}">${risk.level.toUpperCase()}</div>
            <div class="risk-percentage">${risk.percentage}</div>
        </div>
    `).join('');
}

/**
 * Update comparison metrics
 */
function updateComparisonMetrics() {
    const comparisons = [
        { stat: 'Goals per Game', your: 0.8, league: 0.6 },
        { stat: 'Assists per Game', your: 0.4, league: 0.3 },
        { stat: 'Pass Accuracy', your: 85, league: 78 },
        { stat: 'Tackles per Game', your: 2.1, league: 2.8 }
    ];
    
    const container = document.getElementById('comparisonBars');
    container.innerHTML = comparisons.map(comp => {
        const yourPercentage = (comp.your / Math.max(comp.your, comp.league)) * 100;
        const leaguePercentage = (comp.league / Math.max(comp.your, comp.league)) * 100;
        
        return `
            <div class="comparison-row">
                <div class="comparison-label">${comp.stat}</div>
                <div class="comparison-bars-container">
                    <div class="comparison-bar your-bar" style="width: ${yourPercentage}%">
                        <span class="bar-value">${comp.your}</span>
                    </div>
                    <div class="comparison-bar league-bar" style="width: ${leaguePercentage}%">
                        <span class="bar-value">${comp.league}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        navigateWithTransition('index.html');
    });
}

/**
 * Update performance overview cards
 */
function updatePerformanceOverview(player) {
    const stats = player.careerStats || { goals: 0, assists: 0, matches: 0, wins: 0 };
    const winRate = stats.matches > 0 ? ((stats.wins / stats.matches) * 100).toFixed(1) : 0;
    
    document.getElementById('totalGoals').textContent = stats.goals;
    document.getElementById('totalAssists').textContent = stats.assists;
    document.getElementById('winRate').textContent = `${winRate}%`;
    document.getElementById('marketValue').textContent = formatCurrency(player.marketValue || 0);
    
    // Calculate trends (mock data for now - would need historical data)
    updateTrend('goalsTrend', '+2', 'positive');
    updateTrend('assistsTrend', '+1', 'positive');
    updateTrend('winRateTrend', '+5%', 'positive');
    updateTrend('valueTrend', '+€50K', 'positive');
}

/**
 * Update trend indicators
 */
function updateTrend(elementId, value, type) {
    const element = document.getElementById(elementId);
    element.textContent = value;
    element.className = `stat-trend ${type}`;
}

/**
 * Update form and morale displays
 */
function updateFormAndMorale(player) {
    const form = player.form || 7;
    const morale = player.morale || 8;
    const stamina = player.stats.stamina || 75;
    
    // Update form
    updateMeter('formFill', 'formValue', form, 10);
    document.getElementById('formDescription').textContent = getFormDescription(form);
    
    // Update morale
    updateMeter('moraleFill', 'moraleValue', morale, 10);
    document.getElementById('moraleDescription').textContent = getMoraleDescription(morale);
    
    // Update condition
    updateCondition(stamina);
}

/**
 * Update meter displays
 */
function updateMeter(fillId, valueId, value, max) {
    const percentage = (value / max) * 100;
    const fillElement = document.getElementById(fillId);
    const valueElement = document.getElementById(valueId);
    
    setTimeout(() => {
        fillElement.style.width = `${percentage}%`;
        valueElement.textContent = `${value}/${max}`;
    }, 500);
}

/**
 * Update physical condition
 */
function updateCondition(stamina) {
    const conditionStatus = document.getElementById('conditionStatus');
    const staminaFill = document.getElementById('staminaFill');
    
    let condition, icon;
    if (stamina >= 80) {
        condition = 'Excellent';
        icon = '💪';
    } else if (stamina >= 60) {
        condition = 'Good';
        icon = '👍';
    } else if (stamina >= 40) {
        condition = 'Tired';
        icon = '😴';
    } else {
        condition = 'Exhausted';
        icon = '😵';
    }
    
    conditionStatus.querySelector('.condition-icon').textContent = icon;
    conditionStatus.querySelector('.condition-text').textContent = condition;
    
    setTimeout(() => {
        staminaFill.style.width = `${stamina}%`;
    }, 700);
}

/**
 * Get form description
 */
function getFormDescription(form) {
    if (form >= 9) return 'Exceptional Form';
    if (form >= 7) return 'Good Form';
    if (form >= 5) return 'Average Form';
    if (form >= 3) return 'Poor Form';
    return 'Terrible Form';
}

/**
 * Get morale description
 */
function getMoraleDescription(morale) {
    if (morale >= 9) return 'Sky High';
    if (morale >= 7) return 'High Morale';
    if (morale >= 5) return 'Content';
    if (morale >= 3) return 'Low Morale';
    return 'Depressed';
}

/**
 * Update career statistics
 */
function updateCareerStats(player) {
    const stats = player.careerStats || {};
    
    const updates = [
        { id: 'matchesPlayed', value: stats.matches || 0 },
        { id: 'goalsScored', value: stats.goals || 0 },
        { id: 'assistsMade', value: stats.assists || 0 },
        { id: 'winsCount', value: stats.wins || 0 },
        { id: 'drawsCount', value: stats.draws || 0 },
        { id: 'lossesCount', value: stats.losses || 0 },
        { id: 'goalsPer', value: stats.matches > 0 ? (stats.goals / stats.matches).toFixed(2) : '0.00' },
        { id: 'assistsPer', value: stats.matches > 0 ? (stats.assists / stats.matches).toFixed(2) : '0.00' }
    ];
    
    updates.forEach(({ id, value }, index) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                element.textContent = value;
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

/**
 * Draw attribute chart using Canvas
 */
function drawAttributeChart(stats) {
    const canvas = document.getElementById('attributeChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;
    
    const attributes = [
        { name: 'Speed', value: stats.speed, color: '#00d4ff' },
        { name: 'Shooting', value: stats.shooting, color: '#7c3aed' },
        { name: 'Passing', value: stats.passing, color: '#10b981' },
        { name: 'Defense', value: stats.defense, color: '#f59e0b' },
        { name: 'Stamina', value: stats.stamina, color: '#ef4444' },
        { name: 'Intelligence', value: stats.intelligence || 75, color: '#8b5cf6' }
    ];
    
    // Draw radar chart
    setTimeout(() => {
        drawRadarChart(ctx, centerX, centerY, radius, attributes);
    }, 1000);
}

/**
 * Draw radar chart
 */
function drawRadarChart(ctx, centerX, centerY, radius, attributes) {
    const angleStep = (2 * Math.PI) / attributes.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
        const gridRadius = (radius / 5) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw axes
    for (let i = 0; i < attributes.length; i++) {
        const angle = -Math.PI / 2 + angleStep * i;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw labels
        const labelX = centerX + Math.cos(angle) * (radius + 30);
        const labelY = centerY + Math.sin(angle) * (radius + 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(attributes[i].name, labelX, labelY);
    }
    
    // Draw data polygon
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
    ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < attributes.length; i++) {
        const angle = -Math.PI / 2 + angleStep * i;
        const value = attributes[i].value;
        const pointRadius = (radius * value) / 100;
        const x = centerX + Math.cos(angle) * pointRadius;
        const y = centerY + Math.sin(angle) * pointRadius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw value points
        ctx.save();
        ctx.fillStyle = attributes[i].color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

/**
 * Update match history (mock data for now)
 */
function updateMatchHistory() {
    const matchHistory = document.getElementById('matchHistory');
    
    // Mock recent matches - would come from game state in real implementation
    const recentMatches = [
        { opponent: 'Arsenal', result: 'W', score: '3-1', performance: 8.5, goals: 2, assists: 1 },
        { opponent: 'Chelsea', result: 'D', score: '1-1', performance: 7.0, goals: 0, assists: 1 },
        { opponent: 'Liverpool', result: 'L', score: '0-2', performance: 6.0, goals: 0, assists: 0 },
        { opponent: 'Man City', result: 'W', score: '2-0', performance: 9.0, goals: 1, assists: 1 },
        { opponent: 'Tottenham', result: 'W', score: '4-2', performance: 8.8, goals: 3, assists: 0 }
    ];
    
    matchHistory.innerHTML = recentMatches.map(match => `
        <div class=\"match-item ${match.result.toLowerCase()}\">
            <div class=\"match-opponent\">${match.opponent}</div>
            <div class=\"match-result ${match.result.toLowerCase()}\">${match.result}</div>
            <div class=\"match-score\">${match.score}</div>
            <div class=\"match-performance\">
                <span class=\"performance-rating\">${match.performance}</span>
                <div class=\"performance-details\">
                    ⚽${match.goals} 🎯${match.assists}
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Update injury history
 */
function updateInjuryHistory(injuries) {
    const injurySection = document.getElementById('injurySection');
    const injuryHistory = document.getElementById('injuryHistory');
    
    if (injuries && injuries.length > 0) {
        injurySection.style.display = 'block';
        
        injuryHistory.innerHTML = injuries.map(injury => `
            <div class=\"injury-item ${injury.severity}\">
                <div class=\"injury-type\">${injury.type}</div>
                <div class=\"injury-duration\">${injury.recoveryWeeks} weeks</div>
                <div class=\"injury-week\">Week ${injury.week}</div>
            </div>
        `).join('');
    } else {
        injurySection.style.display = 'none';
    }
}

/**
 * Animate elements entrance
 */
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

/**
 * Show no data message
 */
function showNoDataMessage() {
    document.querySelector('.analytics-dashboard').innerHTML = `
        <div class="no-data-message">
            <h2>📊 No Player Data</h2>
            <p>Create a player first to view analytics.</p>
            <button onclick="navigateWithTransition('creation.html')" class="create-player-btn">
                Create Player
            </button>
        </div>
    `;
}

/**
 * Show error message
 */
function showErrorMessage() {
    document.querySelector('.analytics-dashboard').innerHTML = `
        <div class="error-message">
            <h2>❌ Error Loading Data</h2>
            <p>Unable to load analytics data. Please try again.</p>
            <button onclick="location.reload()" class="retry-btn">
                Retry
            </button>
        </div>
    `;
}

/**
 * Navigate with transition
 */
function navigateWithTransition(url) {
    const dashboard = document.querySelector('.dashboard-container');
    
    dashboard.style.transition = 'all 0.5s ease';
    dashboard.style.opacity = '0';
    dashboard.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

/**
 * Format currency values
 */
function formatCurrency(value) {
    if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(0)}K`;
    } else {
        return `€${value}`;
    }
}