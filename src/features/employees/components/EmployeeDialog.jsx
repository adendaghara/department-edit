
import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/index.js';
import '../../../styles/dialog.css';

const EMPTY_FORM = {
  nameAr: '', nameEn: '', departmentId: '', jobTitle: '',
  email: '', phone: '', status: 'active',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmployeeDialog({ isOpen, employee, departments, onSave, onClose }) {
  const { t } = useTranslation();
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(employee);

  useEffect(() => {
    if (employee) {
      setForm({
        nameAr:       employee.nameAr      || '',
        nameEn:       employee.nameEn      || '',
        departmentId: employee.departmentId || '',
        jobTitle:     employee.jobTitle    || '',
        email:        employee.email       || '',
        phone:        employee.phone       || '',
        status:       employee.status      || 'active',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [employee, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.nameAr.trim())    e.nameAr    = t('employees.err_nameAr');
    if (!form.nameEn.trim())    e.nameEn    = t('employees.err_nameEn');
    if (!form.departmentId)     e.departmentId = t('employees.err_dept');
    if (!form.jobTitle.trim())  e.jobTitle  = t('employees.err_jobTitle');
    if (form.email && !EMAIL_RE.test(form.email)) e.email = t('employees.err_email');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => { if (validate()) onSave(form); };

  return (
    <Dialog open={isOpen} onClose={onClose} className="dialog-overlay">
      <div className="dialog-backdrop" aria-hidden="true" />
      <div className="dialog-positioner">
        <DialogPanel className="dialog dialog--wide">

          <div className="dialog-header">
            <div className="dialog-icon">👤</div>
            <div>
              <DialogTitle className="dialog-title">
                {isEdit ? t('employees.dialog_editTitle') : t('employees.dialog_addTitle')}
              </DialogTitle>
              <p className="dialog-sub">
                {isEdit ? `${t('employees.dialog_editSub')}: ${employee.nameAr}` : t('employees.dialog_addSub')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="dialog-close">×</Button>
          </div>

          <div className="dialog-body">
            <div className="dialog-grid">

              <div className="field">
                <label className="field-label">{t('employees.nameAr')} <span className="required">*</span></label>
                <input className={`field-input ${errors.nameAr ? 'field-input--error' : ''}`}
                  type="text" placeholder={t('employees.nameAr_ph')}
                  value={form.nameAr} onChange={e => set('nameAr', e.target.value)} autoFocus />
                {errors.nameAr && <p className="field-error">{errors.nameAr}</p>}
              </div>

              <div className="field">
                <label className="field-label">{t('employees.nameEn')} <span className="required">*</span></label>
                <input className={`field-input field-input--ltr ${errors.nameEn ? 'field-input--error' : ''}`}
                  type="text" placeholder={t('employees.nameEn_ph')} dir="ltr"
                  value={form.nameEn} onChange={e => set('nameEn', e.target.value)} />
                {errors.nameEn && <p className="field-error">{errors.nameEn}</p>}
              </div>

              <div className="field">
                <label className="field-label">{t('employees.dept')} <span className="required">*</span></label>
                <select className={`field-input field-select ${errors.departmentId ? 'field-input--error' : ''}`}
                  value={form.departmentId} onChange={e => set('departmentId', e.target.value)}>
                  <option value="">{t('employees.dept_ph')}</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.nameAr}</option>
                  ))}
                </select>
                {errors.departmentId && <p className="field-error">{errors.departmentId}</p>}
              </div>

              <div className="field">
                <label className="field-label">{t('employees.jobTitle')} <span className="required">*</span></label>
                <input className={`field-input ${errors.jobTitle ? 'field-input--error' : ''}`}
                  type="text" placeholder={t('employees.jobTitle_ph')}
                  value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} />
                {errors.jobTitle && <p className="field-error">{errors.jobTitle}</p>}
              </div>

              <div className="field">
                <label className="field-label">{t('employees.email')}</label>
                <input className={`field-input field-input--ltr ${errors.email ? 'field-input--error' : ''}`}
                  type="email" placeholder={t('employees.email_ph')} dir="ltr"
                  value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field">
                <label className="field-label">{t('employees.phone')}</label>
                <input className="field-input field-input--ltr"
                  type="tel" placeholder={t('employees.phone_ph')} dir="ltr"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>

              <div className="field field--full">
                <label className="field-label">{t('employees.status')}</label>
                <div className="status-toggle">
                  {['active', 'inactive'].map(s => (
                    <button
                      key={s} type="button"
                      className={`status-btn ${form.status === s ? `status-btn--${s}` : ''}`}
                      onClick={() => set('status', s)}
                    >
                      {s === 'active' ? '✅' : '⛔'} {t(`employees.status_${s}`)}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="dialog-footer">
            <Button variant="ghost" onClick={onClose}>✕ {t('employees.cancel')}</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEdit ? `💾 ${t('employees.save')}` : `✚ ${t('employees.add')}`}
            </Button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default EmployeeDialog;
