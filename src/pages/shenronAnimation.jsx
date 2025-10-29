"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ShenronWishForm from "../components/shenronWishForm"
import { getEstadoInvocacion, modificarEstadoInvocacion } from "../api-gateway/invocar.js"
import { useAuth } from "../context/AuthContext.jsx"

const DragonRadar = ({ onDetectionComplete }) => {
  const [detectedBalls, setDetectedBalls] = useState([])
  const [scanAngle, setScanAngle] = useState(0)
  const hasStartedRef = useRef(false)

  const radarBlips = [
    { angle: 30, distance: 60, stars: 1 },
    { angle: 80, distance: 75, stars: 2 },
    { angle: 140, distance: 45, stars: 3 },
    { angle: 190, distance: 80, stars: 4 },
    { angle: 230, distance: 50, stars: 5 },
    { angle: 280, distance: 70, stars: 6 },
    { angle: 330, distance: 55, stars: 7 },
  ]

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    radarBlips.forEach((blip, index) => {
      setTimeout(() => {
        setDetectedBalls((prev) => [...prev, blip])
      }, index * 400)
    })
    setTimeout(
      () => {
        onDetectionComplete(radarBlips)
      },
      radarBlips.length * 400 + 800,
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 3) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="relative w-80 h-80 bg-gradient-to-br from-green-700 via-green-800 to-green-950 rounded-full border-8 border-gray-300 shadow-2xl shadow-green-500/50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1, type: "spring" }}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gray-400/40"
            style={{ left: `${(i + 1) * 11.11}%` }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-gray-400/40"
            style={{ top: `${(i + 1) * 11.11}%` }}
          />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`circle-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-400/30 rounded-full"
            style={{ width: `${i * 25}%`, height: `${i * 25}%` }}
          />
        ))}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300/50" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300/50" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-3 h-3 bg-red-600 rounded-full"
          style={{ filter: "drop-shadow(0 0 6px rgba(220, 38, 38, 1))" }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <motion.div
        className="absolute top-1/2 left-1/2 w-full h-1 origin-left"
        style={{
          background: "linear-gradient(to right, rgba(34, 197, 94, 0.9), transparent)",
          transform: `translate(-50%, -50%) rotate(${scanAngle}deg)`,
        }}
      />

      {detectedBalls.map((blip, index) => {
        const x = Math.cos((blip.angle * Math.PI) / 180) * blip.distance
        const y = Math.sin((blip.angle * Math.PI) / 180) * blip.distance
        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-4 h-4 bg-red-600 rounded-full shadow-lg shadow-red-600/80"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        )
      })}

      <div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-green-400 font-black uppercase tracking-widest text-sm"
        style={{
          textShadow:
            "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 10px rgba(34, 197, 94, 0.5)",
        }}
      >
        Dragon Radar
      </div>
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-gray-300 text-xs font-bold">
        {detectedBalls.length}/7 Detectadas
      </div>
    </motion.div>
  )
}

const DragonBall = ({ stars, index, ballsColliding, ballsRising, collisionComplete }) => {
  const getStarPositions = (numStars) => {
    const positions = []
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

  const getInitialPosition = () => {
    const directions = [
      { x: 0, y: -800 },
      { x: 800, y: -600 },
      { x: 800, y: 0 },
      { x: 800, y: 600 },
      { x: 0, y: 800 },
      { x: -800, y: 600 },
      { x: -800, y: 0 },
    ]
    return directions[index] || { x: 0, y: -800 }
  }

  const getCircularPosition = () => {
    const spacing = 120
    const totalWidth = spacing * 6
    const startX = -totalWidth / 2
    return { x: startX + index * spacing, y: 0 }
  }

  const initialPos = getInitialPosition()
  const circularPos = getCircularPosition()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, x: initialPos.x, y: initialPos.y, rotate: 0 }}
      animate={
        ballsRising
          ? { opacity: 1, scale: 1.1, x: circularPos.x, y: circularPos.y - 180, rotate: 720 }
          : ballsColliding
            ? { opacity: 1, scale: 1, x: circularPos.x, y: circularPos.y, rotate: 360 + index * 45 }
            : collisionComplete
              ? { opacity: 0, scale: 0 }
              : { opacity: 1, scale: 1, x: circularPos.x, y: circularPos.y, rotate: 1080 + index * 90 }
      }
      transition={
        ballsRising
          ? { duration: 2.5, delay: 0, ease: [0.22, 1, 0.36, 1] }
          : ballsColliding
            ? { duration: 2.2, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }
            : collisionComplete
              ? { duration: 0.4, delay: 0, ease: "easeIn" }
              : { delay: index * 0.18, duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }
      }
      className="relative group"
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-orange-400 blur-2xl"
        animate={
          ballsRising
            ? { opacity: [0.8, 1, 0.8], scale: [1.8, 2.5, 1.8] }
            : ballsColliding
              ? { opacity: [0.7, 1, 0.9], scale: [1.2, 3, 2.5] }
              : collisionComplete
                ? { opacity: 0, scale: 0 }
                : { scale: [1.2, 1.6, 1.2], opacity: [0.7, 1, 0.7] }
        }
        transition={
          ballsRising
            ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            : ballsColliding
              ? { duration: 1.8, delay: index * 0.1, ease: "easeOut" }
              : collisionComplete
                ? { duration: 0.4 }
                : { duration: 1.8, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2, ease: "easeInOut" }
        }
      />

      {(ballsColliding || !collisionComplete) && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-transparent blur-xl"
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.5, 2], x: [-20, 0, 20] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
        />
      )}

      <div className="relative w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-2xl">
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
          <circle
            cx="40"
            cy="40"
            r="38"
            fill={`url(#ballGradient${index})`}
            stroke="#f59e0b"
            strokeWidth="2"
            filter={`url(#shadow${index})`}
          />
          <ellipse cx="32" cy="28" rx="12" ry="8" fill="#fef3c7" opacity="0.6" />
          {starPositions.map((pos, starIndex) => (
            <g key={starIndex}>
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
              <circle cx={pos.x} cy={pos.y - 1} r="1" fill="#fca5a5" opacity="0.8" />
            </g>
          ))}
          <circle cx="40" cy="40" r="38" fill="none" stroke="url(#ballGradient0)" strokeWidth="1" opacity="0.3" />
        </svg>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-orange-300"
          animate={
            ballsRising
              ? { opacity: [0, 1, 0], scale: [1, 1.4, 1.6] }
              : ballsColliding
                ? { opacity: [0, 1, 0.8], scale: [1, 1.6, 1.3] }
                : collisionComplete
                  ? { opacity: 0, scale: 0 }
                  : { opacity: [0, 0.9, 0], scale: [1, 1.3, 1] }
          }
          transition={
            ballsRising
              ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              : ballsColliding
                ? { duration: 1.5, delay: index * 0.1, ease: "easeOut" }
                : collisionComplete
                  ? { duration: 0.4 }
                  : { duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3, ease: "easeInOut" }
          }
        />
      </div>
    </motion.div>
  )
}

const useTimeoutBucket = () => {
  const bucketRef = useRef([])
  const add = (id) => bucketRef.current.push(id)
  const clearAll = () => {
    bucketRef.current.forEach(clearTimeout)
    bucketRef.current = []
  }
  return { add, clearAll }
}

function ShenronAnimation() {
  const { user, loading } = useAuth()
  const audioRef = useRef(null)
  const pedirDeseoRef = useRef(null)
  const waitTimeRef = useRef(null)
  const finalVozRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [showRadar, setShowRadar] = useState(false)
  const [radarComplete, setRadarComplete] = useState(false)
  const [ballsColliding, setBallsColliding] = useState(false)
  const [ballsRising, setBallsRising] = useState(false)
  const [collisionComplete, setCollisionComplete] = useState(false)
  const [showLightBurst, setShowLightBurst] = useState(false)
  const [showShenron, setShowShenron] = useState(false)
  const [showLightning, setShowLightning] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showWishForm, setShowWishForm] = useState(false)
  const [wishGranted, setWishGranted] = useState(false)
  const [shenronDisappearing, setShenronDisappearing] = useState(false)
  const [ballsScattering, setBallsScattering] = useState(false)
  const [radarBallPositions, setRadarBallPositions] = useState([])
  const [grantedPromo, setGrantedPromo] = useState(null)
  const [showDarkening, setShowDarkening] = useState(false)
  const [canInvoke, setCanInvoke] = useState(false)
  const [checkingInvoke, setCheckingInvoke] = useState(false)
  const [invokeMsg, setInvokeMsg] = useState("")
  const { add: addTimeout, clearAll: clearAllTimeouts } = useTimeoutBucket()

  useEffect(() => {
    return () => {
      stopAllAudios()
      clearAllTimeouts()
    }
  }, [])

  useEffect(() => {
    const fetchInvoke = async () => {
      if (!user?.id) {
        setCanInvoke(false)
        setInvokeMsg("Inicia sesión para invocar.")
        return
      }
      setCheckingInvoke(true)
      setInvokeMsg("")
      const resp = await getEstadoInvocacion({ usuarioId: user.id })
      if (resp?.success && resp?.data?.data) {
        const inv = Boolean(resp.data.data.invocar)
        setCanInvoke(inv)
        setInvokeMsg(inv ? "Invocación disponible." : "Invocación no disponible.")
      } else {
        setCanInvoke(false)
        setInvokeMsg(resp?.error || "No se pudo verificar la invocación.")
      }
      setCheckingInvoke(false)
    }
    fetchInvoke()
  }, [user?.id])

  const handleGranted = async (result) => {
    setGrantedPromo(result)
    if (waitTimeRef.current) {
      waitTimeRef.current.pause()
      waitTimeRef.current.currentTime = 0
    }
    if (finalVozRef.current) {
      finalVozRef.current.play().catch(() => {})
    }
    setWishGranted(true)
    setShowWishForm(false)
    if (user?.id) {
      await modificarEstadoInvocacion({
        usuarioId: user.id,
        data: { invocar: false },
      })
      setCanInvoke(false)
      setInvokeMsg("Invocación consumida")
    }
    addTimeout(setTimeout(() => setShenronDisappearing(true), 7000))
    addTimeout(
      setTimeout(() => {
        setBallsScattering(true)
        setShowShenron(false)
      }, 5000),
    )
    addTimeout(
      setTimeout(() => {
        resetAnimation()
      }, 8000),
    )
  }

  const stopAllAudios = () => {
    ;[pedirDeseoRef, waitTimeRef, finalVozRef].forEach((ref) => {
      if (ref.current) {
        ref.current.pause()
        ref.current.currentTime = 0
      }
    })
  }

  useEffect(() => {
    if (showShenron && pedirDeseoRef.current && !shenronDisappearing) {
      addTimeout(
        setTimeout(() => {
          pedirDeseoRef.current.play().catch(() => {})
        }, 1000),
      )
    } else if (shenronDisappearing) {
      stopAllAudios()
    }
  }, [showShenron, shenronDisappearing])

  useEffect(() => {
    if (showWishForm && waitTimeRef.current) {
      waitTimeRef.current.play().catch(() => {})
    }
  }, [showWishForm])

  const startSummoning = async () => {
    if (loading || checkingInvoke) return
    if (!user?.id) {
      setInvokeMsg("Inicia sesión para invocar.")
      return
    }
    try {
      const resp = await getEstadoInvocacion({ usuarioId: user.id })
      const inv = resp?.success && resp?.data?.data ? Boolean(resp.data.data.invocar) : false
      if (!inv) {
        setCanInvoke(false)
        setInvokeMsg(resp?.error || "Tu invocación no está disponible.")
        return
      }
      setCanInvoke(true)
      setInvokeMsg("Invocación disponible.")
    } catch {
      setCanInvoke(false)
      setInvokeMsg("No se pudo verificar la invocación.")
      return
    }
    setStarted(true)
    setShowRadar(true)
  }

  const handleRadarComplete = (radarBlips) => {
    setRadarBallPositions(radarBlips)
    setRadarComplete(true)
    setShowRadar(false)

    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    addTimeout(setTimeout(() => setBallsColliding(true), 1500))
    addTimeout(setTimeout(() => setShowDarkening(true), 2800))
    addTimeout(
      setTimeout(() => {
        setBallsColliding(false)
        setBallsRising(true)
      }, 4200),
    )
    addTimeout(
      setTimeout(() => {
        setCollisionComplete(true)
        setShowLightBurst(true)
      }, 6200),
    )
    addTimeout(setTimeout(() => setShowLightBurst(false), 7200))
    addTimeout(setTimeout(() => setShowLightning(true), 6700))
    addTimeout(setTimeout(() => setShowParticles(true), 7200))

    addTimeout(
      setTimeout(async () => {
        if (!user?.id) return
        const resp = await getEstadoInvocacion({ usuarioId: user.id })
        const inv = resp?.success && resp?.data?.data ? Boolean(resp.data.data.invocar) : false
        setCanInvoke(inv)
        if (!inv) {
          setInvokeMsg("Tu invocación fue deshabilitada antes del deseo.")
          return
        }
        setShowShenron(true)
        addTimeout(
          setTimeout(() => {
            if (inv) setShowWishForm(true)
          }, 3000),
        )
      }, 7700),
    )
  }

  const resetAnimation = () => {
    stopAllAudios()
    clearAllTimeouts()
    setStarted(false)
    setShowRadar(false)
    setRadarComplete(false)
    setBallsColliding(false)
    setBallsRising(false)
    setCollisionComplete(false)
    setShowLightBurst(false)
    setShowShenron(false)
    setShowLightning(false)
    setShowParticles(false)
    setShowWishForm(false)
    setWishGranted(false)
    setShenronDisappearing(false)
    setBallsScattering(false)
    setShowDarkening(false)
  }

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
  }))

  return (
    <div className="bg-gradient-to-b from-black via-orange-950/30 to-black min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Number.POSITIVE_INFINITY, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/20 to-black opacity-80" />

      <AnimatePresence>
        {showDarkening && !shenronDisappearing && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="fixed inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-32 bg-gradient-to-b from-gray-900/60 to-transparent blur-xl"
                  style={{ top: `${i * 15}%` }}
                  animate={{ x: ["-100%", "100%"], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 8 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              ))}
            </motion.div>
            <motion.div
              className="fixed inset-0 z-20"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(249,115,22,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(249,115,22,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(249,115,22,0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="/summing_shenron.mp3" preload="auto" />
      <audio ref={pedirDeseoRef} src="/pedir_deseo.mp3" preload="auto" />
      <audio ref={waitTimeRef} src="/wait_time.mp3" preload="auto" />
      <audio ref={finalVozRef} src="/final_voz.mp3" preload="auto" />

      <AnimatePresence>
        {showRadar && (
          <div className="relative z-20">
            <DragonRadar onDetectionComplete={handleRadarComplete} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLightBurst && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-400 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 50, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 origin-left w-screen h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-transparent"
                style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg)` }}
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(254, 215, 170, 1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLightning && !shenronDisappearing && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 bg-gradient-to-b from-orange-400/20 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0], scale: [1, 1.1, 1, 1.05, 1] }}
                transition={{ duration: 0.3, delay: i * 0.1, repeat: 3 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showParticles &&
          !shenronDisappearing &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"
              style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              initial={{ opacity: 0, scale: 0, y: 50 }}
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

      {!started && (
        <>
          <div className="mb-3 text-sm font-semibold text-orange-300">
            {checkingInvoke
              ? "Verificando invocación..."
              : invokeMsg || (!user?.id ? "Inicia sesión para invocar." : "")}
          </div>

          <motion.div
            className="mb-10 relative z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.button
              onClick={startSummoning}
              disabled={loading || checkingInvoke || !user?.id || !canInvoke}
              className={`relative px-16 py-6 text-white font-black uppercase text-2xl tracking-widest border-4 transition-all duration-300 shadow-2xl
                ${loading || checkingInvoke || !user?.id || !canInvoke ? "bg-gray-600 border-gray-500 cursor-not-allowed" : "bg-gradient-to-b from-orange-500 to-orange-600 border-orange-400 hover:from-orange-400 hover:to-orange-500"}`}
              style={{
                textShadow:
                  "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 20px rgba(251, 146, 60, 0.8)",
                boxShadow: "0 0 30px rgba(251, 146, 60, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)",
              }}
              whileHover={loading || checkingInvoke || !user?.id || !canInvoke ? {} : { scale: 1.05 }}
              whileTap={loading || checkingInvoke || !user?.id || !canInvoke ? {} : { scale: 0.95 }}
            >
              <span className="relative z-10">
                {checkingInvoke
                  ? "Verificando..."
                  : !user?.id
                    ? "Inicia sesión"
                    : loading
                      ? "Cargando..."
                      : canInvoke
                        ? "Invocar a Shenron"
                        : "Invocación no disponible"}
              </span>

              {user?.id && canInvoke && !checkingInvoke && !loading && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-orange-300"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </>
              )}
            </motion.button>
          </motion.div>
        </>
      )}

      {radarComplete && (
        <div className="flex flex-wrap justify-center gap-6 mb-16 relative z-10">
          {[1, 2, 3, 4, 5, 6, 7].map((stars, i) => (
            <DragonBall
              key={i}
              stars={stars}
              index={i}
              ballsColliding={ballsColliding}
              ballsRising={ballsRising}
              collisionComplete={collisionComplete}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showShenron && (
          <motion.div
            className="relative w-full max-w-4xl z-10"
            exit={shenronDisappearing ? { opacity: 0, scale: 0.3, y: -200, rotateX: 90, filter: "brightness(2)" } : {}}
            transition={shenronDisappearing ? { duration: 2, ease: "easeIn" } : {}}
          >
            <motion.div
              className="absolute inset-0 rounded-3xl blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(249,115,22,0.3), rgba(234,88,12,0.2), transparent)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={shenronDisappearing ? { opacity: 0, scale: 4 } : { opacity: 1, scale: 2 }}
              transition={{ duration: 2 }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-gradient-to-b from-orange-300 to-transparent"
                style={{
                  height: "200px",
                  left: `${10 + i * 10}%`,
                  top: "-50px",
                  transform: `rotate(${Math.random() * 30 - 15}deg)`,
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={shenronDisappearing ? { opacity: 0, scaleY: 0 } : { opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                transition={
                  shenronDisappearing
                    ? { duration: 0.5 }
                    : { duration: 0.2, delay: 1 + i * 0.1, repeat: 2, repeatDelay: 0.5 }
                }
              />
            ))}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.3, y: 100, filter: "brightness(0)" }}
              animate={
                shenronDisappearing
                  ? { opacity: 0, scale: 0.1, y: -300, rotateZ: 180, filter: "brightness(3)" }
                  : { opacity: 1, scale: 1, y: 0, filter: "brightness(1)" }
              }
              transition={
                shenronDisappearing
                  ? { duration: 2.5, ease: "easeIn" }
                  : { duration: 2.5, type: "spring", stiffness: 100, damping: 15 }
              }
            >
              <img src="/shenron.webp" alt="Shenron" className="w-full drop-shadow-2xl" />
              <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-8 bg-red-500 rounded-full blur-lg opacity-80"
                animate={
                  shenronDisappearing ? { opacity: 0, scale: 0 } : { opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }
                }
                transition={shenronDisappearing ? { duration: 1 } : { duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShenronWishForm
        usuarioId={user?.id ?? null}
        open={showWishForm && !wishGranted && canInvoke}
        onGranted={handleGranted}
        onCancel={() => setShowWishForm(false)}
      />

      <AnimatePresence>
        {wishGranted && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-b from-orange-950 to-black border-8 border-orange-500 p-12 max-w-2xl w-full text-center relative overflow-hidden"
              style={{ boxShadow: "0 0 60px rgba(251,146,60,.7), inset 0 0 40px rgba(251,146,60,.2)" }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <h2
                className="text-6xl font-black text-orange-400 mb-6 uppercase tracking-widest relative z-10"
                style={{
                  textShadow:
                    "5px 5px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 30px rgba(251,146,60,1)",
                }}
              >
                Deseo Concedido
              </h2>

              {grantedPromo ? (
                <div
                  className="text-xl text-orange-200 leading-relaxed font-bold relative z-10 space-y-2"
                  style={{ textShadow: "2px 2px 0 #000" }}
                >
                  <div>
                    Tipo promo: <span className="text-orange-400">{grantedPromo.promocion?.tipo ?? "—"}</span>
                  </div>
                  {grantedPromo.promocion?.porcentaje != null && (
                    <div>
                      Porcentaje: <span className="text-orange-400">{Number(grantedPromo.promocion.porcentaje)}%</span>
                    </div>
                  )}
                  {grantedPromo.promocion?.expiraEl && (
                    <div>
                      Vigente hasta:{" "}
                      <span className="text-orange-400">
                        {new Date(grantedPromo.promocion.expiraEl).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div>
                    Deseo ID: <span className="text-orange-400">{grantedPromo.deseo?.id ?? "—"}</span>
                  </div>
                </div>
              ) : (
                <p
                  className="text-xl text-orange-200 leading-relaxed font-bold relative z-10"
                  style={{ textShadow: "2px 2px 0 #000" }}
                >
                  ¡Concedido!
                </p>
              )}

              <motion.div
                className="mt-8 text-sm text-orange-400 uppercase tracking-widest font-bold relative z-10"
                style={{ textShadow: "1px 1px 0 #000" }}
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

      <AnimatePresence>
        {showShenron && !showWishForm && !wishGranted && (
          <motion.div
            className="relative mt-12 text-center z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1.5 }}
          >
            <motion.p
              className="relative text-orange-400 text-5xl md:text-7xl font-black uppercase tracking-widest"
              style={{
                textShadow:
                  "6px 6px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 0 40px rgba(251, 146, 60, 1), 0 0 80px rgba(251, 146, 60, 0.5)",
              }}
              animate={{
                textShadow: [
                  "6px 6px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 0 40px rgba(251, 146, 60, 1), 0 0 80px rgba(251, 146, 60, 0.5)",
                  "6px 6px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 0 60px rgba(251, 146, 60, 1), 0 0 100px rgba(251, 146, 60, 0.7)",
                  "6px 6px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 0 40px rgba(251, 146, 60, 1), 0 0 80px rgba(251, 146, 60, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Dime tu deseo
            </motion.p>
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{
                boxShadow: [
                  "0 0 40px rgba(251, 146, 60, 0.3)",
                  "0 0 80px rgba(251, 146, 60, 0.5)",
                  "0 0 40px rgba(251, 146, 60, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ballsScattering && (
          <motion.div
            className="fixed bottom-8 right-8 px-8 py-4 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-black uppercase tracking-widest border-4 border-orange-400 hover:from-orange-400 hover:to-orange-500 transition-all z-50"
            style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000", boxShadow: "0 0 30px rgba(251, 146, 60, 0.5)" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3 }}
          >
            Invocar de Nuevo
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
