import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation, Translations } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isLargeText: boolean;
  toggleLargeText: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('thulir_language');
    return (saved === 'ta' || saved === 'en') ? saved : 'en';
  });

  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    return localStorage.getItem('thulir_large_text') === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('thulir_language', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ta' : 'en';
    setLanguage(next);
  };

  const toggleLargeText = () => {
    setIsLargeText((prev) => {
      const next = !prev;
      localStorage.setItem('thulir_large_text', String(next));
      return next;
    });
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isLargeText,
        toggleLargeText,
      }}
    >
      <div className={isLargeText ? 'text-lg leading-relaxed' : 'text-base'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
