import { useState } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';
import { Button } from './Button.tsx';

interface HowItWorksPageProps {
  onNavigate: (screen: string) => void;
}

export const HowItWorksPage = ({ onNavigate }: HowItWorksPageProps) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('process');

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="max-w-4xl mx-auto px-2 py-6">
        <Button variant='secondary' size='small' onClick={() => onNavigate('welcome')}>← {t('back_to_home')}</Button>

        <div className="text-center my-8">
          <div className="text-6xl mb-4">🧭</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
            {t('howitworks_title')}
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {t('howitworks_subtitle')}
          </p>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 justify-center">
          {[
            { id: 'process', label: 'howitworks_tab_process', icon: '🔄' },
            { id: 'science', label: 'howitworks_tab_science', icon: '🧬' },
            { id: 'tips', label: 'howitworks_tab_tips', icon: '💡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-card text-muted hover:bg-white/10'
              }`}
            >
              {`${tab.icon} ${t(tab.label)}`}
            </button>
          ))}
        </div>

        {activeTab === 'process' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-accent">
                {t('howitworks_process_title')}
              </h2>
              
              <div className="space-y-6">
                {[
                  { num: 1, title: 'howitworks_process_step1_title', desc: 'howitworks_process_step1_desc', science: 'howitworks_process_step1_science', color: 'accent' },
                  { num: 2, title: 'howitworks_process_step2_title', desc: 'howitworks_process_step2_desc', science: 'howitworks_process_step2_wisdom', color: 'accent-info' },
                  { num: 3, title: 'howitworks_process_step3_title', desc: 'howitworks_process_step3_desc', science: 'howitworks_process_step3_balance', color: 'accent-secondary' },
                  { num: 4, title: 'howitworks_process_step4_title', desc: 'howitworks_process_step4_desc', science: 'howitworks_process_step4_transform', color: 'accent-tertiary' }
                ].map(step => (
                  <div key={step.num} className="flex gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-${step.color} rounded-full flex items-center justify-center text-2xl font-bold text-white`}>
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-fg">
                        {t(step.title)}
                      </h3>
                      <p className="text-muted mb-3">
                        {t(step.desc)}
                      </p>
                      <div className="bg-white/5 rounded-lg p-3 text-sm text-muted">
                        <p dangerouslySetInnerHTML={{ __html: t(step.science) }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold mb-2">{t('howitworks_process_bonus1_title')}</h3>
                <p className="text-sm text-muted">{t('howitworks_process_bonus1_desc')}</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-2">✨</div>
                <h3 className="text-lg font-semibold mb-2">{t('howitworks_process_bonus2_title')}</h3>
                <p className="text-sm text-muted">{t('howitworks_process_bonus2_desc')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'science' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-accent">
                {t('howitworks_science_title')}
              </h2>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🧬</div>
                    <h3 className="text-xl font-semibold">{t('howitworks_science_section1_title')}</h3>
                  </div>
                  <div className="space-y-3 sm:ml-12">
                    {[
                      { title: 'howitworks_science_item1_title', desc: 'howitworks_science_item1_desc' },
                      { title: 'howitworks_science_item2_title', desc: 'howitworks_science_item2_desc' },
                      { title: 'howitworks_science_item3_title', desc: 'howitworks_science_item3_desc' }
                    ].map(item => (
                      <div key={item.title} className="bg-white/5 rounded-lg p-4">
                        <strong className="text-accent-info">{t(item.title)}</strong>
                        <p className="text-muted mt-1 text-sm">{t(item.desc)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🕉️</div>
                    <h3 className="text-xl font-semibold">{t('howitworks_science_section2_title')}</h3>
                  </div>
                  <div className="space-y-3 sm:ml-12">
                     {[
                      { title: 'howitworks_science_item4_title', desc: 'howitworks_science_item4_desc' },
                      { title: 'howitworks_science_item5_title', desc: 'howitworks_science_item5_desc' },
                      { title: 'howitworks_science_item6_title', desc: 'howitworks_science_item6_desc' }
                    ].map(item => (
                      <div key={item.title} className="bg-white/5 rounded-lg p-4">
                        <strong className="text-accent-info">{t(item.title)}</strong>
                        <p className="text-muted mt-1 text-sm">{t(item.desc)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-accent/30">
                  <div className="text-center">
                    <div className="text-4xl mb-3">⚖️</div>
                    <h3 className="text-xl font-semibold mb-2">{t('howitworks_science_philosophy_title')}</h3>
                    <p className="text-muted text-sm max-w-2xl mx-auto">{t('howitworks_science_philosophy_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-accent">
                {t('howitworks_tips_title')}
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: '🌅', title: 'howitworks_tips_item1_title', desc: 'howitworks_tips_item1_desc', tip: 'howitworks_tips_item1_tip' },
                  { icon: '🎧', title: 'howitworks_tips_item2_title', desc: 'howitworks_tips_item2_desc', tip: 'howitworks_tips_item2_tip' },
                  { icon: '📝', title: 'howitworks_tips_item3_title', desc: 'howitworks_tips_item3_desc', tip: 'howitworks_tips_item3_tip' },
                  { icon: '🔥', title: 'howitworks_tips_item4_title', desc: 'howitworks_tips_item4_desc', tip: 'howitworks_tips_item4_tip' },
                  { icon: '🧭', title: 'howitworks_tips_item5_title', desc: 'howitworks_tips_item5_desc', tip: 'howitworks_tips_item5_tip' },
                  { icon: '🔬', title: 'howitworks_tips_item6_title', desc: 'howitworks_tips_item6_desc', tip: 'howitworks_tips_item6_tip' },
                ].map(item => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{t(item.title)}</h3>
                        <p className="text-muted text-sm mb-2">{t(item.desc)}</p>
                        <p className="text-accent-info text-sm italic">{t(item.tip)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-accent/30 text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-3">{t('howitworks_tips_golden_rule_title')}</h3>
              <p className="text-lg text-muted max-w-2xl mx-auto">{t('howitworks_tips_golden_rule_desc')}</p>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button onClick={() => onNavigate('checkin_rapide')} className="btn-gradient-cta px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition shadow-lg">
            {t('howitworks_cta_button')} 🚀
          </Button>
          <p className="text-muted text-sm mt-4">
            {t('howitworks_cta_subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}