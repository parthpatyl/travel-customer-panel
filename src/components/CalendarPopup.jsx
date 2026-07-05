import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseViewDate(value) {
  if (!value) return new Date()
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(value + 'T00:00:00')
    return isNaN(d.getTime()) ? new Date() : d
  }
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length === 8) {
    const d = new Date(`${cleaned.slice(4, 8)}-${cleaned.slice(2, 4)}-${cleaned.slice(0, 2)}T00:00:00`)
    if (!isNaN(d.getTime())) return d
  }
  return new Date()
}

export default function CalendarPopup({ value, onChange, onClose, minDate }) {
  const [viewDate, setViewDate] = useState(() => parseViewDate(value))
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = new Date().toISOString().split('T')[0]

  const selectedStr = (() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const cleaned = (value || '').replace(/\D/g, '')
    if (cleaned.length === 8) {
      return `${cleaned.slice(4, 8)}-${cleaned.slice(2, 4)}-${cleaned.slice(0, 2)}`
    }
    return ''
  })()

  const handleDayClick = (day) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(iso)
    onClose()
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const isDisabled = (day) => {
    if (!minDate) return false
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr < minDate
  }

  const cells = []
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`blank-${i}`} className="w-9 h-9" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isSelected = dateStr === selectedStr
    const disabled = isDisabled(d)
    const isToday = dateStr === todayStr

    cells.push(
      <button
        key={d}
        type="button"
        disabled={disabled}
        onClick={() => handleDayClick(d)}
        className={`w-9 h-9 text-xs rounded-full flex items-center justify-center transition-all
          ${isSelected ? 'bg-amber-600 text-white font-bold' : isToday ? 'bg-amber-100 text-amber-800 font-semibold' : 'text-stone-700 hover:bg-stone-100'}
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {d}
      </button>
    )
  }

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-0 z-50 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 w-[280px] animate-fade-in"
    >
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-stone-600" />
        </button>
        <span className="text-xs font-bold text-stone-800 uppercase tracking-[0.05em]">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-stone-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="w-9 h-7 text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">{cells}</div>
    </div>
  )
}
