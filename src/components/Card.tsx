import type { ReactNode, FC } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => (
    <section className={`bg-card rounded-lg p-4 shadow-lg border border-white/10 ${className}`}>
        {children}
    </section>
);