import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('wonder_lang') || 'en';
  });

  useEffect(() => {
    document.body.classList.remove('lang-en', 'lang-si', 'lang-ta');
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('wonder_lang', lang);
    }
  };

  const t = (key, defaultText = '') => {
    const langDict = translations[language] || translations.en;
    if (key.includes('.')) {
      const parts = key.split('.');
      let val = langDict;
      for (const p of parts) {
        if (val && val[p] !== undefined) {
          val = val[p];
        } else {
          val = null;
          break;
        }
      }
      if (val !== null) return val;
    }
    if (langDict && langDict[key] !== undefined) return langDict[key];
    if (translations.en && translations.en[key] !== undefined) return translations.en[key];
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
