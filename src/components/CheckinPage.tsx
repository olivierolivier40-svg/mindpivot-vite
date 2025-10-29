import React from 'react';
import { Card } from './Card.tsx';
import { Button } from './Button.tsx';
import { CheckinSlider } from './CheckinSlider.tsx';
import { LABELS } from '../constants.ts';
import { useI18n } from '../hooks/useI18n.tsx';

interface CheckinPageProps {
  energie: number;
  setEnergie: (value: number) => void;
  humeur: number;
  setHumeur: (value: number) => void;
  chargeMentale: number;
  setChargeMentale: (value: number) => void;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onHelp: (id: string) => void;
}

export const CheckinPage: React.FC<CheckinPageProps> = ({
  energie,
  setEnergie,
  humeur,
  setHumeur,
  chargeMentale,
  setChargeMentale,
  onNavigate,
  onBack,
  onHelp,
}) => {
  const { t } = useI18n();
  return (
    <Card className="animate-fade-in">
      <Button variant='secondary' size='small' onClick={onBack}>← {t('home')}</Button>
      <div className="text-center mt-2">
        <h2 className="text-2xl font-bold mb-2">{t('checkin_rapid_title')}</h2>
        <p className="text-sm text-muted mt-2 mb-4">{t('checkin_rapid_subtitle')}</p>
        <CheckinSlider
          label={t('label_energie_title')}
          value={energie}
          onChange={e => setEnergie(parseInt(e.target.value, 10))}
          labels={LABELS.energie.map(k => t(k))}
          helpId="energie"
          onHelp={onHelp}
        />
        <CheckinSlider
          label={t('label_humeur_title')}
          value={humeur}
          onChange={e => setHumeur(parseInt(e.target.value, 10))}
          labels={LABELS.humeur.map(k => t(k))}
          helpId="humeur"
          onHelp={onHelp}
        />
        <CheckinSlider
          label={t('label_chargeMentale_title')}
          value={chargeMentale}
          onChange={e => setChargeMentale(parseInt(e.target.value, 10))}
          labels={LABELS.chargeMentale.map(k => t(k))}
          helpId="chargeMentale"
          onHelp={onHelp}
        />
        <div className="flex gap-4 justify-center mt-4">
          <Button onClick={() => onNavigate('checkin_general')}>{t('continue')}</Button>
          <Button variant="info" onClick={() => onNavigate('suggestions')}>{t('checkin_direct_suggestions')}</Button>
        </div>
      </div>
    </Card>
  );
};
