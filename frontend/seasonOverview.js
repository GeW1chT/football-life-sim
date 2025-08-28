// frontend/seasonOverview.js

document.addEventListener('DOMContentLoaded', () => {
    loadSeasonData();
    setupEventListeners();
});

/**
 * Load season data and populate the UI
 */
async function loadSeasonData() {
    try {
        const seasonStats = await window.footballAPI.getSeasonStats();
        
        if (!seasonStats || !seasonStats.current) {
            showNoSeasonMessage();
            return;
        }

        const season = seasonStats.current;
        const progress = seasonStats.progress;
        const playerStats = seasonStats.stats;
        const teamStats = seasonStats.teamStats;

        // Update season progress
        updateSeasonProgress(season, progress);
        
        // Update player statistics
        updatePlayerStats(playerStats);
        
        // Update team performance
        updateTeamStats(teamStats);
        
        // Update objectives
        updateObjectives(season.objectives, playerStats);
        
        // Update achievements and awards
        updateAchievements(playerStats.milestones);
        
        // Update key matches
        updateKeyMatches(season.keyMatches);
        
        // Check if season is near end
        if (progress.percentage > 90) {
            document.getElementById('endSeasonBtn').style.display = 'inline-flex';
        }

    } catch (error) {
        console.error('Error loading season data:', error);
        showErrorMessage();
    }
}

/**
 * Update season progress display
 */
function updateSeasonProgress(season, progress) {
    document.getElementById('seasonTitle').textContent = `Season ${season.seasonNumber}`;
    document.getElementById('currentWeek').textContent = `Week ${progress.week}`;
    document.getElementById('remainingWeeks').textContent = `${progress.remaining} weeks remaining`;
    
    // Update progress bar
    const progressBar = document.getElementById('seasonProgressBar');
    progressBar.style.width = `${Math.min(progress.percentage, 100)}%`;
    
    // Update league info
    document.getElementById('leagueName').textContent = season.league.name;
    document.getElementById('leagueCountry').textContent = season.league.country;
    
    // Update status
    const statusElement = document.getElementById('seasonStatus');
    if (progress.percentage >= 100) {
        statusElement.textContent = 'Completed';
        statusElement.className = 'season-status completed';
    } else if (progress.percentage > 75) {
        statusElement.textContent = 'Final Stretch';
        statusElement.className = 'season-status final';
    } else {
        statusElement.textContent = 'Active';
        statusElement.className = 'season-status active';
    }
}

/**
 * Update player statistics
 */
function updatePlayerStats(stats) {
    document.getElementById('totalGoals').textContent = stats.goals || 0;
    document.getElementById('totalAssists').textContent = stats.assists || 0;
    document.getElementById('averageRating').textContent = (stats.averageRating || 0).toFixed(1);
    document.getElementById('matchesPlayed').textContent = stats.matchesPlayed || 0;
    
    // Calculate per-game stats
    const gamesPlayed = Math.max(stats.matchesPlayed, 1);
    document.getElementById('goalsPerGame').textContent = `${(stats.goals / gamesPlayed).toFixed(1)} per game`;
    document.getElementById('assistsPerGame').textContent = `${(stats.assists / gamesPlayed).toFixed(1)} per game`;
    
    // Appearance rate
    const maxGames = 38; // Typical season length
    const appearanceRate = ((stats.matchesPlayed / maxGames) * 100).toFixed(0);
    document.getElementById('appearanceRate').textContent = `${appearanceRate}% of games`;
    
    // Rating trend
    const rating = stats.averageRating || 0;
    let ratingTrend = 'Poor';
    if (rating >= 8.5) ratingTrend = 'Exceptional';
    else if (rating >= 7.5) ratingTrend = 'Excellent';
    else if (rating >= 6.5) ratingTrend = 'Good';
    else if (rating >= 5.5) ratingTrend = 'Average';
    
    document.getElementById('ratingTrend').textContent = ratingTrend;
}

