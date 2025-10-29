import React from 'react';

interface RingDonutProps {
  label: string;
  ratio: number; // phase progress (0 to 1)
  sessionProgressRatio: number; // overall session progress
}

export const RingDonut: React.FC<RingDonutProps> = ({ label, ratio, sessionProgressRatio }) => {
  const size = 280;
  const outerRadius = 130;
  const innerRadius = 105;
  const strokeWidth = 8;

  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerOffset = outerCircumference - sessionProgressRatio * outerCircumference;

  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerOffset = innerCircumference - ratio * innerCircumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Outer Ring: Session Progress */}
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={outerRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="var(--color-accent)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={outerRadius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: outerCircumference,
            strokeDashoffset: outerOffset,
            transition: 'stroke-dashoffset 0.35s linear',
          }}
        />

        {/* Inner Ring: Phase Progress */}
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth + 4}
          r={innerRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="var(--color-accent-secondary)"
          fill="transparent"
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          r={innerRadius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: innerCircumference,
            strokeDashoffset: innerOffset,
            transition: 'stroke-dashoffset 0.2s linear',
          }}
        />
      </svg>
      
      {/* Central faded circle */}
      <div className="absolute w-[180px] h-[180px] rounded-full bg-card/30 backdrop-blur-sm"></div>

      {/* Label */}
      <div className="absolute flex flex-col items-center justify-center text-center p-4 pointer-events-none">
        <div className="text-3xl font-bold leading-tight text-fg [text-shadow:_0_1px_8px_rgb(0_0_0_/_50%)]" dangerouslySetInnerHTML={{ __html: label }} />
      </div>
    </div>
  );
};