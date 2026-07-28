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
          { label: 'Punjab', region: 'Asia', search: 'Punjab' },
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
          { label: 'Maharashtra', region: 'Asia', search: 'Maharashtra' },
        ]
      },
      {
        heading: 'South India',
        links: [
          { label: 'Kerala Backwaters', region: 'Asia', search: 'Kerala' },
          { label: 'Karnataka Hills', region: 'Asia', search: 'Karnataka' },
          { label: 'Tamil Nadu Temples', region: 'Asia', search: 'Tamil Nadu' },
          { label: 'Andaman Islands', region: 'Asia', search: 'Andaman' },
          { label: 'Lakshadweep', region: 'Asia', search: 'Lakshadweep' },
          { label: 'Pondicherry', region: 'Asia', search: 'Pondicherry' },
        ]
      },
      {
        heading: 'East & North-East',
        links: [
          { label: 'Sikkim & Darjeeling', region: 'Asia', search: 'Sikkim' },
          { label: 'Meghalaya', region: 'Asia', search: 'Meghalaya' },
          { label: 'Assam', region: 'Asia', search: 'Assam' },
          { label: 'Arunachal Pradesh', region: 'Asia', search: 'Arunachal' },
          { label: 'Nagaland', region: 'Asia', search: 'Nagaland' },
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
          { label: 'Thailand', region: 'Asia', search: 'Thailand' },
          { label: 'Bali (Indonesia)', region: 'Asia', search: 'Bali' },
          { label: 'Vietnam', region: 'Asia', search: 'Vietnam' },
          { label: 'Singapore', region: 'Asia', search: 'Singapore' },
          { label: 'Malaysia', region: 'Asia', search: 'Malaysia' },
          { label: 'Philippines', region: 'Asia', search: 'Philippines' },
          { label: 'Cambodia', region: 'Asia', search: 'Cambodia' },
          { label: 'Myanmar', region: 'Asia', search: 'Myanmar' },
          { label: 'Laos', region: 'Asia', search: 'Laos' },
          { label: 'Sri Lanka', region: 'Asia', search: 'Sri Lanka' },
          { label: 'Maldives', region: 'Asia', search: 'Maldives' },
          { label: 'Nepal', region: 'Asia', search: 'Nepal' },
          { label: 'Bhutan', region: 'Asia', search: 'Bhutan' },
          { label: 'Japan', region: 'Asia', search: 'Japan' },
          { label: 'South Korea', region: 'Asia', search: 'South Korea' },
          { label: 'China', region: 'Asia', search: 'China' },
          { label: 'Hong Kong', region: 'Asia', search: 'Hong Kong' },
          { label: 'Macau', region: 'Asia', search: 'Macau' },
          { label: 'Taiwan', region: 'Asia', search: 'Taiwan' },
          { label: 'Mongolia', region: 'Asia', search: 'Mongolia' },
          { label: 'UAE – Dubai', region: 'Asia', search: 'Dubai' },
          { label: 'Abu Dhabi', region: 'Asia', search: 'Abu Dhabi' },
          { label: 'Saudi Arabia', region: 'Asia', search: 'Saudi' },
          { label: 'Oman', region: 'Asia', search: 'Oman' },
          { label: 'Jordan', region: 'Asia', search: 'Jordan' },
          { label: 'Israel', region: 'Asia', search: 'Israel' },
          { label: 'Qatar', region: 'Asia', search: 'Qatar' },
          { label: 'Bahrain', region: 'Asia', search: 'Bahrain' },
          { label: 'Georgia', region: 'Asia', search: 'Georgia' },
          { label: 'Azerbaijan', region: 'Asia', search: 'Azerbaijan' },
          { label: 'Armenia', region: 'Asia', search: 'Armenia' },
          { label: 'Uzbekistan', region: 'Asia', search: 'Uzbekistan' },
          { label: 'Kazakhstan', region: 'Asia', search: 'Kazakhstan' },
          { label: 'Singapore + Malaysia', region: 'Asia', search: 'Singapore' },
          { label: 'Singapore + Bali', region: 'Asia', search: 'Bali' },
          { label: 'Japan + South Korea', region: 'Asia', search: 'Japan' },
          { label: 'Israel + Jordan', region: 'Asia', search: 'Israel' },
        ]
      },
      {
        heading: 'Europe',
        links: [
          { label: 'Switzerland', region: 'Europe', search: 'Switzerland' },
          { label: 'France', region: 'Europe', search: 'France' },
          { label: 'Italy', region: 'Europe', search: 'Italy' },
          { label: 'Spain', region: 'Europe', search: 'Spain' },
          { label: 'Portugal', region: 'Europe', search: 'Portugal' },
          { label: 'Germany', region: 'Europe', search: 'Germany' },
          { label: 'Netherlands', region: 'Europe', search: 'Netherlands' },
          { label: 'Belgium', region: 'Europe', search: 'Belgium' },
          { label: 'Austria', region: 'Europe', search: 'Austria' },
          { label: 'United Kingdom', region: 'Europe', search: 'UK' },
          { label: 'Scotland', region: 'Europe', search: 'Scotland' },
          { label: 'Ireland', region: 'Europe', search: 'Ireland' },
          { label: 'Greece', region: 'Europe', search: 'Greece' },
          { label: 'Turkey', region: 'Europe', search: 'Turkey' },
          { label: 'Croatia', region: 'Europe', search: 'Croatia' },
          { label: 'Czech Republic', region: 'Europe', search: 'Czech' },
          { label: 'Hungary', region: 'Europe', search: 'Hungary' },
          { label: 'Poland', region: 'Europe', search: 'Poland' },
          { label: 'Russia', region: 'Europe', search: 'Russia' },
          { label: 'Romania', region: 'Europe', search: 'Romania' },
          { label: 'Bulgaria', region: 'Europe', search: 'Bulgaria' },
          { label: 'Baltic States', region: 'Europe', search: 'Baltic' },
          { label: 'Norway', region: 'Europe', search: 'Norway' },
          { label: 'Iceland', region: 'Europe', search: 'Iceland' },
          { label: 'Finland', region: 'Europe', search: 'Finland' },
          { label: 'Sweden', region: 'Europe', search: 'Sweden' },
          { label: 'Denmark', region: 'Europe', search: 'Denmark' },
          { label: 'Switzerland + Paris', region: 'Europe', search: 'Paris' },
          { label: 'UK + Scotland', region: 'Europe', search: 'Scotland' },
          { label: 'Greece + Turkey', region: 'Europe', search: 'Greece' },
          { label: 'Scandinavia Circuit', region: 'Europe', search: 'Scandinavia' },
          { label: 'All of Europe', region: 'Europe', search: 'Europe' },
          { label: 'All of Eastern Europe', region: 'Europe', search: 'East Europe' },
        ]
      },
      {
        heading: 'Africa',
        links: [
          { label: 'South Africa', region: 'Africa', search: 'South Africa' },
          { label: 'Kenya', region: 'Africa', search: 'Kenya' },
          { label: 'Tanzania', region: 'Africa', search: 'Tanzania' },
          { label: 'Morocco', region: 'Africa', search: 'Morocco' },
          { label: 'Egypt', region: 'Africa', search: 'Egypt' },
          { label: 'Mauritius', region: 'Africa', search: 'Mauritius' },
          { label: 'Seychelles', region: 'Africa', search: 'Seychelles' },
          { label: 'Madagascar', region: 'Africa', search: 'Madagascar' },
          { label: 'Zimbabwe', region: 'Africa', search: 'Zimbabwe' },
          { label: 'Zambia', region: 'Africa', search: 'Zambia' },
          { label: 'Botswana', region: 'Africa', search: 'Botswana' },
          { label: 'Namibia', region: 'Africa', search: 'Namibia' },
          { label: 'Rwanda', region: 'Africa', search: 'Rwanda' },
          { label: 'Ethiopia', region: 'Africa', search: 'Ethiopia' },
          { label: 'Tunisia', region: 'Africa', search: 'Tunisia' },
        ]
      },
      {
        heading: 'North America',
        links: [
          { label: 'USA', region: 'North America', search: 'USA' },
          { label: 'Canada', region: 'North America', search: 'Canada' },
          { label: 'Alaska', region: 'North America', search: 'Alaska' },
          { label: 'Hawaii', region: 'North America', search: 'Hawaii' },
          { label: 'Mexico', region: 'North America', search: 'Mexico' },
          { label: 'Costa Rica', region: 'North America', search: 'Costa Rica' },
          { label: 'Cuba', region: 'North America', search: 'Cuba' },
          { label: 'Caribbean', region: 'North America', search: 'Caribbean' },
          { label: 'Panama', region: 'North America', search: 'Panama' },
          { label: 'Jamaica', region: 'North America', search: 'Jamaica' },
          { label: 'Bahamas', region: 'North America', search: 'Bahamas' },
        ]
      },
      {
        heading: 'South America',
        links: [
          { label: 'Brazil', region: 'South America', search: 'Brazil' },
          { label: 'Argentina', region: 'South America', search: 'Argentina' },
          { label: 'Peru', region: 'South America', search: 'Peru' },
          { label: 'Chile', region: 'South America', search: 'Chile' },
          { label: 'Colombia', region: 'South America', search: 'Colombia' },
          { label: 'Ecuador & Galápagos', region: 'South America', search: 'Ecuador' },
          { label: 'Bolivia', region: 'South America', search: 'Bolivia' },
          { label: 'Uruguay', region: 'South America', search: 'Uruguay' },
          { label: 'Venezuela', region: 'South America', search: 'Venezuela' },
          { label: 'Patagonia', region: 'South America', search: 'Patagonia' },
        ]
      },
      {
        heading: 'Australia & Oceania',
        links: [
          { label: 'Australia', region: 'Australia', search: 'Australia' },
          { label: 'New Zealand', region: 'Australia', search: 'New Zealand' },
          { label: 'Fiji', region: 'Australia', search: 'Fiji' },
          { label: 'Bora Bora', region: 'Australia', search: 'Bora Bora' },
          { label: 'Tahiti', region: 'Australia', search: 'Tahiti' },
          { label: 'Papua New Guinea', region: 'Australia', search: 'Papua New Guinea' },
          { label: 'Samoa', region: 'Australia', search: 'Samoa' },
          { label: 'Australia + New Zealand', region: 'Australia', search: 'Australia' },
          { label: 'Fiji + Bora Bora', region: 'Australia', search: 'Fiji' },
        ]
      },
      {
        heading: 'Antarctica',
        links: [
          { label: 'Antarctica Expedition', region: 'Antarctica', search: 'Antarctica' },
          { label: 'South Georgia Voyage', region: 'Antarctica', search: 'South Georgia' },
          { label: 'Arctic & Svalbard', region: 'Antarctica', search: 'Arctic' },
          { label: 'Antarctic Peninsula', region: 'Antarctica', search: 'Antarctic Peninsula' },
          { label: 'Ross Sea Explorer', region: 'Antarctica', search: 'Ross Sea' },
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
          ? `w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-all flex items-center justify-between ${
              active
                ? 'text-amber-400 bg-white/10 font-semibold'
                : 'text-stone-200 hover:text-white hover:bg-white/10'
            }`
          : `rounded-lg font-medium transition-all duration-200 text-[15px] tracking-wide ${
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
