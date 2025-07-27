"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Componente para crear las esferas del dragón
const DragonBall = ({ stars, index, ballsScattering }) => {
  // Posiciones de las estrellas para cada esfera
  const getStarPositions = (numStars) => {
    const positions = []
    const radius = 25
    const centerX = 40
    const centerY = 40

    if (numStars === 1) {
      positions.push({ x: centerX, y: centerY })
    } else if (numStars === 2) {
      positions.push({ x: centerX - 10, y: centerY })
      positions.push({ x: centerX + 10, y: centerY })
    } else if (numStars === 3) {
      positions.push({ x: centerX, y: centerY - 12 })
      positions.push({ x: centerX - 10, y: centerY + 8 })
      positions.push({ x: centerX + 10, y: centerY + 8 })
    } else if (numStars === 4) {
      positions.push({ x: centerX - 10, y: centerY - 10 })
      positions.push({ x: centerX + 10, y: centerY - 10 })
      positions.push({ x: centerX - 10, y: centerY + 10 })
      positions.push({ x: centerX + 10, y: centerY + 10 })
    } else if (numStars === 5) {
      positions.push({ x: centerX, y: centerY - 15 })
      positions.push({ x: centerX - 12, y: centerY - 5 })
      positions.push({ x: centerX + 12, y: centerY - 5 })
      positions.push({ x: centerX - 8, y: centerY + 12 })
      positions.push({ x: centerX + 8, y: centerY + 12 })
    } else if (numStars === 6) {
      positions.push({ x: centerX - 12, y: centerY - 12 })
      positions.push({ x: centerX + 12, y: centerY - 12 })
      positions.push({ x: centerX - 15, y: centerY })
      positions.push({ x: centerX + 15, y: centerY })
      positions.push({ x: centerX - 12, y: centerY + 12 })
      positions.push({ x: centerX + 12, y: centerY + 12 })
    } else if (numStars === 7) {
      positions.push({ x: centerX, y: centerY - 15 })
      positions.push({ x: centerX - 12, y: centerY - 8 })
      positions.push({ x: centerX + 12, y: centerY - 8 })
      positions.push({ x: centerX, y: centerY })
      positions.push({ x: centerX - 12, y: centerY + 8 })
      positions.push({ x: centerX + 12, y: centerY + 8 })
      positions.push({ x: centerX, y: centerY + 15 })
    }

    return positions
  }

  const starPositions = getStarPositions(stars)

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
        y: -100,
        rotateY: 180,
      }}
      animate={
        ballsScattering
          ? {
              opacity: 0,
              scale: 0.5,
              x: (Math.random() - 0.5) * 1000,
              y: (Math.random() - 0.5) * 1000,
              rotate: Math.random() * 720,
            }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              rotateY: 0,
            }
      }
      transition={
        ballsScattering
          ? {
              duration: 2,
              delay: index * 0.1,
              ease: "easeOut",
            }
          : {
              delay: index * 0.4,
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }
      }
      className="relative group"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-orange-400 blur-xl opacity-60"
        animate={
          ballsScattering
            ? {
                opacity: 0,
                scale: 2,
              }
            : {
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }
        }
        transition={
          ballsScattering
            ? {
                duration: 1.5,
                delay: index * 0.1,
              }
            : {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }
        }
      />

      {/* Dragon Ball SVG */}
      <div className="relative w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-2xl">
          {/* Gradient definitions */}
          <defs>
            <radialGradient id={`ballGradient${index}`} cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
            <radialGradient id={`starGradient${index}`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
            <filter id={`shadow${index}`}>
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Main sphere */}
          <circle
            cx="40"
            cy="40"
            r="38"
            fill={`url(#ballGradient${index})`}
            stroke="#f59e0b"
            strokeWidth="2"
            filter={`url(#shadow${index})`}
          />

          {/* Highlight */}
          <ellipse cx="32" cy="28" rx="12" ry="8" fill="#fef3c7" opacity="0.6" />

          {/* Stars */}
          {starPositions.map((pos, starIndex) => (
            <g key={starIndex}>
              {/* Star shape */}
              <path
                d={`M ${pos.x} ${pos.y - 6} 
                   L ${pos.x + 2} ${pos.y - 2} 
                   L ${pos.x + 6} ${pos.y - 2} 
                   L ${pos.x + 3} ${pos.y + 1} 
                   L ${pos.x + 4} ${pos.y + 5} 
                   L ${pos.x} ${pos.y + 3} 
                   L ${pos.x - 4} ${pos.y + 5} 
                   L ${pos.x - 3} ${pos.y + 1} 
                   L ${pos.x - 6} ${pos.y - 2} 
                   L ${pos.x - 2} ${pos.y - 2} Z`}
                fill={`url(#starGradient${index})`}
                stroke="#7f1d1d"
                strokeWidth="0.5"
              />
              {/* Star highlight */}
              <circle cx={pos.x} cy={pos.y - 1} r="1" fill="#fca5a5" opacity="0.8" />
            </g>
          ))}

          {/* Additional shine effect */}
          <circle cx="40" cy="40" r="38" fill="none" stroke="url(#ballGradient0)" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* Animated glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-orange-300"
          animate={
            ballsScattering
              ? {
                  opacity: 0,
                  scale: 2,
                }
              : {
                  opacity: [0, 0.8, 0],
                  scale: [1, 1.1, 1],
                }
          }
          transition={
            ballsScattering
              ? {
                  duration: 1,
                }
              : {
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.3,
                }
          }
        />
      </div>
    </motion.div>
  )
}

