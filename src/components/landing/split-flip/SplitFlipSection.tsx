"use client"

import { useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Card from "./Card"
import Text from "./Text"
import Image from "next/image"

// Only register in client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const COPY = {
  titleLight:
    "text-2xl! font-bold tracking-tight text-white drop-shadow-md sm:text-3xl!",
  bodyLight:
    "mt-3 text-sm! font-medium text-gray-300 drop-shadow-md sm:text-base!",
} as const

const SplitFlipSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const row = rowRef.current
      const heading = headingRef.current
      if (!section || !row || !heading) return

      let mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {

      const cards = row.querySelectorAll<HTMLElement>("[data-card-shell]")
      const flippers = row.querySelectorAll<HTMLElement>("[data-flip-inner]")

      const radius = 32
      const stripRadii = [
        `${radius}px 0 0 ${radius}px`,
        "0",
        `0 ${radius}px ${radius}px 0`,
      ]

      cards.forEach((card, i) => {
        const faces = card.querySelectorAll<HTMLElement>("[data-card-face]")
        gsap.set(faces, { borderRadius: stripRadii[i] })
      })

      flippers.forEach((f) => {
        gsap.set(f, { rotationY: 0, transformStyle: "preserve-3d" })
      })

      const flipParams = [
        { rotateZ: -6, moveY: 20, moveX: 70 },
        { rotateZ: 0, moveY: -18, moveX: 0 },
        { rotateZ: 6, moveY: 20, moveX: -70 }
      ]

      const flipTl = gsap.timeline({ paused: true })

      flippers.forEach((flipper, i) => {
        flipTl.to(
          flipper,
          {
            rotationY: 180,
            rotationZ: flipParams[i].rotateZ,
            y: flipParams[i].moveY,
            x: flipParams[i].moveX,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
            duration: 0.8,
            ease: "power2.inOut",
            force3D: true,
          },
          0
        )
      })

      flippers.forEach((flipper) => {
        const front = flipper.querySelector<HTMLElement>("[data-card-face='front']")
        const back = flipper.querySelector<HTMLElement>("[data-card-face='back']")
        if (back) gsap.set(back, { visibility: "hidden" })

        if (front) flipTl.set(front, { visibility: "hidden" }, 0.4)
        if (back) flipTl.set(back, { visibility: "visible" }, 0.4)
      })

      let flipped = false

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress > 0.5 && !flipped) {
              flipped = true
              flipTl.play()
            } else if (self.progress <= 0.5 && flipped) {
              flipped = false
              flipTl.reverse()
            }
          },
        },
      })

      tl.to(row, { scale: 0.76, duration: 1, ease: "none" }, 0)
      tl.fromTo(heading, { opacity: 0, y: 150 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0)
      tl.to(row, { gap: "5rem", duration: 1, ease: "none" }, 1)

      cards.forEach((card) => {
        const faces = card.querySelectorAll<HTMLElement>("[data-card-face]")
        tl.to(
          faces,
          { borderRadius: `${radius}px`, duration: 1, ease: "none" },
          1
        )
      })

      }) // end matchMedia
    },
    { scope: sectionRef }
  )

  return (
    <>
      {/* DESKTOP SPLIT FLIP */}
      <div
        ref={sectionRef}
        className="hidden md:flex relative z-20 min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 bg-black sm:px-8 md:px-12 lg:px-20"
      >
      <div ref={headingRef} className="absolute top-[14%] md:top-[16%] left-0 w-full text-center z-0 pointer-events-none px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-medium tracking-tight drop-shadow-md">
          Where are you <span className="font-serif italic text-gray-400">in</span> your journey?
        </h2>
      </div>

      <div
        ref={rowRef}
        className="relative z-10 flex flex-nowrap items-center justify-center gap-0 overflow-visible will-change-transform w-full max-w-7xl mx-auto mt-24 md:mt-36"
      >
        <Card
          src="/bgg1.png"
          alt="A Spark Awaits"
          backSrc="/girl.jpg"
          frontContent={
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[15vh] font-black tracking-[-0.05em] text-white/30 mix-blend-overlay [writing-mode:vertical-rl] rotate-180 uppercase">
                Discover
              </span>
            </div>
          }
          backfaceClassName="bg-gradient-to-t from-[#1E1F23] via-[#1E1F23]/70 to-transparent border border-primary/30 shadow-[0_10px_40px_-10px_rgba(255,75,125,0.4)] pb-8"
        >
          <Text className="mt-auto mb-2 text-5xl! font-bold text-primary opacity-90 drop-shadow-[0_0_15px_rgba(255,75,125,0.8)]"> 01 </Text>
          <Text className={COPY.titleLight}>
            A Spark Awaits
          </Text>
          <Text className={COPY.bodyLight}>
            Every great romance begins with a single moment. Find the one who truly gets your vibe.
          </Text>
        </Card>

        <Card
          src="/bgg2.png"
          alt="Meaningful Connections"
          backSrc="/boy1.jpg"
          frontContent={
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[15vh] font-black tracking-[-0.05em] text-white/30 mix-blend-overlay [writing-mode:vertical-rl] uppercase">
                Connect
              </span>
            </div>
          }
          backfaceClassName="bg-gradient-to-t from-[#1E1F23] via-[#1E1F23]/70 to-transparent border border-purple-500/30 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.4)] pb-8"
        >
          <Text className="mt-auto mb-2 text-5xl! font-bold text-purple-400 opacity-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"> 02 </Text>
          <Text className={COPY.titleLight}>
            Meaningful Connections
          </Text>
          <Text className={COPY.bodyLight}>
            Skip the superficial small talk. Dive into deep conversations that map to what actually matters to you.
          </Text>
        </Card>

        <Card
          src="/bgg3.png"
          alt="Your Next Chapter"
          backSrc="/girl2.jpg"
          frontContent={
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[15vh] font-black tracking-[-0.05em] text-white/30 mix-blend-overlay [writing-mode:vertical-rl] rotate-180 uppercase">
                Spark
              </span>
            </div>
          }
          backfaceClassName="bg-gradient-to-t from-[#1E1F23] via-[#1E1F23]/70 to-transparent border border-pink-400/30 shadow-[0_10px_40px_-10px_rgba(244,114,182,0.4)] pb-8"
        >
          <Text className="mt-auto mb-2 text-5xl! font-bold text-pink-400 opacity-90 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]"> 03 </Text>
          <Text className={COPY.titleLight}>
             Your Next Chapter
          </Text>
          <Text className={COPY.bodyLight}>
            Your one-in-a-million might just be a swipe away. A vibrant community of authentic people awaits.
          </Text>
        </Card>
      </div>
    </div>

      {/* MOBILE STICKY STACK */}
      <div className="md:hidden flex flex-col items-center justify-start w-full px-4 pt-36 pb-0 bg-black relative z-20">
        <h2 className="text-3xl text-white font-medium tracking-tight drop-shadow-md text-center mb-10">
          Where are you <span className="font-serif italic text-gray-400">in</span> your journey?
        </h2>
        
        <div className="w-full max-w-sm flex flex-col relative pb-10">
          {/* Card 1 */}
          <div className="sticky top-32 w-full aspect-2/3 mb-12 overflow-hidden border border-primary/30 rounded-[32px] shadow-[0_-10px_40px_-10px_rgba(255,75,125,0.3)] bg-[#111] -rotate-3 transition-transform duration-500 hover:rotate-0">
            <div className="absolute inset-0 pointer-events-none">
              <Image 
                src="/girl.jpg" 
                alt="A Spark Awaits" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, 400px" 
                className="object-cover opacity-60" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1E1F23] via-[#1E1F23]/70 to-transparent"></div>
            </div>
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <Text className="mb-2 text-5xl! font-bold text-primary opacity-90 drop-shadow-[0_0_15px_rgba(255,75,125,0.8)]"> 01 </Text>
              <Text className={COPY.titleLight}>A Spark Awaits</Text>
              <Text className={COPY.bodyLight}>Every great romance begins with a single moment. Find the one who truly gets your vibe.</Text>
            </div>
          </div>

          {/* Card 2 */}
          <div className="sticky top-40 w-full aspect-2/3 mb-12 overflow-hidden border border-purple-500/30 rounded-[32px] shadow-[0_-10px_40px_-10px_rgba(168,85,247,0.3)] bg-[#111] rotate-2 transition-transform duration-500 hover:rotate-0">
            <div className="absolute inset-0 pointer-events-none">
              <Image 
                src="/boy1.jpg" 
                alt="Meaningful Connections" 
                fill 
                sizes="(max-width: 768px) 100vw, 400px" 
                className="object-cover opacity-60" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1E1F23] via-[#1E1F23]/70 to-transparent"></div>
            </div>
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <Text className="mb-2 text-5xl! font-bold text-purple-400 opacity-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"> 02 </Text>
              <Text className={COPY.titleLight}>Meaningful Connections</Text>
              <Text className={COPY.bodyLight}>Skip the superficial small talk. Dive into deep conversations that map to what actually matters to you.</Text>
            </div>
          </div>

          {/* Card 3 */}
          <div className="sticky top-48 w-full aspect-2/3 mb-12 overflow-hidden border border-pink-400/30 rounded-[32px] shadow-[0_-10px_40px_-10px_rgba(244,114,182,0.3)] bg-[#111] -rotate-1 transition-transform duration-500 hover:rotate-0">
             <div className="absolute inset-0 pointer-events-none">
              <Image 
                src="/girl2.jpg" 
                alt="Your Next Chapter" 
                fill 
                sizes="(max-width: 768px) 100vw, 400px" 
                className="object-cover opacity-60" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1E1F23] via-[#1E1F23]/70 to-transparent"></div>
            </div>
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <Text className="mb-2 text-5xl! font-bold text-pink-400 opacity-90 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]"> 03 </Text>
              <Text className={COPY.titleLight}>Your Next Chapter</Text>
              <Text className={COPY.bodyLight}>Your one-in-a-million might just be a swipe away. A vibrant community of authentic people awaits.</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SplitFlipSection
