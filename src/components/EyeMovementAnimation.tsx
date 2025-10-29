interface EyeMovementAnimationProps {
    slow?: boolean;
}

export const EyeMovementAnimation = ({slow}: EyeMovementAnimationProps) => {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
          <div className="relative w-[250px] h-8">
            <div className="absolute w-8 h-8 rounded-full bg-cyan-400" style={{ animation: `${slow ? 'eye-move-slow 8s' : 'eye-move 1.5s'} ease-in-out infinite`, boxShadow: '0 0 15px 5px rgba(0, 255, 255, 0.5)' }}></div>
          </div>
      </div>
    );
};