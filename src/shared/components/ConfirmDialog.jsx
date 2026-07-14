import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button.jsx';

export function ConfirmDialog({ isOpen, deptName, onConfirm, onCancel }) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onClose={onCancel} className="dialog-overlay">
      <div className="dialog-backdrop" aria-hidden="true" />

      <div className="dialog-positioner">
        <DialogPanel className="dialog dialog--sm">

          <div className="dialog-header">
            <div className="dialog-icon dialog-icon--danger">
              <TriangleAlert size={22} color="#fff" />
            </div>
            <div>
              <DialogTitle className="dialog-title">{t('confirm.title')}</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="dialog-close">×</Button>
          </div>

          <div className="dialog-body">
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: '1.7' }}>
              {t('confirm.msg')} &ldquo;{deptName}&rdquo;؟
            </p>
            <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '8px' }}>
              {t('confirm.warning')}
            </p>
          </div>

          <div className="dialog-footer">
            <Button variant="ghost" onClick={onCancel}>
              {t('confirm.cancel')}
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {t('confirm.confirm')}
            </Button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
