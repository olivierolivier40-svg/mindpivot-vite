import { useEffect, useRef } from 'react';

interface FrequencyVisualizerProps {
  frequency: number;
  isRunning: boolean;
  color?: string;
}

export const FrequencyVisualizer = ({ frequency, isRunning, color = '#FFFFFF' }: FrequencyVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!isRunning) return;

      // Mise à jour de la taille du canvas pour la netteté
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const amplitude = height * 0.15; // Hauteur de l'onde
      const centerY = height / 2;
      
      // Vitesse visuelle basée sur la fréquence (normalisée pour être agréable à l'œil)
      // On utilise une fonction log pour que les hautes fréquences ne bougent pas trop vite
      const speed = 0.05 + (Math.log(frequency) / 100); 
      
      // Longueur d'onde visuelle
      const wavelength = 0.01 + (frequency / 10000);

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;

      for (let x = 0; x < width; x++) {
        // Formule de l'onde sinusoïdale avec le temps qui passe
        const y = centerY + Math.sin(x * wavelength + timeRef.current) * amplitude * Math.sin(timeRef.current * 0.5);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Onde secondaire (plus subtile) pour effet de profondeur
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * wavelength * 1.5 - timeRef.current * 0.8) * (amplitude * 0.7);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      timeRef.current += speed;
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [frequency, isRunning, color]);

  return (
    <div className="w-full h-64 flex items-center justify-center relative overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute inset-0"
      />
    </div>
  );
};