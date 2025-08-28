// frontend/renderer.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI animations
    initializeAnimations();
    
    // Initialize language system
    initializeLanguageSystem();
    
    // Load player data with loading animation
    loadPlayerData();

    // Setup event listeners
    setupEventListeners();
    
    // Initialize tooltips and micro-interactions
    initializeMicroInteractions();
});

/**
 * Initialize loading animations and transitions - Optimized
 */
function initializeAnimations() {
    // Add loading class to elements
    const loadingElements = document.querySelectorAll('#playerName, #playerAge, #playerTeam, #playerPosition, #playerReputation');
    loadingElements.forEach(el => el.classList.add('loading'));
    
    // Simple dashboard entrance animation
    const dashboard = document.querySelector('.dashboard-container');
    dashboard.style.opacity = '0';
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        dashboard.style.transition = 'opacity 0.5s ease';
        dashboard.style.opacity = '1';
    });
}

/**
 * Load player data with smooth animations
 */
async function loadPlayerData() {
    try {
        const playerData = await window.footballAPI.getPlayerInfo();
        
        if (playerData) {
            // Remove loading animations
            setTimeout(() => {
                updatePlayerUI(playerData);
                animateStatBars(playerData.stats);
            }, 1000);
        } else {
            console.log('No player found. Ready to create a new one!');
            // Show create player prompt
            showCreatePlayerPrompt();
        }
    } catch (error) {
        console.error('Error loading player data:', error);
    }
}

/**
 * Setup all event listeners with enhanced feedback
 */
function setupEventListeners() {
    document.getElementById('nextWeekBtn').addEventListener('click', async (e) => {
        await handleButtonClick(e, async () => {
            try {
                console.log('Next Week button clicked');
                const response = await window.footballAPI.nextWeek();
                console.log('Next Week response:', response);
                
                // Reload the player data to reflect changes
                await loadPlayerData();
                
                if (response && response.hasMediaEvent) {
                    navigateWithTransition('media-event.html');
                } else {
                    // Show a success message and stay on the dashboard
                    showSuccessMessage('Week completed successfully! Player stats updated.');
                }
            } catch (error) {
                console.error('Error processing next week:', error);
                showErrorMessage('Failed to process next week. Please try again.');
            }
        });
    });

    document.getElementById('trainingBtn').addEventListener('click', async (e) => {
        await handleButtonClick(e, () => {
            navigateWithTransition('training.html');
        });
    });
    
    document.getElementById('transferMarketBtn').addEventListener('click', async (e) => {
        await handleButtonClick(e, () => {
            navigateWithTransition('transfer-market.html');
        });
    });
    
    document.getElementById('leagueTableBtn').addEventListener('click', async (e) => {
        await handleButtonClick(e, () => {
            navigateWithTransition('league-table.html');
        });
    });
    
    // New buttons
    const analyticsBtn = document.getElementById('analyticsBtn');
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('analytics.html');
            });
        });
    }
    
    const staffManagementBtn = document.getElementById('staffManagementBtn');
    if (staffManagementBtn) {
        staffManagementBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('staff.html');
            });
        });
    }
    
    const facilityManagementBtn = document.getElementById('facilityManagementBtn');
    if (facilityManagementBtn) {
        facilityManagementBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('facilities.html');
            });
        });
    }
    
    const aiManagerBtn = document.getElementById('aiManagerBtn');
    if (aiManagerBtn) {
        aiManagerBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('ai-manager.html');
            });
        });
    }
    
    const personalLifeBtn = document.getElementById('personalLifeBtn');
    if (personalLifeBtn) {
        personalLifeBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('personalLife.html');
            });
        });
    }
    
    const worldLeaguesBtn = document.getElementById('worldLeaguesBtn');
    if (worldLeaguesBtn) {
        worldLeaguesBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('worldLeagues.html');
            });
        });
    }
    
    const seasonOverviewBtn = document.getElementById('seasonOverviewBtn');
    if (seasonOverviewBtn) {
        seasonOverviewBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('seasonOverview.html');
            });
        });
    }
    
    const lifeManagementBtn = document.getElementById('lifeManagementBtn');
    if (lifeManagementBtn) {
        lifeManagementBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('lifeManagement.html');
            });
        });
    }
}

/**
 * Handle button clicks with optimized visual feedback
 */
async function handleButtonClick(event, callback) {
    const button = event.currentTarget;
    
    // Simple scale animation without heavy effects
    button.style.transform = 'scale(0.98)';
    button.style.transition = 'transform 0.1s ease';
    
    setTimeout(async () => {
        button.style.transform = '';
        if (callback) {
            await callback();
        }
    }, 100);
}

