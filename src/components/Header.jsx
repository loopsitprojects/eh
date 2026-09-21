import React from 'react';
import elephantHouseLogo from '../assets/elephant-house-logo-v3.png';
import wonderLogo from '../assets/wonder-logo.png';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Left Branding Logo: Elephant House */}
        <div className="header-logo-left">
          <img 
            src={elephantHouseLogo} 
            alt="Elephant House" 
            className="img-elephant-house" 
          />
        </div>

        {/* Right Header Area: WONDER Logo & Language Switcher */}
        <div className="header-right-wrapper">
          <div className="header-logo-right">
            <img 
              src={wonderLogo} 
              alt="Wonder Ice Cream" 
              className="img-wonder-logo" 
            />
          </div>

          {/* Right Header Corner: Multi-Language Selector */}
          <div className="header-lang-selector" title="Choose Language / භාෂාව තෝරන්න">
            <Globe className="lang-icon" size={16} />
            <div className="lang-buttons-pill">
              <button
                type="button"
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button
                type="button"
                className={`lang-btn ${language === 'si' ? 'active' : ''}`}
                onClick={() => setLanguage('si')}
              >
                සිංහල
              </button>
              <button
                type="button"
                className={`lang-btn ${language === 'ta' ? 'active' : ''}`}
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
