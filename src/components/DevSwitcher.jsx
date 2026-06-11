import { useState } from 'react'
import { ExternalLink, Terminal } from 'lucide-react'

export default function DevSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  // Resolve target url dynamically based on environment
  const targetUrl = isLocalhost 
    ? 'http://localhost:5174'
    : window.location.origin.includes('customer') 
      ? window.location.origin.replace('customer', 'admin') // e.g. vercel apps
      : `${window.location.origin}/dashboard` // fallback subdirectory routing

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      <div 
        className={`flex items-center gap-3 bg-stone-900 border border-stone-800 text-white p-2.5 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? 'pr-4 pl-3.5 rounded-2xl' : 'w-11 h-11 justify-center'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Active pulse status dot */}
        <div className="relative flex h-3.5 w-3.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-450 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </div>

        {isOpen && (
          <div className="flex items-center gap-3 animate-fade-in whitespace-nowrap text-xs font-semibold tracking-wide">
            <span className="text-stone-400">Dev Preview</span>
            <div className="h-3 w-px bg-stone-750" />
            <a 
              href={targetUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-bold transition-colors shadow-sm duration-200"
            >
              Open Dashboard
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {!isOpen && (
          <Terminal className="h-5 w-5 text-amber-500" />
        )}
      </div>
    </div>
  )
}
