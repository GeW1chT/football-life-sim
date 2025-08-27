// backend/transfers.js
const teams = require('../data/teams.json');

class TransferSystem {

  // Oyuncunun genel derecesini hesapla
  static calculatePlayerRating(player) {
    const stats = player.stats;
    // Tüm statların ortalamasını alarak basit bir derecelendirme
    const totalStats = stats.speed + stats.shooting + stats.passing + stats.defense + stats.stamina;
    const rating = Math.round(totalStats / Object.keys(stats).length);
    return rating;
  }
  
  // Oyuncuya yeni teklifler oluştur
  static generateOffers(player) {
    const playerRating = this.calculatePlayerRating(player);
    const offers = [];
    
    // Teklif gelme olasılığı (Oyuncu derecesi yükseldikçe olasılık artsın)
    if (Math.random() > 0.3) { // %70 ihtimalle teklif gelme şansı
      
      // Teklif yapacak takım sayısını belirle
      const numberOfOffers = Math.floor(Math.random() * 3) + 1; // 1-3 arası teklif

      // Oyuncunun derecesine uygun takımları filtrele
      const suitableTeams = teams.filter(team => {
        // Takım gücü oyuncu derecesine yakın olmalı
        const powerDifference = Math.abs(team.power - playerRating);
        return powerDifference < 20; // 20 puan farktan az olanlar uygun kabul edilsin
      });
      
      // En iyi teklifleri seç
      for (let i = 0; i < numberOfOffers && i < suitableTeams.length; i++) {
        const team = suitableTeams[Math.floor(Math.random() * suitableTeams.length)];
        
        // Teklif detaylarını oluştur
        const offerSalary = Math.round(playerRating * 5000 + Math.random() * 20000); // Oyuncu derecesine göre maaş
        const offerDuration = Math.floor(Math.random() * 4) + 1; // 1-4 yıl arası kontrat
        
        offers.push({
          teamName: team.name,
          salary: offerSalary,
          duration: offerDuration,
          id: `${team.name}-${Date.now()}`
        });
      }
    }
    
    return offers;
  }
}

module.exports = TransferSystem;