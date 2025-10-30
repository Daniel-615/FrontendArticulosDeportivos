"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Check, Search } from "lucide-react"

export default function SearchableSelect({
  value,
  onChange,
  options = [], // [{value, label}]
  placeholder = "Selecciona...",
  label = "",
  required = false,
  error = "",
  className = "",
  buttonClassName = "",
  listClassName = "",
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(-1)
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

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery("")
      setActiveIndex(-1)
    }
  }, [open])

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      btnRef.current?.focus()
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      scrollIntoView(activeIndex + 1)
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
      scrollIntoView(activeIndex - 1)
    }

    if (e.key === "Enter") {
      e.preventDefault()
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
    <div className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block mb-2 font-bold uppercase text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between p-3 bg-white text-black border-2 border-white focus:outline-none ${buttonClassName}`}
      >
        <span className="truncate">{selected ? selected.label : `-- ${placeholder} --`}</span>
        <ChevronDown className="w-4 h-4 shrink-0" />
      </button>

      {error && <p className="text-red-400 text-sm mt-1 font-medium">{error}</p>}

      {open && (
        <div
          className={`absolute z-50 mt-1 w-full bg-white border-2 border-black shadow-lg`}
          role="listbox"
        >
          {/* buscador */}
          <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-black">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
              }}
              placeholder="Buscar…"
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>

          {/* lista */}
          <div
            ref={listRef}
            className={`max-h-64 overflow-y-auto ${listClassName}`}
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
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm
                       ${active ? "bg-black text-white" : "hover:bg-gray-100"}
                    `}
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
