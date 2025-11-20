
import type { Dispatch, SetStateAction } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';
import { Button } from './Button.tsx';
import { Card } from './Card.tsx';
import type { SoundSettings } from '../types.ts';

type Theme = 'dark' | 'light' | 'aurora' | 'dyslexia-tdah';

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>;

interface SettingsPageProps {
    onNavigate: (screen: string) => void;
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
    textSize: number;
    setTextSize: Dispatch<SetStateAction<number>>;
    soundSettings: SoundSettings;
    setSoundSettings: Dispatch<SetStateAction<SoundSettings>>;
    playTestSound: (soundId: 'bol' | 'diapason' | 'gong' | 'none') => void;
    isIOS: boolean;
    isAndroid: boolean;
    setShowInstallModal: Dispatch<SetStateAction<boolean>>;
    isPremiumUser: boolean;
    setIsPremiumUser: Dispatch<SetStateAction<boolean>>;
    clearAllData: () => void;
    themeLabels: Record<Theme, { labelKey: string, class: string }>;
}

export const SettingsPage = ({
    onNavigate,
    theme, setTheme,
    textSize, setTextSize,
    soundSettings, setSoundSettings,
    playTestSound,
    isIOS, isAndroid,
    setShowInstallModal,
    isPremiumUser, setIsPremiumUser,
    clearAllData,
    themeLabels,
}: SettingsPageProps) => {
    const { t } = useI18n();

    return (
        <div className="animate-fade-in space-y-6 pb-24">
            <Button variant='secondary' size='small' onClick={() => onNavigate('welcome')}>← {t('back_to_home')}</Button>
            <h2 className="text-2xl font-bold text-center">{t('settings_title')}</h2>
            
            <Card>
                <h3 className="font-bold text-lg mb-4 text-accent">{t('settings_section_appearance')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">{t('settings_theme')}</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(themeLabels).map(([key, value]) => (
                                <Button key={key} variant={theme === key as Theme ? 'primary' : 'secondary'} size="small" onClick={() => setTheme(key as Theme)}>{t(value.labelKey)}</Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="textSizeRange" className="block text-sm font-medium text-muted mb-2">{t('settings_text_size')}</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">A</span>
                            <input id="textSizeRange" type="range" min="0.8" max="1.4" step="0.1" value={textSize} onChange={e => setTextSize(parseFloat(e.target.value))} className="w-full" />
                            <span className="text-xl">A</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="font-bold text-lg mb-4 text-accent">{t('settings_section_audio')}</h3>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-muted mb-2">{t('settings_sound_select')}</label>
                        <div className="space-y-2">
                            {(['bol', 'diapason', 'gong', 'none'] as const).map(soundId => (
                                <div key={soundId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="sound-select" 
                                            value={soundId} 
                                            checked={soundSettings.selectedSound === soundId}
                                            onChange={e => setSoundSettings(prev => ({...prev, selectedSound: e.target.value as any}))}
                                            className="form-radio h-4 w-4 text-accent bg-card border-muted focus:ring-accent"
                                        />
                                        <span>{t(soundId === 'none' ? 'settings_sound_none' : `settings_sound_${soundId}`)}</span>
                                    </label>
                                    {soundId !== 'none' && (
                                        <Button variant="secondary" size="small" className="!p-2" onClick={() => playTestSound(soundId)} aria-label={`Test ${t(`settings_sound_${soundId}`)}`}>
                                            <PlayIcon />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="volumeRange" className="block text-sm font-medium text-muted mb-2">{t('settings_sound_volume')}</label>
                        <input id="volumeRange" type="range" min="0" max="1" step="0.1" value={soundSettings.volume} onChange={e => setSoundSettings(prev => ({...prev, volume: parseFloat(e.target.value)}))} onMouseUp={() => playTestSound(soundSettings.selectedSound)} className="w-full" />
                    </div>
                </div>
            </Card>
            
            <Card>
                <h3 className="font-bold text-lg mb-4 text-accent">{t('settings_section_support')}</h3>
                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="small" onClick={() => onNavigate('howitworks')}>{t('settings_how_it_works')}</Button>
                    <Button variant="secondary" size="small" onClick={() => onNavigate('faq')}>{t('settings_faq')}</Button>
                    {(isIOS || isAndroid) && <Button variant="secondary" size="small" onClick={() => setShowInstallModal(true)}>{t('settings_install_app')}</Button>}
                </div>
            </Card>
            
            <Card>
                <h3 className="font-bold text-lg mb-4 text-accent">{t('settings_section_bug_report')}</h3>
                <p className="text-muted text-sm mb-3">{t('settings_bug_report_description')}</p>
                <a href="mailto:mindpivot.contact@gmail.com" className="font-poppins inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer text-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg focus:ring-accent h-9 px-3 py-2 text-sm bg-transparent text-fg border border-white/20 hover:bg-white/10 button-secondary-themed hover:scale-[1.02]">
                  {t('settings_bug_report_button')}
                </a>
            </Card>
            
            <Card>
                <h3 className="font-bold text-lg mb-4 text-accent">{t('settings_dev')}</h3>
                <Button variant="info" size="small" onClick={() => setIsPremiumUser(prev => !prev)}>
                    {isPremiumUser ? t('settings_dev_simulate_free') : t('settings_dev_simulate_premium')}
                </Button>
            </Card>

            <Card className="border-bad/30 bg-bad/10">
                <h3 className="font-bold text-lg mb-4 text-bad">{t('settings_danger_zone')}</h3>
                <Button variant="ghost" className="w-full text-bad border border-bad/50 hover:bg-bad/10" onClick={clearAllData}>
                    {t('settings_clear_data')}
                </Button>
            </Card>
        </div>
    );
};
