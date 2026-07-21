import { createContext, useContext, useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEFAULT_AGENCY_SETTINGS = {
  agencyName: 'KRAFT YOUR TRIP',
  agencyTagline: 'Handcrafting bespoke luxury travel experiences across the globe.',
  agencyAddress: '456 Sandstone Ave, Suite 100, San Francisco, CA',
  agencyPhone: '+1 (555) 019-2831',
  agencyEmail: 'concierge@kraftyourtrip.com',
  workingHours: 'Mon – Sat: 9 AM – 6 PM',
  inrToUsdRate: 83.5,
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com'
  }
}

const AgencyContext = createContext({
  settings: DEFAULT_AGENCY_SETTINGS,
  loading: false,
  refreshSettings: () => {}
})

export function AgencyProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_AGENCY_SETTINGS)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`)
      if (res.ok) {
        const data = await res.json()
        setSettings((prev) => ({
          ...prev,
          ...data,
          socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) }
        }))
      }
    } catch (err) {
      console.warn('[AgencyContext] Using default settings:', err.message)
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
