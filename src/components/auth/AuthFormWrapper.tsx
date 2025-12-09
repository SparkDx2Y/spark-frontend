import { ReactNode } from "react";

export default function AuthFormWrapper({ children }: { children: ReactNode }) {

  return (
    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl shadow-primary/30 w-full max-w-md">

      <div className="absolute inset-0 rounded-2xl border border-primary/30 opacity-30 pointer-events-none"></div>

      {children}

    </div>
  )
}



