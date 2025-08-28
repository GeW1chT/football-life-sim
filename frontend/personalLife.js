// frontend/personalLife.js
let playerData = null;
let personalLifeData = null;
let selectedPurchaseItem = null;
let selectedActivity = null;

document.addEventListener('DOMContentLoaded', () => {
    initializePersonalLife();
    setupEventListeners();
});

async function initializePersonalLife() {
    try {
        playerData = await window.footballAPI.getPlayerInfo();
        if (playerData) {
            personalLifeData = await window.footballAPI.getPersonalLifeData();
            updateAllSections();
            animateElements();
        } else {
            showNoPlayerMessage();
        }
    } catch (error) {
        console.error('Error loading personal life data:', error);
        showErrorMessage();
    }
}

function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        navigateWithTransition('index.html');
    });
}

function updateAllSections() {
    updateLifestyleMetrics();
    updateRealEstateSection();
    updateVehicleSection();
    updateNightlifeSection();
    updateShoppingSection();
    updateInvestmentSection();
}

function updateLifestyleMetrics() {
    if (!personalLifeData) return;
    
    const lifestyle = personalLifeData.lifestyle;
    document.getElementById('happinessLevel').textContent = `${lifestyle.happiness}%`;
    document.getElementById('stressLevel').textContent = `${lifestyle.stress}%`;
    document.getElementById('energyLevel').textContent = `${lifestyle.energy}%`;
    document.getElementById('luxuryLevel').textContent = `${lifestyle.luxury}%`;
    
    document.getElementById('happinessBar').style.width = `${lifestyle.happiness}%`;
    document.getElementById('stressBar').style.width = `${lifestyle.stress}%`;
    document.getElementById('energyBar').style.width = `${lifestyle.energy}%`;
    document.getElementById('luxuryBar').style.width = `${lifestyle.luxury}%`;
    
    document.getElementById('netWorth').textContent = `€${personalLifeData.netWorth.toLocaleString()}`;
    document.getElementById('monthlyExpenses').textContent = `€${personalLifeData.monthlyExpenses.toLocaleString()}`;
}

