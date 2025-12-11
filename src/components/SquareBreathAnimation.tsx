
import { useMemo } from 'react';

interface SquareBreathAnimationProps {
  label: string;
  progress: number; // 0 to 1 for the current phase
  phase: number; // 0: Inhale, 1: Hold Full, 2: Exhale, 3: Hold Empty
  size?: number;
}

export const SquareBreathAnimation = ({ label, progress, phase, size = 300 }: SquareBreathAnimationProps) => {
  const strokeWidth = 6;
  // Dimensions of the drawable area (0-100 coordinate space for easier math)
  const min = 20;
  const max = 80;
  
  // Calculate the current tip position based on phase and progress
  const tipPos = useMemo(() => {
    // Phase 0: Inhale (Bottom-Left to Top-Left) -> Up
    if (phase === 0) return { x: min, y: max - (max - min) * progress };
    // Phase 1: Hold Full (Top-Left to Top-Right) -> Right
    if (phase === 1) return { x: min + (max - min) * progress, y: min };
    // Phase 2: Exhale (Top-Right to Bottom-Right) -> Down
    if (phase === 2) return { x: max, y: min + (max - min) * progress };
    // Phase 3: Hold Empty (Bottom-Right to Bottom-Left) -> Left
    // This is the geometric closing of the square. It goes Right to Left.
    if (phase === 3) return { x: max - (max - min) * progress, y: max };
    return { x: min, y: max };
  }, [phase, progress]);

  // Color logic based on phase
  const getPhaseColor = (p: number) => {
    switch (p) {
        case 0: return 'var(--color-accent)'; // Inhale (Blue)
        case 1: return 'var(--color-fg)'; // Hold Full (White)
        case 2: return 'var(--color-accent-secondary)'; // Exhale (Green/Teal)
        case 3: return 'var(--color-muted)'; // Hold Empty (Grey)
        default: return 'var(--color-accent)';
    }
  };

  const currentColor = getPhaseColor(phase);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
        {/* Background Track (The Box) */}
        <path
          d={`M${min},${max} L${min},${min} L${max},${min} L${max},${max} Z`}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Trail Effect: Active side gets highlighted up to current point */}
        {phase === 0 && (
            <line x1={min} y1={max} x2={min} y2={tipPos.y} stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        )}
        {phase === 1 && (
            <line x1={min} y1={min} x2={tipPos.x} y2={min} stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        )}
        {phase === 2 && (
            <line x1={max} y1={min} x2={max} y2={tipPos.y} stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        )}
        {phase === 3 && (
            <line x1={max} y1={max} x2={tipPos.x} y2={max} stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        )}

        {/* The Traveling Dot/Head */}
        <circle
            cx={tipPos.x}
            cy={tipPos.y}
            r={strokeWidth * 1.5}
            fill={currentColor}
            className="transition-all duration-75 ease-linear"
            style={{ filter: `drop-shadow(0 0 8px ${currentColor})` }}
        />

        {/* Corner Markers with subtle pulsing for next target */}
        <circle cx={min} cy={max} r={2} fill="rgba(255,255,255,0.3)" />
        <circle cx={min} cy={min} r={2} fill="rgba(255,255,255,0.3)" className={phase === 0 ? "animate-pulse" : ""} />
        <circle cx={max} cy={min} r={2} fill="rgba(255,255,255,0.3)" className={phase === 1 ? "animate-pulse" : ""} />
        <circle cx={max} cy={max} r={2} fill="rgba(255,255,255,0.3)" className={phase === 2 ? "animate-pulse" : ""} />

      </svg>

      {/* Label */}
      <div className="absolute flex flex-col items-center justify-center text-center p-4 pointer-events-none">
        <div className="text-2xl font-bold leading-tight text-fg transition-all duration-300 drop-shadow-md" dangerouslySetInnerHTML={{ __html: label }} />
      </div>
    </div>
  );
};
