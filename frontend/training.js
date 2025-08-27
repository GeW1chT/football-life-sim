// frontend/training.js

document.addEventListener('DOMContentLoaded', () => {
    // Tüm antrenman butonlarını seç
    const trainingButtons = document.querySelectorAll('.training-buttons button');
    
    // Her butona tıklama olayını dinle
    trainingButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const statToTrain = event.target.dataset.stat;
            
            // Ana sürece antrenman isteği gönder
            const updatedPlayer = await window.footballAPI.trainPlayer(statToTrain);
            
            if (updatedPlayer) {
                alert(`You trained your ${statToTrain} stat!`);
                // Antrenman sonrası ana panele geri dön
                window.location.href = 'index.html';
            } else {
                alert('Training failed.');
            }
        });
    });

    // Ana panele geri dönme butonu
    document.getElementById('backToDashboardBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});