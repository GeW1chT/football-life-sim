// backend/languageManager.js

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.languages = {
            en: {
                name: 'English',
                flag: '🇺🇸',
                translations: {
                    // Main Menu
                    'football_life_simulator': 'Football Life Simulator',
                    'player_profile': 'Player Profile',
                    'name': 'Name',
                    'age': 'Age',
                    'team': 'Team',
                    'position': 'Position',
                    'market_value': 'Market Value',
                    'reputation': 'Reputation',
                    'free_agent': 'Free Agent',
                    'unknown': 'Unknown',
                    
                    // Player Stats
                    'player_statistics': 'Player Statistics',
                    'speed': 'Speed',
                    'shooting': 'Shooting',
                    'passing': 'Passing',
                    'defense': 'Defense',
                    'stamina': 'Stamina',
                    'intelligence': 'Intelligence',
                    
                    // Game Actions
                    'next_week': 'Next Week',
                    'transfer_market': 'Transfer Market',
                    'training': 'Training',
                    'staff_management': 'Staff Management',
                    'facility_management': 'Facility Management',
                    'league_table': 'League Table',
                    'analytics': 'Analytics',
                    'ai_manager': 'AI Manager',
                    'personal_life': 'Personal Life',
                    'world_leagues': 'World Leagues',
                    
                    // Player Creation
                    'create_football_career': 'Create Your Football Career',
                    'shape_destiny': 'Shape your destiny as a professional footballer',
                    'personal_information': 'Personal Information',
                    'player_name': 'Player Name',
                    'enter_name': 'Enter your name',
                    'starting_age': 'Starting Age',
                    'years_old': 'years old',
                    'nationality': 'Nationality',
                    'choose_country': 'Choose your country...',
                    'goalkeeper': 'Goalkeeper',
                    'defender': 'Defender',
                    'midfielder': 'Midfielder',
                    'forward': 'Forward',
                    
                    // Career Path
                    'career_path': 'Career Path',
                    'starting_league': 'Starting League',
                    'choose_league': 'Choose a league...',
                    'preferred_team': 'Preferred Team',
                    'random_team': 'Random Team',
                    'career_ambition': 'Career Ambition',
                    'balanced_career': 'Balanced Career',
                    'money_focused': 'Money Focused',
                    'trophy_hunter': 'Trophy Hunter',
                    'become_legend': 'Become a Legend',
                    
                    // Starting Attributes
                    'starting_attributes': 'Starting Attributes',
                    'skill_points': 'skill points to distribute',
                    'player_preview': 'Player Preview',
                    'start_career': 'Start My Career!',
                    
                    // Match Results
                    'match_result': 'Match Result',
                    'your_team': 'Your Team',
                    'opponent': 'Opponent',
                    'goals': 'Goals',
                    'assists': 'Assists',
                    'performance_rating': 'Performance Rating',
                    
                    // Common
                    'loading': 'Loading...',
                    'back': 'Back',
                    'confirm': 'Confirm',
                    'cancel': 'Cancel',
                    'save': 'Save',
                    'settings': 'Settings',
                    'language': 'Language'
                }
            },
            tr: {
                name: 'Türkçe',
                flag: '🇹🇷',
                translations: {
                    // Ana Menü
                    'football_life_simulator': 'Futbol Yaşam Simülatörü',
                    'player_profile': 'Oyuncu Profili',
                    'name': 'İsim',
                    'age': 'Yaş',
                    'team': 'Takım',
                    'position': 'Pozisyon',
                    'market_value': 'Piyasa Değeri',
                    'reputation': 'İtibar',
                    'free_agent': 'Serbest Oyuncu',
                    'unknown': 'Bilinmiyor',
                    
                    // Oyuncu İstatistikleri
                    'player_statistics': 'Oyuncu İstatistikleri',
                    'speed': 'Hız',
                    'shooting': 'Şut',
                    'passing': 'Pas',
                    'defense': 'Savunma',
                    'stamina': 'Dayanıklılık',
                    'intelligence': 'Zeka',
                    
                    // Oyun Aksiyonları
                    'next_week': 'Sonraki Hafta',
                    'transfer_market': 'Transfer Pazarı',
                    'training': 'Antrenman',
                    'staff_management': 'Personel Yönetimi',
                    'facility_management': 'Tesis Yönetimi',
                    'league_table': 'Lig Tablosu',
                    'analytics': 'Analitik',
                    'ai_manager': 'AI Menajer',
                    'personal_life': 'Kişisel Yaşam',
                    'world_leagues': 'Dünya Ligleri',
                    
                    // Oyuncu Oluşturma
                    'create_football_career': 'Futbol Kariyerini Oluştur',
                    'shape_destiny': 'Profesyonel bir futbolcu olarak kaderini şekillendir',
                    'personal_information': 'Kişisel Bilgiler',
                    'player_name': 'Oyuncu Adı',
                    'enter_name': 'Adını gir',
                    'starting_age': 'Başlangıç Yaşı',
                    'years_old': 'yaşında',
                    'nationality': 'Uyruk',
                    'choose_country': 'Ülkeni seç...',
                    'goalkeeper': 'Kaleci',
                    'defender': 'Defans',
                    'midfielder': 'Orta Saha',
                    'forward': 'Forvet',
                    
                    // Kariyer Yolu
                    'career_path': 'Kariyer Yolu',
                    'starting_league': 'Başlangıç Ligi',
                    'choose_league': 'Bir lig seç...',
                    'preferred_team': 'Tercih Edilen Takım',
                    'random_team': 'Rastgele Takım',
                    'career_ambition': 'Kariyer Hedefi',
                    'balanced_career': 'Dengeli Kariyer',
                    'money_focused': 'Para Odaklı',
                    'trophy_hunter': 'Kupa Avcısı',
                    'become_legend': 'Efsane Ol',
                    
                    // Başlangıç Özellikleri
                    'starting_attributes': 'Başlangıç Özellikleri',
                    'skill_points': 'yetenek puanı dağıtılacak',
                    'player_preview': 'Oyuncu Önizlemesi',
                    'start_career': 'Kariyerimi Başlat!',
                    
                    // Maç Sonuçları
                    'match_result': 'Maç Sonucu',
                    'your_team': 'Takımın',
                    'opponent': 'Rakip',
                    'goals': 'Gol',
                    'assists': 'Asist',
                    'performance_rating': 'Performans Puanı',
                    
                    // Genel
                    'loading': 'Yükleniyor...',
                    'back': 'Geri',
                    'confirm': 'Onayla',
                    'cancel': 'İptal',
                    'save': 'Kaydet',
                    'settings': 'Ayarlar',
                    'language': 'Dil'
                }
            }
        };
    }

    /**
     * Set the current language
     */
    setLanguage(languageCode) {
        if (this.languages[languageCode]) {
            this.currentLanguage = languageCode;
            // Save to local storage
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('football-sim-language', languageCode);
            }
            return true;
        }
        return false;
    }

    /**
     * Get the current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.languages).map(code => ({
            code,
            name: this.languages[code].name,
            flag: this.languages[code].flag
        }));
    }

    /**
     * Translate a key
     */
    translate(key) {
        const translations = this.languages[this.currentLanguage]?.translations;
        return translations?.[key] || key;
    }

    /**
     * Get translation with fallback
     */
    t(key, fallback = null) {
        const translation = this.translate(key);
        return translation !== key ? translation : (fallback || key);
    }

    /**
     * Initialize language from saved preference
     */
    initialize() {
        if (typeof localStorage !== 'undefined') {
            const savedLanguage = localStorage.getItem('football-sim-language');
            if (savedLanguage && this.languages[savedLanguage]) {
                this.currentLanguage = savedLanguage;
            }
        }
    }

    /**
     * Get all translations for current language
     */
    getAllTranslations() {
        return this.languages[this.currentLanguage]?.translations || {};
    }
}

module.exports = LanguageManager;