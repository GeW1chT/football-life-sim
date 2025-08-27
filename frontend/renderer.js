// frontend/renderer.js
document.addEventListener('DOMContentLoaded', () => {
    window.footballAPI.getPlayerInfo().then(playerData => {
        if (playerData) {
            updatePlayerUI(playerData);
        } else {
            console.log('No player found. Ready to create a new one!');
        }
    });

    document.getElementById('nextWeekBtn').addEventListener('click', async () => {
        const { hasMediaEvent } = await window.footballAPI.nextWeek();

        if (hasMediaEvent) {
            window.location.href = 'media-event.html';
        } else {
            window.location.href = 'match.html';
        }
    });

    document.getElementById('trainingBtn').addEventListener('click', async () => {
        window.location.href = 'training.html';
    });
    
    document.getElementById('transferMarketBtn').addEventListener('click', async () => {
        window.location.href = 'transfer-market.html';
    });
    
    // Yeni eklenen buton için olay dinleyicisi
    document.getElementById('leagueTableBtn').addEventListener('click', async () => {
        window.location.href = 'league-table.html';
    });
});

/**
 * Arayüzü verilen oyuncu verileriyle günceller.
 * @param {object} playerData Oyuncu veri nesnesi.
 */
function updatePlayerUI(playerData) {
    if (!playerData) {
        console.error('Player data is null. Cannot update UI.');
        return;
    }
    
    document.getElementById('playerName').textContent = playerData.name || 'N/A';
    document.getElementById('playerAge').textContent = playerData.age || 'N/A';
    document.getElementById('playerTeam').textContent = playerData.team || 'Free Agent';
    document.getElementById('playerPosition').textContent = playerData.position || 'N/A';
    document.getElementById('playerReputation').textContent = playerData.reputation;
    
    document.getElementById('statSpeed').textContent = playerData.stats.speed;
    document.getElementById('statShooting').textContent = playerData.stats.shooting;
    document.getElementById('statPassing').textContent = playerData.stats.passing;
    document.getElementById('statDefense').textContent = playerData.stats.defense;
    document.getElementById('statStamina').textContent = playerData.stats.stamina;
}