import { useState, useEffect, useMemo } from 'react'
import MegaMenu from './MegaMenu'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEFAULT_SPECIALITY_COLUMNS = [
  {
    heading: 'Speciality Categories',
    links: [
      { label: 'Adventure', page: 'destinations', region: 'All', search: 'Adventure' },
      { label: 'Wellness', page: 'destinations', region: 'All', search: 'Wellness' },
      { label: 'Honeymoon', page: 'destinations', region: 'All', search: 'Honeymoon' },
      { label: 'Wildlife', page: 'destinations', region: 'All', search: 'Wildlife' },
    ]
  },
  {
    heading: 'Unique Experiences',
    links: [
      { label: 'Culinary', page: 'destinations', region: 'All', search: 'Culinary' },
      { label: 'Cruises', page: 'destinations', region: 'All', search: 'Cruise' },
      { label: 'Photography', page: 'destinations', region: 'All', search: 'Photography' },
      { label: 'Group Tours', page: 'destinations', region: 'All', search: 'Group' },
    ]
  }
]

const MEGA_MENU_CONFIG = [
  {
    id: 'india',
    label: 'India',
    columns: [
      {
        heading: 'North India',
        links: [
          { label: 'Kashmir', region: 'Asia', search: 'Kashmir' },
          { label: 'Himachal Pradesh', region: 'Asia', search: 'Himachal' },
          { label: 'Ladakh', region: 'Asia', search: 'Ladakh' },
          { label: 'Uttarakhand', region: 'Asia', search: 'Uttarakhand' },
          { label: 'Golden Triangle', region: 'Asia', search: 'Golden Triangle' },
        ]
      },
      {
        heading: 'West & Central',
        links: [
          { label: 'Rajasthan Heritage', region: 'Asia', search: 'Rajasthan' },
          { label: 'Goa Beaches', region: 'Asia', search: 'Goa' },
          { label: 'Gujarat Cultural', region: 'Asia', search: 'Gujarat' },
          { label: 'Madhya Pradesh Wildlife', region: 'Asia', search: 'Madhya Pradesh' },
        ]
      },
      {
        heading: 'South India',
        links: [
          { label: 'Kerala Backwaters', region: 'Asia', search: 'Kerala' },
          { label: 'Karnataka Hills', region: 'Asia', search: 'Karnataka' },
          { label: 'Tamil Nadu Temples', region: 'Asia', search: 'Tamil Nadu' },
          { label: 'Andaman Islands', region: 'Asia', search: 'Andaman' },
        ]
      },
      {
        heading: 'East & North-East',
        links: [
          { label: 'Sikkim & Darjeeling', region: 'Asia', search: 'Sikkim' },
          { label: 'North-East Explorer', region: 'Asia', search: 'North-East' },
          { label: 'Varanasi Spiritual', region: 'Asia', search: 'Varanasi' },
        ]
      },
    ]
  },
  {
    id: 'international',
    label: 'International',
    columns: [
      {
        heading: 'Asia',
        links: [
          { label: 'Vietnam', region: 'Asia', search: 'Vietnam' },
          { label: 'China', region: 'Asia', search: 'China' },
          { label: 'Hong Kong', region: 'Asia', search: 'Hong Kong' },
          { label: 'Japan', region: 'Asia', search: 'Japan' },
          { label: 'Macau', region: 'Asia', search: 'Macau' },
          { label: 'Philippines', region: 'Asia', search: 'Philippines' },
          { label: 'Bali', region: 'Asia', search: 'Bali' },
          { label: 'South Korea', region: 'Asia', search: 'South Korea' },
          { label: 'Singapore Malaysia (combo)', region: 'Asia', search: 'Singapore' },
          { label: 'Singapore Bali (combo)', region: 'Asia', search: 'Bali' },
          { label: 'Maldives', region: 'Asia', search: 'Maldives' },
          { label: 'Sri Lanka', region: 'Asia', search: 'Sri Lanka' },
          { label: 'Singapore', region: 'Asia', search: 'Singapore' },
          { label: 'Malaysia', region: 'Asia', search: 'Malaysia' },
          { label: 'Thailand', region: 'Asia', search: 'Thailand' },
        ]
      },
      {
        heading: 'Central Europe',
        links: [
          { label: 'Finland', region: 'Europe', search: 'Finland' },
          { label: 'France', region: 'Europe', search: 'France' },
          { label: 'Germany', region: 'Europe', search: 'Germany' },
          { label: 'Iceland', region: 'Europe', search: 'Iceland' },
          { label: 'Italy', region: 'Europe', search: 'Italy' },
          { label: 'Norway', region: 'Europe', search: 'Norway' },
          { label: 'Portugal', region: 'Europe', search: 'Portugal' },
          { label: 'Spain', region: 'Europe', search: 'Spain' },
          { label: 'Switzerland', region: 'Europe', search: 'Switzerland' },
          { label: 'UK - Scotland (combo)', region: 'Europe', search: 'Scotland' },
          { label: 'Netherlands', region: 'Europe', search: 'Netherlands' },
          { label: 'Switzerland - Paris (combo)', region: 'Europe', search: 'Paris' },
          { label: 'All Of Europe (combo)', region: 'Europe', search: 'Europe' },
          { label: 'Ireland', region: 'Europe', search: 'Ireland' },
          { label: 'Scandinavia', region: 'Europe', search: 'Scandinavia' },
          { label: 'Austria', region: 'Europe', search: 'Austria' },
        ]
      },
      {
        heading: 'East Europe & Africa',
        sections: [
          {
            subheading: 'East Europe',
            links: [
              { label: 'Croatia', region: 'Europe', search: 'Croatia' },
              { label: 'Czech Republic', region: 'Europe', search: 'Czech' },
              { label: 'Greece', region: 'Europe', search: 'Greece' },
              { label: 'Hungary', region: 'Europe', search: 'Hungary' },
              { label: 'Poland', region: 'Europe', search: 'Poland' },
              { label: 'Russia', region: 'Europe', search: 'Russia' },
              { label: 'Turkey', region: 'Europe', search: 'Turkey' },
              { label: 'Greece - Turkey (combo)', region: 'Europe', search: 'Greece' },
              { label: 'All of East Europe (combo)', region: 'Europe', search: 'East Europe' },
              { label: 'Baltic', region: 'Europe', search: 'Baltic' },
            ]
          },
          {
            subheading: 'Africa',
            links: [
              { label: 'South Africa', region: 'Africa', search: 'South Africa' },
              { label: 'Mauritius', region: 'Africa', search: 'Mauritius' },
              { label: 'Seychelles', region: 'Africa', search: 'Seychelles' },
              { label: 'Kenya', region: 'Africa', search: 'Kenya' },
              { label: 'Tanzania', region: 'Africa', search: 'Tanzania' },
              { label: 'Zimbabwe', region: 'Africa', search: 'Zimbabwe' },
              { label: 'Zambia', region: 'Africa', search: 'Zambia' },
              { label: 'Botswana', region: 'Africa', search: 'Botswana' },
            ]
          }
        ]
      },
      {
        heading: 'Middle East & Americas',
        sections: [
          {
            subheading: 'Middle East',
            links: [
              { label: 'UAE - Dubai', region: 'Middle East', search: 'Dubai' },
              { label: 'Georgia', region: 'Middle East', search: 'Georgia' },
              { label: 'Baku - Azerbaijan', region: 'Middle East', search: 'Azerbaijan' },
              { label: 'Armenia', region: 'Middle East', search: 'Armenia' },
              { label: 'Uzbekistan', region: 'Middle East', search: 'Uzbekistan' },
              { label: 'Kazakhstan', region: 'Middle East', search: 'Kazakhstan' },
              { label: 'Israel - Jordan (combo)', region: 'Middle East', search: 'Israel' },
              { label: 'Oman Muscat', region: 'Middle East', search: 'Oman' },
              { label: 'Saudi Arabia', region: 'Middle East', search: 'Saudi' },
            ]
          },
          {
            subheading: 'Americas',
            links: [
              { label: 'Central America', region: 'North America', search: 'Central America' },
              { label: 'USA - United States', region: 'North America', search: 'USA' },
              { label: 'Canada', region: 'North America', search: 'Canada' },
              { label: 'Alaska', region: 'North America', search: 'Alaska' },
              { label: 'South America', region: 'South America', search: 'South America' },
              { label: 'Mexico', region: 'North America', search: 'Mexico' },
              { label: 'Hawaii', region: 'North America', search: 'Hawaii' },
            ]
          }
        ]
      },
      {
        heading: 'Oceania & Polar',
        sections: [
          {
            subheading: 'Australia & Oceania',
            links: [
              { label: 'Australia', region: 'Australia', search: 'Australia' },
              { label: 'New Zealand', region: 'Australia', search: 'New Zealand' },
              { label: 'Fiji & Bora Bora (combo)', region: 'Australia', search: 'Fiji' },
              { label: 'Australia - New Zealand (combo)', region: 'Australia', search: 'Australia' },
            ]
          },
          {
            subheading: 'Antarctica',
            links: [
              { label: 'Antarctica Polar Expedition', region: 'Antarctica', search: 'Antarctica' },
              { label: 'South Georgia Voyage', region: 'Antarctica', search: 'South Georgia' },
            ]
          }
        ]
      }
    ]
  },
]

