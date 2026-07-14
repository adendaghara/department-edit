import React from 'react';
import { useTranslation } from 'react-i18next';

const pageKeys = {
  departments: 'sidebar.departments',
  employees:   'sidebar.employees',
  reports:     'sidebar.reports',
  dashboard:   'sidebar.dashboard',
};

export default function Header({ activePage, darkMode, onToggleDark, user, onLogout }) {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const isAr = i18n.language.startsWith('ar');

  return (
    <header className="header">
      <span className="header-breadcrumb">
        <span>{t('header.home')}</span>
        <span>›</span>
        <span className="current">{t(pageKeys[activePage] || 'sidebar.dashboard')}</span>
      </span>

      <div className="header-spacer" />

      <button className="lang-toggle" onClick={toggleLang} title="Switch Language">
        {isAr ? 'EN' : 'AR'}
      </button>

      <button
        className={`dark-toggle ${darkMode ? 'dark-toggle--on' : ''}`}
        onClick={onToggleDark}
        title={darkMode ? t('header.light') : t('header.dark')}
        aria-label="toggle dark mode"
      >
        <span className="dark-toggle__track">
          <span className="dark-toggle__thumb">
            {darkMode ? '🌙' : '☀️'}
          </span>
        </span>
      </button>

      <div className="header-user">
        <div className="header-avatar" title={user?.username}>
          {user?.username?.[0]?.toUpperCase() || 'م'}
        </div>
        <button className="header-logout" onClick={onLogout} title="تسجيل الخروج">
          🚪
        </button>
      </div>
    </header>
  );
}
