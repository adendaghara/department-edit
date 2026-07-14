import React from 'react';
import { useTranslation } from 'react-i18next';
export default function ConfirmDialog({ deptName, onConfirm, onCancel }) {
 const { t } = useTranslation();
 return (
    <div className="dialog-overlay">
     <div className="dialog dialog--sm" role="alertdialog">
    <div className="dialog-header">
    <div className="dialog-icon dialog-icon--danger">⚠️</div>
    <div><h2 className="dialog-title">{t('confirm.title')}</h2></div>
    <button className="dialog-close" onClick={onCancel}>×</button>
    </div>
    <div className="dialog-body">
    <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: '1.7' }}>
    {t('confirm.msg')} "{deptName}"؟
   </p>
    <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '8px' }}>
   {t('confirm.warning')}
   </p>
   </div>
   <div className="dialog-footer">
   <button className="btn-cancel" onClick={onCancel}>{t('confirm.cancel')}</button>
  <button className="btn-submit btn-submit--danger" onClick={onConfirm}>
  {t('confirm.confirm')}
   </button>
  </div>
  </div>
 </div>
  );
}
