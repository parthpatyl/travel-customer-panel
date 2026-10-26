/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEFAULT_AGENCY_SETTINGS = {
  agencyName: 'KRAFT YOUR TRIP',
  agencyTagline: 'Handcrafting bespoke luxury travel experiences across the globe.',
  agencyAddress: 'Mumbai, Maharashtra, India',
  agencyPhone: '+91 7046704693',
  agencyEmail: 'contact@kraftyourtrip.com',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
  inrToUsdRate: 83.5,
  socialLinks: {
    instagram: 'https://instagram.com/kraftyourtrip',
    facebook: 'https://facebook.com/kraftyourtrip',
    whatsapp: 'https://wa.me/917046704693'
  }
}

const AgencyContext = createContext({
  settings: DEFAULT_AGENCY_SETTINGS,
  loading: false,
  refreshSettings: () => {}
})

export function AgencyProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('kraft_customer_settings')
      if (cached) {
        const parsed = JSON.parse(cached)
        return {
          ...DEFAULT_AGENCY_SETTINGS,
          ...parsed,
          socialLinks: { ...DEFAULT_AGENCY_SETTINGS.socialLinks, ...(parsed.socialLinks || {}) }
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_AGENCY_SETTINGS
  })
  const [loading, setLoading] = useState(false)

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`)
      if (res.ok) {
        const data = await res.json()
        setSettings((prev) => {
          const nextSettings = {
            ...prev,
            ...data,
            socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) }
          }
          try {
            localStorage.setItem('kraft_customer_settings', JSON.stringify(nextSettings))
          } catch {
            // ignore
          }
          return nextSettings
        })
      }
    } catch (err) {
      console.warn('[AgencyContext] Using cached/default settings:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <AgencyContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </AgencyContext.Provider>
  )
}

export function useAgencySettings() {
  const context = useContext(AgencyContext)
  if (!context) {
    throw new Error('useAgencySettings must be used within an AgencyProvider')
  }
  return context
}
