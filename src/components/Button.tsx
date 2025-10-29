import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'info';
  size?: 'normal' | 'small' | 'large';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, size = 'normal', className, ...props }, ref) => {
    const baseClasses = 'font-poppins inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg focus:ring-accent';
    const sizeClasses = { 
      normal: 'h-12 px-4 py-3', 
      small: 'h-9 px-3 py-2 text-sm', 
      large: 'h-14 px-6 py-4 text-lg' 
    };
    const variantClasses = {
      primary: 'bg-accent text-white shadow-md hover:bg-link hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-accent/30',
      info: 'bg-accent-tertiary text-white shadow-md hover:bg-opacity-90 hover:shadow-lg hover:scale-[1.02]',
      secondary: `bg-transparent text-fg border border-white/20 hover:bg-white/10 font-semibold button-secondary-themed hover:scale-[1.02]`,
      ghost: 'bg-transparent border-none text-fg hover:bg-white/10 shadow-none hover:scale-[1.02]'
    };
    return <button ref={ref} className={`${baseClasses} ${sizeClasses[size]} ${variant ? variantClasses[variant] : ''} ${className}`} {...props}>{children}</button>;
  }
);