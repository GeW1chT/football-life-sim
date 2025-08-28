// frontend/creation.js
let worldData = null;
let selectedLeague = null;
let selectedTeam = null;
let availableSkillPoints = 15;
let attributeValues = {};

document.addEventListener('DOMContentLoaded', () => {
    initializeCreationSystem();
    setupEventListeners();
});

async function initializeCreationSystem() {
    try {
        // Load world leagues data
        worldData = await window.footballAPI.getWorldLeaguesData();
        
        if (worldData) {
            populateNationalityOptions();
            setupAttributeSystem();
            updatePreview();
        } else {
            console.error('Failed to load world data');
            alert('Failed to load game data. Please try again.');
        }
    } catch (error) {
        console.error('Error initializing creation system:', error);
        alert('Error loading game data. Please try again.');
    }
}

function setupEventListeners() {
    // Form input listeners
    document.getElementById('playerNameInput').addEventListener('input', updatePreview);
    document.getElementById('playerAgeInput').addEventListener('change', updatePreview);
    document.getElementById('playerNationalitySelect').addEventListener('change', updatePreview);
    document.getElementById('playerPositionSelect').addEventListener('change', () => {
        setupAttributeSystem();
        updatePreview();
    });
    document.getElementById('startingLeagueSelect').addEventListener('change', updatePreview);
    document.getElementById('startingTeamSelect').addEventListener('change', updatePreview);
    document.getElementById('careerAmbitionSelect').addEventListener('change', () => {
        updateAmbitionDescription();
        updatePreview();
    });
    
    // Create player button
    document.getElementById('createPlayerBtn').addEventListener('click', createPlayer);
    
    // Update ambition description initially
    updateAmbitionDescription();
}

function populateNationalityOptions() {
    const nationalitySelect = document.getElementById('playerNationalitySelect');
    const countries = worldData.countries;
    
    // Sort countries by name
    const sortedCountries = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));
    
    nationalitySelect.innerHTML = '<option value="">Choose your country...</option>' +
        sortedCountries.map(country => 
            `<option value="${country.id}">${getFlagEmoji(country.id)} ${country.name}</option>`
        ).join('');
}

function updateLeagueOptions() {
    const nationalitySelect = document.getElementById('playerNationalitySelect');
    const leagueSelect = document.getElementById('startingLeagueSelect');
    const selectedCountry = nationalitySelect.value;
    
    if (!selectedCountry) {
        leagueSelect.innerHTML = '<option value="">Choose a league...</option>';
        updateTeamOptions();
        validateForm();
        return;
    }
    
    const country = worldData.countries[selectedCountry];
    if (!country || !country.leagues) {
        leagueSelect.innerHTML = '<option value="">No leagues available</option>';
        updateTeamOptions();
        validateForm();
        return;
    }
    
    // Get leagues for the selected country and add top leagues from other countries
    const countryLeagues = country.leagues.map(leagueId => worldData.leagues[leagueId]).filter(league => league);
    const topLeagues = Object.values(worldData.leagues)
        .filter(league => league.prestige >= 70 && !country.leagues.includes(league.id))
        .sort((a, b) => b.prestige - a.prestige)
        .slice(0, 10);
    
    let options = '<option value="">Choose a league...</option>';
    
    if (countryLeagues.length > 0) {
        options += '<optgroup label="Home Country Leagues">';
        countryLeagues.forEach(league => {
            options += `<option value="${league.id}">${league.name} (Level ${league.level})</option>`;
        });
        options += '</optgroup>';
    }
    
    if (topLeagues.length > 0) {
        options += '<optgroup label="Top International Leagues">';
        topLeagues.forEach(league => {
            const leagueCountry = worldData.countries[league.country];
            options += `<option value="${league.id}">${league.name} (${leagueCountry?.name || league.country})</option>`;
        });
        options += '</optgroup>';
    }
    
    leagueSelect.innerHTML = options;
    updateTeamOptions();
    validateForm();
}

