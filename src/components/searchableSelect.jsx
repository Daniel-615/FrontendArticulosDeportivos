"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Check, Search, X } from "lucide-react"

export default function SearchableSelect({
  value,
  onChange,
  options = [],            // [{ value, label }]
  placeholder = "Selecciona...",
  label = "",
  required = false,
  error = "",
  className = "",
  buttonClassName = "",
  listClassName = "",
  clearable = true,        // permite limpiar el valor
  maxListHeight = 256,     // px (coincide con max-h-64)
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(-1)
  const [dropUp, setDropUp] = useState(false) // abre hacia arriba si no hay espacio
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value)) || null,
    [options, value]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  // ---- posicionamiento (flip up si no hay espacio)
  useEffect(() => {
    if (!open) return
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const needsUp = spaceBelow < maxListHeight && spaceAbove > spaceBelow
    setDropUp(needsUp)
  }, [open, maxListHeight])

  // ---- foco & estado al abrir/cerrar
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
      // primer elemento activo
      setActiveIndex(filtered.length ? 0 : -1)
    } else {
      setQuery("")
      setActiveIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // ---- click fuera para cerrar
  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  // ---- teclado
  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
      e.preventDefault() // evita “scroll bleed”
    }

    if (e.key === "Escape") {
      setOpen(false)
      btnRef.current?.focus()
      return
    }

    if (e.key === "ArrowDown") {
      setActiveIndex((i) => {
        const next = Math.min((i < 0 ? -1 : i) + 1, filtered.length - 1)
        scrollIntoView(next)
        return next
      })
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((i) => {
        const prev = Math.max((i < 0 ? 0 : i) - 1, 0)
        scrollIntoView(prev)
        return prev
      })
    }

    if (e.key === "Enter") {
      if (filtered[activeIndex]) {
        onChange(filtered[activeIndex].value)
        setOpen(false)
        btnRef.current?.focus()
      }
    }
  }

  const scrollIntoView = (idx) => {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector(`[data-index="${idx}"]`)
    if (el) {
      const elTop = el.offsetTop
      const elBottom = elTop + el.offsetHeight
      const viewTop = list.scrollTop
      const viewBottom = viewTop + list.clientHeight
      if (elTop < viewTop) list.scrollTop = elTop
      else if (elBottom > viewBottom) list.scrollTop = elBottom - list.clientHeight
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block mb-2 font-bold uppercase text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between p-3 bg-white text-black border-2 border-white focus:outline-none ${buttonClassName}`}
        >
          <span className="truncate">{selected ? selected.label : `-- ${placeholder} --`}</span>
          <div className="flex items-center gap-1">
            {clearable && selected && (
              <X
                className="w-4 h-4 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(undefined)
                }}
              />
            )}
            <ChevronDown className="w-4 h-4 shrink-0" />
          </div>
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-1 font-medium">{error}</p>}

      {open && (
        <div
          className={`absolute z-[9999] ${dropUp ? "bottom-full mb-1" : "mt-1"} w-full bg-white border-2 border-black shadow-lg text-black`}
          role="listbox"
        >
          {/* buscador */}
          <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-black">
            <Search className="w-4 h-4 text-gray-500" />    
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                const q = e.target.value
                setQuery(q)
                // resalta el primer match al escribir
                setActiveIndex(q ? 0 : filtered.length ? 0 : -1)
              }}
              placeholder="Buscar…"
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>

          {/* lista */}
          <div
            ref={listRef}
            style={{ maxHeight: maxListHeight }}
            className={`overflow-y-auto ${listClassName}`}
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-600">Sin resultados</div>
            ) : (
              filtered.map((o, i) => {
                const selectedItem = String(o.value) === String(value)
                const active = i === activeIndex
                return (
                  <div
                    key={o.value}
                    data-index={i}
                    role="option"
                    aria-selected={selectedItem}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm select-none
                      ${active ? "bg-black text-white" : "hover:bg-gray-100"}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                      btnRef.current?.focus()
                    }}
                  >
                    <span className="truncate">{o.label}</span>
                    {selectedItem && <Check className={`w-4 h-4 ${active ? "text-white" : "text-black"}`} />}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
