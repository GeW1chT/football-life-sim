// frontend/lifeManagement.js

document.addEventListener('DOMContentLoaded', () => {
    loadLifeData();
    setupEventListeners();
});

let currentLifeData = {};

/**
 * Load all life management data
 */
async function loadLifeData() {
    try {
        // Load financial data
        const financialData = await window.footballAPI.getFinancialDashboard();
        
        // Load relationship data  
        const familyData = await window.footballAPI.getFamilyStatus();
        
        // Load social media data
        const socialData = await window.footballAPI.getSocialMediaStats();
        
        // Load player data
        const playerData = await window.footballAPI.getPlayerInfo();

        currentLifeData = {
            financial: financialData,
            family: familyData,
            social: socialData,
            player: playerData
        };

        updateLifeOverview();
        updateFinancialTab();
        updateRelationshipsTab();
        updateSocialMediaTab();
        updateContractsTab();

    } catch (error) {
        console.error('Error loading life data:', error);
        showErrorMessage();
    }
}

/**
 * Update life overview cards
 */
function updateLifeOverview() {
    const { financial, family, social, player } = currentLifeData;

    // Financial overview
    document.getElementById('currentWealth').textContent = formatCurrency(financial?.currentWealth || 0);
    document.getElementById('weeklyIncome').textContent = `${formatCurrency(financial?.weeklyIncome || 0)}/week`;

    // Relationship overview
    const relationshipStatus = family?.relationshipStatus || 'Single';
    document.getElementById('relationshipStatus').textContent = capitalizeFirst(relationshipStatus);
    
    const familyCount = (family?.children?.length || 0) + 
                       (family?.siblings?.length || 0) + 
                       (family?.parents ? Object.keys(family.parents).length : 0);
    document.getElementById('familyCount').textContent = `${familyCount} family members`;

    // Social media overview
    document.getElementById('totalFollowers').textContent = formatNumber(social?.totalFollowers || 0);
    document.getElementById('mediaReputation').textContent = `${Math.round(social?.mediaProfile?.reputation || 50)}% reputation`;

    // Career overview
    document.getElementById('careerValue').textContent = formatCurrency(player?.marketValue || 0);
    
    const activeContract = financial?.activeContract;
    if (activeContract) {
        const contractEnd = new Date(activeContract.endDate);
        const yearsLeft = Math.max(0, (contractEnd.getFullYear() - new Date().getFullYear()));
        document.getElementById('contractStatus').textContent = `${yearsLeft} years left`;
    } else {
        document.getElementById('contractStatus').textContent = 'No contract';
    }
}

/**
 * Update financial tab
 */
function updateFinancialTab() {
    const financial = currentLifeData.financial;
    if (!financial) return;

    // Weekly financial stats
    document.getElementById('weeklyIncomeDetail').textContent = formatCurrency(financial.weeklyIncome || 0);
    document.getElementById('weeklyExpenses').textContent = formatCurrency(financial.weeklyExpenses || 0);
    document.getElementById('netWeekly').textContent = formatCurrency(financial.netWeekly || 0);
    document.getElementById('annualProjection').textContent = formatCurrency(financial.annualProjection || 0);
    
    // Breakdown
    document.getElementById('weeklySalary').textContent = financial.activeContract?.weeklySalary || 0;
    const sponsorshipIncome = financial.activeSponsorships?.reduce((sum, s) => sum + s.weeklyAmount, 0) || 0;
    document.getElementById('weeklySponsorship').textContent = sponsorshipIncome;

    // Update active sponsorships
    updateActiveSponsorships(financial.activeSponsorships || []);
    
    // Update available sponsorships
    updateAvailableSponsorships(financial.availableSponsorships || []);
    
    // Update investment opportunities
    updateInvestmentOpportunities();
}

/**
 * Update active sponsorships
 */
