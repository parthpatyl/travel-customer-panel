import { useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export default function MegaMenu({ label, columns, onNavigate, isMobile = false, compact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)

  const open = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const close = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  const handleLinkClick = (link) => {
    setIsOpen(false)
    onNavigate(link.page || 'destinations', null, link.region, link.search || '')
  }

  if (isMobile) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between text-stone-700 hover:text-stone-950 hover:bg-stone-100"
        >
          {label}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="px-4 pb-3 space-y-3 border-b border-stone-100">
            {columns.map(col => (
              <div key={col.heading}>
                {col.sections ? (
                  col.sections.map(sec => (
                    <div key={sec.subheading} className="mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">{sec.subheading}</h4>
                      <div className="space-y-1 pl-2">
                        {sec.links.map(link => (
                          <button
                            key={link.label}
                            onClick={() => handleLinkClick(link)}
                            className="block w-full text-left text-sm text-stone-600 hover:text-amber-700 py-1.5"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">{col.heading}</h4>
                    <div className="space-y-1 pl-2">
                      {col.links.map(link => (
                        <button
                          key={link.label}
                          onClick={() => handleLinkClick(link)}
                          className="block w-full text-left text-sm text-stone-600 hover:text-amber-700 py-1.5"
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

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <button
        className={`rounded-lg font-medium transition-all duration-200 flex items-center gap-1 text-xs sm:text-sm tracking-wide ${
          compact ? 'px-3 py-1.5' : 'px-3.5 py-2'
        } ${
          isOpen
            ? 'text-amber-400 bg-white/10'
            : 'text-stone-200 hover:text-white hover:bg-white/10'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`transition-transform duration-200 w-3.5 h-3.5 ${isOpen ? 'rotate-180 text-amber-400' : 'text-stone-400'}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 z-50 animate-slide-down"
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xl shadow-stone-950/20 p-6 w-max max-w-[92vw] max-h-[80vh] overflow-y-auto">
            <div className="flex gap-6 sm:gap-8 flex-wrap">
              {columns.map(col => (
                <div key={col.heading} className="min-w-[160px] max-w-[220px]">
                  {col.sections ? (
                    col.sections.map((sec, i) => (
                      <div key={sec.subheading} className={i > 0 ? 'mt-4 pt-3 border-t border-stone-100' : ''}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] mb-2.5">
                          {sec.subheading}
                        </h4>
                        <ul className="space-y-1">
                          {sec.links.map(link => (
                            <li key={link.label}>
                              <button
                                onClick={() => handleLinkClick(link)}
                                className="text-xs sm:text-sm text-stone-600 hover:text-[#1D4ED8] transition-colors py-0.5 block w-full text-left font-normal hover:font-medium leading-snug"
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
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] mb-2.5">
                        {col.heading}
                      </h4>
                      <ul className="space-y-1">
                        {col.links.map(link => (
                          <li key={link.label}>
                            <button
                              onClick={() => handleLinkClick(link)}
                              className="text-xs sm:text-sm text-stone-600 hover:text-[#1D4ED8] transition-colors py-0.5 block w-full text-left font-normal hover:font-medium leading-snug"
                            >
                              {link.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
