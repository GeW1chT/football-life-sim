// frontend/transfer-market.js

document.addEventListener('DOMContentLoaded', async () => {
    // Ana süreçten transfer tekliflerini al
    const offers = await window.footballAPI.getTransferOffers();
    const offersList = document.getElementById('offers-list');
    const noOffersMessage = document.getElementById('no-offers-message');

    if (offers && offers.length > 0) {
        noOffersMessage.style.display = 'none'; // "Teklif yok" mesajını gizle
        offers.forEach(offer => {
            const offerElement = document.createElement('div');
            offerElement.className = 'offer-card';
            offerElement.innerHTML = `
                <h3>${offer.teamName}</h3>
                <p><strong>Salary:</strong> $${offer.salary.toLocaleString()}</p>
                <p><strong>Duration:</strong> ${offer.duration} years</p>
                <div class="offer-actions">
                    <button class="accept-btn" data-offer-id="${offer.id}">Accept</button>
                    <button class="reject-btn" data-offer-id="${offer.id}">Reject</button>
                </div>
            `;
            offersList.appendChild(offerElement);
        });
        
        // Kabul et ve Reddet butonları için olay dinleyicileri ekle
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', handleAcceptOffer);
        });

        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', handleRejectOffer);
        });

    } else {
        noOffersMessage.style.display = 'block'; // "Teklif yok" mesajını göster
    }

    // Ana panele geri dönme butonu
    document.getElementById('backToDashboardBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

async function handleAcceptOffer(event) {
    const offerId = event.target.dataset.offerId;
    const isAccepted = await window.footballAPI.acceptOffer(offerId);

    if (isAccepted) {
        alert('Offer accepted! You have transferred to your new team.');
        window.location.href = 'index.html';
    } else {
        alert('An error occurred while accepting the offer.');
    }
}

async function handleRejectOffer(event) {
    const offerId = event.target.dataset.offerId;
    await window.footballAPI.rejectOffer(offerId);
    alert('Offer rejected.');
    
    // Sayfayı yeniden yükleyerek güncel teklif listesini göster
    window.location.reload();
}