function updateRealEstateSection() {
    if (!personalLifeData) return;
    
    const owned = personalLifeData.properties.owned;
    const available = personalLifeData.properties.available;
    
    document.getElementById('ownedPropertiesCount').textContent = owned.length;
    
    const ownedContainer = document.getElementById('ownedProperties');
    if (owned.length === 0) {
        ownedContainer.innerHTML = '<div class="empty-state">No properties owned</div>';
    } else {
        ownedContainer.innerHTML = owned.map(property => `
            <div class="owned-property-card">
                <h4>${property.name}</h4>
                <div>Location: ${property.location}</div>
                <div>Value: €${property.price.toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    document.getElementById('availableProperties').innerHTML = available.map(property => `
        <div class="property-card">
            <h4>${property.name}</h4>
            <p>${property.description}</p>
            <div>Price: €${property.price.toLocaleString()}</div>
            <button onclick="showPurchaseModal('property', '${property.id}')">Purchase</button>
        </div>
    `).join('');
}

function updateVehicleSection() {
    if (!personalLifeData) return;
    
    const owned = personalLifeData.vehicles.owned;
    const available = personalLifeData.vehicles.available;
    
    document.getElementById('ownedVehiclesCount').textContent = owned.length;
    
    const ownedContainer = document.getElementById('ownedVehicles');
    if (owned.length === 0) {
        ownedContainer.innerHTML = '<div class="empty-state">No vehicles owned</div>';
    } else {
        ownedContainer.innerHTML = owned.map(vehicle => `
            <div class="owned-vehicle-card">
                <h4>${vehicle.name}</h4>
                <div>Type: ${vehicle.type}</div>
                <div>Value: €${Math.floor(vehicle.price * 0.8).toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    document.getElementById('availableVehicles').innerHTML = available.map(vehicle => `
        <div class="vehicle-card">
            <h4>${vehicle.name}</h4>
            <p>${vehicle.description}</p>
            <div>Price: €${vehicle.price.toLocaleString()}</div>
            <button onclick="showPurchaseModal('vehicle', '${vehicle.id}')">Purchase</button>
        </div>
    `).join('');
}

function updateNightlifeSection() {
    if (!personalLifeData) return;
    
    const nightlife = personalLifeData.activities.nightlife;
    const entertainment = personalLifeData.activities.entertainment;
    
    document.getElementById('nightlifeActivities').innerHTML = nightlife.map(activity => `
        <div class="activity-card">
            <h4>${activity.name}</h4>
            <p>${activity.description}</p>
            <div>Cost: €${activity.cost.toLocaleString()}</div>
            <button onclick="showActivityModal('${activity.id}')">Start</button>
        </div>
    `).join('');
    
    document.getElementById('entertainmentActivities').innerHTML = entertainment.map(activity => `
        <div class="activity-card">
            <h4>${activity.name}</h4>
            <p>${activity.description}</p>
            <div>Cost: €${activity.cost.toLocaleString()}</div>
            <button onclick="showActivityModal('${activity.id}')">Start</button>
        </div>
    `).join('');
}

function updateShoppingSection() {
    if (!personalLifeData) return;
    
    const shopping = personalLifeData.shopping;
    
    ['clothing', 'accessories', 'electronics'].forEach(category => {
        const container = document.getElementById(category);
        if (container && shopping[category]) {
            container.innerHTML = shopping[category].map(item => `
                <div class="shopping-item-card">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div>Price: €${item.price.toLocaleString()}</div>
                    <button onclick="showPurchaseModal('item', '${item.id}', '${category}')">Buy</button>
                </div>
            `).join('');
        }
    });
}

function updateInvestmentSection() {
    if (!personalLifeData) return;
    
    const portfolio = personalLifeData.investments.portfolio;
    const available = personalLifeData.investments.available;
    
    const portfolioValue = portfolio.reduce((sum, inv) => sum + inv.initialCost + inv.totalReturns, 0);
    document.getElementById('portfolioValue').textContent = `€${portfolioValue.toLocaleString()}`;
    
    const portfolioContainer = document.getElementById('investmentPortfolio');
    if (portfolio.length === 0) {
        portfolioContainer.innerHTML = '<div class="empty-state">No investments</div>';
    } else {
        portfolioContainer.innerHTML = portfolio.map(investment => `
            <div class="owned-investment-card">
                <h4>${investment.name}</h4>
                <div>Value: €${(investment.initialCost + investment.totalReturns).toLocaleString()}</div>
                <div>Returns: €${investment.totalReturns.toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    document.getElementById('availableInvestments').innerHTML = available.map(investment => `
        <div class="investment-card">
            <h4>${investment.name}</h4>
            <p>${investment.description}</p>
            <div>Cost: €${investment.initialCost.toLocaleString()}</div>
            <div>Monthly Return: €${investment.monthlyReturn.toLocaleString()}</div>
            <button onclick="showPurchaseModal('investment', '${investment.id}')">Invest</button>
        </div>
    `).join('');
}

function switchShoppingTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchShoppingTab('${tab}')"]`).classList.add('active');
    
    document.querySelectorAll('.shopping-category').forEach(category => {
        category.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');
}

function showPurchaseModal(type, itemId, category = null) {
    // Simple modal implementation
    let item;
    if (type === 'property') {
        item = personalLifeData.properties.available.find(p => p.id === itemId);
        selectedPurchaseItem = { type, item, action: 'purchaseProperty' };
    } else if (type === 'vehicle') {
        item = personalLifeData.vehicles.available.find(v => v.id === itemId);
        selectedPurchaseItem = { type, item, action: 'purchaseVehicle' };
    } else if (type === 'item') {
        item = personalLifeData.shopping[category].find(i => i.id === itemId);
        selectedPurchaseItem = { type, item, category, action: 'buyItem' };
    } else if (type === 'investment') {
        item = personalLifeData.investments.available.find(i => i.id === itemId);
        selectedPurchaseItem = { type, item, action: 'makePersonalInvestment' };
    }
    
    if (confirm(`Purchase ${item.name} for €${(item.price || item.initialCost).toLocaleString()}?`)) {
        confirmPurchase();
    }
}

function showActivityModal(activityId) {
    const activity = findActivityById(activityId);
    if (activity && confirm(`Start ${activity.name} for €${activity.cost.toLocaleString()}?`)) {
        selectedActivity = activity;
        startActivity();
    }
}

async function confirmPurchase() {
    if (!selectedPurchaseItem) return;
    
    try {
        let result;
        const { action, item, category } = selectedPurchaseItem;
        
        switch (action) {
            case 'purchaseProperty':
                result = await window.footballAPI.purchaseProperty(item.id);
                break;
            case 'purchaseVehicle':
                result = await window.footballAPI.purchaseVehicle(item.id);
                break;
            case 'buyItem':
                result = await window.footballAPI.buyItem(item.id, category);
                break;
            case 'makePersonalInvestment':
                result = await window.footballAPI.makePersonalInvestment(item.id);
                break;
        }
        
        if (result.success) {
            alert(result.message);
            await initializePersonalLife();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Purchase error:', error);
        alert('Purchase failed');
    }
}

async function startActivity() {
    if (!selectedActivity) return;
    
    try {
        const result = await window.footballAPI.goOut(selectedActivity.id);
        if (result.success) {
            alert(result.message);
            await initializePersonalLife();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Activity error:', error);
        alert('Activity failed');
    }
}

function findActivityById(activityId) {
    for (const category of Object.values(personalLifeData.activities)) {
        const activity = category.find(a => a.id === activityId);
        if (activity) return activity;
    }
    return null;
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

function showNoPlayerMessage() {
    document.querySelector('.personal-life-dashboard').innerHTML = 
        '<div class="no-data-message"><h2>🏠 Personal Life Not Available</h2><p>Create a player first.</p></div>';
}

function showErrorMessage() {
    document.querySelector('.personal-life-dashboard').innerHTML = 
        '<div class="error-message"><h2>❌ Error</h2><p>Unable to load data.</p></div>';
}