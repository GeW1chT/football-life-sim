// frontend/facilities.js
let playerData = null;
let facilitiesData = null;
let selectedFacilityForUpgrade = null;
let selectedEquipmentForPurchase = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeFacilityManagement();
    setupEventListeners();
});

/**
 * Initialize Facility Management system
 */
async function initializeFacilityManagement() {
    try {
        playerData = await window.footballAPI.getPlayerInfo();
        
        if (playerData) {
            // Load facilities data from backend
            facilitiesData = await window.footballAPI.getFacilitiesData();
            
            // Update UI
            updateFacilityOverview();
            updateFacilityDetails();
            updateEquipmentSections();
            updateMaintenanceSection();
            
            // Add entrance animations
            animateElements();
        } else {
            showNoPlayerMessage();
        }
    } catch (error) {
        console.error('Error loading facility management data:', error);
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
    
    // Modal click outside to close
    document.getElementById('upgradeModal').addEventListener('click', (e) => {
        if (e.target.id === 'upgradeModal') {
            closeUpgradeModal();
        }
    });
    
    document.getElementById('equipmentModal').addEventListener('click', (e) => {
        if (e.target.id === 'equipmentModal') {
            closeEquipmentModal();
        }
    });
}

/**
 * Update facility overview cards
 */
function updateFacilityOverview() {
    if (!facilitiesData) return;
    
    const facilities = facilitiesData.facilities;
    
    document.getElementById('trainingLevel').textContent = `Level ${facilities.training.level}`;
    document.getElementById('stadiumLevel').textContent = `Level ${facilities.stadium.level}`;
    document.getElementById('medicalLevel').textContent = `Level ${facilities.medical.level}`;
    document.getElementById('analysisLevel').textContent = `Level ${facilities.analysis.level}`;
    
    // Update benefits
    updateFacilityBenefits();
}

/**
 * Update facility benefits display
 */
function updateFacilityBenefits() {
    const facilities = facilitiesData.facilities;
    
    document.querySelector('#trainingLevel').parentElement.querySelector('.facility-benefit').textContent = 
        `+${facilities.training.benefits.development}% Development`;
    document.querySelector('#stadiumLevel').parentElement.querySelector('.facility-benefit').textContent = 
        `+${facilities.stadium.benefits.morale}% Morale`;
    document.querySelector('#medicalLevel').parentElement.querySelector('.facility-benefit').textContent = 
        `+${facilities.medical.benefits.recovery}% Recovery`;
    document.querySelector('#analysisLevel').parentElement.querySelector('.facility-benefit').textContent = 
        `+${facilities.analysis.benefits.intelligence}% Intelligence`;
}

/**
 * Update detailed facility information
 */
function updateFacilityDetails() {
    if (!facilitiesData) return;
    
    const facilities = facilitiesData.facilities;
    
    // Training Center
    updateTrainingCenterDetails(facilities.training);
    
    // Stadium
    updateStadiumDetails(facilities.stadium);
    
    // Medical Center
    updateMedicalCenterDetails(facilities.medical);
    
    // Analysis Center
    updateAnalysisCenterDetails(facilities.analysis);
}

/**
 * Update training center details
 */
function updateTrainingCenterDetails(training) {
    document.getElementById('trainingCenterLevel').textContent = training.level;
    document.getElementById('trainingCenterDescription').textContent = training.description;
    document.getElementById('trainingDevBonus').textContent = `+${training.benefits.development}%`;
    document.getElementById('trainingEfficiency').textContent = `+${training.benefits.efficiency}%`;
    document.getElementById('trainingMaintenance').textContent = `€${training.maintenanceCost.toLocaleString()}/month`;
    
    // Update upgrade button
    const upgradeBtn = document.getElementById('upgradeTrainingBtn');
    if (training.level >= training.maxLevel) {
        upgradeBtn.disabled = true;
        upgradeBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Max Level</span>';
    }
}

/**
 * Update stadium details
 */
function updateStadiumDetails(stadium) {
    document.getElementById('stadiumLevelBadge').textContent = stadium.level;
    document.getElementById('stadiumDescription').textContent = stadium.description;
    document.getElementById('stadiumMoraleBonus').textContent = `+${stadium.benefits.morale}%`;
    document.getElementById('stadiumCapacity').textContent = stadium.capacity.toLocaleString();
    document.getElementById('stadiumRevenue').textContent = `+${stadium.benefits.revenue}%`;
    
    // Update upgrade button
    const upgradeBtn = document.getElementById('upgradeStadiumBtn');
    if (stadium.level >= stadium.maxLevel) {
        upgradeBtn.disabled = true;
        upgradeBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Max Level</span>';
    }
}

/**
 * Update medical center details
 */
function updateMedicalCenterDetails(medical) {
    document.getElementById('medicalCenterLevel').textContent = medical.level;
    document.getElementById('medicalCenterDescription').textContent = medical.description;
    document.getElementById('medicalRecoveryBonus').textContent = `+${medical.benefits.recovery}%`;
    document.getElementById('medicalPreventionBonus').textContent = `+${medical.benefits.prevention}%`;
    document.getElementById('medicalMonitoring').textContent = medical.benefits.monitoring;
    
    // Update upgrade button
    const upgradeBtn = document.getElementById('upgradeMedicalBtn');
    if (medical.level >= medical.maxLevel) {
        upgradeBtn.disabled = true;
        upgradeBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Max Level</span>';
    }
}

/**
 * Update analysis center details
 */
function updateAnalysisCenterDetails(analysis) {
    document.getElementById('analysisCenterLevel').textContent = analysis.level;
    document.getElementById('analysisCenterDescription').textContent = analysis.description;
    document.getElementById('analysisIntelligenceBonus').textContent = `+${analysis.benefits.intelligence}%`;
    document.getElementById('analysisTacticalBonus').textContent = `+${analysis.benefits.tactical}%`;
    document.getElementById('analysisDataQuality').textContent = analysis.benefits.dataQuality;
    
    // Update upgrade button
    const upgradeBtn = document.getElementById('upgradeAnalysisBtn');
    if (analysis.level >= analysis.maxLevel) {
        upgradeBtn.disabled = true;
        upgradeBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Max Level</span>';
    }
}

/**
 * Update equipment sections
 */
function updateEquipmentSections() {
    if (!facilitiesData || !facilitiesData.equipment) return;
    
    const equipment = facilitiesData.equipment;
    
    // Training Equipment
    document.getElementById('trainingEquipment').innerHTML = equipment.training.map(item => {
        return createEquipmentCard(item);
    }).join('');
    
    // Match Equipment
    document.getElementById('matchEquipment').innerHTML = equipment.match.map(item => {
        return createEquipmentCard(item);
    }).join('');
    
    // Recovery Equipment
    document.getElementById('recoveryEquipment').innerHTML = equipment.recovery.map(item => {
        return createEquipmentCard(item);
    }).join('');
}

/**
 * Create equipment card HTML
 */
function createEquipmentCard(item) {
    const statusClass = item.owned ? 'owned' : 'available';
    const actionButton = item.owned ? 
        '<div class="equipment-status owned">✅ Owned</div>' :
        `<button class="buy-equipment-btn" onclick="showEquipmentModal('${item.id}')">
            <span class="btn-icon">💰</span>
            <span class="btn-text">€${item.cost.toLocaleString()}</span>
        </button>`;
    
    return `
        <div class="equipment-card ${statusClass}">
            <div class="equipment-info">
                <h4>${item.name}</h4>
                <p class="equipment-description">${item.description}</p>
                <div class="equipment-benefits">
                    ${Object.entries(item.benefits).map(([key, value]) => 
                        `<span class="benefit-tag">+${value}% ${formatBenefitName(key)}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="equipment-action">
                ${actionButton}
            </div>
        </div>
    `;
}

/**
 * Format benefit name for display
 */
function formatBenefitName(benefitKey) {
    const names = {
        speed: 'Speed',
        strength: 'Strength',
        accuracy: 'Accuracy',
        recovery: 'Recovery',
        focus: 'Focus',
        endurance: 'Endurance',
        agility: 'Agility',
        coordination: 'Coordination'
    };
    return names[benefitKey] || benefitKey.charAt(0).toUpperCase() + benefitKey.slice(1);
}

/**
 * Update maintenance section
 */
function updateMaintenanceSection() {
    if (!facilitiesData) return;
    
    // Maintenance Schedule
    const schedule = facilitiesData.maintenance.schedule;
    document.getElementById('maintenanceSchedule').innerHTML = schedule.map(item => {
        const urgencyClass = item.urgency === 'high' ? 'urgent' : item.urgency === 'medium' ? 'medium' : 'low';
        return `
            <div class="maintenance-item ${urgencyClass}">
                <div class="maintenance-facility">${item.facility}</div>
                <div class="maintenance-task">${item.task}</div>
                <div class="maintenance-due">Due: ${item.dueDate}</div>
                <div class="maintenance-cost">€${item.cost.toLocaleString()}</div>
            </div>
        `;
    }).join('');
    
    // Operational Costs
    const costs = facilitiesData.maintenance.costs;
    document.getElementById('operationalCosts').innerHTML = `
        <div class="cost-item">
            <span>Training Center:</span>
            <span>€${costs.training.toLocaleString()}/month</span>
        </div>
        <div class="cost-item">
            <span>Stadium:</span>
            <span>€${costs.stadium.toLocaleString()}/month</span>
        </div>
        <div class="cost-item">
            <span>Medical Center:</span>
            <span>€${costs.medical.toLocaleString()}/month</span>
        </div>
        <div class="cost-item">
            <span>Analysis Center:</span>
            <span>€${costs.analysis.toLocaleString()}/month</span>
        </div>
        <div class="cost-item total">
            <span>Total Monthly:</span>
            <span>€${costs.total.toLocaleString()}/month</span>
        </div>
    `;
}

/**
 * Show upgrade modal
 */
function showUpgradeModal(facilityType) {
    const facility = facilitiesData.facilities[facilityType];
    const upgradeInfo = getUpgradeInfo(facilityType, facility.level);
    
    if (facility.level >= facility.maxLevel) {
        showNotification('Facility is already at maximum level!', 'info');
        return;
    }
    
    selectedFacilityForUpgrade = { type: facilityType, ...upgradeInfo };
    
    document.getElementById('upgradeModalTitle').textContent = `Upgrade ${formatFacilityName(facilityType)}`;
    
    // Current stats
    document.getElementById('currentUpgradeStats').innerHTML = generateStatsHTML(facility.benefits, facility.level);
    
    // New stats
    document.getElementById('newUpgradeStats').innerHTML = generateStatsHTML(upgradeInfo.newBenefits, facility.level + 1);
    
    // Upgrade costs
    document.getElementById('upgradeCost').textContent = `€${upgradeInfo.cost.toLocaleString()}`;
    document.getElementById('constructionTime').textContent = `${upgradeInfo.constructionTime} weeks`;
    document.getElementById('additionalMaintenance').textContent = `€${upgradeInfo.additionalMaintenance.toLocaleString()}/month`;
    
    const modal = document.getElementById('upgradeModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Get upgrade information for a facility
 */
function getUpgradeInfo(facilityType, currentLevel) {
    const upgradeData = {
        training: {
            cost: [50000, 120000, 250000, 500000],
            constructionTime: [2, 3, 4, 6],
            additionalMaintenance: [1000, 2500, 5000, 10000],
            benefits: {
                development: [5, 10, 18, 30],
                efficiency: [10, 20, 35, 50]
            }
        },
        stadium: {
            cost: [100000, 300000, 750000, 1500000],
            constructionTime: [4, 6, 8, 12],
            additionalMaintenance: [2000, 5000, 12000, 25000],
            benefits: {
                morale: [3, 8, 15, 25],
                revenue: [5, 12, 25, 40],
                capacity: [15000, 30000, 50000, 80000]
            }
        },
        medical: {
            cost: [75000, 180000, 400000, 800000],
            constructionTime: [3, 4, 6, 8],
            additionalMaintenance: [1500, 3500, 7500, 15000],
            benefits: {
                recovery: [10, 25, 45, 70],
                prevention: [5, 15, 30, 50],
                monitoring: ['Basic', 'Advanced', 'Premium', 'Elite']
            }
        },
        analysis: {
            cost: [60000, 150000, 350000, 700000],
            constructionTime: [2, 3, 5, 7],
            additionalMaintenance: [1200, 3000, 6500, 13000],
            benefits: {
                intelligence: [5, 12, 22, 35],
                tactical: [3, 8, 18, 30],
                dataQuality: ['Standard', 'Advanced', 'Premium', 'Elite']
            }
        }
    };
    
    const data = upgradeData[facilityType];
    const nextLevel = currentLevel; // Array is 0-indexed, currentLevel is 1-indexed
    
    const newBenefits = {};
    Object.keys(data.benefits).forEach(key => {
        newBenefits[key] = data.benefits[key][nextLevel];
    });
    
    return {
        cost: data.cost[nextLevel],
        constructionTime: data.constructionTime[nextLevel],
        additionalMaintenance: data.additionalMaintenance[nextLevel],
        newBenefits: newBenefits
    };
}

/**
 * Generate stats HTML
 */
function generateStatsHTML(benefits, level) {
    return Object.entries(benefits).map(([key, value]) => {
        const displayValue = typeof value === 'number' ? `${value}%` : value;
        return `<div class="stat-line"><span>${formatBenefitName(key)}:</span> <span>${displayValue}</span></div>`;
    }).join('');
}

/**
 * Format facility name
 */
function formatFacilityName(facilityType) {
    const names = {
        training: 'Training Center',
        stadium: 'Stadium',
        medical: 'Medical Center',
        analysis: 'Analysis Center'
    };
    return names[facilityType] || facilityType;
}

/**
 * Close upgrade modal
 */
function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
    selectedFacilityForUpgrade = null;
}

/**
 * Confirm facility upgrade
 */
async function confirmUpgrade() {
    if (!selectedFacilityForUpgrade) return;
    
    try {
        const result = await window.footballAPI.upgradeFacility(selectedFacilityForUpgrade.type);
        
        if (result.success) {
            // Update local data
            facilitiesData = result.facilitiesData;
            
            // Update UI
            updateFacilityOverview();
            updateFacilityDetails();
            updateMaintenanceSection();
            
            // Show success message
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error upgrading facility:', error);
        showNotification('Failed to upgrade facility', 'error');
    }
    
    closeUpgradeModal();
}

/**
 * Show equipment modal
 */
function showEquipmentModal(equipmentId) {
    const equipment = findEquipmentById(equipmentId);
    if (!equipment || equipment.owned) return;
    
    selectedEquipmentForPurchase = equipment;
    
    document.getElementById('equipmentDetails').innerHTML = `
        <div class="equipment-preview">
            <h3>${equipment.name}</h3>
            <p class="equipment-description">${equipment.description}</p>
            <div class="equipment-benefits">
                <h4>Benefits:</h4>
                ${Object.entries(equipment.benefits).map(([key, value]) => 
                    `<div class="benefit-item">+${value}% ${formatBenefitName(key)}</div>`
                ).join('')}
            </div>
            <div class="equipment-cost">
                <div class="cost-item">
                    <span>Purchase Cost:</span>
                    <span>€${equipment.cost.toLocaleString()}</span>
                </div>
                <div class="cost-item">
                    <span>Monthly Maintenance:</span>
                    <span>€${equipment.maintenance.toLocaleString()}/month</span>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('equipmentModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Find equipment by ID
 */
function findEquipmentById(equipmentId) {
    const allEquipment = [
        ...facilitiesData.equipment.training,
        ...facilitiesData.equipment.match,
        ...facilitiesData.equipment.recovery
    ];
    return allEquipment.find(item => item.id === equipmentId);
}

/**
 * Close equipment modal
 */
function closeEquipmentModal() {
    const modal = document.getElementById('equipmentModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
    selectedEquipmentForPurchase = null;
}

/**
 * Confirm equipment purchase
 */
async function confirmPurchase() {
    if (!selectedEquipmentForPurchase) return;
    
    try {
        const result = await window.footballAPI.purchaseEquipment(selectedEquipmentForPurchase.id);
        
        if (result.success) {
            // Update local data
            facilitiesData = result.facilitiesData;
            
            // Update UI
            updateEquipmentSections();
            updateMaintenanceSection();
            
            // Show success message
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error purchasing equipment:', error);
        showNotification('Failed to purchase equipment', 'error');
    }
    
    closeEquipmentModal();
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

/**
 * Navigation and animation functions
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
    document.querySelector('.facilities-dashboard').innerHTML = 
        '<div class="no-data-message">' +
            '<h2>🏟️ Facility Management Not Available</h2>' +
            '<p>Create a player first to manage your facilities.</p>' +
            '<button onclick="navigateWithTransition(\'creation.html\')" class="create-player-btn">' +
                'Create Player' +
            '</button>' +
        '</div>';
}

function showErrorMessage() {
    document.querySelector('.facilities-dashboard').innerHTML = 
        '<div class="error-message">' +
            '<h2>❌ Facility Management Error</h2>' +
            '<p>Unable to load facility data. Please try again.</p>' +
            '<button onclick="location.reload()" class="retry-btn">' +
                'Retry' +
            '</button>' +
        '</div>';
}