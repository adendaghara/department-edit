import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Building2, Users, BarChart3, ChevronDown } from 'lucide-react';

export default function Sidebar({ activePage, onNavigate }) {
  const { t } = useTranslation();
  const [deptOpen, setDeptOpen] = useState(true);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏛</div>
        <div>
          <div className="logo-text">{t('sidebar.title')}</div>
          <div className="logo-sub">{t('sidebar.subtitle')}</div>
        </div>
      </div>

      <nav className="sidebar-nav">

        <div className="nav-group-label">{t('sidebar.controlLabel')}</div>
        <button
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard size={16} className="nav-icon" />
          {t('sidebar.dashboard')}
        </button>

        <div className="nav-group-label" style={{ marginTop: '12px' }}>
          <button className="nav-group-toggle" onClick={() => setDeptOpen(p => !p)}>
            <span>{t('sidebar.deptManagement')}</span>
            <ChevronDown
              size={13}
              style={{
                transition: 'transform .2s',
                transform: deptOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
          </button>
        </div>

        {deptOpen && (
          <div className="nav-sub">
            <button
              className={`nav-item nav-item--sub ${activePage === 'departments' ? 'active' : ''}`}
              onClick={() => onNavigate('departments')}
            >
              <Building2 size={15} className="nav-icon" />
              {t('sidebar.departments')}
            </button>
            <button
              className={`nav-item nav-item--sub ${activePage === 'employees' ? 'active' : ''}`}
              onClick={() => onNavigate('employees')}
            >
              <Users size={15} className="nav-icon" />
              {t('sidebar.employees')}
            </button>
          </div>
        )}

        <div className="nav-group-label" style={{ marginTop: '12px' }}>
          {t('sidebar.reportsLabel')}
        </div>
        <button
          className={`nav-item ${activePage === 'reports' ? 'active' : ''}`}
          onClick={() => onNavigate('reports')}
        >
          <BarChart3 size={16} className="nav-icon" />
          {t('sidebar.reports')}
        </button>

      </nav>

      <div className="sidebar-footer">v1.0.0 © 2025</div>
    </aside>
  );
}
