// frontend/creation.js
document.addEventListener('DOMContentLoaded', () => {
    const createPlayerBtn = document.getElementById('createPlayerBtn');
    
    createPlayerBtn.addEventListener('click', async () => {
        const playerName = document.getElementById('playerNameInput').value.trim();
        const playerPosition = document.getElementById('playerPositionSelect').value;

        if (playerName === '') {
            alert('Please enter a name for your player!');
            return;
        }

        const playerData = {
            name: playerName,
            position: playerPosition
        };

        const newPlayer = await window.footballAPI.createPlayer(playerData);
        
        if (newPlayer) {
            window.location.href = 'index.html';
        } else {
            alert('Failed to create player.');
        }
    });
});