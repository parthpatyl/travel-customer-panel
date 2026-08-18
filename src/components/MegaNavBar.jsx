import { useState, useEffect, useMemo } from 'react'
import MegaMenu from './MegaMenu'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const MEGA_MENU_CONFIG = [
  {
    id: 'india',
    label: 'India',
    isSplit: true,
    topTabs: [
      { label: 'Top Recommended Destinations', continentId: 'north' },
      { label: 'North India', continentId: 'north' },
      { label: 'South India', continentId: 'south' },
      { label: 'West & Central', continentId: 'west-central' },
      { label: 'East & North-East', continentId: 'east-ne' },
      { label: 'Islands & UTs', continentId: 'islands' },
    ],
    continents: [
      {
        id: 'north',
        name: 'North India',
        allLink: { label: 'All of North India', region: 'Asia', search: 'North India' },
        countries: [
          {
            name: 'Jammu & Kashmir',
            cities: [
              { label: 'Srinagar', search: 'Srinagar' },
              { label: 'Gulmarg', search: 'Gulmarg' },
              { label: 'Pahalgam', search: 'Pahalgam' },
              { label: 'Sonamarg', search: 'Sonamarg' }
            ]
          },
          {
            name: 'Himachal Pradesh',
            cities: [
              { label: 'Manali', search: 'Manali' },
              { label: 'Shimla', search: 'Shimla' },
              { label: 'Dharamshala', search: 'Dharamshala' },
              { label: 'Dalhousie', search: 'Dalhousie' },
              { label: 'Spiti Valley', search: 'Spiti' }
            ]
          },
          {
            name: 'Ladakh',
            cities: [
              { label: 'Leh', search: 'Leh' },
              { label: 'Nubra Valley', search: 'Nubra' },
              { label: 'Pangong Tso', search: 'Pangong' }
            ]
          },
          {
            name: 'Uttarakhand',
            cities: [
              { label: 'Rishikesh', search: 'Rishikesh' },
              { label: 'Nainital', search: 'Nainital' },
              { label: 'Mussoorie', search: 'Mussoorie' },
              { label: 'Auli', search: 'Auli' },
              { label: 'Jim Corbett', search: 'Corbett' }
            ]
          },
          {
            name: 'Punjab & Delhi',
            cities: [
              { label: 'Amritsar', search: 'Amritsar' },
              { label: 'New Delhi', search: 'Delhi' },
              { label: 'Chandigarh', search: 'Chandigarh' }
            ]
          },
          {
            name: 'Rajasthan',
            cities: [
              { label: 'Jaipur', search: 'Jaipur' },
              { label: 'Udaipur', search: 'Udaipur' },
              { label: 'Jaisalmer', search: 'Jaisalmer' },
              { label: 'Jodhpur', search: 'Jodhpur' },
              { label: 'Pushkar', search: 'Pushkar' }
            ]
          },
          {
            name: 'Uttar Pradesh',
            cities: [
              { label: 'Varanasi', search: 'Varanasi' },
              { label: 'Agra', search: 'Agra' },
              { label: 'Lucknow', search: 'Lucknow' },
              { label: 'Ayodhya', search: 'Ayodhya' }
            ]
          }
        ]
      },
      {
        id: 'south',
        name: 'South India',
        allLink: { label: 'All of South India', region: 'Asia', search: 'South India' },
        countries: [
          {
            name: 'Kerala',
            cities: [
              { label: 'Munnar', search: 'Munnar' },
              { label: 'Alleppey', search: 'Alleppey' },
              { label: 'Kochi', search: 'Kochi' },
              { label: 'Wayanad', search: 'Wayanad' },
              { label: 'Kovalam', search: 'Kovalam' }
            ]
          },
          {
            name: 'Karnataka',
            cities: [
              { label: 'Coorg', search: 'Coorg' },
              { label: 'Mysore', search: 'Mysore' },
              { label: 'Bengaluru', search: 'Bangalore' },
              { label: 'Hampi', search: 'Hampi' },
              { label: 'Chikmagalur', search: 'Chikmagalur' }
            ]
          },
          {
            name: 'Tamil Nadu',
            cities: [
              { label: 'Ooty', search: 'Ooty' },
              { label: 'Kodaikanal', search: 'Kodaikanal' },
              { label: 'Rameswaram', search: 'Rameswaram' },
              { label: 'Madurai', search: 'Madurai' },
              { label: 'Mahabalipuram', search: 'Mahabalipuram' }
            ]
          },
          {
            name: 'Andhra & Telangana',
            cities: [
              { label: 'Hyderabad', search: 'Hyderabad' },
              { label: 'Visakhapatnam', search: 'Vizag' },
              { label: 'Tirupati', search: 'Tirupati' },
              { label: 'Araku Valley', search: 'Araku' }
            ]
          }
        ]
      },
      {
        id: 'west-central',
        name: 'West & Central',
        allLink: { label: 'All of West & Central', region: 'Asia', search: 'West India' },
        countries: [
          {
            name: 'Goa',
            cities: [
              { label: 'North Goa', search: 'North Goa' },
              { label: 'South Goa', search: 'South Goa' },
              { label: 'Panaji', search: 'Panaji' },
              { label: 'Dudhsagar', search: 'Dudhsagar' }
            ]
          },
          {
            name: 'Maharashtra',
            cities: [
              { label: 'Mumbai', search: 'Mumbai' },
              { label: 'Lonavala', search: 'Lonavala' },
              { label: 'Mahabaleshwar', search: 'Mahabaleshwar' },
              { label: 'Nashik', search: 'Nashik' },
              { label: 'Ajanta & Ellora', search: 'Ellora' }
            ]
          },
          {
            name: 'Gujarat',
            cities: [
              { label: 'Rann of Kutch', search: 'Kutch' },
              { label: 'Gir National Park', search: 'Gir' },
              { label: 'Statue of Unity', search: 'Statue of Unity' },
              { label: 'Ahmedabad', search: 'Ahmedabad' }
            ]
          },
          {
            name: 'Madhya Pradesh',
            cities: [
              { label: 'Khajuraho', search: 'Khajuraho' },
              { label: 'Bandhavgarh', search: 'Bandhavgarh' },
              { label: 'Kanha', search: 'Kanha' },
              { label: 'Pachmarhi', search: 'Pachmarhi' },
              { label: 'Ujjain', search: 'Ujjain' }
            ]
          }
        ]
      },
      {
        id: 'east-ne',
        name: 'East & North-East',
        allLink: { label: 'All of East & North-East', region: 'Asia', search: 'North East' },
        countries: [
          {
            name: 'Sikkim',
            cities: [
              { label: 'Gangtok', search: 'Gangtok' },
              { label: 'Pelling', search: 'Pelling' },
              { label: 'Lachen & Lachung', search: 'Lachung' },
              { label: 'Nathula Pass', search: 'Nathula' }
            ]
          },
          {
            name: 'West Bengal',
            cities: [
              { label: 'Darjeeling', search: 'Darjeeling' },
              { label: 'Kolkata', search: 'Kolkata' },
              { label: 'Sundarbans', search: 'Sundarbans' },
              { label: 'Kalimpong', search: 'Kalimpong' }
            ]
          },
          {
            name: 'Meghalaya',
            cities: [
              { label: 'Shillong', search: 'Shillong' },
              { label: 'Cherrapunji', search: 'Cherrapunji' },
              { label: 'Dawki', search: 'Dawki' }
            ]
          },
          {
            name: 'Assam',
            cities: [
              { label: 'Guwahati', search: 'Guwahati' },
              { label: 'Kaziranga', search: 'Kaziranga' },
              { label: 'Majuli', search: 'Majuli' }
            ]
          },
          {
            name: 'Arunachal & Nagaland',
            cities: [
              { label: 'Tawang', search: 'Tawang' },
              { label: 'Ziro Valley', search: 'Ziro' },
              { label: 'Kohima', search: 'Kohima' }
            ]
          },
          {
            name: 'Odisha',
            cities: [
              { label: 'Puri', search: 'Puri' },
              { label: 'Bhubaneswar', search: 'Bhubaneswar' },
              { label: 'Chilika Lake', search: 'Chilika' }
            ]
          }
        ]
      },
      {
        id: 'islands',
        name: 'Islands & UTs',
        allLink: { label: 'All Islands & UTs', region: 'Asia', search: 'Andaman' },
        countries: [
          {
            name: 'Andaman & Nicobar',
            cities: [
              { label: 'Port Blair', search: 'Port Blair' },
              { label: 'Havelock Island', search: 'Havelock' },
              { label: 'Neil Island', search: 'Neil Island' },
              { label: 'Baratang', search: 'Baratang' }
            ]
          },
          {
            name: 'Lakshadweep',
            cities: [
              { label: 'Agatti Island', search: 'Agatti' },
              { label: 'Bangaram Island', search: 'Bangaram' },
              { label: 'Kavaratti', search: 'Kavaratti' }
            ]
          },
          {
            name: 'Puducherry & Daman',
            cities: [
              { label: 'Pondicherry', search: 'Pondicherry' },
              { label: 'Auroville', search: 'Auroville' },
              { label: 'Daman & Diu', search: 'Daman' }
            ]
          }
        ]
      }
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
          heading: 'Scheduled Departures',
          links: [
            { label: 'View All Scheduled Departures', page: 'group-tours', region: 'All' },
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
          active={activePage === 'group-tours'}
          onClick={() => onNavigate('group-tours')}
          label="Scheduled Departures"
          isMobile
        />
        <NavLink
          active={activePage === 'corporate'}
          onClick={() => onNavigate('corporate')}
          label="Corporate Travel"
          isMobile
        />
        <NavLink
          active={activePage === 'gallery'}
          onClick={() => onNavigate('gallery')}
          label="Stories & Gallery"
          isMobile
        />
        <NavLink
          active={activePage === 'giftcards'}
          onClick={() => onNavigate('giftcards')}
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
        active={activePage === 'gallery'}
        onClick={() => onNavigate('gallery')}
        label="Stories & Gallery"
        compact={compact}
      />
      <NavLink
        active={activePage === 'giftcards'}
        onClick={() => onNavigate('giftcards')}
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
