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
        className={`rounded-full font-medium transition-all duration-300 flex items-center gap-1 ${
          compact ? 'px-3 py-2 text-sm' : 'px-3 py-2 text-sm'
        } ${
          isOpen
            ? 'text-amber-700 bg-amber-50'
            : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`transition-transform duration-200 w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20"
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl shadow-stone-900/10 p-5 w-max max-w-[95vw] animate-slide-down">
            <div className="flex gap-6">
              {columns.map(col => (
                <div key={col.heading} className="min-w-[170px]">
                  {col.sections ? (
                    col.sections.map((sec, i) => (
                      <div key={sec.subheading} className={i > 0 ? 'mt-3 pt-3 border-t border-stone-100' : ''}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                          {sec.subheading}
                        </h4>
                        <ul className="space-y-1">
                          {sec.links.map(link => (
                            <li key={link.label}>
                              <button
                                onClick={() => handleLinkClick(link)}
                                className="text-sm text-stone-600 hover:text-amber-700 transition-colors py-0.5 block whitespace-nowrap"
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
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                        {col.heading}
                      </h4>
                      <ul className="space-y-1">
                        {col.links.map(link => (
                          <li key={link.label}>
                            <button
                              onClick={() => handleLinkClick(link)}
                              className="text-sm text-stone-600 hover:text-amber-700 transition-colors py-0.5 block whitespace-nowrap"
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
