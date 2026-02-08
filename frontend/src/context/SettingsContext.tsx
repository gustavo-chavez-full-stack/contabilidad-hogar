import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface SettingsContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatAmount: (amount: number) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: string;
  setLanguage: (lang: string) => void;
  notifications: {
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
  };
  setNotifications: (notifs: { email: boolean; push: boolean; weeklyReport: boolean }) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(localStorage.getItem('currency') || 'CLP');
  const [theme, setThemeState] = useState<Theme>((localStorage.getItem('theme') as Theme) || 'dark');
  const [language, setLanguageState] = useState<string>(localStorage.getItem('language') || 'es');
  const [notifications, setNotificationsState] = useState({
    email: localStorage.getItem('notif_email') === 'true',
    push: localStorage.getItem('notif_push') === 'true',
    weeklyReport: localStorage.getItem('notif_weekly') !== 'false', // Default true
  });

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setCurrency = (newCurrency: string) => {
    localStorage.setItem('currency', newCurrency);
    setCurrencyState(newCurrency);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const setNotifications = (notifs: { email: boolean; push: boolean; weeklyReport: boolean }) => {
    localStorage.setItem('notif_email', String(notifs.email));
    localStorage.setItem('notif_push', String(notifs.push));
    localStorage.setItem('notif_weekly', String(notifs.weeklyReport));
    setNotificationsState(notifs);
  };

  const formatAmount = (amount: number) => {
    if (currency === 'CLP') {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <SettingsContext.Provider value={{ 
      currency, setCurrency, formatAmount, 
      theme, setTheme, 
      language, setLanguage,
      notifications, setNotifications 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
