// frontend/staff.js
let playerData = null;
let staffData = [];
let availableStaffData = [];
let selectedStaffForHire = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeStaffManagement();
    setupEventListeners();
});

/**
 * Initialize Staff Management system
 */
async function initializeStaffManagement() {
    try {
        playerData = await window.footballAPI.getPlayerInfo();
        
        if (playerData) {
            // Load staff data from backend
            const staffResponse = await window.footballAPI.getStaffData();
            staffData = staffResponse.currentStaff || [];
            availableStaffData = staffResponse.availableStaff || [];
            
            // Update UI
            updateStaffOverview();
            updateCurrentStaffList();
            updateAvailableStaffList();
            updateStaffAnalytics();
            
            // Add entrance animations
            animateElements();
        } else {
            showNoPlayerMessage();
        }
    } catch (error) {
        console.error('Error loading staff management data:', error);
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
    document.getElementById('hireStaffModal').addEventListener('click', (e) => {
        if (e.target.id === 'hireStaffModal') {
            closeHireModal();
        }
    });
    
    document.getElementById('staffDetailModal').addEventListener('click', (e) => {
        if (e.target.id === 'staffDetailModal') {
            closeStaffDetailModal();
        }
    });
}

/**
 * Load current staff (mock implementation)
 */
async function loadCurrentStaff() {
    // Mock staff data - in real implementation, this would call the backend
    return [
        {
            id: 'staff_001',
            name: 'Marco Silva',
            type: 'coach',
            specialization: 'Attacking',
            experience: 8,
            rating: 85,
            salary: 12000,
            hiredDate: '2024-01-15',
            contract: 24,
            bonus: {
                development: 15,
                morale: 10
            }
        },
        {
            id: 'staff_002',
            name: 'Dr. Sarah Johnson',
            type: 'physiotherapist',
            specialization: 'Injury Prevention',
            experience: 6,
            rating: 78,
            salary: 8500,
            hiredDate: '2024-02-01',
            contract: 18,
            bonus: {
                injuryPrevention: 20,
                recovery: 25
            }
        }
    ];
}

/**
 * Generate available staff for hiring
 */
async function generateAvailableStaff() {
    const staffTypes = ['coach', 'physiotherapist', 'scout', 'analyst'];
    const specializations = {
        coach: ['Attacking', 'Defensive', 'Tactical', 'Youth Development', 'Fitness'],
        physiotherapist: ['Injury Prevention', 'Recovery', 'Performance', 'Nutrition'],
        scout: ['Domestic', 'International', 'Youth', 'Tactical Analysis'],
        analyst: ['Performance', 'Tactical', 'Opposition', 'Data Science']
    };
    
    const names = [
        'Antonio Conte', 'Jurgen Schmidt', 'Paolo Rossi', 'Erik van Bergen',
        'Dr. Maria Santos', 'Dr. James Wilson', 'Dr. Lisa Chen', 'Dr. Ahmed Hassan',
        'Roberto Martinez', 'François Dubois', 'Hans Mueller', 'Giovanni Bianchi',
        'Alex Thompson', 'Samuel Rodriguez', 'Mikhail Petrov', 'Yuki Tanaka'
    ];
    
    const availableStaff = [];
    
    for (let i = 0; i < 12; i++) {
        const type = staffTypes[Math.floor(Math.random() * staffTypes.length)];
        const typeSpecializations = specializations[type];
        const specialization = typeSpecializations[Math.floor(Math.random() * typeSpecializations.length)];
        const experience = Math.floor(Math.random() * 15) + 1;
        const rating = Math.floor(Math.random() * 40) + 60; // 60-99 rating
        const baseSalary = type === 'coach' ? 8000 : type === 'physiotherapist' ? 6000 : 5000;
        const salary = baseSalary + (experience * 500) + (rating * 100);
        
        availableStaff.push({
            id: 'available_' + (i + 1),
            name: names[i],
            type: type,
            specialization: specialization,
            experience: experience,
            rating: rating,
            salary: salary,
            signingBonus: Math.floor(salary * 0.5),
            available: true,
            description: generateStaffDescription(type, specialization, experience, rating)
        });
    }
    
    return availableStaff;
}

/**
 * Generate staff description
 */
function generateStaffDescription(type, specialization, experience, rating) {
    const descriptions = {
        coach: {
            'Attacking': 'Specializes in developing offensive tactics and improving shooting accuracy.',
            'Defensive': 'Expert in defensive formations and improving defensive skills.',
            'Tactical': 'Focuses on game strategy and tactical awareness development.',
            'Youth Development': 'Specializes in nurturing young talent and potential growth.',
            'Fitness': 'Improves stamina, speed, and overall physical conditioning.'
        },
        physiotherapist: {
            'Injury Prevention': 'Reduces injury risk through specialized training programs.',
            'Recovery': 'Accelerates recovery time from injuries and fatigue.',
            'Performance': 'Optimizes physical performance and endurance.',
            'Nutrition': 'Provides nutrition guidance for peak performance.'
        },
        scout: {
            'Domestic': 'Identifies promising talent in domestic leagues.',
            'International': 'Scouts international markets for hidden gems.',
            'Youth': 'Specializes in discovering young prospects.',
            'Tactical Analysis': 'Provides detailed opponent analysis and tactical insights.'
        },
        analyst: {
            'Performance': 'Analyzes player performance data for improvement areas.',
            'Tactical': 'Studies game tactics and strategic formations.',
            'Opposition': 'Provides detailed analysis of upcoming opponents.',
            'Data Science': 'Uses advanced analytics for player development insights.'
        }
    };
    
    return descriptions[type][specialization] || 'Experienced professional in their field.';
}

/**
 * Update staff overview
 */
function updateStaffOverview() {
    const totalStaff = staffData.length;
    const totalBudget = staffData.reduce((sum, staff) => sum + staff.salary, 0);
    const avgRating = totalStaff > 0 ? (staffData.reduce((sum, staff) => sum + staff.rating, 0) / totalStaff).toFixed(1) : 0;
    const developmentBoost = calculateDevelopmentBoost();
    
    document.getElementById('totalStaff').textContent = totalStaff;
    document.getElementById('staffBudget').textContent = formatCurrency(totalBudget);
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('staffEffect').textContent = '+' + developmentBoost + '%';
}

/**
 * Calculate development boost from staff
 */
function calculateDevelopmentBoost() {
    let totalBoost = 0;
    
    staffData.forEach(staff => {
        const baseBoost = Math.floor(staff.rating / 10);
        totalBoost += baseBoost;
    });
    
    return Math.min(totalBoost, 50); // Cap at 50%
}

/**
 * Update current staff list
 */
function updateCurrentStaffList() {
    const container = document.getElementById('currentStaff');
    const noStaffMessage = document.getElementById('noStaffMessage');
    
    if (staffData.length === 0) {
        noStaffMessage.style.display = 'block';
        return;
    }
    
    noStaffMessage.style.display = 'none';
    
    container.innerHTML = staffData.map(staff => {
        const contractMonthsLeft = staff.contract;
        const experienceLevel = getExperienceLevel(staff.experience);
        
        return `
            <div class="staff-card" onclick="showStaffDetail('${staff.id}')">
                <div class="staff-header">
                    <div class="staff-avatar">
                        <div class="staff-type-icon">${getStaffIcon(staff.type)}</div>
                    </div>
                    <div class="staff-info">
                        <h3>${staff.name}</h3>
                        <p class="staff-role">${staff.specialization} ${staff.type.charAt(0).toUpperCase() + staff.type.slice(1)}</p>
                        <div class="staff-rating">
                            <div class="rating-stars">${generateStarRating(staff.rating)}</div>
                            <span class="rating-number">${staff.rating}/100</span>
                        </div>
                    </div>
                    <div class="staff-status">
                        <div class="salary-info">€${staff.salary.toLocaleString()}/month</div>
                        <div class="contract-info">${contractMonthsLeft} months left</div>
                        <div class="experience-badge ${experienceLevel.toLowerCase()}">${experienceLevel}</div>
                    </div>
                </div>
                <div class="staff-effects">
                    <h4>Staff Effects:</h4>
                    <div class="effect-list">
                        ${Object.entries(staff.bonus).map(([key, value]) => 
                            `<div class="effect-item">+${value}% ${formatEffectName(key)}</div>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update available staff list
 */
function updateAvailableStaffList() {
    const container = document.getElementById('availableStaff');
    
    container.innerHTML = availableStaffData.filter(staff => staff.available).map(staff => {
        const experienceLevel = getExperienceLevel(staff.experience);
        
        return `
            <div class="available-staff-card">
                <div class="staff-header">
                    <div class="staff-avatar">
                        <div class="staff-type-icon">${getStaffIcon(staff.type)}</div>
                    </div>
                    <div class="staff-info">
                        <h3>${staff.name}</h3>
                        <p class="staff-role">${staff.specialization} ${staff.type.charAt(0).toUpperCase() + staff.type.slice(1)}</p>
                        <div class="staff-rating">
                            <div class="rating-stars">${generateStarRating(staff.rating)}</div>
                            <span class="rating-number">${staff.rating}/100</span>
                        </div>
                        <div class="experience-badge ${experienceLevel.toLowerCase()}">${experienceLevel}</div>
                    </div>
                    <div class="staff-cost">
                        <div class="salary-info">€${staff.salary.toLocaleString()}/month</div>
                        <div class="bonus-info">€${staff.signingBonus.toLocaleString()} signing bonus</div>
                    </div>
                </div>
                <div class="staff-description">
                    <p>${staff.description}</p>
                </div>
                <div class="hire-actions">
                    <button class="hire-btn" onclick="showHireModal('${staff.id}')">
                        <span class="btn-icon">💼</span>
                        <span class="btn-text">Hire</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filter available staff
 */
function filterAvailableStaff() {
    const typeFilter = document.getElementById('staffTypeFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    const budgetFilter = document.getElementById('budgetFilter').value;
    
    let filteredStaff = availableStaffData.filter(staff => staff.available);
    
    if (typeFilter !== 'all') {
        filteredStaff = filteredStaff.filter(staff => staff.type === typeFilter);
    }
    
    if (experienceFilter !== 'all') {
        filteredStaff = filteredStaff.filter(staff => {
            const level = getExperienceLevel(staff.experience).toLowerCase();
            return level === experienceFilter;
        });
    }
    
    if (budgetFilter !== 'all') {
        filteredStaff = filteredStaff.filter(staff => {
            if (budgetFilter === 'low') return staff.salary <= 5000;
            if (budgetFilter === 'medium') return staff.salary > 5000 && staff.salary <= 15000;
            if (budgetFilter === 'high') return staff.salary > 15000;
            return true;
        });
    }
    
    // Update the available staff data temporarily
    const originalData = [...availableStaffData];
    availableStaffData = filteredStaff;
    updateAvailableStaffList();
    availableStaffData = originalData;
}

/**
 * Helper functions
 */
function getStaffIcon(type) {
    const icons = {
        coach: '👨‍💼',
        physiotherapist: '👩‍⚕️',
        scout: '🔍',
        analyst: '📊'
    };
    return icons[type] || '👤';
}

function getExperienceLevel(years) {
    if (years <= 3) return 'Junior';
    if (years <= 8) return 'Experienced';
    return 'Senior';
}

function generateStarRating(rating) {
    const stars = Math.floor(rating / 20); // Convert to 5-star scale
    const fullStars = '⭐'.repeat(stars);
    const emptyStars = '☆'.repeat(5 - stars);
    return fullStars + emptyStars;
}

function formatEffectName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function formatCurrency(amount) {
    return '€' + amount.toLocaleString();
}

/**
 * Modal functions
 */
function showHireModal(staffId) {
    selectedStaffForHire = availableStaffData.find(staff => staff.id === staffId);
    if (!selectedStaffForHire) return;
    
    const modal = document.getElementById('hireStaffModal');
    const detailsContainer = document.getElementById('modalStaffDetails');
    
    detailsContainer.innerHTML = `
        <div class="modal-staff-card">
            <div class="staff-avatar-large">
                <div class="staff-type-icon-large">${getStaffIcon(selectedStaffForHire.type)}</div>
            </div>
            <div class="staff-details-content">
                <h3>${selectedStaffForHire.name}</h3>
                <p class="staff-role">${selectedStaffForHire.specialization} ${selectedStaffForHire.type.charAt(0).toUpperCase() + selectedStaffForHire.type.slice(1)}</p>
                <div class="staff-rating">
                    <div class="rating-stars">${generateStarRating(selectedStaffForHire.rating)}</div>
                    <span class="rating-number">${selectedStaffForHire.rating}/100</span>
                </div>
                <div class="experience-info">
                    <span class="experience-badge ${getExperienceLevel(selectedStaffForHire.experience).toLowerCase()}">
                        ${selectedStaffForHire.experience} years experience
                    </span>
                </div>
                <div class="staff-description">
                    <p>${selectedStaffForHire.description}</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalSalary').textContent = formatCurrency(selectedStaffForHire.salary);
    document.getElementById('modalBonus').textContent = formatCurrency(selectedStaffForHire.signingBonus);
    document.getElementById('modalTotal').textContent = formatCurrency(selectedStaffForHire.salary + selectedStaffForHire.signingBonus);
    
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeHireModal() {
    const modal = document.getElementById('hireStaffModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
    selectedStaffForHire = null;
}

async function confirmHire() {
    if (!selectedStaffForHire) return;
    
    try {
        const result = await window.footballAPI.hireStaff(selectedStaffForHire.id);
        
        if (result.success) {
            // Update local data
            staffData.push(result.staff);
            availableStaffData = availableStaffData.filter(staff => staff.id !== selectedStaffForHire.id);
            
            // Update UI
            updateStaffOverview();
            updateCurrentStaffList();
            updateAvailableStaffList();
            
            // Show success message
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error hiring staff:', error);
        showNotification('Failed to hire staff member', 'error');
    }
    
    // Close modal
    closeHireModal();
}

function generateStaffBonus(type, rating) {
    const baseBonus = Math.floor(rating / 10);
    
    switch (type) {
        case 'coach':
            return {
                development: baseBonus,
                morale: Math.floor(baseBonus * 0.7)
            };
        case 'physiotherapist':
            return {
                injuryPrevention: baseBonus + 5,
                recovery: baseBonus + 10
            };
        case 'scout':
            return {
                scouting: baseBonus,
                negotiation: Math.floor(baseBonus * 0.5)
            };
        case 'analyst':
            return {
                analysis: baseBonus,
                tactical: Math.floor(baseBonus * 0.8)
            };
        default:
            return { general: baseBonus };
    }
}

/**
 * Update staff analytics
 */
function updateStaffAnalytics() {
    // This would be expanded with actual chart implementation
    document.getElementById('staffMetrics').innerHTML = `
        <div class="metric-item">
            <span class="metric-label">Total Development Boost:</span>
            <span class="metric-value">+${calculateDevelopmentBoost()}%</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Monthly Staff Cost:</span>
            <span class="metric-value">${formatCurrency(staffData.reduce((sum, staff) => sum + staff.salary, 0))}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Average Staff Rating:</span>
            <span class="metric-value">${staffData.length > 0 ? (staffData.reduce((sum, staff) => sum + staff.rating, 0) / staffData.length).toFixed(1) : 0}/100</span>
        </div>
    `;
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
    document.querySelector('.staff-dashboard').innerHTML = 
        '<div class="no-data-message">' +
            '<h2>👥 Staff Management Not Available</h2>' +
            '<p>Create a player first to manage your staff.</p>' +
            '<button onclick="navigateWithTransition(\'creation.html\')" class="create-player-btn">' +
                'Create Player' +
            '</button>' +
        '</div>';
}

function showErrorMessage() {
    document.querySelector('.staff-dashboard').innerHTML = 
        '<div class="error-message">' +
            '<h2>❌ Staff Management Error</h2>' +
            '<p>Unable to load staff data. Please try again.</p>' +
            '<button onclick="location.reload()" class="retry-btn">' +
                'Retry' +
            '</button>' +
        '</div>';
}