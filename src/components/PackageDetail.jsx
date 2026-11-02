import { useState, useEffect } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { API_URL, getImgUrl, handleImageError, DEFAULT_HERO_IMAGE } from '../utils/image'
import {
  ArrowLeft, Check, CheckCircle2, X, Phone, Mail, Clock, Globe, Flame,
  MapPin, Hotel, Compass, User, Car, Plane, Ship, Printer, Share2,
  Copy, CheckCheck, Send, Calendar, Users, MessageSquare, Sparkles
} from 'lucide-react'
import { SmartMarkdown, SmartMarkdownInline, flattenBulletedItems } from '../utils/markdownUtils'
import PackageBrochureModal from './PackageBrochureModal'
import ItineraryDownloadLeadModal from './ItineraryDownloadLeadModal'
import PhoneInput from './PhoneInput'
import { validateEmail, validatePhone, validateName, validateGuests } from '../utils/validation'
import { updatePageMeta } from '../utils/meta'

const imgUrl = (url) => getImgUrl(url, DEFAULT_HERO_IMAGE)

function parseDurationDays(duration) {
  if (!duration) return null
  const str = String(duration)
  const dayMatch = str.match(/(\d+)\s*Days?/i)
  if (dayMatch) return parseInt(dayMatch[1], 10)
  const nightMatch = str.match(/(\d+)\s*Nights?/i)
  if (nightMatch) return parseInt(nightMatch[1], 10) + 1
  const num = parseInt(str, 10)
  return !isNaN(num) ? num : null
}

function calculateEndDate(startDate, durationDays) {
  if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return ''
  const days = durationDays || 1
  const [y, m, d] = startDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + Math.max(0, days - 1))
  const ry = date.getFullYear()
  const rm = String(date.getMonth() + 1).padStart(2, '0')
  const rd = String(date.getDate()).padStart(2, '0')
  return `${ry}-${rm}-${rd}`
}