/**
 * Update team statistics
 */
function updateTeamStats(teamStats) {
    document.getElementById('leaguePosition').textContent = teamStats.leaguePosition || '-';
    document.getElementById('teamPoints').textContent = teamStats.points || 0;
    document.getElementById('teamWins').textContent = teamStats.wins || 0;
    document.getElementById('teamDraws').textContent = teamStats.draws || 0;
    document.getElementById('teamLosses').textContent = teamStats.losses || 0;
    
    // Points per game
    const gamesPlayed = Math.max(teamStats.matchesPlayed, 1);
    const ppg = (teamStats.points / gamesPlayed).toFixed(1);
    document.getElementById('pointsPerGame').textContent = `${ppg} per game`;
    
    // Position change (would need historical data)
    document.getElementById('positionChange').textContent = 'Stable';
}

/**
 * Update season objectives
 */
function updateObjectives(objectives, playerStats) {
    const container = document.getElementById('objectivesContainer');
    container.innerHTML = '';
    
    if (!objectives || objectives.length === 0) {
        container.innerHTML = '<p class="no-data">No objectives set for this season.</p>';
        return;
    }
    
    objectives.forEach(objective => {
        const objectiveDiv = document.createElement('div');
        objectiveDiv.className = 'objective-item';
        
        // Check completion
        let current = 0;
        let isCompleted = false;
        
        switch (objective.type) {
            case 'goals':
                current = playerStats.goals || 0;
                isCompleted = current >= objective.target;
                break;
            case 'assists':
                current = playerStats.assists || 0;
                isCompleted = current >= objective.target;
                break;
            case 'rating':
                current = playerStats.averageRating || 0;
                isCompleted = current >= objective.target;
                break;
            case 'appearances':
                current = playerStats.matchesPlayed || 0;
                isCompleted = current >= objective.target;
                break;
        }
        
        const progressPercentage = Math.min((current / objective.target) * 100, 100);
        
        objectiveDiv.innerHTML = `
            <div class="objective-header">
                <h4>${objective.description}</h4>
                <span class="objective-status ${isCompleted ? 'completed' : 'in-progress'}">
                    ${isCompleted ? '✅ Completed' : '🎯 In Progress'}
                </span>
            </div>
            <div class="objective-progress">
                <div class="progress-bar">
                    <div class="progress-fill ${isCompleted ? 'completed' : ''}" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text">
                    <span>${current} / ${objective.target}</span>
                    <span class="priority-badge ${objective.priority}">${objective.priority}</span>
                </div>
            </div>
        `;
        
        container.appendChild(objectiveDiv);
    });
}

/**
 * Update achievements display
 */
