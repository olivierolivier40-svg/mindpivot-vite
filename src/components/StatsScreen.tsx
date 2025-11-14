import { useState, useMemo } from 'react';
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
    const [activityRange, setActivityRange] = useState<'7d' | '30d' | 'year'>('7d');

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
    
    const chartData = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Ensure today includes the whole day
        const data: { label: string; count: number; tooltip: string; key: string }[] = [];

        if (activityRange === '7d') {
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - (6-i));
                const dateString = date.toDateString();
                const count = sessions.filter(s => new Date(s.timestamp).toDateString() === dateString).length;
                data.push({
                    key: dateString,
                    label: date.toLocaleDateString('fr', { weekday: 'short' }).slice(0, 1).toUpperCase(),
                    count,
                    tooltip: t('stats_rituals_on_date', { count, date: date.toLocaleDateString('fr') })
                });
            }
        } else if (activityRange === '30d') {
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - (29-i));
                const dateString = date.toDateString();
                const count = sessions.filter(s => new Date(s.timestamp).toDateString() === dateString).length;
                data.push({
                    key: dateString,
                    label: date.toLocaleDateString('fr', { day: 'numeric' }),
                    count,
                    tooltip: t('stats_rituals_on_date', { count, date: date.toLocaleDateString('fr') })
                });
            }
        } else if (activityRange === 'year') {
            const currentYear = today.getFullYear();
            const yearSessions = sessions.filter(s => new Date(s.timestamp).getFullYear() === currentYear);
            for (let i = 0; i < 12; i++) {
                const monthName = new Date(currentYear, i, 1).toLocaleDateString('fr', { month: 'long' });
                const count = yearSessions.filter(s => new Date(s.timestamp).getMonth() === i).length;
                data.push({
                    key: `${currentYear}-${i}`,
                    label: monthName.slice(0, 3),
                    count,
                    tooltip: t('stats_month_of', { count, month: monthName })
                });
            }
        }
        return data;
    }, [activityRange, sessions, t]);

    const maxCount = Math.max(1, ...chartData.map(d => d.count));

    const rangeTitles: Record<typeof activityRange, string> = {
        '7d': t('stats_last_7_days_activity'),
        '30d': t('stats_last_30_days_activity'),
        'year': t('stats_this_year_activity'),
    };
    
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
                        <div className="text-xs space-y-1 self-start w-full">
                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <div key={category} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: categoryColors[category] || '#7f8c8d' }}></div>
                                    <span>{t(`stats_category_${category}`)}: {count} ({((count/totalRituals)*100).toFixed(0)}%)</span>
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

        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2">
                <h3 className="font-bold text-lg text-accent">{rangeTitles[activityRange]}</h3>
                <div className="flex gap-1 bg-card border border-white/10 p-1 rounded-lg self-start sm:self-center">
                    <Button size="small" className="!h-7 !px-2" variant={activityRange === '7d' ? 'primary' : 'ghost'} onClick={() => setActivityRange('7d')}>{t('stats_7_days')}</Button>
                    <Button size="small" className="!h-7 !px-2" variant={activityRange === '30d' ? 'primary' : 'ghost'} onClick={() => setActivityRange('30d')}>{t('stats_30_days')}</Button>
                    <Button size="small" className="!h-7 !px-2" variant={activityRange === 'year' ? 'primary' : 'ghost'} onClick={() => setActivityRange('year')}>{t('stats_this_year')}</Button>
                </div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg overflow-x-auto">
                <div className="flex items-end h-32 gap-1.5 min-w-full" style={{width: activityRange === '30d' ? '50rem' : 'auto'}}>
                    {chartData.map((data, i) => {
                        const barHeight = data.count === 0 ? '1%' : `${(data.count / maxCount) * 90 + 10}%`;
                        const barWidthClass = activityRange === '7d' ? 'flex-1' : activityRange === '30d' ? 'w-4' : 'flex-1 max-w-10';

                        return (
                            <div key={data.key} className={`flex flex-col items-center h-full justify-end ${barWidthClass}`}>
                                <div className="text-xs text-muted font-bold h-4">{data.count > 0 ? data.count : ''}</div>
                                <div 
                                    className="w-full bg-accent rounded-t-md transition-colors hover:bg-accent-secondary animate-grow-bar" 
                                    style={{ height: barHeight, animationDelay: `${i * 30}ms` }} 
                                    title={data.tooltip}
                                ></div>
                                <div className="text-xs text-muted mt-1">{data.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

      </Card>
    );
};
