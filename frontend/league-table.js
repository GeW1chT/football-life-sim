// frontend/league-table.js

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#league-table tbody');
    
    // Ana süreçten lig sıralamasını al
    const rankings = await window.footballAPI.getLeagueRankings();
    
    // Tabloyu doldur
    rankings.forEach((team, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}</td>
            <td>${team.points}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
        `;
        tableBody.appendChild(row);
    });

    // Ana panele geri dönme butonu
    document.getElementById('backToDashboardBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});