function updateActiveSponsorships(sponsorships) {
    const container = document.getElementById('activeSponsorships');
    
    if (sponsorships.length === 0) {
        container.innerHTML = '<p class="no-data">No active sponsorship deals</p>';
        return;
    }

    container.innerHTML = sponsorships.map(sponsorship => `
        <div class="sponsorship-card active">
            <div class="sponsor-info">
                <h4>${sponsorship.brand}</h4>
                <p>${sponsorship.type}</p>
            </div>
            <div class="sponsor-details">
                <div class="weekly-amount">${formatCurrency(sponsorship.weeklyAmount)}/week</div>
                <div class="total-earned">Earned: ${formatCurrency(sponsorship.totalEarned || 0)}</div>
                <div class="expires">Expires: ${new Date(sponsorship.endDate).toLocaleDateString()}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Update available sponsorships
 */
function updateAvailableSponsorships(sponsorships) {
    const container = document.getElementById('availableSponsorships');
    
    if (sponsorships.length === 0) {
        container.innerHTML = '<p class="no-data">No sponsorship offers available</p>';
        return;
    }

    container.innerHTML = sponsorships.map(sponsorship => `
        <div class="sponsorship-card available">
            <div class="sponsor-info">
                <h4>${sponsorship.brand}</h4>
                <p>${sponsorship.type}</p>
                <div class="sponsor-benefits">
                    ${Object.keys(sponsorship.benefits).map(benefit => 
                        `<span class="benefit">${benefit.replace('_', ' ')}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="sponsor-offer">
                <div class="offer-amount">${formatCurrency(sponsorship.weeklyAmount)}/week</div>
                <div class="offer-duration">${sponsorship.duration} weeks</div>
                <button class="sign-btn" onclick="signSponsorship('${sponsorship.id}')">
                    <span class="btn-icon">✍️</span>
                    <span class="btn-text">Sign Deal</span>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Update investment opportunities
 */
async function updateInvestmentOpportunities() {
    try {
        const opportunities = await window.footballAPI.getInvestmentOpportunities();
        const container = document.getElementById('investmentOpportunities');
        
        container.innerHTML = opportunities.map(investment => `
            <div class="investment-card">
                <div class="investment-info">
                    <h4>${investment.name}</h4>
                    <p>${investment.description}</p>
                    <div class="investment-details">
                        <span class="risk ${investment.risk.toLowerCase()}">${investment.risk} Risk</span>
                        <span class="return">${investment.expectedReturn}% Annual Return</span>
                    </div>
                </div>
                <div class="investment-action">
                    <div class="min-investment">Min: ${formatCurrency(investment.minInvestment)}</div>
                    <input type="number" placeholder="Amount" min="${investment.minInvestment}" 
                           id="investment_${investment.id}" class="investment-input">
                    <button onclick="makeInvestment('${investment.id}')" class="invest-btn">
                        <span class="btn-icon">📈</span>
                        <span class="btn-text">Invest</span>
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading investments:', error);
    }
}

/**
 * Update relationships tab
 */
function updateRelationshipsTab() {
    const family = currentLifeData.family;
    if (!family) return;

    updateRomanticSection(family);
    updateFamilySection(family);
}

/**
 * Update romantic section
 */
function updateRomanticSection(family) {
    const container = document.getElementById('romanticSection');
    const partner = family.partner;

    if (!partner) {
        container.innerHTML = `
            <div class="no-relationship">
                <div class="empty-state">
                    <div class="empty-icon">💕</div>
                    <h3>Single</h3>
                    <p>Ready to find love? Start dating to build meaningful relationships.</p>
                    <div class="relationship-options">
                        <button onclick="startRelationship('random')" class="action-btn primary">
                            <span class="btn-icon">❤️</span>
                            <span class="btn-text">Start Dating</span>
                        </button>
                        <button onclick="startRelationship('celebrity')" class="action-btn secondary">
                            <span class="btn-icon">⭐</span>
                            <span class="btn-text">Celebrity Dating</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const relationshipLevel = Math.round(partner.relationship);
    const statusColor = partner.status === 'married' ? 'married' : 
                       partner.status === 'engaged' ? 'engaged' : 'dating';

    container.innerHTML = `
        <div class="relationship-card">
            <div class="partner-info">
                <h3>${partner.name}</h3>
                <div class="relationship-status ${statusColor}">${capitalizeFirst(partner.status)}</div>
                <div class="relationship-details">
                    <p>Age: ${partner.age}</p>
                    <p>Occupation: ${partner.occupation}</p>
                    ${partner.children?.length ? `<p>Children: ${partner.children.length}</p>` : ''}
                </div>
            </div>
            
            <div class="relationship-meter">
                <h4>Relationship Level</h4>
                <div class="relationship-bar">
                    <div class="relationship-fill" style="width: ${relationshipLevel}%"></div>
                </div>
                <span>${relationshipLevel}%</span>
            </div>
            
            <div class="relationship-actions">
                <button onclick="progressRelationship('${partner.id}', 'spend_quality_time')" class="action-btn small">
                    <span class="btn-icon">⏰</span>
                    <span class="btn-text">Spend Time</span>
                </button>
                <button onclick="progressRelationship('${partner.id}', 'expensive_gift')" class="action-btn small">
                    <span class="btn-icon">🎁</span>
                    <span class="btn-text">Gift</span>
                </button>
                ${partner.status === 'dating' && relationshipLevel >= 80 ? `
                    <button onclick="progressRelationship('${partner.id}', 'propose')" class="action-btn small primary">
                        <span class="btn-icon">💍</span>
                        <span class="btn-text">Propose</span>
                    </button>
                ` : ''}
                ${partner.status === 'engaged' ? `
                    <button onclick="progressRelationship('${partner.id}', 'marry')" class="action-btn small primary">
                        <span class="btn-icon">💒</span>
                        <span class="btn-text">Marry</span>
                    </button>
                ` : ''}
                ${(partner.status === 'married' || relationshipLevel >= 90) ? `
                    <button onclick="progressRelationship('${partner.id}', 'have_child')" class="action-btn small">
                        <span class="btn-icon">👶</span>
                        <span class="btn-text">Have Child</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Update family section
 */
function updateFamilySection(family) {
    const container = document.getElementById('familyGrid');
    const familyMembers = [];

    // Add parents
    if (family.parents) {
        Object.entries(family.parents).forEach(([relation, parent]) => {
            if (parent.alive) {
                familyMembers.push({
                    name: parent.name,
                    relation: capitalizeFirst(relation),
                    relationship: Math.round(parent.relationship),
                    icon: relation === 'father' ? '👨' : '👩'
                });
            }
        });
    }

    // Add siblings
    if (family.siblings) {
        family.siblings.forEach(sibling => {
            familyMembers.push({
                name: sibling.name,
                relation: 'Sibling',
                relationship: Math.round(sibling.relationship),
                icon: '👥'
            });
        });
    }

    // Add children
    const partner = family.partner;
    if (partner && partner.children) {
        partner.children.forEach(child => {
            familyMembers.push({
                name: child.name,
                relation: 'Child',
                relationship: Math.round(child.relationship || 100),
                icon: '👶'
            });
        });
    }

    if (familyMembers.length === 0) {
        container.innerHTML = '<p class="no-data">No family information available</p>';
        return;
    }

    container.innerHTML = familyMembers.map(member => `
        <div class="family-member">
            <div class="member-icon">${member.icon}</div>
            <div class="member-info">
                <h4>${member.name}</h4>
                <p>${member.relation}</p>
                <div class="relationship-bar small">
                    <div class="relationship-fill" style="width: ${member.relationship}%"></div>
                </div>
                <span class="relationship-percent">${member.relationship}%</span>
            </div>
        </div>
    `).join('');
}

/**
 * Update social media tab
 */
function updateSocialMediaTab() {
    const social = currentLifeData.social;
    if (!social) return;

    // Update platform stats
    Object.entries(social.platforms || {}).forEach(([platform, data]) => {
        document.getElementById(`${platform}Followers`).textContent = formatNumber(data.followers);
        document.getElementById(`${platform}Engagement`).textContent = `${data.engagement.toFixed(1)}%`;
    });

    // Update reputation bar
    const reputation = social.mediaProfile?.reputation || 50;
    document.getElementById('reputationBar').style.width = `${reputation}%`;
    document.getElementById('reputationValue').textContent = `${Math.round(reputation)}%`;
}

/**
 * Update contracts tab
 */
function updateContractsTab() {
    const financial = currentLifeData.financial;
    if (!financial) return;

    updateCurrentContract(financial.activeContract);
    updateAgentSection(financial.manager);
}

/**
 * Update current contract display
 */
function updateCurrentContract(contract) {
    const container = document.getElementById('currentContract');
    
    if (!contract) {
        container.innerHTML = `
            <div class="no-contract">
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>No Active Contract</h3>
                    <p>You need to negotiate a contract with your club.</p>
                </div>
            </div>
        `;
        return;
    }

    const endDate = new Date(contract.endDate);
    const timeLeft = Math.max(0, endDate.getFullYear() - new Date().getFullYear());

    container.innerHTML = `
        <div class="contract-card">
            <div class="contract-header">
                <h3>${contract.club}</h3>
                <div class="contract-status active">Active Contract</div>
            </div>
            
            <div class="contract-details">
                <div class="contract-detail">
                    <label>Weekly Salary</label>
                    <div class="amount">${formatCurrency(contract.weeklySalary)}</div>
                </div>
                
                <div class="contract-detail">
                    <label>Goal Bonus</label>
                    <div class="amount">${formatCurrency(contract.goalBonus)}</div>
                </div>
                
                <div class="contract-detail">
                    <label>Assist Bonus</label>
                    <div class="amount">${formatCurrency(contract.assistBonus)}</div>
                </div>
                
                <div class="contract-detail">
                    <label>Contract Expires</label>
                    <div class="date">${endDate.toLocaleDateString()}</div>
                </div>
                
                <div class="contract-detail">
                    <label>Release Clause</label>
                    <div class="amount">${formatCurrency(contract.releaseClause)}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update agent section
 */
function updateAgentSection(manager) {
    const container = document.getElementById('agentSection');
    
    if (!manager) {
        container.innerHTML = `
            <div class="no-agent">
                <div class="empty-state">
                    <div class="empty-icon">🤝</div>
                    <h3>No Agent</h3>
                    <p>Hire an agent to help with contract negotiations and sponsorship deals.</p>
                    <button onclick="showAgentOptions()" class="action-btn primary">
                        <span class="btn-icon">👨‍💼</span>
                        <span class="btn-text">Hire Agent</span>
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="agent-card">
            <div class="agent-info">
                <h3>${manager.name}</h3>
                <p>${manager.experience}</p>
                <div class="agent-skills">
                    <div class="skill">
                        <label>Negotiation</label>
                        <div class="skill-bar">
                            <div class="skill-fill" style="width: ${manager.skills.negotiation}%"></div>
                        </div>
                        <span>${manager.skills.negotiation}%</span>
                    </div>
                    
                    <div class="skill">
                        <label>Marketing</label>
                        <div class="skill-bar">
                            <div class="skill-fill" style="width: ${manager.skills.marketing}%"></div>
                        </div>
                        <span>${manager.skills.marketing}%</span>
                    </div>
                </div>
            </div>
            
            <div class="agent-stats">
                <div class="stat">
                    <label>Commission</label>
                    <div class="value">${manager.commission}%</div>
                </div>
                
                <div class="stat">
                    <label>Weekly Cost</label>
                    <div class="value">${formatCurrency(manager.cost)}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    document.getElementById('postContentBtn').addEventListener('click', postSocialMediaContent);
    document.getElementById('giveInterviewBtn').addEventListener('click', giveMediaInterview);
    document.getElementById('negotiateBtn').addEventListener('click', negotiateContract);
}

/**
 * Tab switching functionality
 */
function switchLifeTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.life-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.life-tab[onclick="switchLifeTab('${tabName}')"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.life-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

/**
 * Sign sponsorship deal
 */
async function signSponsorship(sponsorshipId) {
    try {
        const result = await window.footballAPI.signSponsorship(sponsorshipId);
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadLifeData(); // Refresh data
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error signing sponsorship:', error);
        showNotification('Error signing sponsorship deal', 'error');
    }
}

/**
 * Make investment
 */
async function makeInvestment(investmentId) {
    const amountInput = document.getElementById(`investment_${investmentId}`);
    const amount = parseInt(amountInput.value);
    
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid investment amount', 'error');
        return;
    }
    
    try {
        const result = await window.footballAPI.makeInvestment(investmentId, amount);
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadLifeData(); // Refresh data
            amountInput.value = '';
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error making investment:', error);
        showNotification('Error making investment', 'error');
    }
}

/**
 * Start relationship
 */
async function startRelationship(partnerType) {
    try {
        const result = await window.footballAPI.startRelationship(partnerType);
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadLifeData(); // Refresh data
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error starting relationship:', error);
        showNotification('Error starting relationship', 'error');
    }
}

/**
 * Progress relationship
 */
async function progressRelationship(partnerId, action) {
    try {
        const result = await window.footballAPI.progressRelationship(partnerId, action);
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadLifeData(); // Refresh data
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error progressing relationship:', error);
        showNotification('Error updating relationship', 'error');
    }
}

/**
 * Post social media content
 */
async function postSocialMediaContent() {
    const platform = document.getElementById('platformSelect').value;
    const contentType = document.getElementById('contentTypeSelect').value;
    
    try {
        const result = await window.footballAPI.postSocialMedia(platform, contentType, '');
        
        let message = `Posted ${contentType.replace('_', ' ')} on ${platform}!`;
        if (result.followerChange > 0) {
            message += ` +${formatNumber(result.followerChange)} followers`;
        }
        if (result.earnings > 0) {
            message += ` | Earned ${formatCurrency(result.earnings)}`;
        }
        
        showNotification(message, 'success');
        
        if (result.controversy) {
            showNotification(`⚠️ Controversy: ${result.controversy.description}`, 'warning');
        }
        
        loadLifeData(); // Refresh data
    } catch (error) {
        console.error('Error posting content:', error);
        showNotification('Error posting content', 'error');
    }
}

/**
 * Give media interview
 */
async function giveMediaInterview() {
    const topic = document.getElementById('interviewTopic').value;
    const approach = document.getElementById('interviewApproach').value;
    
    try {
        const result = await window.footballAPI.handleMediaInterview(topic, approach);
        
        showNotification(result.message, result.success ? 'success' : 'warning');
        loadLifeData(); // Refresh data
    } catch (error) {
        console.error('Error with interview:', error);
        showNotification('Error conducting interview', 'error');
    }
}

/**
 * Negotiate contract
 */
async function negotiateContract() {
    const salary = parseInt(document.getElementById('salaryDemand').value);
    const goalBonus = parseInt(document.getElementById('goalBonus').value) || 5000;
    const assistBonus = parseInt(document.getElementById('assistBonus').value) || 3000;
    const length = parseInt(document.getElementById('contractLength').value) || 3;
    
    if (!salary || salary <= 0) {
        showNotification('Please enter a valid salary demand', 'error');
        return;
    }
    
    try {
        const bonuses = { goal: goalBonus, assist: assistBonus };
        const result = await window.footballAPI.negotiateContract(salary, bonuses, length);
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadLifeData(); // Refresh data
        } else {
            showNotification(result.message, 'error');
            if (result.maxOffered) {
                showNotification(`Club's maximum offer: ${formatCurrency(result.maxOffered)}/week`, 'info');
            }
        }
    } catch (error) {
        console.error('Error negotiating contract:', error);
        showNotification('Error negotiating contract', 'error');
    }
}

/**
 * Utility functions
 */
function formatCurrency(value) {
    if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(0)}K`;
    } else {
        return `€${value.toLocaleString()}`;
    }
}

function formatNumber(value) {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    } else {
        return value.toLocaleString();
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-glass);
        border-radius: 12px;
        padding: 16px 24px;
        color: var(--text-primary);
        font-weight: 500;
        box-shadow: var(--shadow-glass);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add type-specific styling
    if (type === 'success') {
        notification.style.borderLeftColor = 'var(--accent-success)';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        notification.style.borderLeftColor = 'var(--accent-danger)';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'warning') {
        notification.style.borderLeftColor = 'var(--accent-warning)';
        notification.style.borderLeftWidth = '4px';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showErrorMessage() {
    const container = document.querySelector('.dashboard-container');
    container.innerHTML = `
        <div class="dashboard-header">
            <h1>🌟 Life Management</h1>
            <button onclick="window.location.href='index.html'" class="back-button">
                <span class="btn-icon">←</span>
                <span class="btn-text">Back to Dashboard</span>
            </button>
        </div>
        <div class="error-message">
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h2>Error Loading Life Data</h2>
                <p>There was a problem loading your life management information.</p>
                <button onclick="location.reload()" class="action-btn primary">
                    <span class="btn-icon">🔄</span>
                    <span class="btn-text">Retry</span>
                </button>
            </div>
        </div>
    `;
}