// frontend/worldLeagues.js
let worldData = null;
let playerData = null;
let filteredLeagues = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeWorldLeagues();
    setupEventListeners();
});

async function initializeWorldLeagues() {
    try {
        [worldData, playerData] = await Promise.all([
            window.footballAPI.getWorldLeaguesData(),
            window.footballAPI.getPlayerInfo()
        ]);
        
        if (worldData && playerData) {
            updateContinentsOverview();
            updateLeagueFilters();
            updateLeaguesList();
            updateTransferTargets();
            animateElements();
        } else {
            showNoDataMessage();
        }
    } catch (error) {
        console.error('Error loading world leagues data:', error);
        showErrorMessage();
    }
}

function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        navigateWithTransition('index.html');
    });
    
    // Modal click outside to close
    document.getElementById('leagueModal').addEventListener('click', (e) => {
        if (e.target.id === 'leagueModal') {
            closeLeagueModal();
        }
    });
    
    document.getElementById('teamModal').addEventListener('click', (e) => {
        if (e.target.id === 'teamModal') {
            closeTeamModal();
        }
    });
}

function updateContinentsOverview() {
    if (!worldData) return;
    
    const continentsGrid = document.getElementById('continentsGrid');
    const continents = worldData.continents;
    
    continentsGrid.innerHTML = Object.values(continents).map(continent => {
        const countryCount = continent.countries.length;
        const leagueCount = getLeagueCountByContinent(continent.id);
        const topCountries = continent.countries.slice(0, 3).map(countryId => 
            worldData.countries[countryId]?.name || countryId
        );
        
        return `
            <div class="continent-card" onclick="filterByContinent('${continent.id}')">
                <div class="continent-header">
                    <h3 class="continent-title">${continent.name}</h3>
                    <div class="continent-prestige-badge">
                        <span class="prestige-label">Prestige</span>
                        <span class="prestige-value">${continent.prestige}</span>
                    </div>
                </div>
                
                <div class="continent-stats-grid">
                    <div class="stat-box">
                        <div class="stat-number">${countryCount}</div>
                        <div class="stat-label">Countries</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${leagueCount}</div>
                        <div class="stat-label">Leagues</div>
                    </div>
                </div>
                
                <div class="continent-countries-preview">
                    <div class="countries-title">Featured Countries</div>
                    <div class="countries-list">
                        ${topCountries.join(' • ')}
                        ${countryCount > 3 ? `<span class="more-countries">+${countryCount - 3} more</span>` : ''}
                    </div>
                </div>
                
                <div class="continent-overlay">
                    <span class="view-leagues-text">Click to view leagues</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateLeagueFilters() {
    if (!worldData) return;
    
    // Populate continent filter
    const continentFilter = document.getElementById('continentFilter');
    continentFilter.innerHTML = '<option value="all">All Continents</option>' +
        Object.values(worldData.continents).map(continent => 
            `<option value="${continent.id}">${continent.name}</option>`
        ).join('');
    
    // Populate country filter
    updateCountryFilter();
}

function updateCountryFilter() {
    const countryFilter = document.getElementById('countryFilter');
    const selectedContinent = document.getElementById('continentFilter').value;
    
    if (selectedContinent === 'all') {
        countryFilter.innerHTML = '<option value="all">All Countries</option>' +
            Object.values(worldData.countries).map(country => 
                `<option value="${country.id}">${country.name}</option>`
            ).join('');
    } else {
        const continent = worldData.continents[selectedContinent];
        countryFilter.innerHTML = '<option value="all">All Countries</option>' +
            continent.countries.map(countryId => {
                const country = worldData.countries[countryId];
                return `<option value="${country.id}">${country.name}</option>`;
            }).join('');
    }
}

function updateLeaguesList() {
    if (!worldData) return;
    
    filteredLeagues = Object.values(worldData.leagues);
    filterLeagues();
}

function filterLeagues() {
    if (!worldData) return;
    
    const continentFilter = document.getElementById('continentFilter').value;
    const countryFilter = document.getElementById('countryFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;
    const prestigeFilter = parseInt(document.getElementById('prestigeFilter').value);
    
    filteredLeagues = Object.values(worldData.leagues).filter(league => {
        // Filter by continent
        if (continentFilter !== 'all') {
            const country = worldData.countries[league.country];
            if (!country || country.continent !== continentFilter) return false;
        }
        
        // Filter by country
        if (countryFilter !== 'all' && league.country !== countryFilter) return false;
        
        // Filter by level
        if (levelFilter !== 'all' && league.level !== parseInt(levelFilter)) return false;
        
        // Filter by prestige
        if (league.prestige < prestigeFilter) return false;
        
        return true;
    });
    
    // Sort by prestige (highest first)
    filteredLeagues.sort((a, b) => b.prestige - a.prestige);
    
    // Update country filter options based on continent selection
    if (continentFilter !== 'all') {
        updateCountryFilter();
    }
    
    // Display filtered leagues
    displayLeagues();
}

function displayLeagues() {
    const leaguesList = document.getElementById('leaguesList');
    
    if (filteredLeagues.length === 0) {
        leaguesList.innerHTML = '<div class="no-leagues-message">No leagues found matching your criteria.</div>';
        return;
    }
    
    leaguesList.innerHTML = filteredLeagues.map(league => {
        const country = worldData.countries[league.country];
        const teamCount = league.teamIds ? league.teamIds.length : league.teams;
        
        return `
            <div class="league-card" onclick="showLeagueModal('${league.id}')">
                <div class="league-header">
                    <h3>${league.name}</h3>
                    <div class="league-badges">
                        <span class="country-badge">${country?.name || league.country}</span>
                        <span class="level-badge">Level ${league.level}</span>
                        <span class="prestige-badge prestige-${getPrestigeClass(league.prestige)}">${league.prestige}</span>
                    </div>
                </div>
                <div class="league-stats">
                    <div class="stat-item">
                        <span class="stat-label">Teams:</span>
                        <span class="stat-value">${teamCount}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Salary:</span>
                        <span class="stat-value">€${league.averageSalary.toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Currency:</span>
                        <span class="stat-value">${country?.currency || 'EUR'}</span>
                    </div>
                </div>
                <div class="league-promotion">
                    ${league.promotion ? `
                        <div class="promotion-info">
                            <span class="promotion-label">Promotes to:</span>
                            <span class="promotion-league">${worldData.leagues[league.promotion]?.name || league.promotion}</span>
                        </div>
                    ` : '<div class="top-division">🏆 Top Division</div>'}
                </div>
            </div>
        `;
    }).join('');
}

async function updateTransferTargets() {
    if (!playerData) return;
    
    try {
        const transferTargets = await window.footballAPI.getTransferTargets();
        const targetsContainer = document.getElementById('transferTargets');
        
        if (transferTargets.length === 0) {
            targetsContainer.innerHTML = '<div class="no-targets-message">No suitable transfer targets found for your level.</div>';
            return;
        }
        
        targetsContainer.innerHTML = transferTargets.map(team => {
            const league = worldData.leagues[team.league];
            const country = worldData.countries[league?.country];
            
            return `
                <div class="transfer-target-card" onclick="showTeamModal('${team.id}')">
                    <div class="team-header">
                        <h4>${team.name}</h4>
                        <div class="team-prestige">⭐ ${team.prestige}</div>
                    </div>
                    <div class="team-info">
                        <div class="info-item">
                            <span class="info-label">League:</span>
                            <span class="info-value">${league?.name || team.league}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Country:</span>
                            <span class="info-value">${country?.name || league?.country || 'Unknown'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Budget:</span>
                            <span class="info-value">€${team.budget.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="team-stats">
                        <div class="stat-small">
                            <span>W:</span>
                            <span>${team.stats?.wins || 0}</span>
                        </div>
                        <div class="stat-small">
                            <span>D:</span>
                            <span>${team.stats?.draws || 0}</span>
                        </div>
                        <div class="stat-small">
                            <span>L:</span>
                            <span>${team.stats?.losses || 0}</span>
                        </div>
                        <div class="stat-small">
                            <span>Pts:</span>
                            <span>${team.stats?.points || 0}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading transfer targets:', error);
        document.getElementById('transferTargets').innerHTML = '<div class="error-message">Failed to load transfer targets.</div>';
    }
}

async function showLeagueModal(leagueId) {
    const league = worldData.leagues[leagueId];
    if (!league) return;
    
    document.getElementById('leagueModalTitle').textContent = league.name;
    
    const country = worldData.countries[league.country];
    const leagueInfo = document.getElementById('leagueInfo');
    
    leagueInfo.innerHTML = `
        <div class="league-details">
            <div class="detail-section">
                <h4>League Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Country:</span>
                        <span class="detail-value">${country?.name || league.country}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Level:</span>
                        <span class="detail-value">${league.level} (${league.level === 1 ? 'Top Division' : `${getOrdinal(league.level)} Division`})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Teams:</span>
                        <span class="detail-value">${league.teamIds ? league.teamIds.length : league.teams}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Prestige:</span>
                        <span class="detail-value">${league.prestige}/100</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Average Salary:</span>
                        <span class="detail-value">€${league.averageSalary.toLocaleString()}/week</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Currency:</span>
                        <span class="detail-value">${country?.currency || 'EUR'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Promotion/Relegation</h4>
                <div class="promotion-relegation">
                    ${league.promotion ? `
                        <div class="promotion">
                            <span class="pr-label">Promotes to:</span>
                            <span class="pr-value">${worldData.leagues[league.promotion]?.name || league.promotion}</span>
                        </div>
                    ` : '<div class="top-league">🏆 This is the top division</div>'}
                    
                    ${league.relegation ? `
                        <div class="relegation">
                            <span class="pr-label">Relegates to:</span>
                            <span class="pr-value">${worldData.leagues[league.relegation]?.name || league.relegation}</span>
                        </div>
                    ` : '<div class="no-relegation">No relegation from this league</div>'}
                </div>
            </div>
        </div>
    `;
    
    // Load league table
    try {
        const leagueTable = await window.footballAPI.getLeagueTable(leagueId);
        displayLeagueTable(leagueTable);
    } catch (error) {
        console.error('Error loading league table:', error);
        document.getElementById('leagueTable').innerHTML = '<div class="error-message">Failed to load league table.</div>';
    }
    
    const modal = document.getElementById('leagueModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

function displayLeagueTable(teams) {
    const tableContainer = document.getElementById('leagueTable');
    
    if (!teams || teams.length === 0) {
        tableContainer.innerHTML = '<div class="no-data-message">No table data available.</div>';
        return;
    }
    
    tableContainer.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
                ${teams.map((team, index) => {
                    const goalDiff = team.stats.goalsFor - team.stats.goalsAgainst;
                    const totalGames = team.stats.wins + team.stats.draws + team.stats.losses;
                    
                    return `
                        <tr class="table-row" onclick="showTeamModal('${team.id}')">
                            <td class="position">${index + 1}</td>
                            <td class="team-name">${team.name}</td>
                            <td>${totalGames}</td>
                            <td>${team.stats.wins}</td>
                            <td>${team.stats.draws}</td>
                            <td>${team.stats.losses}</td>
                            <td>${team.stats.goalsFor}</td>
                            <td>${team.stats.goalsAgainst}</td>
                            <td class="${goalDiff >= 0 ? 'positive' : 'negative'}">${goalDiff >= 0 ? '+' : ''}${goalDiff}</td>
                            <td class="points">${team.stats.points}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function showTeamModal(teamId) {
    const team = worldData.teams[teamId];
    if (!team) return;
    
    document.getElementById('teamModalTitle').textContent = team.name;
    
    const league = worldData.leagues[team.league];
    const country = worldData.countries[team.country];
    
    document.getElementById('teamInfo').innerHTML = `
        <div class="team-details">
            <div class="team-overview">
                <div class="team-basic-info">
                    <div class="info-item">
                        <span class="info-label">League:</span>
                        <span class="info-value">${league?.name || team.league}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Country:</span>
                        <span class="info-value">${country?.name || team.country}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Stadium:</span>
                        <span class="info-value">${team.stadium || `${team.name} Stadium`}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Founded:</span>
                        <span class="info-value">${team.founded || 'Unknown'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Prestige:</span>
                        <span class="info-value">${team.prestige}/100</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Budget:</span>
                        <span class="info-value">€${team.budget.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="team-season-stats">
                    <h4>Season Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-number">${team.stats.wins}</div>
                            <div class="stat-label">Wins</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${team.stats.draws}</div>
                            <div class="stat-label">Draws</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${team.stats.losses}</div>
                            <div class="stat-label">Losses</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${team.stats.points}</div>
                            <div class="stat-label">Points</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${team.stats.goalsFor}</div>
                            <div class="stat-label">Goals For</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${team.stats.goalsAgainst}</div>
                            <div class="stat-label">Goals Against</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('teamModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeLeagueModal() {
    const modal = document.getElementById('leagueModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function closeTeamModal() {
    const modal = document.getElementById('teamModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function filterByContinent(continentId) {
    document.getElementById('continentFilter').value = continentId;
    document.getElementById('countryFilter').value = 'all';
    document.getElementById('levelFilter').value = 'all';
    document.getElementById('prestigeFilter').value = '0';
    filterLeagues();
}

async function refreshTransferTargets() {
    await updateTransferTargets();
}

// Utility functions
function getLeagueCountByContinent(continentId) {
    const continent = worldData.continents[continentId];
    let count = 0;
    
    continent.countries.forEach(countryId => {
        const country = worldData.countries[countryId];
        if (country && country.leagues) {
            count += country.leagues.length;
        }
    });
    
    return count;
}

function getPrestigeClass(prestige) {
    if (prestige >= 90) return 'elite';
    if (prestige >= 70) return 'high';
    if (prestige >= 50) return 'medium';
    return 'low';
}

function getOrdinal(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
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
    window.location.href = url;
}

function showNoDataMessage() {
    document.querySelector('.world-leagues-dashboard').innerHTML = 
        '<div class="no-data-message"><h2>🌍 World Leagues Not Available</h2><p>Unable to load world leagues data.</p></div>';
}

function showErrorMessage() {
    document.querySelector('.world-leagues-dashboard').innerHTML = 
        '<div class="error-message"><h2>❌ Error</h2><p>Failed to load world leagues data.</p></div>';
}