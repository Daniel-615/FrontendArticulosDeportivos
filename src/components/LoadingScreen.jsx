"use client"

import { motion } from "framer-motion"

export const LoadingScreen = ({ message = "VERIFICANDO SESIÓN" }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <div className="relative w-full max-w-2xl mx-auto mb-8 h-32">
          {/* Animated nimbus cloud moving left to right */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            animate={{
              x: ["-100%", "100vw"],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {/* Nimbus Cloud SVG */}
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_20px_rgba(255,204,0,0.6)]"
            >
              {/* Cloud body - yellow with orange accents */}
              <ellipse cx="30" cy="50" rx="20" ry="18" fill="#FFC107" />
              <ellipse cx="50" cy="45" rx="25" ry="22" fill="#FFD54F" />
              <ellipse cx="70" cy="48" rx="22" ry="20" fill="#FFC107" />
              <ellipse cx="90" cy="52" rx="18" ry="16" fill="#FFB300" />

              {/* Bottom puffs */}
              <ellipse cx="25" cy="60" rx="15" ry="12" fill="#FFB300" />
              <ellipse cx="45" cy="62" rx="18" ry="14" fill="#FFC107" />
              <ellipse cx="65" cy="63" rx="16" ry="13" fill="#FFB300" />
              <ellipse cx="85" cy="60" rx="14" ry="11" fill="#FF9800" />

              {/* Top highlights */}
              <ellipse cx="40" cy="38" rx="12" ry="10" fill="#FFEB3B" opacity="0.7" />
              <ellipse cx="65" cy="40" rx="10" ry="8" fill="#FFEB3B" opacity="0.7" />
            </svg>
          </motion.div>

          {/* Progress bar track */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <motion.h2
          className="text-3xl md:text-4xl font-black text-white mb-4 tracking-wider"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.h2>

        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Subtle hint text */}
        <motion.p
          className="text-white/40 text-sm mt-8 font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          PREPARANDO TU EXPERIENCIA
        </motion.p>
      </div>
    </div>
  )
}