/**
 * Navigate with smooth transition
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
 * Show success message
 */
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    showNotification(message, 'error');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)'};
        color: white;
        padding: 16px 20px;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 300px;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Initialize micro-interactions
 */
function initializeMicroInteractions() {
    // Add hover effects to stat items
    const statItems = document.querySelectorAll('.player-stats li');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
    
    // Add hover effects to info items
    const infoItems = document.querySelectorAll('.info-grid p');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.borderColor = 'var(--border-accent)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.borderColor = '';
        });
    });
}

/**
 * Show create player prompt
 */
function showCreatePlayerPrompt() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        el.classList.remove('loading');
        el.textContent = 'Create Player';
    });
    
    // Add create player button
    const createBtn = document.createElement('button');
    createBtn.textContent = '+ Create New Player';
    createBtn.className = 'primary';
    createBtn.style.cssText = `
        margin-top: 20px;
        width: 100%;
    `;
    
    createBtn.addEventListener('click', () => {
        navigateWithTransition('creation.html');
    });
    
    document.querySelector('.player-info').appendChild(createBtn);
}

/**
 * Animate stat bars based on values
 */
function animateStatBars(stats) {
    const statMapping = {
        'speed': stats.speed,
        'shooting': stats.shooting,
        'passing': stats.passing,
        'defense': stats.defense,
        'stamina': stats.stamina,
        'intelligence': stats.intelligence || Math.floor(Math.random() * 20) + 80 // Default if not exists
    };
    
    Object.entries(statMapping).forEach(([statName, value], index) => {
        const statFill = document.querySelector(`[data-stat="${statName}"]`);
        if (statFill) {
            setTimeout(() => {
                const percentage = (value / 100) * 100; // Assuming max is 100
                statFill.style.width = `${Math.min(percentage, 100)}%`;
            }, index * 200); // Stagger animations
        }
    });
}

/**
 * Update UI with player data
 */
function updatePlayerUI(playerData) {
    if (!playerData) {
        console.error('Player data is null. Cannot update UI.');
        return;
    }
    
    // Remove loading classes and update content
    const updates = [
        { id: 'playerName', value: playerData.name || 'N/A' },
        { id: 'playerAge', value: playerData.age || 'N/A' },
        { id: 'playerTeam', value: playerData.team || 'Free Agent' },
        { id: 'playerPosition', value: playerData.position || 'N/A' },
        { id: 'playerReputation', value: playerData.reputation || 'Unknown' },
        { id: 'playerValue', value: formatCurrency(playerData.marketValue || 0) },
        { id: 'statSpeed', value: playerData.stats.speed || 0 },
        { id: 'statShooting', value: playerData.stats.shooting || 0 },
        { id: 'statPassing', value: playerData.stats.passing || 0 },
        { id: 'statDefense', value: playerData.stats.defense || 0 },
        { id: 'statStamina', value: playerData.stats.stamina || 0 },
        { id: 'statIntelligence', value: playerData.stats.intelligence || Math.floor(Math.random() * 20) + 80 }
    ];
    
    updates.forEach(({ id, value }, index) => {
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
                element.classList.remove('loading');
                element.textContent = value;
                
                // Add entrance animation
                element.style.transform = 'translateY(10px)';
                element.style.opacity = '0';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.5s ease';
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = '1';
                }, 50);
            }, index * 100);
        }
    });
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

/**
 * Initialize language system
 */
async function initializeLanguageSystem() {
    try {
        // Get available languages
        const availableLanguages = await window.footballAPI.getAvailableLanguages();
        const currentLanguage = await window.footballAPI.getCurrentLanguage();
        
        // Populate language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            availableLanguages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = `${lang.flag} ${lang.name}`;
                if (lang.code === currentLanguage) {
                    option.selected = true;
                }
                languageSelect.appendChild(option);
            });
        }
        
        // Apply current language translations
        await applyTranslations();
        
    } catch (error) {
        console.error('Error initializing language system:', error);
    }
}

/**
 * Handle language change
 */
async function changeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    const selectedLanguage = languageSelect.value;
    
    try {
        await window.footballAPI.setLanguage(selectedLanguage);
        await applyTranslations();
        
        // Show language change notification
        showSuccessMessage(`Language changed successfully!`);
        
    } catch (error) {
        console.error('Error changing language:', error);
        showErrorMessage('Failed to change language. Please try again.');
    }
}

/**
 * Apply translations to the current page
 */
async function applyTranslations() {
    try {
        const translations = await window.footballAPI.getAllTranslations();
        
        // Update translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
    } catch (error) {
        console.error('Error applying translations:', error);
    }
}

// Make functions globally available
window.changeLanguage = changeLanguage;