function updateTeamOptions() {
    const leagueSelect = document.getElementById('startingLeagueSelect');
    const teamSelect = document.getElementById('startingTeamSelect');
    const selectedLeagueId = leagueSelect.value;
    
    teamSelect.innerHTML = '<option value="random">🎲 Random Team</option>';
    
    if (!selectedLeagueId) {
        validateForm();
        return;
    }
    
    selectedLeague = worldData.leagues[selectedLeagueId];
    if (!selectedLeague || !selectedLeague.teamIds) {
        validateForm();
        return;
    }
    
    // Get teams and sort by prestige
    const teams = selectedLeague.teamIds
        .map(teamId => worldData.teams[teamId])
        .filter(team => team)
        .sort((a, b) => b.prestige - a.prestige);
    
    teams.forEach(team => {
        const prestigeClass = team.prestige >= 80 ? '⭐' : team.prestige >= 60 ? '🔹' : '🔸';
        teamSelect.innerHTML += `<option value="${team.id}">${prestigeClass} ${team.name} (${team.prestige})</option>`;
    });
    
    validateForm();
}

function setupAttributeSystem() {
    const position = document.getElementById('playerPositionSelect').value;
    const slidersContainer = document.getElementById('attributeSliders');
    
    // Position-based attribute importance
    const attributeConfig = {
        'GK': {
            'Reflexes': { min: 50, max: 85, important: true },
            'Handling': { min: 45, max: 85, important: true },
            'Kicking': { min: 40, max: 75, important: false },
            'Positioning': { min: 50, max: 80, important: true },
            'Speed': { min: 30, max: 65, important: false },
            'Strength': { min: 40, max: 75, important: false }
        },
        'DEF': {
            'Defending': { min: 55, max: 85, important: true },
            'Strength': { min: 50, max: 85, important: true },
            'Heading': { min: 50, max: 80, important: true },
            'Speed': { min: 45, max: 75, important: false },
            'Passing': { min: 40, max: 70, important: false },
            'Shooting': { min: 20, max: 50, important: false }
        },
        'MID': {
            'Passing': { min: 55, max: 85, important: true },
            'Vision': { min: 50, max: 85, important: true },
            'Stamina': { min: 55, max: 85, important: true },
            'Shooting': { min: 40, max: 75, important: false },
            'Speed': { min: 45, max: 75, important: false },
            'Defending': { min: 30, max: 65, important: false }
        },
        'FWD': {
            'Shooting': { min: 55, max: 85, important: true },
            'Speed': { min: 55, max: 85, important: true },
            'Finishing': { min: 50, max: 85, important: true },
            'Dribbling': { min: 45, max: 80, important: false },
            'Strength': { min: 40, max: 75, important: false },
            'Passing': { min: 35, max: 65, important: false }
        }
    };
    
    const config = attributeConfig[position];
    attributeValues = {};
    
    slidersContainer.innerHTML = Object.entries(config).map(([attr, settings]) => {
        const baseValue = settings.min + Math.floor((settings.max - settings.min) * 0.4);
        attributeValues[attr] = baseValue;
        
        return `
            <div class="attribute-slider ${settings.important ? 'important' : ''}">
                <div class="slider-header">
                    <label for="${attr}Slider">${attr}${settings.important ? ' ⭐' : ''}:</label>
                    <span class="slider-value" id="${attr}Value">${baseValue}</span>
                </div>
                <input type="range" id="${attr}Slider" class="slider" 
                       min="${settings.min}" max="${settings.max}" value="${baseValue}"
                       onchange="updateAttribute('${attr}', this.value)">
                <div class="slider-range">
                    <span>${settings.min}</span>
                    <span>${settings.max}</span>
                </div>
            </div>
        `;
    }).join('');
    
    updateSkillPoints();
}

function updateAttribute(attribute, value) {
    const oldValue = attributeValues[attribute];
    attributeValues[attribute] = parseInt(value);
    
    document.getElementById(`${attribute}Value`).textContent = value;
    updateSkillPoints();
}

function updateSkillPoints() {
    const baseTotal = Object.values(attributeValues).reduce((sum, val) => {
        // Calculate base values for comparison
        return sum + 60; // Assume base of 60 for each attribute
    }, 0);
    
    const currentTotal = Object.values(attributeValues).reduce((sum, val) => sum + val, 0);
    const usedPoints = currentTotal - baseTotal;
    const remainingPoints = availableSkillPoints - usedPoints;
    
    document.getElementById('skillPoints').textContent = remainingPoints;
    document.getElementById('skillPoints').className = remainingPoints < 0 ? 'negative' : '';
}