export default function PackageDetail({ pkg, onBook, settings = {}, onBack }) {
  const [activeTab, setActiveTab] = useState('itinerary') // tabs: itinerary, inclusions
  const [weather, setWeather] = useState(null)
  const [groupDepartures, setGroupDepartures] = useState([])
  const [isBrochureOpen, setIsBrochureOpen] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [shareToast, setShareToast] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const handleDownloadClick = () => {
    // Always require contact details validation before downloading itinerary
    setIsLeadModalOpen(true)
  }

  // Embedded Book Now Form States
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')
  const [travelDate, setTravelDate] = useState(pkg?.departureDate || '')
  const [guestCount, setGuestCount] = useState(2)
  const [selectedDeparture, setSelectedDeparture] = useState(null)
  const [notes, setNotes] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(null)

  const agencyPhone = (settings.agencyPhone && !settings.agencyPhone.includes('(555)')) ? settings.agencyPhone : '+91 7046704693'
  const agencyEmail = settings.agencyEmail || 'contact@kraftyourtrip.com'

  const totalSlots = pkg?.slots?.total ?? pkg?.slotsTotal ?? 20
  const bookedSlots = pkg?.slots?.booked ?? pkg?.slotsBooked ?? 0
  const spotsLeft = totalSlots - bookedSlots

  const pkgDays = parseDurationDays(pkg?.duration)
  const computedEndDate = selectedDeparture?.returnDate
    ? selectedDeparture.returnDate.split('T')[0]
    : calculateEndDate(travelDate, pkgDays)

  // Ensure document title and rich social sharing tags update for Meta/SEO
  useEffect(() => {
    if (pkg?.name) {
      const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/package/${pkg.id}` : ''
      updatePageMeta('detail', pkg.name, {
        title: pkg.name,
        description: pkg.description ? pkg.description.slice(0, 160) : `Discover ${pkg.name} handcrafted by Kraft Your Trip luxury travel experts.`,
        image: imgUrl(pkg.heroImage || pkg.cardImage),
        url: canonicalUrl
      })
    }

    return () => {
      updatePageMeta('home')
    }
  }, [pkg?.id, pkg?.name, pkg?.description, pkg?.heroImage, pkg?.cardImage])

  useEffect(() => {
    const fetchGroupDepartures = async () => {
      try {
        const res = await fetch(`${API_URL}/api/group-departures?packageId=${pkg.id}`)
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : []
          const filtered = list.filter(d => d.status === 'scheduled' || d.status === 'confirmed')
          setGroupDepartures(filtered)
        }
      } catch (err) {
        console.warn('Failed to fetch group departures:', err)
      }
    }
    if (pkg?.id) fetchGroupDepartures()
  }, [pkg?.id])

  // Handle Share Trip
  const handleShare = async () => {
    const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/package/${pkg.id}` : window.location.href
    const cleanPrice = (pkg.price != null && pkg.price !== '')
      ? `₹${Number(pkg.price).toLocaleString('en-IN')}`
      : (pkg.basePrice ? `₹${Number(pkg.basePrice).toLocaleString('en-IN')}` : '')

    const detailsLine = [
      pkg.name,
      pkg.duration,
      cleanPrice ? `Starting from ${cleanPrice}` : '',
      'Handcrafted by Kraft Your Trip'
    ].filter(Boolean).join(' | ')

    const formattedShareText = `${detailsLine}\n${canonicalUrl}`

    // Always copy formatted rich text to clipboard on click as immediate convenience
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formattedShareText)
        setShareToast('Package details and link copied to clipboard!')
        setTimeout(() => setShareToast(null), 3500)
      }
    } catch {
      // ignore
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${pkg.name} — Kraft Your Trip`,
          text: formattedShareText
        })
        return
      } catch {
        // Fallback to modal
      }
    }

    setIsShareModalOpen(true)
  }

  // Handle embedded Booking Form Submit
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    const nameCheck = validateName(fullName)
    if (!nameCheck.isValid) errors.fullName = nameCheck.error

    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) errors.email = emailCheck.error

    const phoneCheck = validatePhone(phone, countryCode)
    if (!phoneCheck.isValid) errors.phone = phoneCheck.error

    const guestCheck = validateGuests(guestCount)
    if (!guestCheck.isValid) errors.guests = guestCheck.error

    if (!travelDate) {
      errors.travelDate = 'Please select a preferred travel date'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setIsSubmitting(true)

    const fullPhone = phone.startsWith('+') ? phone : `${countryCode}${phone.replace(/^0+/, '')}`
    const basePrice = pkg.price || pkg.basePrice || 0
    const departurePriceModifier = selectedDeparture?.priceModifier || 0
    const perPersonPrice = basePrice + departurePriceModifier
    const calculatedAmount = perPersonPrice * guestCount

    const payload = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: fullPhone,
      packageId: pkg.id,
      packageName: pkg.name,
      destination: pkg.name,
      departureId: selectedDeparture?.id || pkg.departureId || null,
      travelDate,
      startDate: travelDate,
      endDate: computedEndDate || travelDate,
      guests: guestCount,
      estimatedAmount: calculatedAmount,
      notes: notes.trim()
    }

    try {
      const res = await fetch(`${API_URL}/api/bookings/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setInquirySuccess({
          bookingId: data.booking?.id || `ENQ-${Date.now().toString(36).toUpperCase()}`,
          message: data.message || 'Your luxury booking inquiry has been confirmed with our concierge desk!'
        })
      } else {
        setFormErrors({ submit: data.error || data.message || 'Inquiry could not be sent. Check your connection or message our concierge desk on WhatsApp.' })
      }
    } catch {
      setFormErrors({ submit: 'Network connection issue. Please check your connection or contact us via WhatsApp.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let isCancelled = false
    const fetchWeather = async () => {
      // Granular destination-to-coordinates catalog for regional tourist hotspots
      const DESTINATION_COORDS = {
        // India - North & Himalayas
        'shillong': { lat: 25.58, lon: 91.89, city: 'Shillong', region: 'Shillong (Meghalaya)' },
        'meghalaya': { lat: 25.58, lon: 91.89, city: 'Shillong', region: 'Shillong (Meghalaya)' },
        'cherrapunji': { lat: 25.27, lon: 91.73, city: 'Cherrapunji', region: 'Cherrapunji (Meghalaya)' },
        'srinagar': { lat: 34.08, lon: 74.80, city: 'Srinagar', region: 'Srinagar (Kashmir)' },
        'kashmir': { lat: 34.08, lon: 74.80, city: 'Srinagar', region: 'Srinagar (Kashmir)' },
        'gulmarg': { lat: 34.05, lon: 74.38, city: 'Gulmarg', region: 'Gulmarg (Kashmir)' },
        'leh': { lat: 34.15, lon: 77.58, city: 'Leh', region: 'Leh (Ladakh)' },
        'ladakh': { lat: 34.15, lon: 77.58, city: 'Leh', region: 'Leh (Ladakh)' },
        'nubra': { lat: 34.69, lon: 77.56, city: 'Nubra Valley', region: 'Nubra Valley (Ladakh)' },
        'manali': { lat: 32.24, lon: 77.19, city: 'Manali', region: 'Manali (Himachal)' },
        'shimla': { lat: 31.10, lon: 77.17, city: 'Shimla', region: 'Shimla (Himachal)' },
        'spiti': { lat: 32.25, lon: 78.03, city: 'Kaza', region: 'Spiti Valley (Himachal)' },
        'dharamshala': { lat: 32.22, lon: 76.32, city: 'Dharamshala', region: 'Dharamshala (Himachal)' },
        'rishikesh': { lat: 30.09, lon: 78.27, city: 'Rishikesh', region: 'Rishikesh (Uttarakhand)' },
        'haridwar': { lat: 29.95, lon: 78.16, city: 'Haridwar', region: 'Haridwar (Uttarakhand)' },
        'nainital': { lat: 29.39, lon: 79.45, city: 'Nainital', region: 'Nainital (Uttarakhand)' },
        'mussoorie': { lat: 30.46, lon: 78.07, city: 'Mussoorie', region: 'Mussoorie (Uttarakhand)' },
        'darjeeling': { lat: 27.04, lon: 88.26, city: 'Darjeeling', region: 'Darjeeling (West Bengal)' },
        'gangtok': { lat: 27.33, lon: 88.61, city: 'Gangtok', region: 'Gangtok (Sikkim)' },
        'sikkim': { lat: 27.33, lon: 88.61, city: 'Gangtok', region: 'Gangtok (Sikkim)' },
        'kaziranga': { lat: 26.58, lon: 93.17, city: 'Kaziranga', region: 'Kaziranga (Assam)' },
        'guwahati': { lat: 26.14, lon: 91.74, city: 'Guwahati', region: 'Guwahati (Assam)' },
        'assam': { lat: 26.14, lon: 91.74, city: 'Guwahati', region: 'Guwahati (Assam)' },
        // India - West & Desert
        'jaipur': { lat: 26.91, lon: 75.79, city: 'Jaipur', region: 'Jaipur (Rajasthan)' },
        'udaipur': { lat: 24.59, lon: 73.71, city: 'Udaipur', region: 'Udaipur (Rajasthan)' },
        'jodhpur': { lat: 26.24, lon: 73.02, city: 'Jodhpur', region: 'Jodhpur (Rajasthan)' },
        'jaisalmer': { lat: 26.92, lon: 70.90, city: 'Jaisalmer', region: 'Jaisalmer (Rajasthan)' },
        'pushkar': { lat: 26.49, lon: 74.55, city: 'Pushkar', region: 'Pushkar (Rajasthan)' },
        'rajasthan': { lat: 26.91, lon: 75.79, city: 'Jaipur', region: 'Jaipur (Rajasthan)' },
        'agra': { lat: 27.18, lon: 78.01, city: 'Agra', region: 'Agra (Uttar Pradesh)' },
        'varanasi': { lat: 25.32, lon: 82.97, city: 'Varanasi', region: 'Varanasi (Uttar Pradesh)' },
        'delhi': { lat: 28.61, lon: 77.23, city: 'New Delhi', region: 'New Delhi' },
        'mumbai': { lat: 19.08, lon: 72.88, city: 'Mumbai', region: 'Mumbai (Maharashtra)' },
        'goa': { lat: 15.30, lon: 74.12, city: 'Goa', region: 'Goa' },
        // India - South & Islands
        'munnar': { lat: 10.09, lon: 77.06, city: 'Munnar', region: 'Munnar (Kerala)' },
        'alleppey': { lat: 9.49, lon: 76.33, city: 'Alleppey', region: 'Alleppey (Kerala)' },
        'kochi': { lat: 9.93, lon: 76.27, city: 'Kochi', region: 'Kochi (Kerala)' },
        'wayanad': { lat: 11.69, lon: 76.13, city: 'Wayanad', region: 'Wayanad (Kerala)' },
        'kerala': { lat: 9.93, lon: 76.27, city: 'Kochi', region: 'Kerala' },
        'coorg': { lat: 12.34, lon: 75.81, city: 'Coorg', region: 'Coorg (Karnataka)' },
        'ooty': { lat: 11.41, lon: 76.70, city: 'Ooty', region: 'Ooty (Tamil Nadu)' },
        'andaman': { lat: 11.62, lon: 92.73, city: 'Port Blair', region: 'Port Blair (Andaman)' },
        'havelock': { lat: 12.00, lon: 93.00, city: 'Havelock', region: 'Havelock (Andaman)' },
        'lakshadweep': { lat: 10.57, lon: 72.64, city: 'Kavaratti', region: 'Lakshadweep' },

        // Asia - Southeast
        'bali': { lat: -8.41, lon: 115.19, city: 'Bali', region: 'Bali (Indonesia)' },
        'ubud': { lat: -8.51, lon: 115.26, city: 'Ubud', region: 'Ubud (Bali)' },
        'indonesia': { lat: -8.41, lon: 115.19, city: 'Bali', region: 'Bali (Indonesia)' },
        'phuket': { lat: 7.88, lon: 98.39, city: 'Phuket', region: 'Phuket (Thailand)' },
        'krabi': { lat: 8.09, lon: 98.91, city: 'Krabi', region: 'Krabi (Thailand)' },
        'bangkok': { lat: 13.76, lon: 100.50, city: 'Bangkok', region: 'Bangkok (Thailand)' },
        'chiang mai': { lat: 18.79, lon: 98.98, city: 'Chiang Mai', region: 'Chiang Mai (Thailand)' },
        'thailand': { lat: 13.76, lon: 100.50, city: 'Bangkok', region: 'Bangkok (Thailand)' },
        'singapore': { lat: 1.35, lon: 103.82, city: 'Singapore', region: 'Singapore' },
        'kuala lumpur': { lat: 3.14, lon: 101.69, city: 'Kuala Lumpur', region: 'Kuala Lumpur (Malaysia)' },
        'langkawi': { lat: 6.35, lon: 99.80, city: 'Langkawi', region: 'Langkawi (Malaysia)' },
        'malaysia': { lat: 3.14, lon: 101.69, city: 'Kuala Lumpur', region: 'Kuala Lumpur (Malaysia)' },
        'vietnam': { lat: 21.03, lon: 105.85, city: 'Hanoi', region: 'Hanoi (Vietnam)' },
        'hanoi': { lat: 21.03, lon: 105.85, city: 'Hanoi', region: 'Hanoi (Vietnam)' },
        'da nang': { lat: 16.05, lon: 108.20, city: 'Da Nang', region: 'Da Nang (Vietnam)' },
        'ho chi minh': { lat: 10.82, lon: 106.63, city: 'Ho Chi Minh', region: 'Ho Chi Minh (Vietnam)' },
        'siem reap': { lat: 13.36, lon: 103.86, city: 'Siem Reap', region: 'Siem Reap (Cambodia)' },
        'cambodia': { lat: 13.36, lon: 103.86, city: 'Siem Reap', region: 'Siem Reap (Cambodia)' },
        'boracay': { lat: 11.97, lon: 121.92, city: 'Boracay', region: 'Boracay (Philippines)' },
        'philippines': { lat: 14.60, lon: 120.98, city: 'Manila', region: 'Manila (Philippines)' },

        // Asia - East & Central & South
        'tokyo': { lat: 35.68, lon: 139.69, city: 'Tokyo', region: 'Tokyo (Japan)' },
        'kyoto': { lat: 35.01, lon: 135.77, city: 'Kyoto', region: 'Kyoto (Japan)' },
        'osaka': { lat: 34.69, lon: 135.50, city: 'Osaka', region: 'Osaka (Japan)' },
        'japan': { lat: 35.68, lon: 139.69, city: 'Tokyo', region: 'Tokyo (Japan)' },
        'seoul': { lat: 37.57, lon: 126.98, city: 'Seoul', region: 'Seoul (South Korea)' },
        'korea': { lat: 37.57, lon: 126.98, city: 'Seoul', region: 'Seoul (South Korea)' },
        'beijing': { lat: 39.90, lon: 116.40, city: 'Beijing', region: 'Beijing (China)' },
        'maldives': { lat: 4.18, lon: 73.51, city: 'Malé', region: 'Maldives' },
        'colombo': { lat: 6.93, lon: 79.84, city: 'Colombo', region: 'Colombo (Sri Lanka)' },
        'kandy': { lat: 7.29, lon: 80.64, city: 'Kandy', region: 'Kandy (Sri Lanka)' },
        'sri lanka': { lat: 6.93, lon: 79.84, city: 'Colombo', region: 'Sri Lanka' },
        'kathmandu': { lat: 27.72, lon: 85.32, city: 'Kathmandu', region: 'Kathmandu (Nepal)' },
        'nepal': { lat: 27.72, lon: 85.32, city: 'Kathmandu', region: 'Kathmandu (Nepal)' },
        'bhutan': { lat: 27.47, lon: 89.64, city: 'Thimphu', region: 'Thimphu (Bhutan)' },
        'thimphu': { lat: 27.47, lon: 89.64, city: 'Thimphu', region: 'Thimphu (Bhutan)' },

        // Middle East & Africa
        'dubai': { lat: 25.20, lon: 55.27, city: 'Dubai', region: 'Dubai (UAE)' },
        'abu dhabi': { lat: 24.45, lon: 54.38, city: 'Abu Dhabi', region: 'Abu Dhabi (UAE)' },
        'uae': { lat: 25.20, lon: 55.27, city: 'Dubai', region: 'Dubai (UAE)' },
        'muscat': { lat: 23.59, lon: 58.54, city: 'Muscat', region: 'Muscat (Oman)' },
        'oman': { lat: 23.59, lon: 58.54, city: 'Muscat', region: 'Muscat (Oman)' },
        'petra': { lat: 30.33, lon: 35.44, city: 'Petra', region: 'Petra (Jordan)' },
        'cappadocia': { lat: 38.64, lon: 34.83, city: 'Cappadocia', region: 'Cappadocia (Turkey)' },
        'istanbul': { lat: 41.01, lon: 28.98, city: 'Istanbul', region: 'Istanbul (Turkey)' },
        'turkey': { lat: 41.01, lon: 28.98, city: 'Istanbul', region: 'Istanbul (Turkey)' },
        'cairo': { lat: 30.04, lon: 31.24, city: 'Cairo', region: 'Cairo (Egypt)' },
        'egypt': { lat: 30.04, lon: 31.24, city: 'Cairo', region: 'Cairo (Egypt)' },
        'nairobi': { lat: -1.29, lon: 36.82, city: 'Nairobi', region: 'Nairobi (Kenya)' },
        'masai mara': { lat: -1.49, lon: 35.14, city: 'Masai Mara', region: 'Masai Mara (Kenya)' },
        'kenya': { lat: -1.29, lon: 36.82, city: 'Nairobi', region: 'Nairobi (Kenya)' },
        'cape town': { lat: -33.92, lon: 18.42, city: 'Cape Town', region: 'Cape Town (South Africa)' },
        'south africa': { lat: -33.92, lon: 18.42, city: 'Cape Town', region: 'Cape Town (South Africa)' },
        'marrakech': { lat: 31.63, lon: -7.99, city: 'Marrakech', region: 'Marrakech (Morocco)' },
        'morocco': { lat: 31.63, lon: -7.99, city: 'Marrakech', region: 'Marrakech (Morocco)' },
        'mauritius': { lat: -20.35, lon: 57.55, city: 'Port Louis', region: 'Mauritius' },
        'seychelles': { lat: -4.68, lon: 55.49, city: 'Victoria', region: 'Seychelles' },

        // Europe
        'zermatt': { lat: 45.98, lon: 7.75, city: 'Zermatt', region: 'Zermatt (Switzerland)' },
        'interlaken': { lat: 46.69, lon: 7.86, city: 'Interlaken', region: 'Interlaken (Switzerland)' },
        'zurich': { lat: 47.38, lon: 8.54, city: 'Zurich', region: 'Zurich (Switzerland)' },
        'switzerland': { lat: 46.69, lon: 7.86, city: 'Interlaken', region: 'Swiss Alps' },
        'paris': { lat: 48.86, lon: 2.35, city: 'Paris', region: 'Paris (France)' },
        'nice': { lat: 43.71, lon: 7.26, city: 'Nice', region: 'Nice (French Riviera)' },
        'france': { lat: 48.86, lon: 2.35, city: 'Paris', region: 'Paris (France)' },
        'rome': { lat: 41.90, lon: 12.50, city: 'Rome', region: 'Rome (Italy)' },
        'florence': { lat: 43.77, lon: 11.25, city: 'Florence', region: 'Florence (Italy)' },
        'venice': { lat: 45.44, lon: 12.32, city: 'Venice', region: 'Venice (Italy)' },
        'amalfi': { lat: 40.63, lon: 14.60, city: 'Amalfi', region: 'Amalfi Coast (Italy)' },
        'italy': { lat: 41.90, lon: 12.50, city: 'Rome', region: 'Rome (Italy)' },
        'santorini': { lat: 36.39, lon: 25.46, city: 'Santorini', region: 'Santorini (Greece)' },
        'athens': { lat: 37.98, lon: 23.73, city: 'Athens', region: 'Athens (Greece)' },
        'greece': { lat: 36.39, lon: 25.46, city: 'Santorini', region: 'Santorini (Greece)' },
        'barcelona': { lat: 41.39, lon: 2.17, city: 'Barcelona', region: 'Barcelona (Spain)' },
        'madrid': { lat: 40.42, lon: -3.70, city: 'Madrid', region: 'Madrid (Spain)' },
        'spain': { lat: 41.39, lon: 2.17, city: 'Barcelona', region: 'Barcelona (Spain)' },
        'lisbon': { lat: 38.72, lon: -9.14, city: 'Lisbon', region: 'Lisbon (Portugal)' },
        'portugal': { lat: 38.72, lon: -9.14, city: 'Lisbon', region: 'Lisbon (Portugal)' },
        'london': { lat: 51.51, lon: -0.13, city: 'London', region: 'London (UK)' },
        'amsterdam': { lat: 52.37, lon: 4.90, city: 'Amsterdam', region: 'Amsterdam (Netherlands)' },
        'vienna': { lat: 48.21, lon: 16.37, city: 'Vienna', region: 'Vienna (Austria)' },
        'prague': { lat: 50.08, lon: 14.44, city: 'Prague', region: 'Prague (Czech Republic)' },
        'reykjavik': { lat: 64.15, lon: -21.94, city: 'Reykjavik', region: 'Reykjavik (Iceland)' },
        'iceland': { lat: 64.15, lon: -21.94, city: 'Reykjavik', region: 'Reykjavik (Iceland)' },
        'dubrovnik': { lat: 42.65, lon: 18.09, city: 'Dubrovnik', region: 'Dubrovnik (Croatia)' },
        'croatia': { lat: 42.65, lon: 18.09, city: 'Dubrovnik', region: 'Dubrovnik (Croatia)' },

        // Americas & Oceania
        'new york': { lat: 40.71, lon: -74.01, city: 'New York', region: 'New York (USA)' },
        'hawaii': { lat: 21.31, lon: -157.86, city: 'Honolulu', region: 'Hawaii (USA)' },
        'cusco': { lat: -13.53, lon: -71.97, city: 'Cusco', region: 'Cusco (Peru)' },
        'machu picchu': { lat: -13.16, lon: -72.54, city: 'Machu Picchu', region: 'Machu Picchu (Peru)' },
        'peru': { lat: -13.53, lon: -71.97, city: 'Cusco', region: 'Cusco (Peru)' },
        'rio': { lat: -22.90, lon: -43.17, city: 'Rio de Janeiro', region: 'Rio de Janeiro (Brazil)' },
        'sydney': { lat: -33.86, lon: 151.20, city: 'Sydney', region: 'Sydney (Australia)' },
        'queenstown': { lat: -45.03, lon: 168.66, city: 'Queenstown', region: 'Queenstown (New Zealand)' },
        'auckland': { lat: -36.85, lon: 174.76, city: 'Auckland', region: 'Auckland (New Zealand)' },
      };

      // Priority 1: Check admin-configured weatherCity override on package
      let targetDest = null;
      if (pkg?.weatherCity && typeof pkg.weatherCity === 'string' && pkg.weatherCity.trim()) {
        const cleanCustom = pkg.weatherCity.trim().toLowerCase();
        if (DESTINATION_COORDS[cleanCustom]) {
          targetDest = DESTINATION_COORDS[cleanCustom];
        } else {
          // Attempt geocoding lookup via Open-Meteo geocoding API
          try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(pkg.weatherCity.trim())}&count=1&language=en&format=json`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData?.results?.[0]) {
                const r = geoData.results[0];
                targetDest = {
                  lat: r.latitude,
                  lon: r.longitude,
                  city: r.name,
                  region: r.admin1 ? `${r.name} (${r.admin1})` : `${r.name} (${r.country || ''})`
                };
              }
            }
          } catch {
            // Geocoding lookup fallback failed
          }
        }
      }

      // Priority 2: Auto-detect from package name, region, description, and highlights
      if (!targetDest) {
        const fullText = `${pkg?.name || ''} ${pkg?.region || ''} ${pkg?.description || ''} ${(pkg?.highlights || []).join(' ')} ${pkg?.id || ''}`.toLowerCase();
        // Sort destinations by key length descending so "shillong" or "meghalaya" matches before short generic words
        const sortedKeys = Object.keys(DESTINATION_COORDS).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
          if (fullText.includes(key)) {
            targetDest = DESTINATION_COORDS[key];
            break;
          }
        }
      }

      if (!targetDest) {
        if (!isCancelled) setWeather(null);
        return;
      }

      // Priority 3: Fetch monthly archive data from Open-Meteo for exact coordinates
      try {
        const lastYear = new Date().getFullYear() - 1;
        const meteoUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${targetDest.lat}&longitude=${targetDest.lon}&start_date=${lastYear}-01-01&end_date=${lastYear}-12-31&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const mRes = await fetch(meteoUrl);
        if (mRes.ok) {
          const mData = await mRes.json();
          const daily = mData?.daily;
          if (daily && Array.isArray(daily.time) && daily.time.length > 0) {
            const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const monthlyData = [];
            for (let m = 0; m < 12; m++) {
              let maxTemps = [], minTemps = [];
              for (let i = 0; i < daily.time.length; i++) {
                const date = new Date(daily.time[i]);
                if (date.getMonth() === m) {
                  if (daily.temperature_2m_max?.[i] != null) maxTemps.push(daily.temperature_2m_max[i]);
                  if (daily.temperature_2m_min?.[i] != null) minTemps.push(daily.temperature_2m_min[i]);
                }
              }
              const avgHigh = maxTemps.length ? Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length) : null;
              const avgLow = minTemps.length ? Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length) : null;
              monthlyData.push({ month: MONTH_NAMES[m], avgHigh, avgLow });
            }
            if (!isCancelled) {
              setWeather({
                locationLabel: targetDest.region || targetDest.city,
                city: targetDest.city,
                _country: targetDest.region || targetDest.city,
                months: monthlyData
              });
              return;
            }
          }
        }
      } catch {
        // Open-Meteo fetch failed
      }

      if (!isCancelled) setWeather(null);
    };

    if (pkg) {
      fetchWeather();
    } else {
      setWeather(null);
    }

    return () => {
      isCancelled = true;
    };
  }, [pkg?.region, pkg?.name, pkg?.description, pkg?.id]);

  return (
    <section className="bg-[#FDFCF7] pb-24">
      {/* Hero Header */}
      <div className="relative h-[47vh] md:h-[55vh] overflow-hidden">
        <img
          src={imgUrl(pkg.heroImage)}
          onError={(e) => handleImageError(e, DEFAULT_HERO_IMAGE)}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/45 via-stone-900/20 to-stone-950/85" />

        {/* Navigation / Header content */}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col justify-end h-full">
          {/* Back, Share & Download buttons */}
          <div className="self-start mb-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                if (typeof onBack === 'function') {
                  onBack('All')
                } else if (typeof window !== 'undefined') {
                  window.history.back()
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-stone-900 hover:bg-white shadow-sm border border-white/40 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Destinations
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white shadow-sm rounded-full text-xs font-semibold transition-all cursor-pointer"
              title="Share unique URL on Meta, WhatsApp, or copy link"
            >
              <Share2 className="w-4 h-4" />
              Share Trip
            </button>
            <button
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/90 hover:bg-stone-900 text-amber-300 border border-amber-500/40 backdrop-blur-sm shadow-sm rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Download Itinerary (PDF)
            </button>
          </div>
          {/* Name */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.02em] leading-[1.05]">
            {pkg.name}
          </h1>
          {/* Badges */}
          <div className="flex gap-2 flex-wrap items-center mt-4">
            <span className="px-2.5 py-1 bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-[0.15em] rounded-full">
              {pkg.region}
            </span>
            <span className="px-2.5 py-1 bg-white/95 text-stone-900 text-xs font-bold uppercase tracking-[0.15em] rounded-full">
              {pkg.duration}
            </span>
            {pkg.isBespoke && (
              <span className="px-2.5 py-1 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full border border-stone-700">
                Bespoke
              </span>
            )}
            {pkg.ctaBadge && (
              <span className="px-2.5 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full animate-pulse">
                {pkg.ctaBadge}
              </span>
            )}
            {pkg.bestMonth && (
              <span className="px-2.5 py-1 bg-sky-500/90 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                Best in {pkg.bestMonth}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Description, Highlights, Tabs (Itinerary/Inclusions) */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            {/* Overview */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl text-stone-900 mb-3 tracking-tight">Overview</h2>
              <SmartMarkdown content={pkg.description} className="text-sm text-stone-600 leading-relaxed font-light" />
            </div>

            {/* Highlights Grid */}
            <div className="bg-[#FAF9F5] border border-stone-200/70 rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-xl text-stone-900 mb-4 tracking-tight">Trip Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {flattenBulletedItems(pkg.highlights).map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <SmartMarkdownInline className="text-sm text-stone-700 font-light leading-relaxed">{item}</SmartMarkdownInline>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary Tabs Container */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="border-b border-stone-100 flex">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-all border-b-2 ${
                    activeTab === 'itinerary'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Itinerary Schedule
                </button>
                <button
                  onClick={() => setActiveTab('inclusions')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-all border-b-2 ${
                    activeTab === 'inclusions'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Inclusions & Exclusions
                </button>
              </div>

              <div className="p-6 md:p-8">
                {/* Tab content: Itinerary */}
                {activeTab === 'itinerary' && (
                  <div className="relative border-l-2 border-stone-200 pl-6 ml-3 space-y-7">
                    {(pkg.itinerary || []).map((dayItem, idx) => (
                      <div key={idx} className="relative group">
                        {/* Bullet circle */}
                        <div className="absolute -left-[34px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125" />

                        <div>
                          <span className="text-xs text-amber-700 font-bold uppercase tracking-[0.18em] block mb-1">
                            Day {dayItem.day}
                          </span>
                          <h4 className="font-display text-base text-stone-900 mb-1.5">
                            {dayItem.title}
                          </h4>
                          <SmartMarkdown content={dayItem.desc} className="text-sm text-stone-600 leading-relaxed font-light" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab content: Inclusions/Exclusions */}
                {activeTab === 'inclusions' && (() => {
                  const incSel = pkg.inclusionsSelection || pkg.inclusions_selection || {}
                  const hasHotel = Boolean(incSel.hotel || incSel.hotels)
                  const hasSightseeing = Boolean(incSel.sightseeing || incSel.tours)
                  const hasGuide = Boolean(incSel.guide)
                  const hasTransfer = Boolean(incSel.airportTransfer || incSel.transfers)
                  const hasFlight = Boolean(incSel.flight || incSel.flights)
                  const hasCruise = Boolean(incSel.cruise)
                  const hasAnyAmenities = hasHotel || hasSightseeing || hasGuide || hasTransfer || hasFlight || hasCruise

                  const inclusionsList = flattenBulletedItems(pkg.inclusions)
                  const exclusionsList = flattenBulletedItems(pkg.exclusions)

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Inclusions */}
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.15em] mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> What's Included
                        </h4>
                        {hasAnyAmenities && (
                          <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                            {hasHotel && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium px-2 py-0.5 bg-white rounded-md shadow-2xs"><Hotel className="w-3.5 h-3.5 text-emerald-600" /> Hotel</span>}
                            {hasFlight && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium px-2 py-0.5 bg-white rounded-md shadow-2xs"><Plane className="w-3.5 h-3.5 text-emerald-600" /> Flights</span>}
                            {hasSightseeing && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium px-2 py-0.5 bg-white rounded-md shadow-2xs"><Compass className="w-3.5 h-3.5 text-emerald-600" /> Sightseeing</span>}
                            {hasGuide && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium px-2 py-0.5 bg-white rounded-md shadow-2xs"><User className="w-3.5 h-3.5 text-emerald-600" /> Guide</span>}
                            {hasTransfer && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium px-2 py-0.5 bg-white rounded-md shadow-2xs"><Car className="w-3.5 h-3.5 text-emerald-600" /> Transfers</span>}
                            {hasCruise && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium px-2 py-0.5 bg-white rounded-md shadow-2xs"><Ship className="w-3.5 h-3.5 text-emerald-600" /> Cruise</span>}
                          </div>
                        )}
                        <ul className="space-y-3">
                          {inclusionsList.length > 0 ? (
                            inclusionsList.map((inc, i) => (
                              <li key={i} className="flex gap-2.5 items-start text-sm text-stone-700 leading-relaxed font-light">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <SmartMarkdownInline>{inc}</SmartMarkdownInline>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-stone-400 italic">No specific inclusions listed for this package. Contact our travel specialist for tailored inclusions.</li>
                          )}
                        </ul>
                      </div>

                      {/* Exclusions */}
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.15em] mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> What's Excluded
                        </h4>
                        <ul className="space-y-3">
                          {exclusionsList.length > 0 ? (
                            exclusionsList.map((exc, i) => (
                              <li key={i} className="flex gap-2.5 items-start text-sm text-stone-700 leading-relaxed font-light">
                                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <SmartMarkdownInline>{exc}</SmartMarkdownInline>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-stone-400 italic">No specific exclusions listed. Standard booking conditions apply.</li>
                          )}
                        </ul>
                      </div>

                      {/* Terms & Conditions */}
                      {pkg.termsAndConditions && (
                        <div className="md:col-span-2 pt-4 border-t border-stone-100 space-y-2">
                          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.15em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Terms & Conditions
                          </h4>
                          <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-stone-700 leading-relaxed">
                            <SmartMarkdown content={pkg.termsAndConditions} />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24 animate-fade-in-up delay-100">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-md space-y-5">
              {pkg.isBespoke ? (
                <div>
                  <span className="text-xs text-stone-500 font-semibold uppercase tracking-[0.15em] block">Pricing</span>
                  <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <span className="font-display text-lg text-amber-800 block">Custom Quote</span>
                    <p className="text-xs text-amber-700 mt-1 font-light">Tailored to your preferences</p>
                  </div>
                  {(() => {
                    const incSel = pkg.inclusionsSelection || pkg.inclusions_selection || {}
                    const hasHotel = Boolean(incSel.hotel || incSel.hotels)
                    const hasSightseeing = Boolean(incSel.sightseeing || incSel.tours)
                    const hasGuide = Boolean(incSel.guide)
                    const hasTransfer = Boolean(incSel.airportTransfer || incSel.transfers)
                    const hasFlight = Boolean(incSel.flight || incSel.flights)
                    const hasCruise = Boolean(incSel.cruise)
                    if (!hasHotel && !hasSightseeing && !hasGuide && !hasTransfer && !hasFlight && !hasCruise) return null
                    return (
                      <div className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-full border border-stone-200 mt-3 w-fit">
                        {hasHotel && <Hotel className="w-4 h-4 text-stone-600" title="Hotel Included" />}
                        {hasSightseeing && <Compass className="w-4 h-4 text-stone-600" title="Sightseeing Included" />}
                        {hasGuide && <User className="w-4 h-4 text-stone-600" title="Guide Included" />}
                        {hasTransfer && <Car className="w-4 h-4 text-stone-600" title="Airport Transfer Included" />}
                        {hasFlight && <Plane className="w-4 h-4 text-stone-600" title="Flight Included" />}
                        {hasCruise && <Ship className="w-4 h-4 text-stone-600" title="Cruise Included" />}
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div>
                  <span className="text-xs text-stone-500 font-semibold uppercase tracking-[0.15em] block">Price Per Person</span>
                  <div className="flex items-baseline justify-between gap-1 mt-1.5">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-3xl text-stone-900 tabular-nums">{formatINR(pkg.price)}</span>
                        <span className="text-xs text-stone-400 font-medium">INR</span>
                        {pkg.usdPrice != null && <span className="text-sm text-stone-400 font-medium ml-1">{formatUSD(pkg.usdPrice)}</span>}
                      </div>
                      <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase block mt-0.5">T&C apply</span>
                    </div>
                    {/* Icons next to the price */}
                    {(() => {
                      const incSel = pkg.inclusionsSelection || pkg.inclusions_selection || {}
                      const hasHotel = Boolean(incSel.hotel || incSel.hotels)
                      const hasSightseeing = Boolean(incSel.sightseeing || incSel.tours)
                      const hasGuide = Boolean(incSel.guide)
                      const hasTransfer = Boolean(incSel.airportTransfer || incSel.transfers)
                      const hasFlight = Boolean(incSel.flight || incSel.flights)
                      const hasCruise = Boolean(incSel.cruise)
                      if (!hasHotel && !hasSightseeing && !hasGuide && !hasTransfer && !hasFlight && !hasCruise) return null
                      return (
                        <div className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-2 py-1 rounded-full border border-stone-200">
                          {hasHotel && <Hotel className="w-4 h-4 text-stone-600" title="Hotel Included" />}
                          {hasSightseeing && <Compass className="w-4 h-4 text-stone-600" title="Sightseeing Included" />}
                          {hasGuide && <User className="w-4 h-4 text-stone-600" title="Guide Included" />}
                          {hasTransfer && <Car className="w-4 h-4 text-stone-600" title="Airport Transfer Included" />}
                          {hasFlight && <Plane className="w-4 h-4 text-stone-600" title="Flight Included" />}
                          {hasCruise && <Ship className="w-4 h-4 text-stone-600" title="Cruise Included" />}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Tax breakdown — only for non-bespoke */}
              {!pkg.isBespoke && pkg.taxRate > 0 && (
                <div className="pt-3 border-t border-stone-100 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-stone-700 font-medium tabular-nums">
                      {formatINR(pkg.price)}
                      {pkg.usdPrice != null && <span className="ml-1.5 text-xs text-stone-400">{formatUSD(pkg.usdPrice)}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">GST @ {pkg.taxRate}%</span>
                    <span className="text-stone-700 font-medium tabular-nums">
                      {formatINR(pkg.price * pkg.taxRate / 100)}
                      {pkg.usdPrice != null && <span className="ml-1.5 text-[10px] text-stone-400">{formatUSD(pkg.usdPrice * pkg.taxRate / 100)}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-dashed border-stone-200">
                    <span className="text-stone-800">Total (per person)</span>
                    <span className="text-amber-700 tabular-nums">
                      {formatINR(pkg.price * (1 + pkg.taxRate / 100))}
                      {pkg.usdPrice != null && <span className="ml-1.5 text-xs text-stone-500">{formatUSD(pkg.usdPrice * (1 + pkg.taxRate / 100))}</span>}
                    </span>
                  </div>
                </div>
              )}

              {/* Status info */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Trip Duration
                  </span>
                  <span className="font-semibold text-stone-800">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                    Region
                  </span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                    {pkg.region}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    {pkg.isBespoke || (pkg.slots?.total ?? pkg.slotsTotal ?? 20) >= 999 ? (
                      spotsLeft > 0 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )
                    ) : (
                      spotsLeft <= 3 ? (
                        <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )
                    )}
                    Availability
                  </span>
                  <span className={`font-semibold ${spotsLeft <= (pkg.isBespoke || (pkg.slots?.total ?? pkg.slotsTotal ?? 20) >= 999 ? 0 : 3) ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {pkg.isBespoke || (pkg.slots?.total ?? pkg.slotsTotal ?? 20) >= 999 ? (
                      spotsLeft > 0 ? 'Available' : 'Unavailable'
                    ) : (
                      `${spotsLeft} spots remaining`
                    )}
                  </span>
                </div>
              </div>

              {groupDepartures.length > 0 && (
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <span className="text-xs text-stone-500 font-semibold uppercase tracking-[0.15em] block">
                    Upcoming Group Departures
                  </span>
                  <div className="space-y-2">
                    {groupDepartures.map((dep) => {
                      const depTotal = dep.slots?.total ?? dep.slotsTotal ?? 20
                      const depBooked = dep.slots?.booked ?? dep.slotsBooked ?? 0
                      const depSpotsLeft = depTotal - depBooked
                      const isFull = depSpotsLeft <= 0
                      return (
                        <div key={dep.id} className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200/70 rounded-xl text-xs">
                          <div>
                            <span className="font-semibold text-stone-800 block">
                              {new Date(dep.departureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {isFull ? 'Sold Out' : `${depSpotsLeft} spots left`}
                            </span>
                          </div>
                          <button
                            disabled={isFull}
                            onClick={() => {
                              onBook({
                                ...pkg,
                                departureId: dep.id,
                                departureDate: dep.departureDate ? dep.departureDate.split('T')[0] : '',
                                returnDate: dep.returnDate ? dep.returnDate.split('T')[0] : '',
                                priceModifier: dep.priceModifier || 0
                              })
                            }}
                            className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                              isFull
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                : 'bg-stone-900 hover:bg-amber-700 text-white cursor-pointer'
                            }`}
                          >
                            {isFull ? 'Full' : 'Join Group'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center py-1">
                    <span className="text-[10px] text-stone-400 italic font-light">— OR —</span>
                  </div>
                </div>
              )}

              {/* Embedded Booking & Custom Quote Form */}
              {inquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-stone-900">Inquiry Received!</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {inquirySuccess.message}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-mono text-emerald-800">
                    Booking ID: <span className="font-bold">{inquirySuccess.bookingId}</span>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${agencyPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi Kraft Your Trip! I just submitted an inquiry for ${pkg.name} (Ref: ${inquirySuccess.bookingId}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Curator on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setInquirySuccess(null)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-3 border-t border-stone-100">
                  <div>
                    <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block mb-1">
                      Reserve This Journey
                    </span>
                    <p className="text-xs text-stone-500 font-light">
                      Instant inquiry sent directly to our travel curator. No advance payment required.
                    </p>
                  </div>

                  {formErrors.submit && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-900 outline-none transition-all"
                      required
                    />
                    {formErrors.fullName && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@luxurytravel.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-900 outline-none transition-all"
                      required
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Mobile Phone *
                    </label>
                    <PhoneInput
                      countryCode={countryCode}
                      phone={phone}
                      onChange={(e) => {
                        if (e.target.name === 'countryCode') setCountryCode(e.target.value)
                        else setPhone(e.target.value)
                      }}
                      error={formErrors.phone}
                    />
                  </div>

                  {/* Travel Date & Guests */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="package-detail-travel-date" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                        Travel Date *
                      </label>
                      <input
                        id="package-detail-travel-date"
                        type="date"
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-800 outline-none"
                        required
                      />
                      {travelDate && computedEndDate && (
                        <p className="text-[10px] text-amber-700 font-medium mt-1">
                          Returns: {new Date(computedEndDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {pkgDays ? ` (${pkgDays} Days)` : ''}
                        </p>
                      )}
                      {formErrors.travelDate && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.travelDate}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                        Guests
                      </label>
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-8 py-2 text-stone-600 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-xs font-bold text-stone-900">
                          {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                          className="w-8 py-2 text-stone-600 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Special Requests / Notes <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Flights from Mumbai, luxury room tier, dietary preferences..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-800 outline-none resize-none"
                    />
                  </div>

                  {/* Live Estimated Total */}
                  {!pkg.isBespoke && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Estimated Total ({guestCount} {guestCount === 1 ? 'guest' : 'guests'}):</span>
                      <span className="font-display font-bold text-amber-900 text-sm">
                        {formatINR((pkg.price + (selectedDeparture?.priceModifier || 0)) * guestCount * (1 + (pkg.taxRate || 0) / 100))}
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-900/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{pkg.isBespoke ? 'Request Custom Quote' : 'Request Booking Inquiry'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Action Buttons: Share & Download PDF */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                  title="Share on Meta, WhatsApp, or copy link"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Share Trip</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Download PDF</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-500 leading-relaxed font-light">
                Submitting an inquiry is not an automatic charge. Our travel specialist will review and contact you within 24 hours.
              </p>
            </div>

            {/* Weather Widget */}
            {weather && weather.months && (
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                  <span aria-hidden>🌤️</span> Monthly Weather — {weather.locationLabel || weather.city || weather._country}
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {weather.months.map((m) => {
                    const currentMonth = new Date().toLocaleString('en', { month: 'short' })
                    const isCurrentMonth = m.month === currentMonth
                    const isBestMonth = pkg.bestMonth && pkg.bestMonth.substring(0, 3) === m.month
                    return (
                      <div
                        key={m.month}
                        className={`text-center py-2 px-1 rounded-lg text-xs border transition-all ${
                          isBestMonth
                            ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
                            : isCurrentMonth
                              ? 'bg-sky-50 border-sky-200'
                              : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <span className={`block font-semibold mb-0.5 ${isBestMonth ? 'text-amber-700' : 'text-stone-700'}`}>{m.month}</span>
                        <span className="block text-stone-900 font-bold tabular-nums">{m.avgHigh}°</span>
                        <span className="block text-stone-400 tabular-nums">{m.avgLow}°</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-stone-500 mt-2 text-center font-light">Avg. highs & lows (°C) · historical data</p>
              </div>
            )}

            {/* Assistance card */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-300">Need Assistance?</h4>
              <p className="text-sm text-stone-300 leading-relaxed font-light">
                Our luxury travel planners are available to tailor this itinerary exactly to your preferences.
              </p>
              <div className="pt-2 flex flex-col gap-2.5 text-sm">
                <a href={`tel:${agencyPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 text-stone-300 hover:text-amber-300 transition-colors">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  {agencyPhone}
                </a>
                <a href={`mailto:${agencyEmail}`} className="flex items-center gap-2 text-stone-300 hover:text-amber-300 transition-colors">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  {agencyEmail}
                </a>
                <div className="flex items-start gap-2 text-stone-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>456 Sandstone Ave, Suite 100, San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal for Gated Itinerary Download */}
      <ItineraryDownloadLeadModal
        pkg={pkg}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={() => {
          setIsLeadModalOpen(false)
          setIsBrochureOpen(true)
        }}
      />

      {/* Brochure Modal for Printing / Download */}
      <PackageBrochureModal
        pkg={pkg}
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        settings={settings}
      />

      {/* Share Toast Banner */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-fade-in-up">
          <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{shareToast}</span>
        </div>
      )}

      {/* Share Modal for Desktop Fallback */}
      {isShareModalOpen && (() => {
        const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/package/${pkg.id}` : window.location.href
        const cleanPrice = (pkg.price != null && pkg.price !== '')
          ? `₹${Number(pkg.price).toLocaleString('en-IN')}`
          : (pkg.basePrice ? `₹${Number(pkg.basePrice).toLocaleString('en-IN')}` : '')
        const detailsLine = [
          pkg.name,
          pkg.duration,
          cleanPrice ? `Starting from ${cleanPrice}` : '',
          'Handcrafted by Kraft Your Trip'
        ].filter(Boolean).join(' | ')
        const formattedShareText = `${detailsLine}\n${canonicalUrl}`

        return (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-stone-900">Share This Luxury Journey</h3>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 space-y-1">
                <p className="text-xs font-bold text-stone-900 leading-snug">{pkg.name}</p>
                <p className="text-[11px] text-stone-500 font-medium">
                  {pkg.duration} &bull; {pkg.region} {cleanPrice ? `&bull; Starting from ${cleanPrice}` : ''}
                </p>
                <p className="text-[11px] text-amber-700 font-mono truncate pt-1">{canonicalUrl}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(formattedShareText)
                    setShareToast('Package details and link copied to clipboard!')
                    setIsShareModalOpen(false)
                    setTimeout(() => setShareToast(null), 3000)
                  }}
                  className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Details & Link
                </button>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(canonicalUrl)
                    setShareToast('Direct link copied to clipboard!')
                    setIsShareModalOpen(false)
                    setTimeout(() => setShareToast(null), 3000)
                  }}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Link Only
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(formattedShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-blue-200 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                  Facebook
                </a>
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}
