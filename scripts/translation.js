// Translation System - Easy to maintain and extend
const translations = {
  de: {
    // Page title
    title: "Schloss Ebelsberg – AR Escape Erlebnis",
    
    // Navigation
    nav: {
      home: "Startseite",
      entertainment: "Entertainmentangebote",
      treasure_hunt: "Schnitzeljagd",
      puzzle_room: "Rätselraum",
      contact_directions: "Kontakt & Anfahrt",
      contact: "Kontakt",
      directions: "Anfahrt"
    },
    
    // Hero section
    hero: {
      title: "AR Escape Erlebnis Schloss Ebelsberg",
      subtitle: "Entdecke Napoleons Spuren – direkt vor Ort mit deinem Smartphone.",
      btn_puzzle: "🔐 Rätselraum",
      btn_hunt: "🗺️ Schnitzeljagd"
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Schloss Ebelsberg AR Experience. Alle Rechte vorbehalten."
    }
  },
  
  en: {
    // Page title
    title: "Castle Ebelsberg – AR Escape Experience",
    
    // Navigation
    nav: {
      home: "Home",
      entertainment: "Entertainment Offers",
      treasure_hunt: "Treasure Hunt",
      puzzle_room: "Puzzle Room",
      contact_directions: "Contact & Directions",
      contact: "Contact",
      directions: "Directions"
    },
    
    // Hero section
    hero: {
      title: "AR Escape Experience Castle Ebelsberg",
      subtitle: "Discover Napoleon's traces – on-site with your smartphone.",
      btn_puzzle: "🔐 Puzzle Room",
      btn_hunt: "🗺️ Treasure Hunt"
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Castle Ebelsberg AR Experience. All rights reserved."
    }
  }
};

// Language Manager Class
class LanguageManager {
  constructor() {
    this.currentLanguage = 'de';
    this.translations = translations;
    this.init();
  }
  
  init() {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && this.translations[savedLang]) {
      this.currentLanguage = savedLang;
    }
    
    // Set initial language
    this.setLanguage(this.currentLanguage);
    
    // Update active language button
    this.updateLanguageButtons();
  }
  
  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not found. Using default: de`);
      lang = 'de';
    }
    
    this.currentLanguage = lang;
    
    // Save language preference
    localStorage.setItem('preferred-language', lang);
    
    // Update document language
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    this.updateContent();
    
    // Update language buttons
    this.updateLanguageButtons();
  }
  
  updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        // Handle different element types
        if (element.tagName.toLowerCase() === 'title') {
          element.textContent = translation;
        } else if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else if (element.hasAttribute('aria-label')) {
          element.setAttribute('aria-label', translation);
        } else {
          element.textContent = translation;
        }
      }
    });
  }
  
  getTranslation(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
        return null;
      }
    }
    
    return translation;
  }
  
  updateLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === this.currentLanguage) {
        btn.classList.add('active');
      }
    });
  }
  
  // Method to add new translations programmatically
  addTranslations(lang, newTranslations) {
    if (!this.translations[lang]) {
      this.translations[lang] = {};
    }
    
    // Deep merge translations
    this.translations[lang] = this.deepMerge(this.translations[lang], newTranslations);
  }
  
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Make it globally available
window.languageManager = languageManager;