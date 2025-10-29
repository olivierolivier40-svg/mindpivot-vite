import { Fragment } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';

interface BreadcrumbsProps {
    current: 'general' | 'emotions' | 'pensees';
    onNavigate: (screen: string) => void;
}

export const Breadcrumbs = ({ current, onNavigate }: BreadcrumbsProps) => {
    const { t } = useI18n();
    const steps = ['general', 'emotions', 'pensees'];
    const labels: Record<string, string> = {
        'general': t('checkin_breadcrumb_general'), 
        'emotions': t('checkin_breadcrumb_emotions'), 
        'pensees': t('checkin_breadcrumb_thoughts')
    };
    const currentIndex = steps.indexOf(current);

    return (
        <div className="flex justify-center items-center gap-2 text-xs text-muted mb-4">
            {steps.map((step, index) => (
                <Fragment key={step}>
                    <span 
                        onClick={() => index < currentIndex ? onNavigate(`checkin_${step}`) : null}
                        className={`transition-colors ${index < currentIndex ? 'cursor-pointer hover:text-fg' : ''} ${index === currentIndex ? 'font-bold text-accent' : ''}`}
                    >
                        {labels[step]}
                    </span>
                    {index < steps.length - 1 && <span className="text-muted">&gt;</span>}
                </Fragment>
            ))}
        </div>
    );
};