function updateAmbitionDescription() {
    const ambition = document.getElementById('careerAmbitionSelect').value;
    const descriptionElement = document.getElementById('ambitionDescription');
    
    const descriptions = {
        'balanced': 'Focus on steady career growth with balanced priorities',
        'money': 'Maximize earnings through high-paying contracts and endorsements',
        'trophies': 'Join top clubs and compete for championships and titles',
        'legendary': 'Become one of the greatest players in football history'
    };
    
    descriptionElement.textContent = descriptions[ambition];
}

function updatePreview() {
    const name = document.getElementById('playerNameInput').value || 'Your Name';
    const age = document.getElementById('playerAgeInput').value;
    const nationalityId = document.getElementById('playerNationalitySelect').value;
    const position = document.getElementById('playerPositionSelect').value;
    const leagueId = document.getElementById('startingLeagueSelect').value;
    const teamId = document.getElementById('startingTeamSelect').value;
    const ambition = document.getElementById('careerAmbitionSelect').value;
    
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewAge').textContent = age;
    
    const nationality = worldData.countries[nationalityId];
    document.getElementById('previewNationality').textContent = nationality ? nationality.name : 'Country';
    
    const positionNames = { 'GK': 'Goalkeeper', 'DEF': 'Defender', 'MID': 'Midfielder', 'FWD': 'Forward' };
    document.getElementById('previewPosition').textContent = positionNames[position];
    
    const league = worldData.leagues[leagueId];
    document.getElementById('previewLeague').textContent = league ? league.name : 'Choose a league';
    
    if (teamId === 'random') {
        document.getElementById('previewTeam').textContent = 'Random Team';
    } else {
        const team = worldData.teams[teamId];
        document.getElementById('previewTeam').textContent = team ? team.name : 'Choose a team';
    }
    
    const ambitionNames = {
        'balanced': 'Balanced Career',
        'money': 'Money Focused',
        'trophies': 'Trophy Hunter',
        'legendary': 'Become a Legend'
    };
    document.getElementById('previewAmbition').textContent = ambitionNames[ambition];
    
    validateForm();
}

function validateForm() {
    const name = document.getElementById('playerNameInput').value.trim();
    const nationality = document.getElementById('playerNationalitySelect').value;
    const league = document.getElementById('startingLeagueSelect').value;
    
    const isValid = name && nationality && league;
    document.getElementById('createPlayerBtn').disabled = !isValid;
}

async function createPlayer() {
    const button = document.getElementById('createPlayerBtn');
    button.disabled = true;
    button.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Creating Career...</span>';
    
    try {
        const playerData = {
            name: document.getElementById('playerNameInput').value.trim(),
            age: parseInt(document.getElementById('playerAgeInput').value),
            nationality: document.getElementById('playerNationalitySelect').value,
            position: document.getElementById('playerPositionSelect').value,
            startingLeague: document.getElementById('startingLeagueSelect').value,
            startingTeam: document.getElementById('startingTeamSelect').value,
            careerAmbition: document.getElementById('careerAmbitionSelect').value,
            customAttributes: attributeValues
        };
        
        console.log('Creating player with data:', playerData);
        const newPlayer = await window.footballAPI.createPlayer(playerData);
        console.log('Player created successfully:', newPlayer);
        
        if (newPlayer) {
            // Show success animation
            button.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Career Created!</span>';
            
            setTimeout(() => {
                console.log('Navigating to index.html');
                window.location.href = 'index.html';
            }, 1000);
        } else {
            throw new Error('Failed to create player - returned null');
        }
    } catch (error) {
        console.error('Error creating player:', error);
        alert(`Failed to create player: ${error.message}. Please try again.`);
        button.disabled = false;
        button.innerHTML = '<span class="btn-icon">🚀</span><span class="btn-text">Start My Career!</span>';
    }
}

// Utility functions
function getFlagEmoji(countryId) {
    const flags = {
        'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'spain': '🇪🇸',
        'germany': '🇩🇪',
        'italy': '🇮🇹',
        'france': '🇫🇷',
        'turkey': '🇹🇷',
        'portugal': '🇵🇹',
        'netherlands': '🇳🇱',
        'brazil': '🇧🇷',
        'argentina': '🇦🇷',
        'japan': '🇯🇵',
        'southKorea': '🇰🇷',
        'usa': '🇺🇸',
        'egypt': '🇪🇬',
        'morocco': '🇲🇦',
        'southAfrica': '🇿🇦'
    };
    
    return flags[countryId] || '🌍';
}