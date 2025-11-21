import { useState } from 'react';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

const onboardingSlides = [
  {
    icon: '⭐',
    titleKey: 'onboarding_slide1_title',
    textKey: 'onboarding_slide1_text',
    bgClass: 'onboarding-bg-1',
    iconAnimation: 'animate-emoji-pulse',
  },
  {
    icon: '🧭',
    titleKey: 'onboarding_slide2_title',
    textKey: 'onboarding_slide2_text',
    bgClass: 'onboarding-bg-2',
    iconAnimation: '',
  },
  {
    icon: '❤️',
    titleKey: 'onboarding_slide3_title',
    textKey: 'onboarding_slide3_text',
    bgClass: 'onboarding-bg-3',
    iconAnimation: 'heart-icon',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const currentSlide = onboardingSlides[step];

  const nextStep = () => {
    if (step < onboardingSlides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className={`min-h-screen text-fg flex flex-col items-center justify-between p-6 animate-fade-in onboarding-container ${currentSlide.bgClass}`}>
      <header className="w-full flex justify-end relative z-10">
        <Button variant="ghost" onClick={onComplete} className="!text-muted hover:!text-fg">
          {t('onboarding_skip')}
        </Button>
      </header>

      <main className="flex flex-col items-center text-center relative z-10">
        <div className={`text-8xl md:text-9xl mb-8 onboarding-icon ${currentSlide.iconAnimation}`}>
          {currentSlide.icon}
        </div>
        <h2 className="font-poppins font-bold text-3xl mb-4 text-[#1A1A1A]">
          {t(currentSlide.titleKey)}
        </h2>
        <p className="onboarding-secondary-text max-w-sm text-base leading-relaxed" style={{ lineHeight: 1.6 }}>
          {t(currentSlide.textKey)}
        </p>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 relative z-10">
        <div className="flex gap-3">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                step === index ? 'w-3 h-3 bg-accent' : 'w-2 h-2 bg-[#D1D5DB]'
              }`}
            />
          ))}
        </div>
        {step < onboardingSlides.length - 1 ? (
          <Button
            variant="primary"
            onClick={nextStep}
            className="w-full max-w-sm text-lg"
          >
            {t('onboarding_next')}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onComplete}
            className="w-full max-w-sm text-lg !bg-accent-secondary hover:!bg-opacity-80"
          >
            {t('onboarding_start')}
          </Button>
        )}
      </footer>
    </div>
  );
};