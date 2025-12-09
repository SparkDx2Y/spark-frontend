"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}


export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="relative w-full group">
      <input
        {...props}
        placeholder=" " 
        className={`peer w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-transparent outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 ${className}`}
      />
      
      {label && (
        <label
          className="
            absolute left-4 top-4 text-gray-400 text-base pointer-events-none transition-all duration-200
            peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 
            peer-focus:scale-75 
            peer-focus:-translate-y-3
            peer-focus:text-primary
            scale-75 -translate-y-3 origin-left
          "
        >
          {label}
        </label>
      )}

      {error && <p className="text-sm text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}