export default function MegaNavBar({ activePage, onNavigate, isMobile = false, compact = false }) {
  const [popularExpeditions, setPopularExpeditions] = useState([
    { label: 'Greece & Turkey Odyssey', page: 'destinations', region: 'Europe', search: 'Greece' },
    { label: 'Northern Lights Iceland', page: 'destinations', region: 'Europe', search: 'Iceland' },
    { label: 'Tuscany Gourmet Trail', page: 'destinations', region: 'Europe', search: 'Tuscany' },
    { label: 'Kerala Backwaters Group', page: 'destinations', region: 'Asia', search: 'Kerala' },
  ])

  useEffect(() => {
    fetch(`${API_URL}/api/packages`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const groupPkgs = data.slice(0, 5).map((p) => ({
            label: p.name,
            page: 'destinations',
            region: p.region || 'All',
            search: p.name
          }))
          setPopularExpeditions(groupPkgs)
        }
      })
      .catch(() => {})
  }, [])

  const navConfig = useMemo(() => {
    const groupToursConfig = {
      id: 'group_tours',
      label: 'Group Tours',
      columns: [
        {
          heading: 'By Speciality',
          links: [
            { label: 'Photography Expeditions', page: 'destinations', region: 'All', search: 'Photography' },
            { label: 'Culinary & Wine Trails', page: 'destinations', region: 'All', search: 'Culinary' },
            { label: 'Wildlife & Safari Groups', page: 'destinations', region: 'All', search: 'Wildlife' },
            { label: 'Cruise Voyages', page: 'destinations', region: 'All', search: 'Cruise' },
          ]
        },
        {
          heading: 'Popular Group Expeditions',
          links: popularExpeditions
        }
      ]
    }

    return [...MEGA_MENU_CONFIG, groupToursConfig]
  }, [popularExpeditions])

  if (isMobile) {
    return (
      <div className="space-y-1">
        {navConfig.map((cat) => (
          <MegaMenu
            key={cat.id}
            label={cat.label}
            columns={cat.columns}
            onNavigate={onNavigate}
            isMobile
          />
        ))}
        <NavLink
          active={activePage === 'corporate'}
          onClick={() => onNavigate('corporate')}
          label="Corporate Travel"
          isMobile
        />
        <NavLink
          active={activePage === 'booking'}
          onClick={() => onNavigate('booking')}
          label="Gift Cards"
          isMobile
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2 py-0.5">
      {navConfig.map((cat) => (
        <MegaMenu
          key={cat.id}
          label={cat.label}
          columns={cat.columns}
          onNavigate={onNavigate}
          compact={compact}
        />
      ))}
      <NavLink
        active={activePage === 'corporate'}
        onClick={() => onNavigate('corporate')}
        label="Corporate Travel"
        compact={compact}
      />
      <NavLink
        active={activePage === 'booking'}
        onClick={() => onNavigate('booking')}
        label="Gift Cards"
        compact={compact}
      />
    </div>
  )
}

function NavLink({ active, onClick, label, isMobile = false, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={
        isMobile
          ? `w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
              active
                ? 'text-amber-400 bg-white/10 font-semibold'
                : 'text-stone-200 hover:text-white hover:bg-white/10'
            }`
          : `rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm tracking-wide ${
              compact ? 'px-3 py-1.5' : 'px-3.5 py-2'
            } ${
              active
                ? 'text-amber-400 bg-white/10 font-semibold'
                : 'text-stone-200 hover:text-white hover:bg-white/10'
            }`
      }
    >
      {label}
    </button>
  )
}
