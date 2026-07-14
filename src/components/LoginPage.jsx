import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authAPI, mockCredentials } from '../api.js';
import '../styles/login.css';

export default function LoginPage({ onLoginSuccess }) {
  const { t } = useTranslation();
  const [form, setForm]         = useState({ username: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = t('login.err_username');
    if (!form.password.trim()) e.password = t('login.err_password');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const result = await authAPI.login(form.username, form.password);
      localStorage.setItem('token', result.token || 'api-token');
      localStorage.setItem('user', JSON.stringify(result.user || { username: form.username }));
      onLoginSuccess(result.user || { username: form.username });
    } catch {
      if (
        form.username === mockCredentials.username &&
        form.password === mockCredentials.password
      ) {
        const user = { username: form.username };
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(user);
      } else {
        setErrors({ password: t('login.err_invalid') });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel login-panel--left">
        <div className="login-brand">
          <div className="login-brand-icon">🏛</div>
          <h1 className="login-brand-name">نظام HR</h1>
          <p className="login-brand-sub">إدارة الموارد البشرية</p>
        </div>
        <div className="login-deco">
          <div className="deco-circle deco-circle--1" />
          <div className="deco-circle deco-circle--2" />
          <div className="deco-circle deco-circle--3" />
        </div>
        <div className="login-features">
          <div className="login-feature"><span className="login-feature-icon">🏢</span><span>إدارة الأقسام</span></div>
          <div className="login-feature"><span className="login-feature-icon">👥</span><span>إدارة الموظفين</span></div>
          <div className="login-feature"><span className="login-feature-icon">📊</span><span>تقارير شاملة</span></div>
        </div>
      </div>

      <div className="login-panel login-panel--right">
        <div className="login-form-wrap">
          <div className="login-header">
            <h2 className="login-title">{t('login.title')}</h2>
            <p className="login-subtitle">{t('login.subtitle')}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            <div className="login-field">
              <label className="login-label">{t('login.username')}</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  className={`login-input ${errors.username ? 'login-input--error' : ''}`}
                  type="text"
                  placeholder={t('login.username_ph')}
                  value={form.username}
                  onChange={e => handleChange('username', e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
              </div>
              {errors.username && <p className="login-field-error">{errors.username}</p>}
            </div>

            <div className="login-field">
              <label className="login-label">{t('login.password')}</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  className={`login-input ${errors.password ? 'login-input--error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder={t('login.password_ph')}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="login-eye" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="login-field-error">{errors.password}</p>}
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="login-btn-loading">
                  <span className="login-spinner" /> {t('login.loading')}
                </span>
              ) : t('login.btn')}
            </button>

            <p className="login-hint">💡 admin / 1234</p>
          </form>
        </div>
      </div>
    </div>
  );
}
