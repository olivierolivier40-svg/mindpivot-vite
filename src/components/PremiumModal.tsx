import React from 'react';
import { Modal } from './Modal.tsx';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface PremiumModalProps {
    show: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-info flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const PremiumModal: React.FC<PremiumModalProps> = ({ show, onClose, onUpgrade }) => {
    const { t } = useI18n();
    return (
        <Modal show={show} title={t('premium_modal_title')} onClose={onClose}>
            <div className="text-center">
                <p className="text-lg text-muted mb-6">{t('premium_modal_subtitle')}</p>
                <ul className="space-y-3 text-left mb-8 max-w-sm mx-auto">
                    <li className="flex items-start gap-3">
                        <CheckIcon />
                        <span dangerouslySetInnerHTML={{ __html: t('premium_modal_feature1')}}></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckIcon />
                        <span dangerouslySetInnerHTML={{ __html: t('premium_modal_feature2')}}></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckIcon />
                        <span dangerouslySetInnerHTML={{ __html: t('premium_modal_feature3')}}></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckIcon />
                        <span dangerouslySetInnerHTML={{ __html: t('premium_modal_feature4')}}></span>
                    </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={onUpgrade} variant="primary" size="large">
                        {t('premium_modal_upgrade_button')}
                    </Button>
                    <Button onClick={onClose} variant="secondary" size="large">
                        {t('premium_modal_later_button')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