function updateAchievements(milestones) {
    const container = document.getElementById('achievementsList');
    container.innerHTML = '';
    
    if (!milestones || milestones.length === 0) {
        container.innerHTML = '<p class="no-data">No achievements yet this season.</p>';
        return;
    }
    
    // Show recent milestones (last 5)
    const recentMilestones = milestones.slice(-5).reverse();
    
    recentMilestones.forEach(milestone => {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement-item';
        
        let icon = '🏅';
        if (milestone.type === 'hat_trick') icon = '⚽⚽⚽';
        else if (milestone.type === 'goals_milestone') icon = '🎯';
        
        achievementDiv.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-content">
                <h4>${milestone.description}</h4>
                <p>Week ${milestone.week}</p>
            </div>
            <div class="achievement-date">
                ${new Date(milestone.date).toLocaleDateString()}
            </div>
        `;
        
        container.appendChild(achievementDiv);
    });
}

/**
 * Update key matches display
 */
function updateKeyMatches(keyMatches) {
    const container = document.getElementById('keyMatchesContainer');
    container.innerHTML = '';
    
    if (!keyMatches || keyMatches.length === 0) {
        container.innerHTML = '<p class="no-data">No key matches recorded yet.</p>';
        return;
    }
    
    // Show recent key matches (last 5)
    const recentMatches = keyMatches.slice(-5).reverse();
    
    recentMatches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'key-match-item';
        
        let resultClass = match.result;
        let resultIcon = match.result === 'win' ? '✅' : match.result === 'draw' ? '🤝' : '❌';
        
        matchDiv.innerHTML = `
            <div class="match-result ${resultClass}">
                <span class="result-icon">${resultIcon}</span>
                <span class="result-text">${match.result.toUpperCase()}</span>
            </div>
            <div class="match-details">
                <h4>vs ${match.opponent}</h4>
                <p class="score">${match.score}</p>
                <p class="rating">Rating: ${match.playerRating}/10</p>
            </div>
            <div class="match-week">
                Week ${match.week}
            </div>
        `;
        
        container.appendChild(matchDiv);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    document.getElementById('seasonHistoryBtn').addEventListener('click', async () => {
        // Navigate to season history page (to be created)
        console.log('Season history clicked');
    });
    
    document.getElementById('endSeasonBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to end the current season?')) {
            try {
                const result = await window.footballAPI.endCurrentSeason();
                if (result) {
                    alert(`Season completed! Final grade: ${result.seasonSummary?.performanceGrade || 'N/A'}`);
                    document.getElementById('newSeasonBtn').style.display = 'inline-flex';
                    document.getElementById('endSeasonBtn').style.display = 'none';
                }
            } catch (error) {
                console.error('Error ending season:', error);
                alert('Error ending season. Please try again.');
            }
        }
    });
    
    document.getElementById('newSeasonBtn').addEventListener('click', async () => {
        try {
            const leagueInfo = {
                name: 'Premier League',
                country: 'England',
                division: 1,
                prestige: 90
            };
            
            const result = await window.footballAPI.startNewSeason(leagueInfo);
            if (result.success) {
                alert('New season started! Good luck!');
                location.reload(); // Refresh the page to show new season
            }
        } catch (error) {
            console.error('Error starting new season:', error);
            alert('Error starting new season. Please try again.');
        }
    });
}

/**
 * Show message when no season is active
 */
function showNoSeasonMessage() {
    document.querySelector('.dashboard-container').innerHTML = `
        <div class="dashboard-header">
            <h1>📊 Season Overview</h1>
            <button id="backBtn" class="back-button" onclick="window.location.href='index.html'">
                <span class="btn-icon">←</span>
                <span class="btn-text">Back to Dashboard</span>
            </button>
        </div>
        <div class="no-season-message">
            <div class="empty-state">
                <div class="empty-icon">🏆</div>
                <h2>No Active Season</h2>
                <p>Start a new season to begin tracking your football career statistics.</p>
                <button id="startSeasonBtn" class="action-btn primary">
                    <span class="btn-icon">🆕</span>
                    <span class="btn-text">Start New Season</span>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('startSeasonBtn').addEventListener('click', async () => {
        try {
            const leagueInfo = {
                name: 'Premier League',
                country: 'England',
                division: 1,
                prestige: 90
            };
            
            const result = await window.footballAPI.startNewSeason(leagueInfo);
            if (result.success) {
                location.reload();
            }
        } catch (error) {
            console.error('Error starting season:', error);
        }
    });
}

/**
 * Show error message
 */
function showErrorMessage() {
    document.querySelector('.dashboard-container').innerHTML = `
        <div class="dashboard-header">
            <h1>📊 Season Overview</h1>
            <button id="backBtn" class="back-button" onclick="window.location.href='index.html'">
                <span class="btn-icon">←</span>
                <span class="btn-text">Back to Dashboard</span>
            </button>
        </div>
        <div class="error-message">
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h2>Error Loading Season Data</h2>
                <p>There was a problem loading your season information.</p>
                <button onclick="location.reload()" class="action-btn primary">
                    <span class="btn-icon">🔄</span>
                    <span class="btn-text">Retry</span>
                </button>
            </div>
        </div>
    `;
}