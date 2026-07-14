

import React, { useEffect, useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = (msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
}

export function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) { setVisible(false); return; }
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => setVisible(false), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast?.id]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`toast toast-${toast.type} ${visible ? 'toast--visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      {isSuccess
        ? <CircleCheck size={16} style={{ flexShrink: 0 }} />
        : <CircleX    size={16} style={{ flexShrink: 0 }} />
      }
      <span>{toast.msg}</span>
    </div>
  );
}

export default Toast;
