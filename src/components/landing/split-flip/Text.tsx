"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

type TextProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

const Text = ({
  children,
  className = "",
  delay = 0,
}: TextProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  // Support splitting strings into words for staggering, otherwise just animate the whole children
  const isString = typeof children === "string"
  const words = isString ? children.split(" ") : []

  return (
    <div ref={ref} className={`text-4xl ${className}`} style={{ overflow: "hidden" }}>
      {isString ? (
        words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: "110%" }}
            animate={isInView ? { opacity: 1, y: "0%" } : { opacity: 0, y: "110%" }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1], // similar to power2.out
              delay: delay + index * 0.05,
            }}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >
             {word}
          </motion.span>
        ))
      ) : (
        <motion.div
           initial={{ opacity: 0, y: "110%" }}
           animate={isInView ? { opacity: 1, y: "0%" } : { opacity: 0, y: "110%" }}
           transition={{
             duration: 0.8,
             ease: [0.16, 1, 0.3, 1],
             delay: delay,
           }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

export default Text
