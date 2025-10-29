import { Session, Streaks } from "./types.ts";

export const calculateStreaks = (sessions: Session[]): Streaks => {
    if (sessions.length < 1) return { current: 0, longest: 0 };
    const toISODate = (date: Date) => date.toISOString().split('T')[0];
    const practiceDates = [...new Set(sessions.map(s => toISODate(new Date(s.timestamp))))].sort((a, b) => b.localeCompare(a));
    
    let longest = 0;
    if (practiceDates.length > 0) {
        let currentLongest = 1;
        longest = 1;
        for (let i = 0; i < practiceDates.length - 1; i++) {
            const currentDate = new Date(practiceDates[i]);
            const nextDate = new Date(practiceDates[i+1]);
            const diffTime = currentDate.getTime() - nextDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) { currentLongest++; } 
            else { longest = Math.max(longest, currentLongest); currentLongest = 1; }
        }
        longest = Math.max(longest, currentLongest);
    }

    let current = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (practiceDates.includes(toISODate(today)) || practiceDates.includes(toISODate(yesterday))) {
        let lastDate = new Date();
        if (!practiceDates.includes(toISODate(today))) { lastDate = yesterday; }
        while (practiceDates.includes(toISODate(lastDate))) {
            current++;
            lastDate.setDate(lastDate.getDate() - 1);
        }
    }
    return { current, longest };
};