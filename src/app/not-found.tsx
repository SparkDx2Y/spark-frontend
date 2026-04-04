"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-[#b3b3b3] flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-hotpink selection:text-white">
      <title>404 | Spotlight</title>

      {/* Grid Pattern Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          maskImage: 'linear-gradient(-35deg, transparent 30%, white)',
        }}
      />

      {/* Animated Flashlight Logic using Framer Motion */}
      <motion.div
        animate={{
          "--swing-x": [-100, 100],
          "--swing-y": [-100, 0, -100],
        } as any}
        transition={{
          "--swing-x": { duration: 2, repeat: Infinity, repeatType: "mirror", ease: "linear" },
          "--swing-y": { duration: 1, repeat: Infinity, repeatType: "mirror", ease: "linear" },
        }}
        className="contents"
      >
        {/* The Big 404 with Spotlight Reveal */}
        <div className="relative z-10 select-none">
          {/* Shadow layer */}
          <motion.span
            aria-hidden="true"
            style={{
              transform: `scale(1.05) translate3d(calc(var(--swing-x) * 0.05 * 1%), calc(var(--swing-y) * -0.025 * 1%), -10vmin) translate(0, 12%)`,
              filter: 'blur(1.5vmin)',
              color: 'rgba(0,0,0,0.9)',
            }}
            className="absolute inset-0 text-[clamp(5rem,30vmin,20rem)] font-black tracking-[1rem] flex items-center justify-center opacity-80 select-none pointer-events-none"
          >
            404
          </motion.span>

          {/* Foreground Text with Spotlight Gradient */}
          <h1
            style={{
              background: 'radial-gradient(circle at calc(50% + (var(--swing-x) * 0.5) * 1%) 100%, white, #a6a6a6 45%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
            className="text-[clamp(5rem,30vmin,20rem)] font-black tracking-[1rem] leading-none z-20 relative p-4 select-none uppercase"
          >
            404
          </h1>
        </div>

        {/* Spotlight Overlay (The Cloak) */}
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <motion.div
            style={{
              transformOrigin: '50% 25%',
              transform: `translate(-50%, -50%) rotate(calc(var(--swing-x) * -0.25deg))`,
              background: `radial-gradient(40% 40% at 50% calc(42% + (var(--swing-y) * 0.01%)), transparent, rgba(5, 5, 5, 0.96) 38vmax)`,
            }}
            className="absolute top-1/2 left-1/2 h-[250vmax] w-[250vmax]"
          />
        </div>

        {/* Information Section */}
        <div className="relative z-60 mt-12 flex flex-col items-center gap-8 text-center max-w-[44ch] px-6">
          <p className="text-white/80 font-light text-xl leading-relaxed transition-all duration-300 hover:text-white">
            We&apos;re fairly sure that page used to be here, but seems to have gone
            missing. We do apologise on its behalf.
          </p>

          <button onClick={() => router.back()} className="group border border-white/30 hover:border-white/60 px-16 py-4 rounded-lg text-white/90 hover:text-white transition-all text-sm uppercase tracking-widest hover:bg-white/10 backdrop-blur-sm">
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Tailwind Specific Tweaks */}
      <style hs-inject="true">{`
        :root {
          --swing-x: 0;
          --swing-y: 0;
        }
      `}</style>
    </div>
  );
}
