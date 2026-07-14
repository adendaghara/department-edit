import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import LoginPage from './components/LoginPage.jsx';
import { DepartmentsPage } from './features/departments/index.js';
import { EmployeesPage }   from './features/employees/index.js';
import { DashboardPage }   from './features/dashboard/index.js';
import './styles/app.css';

export default function App() {
  const { i18n } = useTranslation();

  const [activePage, setActivePage] = useState('departments');
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      return saved && token ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.dir  = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setActivePage('departments');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="app-main">
        <Header
          activePage={activePage}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(p => !p)}
          user={user}
          onLogout={handleLogout}
        />
        <main className="app-content">
          {activePage === 'departments' && <DepartmentsPage />}
          {activePage === 'employees'   && <EmployeesPage />}
          {activePage === 'dashboard'   && <DashboardPage />}
        </main>
      </div>
    </div>
  );
}
