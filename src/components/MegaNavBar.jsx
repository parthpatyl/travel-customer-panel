import MegaMenu from './MegaMenu'

const MEGA_MENU_CONFIG = [
  {
    id: 'international',
    label: 'International Trips',
    columns: [
      {
        heading: 'Asia',
        links: [
          { label: 'Vietnam', region: 'Asia' },
          { label: 'China', region: 'Asia' },
          { label: 'Hong Kong', region: 'Asia' },
          { label: 'Japan', region: 'Asia' },
          { label: 'Macau', region: 'Asia' },
          { label: 'Philippines', region: 'Asia' },
          { label: 'Bali', region: 'Asia' },
          { label: 'South Korea', region: 'Asia' },
          { label: 'Singapore Malaysia (combo)', region: 'Asia', search: 'Singapore' },
          { label: 'Singapore Bali (combo)', region: 'Asia', search: 'Bali' },
          { label: 'Maldives', region: 'Asia' },
          { label: 'Sri Lanka', region: 'Asia' },
          { label: 'Singapore', region: 'Asia' },
          { label: 'Malaysia', region: 'Asia' },
          { label: 'Thailand', region: 'Asia' },
        ]
      },
      {
        heading: 'Central Europe',
        links: [
          { label: 'Finland', region: 'Europe' },
          { label: 'France', region: 'Europe' },
          { label: 'Germany', region: 'Europe' },
          { label: 'Iceland', region: 'Europe' },
          { label: 'Italy', region: 'Europe' },
          { label: 'Norway', region: 'Europe' },
          { label: 'Portugal', region: 'Europe' },
          { label: 'Spain', region: 'Europe' },
          { label: 'Switzerland', region: 'Europe' },
          { label: 'UK - Scotland (combo)', region: 'Europe', search: 'Scotland' },
          { label: 'Netherlands', region: 'Europe' },
          { label: 'Switzerland - Paris (combo)', region: 'Europe', search: 'Switzerland Paris' },
          { label: 'All Of Europe (combo)', region: 'Europe', search: 'Europe' },
          { label: 'Ireland', region: 'Europe' },
          { label: 'Scandinavia', region: 'Europe' },
          { label: 'Austria', region: 'Europe' },
        ]
      },
      {
        heading: 'East Europe & Africa',
        sections: [
          {
            subheading: 'East Europe',
            links: [
              { label: 'Croatia', region: 'Europe' },
              { label: 'Czech Republic', region: 'Europe' },
              { label: 'Greece', region: 'Europe' },
              { label: 'Hungary', region: 'Europe' },
              { label: 'Poland', region: 'Europe' },
              { label: 'Russia', region: 'Europe' },
              { label: 'Turkey', region: 'Europe' },
              { label: 'Greece - Turkey (combo)', region: 'Europe', search: 'Greece' },
              { label: 'All of East Europe (combo)', region: 'Europe', search: 'East Europe' },
              { label: 'Baltic', region: 'Europe' },
            ]
          },
          {
            subheading: 'Africa',
            links: [
              { label: 'South Africa', region: 'Africa' },
              { label: 'Mauritius', region: 'Africa' },
              { label: 'Seychelles', region: 'Africa' },
              { label: 'Kenya', region: 'Africa' },
              { label: 'Tanzania', region: 'Africa' },
              { label: 'Zimbabwe', region: 'Africa' },
              { label: 'Zambia', region: 'Africa' },
              { label: 'Botswana', region: 'Africa' },
              { label: 'Uganda', region: 'Africa' },
              { label: 'Madagascar', region: 'Africa' },
              { label: 'Morocco', region: 'Africa' },
            ]
          },
        ]
      },
      {
        heading: 'Middle East & Americas',
        sections: [
          {
            subheading: 'Middle East',
            links: [
              { label: 'UAE - Dubai', region: 'Middle East', search: 'Dubai' },
              { label: 'Georgia', region: 'Middle East' },
              { label: 'Baku - Azerbaijan', region: 'Middle East', search: 'Azerbaijan' },
              { label: 'Armenia', region: 'Middle East' },
              { label: 'Uzbekistan', region: 'Middle East' },
              { label: 'Kazakhstan', region: 'Middle East' },
              { label: 'Israel - Jordan (combo)', region: 'Middle East', search: 'Israel' },
              { label: 'Oman Muscat', region: 'Middle East' },
              { label: 'Saudi Arabia', region: 'Middle East' },
            ]
          },
          {
            subheading: 'Americas',
            links: [
              { label: 'Central America', region: 'Americas' },
              { label: 'USA - United States', region: 'Americas', search: 'United States' },
              { label: 'Canada', region: 'Americas' },
              { label: 'Alaska', region: 'Americas' },
              { label: 'South America', region: 'Americas' },
              { label: 'Mexico', region: 'Americas' },
              { label: 'Hawaii', region: 'Americas' },
            ]
          },
        ]
      },
      {
        heading: 'Australia & Oceania',
        links: [
          { label: 'Australia', region: 'Australia' },
          { label: 'New Zealand', region: 'Australia' },
          { label: 'Fiji & Bora Bora (combo)', region: 'Australia', search: 'Fiji' },
          { label: 'Australia - New Zealand (combo)', region: 'Australia', search: 'Australia New Zealand' },
        ]
      },
    ]
  },
  {
    id: 'india',
    label: 'India Trips',
    columns: [
      {
        heading: 'North India',
        links: [
          { label: 'Kashmir', region: 'All' },
          { label: 'Leh', region: 'All' },
          { label: 'Himachal', region: 'All' },
          { label: 'Uttarakhand', region: 'All' },
          { label: 'Rajasthan', region: 'All' },
          { label: 'Uttar Pradesh', region: 'All' },
          { label: 'Golden Triangle (combo)', region: 'All' },
        ]
      },
      {
        heading: 'South India',
        links: [
          { label: 'Goa', region: 'All' },
          { label: 'Karnataka & South India', region: 'All' },
          { label: 'Kerala', region: 'All' },
          { label: 'North Kerala', region: 'All' },
          { label: 'Hyderabad', region: 'All' },
          { label: 'Andaman', region: 'All' },
          { label: 'Lakshadweep Island', region: 'All' },
        ]
      },
      {
        heading: 'East, NE & Beyond',
        links: [
          { label: 'Sikkim', region: 'All' },
          { label: 'Northeast', region: 'All' },
          { label: 'Odisha', region: 'All' },
          { label: 'Bhutan', region: 'All' },
          { label: 'Nepal', region: 'All' },
        ]
      },
      {
        heading: 'West & Central',
        links: [
          { label: 'Gujarat', region: 'All' },
          { label: 'Maharashtra', region: 'All' },
          { label: 'Madhya Pradesh', region: 'All' },
        ]
      },
    ]
  },
  {
    id: 'group-tours',
    label: 'Group Tours',
    columns: [
      {
        heading: 'By Duration',
        links: [
          { label: 'Weekend Trips (2-3 Days)', page: 'destinations' },
          { label: 'Short Escapes (4-6 Days)', page: 'destinations' },
          { label: 'Grand Tours (7+ Days)', page: 'destinations' },
        ]
      },
      {
        heading: 'By Theme',
        links: [
          { label: 'Adventure Tours', page: 'destinations' },
          { label: 'Cultural Tours', page: 'destinations' },
          { label: 'Wellness Retreats', page: 'luxury' },
        ]
      },
    ]
  },
  {
    id: 'events',
    label: 'Events & Festivals',
    columns: [
      {
        heading: 'India Festivals',
        links: [
          { label: 'Diwali Celebrations', page: 'destinations', region: 'All', search: 'Diwali' },
          { label: 'Holi Festival', page: 'destinations', region: 'All', search: 'Holi' },
        ]
      },
      {
        heading: 'Global Events',
        links: [
          { label: 'Oktoberfest', page: 'destinations', region: 'Europe', search: 'Oktoberfest' },
          { label: 'Cherry Blossom', page: 'destinations', region: 'Asia', search: 'Cherry Blossom' },
        ]
      },
    ]
  },
  {
    id: 'weekend',
    label: 'Weekend Getaways',
    columns: [
      {
        heading: 'Luxury Weekends',
        links: [
          { label: 'Premium Retreats', page: 'luxury' },
          { label: 'Spa & Wellness', page: 'luxury' },
        ]
      },
      {
        heading: 'Quick Escapes',
        links: [
          { label: 'Beach Getaways', page: 'destinations', region: 'Asia' },
          { label: 'Mountain Retreats', page: 'destinations', region: 'All' },
        ]
      },
    ]
  },
]

