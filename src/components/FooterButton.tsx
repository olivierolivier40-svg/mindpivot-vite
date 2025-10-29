import React from 'react';

export const FooterButton = ({ icon, label, onClick, isActive, hasNotification = false }: { icon: React.ReactNode; label: string; onClick: () => void; isActive: boolean; hasNotification?: boolean; }) => (
  <button onClick={onClick} aria-label={label} className={`flex flex-col items-center justify-center p-2 w-16 transition-colors duration-200 relative ${isActive ? 'text-accent' : 'text-muted hover:text-fg'}`}>
    <span className="w-8 h-8">{icon}</span>
    <span className="text-xs mt-1">{label}</span>
    {hasNotification && <span className="absolute top-1 right-3 block h-2 w-2 rounded-full bg-accent ring-2 ring-bg"></span>}
  </button>
);