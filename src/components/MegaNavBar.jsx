import { useState, useEffect, useMemo } from 'react'
import MegaMenu from './MegaMenu'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
    isSplit: true,
    topTabs: [
      { label: 'Top Recommended Destinations', continentId: 'europe' },
      { label: 'Europe', continentId: 'europe' },
      { label: 'South East Asia', continentId: 'asia' },
      { label: 'Australia New Zealand', continentId: 'australia' },
      { label: 'America', continentId: 'america' },
      { label: 'Africa', continentId: 'africa' },
      { label: 'Japan China Korea Taiwan', continentId: 'asia' },
    ],
    continents: [
      {
        id: 'africa',
        name: 'Africa',
        allLink: { label: 'All of Africa', region: 'Africa', search: 'Africa' },
        countries: [
          {
            name: 'Egypt',
            cities: [
              { label: 'Alexandria', search: 'Alexandria' },
              { label: 'Aswan', search: 'Aswan' },
              { label: 'Cairo', search: 'Cairo' },
              { label: 'Hurghada', search: 'Hurghada' },
              { label: 'Luxor', search: 'Luxor' },
              { label: 'Nile Cruise', search: 'Nile Cruise' }
            ]
          },
          {
            name: 'Kenya',
            cities: [
              { label: 'Masai Mara', search: 'Masai Mara' }
            ]
          },
          {
            name: 'Mauritius',
            cities: [
              { label: 'Port Louis', search: 'Port Louis' }
            ]
          },
          {
            name: 'Seychelles',
            cities: []
          },
          {
            name: 'South Africa',
            cities: [
              { label: 'Cape Town', search: 'Cape Town' },
              { label: 'George', search: 'George' },
              { label: 'Johannesburg', search: 'Johannesburg' },
              { label: 'Knysna', search: 'Knysna' },
              { label: 'Mossel Bay', search: 'Mossel Bay' },
              { label: 'Oudtshoorn', search: 'Oudtshoorn' },
              { label: 'Pilanesberg National Park', search: 'Pilanesberg' },
              { label: 'Port Elizabeth (Gqeberha)', search: 'Port Elizabeth' },
              { label: 'Stellenbosch', search: 'Stellenbosch' },
              { label: 'Sun City', search: 'Sun City' }
            ]
          },
          {
            name: 'Tanzania',
            cities: []
          },
          {
            name: 'Zimbabwe',
            cities: [
              { label: 'Victoria Falls', search: 'Victoria Falls' }
            ]
          }
        ]
      },
      {
        id: 'america',
        name: 'America',
        allLink: { label: 'All of America', region: 'North America', search: 'America' },
        countries: [
          {
            name: 'USA',
            cities: [
              { label: 'New York', search: 'New York' },
              { label: 'Los Angeles', search: 'Los Angeles' },
              { label: 'Las Vegas', search: 'Las Vegas' },
              { label: 'Orlando', search: 'Orlando' },
              { label: 'San Francisco', search: 'San Francisco' },
              { label: 'Miami', search: 'Miami' },
              { label: 'Hawaii', search: 'Hawaii' },
              { label: 'Alaska', search: 'Alaska' }
            ]
          },
          {
            name: 'Canada',
            cities: [
              { label: 'Toronto', search: 'Toronto' },
              { label: 'Vancouver', search: 'Vancouver' },
              { label: 'Montreal', search: 'Montreal' },
              { label: 'Banff', search: 'Banff' }
            ]
          },
          {
            name: 'Mexico & Central America',
            cities: [
              { label: 'Cancun', search: 'Cancun' },
              { label: 'Mexico City', search: 'Mexico City' },
              { label: 'Costa Rica', search: 'Costa Rica' },
              { label: 'Panama', search: 'Panama' }
            ]
          },
          {
            name: 'South America',
            cities: [
              { label: 'Rio de Janeiro', search: 'Rio de Janeiro' },
              { label: 'Buenos Aires', search: 'Buenos Aires' },
              { label: 'Cusco (Machu Picchu)', search: 'Machu Picchu' },
              { label: 'Patagonia', search: 'Patagonia' }
            ]
          }
        ]
      },
      {
        id: 'asia',
        name: 'Asia',
        allLink: { label: 'All of Asia', region: 'Asia', search: 'Asia' },
        countries: [
          {
            name: 'Thailand',
            cities: [
              { label: 'Bangkok', search: 'Bangkok' },
              { label: 'Phuket', search: 'Phuket' },
              { label: 'Pattaya', search: 'Pattaya' },
              { label: 'Chiang Mai', search: 'Chiang Mai' },
              { label: 'Krabi', search: 'Krabi' }
            ]
          },
          {
            name: 'Indonesia (Bali)',
            cities: [
              { label: 'Ubud', search: 'Ubud' },
              { label: 'Seminyak', search: 'Seminyak' },
              { label: 'Nusa Penida', search: 'Nusa Penida' },
              { label: 'Kuta', search: 'Kuta' }
            ]
          },
          {
            name: 'Vietnam & Cambodia',
            cities: [
              { label: 'Hanoi', search: 'Hanoi' },
              { label: 'Ha Long Bay', search: 'Ha Long' },
              { label: 'Da Nang', search: 'Da Nang' },
              { label: 'Siem Reap', search: 'Siem Reap' }
            ]
          },
          {
            name: 'Singapore & Malaysia',
            cities: [
              { label: 'Singapore', search: 'Singapore' },
              { label: 'Kuala Lumpur', search: 'Kuala Lumpur' },
              { label: 'Langkawi', search: 'Langkawi' },
              { label: 'Penang', search: 'Penang' }
            ]
          },
          {
            name: 'Japan & East Asia',
            cities: [
              { label: 'Tokyo', search: 'Tokyo' },
              { label: 'Kyoto', search: 'Kyoto' },
              { label: 'Osaka', search: 'Osaka' },
              { label: 'Seoul', search: 'Seoul' },
              { label: 'Beijing', search: 'Beijing' },
              { label: 'Hong Kong', search: 'Hong Kong' },
              { label: 'Taipei', search: 'Taipei' }
            ]
          },
          {
            name: 'South Asia & Island Havens',
            cities: [
              { label: 'Sri Lanka', search: 'Sri Lanka' },
              { label: 'Maldives', search: 'Maldives' },
              { label: 'Nepal', search: 'Nepal' },
              { label: 'Bhutan', search: 'Bhutan' }
            ]
          }
        ]
      },
      {
        id: 'australia',
        name: 'Australia & New Zealand',
        allLink: { label: 'All of Australia & NZ', region: 'Australia', search: 'Australia' },
        countries: [
          {
            name: 'Australia',
            cities: [
              { label: 'Sydney', search: 'Sydney' },
              { label: 'Melbourne', search: 'Melbourne' },
              { label: 'Gold Coast', search: 'Gold Coast' },
              { label: 'Cairns & Reef', search: 'Cairns' },
              { label: 'Perth', search: 'Perth' }
            ]
          },
          {
            name: 'New Zealand',
            cities: [
              { label: 'Auckland', search: 'Auckland' },
              { label: 'Queenstown', search: 'Queenstown' },
              { label: 'Christchurch', search: 'Christchurch' },
              { label: 'Rotorua', search: 'Rotorua' }
            ]
          },
          {
            name: 'Pacific Islands',
            cities: [
              { label: 'Fiji', search: 'Fiji' },
              { label: 'Bora Bora', search: 'Bora Bora' },
              { label: 'Tahiti', search: 'Tahiti' }
            ]
          }
        ]
      },
      {
        id: 'europe',
        name: 'Europe',
        allLink: { label: 'All of Europe', region: 'Europe', search: 'Europe' },
        countries: [
          {
            name: 'Switzerland & Alps',
            cities: [
              { label: 'Zurich', search: 'Zurich' },
              { label: 'Geneva', search: 'Geneva' },
              { label: 'Interlaken', search: 'Interlaken' },
              { label: 'Lucerne', search: 'Lucerne' },
              { label: 'Zermatt', search: 'Zermatt' }
            ]
          },
          {
            name: 'France',
            cities: [
              { label: 'Paris', search: 'Paris' },
              { label: 'Nice', search: 'Nice' },
              { label: 'Lyon', search: 'Lyon' },
              { label: 'French Riviera', search: 'French Riviera' }
            ]
          },
          {
            name: 'Italy',
            cities: [
              { label: 'Rome', search: 'Rome' },
              { label: 'Florence', search: 'Florence' },
              { label: 'Venice', search: 'Venice' },
              { label: 'Milan', search: 'Milan' },
              { label: 'Amalfi Coast', search: 'Amalfi' },
              { label: 'Tuscany', search: 'Tuscany' }
            ]
          },
          {
            name: 'Spain & Portugal',
            cities: [
              { label: 'Barcelona', search: 'Barcelona' },
              { label: 'Madrid', search: 'Madrid' },
              { label: 'Seville', search: 'Seville' },
              { label: 'Ibiza', search: 'Ibiza' },
              { label: 'Lisbon', search: 'Lisbon' }
            ]
          },
          {
            name: 'United Kingdom & Ireland',
            cities: [
              { label: 'London', search: 'London' },
              { label: 'Edinburgh', search: 'Edinburgh' },
              { label: 'Highlands', search: 'Scotland' },
              { label: 'Dublin', search: 'Dublin' }
            ]
          },
          {
            name: 'Greece & Turkey',
            cities: [
              { label: 'Athens', search: 'Athens' },
              { label: 'Santorini', search: 'Santorini' },
              { label: 'Mykonos', search: 'Mykonos' },
              { label: 'Istanbul', search: 'Istanbul' },
              { label: 'Cappadocia', search: 'Cappadocia' }
            ]
          },
          {
            name: 'Nordics & Iceland',
            cities: [
              { label: 'Reykjavik', search: 'Reykjavik' },
              { label: 'Oslo', search: 'Oslo' },
              { label: 'Stockholm', search: 'Stockholm' },
              { label: 'Copenhagen', search: 'Copenhagen' },
              { label: 'Lapland', search: 'Lapland' }
            ]
          }
        ]
      },
      {
        id: 'middle_east',
        name: 'Middle East',
        allLink: { label: 'All of Middle East', region: 'Asia', search: 'Middle East' },
        countries: [
          {
            name: 'United Arab Emirates',
            cities: [
              { label: 'Dubai', search: 'Dubai' },
              { label: 'Abu Dhabi', search: 'Abu Dhabi' },
              { label: 'Sharjah', search: 'Sharjah' },
              { label: 'Ras Al Khaimah', search: 'Ras Al Khaimah' }
            ]
          },
          {
            name: 'Oman & Jordan',
            cities: [
              { label: 'Muscat', search: 'Muscat' },
              { label: 'Salalah', search: 'Salalah' },
              { label: 'Petra', search: 'Petra' },
              { label: 'Amman', search: 'Amman' },
              { label: 'Dead Sea', search: 'Dead Sea' }
            ]
          },
          {
            name: 'Saudi Arabia & Qatar',
            cities: [
              { label: 'Riyadh', search: 'Riyadh' },
              { label: 'Jeddah', search: 'Jeddah' },
              { label: 'AlUla', search: 'AlUla' },
              { label: 'Doha', search: 'Doha' }
            ]
          },
          {
            name: 'Georgia & Caucasus',
            cities: [
              { label: 'Tbilisi', search: 'Tbilisi' },
              { label: 'Batumi', search: 'Batumi' },
              { label: 'Baku', search: 'Baku' },
              { label: 'Yerevan', search: 'Yerevan' }
            ]
          }
        ]
      },
      {
        id: 'antarctica',
        name: 'Antarctica',
        allLink: { label: 'All Expeditions', region: 'Antarctica', search: 'Antarctica' },
        countries: [
          {
            name: 'Antarctica Voyages',
            cities: [
              { label: 'Antarctica Expedition', search: 'Antarctica' },
              { label: 'South Georgia Island', search: 'South Georgia' },
              { label: 'Falkland Islands', search: 'Falkland' },
              { label: 'Antarctic Peninsula', search: 'Antarctic Peninsula' },
              { label: 'Ross Sea Explorer', search: 'Ross Sea' }
            ]
          },
          {
            name: 'Arctic & Polar Expeditions',
            cities: [
              { label: 'Svalbard', search: 'Svalbard' },
              { label: 'Greenland', search: 'Greenland' },
              { label: 'North Pole Expedition', search: 'North Pole' }
            ]
          }
        ]
      }
    ]
  }
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
            isSplit={cat.isSplit}
            topTabs={cat.topTabs}
            continents={cat.continents}
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
          isSplit={cat.isSplit}
          topTabs={cat.topTabs}
          continents={cat.continents}
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
