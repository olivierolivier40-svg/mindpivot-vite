import React, { useRef, useEffect, forwardRef } from 'react';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    show: boolean;
    hideHeaderCloseButton?: boolean;
    preStartNext?: () => void;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
    ({ title, children, onClose, show, hideHeaderCloseButton, preStartNext }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { t } = useI18n();

    useEffect(() => {
      const dialog = dialogRef.current;
      if (dialog) { 
        show ? dialog.showModal() : dialog.close(); 
      }
    }, [show]);

    useEffect(() => {
      const dialog = dialogRef.current;
      const handleCancel = (event: Event) => { 
        event.preventDefault(); 
        onClose(); 
      };
      dialog?.addEventListener('cancel', handleCancel);
      return () => dialog?.removeEventListener('cancel', handleCancel);
    }, [onClose]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (!focusableElements || focusableElements.length === 0) return;
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          if (event.shiftKey) { 
            if (document.activeElement === firstElement) { 
              lastElement.focus(); 
              event.preventDefault(); 
            } 
          } else { 
            if (document.activeElement === lastElement) { 
              firstElement.focus(); 
              event.preventDefault(); 
            } 
          }
        }
      };
      const dialog = dialogRef.current;
      if (dialog?.open) { 
        dialog.addEventListener('keydown', handleKeyDown); 
      }
      return () => dialog?.removeEventListener('keydown', handleKeyDown);
    }, [show]);
    
    return (
      <dialog ref={dialogRef} className="border-none rounded-lg bg-card text-fg shadow-lg w-[min(92vw,780px)] p-0">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <h3 className="m-0 text-lg font-bold flex-1">{title}</h3>
          {!hideHeaderCloseButton && <button className="inline-flex items-center justify-center bg-transparent border-none text-fg h-9 w-9 p-0 rounded-full hover:bg-white/10" onClick={onClose} aria-label={t('close')}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>}
        </div>
        <div className="p-4">{children}</div>
        { preStartNext && 
            <div className="p-4 border-t border-white/10 flex justify-end">
                <Button onClick={preStartNext}>{t('next')}</Button>
            </div>
        }
      </dialog>
    );
});