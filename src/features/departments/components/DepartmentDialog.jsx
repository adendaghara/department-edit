
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { X, ChevronDown, Check } from 'lucide-react';
import { Button } from '../../../shared/index.js';
import '../../../styles/dialog.css';

const EMPTY_FORM = { nameAr: '', nameEn: '', manager: '', employeeIds: [] };

const DEPT_DICT = {
  'موارد بشرية':'Human Resources','قسم الموارد البشرية':'Human Resources Department',
  'مالية':'Finance','قسم المالية':'Finance Department',
  'محاسبة':'Accounting','تقنية معلومات':'Information Technology',
  'قسم تقنية المعلومات':'Information Technology Department',
  'تسويق':'Marketing','قسم التسويق':'Marketing Department',
  'مبيعات':'Sales','قسم المبيعات':'Sales Department',
  'عمليات':'Operations','قسم العمليات':'Operations Department',
  'خدمة عملاء':'Customer Service','هندسة':'Engineering',
  'تطوير':'Development','مشتريات':'Procurement',
  'قانوني':'Legal','إدارة':'Management','إدارة المشاريع':'Project Management',
};
const AR_MAP = {
  'ا':'a','أ':'a','إ':'i','آ':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h',
  'خ':'kh','د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d',
  'ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m',
  'ن':'n','ه':'h','و':'w','ي':'y','ى':'a','ة':'a','ء':'','ئ':'y','ؤ':'w',' ':' ',
};
function translateArToEn(text) {
  const t = text.trim();
  if (DEPT_DICT[t]) return DEPT_DICT[t];
  for (const [ar, en] of Object.entries(DEPT_DICT))
    if (t.includes(ar)) return t.replace(ar, en);
  return t.replace(/^قسم\s+/,'').split('')
    .map(c => AR_MAP[c] ?? '').join('')
    .split(' ').filter(Boolean)
    .map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}

function MultiSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id) => {
    const ids = value.includes(id) ? value.filter(v => v !== id) : [...value, id];
    onChange(ids);
  };

  const selected = options.filter(o => value.includes(o.id));

  return (
    <div className="multi-select" ref={ref}>
      <div className={`multi-select__trigger ${open ? 'multi-select__trigger--open' : ''}`}
        onClick={() => setOpen(p => !p)}>
        <div className="multi-select__tags">
          {selected.length === 0 && (
            <span className="multi-select__placeholder">{placeholder}</span>
          )}
          {selected.map(emp => (
            <span key={emp.id} className="multi-select__tag">
              {emp.nameAr}
              <button type="button" onClick={e => { e.stopPropagation(); toggle(emp.id); }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown size={14} className={`multi-select__arrow ${open ? 'multi-select__arrow--open' : ''}`} />
      </div>

      {open && (
        <div className="multi-select__dropdown">
          {options.map(emp => {
            const checked = value.includes(emp.id);
            return (
              <div key={emp.id} className={`multi-select__option ${checked ? 'multi-select__option--checked' : ''}`}
                onClick={() => toggle(emp.id)}>
                <span className={`multi-select__check ${checked ? 'multi-select__check--active' : ''}`}>
                  {checked && <Check size={10} />}
                </span>
                <span className="manager-avatar" style={{ width: 24, height: 24, fontSize: 11 }}>
                  {emp.nameAr?.[0] || '؟'}
                </span>
                <span>{emp.nameAr}</span>
                <span style={{ marginRight: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {emp.jobTitle}
                </span>
              </div>
            );
          })}
          {options.length === 0 && (
            <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
              لا يوجد موظفون
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DepartmentDialog({ isOpen, dept, employees, onSave, onClose }) {
  const { t } = useTranslation();
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const autoTranslate       = useRef(true);
  const isEdit              = Boolean(dept);

  useEffect(() => {
    if (dept) {
      setForm({
        nameAr: dept.nameAr || '', nameEn: dept.nameEn || '',
        manager: dept.manager || '', employeeIds: dept.employeeIds || [],
      });
      autoTranslate.current = false;
    } else {
      setForm(EMPTY_FORM);
      autoTranslate.current = true;
    }
    setErrors({});
  }, [dept, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.nameAr.trim()) e.nameAr  = t('dialog.err_nameAr');
    if (!form.nameEn.trim()) e.nameEn  = t('dialog.err_nameEn');
    if (!form.manager.trim()) e.manager = t('dialog.err_manager');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (field, value) => {
    if (field === 'nameAr') {
      const en = autoTranslate.current ? translateArToEn(value) : form.nameEn;
      setForm(prev => ({ ...prev, nameAr: value, nameEn: en }));
    } else if (field === 'nameEn') {
      autoTranslate.current = false;
      setForm(prev => ({ ...prev, nameEn: value }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => { if (validate()) onSave(form); };

  return (
    <Dialog open={isOpen} onClose={onClose} className="dialog-overlay">
      <div className="dialog-backdrop" aria-hidden="true" />
      <div className="dialog-positioner">
        <DialogPanel className="dialog">

          <div className="dialog-header">
            <div className="dialog-icon">{isEdit ? '✏️' : '🏢'}</div>
            <div>
              <DialogTitle className="dialog-title">
                {isEdit ? t('dialog.editTitle') : t('dialog.addTitle')}
              </DialogTitle>
              <p className="dialog-sub">
                {isEdit ? `${t('dialog.editSub')}: ${dept.nameAr}` : t('dialog.addSub')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="dialog-close">×</Button>
          </div>

          <div className="dialog-body">

            <div className="field">
              <label className="field-label">{t('dialog.nameAr')} <span className="required">*</span></label>
              <input className={`field-input ${errors.nameAr ? 'field-input--error' : ''}`}
                type="text" placeholder={t('dialog.nameAr_ph')}
                value={form.nameAr} onChange={e => set('nameAr', e.target.value)} autoFocus />
              {errors.nameAr && <p className="field-error">{errors.nameAr}</p>}
            </div>

            <div className="field">
              <label className="field-label">
                {t('dialog.nameEn')} <span className="required">*</span>
                {autoTranslate.current && form.nameAr && (
                  <span className="auto-badge">✨ {t('dialog.autoTranslate')}</span>
                )}
              </label>
              <input className={`field-input field-input--ltr ${errors.nameEn ? 'field-input--error' : ''}`}
                type="text" placeholder={t('dialog.nameEn_ph')} dir="ltr"
                value={form.nameEn} onChange={e => set('nameEn', e.target.value)} />
              {errors.nameEn && <p className="field-error">{errors.nameEn}</p>}
            </div>

            <div className="field">
              <label className="field-label">{t('dialog.manager')} <span className="required">*</span></label>
              <input className={`field-input ${errors.manager ? 'field-input--error' : ''}`}
                type="text" placeholder={t('dialog.manager_ph')}
                value={form.manager} onChange={e => set('manager', e.target.value)} />
              {errors.manager && <p className="field-error">{errors.manager}</p>}
            </div>

            <div className="field">
              <label className="field-label">
                {t('dialog.employees')}
                {form.employeeIds.length > 0 && (
                  <span className="auto-badge" style={{ background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' }}>
                    {form.employeeIds.length} مختار
                  </span>
                )}
              </label>
              <MultiSelect
                options={employees}
                value={form.employeeIds}
                onChange={ids => set('employeeIds', ids)}
                placeholder={t('dialog.employees_ph')}
              />
            </div>

          </div>

          <div className="dialog-footer">
            <Button variant="ghost" onClick={onClose}>✕ {t('dialog.cancel')}</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEdit ? `💾 ${t('dialog.saveOnly')}` : `✚ ${t('dialog.addOnly')}`}
            </Button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default DepartmentDialog;