export default function MegaNavBar({ activePage, onNavigate, isMobile = false, compact = false }) {
  if (isMobile) {
    return (
      <div className="border-t border-stone-100 pt-2">
        <div className="space-y-0.5 pb-2 border-b border-stone-100">
          <NavLink active={activePage === 'luxury'} onClick={() => onNavigate('luxury')} label="Luxury Experiences" />
          <NavLink active={activePage === 'corporate'} onClick={() => onNavigate('corporate')} label="Corporate Tours" />
          <NavLink active={activePage === 'group-tours'} onClick={() => onNavigate('group-tours')} label="Upcoming Trips" />
        </div>
        {MEGA_MENU_CONFIG.map(cat => (
          <MegaMenu
            key={cat.id}
            label={cat.label}
            columns={cat.columns}
            onNavigate={onNavigate}
            isMobile
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5 py-0.5">
      <NavLink active={activePage === 'luxury'} onClick={() => onNavigate('luxury')} label="Luxury Experiences" compact={compact} />
      <NavLink active={activePage === 'corporate'} onClick={() => onNavigate('corporate')} label="Corporate Tours" compact={compact} />
      <NavLink active={activePage === 'group-tours'} onClick={() => onNavigate('group-tours')} label="Upcoming Trips" compact={compact} />
      {MEGA_MENU_CONFIG.map(cat => (
        <MegaMenu
          key={cat.id}
          label={cat.label}
          columns={cat.columns}
          onNavigate={onNavigate}
          compact={compact}
        />
      ))}
    </div>
  )
}

function NavLink({ active, onClick, label, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full font-medium transition-all duration-300 ${
        compact ? 'px-3 py-2 text-sm' : 'px-3 py-1.5 text-sm'
      } ${
        active
          ? 'text-amber-700 bg-amber-50'
          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
      }`}
    >
      {label}
    </button>
  )
}
