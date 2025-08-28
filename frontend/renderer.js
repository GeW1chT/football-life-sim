// frontend/renderer.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI animations
    initializeAnimations();
    
    // Load player data with loading animation
    loadPlayerData();

    // Setup event listeners
    setupEventListeners();
    
    // Initialize tooltips and micro-interactions
    initializeMicroInteractions();
});

/**
 * Initialize loading animations and transitions
 */
function initializeAnimations() {
    // Add loading class to elements
    const loadingElements = document.querySelectorAll('#playerName, #playerAge, #playerTeam, #playerPosition, #playerReputation');
    loadingElements.forEach(el => el.classList.add('loading'));
    
    // Animate dashboard container entrance
    const dashboard = document.querySelector('.dashboard-container');
    dashboard.style.opacity = '0';
    dashboard.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        dashboard.style.transition = 'all 0.8s ease';
        dashboard.style.opacity = '1';
        dashboard.style.transform = 'translateY(0)';
    }, 100);
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
            const { hasMediaEvent } = await window.footballAPI.nextWeek();
            
            if (hasMediaEvent) {
                navigateWithTransition('media-event.html');
            } else {
                navigateWithTransition('match.html');
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
    
    const staffBtn = document.getElementById('staffBtn');
    if (staffBtn) {
        staffBtn.addEventListener('click', async (e) => {
            await handleButtonClick(e, () => {
                navigateWithTransition('ai-manager.html');
            });
        });
    }
}

/**
 * Handle button clicks with visual feedback
 */
async function handleButtonClick(event, callback) {
    const button = event.currentTarget;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    
    // Add ripple effect
    createRippleEffect(event);
    
    setTimeout(async () => {
        button.style.transform = '';
        if (callback) {
            await callback();
        }
    }, 150);
}

/**
 * Create ripple effect on button click
 */
function createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(0, 212, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
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
 * Show coming soon notification
 */
function showComingSoon(feature) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(37, 37, 56, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        padding: 16px 24px;
        color: white;
        font-family: var(--font-primary);
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">🚀</span>
            <span>${feature} - Coming Soon!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
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
            item.style.borderColor = 'rgba(0, 212, 255, 0.4)';
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
    createBtn.style.cssText = `
        background: linear-gradient(135deg, var(--accent-success) 0%, var(--accent-primary) 100%);
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s ease;
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
                
                // Add glow effect for high stats
                if (value > 85) {
                    statFill.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
                }
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