function ShenronAnimation() {
  const audioRef = useRef(null)
  const pedirDeseoRef = useRef(null)
  const waitTimeRef = useRef(null)
  const finalVozRef = useRef(null)

  const [started, setStarted] = useState(false)
  const [showShenron, setShowShenron] = useState(false)
  const [showLightning, setShowLightning] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showWishForm, setShowWishForm] = useState(false)
  const [selectedWish, setSelectedWish] = useState("")
  const [wishGranted, setWishGranted] = useState(false)
  const [shenronDisappearing, setShenronDisappearing] = useState(false)
  const [ballsScattering, setBallsScattering] = useState(false)

  // Opciones de deseos predefinidas
  const wishOptions = [
    {
      id: "immortality",
      text: "🌟 Quiero ser inmortal",
      response: "Tu deseo de inmortalidad ha sido concedido. ¡Ahora vivirás para siempre!",
    },
    {
      id: "power",
      text: "💪 Quiero un poder increíble",
      response: "Has recibido un poder más allá de tu imaginación. ¡Úsalo sabiamente!",
    },
    {
      id: "wealth",
      text: "💰 Quiero riquezas infinitas",
      response: "Las riquezas del mundo ahora son tuyas. ¡Que las uses con sabiduría!",
    },
    {
      id: "knowledge",
      text: "🧠 Quiero conocimiento supremo",
      response: "El conocimiento del universo fluye ahora por tu mente. ¡Úsalo bien!",
    },
    {
      id: "peace",
      text: "🕊️ Quiero paz mundial",
      response: "La paz reinará en la Tierra. Tu noble corazón ha sido recompensado.",
    },
    {
      id: "youth",
      text: "⏰ Quiero recuperar mi juventud",
      response: "Tu juventud ha sido restaurada. ¡Disfruta de tu nueva vitalidad!",
    },
  ]

  // Función para detener todos los audios
  const stopAllAudios = () => {
    ;[pedirDeseoRef, waitTimeRef, finalVozRef].forEach((ref) => {
      if (ref.current) {
        ref.current.pause()
        ref.current.currentTime = 0
      }
    })
  }

  useEffect(() => {
    if (started && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("El navegador bloqueó la reproducción automática:", err)
      })
    }
  }, [started])

  // Reproducir pedir_deseo.mp3 cuando aparezca Shenron
  useEffect(() => {
    if (showShenron && pedirDeseoRef.current && !shenronDisappearing) {
      // Pequeño delay para que coincida con la aparición visual
      setTimeout(() => {
        pedirDeseoRef.current.play().catch((err) => {
          console.warn("Error reproduciendo pedir_deseo.mp3:", err)
        })
      }, 1000)
    } else if (shenronDisappearing) {
      stopAllAudios()
    }
  }, [showShenron, shenronDisappearing])

  // Reproducir wait_time.mp3 cuando se abra la wishlist
  useEffect(() => {
    if (showWishForm && waitTimeRef.current) {
      waitTimeRef.current.play().catch((err) => {
        console.warn("Error reproduciendo wait_time.mp3:", err)
      })
    }
  }, [showWishForm])

  const startSummoning = () => {
    setStarted(true)
    setTimeout(() => setShowLightning(true), 2000)
    setTimeout(() => setShowParticles(true), 2500)
    setTimeout(() => setShowShenron(true), 3000)
    setTimeout(() => setShowWishForm(true), 6000)
  }

  const grantWish = () => {
    if (!selectedWish) return

    // Detener el audio de wait_time y reproducir final_voz
    if (waitTimeRef.current) {
      waitTimeRef.current.pause()
      waitTimeRef.current.currentTime = 0
    }

    if (finalVozRef.current) {
      finalVozRef.current.play().catch((err) => {
        console.warn("Error reproduciendo final_voz.mp3:", err)
      })
    }

    setWishGranted(true)
    setShowWishForm(false)

    // Secuencia de desaparición
    setTimeout(() => {
      setShenronDisappearing(true)
    }, 7000)

    setTimeout(() => {
      setBallsScattering(true)
      setShowShenron(false)
    }, 5000)

    // Reset completo después de la animación
    setTimeout(() => {
      resetAnimation()
    }, 8000)
  }

  const resetAnimation = () => {
    stopAllAudios()
    setStarted(false)
    setShowShenron(false)
    setShowLightning(false)
    setShowParticles(false)
    setShowWishForm(false)
    setSelectedWish("")
    setWishGranted(false)
    setShenronDisappearing(false)
    setBallsScattering(false)
  }

  const selectedWishData = wishOptions.find((wish) => wish.id === selectedWish)

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
  }))

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-green-900/10 to-transparent opacity-50" />

      {/* Audio elements */}
      <audio ref={audioRef} src="/summing_shenron.mp3" preload="auto" />
      <audio ref={pedirDeseoRef} src="/pedir_deseo.mp3" preload="auto" />
      <audio ref={waitTimeRef} src="/wait_time.mp3" preload="auto" />
      <audio ref={finalVozRef} src="/final_voz.mp3" preload="auto" />

      {/* Lightning effects */}
      <AnimatePresence>
        {showLightning && !shenronDisappearing && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0, 1, 0],
                  scale: [1, 1.1, 1, 1.05, 1],
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.1,
                  repeat: 3,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating particles */}
      <AnimatePresence>
        {showParticles &&
          !shenronDisappearing &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                y: 50,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1.5, 0],
                y: [50, -20, -50, -100],
                x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            />
          ))}
      </AnimatePresence>

      {/* Summon button */}
      {!started && (
        <motion.button
          onClick={startSummoning}
          className="mb-10 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-xl shadow-2xl shadow-yellow-500/30 transition-all transform hover:scale-105 border-2 border-yellow-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">🔮 Invocar a Shenron</span>
        </motion.button>
      )}

      {/* Dragon Balls with custom SVG design */}
      {started && (
        <div className="flex flex-wrap justify-center gap-6 mb-16 relative z-10">
          {[1, 2, 3, 4, 5, 6, 7].map((stars, i) => (
            <DragonBall key={i} stars={stars} index={i} ballsScattering={ballsScattering} />
          ))}
        </div>
      )}

      {/* Shenron with dramatic entrance and exit */}
      <AnimatePresence>
        {showShenron && (
          <motion.div
            className="relative w-full max-w-4xl"
            exit={
              shenronDisappearing
                ? {
                    opacity: 0,
                    scale: 0.3,
                    y: -200,
                    rotateX: 90,
                    filter: "brightness(2)",
                  }
                : {}
            }
            transition={
              shenronDisappearing
                ? {
                    duration: 2,
                    ease: "easeIn",
                  }
                : {}
            }
          >
            {/* Dramatic background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-green-500/30 via-green-600/20 to-transparent rounded-3xl blur-3xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                shenronDisappearing
                  ? {
                      opacity: 0,
                      scale: 4,
                    }
                  : {
                      opacity: 1,
                      scale: 2,
                    }
              }
              transition={
                shenronDisappearing
                  ? {
                      duration: 2,
                    }
                  : {
                      duration: 2,
                    }
              }
            />

            {/* Lightning strikes around Shenron */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-gradient-to-b from-yellow-300 to-transparent"
                style={{
                  height: "200px",
                  left: `${10 + i * 10}%`,
                  top: "-50px",
                  transform: `rotate(${Math.random() * 30 - 15}deg)`,
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={
                  shenronDisappearing
                    ? {
                        opacity: 0,
                        scaleY: 0,
                      }
                    : {
                        opacity: [0, 1, 0],
                        scaleY: [0, 1, 0],
                      }
                }
                transition={
                  shenronDisappearing
                    ? {
                        duration: 0.5,
                      }
                    : {
                        duration: 0.2,
                        delay: 1 + i * 0.1,
                        repeat: 2,
                        repeatDelay: 0.5,
                      }
                }
              />
            ))}

            {/* Shenron image with enhanced effects */}
            <motion.div
              className="relative z-10"
              initial={{
                opacity: 0,
                scale: 0.3,
                y: 100,
                filter: "brightness(0)",
              }}
              animate={
                shenronDisappearing
                  ? {
                      opacity: 0,
                      scale: 0.1,
                      y: -300,
                      rotateZ: 180,
                      filter: "brightness(3)",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: "brightness(1)",
                    }
              }
              transition={
                shenronDisappearing
                  ? {
                      duration: 2.5,
                      ease: "easeIn",
                    }
                  : {
                      duration: 2.5,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }
              }
            >
              <img
                src="/shenron.jpeg"
                alt="Shenron"
                className="w-full drop-shadow-2xl rounded-2xl border-4 border-green-400/30"
              />

              {/* Glowing eyes effect */}
              <motion.div
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-red-500 rounded-full blur-lg opacity-80"
                animate={
                  shenronDisappearing
                    ? {
                        opacity: 0,
                        scale: 0,
                      }
                    : {
                        opacity: [0.8, 1, 0.8],
                        scale: [1, 1.1, 1],
                      }
                }
                transition={
                  shenronDisappearing
                    ? {
                        duration: 1,
                      }
                    : {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }
                }
              />
            </motion.div>

            {/* Energy aura around Shenron */}
            <motion.div
              className="absolute inset-0 border-4 border-green-400 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={
                shenronDisappearing
                  ? {
                      opacity: 0,
                      scale: 2,
                    }
                  : {
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.05, 1],
                    }
              }
              transition={
                shenronDisappearing
                  ? {
                      duration: 1.5,
                    }
                  : {
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 2,
                    }
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wish Form */}
      <AnimatePresence>
        {showWishForm && !wishGranted && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-400 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-green-400/30"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -100 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.h2
                className="text-3xl font-bold text-green-400 text-center mb-8 bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34, 197, 94, 0.5)",
                    "0 0 40px rgba(34, 197, 94, 0.8)",
                    "0 0 20px rgba(34, 197, 94, 0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                Elige tu deseo
              </motion.h2>

              <div className="space-y-4 mb-8">
                {wishOptions.map((wish, index) => (
                  <motion.button
                    key={wish.id}
                    onClick={() => setSelectedWish(wish.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedWish === wish.id
                        ? "border-green-400 bg-green-400/20 text-green-300"
                        : "border-gray-600 bg-gray-800 text-gray-300 hover:border-green-500 hover:bg-green-500/10"
                    }`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-medium">{wish.text}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={grantWish}
                  disabled={!selectedWish}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg shadow-lg transition-all disabled:cursor-not-allowed"
                  whileHover={selectedWish ? { scale: 1.05 } : {}}
                  whileTap={selectedWish ? { scale: 0.95 } : {}}
                >
                  ✨ Conceder Deseo
                </motion.button>

                <motion.button
                  onClick={resetAnimation}
                  className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ❌ Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wish Granted Message */}
      <AnimatePresence>
        {wishGranted && selectedWishData && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-yellow-900 to-orange-900 border-4 border-yellow-400 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-yellow-400/30 text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                ✨
              </motion.div>

              <motion.h2
                className="text-4xl font-bold text-yellow-400 mb-6"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                    "0 0 40px rgba(251, 191, 36, 0.8)",
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                ¡Deseo Concedido!
              </motion.h2>

              <motion.p
                className="text-xl text-yellow-200 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {selectedWishData.response}
              </motion.p>

              <motion.div
                className="mt-8 text-sm text-yellow-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Shenron regresará a su sueño eterno...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced final text */}
      <AnimatePresence>
        {showShenron && !showWishForm && !wishGranted && (
          <motion.div
            className="relative mt-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-green-400 blur-2xl opacity-30 rounded-lg"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />

            <motion.p
              className="relative text-green-400 text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent drop-shadow-2xl"
              animate={{
                textShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 40px rgba(34, 197, 94, 0.8)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              ¡Dime tu deseo!
            </motion.p>

            {/* Sparkle effects around text */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3 + 4,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset button after everything is done */}
      <AnimatePresence>
        {ballsScattering && (
          <motion.button
            onClick={resetAnimation}
            className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-2xl shadow-blue-500/30 transition-all z-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🔄 Invocar de Nuevo
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShenronAnimation
