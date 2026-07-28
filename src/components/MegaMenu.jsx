import { useState, useRef } from 'react'
import { ChevronDown, Globe, MapPin } from 'lucide-react'

export default function MegaMenu({ label, columns, onNavigate, isMobile = false, compact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)

  const open = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const close = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 180)
  }

  const handleLinkClick = (link) => {
    setIsOpen(false)
    onNavigate(link.page || 'destinations', null, link.region, link.search || '')
  }

  /* ── Mobile accordion ── */
  if (isMobile) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-2 rounded-xl text-[15px] font-medium transition-all flex items-center justify-between text-stone-200 hover:text-white hover:bg-white/10"
        >
          {label}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="px-4 pb-2 space-y-2 border-b border-white/10">
            {columns.map(col => (
              <div key={col.heading}>
                {col.sections ? (
                  col.sections.map(sec => (
                    <div key={sec.subheading} className="mb-2">
                      <h4 className="text-[12px] font-bold uppercase tracking-widest text-amber-400/80 mb-1 pl-1">{sec.subheading}</h4>
                      <div className="space-y-0.5 pl-2">
                        {sec.links.map(link => (
                          <button
                            key={link.label}
                            onClick={() => handleLinkClick(link)}
                            className="block w-full text-left text-[15px] text-stone-300 hover:text-white py-0.5 transition-colors"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-amber-400/80 mb-1 pl-1">{col.heading}</h4>
                    <div className="space-y-0.5 pl-2">
                      {col.links.map(link => (
                        <button
                          key={link.label}
                          onClick={() => handleLinkClick(link)}
                          className="block w-full text-left text-[15px] text-stone-300 hover:text-white py-0.5 transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Desktop mega dropdown ── */
  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <button
        className={`rounded-lg font-medium transition-all duration-200 flex items-center gap-1 text-[15px] tracking-wide ${
          compact ? 'px-3 py-1.5' : 'px-3.5 py-2'
        } ${
          isOpen
            ? 'text-amber-400 bg-white/10'
            : 'text-stone-200 hover:text-white hover:bg-white/10'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`transition-transform duration-200 w-4 h-4 ${isOpen ? 'rotate-180 text-amber-400' : 'text-stone-400'}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-0.5 z-50 animate-slide-down"
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <div className="bg-white/[0.98] backdrop-blur-2xl border border-stone-200/90 rounded-xl shadow-2xl shadow-stone-950/25 px-3.5 py-2.5 w-max max-w-[97vw]">
            {/* Menu title bar */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-150">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[12px] font-bold text-stone-700 uppercase tracking-wider">{label} Destinations</span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">Explore by Continent</span>
            </div>

            <div className="flex gap-3 sm:gap-4 flex-wrap items-start">
              {columns.map(col => {
                const totalLinks = col.sections
                  ? col.sections.reduce((acc, s) => acc + s.links.length, 0)
                  : col.links?.length || 0

                const colsCount = totalLinks > 24 ? 3 : totalLinks > 12 ? 2 : 1

                const widthClass =
                  colsCount === 3
                    ? 'min-w-[420px] max-w-[510px]'
                    : colsCount === 2
                    ? 'min-w-[280px] max-w-[350px]'
                    : 'min-w-[130px] max-w-[170px]'

                const gridClass =
                  colsCount === 3
                    ? 'grid grid-cols-3 gap-x-2 gap-y-0'
                    : colsCount === 2
                    ? 'grid grid-cols-2 gap-x-2 gap-y-0'
                    : 'space-y-0'

                return (
                  <div key={col.heading} className={widthClass}>
                    {col.sections ? (
                      col.sections.map((sec, i) => (
                        <div key={sec.subheading} className={i > 0 ? 'mt-1.5 pt-1 border-t border-stone-100' : ''}>
                          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-indigo-600 mb-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {sec.subheading}
                          </h4>
                          <ul className={sec.links.length > 24 ? 'grid grid-cols-3 gap-x-2 gap-y-0' : sec.links.length > 12 ? 'grid grid-cols-2 gap-x-2 gap-y-0' : 'space-y-0'}>
                            {sec.links.map(link => (
                              <li key={link.label}>
                                <button
                                  onClick={() => handleLinkClick(link)}
                                  className="text-[15px] text-stone-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all py-0 px-1 -ml-1 rounded block w-full text-left font-normal hover:font-medium leading-snug truncate"
                                  title={link.label}
                                >
                                  {link.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <>
                        <h4 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-indigo-600 mb-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {col.heading}
                        </h4>
                        <ul className={gridClass}>
                          {col.links.map(link => (
                            <li key={link.label}>
                              <button
                                onClick={() => handleLinkClick(link)}
                                className="text-[15px] text-stone-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all py-0 px-1 -ml-1 rounded block w-full text-left font-normal hover:font-medium leading-snug truncate"
                                title={link.label}
                              >
                                {link.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
