import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';
import { Button } from './Button.tsx';

interface FAQPageProps {
  onNavigate: (screen: string) => void;
}

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', labelKey: 'faq_category_all', icon: '🌟' },
    { id: 'usage', labelKey: 'faq_category_usage', icon: '🎯' },
    { id: 'science', labelKey: 'faq_category_science', icon: '🧬' },
    { id: 'premium', labelKey: 'faq_category_premium', icon: '✨' },
    { id: 'tech', labelKey: 'faq_category_tech', icon: '⚙️' }
  ];

  const faqs = [
    { id: 'science-base', category: 'science', qKey: 'faq_q_science_base', aKey: 'faq_a_science_base' },
    { id: 'confidentiality', category: 'tech', qKey: 'faq_q_confidentiality', aKey: 'faq_a_confidentiality' },
    { id: 'frequency', category: 'usage', qKey: 'faq_q_frequency', aKey: 'faq_a_frequency' },
    { id: 'gratuit-vs-premium', category: 'premium', qKey: 'faq_q_gratuit_vs_premium', aKey: 'faq_a_gratuit_vs_premium' },
    { id: 'duration', category: 'usage', qKey: 'faq_q_duration', aKey: 'faq_a_duration' },
    { id: 'target', category: 'usage', qKey: 'faq_q_target', aKey: 'faq_a_target' },
    { id: 'equipment', category: 'usage', qKey: 'faq_q_equipment', aKey: 'faq_a_equipment' },
    { id: 'offline', category: 'tech', qKey: 'faq_q_offline', aKey: 'faq_a_offline' },
    { id: 'ia-role', category: 'tech', qKey: 'faq_q_ia_role', aKey: 'faq_a_ia_role' },
    { id: 'personalization', category: 'usage', qKey: 'faq_q_personalization', aKey: 'faq_a_personalization' },
    { id: 'badges', category: 'usage', qKey: 'faq_q_badges', aKey: 'faq_a_badges' },
    { id: 'parcours', category: 'usage', qKey: 'faq_q_parcours', aKey: 'faq_a_parcours' },
    { id: 'journal', category: 'usage', qKey: 'faq_q_journal', aKey: 'faq_a_journal' },
    { id: 'accessibility', category: 'tech', qKey: 'faq_q_accessibility', aKey: 'faq_a_accessibility' },
    { id: 'support', category: 'tech', qKey: 'faq_q_support', aKey: 'faq_a_support' },
    { id: 'results', category: 'science', qKey: 'faq_q_results', aKey: 'faq_a_results' },
    { id: 'safety', category: 'science', qKey: 'faq_q_safety', aKey: 'faq_a_safety' },
    { id: 'payment', category: 'premium', qKey: 'faq_q_payment', aKey: 'faq_a_payment' },
    { id: 'data-migration', category: 'premium', qKey: 'faq_q_data_migration', aKey: 'faq_a_data_migration' }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="max-w-4xl mx-auto px-2 py-6">
        <Button variant='secondary' size='small' onClick={() => onNavigate('welcome')}>← {t('back_to_home')}</Button>
        <div className="text-center my-8">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
            {t('faq_title')}
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {t('faq_subtitle')}
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-5 py-2.5 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                activeCategory === cat.id
                  ? 'bg-accent text-white'
                  : 'bg-card text-muted hover:bg-white/10'
              }`}
            >
              {cat.icon} {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="bg-card rounded-xl border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition"
              >
                <span className="font-semibold text-fg pr-4">
                  {t(faq.qKey)}
                </span>
                <ChevronDownIcon
                  className={`flex-shrink-0 w-5 h-5 text-muted transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openId === faq.id && (
                <div 
                    className="px-4 sm:px-6 pb-5 text-muted border-t border-white/10 pt-4"
                    dangerouslySetInnerHTML={{ __html: t(faq.aKey) }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-card rounded-2xl p-8 border border-accent/30">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-2xl font-bold mb-2">{t('faq_cta_title')}</h3>
          <p className="text-muted mb-4">
            {t('faq_cta_subtitle')}
          </p>
          <a 
            href="mailto:mindpivot.contact@gmail.com"
            className="font-poppins inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer text-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg focus:ring-accent h-12 px-4 py-3 bg-accent text-white shadow-md hover:bg-link hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-accent/30"
          >
            {t('faq_cta_button')}
          </a>
        </div>
      </div>
    </div>
  );
};
