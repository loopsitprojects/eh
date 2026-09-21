import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import wonderLogo from '../assets/wonder-logo.png';
import { Sparkles, Globe, Check } from 'lucide-react';

export default function LanguageSelectModal() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup on initial entry if user hasn't explicitly chosen a language yet
    const hasChosen = localStorage.getItem('wonder_lang_chosen');
    if (!hasChosen) {
      setIsOpen(true);
    }
  }, []);

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('wonder_lang_chosen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="lang-modal-overlay">
      <div className="lang-modal-card tactile-card animate-pop-in">
        
        {/* Top Logo & Sparkle Badge */}
        <div className="lang-modal-header">
          <div className="lang-modal-logo-wrapper">
            <img src={wonderLogo} alt="Wonder Ice Cream" className="lang-modal-logo" />
          </div>

          <div className="lang-modal-tag">
            <Globe size={16} color="#00B5EC" />
            <span>WELCOME TO WONDER WISHES</span>
          </div>

          <h2 className="lang-modal-title">
            <span>Select Your Language</span>
            <span className="title-sub-sinhala">ඔබගේ භාෂාව තෝරන්න</span>
            <span className="title-sub-tamil">உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</span>
          </h2>

          <p className="lang-modal-desc">
            Choose your preferred language to continue & make a child's wish come true!
          </p>
        </div>

        {/* 3 Trilingual Language Selection Cards */}
        <div className="lang-options-grid">
          
          {/* ENGLISH */}
          <button 
            type="button" 
            className={`lang-option-card card-en ${language === 'en' ? 'selected' : ''}`}
            onClick={() => handleSelectLanguage('en')}
          >
            <div className="lang-card-badge">EN</div>
            <div className="lang-card-text">
              <span className="lang-name-main">English</span>
              <span className="lang-name-sub">Default Language</span>
            </div>
            {language === 'en' && <Check className="lang-check-icon" size={20} />}
          </button>

          {/* SINHALA */}
          <button 
            type="button" 
            className={`lang-option-card card-si ${language === 'si' ? 'selected' : ''}`}
            onClick={() => handleSelectLanguage('si')}
          >
            <div className="lang-card-badge badge-si">සිං</div>
            <div className="lang-card-text">
              <span className="lang-name-main font-sinhala">සිංහල</span>
              <span className="lang-name-sub">Sinhala</span>
            </div>
            {language === 'si' && <Check className="lang-check-icon" size={20} />}
          </button>

          {/* TAMIL */}
          <button 
            type="button" 
            className={`lang-option-card card-ta ${language === 'ta' ? 'selected' : ''}`}
            onClick={() => handleSelectLanguage('ta')}
          >
            <div className="lang-card-badge badge-ta">த</div>
            <div className="lang-card-text">
              <span className="lang-name-main font-tamil">தமிழ்</span>
              <span className="lang-name-sub">Tamil</span>
            </div>
            {language === 'ta' && <Check className="lang-check-icon" size={20} />}
          </button>

        </div>

        <div className="lang-modal-footer">
          <small>You can change your language anytime from the top-right menu.</small>
        </div>

      </div>
    </div>
  );
}
