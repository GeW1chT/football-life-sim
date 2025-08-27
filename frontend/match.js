// frontend/match.js

document.addEventListener('DOMContentLoaded', () => {
    // Ana süreçten maç verilerini al
    window.footballAPI.getLatestMatchResult().then(matchData => {
        if (matchData) {
            updateMatchUI(matchData);
        } else {
            // Veri yoksa bir hata mesajı göster
            document.getElementById('matchResult').textContent = 'Match data could not be loaded.';
        }
    });

    // "Back to Career" butonu tıklaması
    document.getElementById('backToDashboardBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

function updateMatchUI(matchData) {
    document.getElementById('matchResult').textContent = `Match Result: ${matchData.result}`;
    document.getElementById('myTeamGoals').textContent = matchData.myTeamGoals;
    document.getElementById('opponentGoals').textContent = matchData.opponentGoals;
    document.getElementById('playerGoals').textContent = matchData.playerPerformance.goals;
    document.getElementById('playerAssists').textContent = matchData.playerPerformance.assists;
}