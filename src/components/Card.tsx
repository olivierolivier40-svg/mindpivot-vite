import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
    <section className={`bg-card rounded-lg p-4 shadow-lg border border-white/10 ${className}`}>
        {children}
    </section>
);
