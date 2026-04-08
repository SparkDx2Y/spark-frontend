"use client"

import Image from "next/image"
import type { ReactNode } from "react"

type CardProps = {
  src: string
  alt: string
  children?: ReactNode
  frontContent?: ReactNode
  backfaceClassName?: string
  backSrc?: string
}

const Card = ({ src, alt, children, frontContent, backfaceClassName = "", backSrc }: CardProps) => {
  return (
    <div
      data-card-shell
      className="relative z-0 aspect-2/3 min-w-0 w-[clamp(220px,32vw,400px)] flex-1 overflow-visible bg-transparent perspective-[1000px] hover:z-10 transition-z"
    >
      <div
        data-flip-inner
        className="relative h-full w-full rounded-(--rad,16px) transform-3d will-change-transform"
      >
        <div
          data-card-face="front"
          className="absolute inset-0 overflow-hidden backface-hidden transform-[translateZ(4px)] rounded-[inherit]"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 32vw, (max-width: 1024px) 34vw, 400px"
            className="object-cover"
          />
          {frontContent && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {frontContent}
            </div>
          )}
        </div>

        <div
          data-card-face="back"
          className={`absolute inset-0 flex flex-col justify-center overflow-hidden border border-white/15 backface-hidden transform-[rotateY(180deg)_translateZ(4px)] rounded-[inherit]`}
        >
          {backSrc && (
            <div className="absolute inset-0 z-0">
              <Image
                src={backSrc}
                alt={`${alt} back`}
                fill
                sizes="(max-width: 640px) 32vw, (max-width: 1024px) 34vw, 400px"
                className="object-cover"
              />
            </div>
          )}

          <div className={`relative z-10 flex flex-col justify-center h-full py-10 px-8 ${backfaceClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
