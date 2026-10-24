import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react'

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

export default function CalendarPopup({
  value,
  startDate,
  endDate,
  onChange,
  onChangeRange,
  onClose,
  minDate,
  isEndDateLocked = false
}) {
  const initialStart = startDate || value || ''
  const [viewDate, setViewDate] = useState(() => parseViewDate(initialStart))
  const [selectedStart, setSelectedStart] = useState(initialStart)
  const [selectedEnd, setSelectedEnd] = useState(endDate || '')
  const [hoveredDate, setHoveredDate] = useState('')
  const [step, setStep] = useState(selectedStart && !selectedEnd && !isEndDateLocked ? 'end' : 'start')
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

  const handleDayClick = (day) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    if (isEndDateLocked || !onChangeRange) {
      if (onChange) onChange(iso)
      if (onChangeRange) onChangeRange({ startDate: iso, endDate: '' })
      onClose()
      return
    }

    // Range selection mode
    if (step === 'start' || !selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(iso)
      setSelectedEnd('')
      setStep('end')
    } else {
      // Step === 'end'
      if (iso < selectedStart) {
        // Clicked date is before start date, restart range
        setSelectedStart(iso)
        setSelectedEnd('')
        setStep('end')
      } else {
        setSelectedEnd(iso)
        onChangeRange({ startDate: selectedStart, endDate: iso })
        onClose()
      }
    }
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

  const activeEnd = selectedEnd || (step === 'end' && hoveredDate > selectedStart ? hoveredDate : '')

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isStart = dateStr === selectedStart
    const isEnd = dateStr === activeEnd
    const inRange = selectedStart && activeEnd && dateStr > selectedStart && dateStr < activeEnd
    const isSingleSelected = isStart && (!activeEnd || activeEnd === selectedStart)
    const disabled = isDisabled(d)
    const isToday = dateStr === todayStr

    let btnClass = 'text-stone-700 hover:bg-stone-100 rounded-full'
    if (isSingleSelected) {
      btnClass = 'bg-amber-600 text-white font-bold rounded-full shadow-xs'
    } else if (isStart) {
      btnClass = 'bg-amber-600 text-white font-bold rounded-l-full'
    } else if (isEnd) {
      btnClass = 'bg-amber-600 text-white font-bold rounded-r-full'
    } else if (inRange) {
      btnClass = 'bg-amber-100 text-amber-900 rounded-none font-medium'
    } else if (isToday) {
      btnClass = 'bg-amber-50 text-amber-800 font-semibold rounded-full border border-amber-200/60'
    }

    cells.push(
      <button
        key={d}
        type="button"
        disabled={disabled}
        onClick={() => handleDayClick(d)}
        onMouseEnter={() => setHoveredDate(dateStr)}
        className={`w-9 h-9 text-xs flex items-center justify-center transition-all ${btnClass} ${
          disabled ? 'opacity-25 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
        }`}
      >
        {d}
      </button>
    )
  }

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-0 z-50 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 w-[295px] animate-fade-in"
    >
      {/* Step prompt banner */}
      {!isEndDateLocked && onChangeRange && (
        <div className="mb-2 pb-2 border-b border-stone-100 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-stone-600">
            {step === 'start' ? '1. Select Departure Date' : '2. Select Return Date'}
          </span>
          {selectedStart && (
            <button
              type="button"
              onClick={() => { setSelectedStart(''); setSelectedEnd(''); setStep('start'); }}
              className="text-[10px] text-amber-700 hover:underline font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Month Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer text-stone-600"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-stone-800 uppercase tracking-[0.05em]">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer text-stone-600"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d, idx) => (
          <div
            key={`cal-day-${d}-${idx}`}
            className="w-9 h-7 text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-0">{cells}</div>

      {/* Single date shortcut if only 1 day trip */}
      {!isEndDateLocked && onChangeRange && selectedStart && step === 'end' && (
        <div className="mt-3 pt-2 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={() => {
              onChangeRange({ startDate: selectedStart, endDate: selectedStart })
              onClose()
            }}
            className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Confirm 1-day trip on this date
          </button>
        </div>
      )}
    </div>
  )
}
