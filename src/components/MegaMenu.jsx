import { useState, useRef } from 'react'
import { ChevronDown, ChevronRight, Globe, MapPin } from 'lucide-react'

export default function MegaMenu({
  label,
  columns,
  isSplit = false,
  topTabs = [],
  continents = [],
  onNavigate,
  isMobile = false,
  compact = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeContinentId, setActiveContinentId] = useState(continents[0]?.id || 'africa')
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
    onNavigate(link.page || 'destinations', null, link.region || 'All', link.search || '')
  }

  const activeContinent = continents.find(c => c.id === activeContinentId) || continents[0]

  /* ── Mobile accordion ── */
  if (isMobile) {
    if (isSplit) {
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
            <div className="px-4 pb-3 space-y-3 border-b border-white/10">
              {continents.map((cont) => (
                <div key={cont.id} className="space-y-1">
                  <div className="text-[13px] font-bold uppercase tracking-wider text-amber-400 pt-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{cont.name}</span>
                  </div>
                  {cont.allLink && (
                    <button
                      onClick={() => handleLinkClick(cont.allLink)}
                      className="block w-full text-left text-[14px] font-semibold text-stone-200 hover:text-white pl-3 py-0.5"
                    >
                      {cont.allLink.label} &rarr;
                    </button>
                  )}
                  <div className="pl-3 space-y-2 border-l border-white/10 mt-1">
                    {cont.countries?.map((country) => (
                      <div key={country.name} className="space-y-0.5">
                        <button
                          onClick={() => handleLinkClick({ page: 'destinations', region: cont.name, search: country.name })}
                          className="block w-full text-left text-[13.5px] font-bold text-stone-300 hover:text-amber-300 py-0.5"
                        >
                          {country.name}
                        </button>
                        {country.cities && country.cities.length > 0 && (
                          <div className="pl-2 space-y-0.5">
                            {country.cities.map((city) => {
                              const cityLabel = typeof city === 'string' ? city : city.label
                              const searchVal = typeof city === 'string' ? city : (city.search || city.label)
                              return (
                                <button
                                  key={cityLabel}
                                  onClick={() => handleLinkClick({ page: 'destinations', region: cont.name, search: searchVal })}
                                  className="block w-full text-left text-[13px] text-stone-400 hover:text-white py-0.5 transition-colors"
                                >
                                  {cityLabel}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

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
          {isSplit ? (
            /* ── Multi-tier Sidebar Mega Menu (Continents & Countries - Non-scrollable layout) ── */
            <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xl shadow-stone-950/20 overflow-hidden w-[960px] max-w-[96vw] text-stone-900">
              {/* Top Quick Bar (Fit cleanly without scroll) */}
              {topTabs && topTabs.length > 0 && (
                <div className="flex items-center justify-between gap-3 px-5 py-2 bg-[#f8fafc] border-b border-stone-200 text-[12.5px] font-semibold text-stone-600 overflow-hidden whitespace-nowrap">
                  {topTabs.map((tab, idx) => {
                    const isTabActive = activeContinentId === tab.continentId
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (tab.continentId) setActiveContinentId(tab.continentId)
                        }}
                        className={`transition-colors cursor-pointer hover:text-stone-900 py-0.5 ${
                          isTabActive ? 'font-bold text-stone-950 border-b-2 border-stone-900 -mb-[9px] pb-1.5' : ''
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Main Body: Left Continents Sidebar + Right Countries Grid */}
              <div className="flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-52 shrink-0 bg-[#f4f6fa] border-r border-stone-200/90 py-1.5 flex flex-col">
                  {continents.map((cont) => {
                    const isActive = cont.id === activeContinentId
                    return (
                      <button
                        key={cont.id}
                        onMouseEnter={() => setActiveContinentId(cont.id)}
                        onClick={() => setActiveContinentId(cont.id)}
                        className={`w-full text-left px-4.5 py-2.5 text-[14px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-stone-900 border-l-4 border-amber-500 shadow-sm pl-3.5 font-bold'
                            : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        <span>{cont.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-stone-900 font-bold' : 'text-stone-400'}`} />
                      </button>
                    )
                  })}
                </div>

                {/* Right Panel (Compact multi-column layout, zero scrolling) */}
                <div className="flex-1 bg-white p-5 md:p-6 overflow-hidden">
                  {activeContinent && (
                    <div>
                      {activeContinent.allLink && (
                        <div className="mb-3.5">
                          <button
                            onClick={() => handleLinkClick(activeContinent.allLink)}
                            className="group text-[14.5px] font-extrabold text-stone-900 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{activeContinent.allLink.label}</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-stone-600" />
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-start">
                        {activeContinent.countries?.map((country) => {
                          const isLarge = country.cities && country.cities.length > 5
                          return (
                            <div key={country.name} className={`space-y-1 ${isLarge ? 'col-span-2' : 'col-span-1'}`}>
                              <button
                                onClick={() => handleLinkClick({ page: 'destinations', region: activeContinent.name, search: country.name })}
                                className="text-[13.5px] font-bold text-stone-900 hover:text-indigo-600 transition-colors pb-0.5 border-b border-stone-200 block text-left w-full cursor-pointer"
                              >
                                {country.name}
                              </button>
                              {country.cities && country.cities.length > 0 && (
                                <div className={isLarge ? 'grid grid-cols-2 gap-x-3 gap-y-0.5' : 'space-y-0.5'}>
                                  {country.cities.map((city) => {
                                    const cityLabel = typeof city === 'string' ? city : city.label
                                    const searchVal = typeof city === 'string' ? city : (city.search || city.label)
                                    return (
                                      <button
                                        key={cityLabel}
                                        onClick={() => handleLinkClick({ page: 'destinations', region: activeContinent.name, search: searchVal })}
                                        className="text-[12.5px] text-stone-600 hover:text-stone-950 block text-left w-full py-0.5 transition-colors font-medium cursor-pointer hover:underline truncate"
                                      >
                                        {cityLabel}
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── Standard Column Mega Menu ── */
            <div className="bg-white/[0.98] backdrop-blur-2xl border border-stone-200/90 rounded-xl shadow-2xl shadow-stone-950/25 px-3.5 py-2.5 w-max max-w-[97vw]">
              {/* Menu title bar */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-150">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[12px] font-bold text-stone-700 uppercase tracking-wider">{label} Destinations</span>
                </div>
                <span className="text-[11px] text-stone-400 font-medium">Explore Destinations</span>
              </div>

              <div className="flex gap-3 sm:gap-4 flex-wrap items-start">
                {columns?.map(col => {
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
          )}
        </div>
      )}
    </div>
  )
}
