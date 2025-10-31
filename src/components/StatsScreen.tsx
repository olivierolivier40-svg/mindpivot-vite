import type { Session } from '../types.ts';
import { RITUELS } from '../constants.ts';
import { Card } from './Card.tsx';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface StatsScreenProps {
    sessions: Session[];
    onBack: () => void;
}

export const StatsScreen = ({ sessions, onBack }: StatsScreenProps) => {
    const { t } = useI18n();
    const totalSeconds = sessions.reduce((acc, s) => acc + s.dureeSec, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const averageSeconds = sessions.length > 0 ? totalSeconds / sessions.length : 0;
    const avgMinutes = Math.floor(averageSeconds / 60);
    const avgSecs = Math.round(averageSeconds % 60);

    const categoryCounts = sessions.reduce((acc, session) => {
        const ritual = RITUELS.find(r => r.id === session.ritualId);
        if (ritual) {
            acc[ritual.category] = (acc[ritual.category] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const totalRituals = sessions.length;
    const categoryColors: Record<string, string> = {
        'respiration': '#3498db',
        'neuro': '#9b59b6',
        'micro-rituel': '#2ecc71',
    };
    let gradientParts: string[] = [];
    let currentPercentage = 0;
    for (const [category, count] of Object.entries(categoryCounts)) {
        const percentage = (count / totalRituals) * 100;
        gradientParts.push(`${categoryColors[category] || '#7f8c8d'} ${currentPercentage}% ${currentPercentage + percentage}%`);
        currentPercentage += percentage;
    }
    const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;
    
    return (
      <Card className="animate-fade-in">
        <Button variant='secondary' size='small' onClick={onBack}>← {t('back')}</Button>
        <h2 className="text-2xl font-bold text-center mt-2 mb-6">{t('stats_title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-accent">{t('stats_overview')}</h3>
                <div className="p-4 bg-white/5 rounded-lg text-center">
                    <p className="text-3xl font-bold">{totalMinutes}<span className="text-xl text-muted">{t('unit_min')}</span></p>
                    <p className="text-sm text-muted">{t('stats_total_time')}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg text-center">
                    <p className="text-3xl font-bold">{avgMinutes}<span className="text-xl text-muted">m</span> {avgSecs}<span className="text-xl text-muted">s</span></p>
                    <p className="text-sm text-muted">{t('stats_avg_duration')}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg text-center opacity-50">
                    <p className="text-3xl font-bold">--%</p>
                    <p className="text-sm text-muted">{t('stats_completion_rate')} <span className="text-xs">({t('stats_coming_soon')})</span></p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-lg text-accent">{t('stats_category_distribution')}</h3>
                <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center gap-4">
                   {totalRituals > 0 ? (
                       <>
                        <div className="w-32 h-32 rounded-full" style={{ background: conicGradient }}></div>
                        <div className="text-xs space-y-1">
                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <div key={category} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: categoryColors[category] || '#7f8c8d' }}></div>
                                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}: {count} ({((count/totalRituals)*100).toFixed(0)}%)</span>
                                </div>
                            ))}
                        </div>
                       </>
                   ) : (
                       <p className="text-sm text-muted text-center h-full flex items-center">{t('stats_start_practicing')}</p>
                   )}
                </div>
            </div>

        </div>

        <div className="mt-6">
            <h3 className="font-bold text-lg mb-2 text-accent">{t('stats_last_7_days_activity')}</h3>
            <div className="flex justify-around items-end h-32 bg-white/5 p-2 rounded-lg">
                {Array.from({length: 7}).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const dayLabel = date.toLocaleDateString('fr', { weekday: 'short' }).charAt(0).toUpperCase();
                    const count = sessions.filter(s => new Date(s.timestamp).toDateString() === date.toDateString()).length;
                    const barHeight = count === 0 ? 2 : Math.max(5, count * 15);
                    const formattedDate = date.toLocaleDateString('fr');
                    return (
                        <div key={i} className="flex flex-col items-center h-full justify-end w-10">
                            <div className="text-xs text-muted font-bold h-4">{count > 0 ? count : ''}</div>
                            <div className="w-6 bg-accent rounded-t-md transition-colors hover:bg-accent-strong animate-grow-bar" style={{ height: `${barHeight}%`, animationDelay: `${i * 100}ms` }} title={t('stats_rituals_on_date', { count: count, date: formattedDate })}></div>
                            <div className="text-xs text-muted mt-1">{dayLabel}</div>
                        </div>
                    );
                })}
            </div>
        </div>

      </Card>
    );
};