import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/dialog.css';
const emptyForm = { nameAr: '', nameEn: '', manager: '' };
const deptTranslations = {
  'موارد بشرية': 'Human Resources',
  'قسم الموارد البشرية': 'Human Resources Department',
  'مالية': 'Finance',
  'قسم المالية': 'Finance Department',
  'محاسبة': 'Accounting',
  'قسم المحاسبة': 'Accounting Department',
  'تقنية معلومات': 'Information Technology',
  'قسم تقنية المعلومات': 'Information Technology Department',
  'تسويق': 'Marketing',
  'قسم التسويق': 'Marketing Department',
  'مبيعات': 'Sales',
  'قسم المبيعات': 'Sales Department',
  'عمليات': 'Operations',
  'قسم العمليات': 'Operations Department',
  'خدمة عملاء': 'Customer Service',
  'قسم خدمة العملاء': 'Customer Service Department',
  'قانوني': 'Legal',
  'القسم القانوني': 'Legal Department',
  'موارد': 'Resources',
  'إدارة': 'Management',
  'هندسة': 'Engineering',
  'قسم الهندسة': 'Engineering Department',
  'تطوير': 'Development',
  'قسم التطوير': 'Development Department',
  'مشتريات': 'Procurement',
  'قسم المشتريات': 'Procurement Department',
  'لوجستيات': 'Logistics',
  'قسم اللوجستيات': 'Logistics Department',
  'إدارة المشاريع': 'Project Management',
};

function translateArToEn(text) {
const trimmed = text.trim();
if (deptTranslations[trimmed]) return deptTranslations[trimmed];
let result = trimmed;
for (const [ar, en] of Object.entries(deptTranslations)) {
 if (trimmed.includes(ar)) {
    result = result.replace(ar, en); }  
}
if (result !== trimmed) return result;
const withoutQism = trimmed.replace(/^قسم\s+/, '');
const arToEnMap = {
    'ا':'a','أ':'a','إ':'i','آ':'a','ب':'b','ت':'t','ث':'th','ج':'j',
    'ح':'h','خ':'kh','د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh',
    'ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q',
    'ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y','ى':'a',
    'ة':'a','ء':'','ئ':'y','ؤ':'w',' ':' ',
  };
  return withoutQism.split('').map(c => arToEnMap[c] ?? '').join('')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function DepartmentDialog({ dept, onSave, onClose }) {
  const { t } = useTranslation();
  const [form, setForm]     = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(dept);
  const autoTranslate = useRef(true);

  useEffect(() => {
    if (dept) {
      setForm({ nameAr: dept.nameAr || '', nameEn: dept.nameEn || '', manager: dept.manager || '' });
      autoTranslate.current = false;
    } else {
      setForm(emptyForm);
      autoTranslate.current = true;
    }
    setErrors({});
  }, [dept]);

  const validate = () => {
    const e = {};
    if (!form.nameAr.trim()) e.nameAr = t('dialog.err_nameAr');
    if (!form.nameEn.trim()) e.nameEn = t('dialog.err_nameEn');
    if (!form.manager.trim()) e.manager = t('dialog.err_manager');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onSave(form); };

  const handleChange = (field, value) => {
    if (field === 'nameAr') {
      const newForm = { ...form, nameAr: value };
      if (autoTranslate.current) {
        newForm.nameEn = translateArToEn(value);
      }
      setForm(newForm);
    } else if (field === 'nameEn') {
      autoTranslate.current = false;
      setForm(prev => ({ ...prev, nameEn: value }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="dialog-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true">
        <div className="dialog-header">
          <div className="dialog-icon">{isEdit ? '✏️' : '🏢'}</div>
          <div>
            <h2 className="dialog-title">{isEdit ? t('dialog.editTitle') : t('dialog.addTitle')}</h2>
            <p className="dialog-sub">
              {isEdit ? `${t('dialog.editSub')}: ${dept.nameAr}` : t('dialog.addSub')}
            </p>
          </div>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="dialog-body">
          <div className="field">
            <label className="field-label">
              {t('dialog.nameAr')} <span className="required">*</span>
            </label>
            <input
              className={`field-input ${errors.nameAr ? 'field-input--error' : ''}`}
              type="text"
              placeholder={t('dialog.nameAr_ph')}
              value={form.nameAr}
              onChange={e => handleChange('nameAr', e.target.value)}
              autoFocus
            />
            {errors.nameAr && <p className="field-error">{errors.nameAr}</p>}
          </div>

          <div className="field">
            <label className="field-label">
              {t('dialog.nameEn')} <span className="required">*</span>
              {autoTranslate.current && form.nameAr && (
                <span className="auto-badge">✨ {t('dialog.autoTranslate')}</span>
              )}
            </label>
            <input
              className={`field-input field-input--ltr ${errors.nameEn ? 'field-input--error' : ''}`}
              type="text"
              placeholder={t('dialog.nameEn_ph')}
              value={form.nameEn}
              onChange={e => handleChange('nameEn', e.target.value)}
              dir="ltr"
            />
            {errors.nameEn && <p className="field-error">{errors.nameEn}</p>}
          </div>

          {/* اسم المدير */}
          <div className="field">
            <label className="field-label">
              {t('dialog.manager')} <span className="required">*</span>
            </label>
            <input
              className={`field-input ${errors.manager ? 'field-input--error' : ''}`}
              type="text"
              placeholder={t('dialog.manager_ph')}
              value={form.manager}
              onChange={e => handleChange('manager', e.target.value)}
            />
            {errors.manager && <p className="field-error">{errors.manager}</p>}
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn-cancel" onClick={onClose}>
            ✕ {t('dialog.cancel')}
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            {isEdit ? '💾 ' + t('dialog.saveOnly') : '✚ ' + t('dialog.addOnly')}
          </button>
        </div>
      </div>
    </div>
  );
}
