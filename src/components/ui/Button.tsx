"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
}

export default function Button({
  children,
  className = "",
  variant = 'default',
  ...props
}: ButtonProps) {
  const isDefault = variant === 'default';

  const ButtonElement = (
    <button
      {...props}
      className={`
        group relative inline-flex items-center justify-center gap-2 
        ${isDefault ? 'w-full' : ''} 
        cursor-pointer transition-all duration-300 
        text-sm font-medium tracking-tight 
        rounded-full py-3 px-6 
        overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        
        ${isDefault ? `
          hover:-translate-y-1 hover:scale-[1.02] 
          border-gradient text-white/80 hover:text-white
          bg-white/5 backdrop-blur-xl
          disabled:hover:translate-y-0 disabled:hover:scale-100
        ` : ''}

        ${variant === 'outline' ? `
          border border-white/20 text-white/80 hover:text-white hover:bg-white/5
        ` : ''}

        ${variant === 'ghost' ? `
           text-white/60 hover:text-white hover:bg-white/5
        ` : ''}
        
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>

      {/* Reflection Highlight - Only for default */}
      {isDefault && (
        <span
          aria-hidden="true"
          className="transition-all duration-300 group-hover:opacity-80 opacity-20 w-[70%] h-px rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
          style={{
            background: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 100%)'
          }}
        />
      )}
    </button>
  );

  if (!isDefault) {
    return ButtonElement;
  }

  return (
    <div className="group relative w-full">
      {ButtonElement}

      {/* External Background Glow (Primary Color: #ff4b7d) */}
      <span
        className="pointer-events-none absolute -bottom-2 left-1/2 z-0 h-6 w-[80%] -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
          background: 'radial-gradient(60% 100% at 50% 50%, rgba(255,75,125,.4), rgba(255,75,125,.15) 35%, transparent 70%)',
          filter: 'blur(12px) saturate(150%)'
        }}
        aria-hidden="true"
      />
    </div>
  );
}


