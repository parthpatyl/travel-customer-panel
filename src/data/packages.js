// Travel packages data — mirrors the admin dashboard's package catalog
// Extended with customer-facing fields: description, highlights, inclusions, exclusions

const packages = [
  {
    id: 'PKG-001',
    name: 'Kyoto Cultural Tour',
    duration: '7 Days',
    basePrice: 4800,
    region: 'Asia',
    slots: { booked: 18, total: 25 },
    trend: '+4 this week',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
    description: 'Immerse yourself in the ancient traditions and breathtaking beauty of Kyoto. From sacred temples draped in golden leaf to serene bamboo groves, this 7-day luxury cultural experience brings you face-to-face with Japan\'s living heritage.',
    highlights: [
      'Private tea ceremony with a certified master',
      'Guided walk through Higashiyama\'s preserved historic streets',
      'Golden Pavilion sunrise exclusive access',
      'Rickshaw ride through Arashiyama Bamboo Grove',
      'Traditional Kaiseki dinner at a Michelin-starred ryokan',
      'Hands-on pottery workshop with local artisans'
    ],
    inclusions: [
      'Luxury ryokan accommodation (6 nights)',
      'Private airport transfers via towncar',
      'Daily breakfast & 3 curated dinners',
      'English-speaking cultural guide',
      'All entrance fees and activity costs',
      'Complimentary kimono experience'
    ],
    exclusions: [
      'International flights',
      'Travel insurance',
      'Personal expenses & souvenirs',
      'Meals not mentioned in itinerary'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Welcome Tea Ceremony', desc: 'Transfer from Kansai Airport via private towncar to Ryokan Kurama. Evening welcome ceremony and Kaiseki dinner.' },
      { day: 2, title: 'Historic Higashiyama District Guided Walk', desc: 'Guided stroll through preserved streets. Visit Kiyomizu-dera Temple and participate in a pottery workshop.' },
      { day: 3, title: 'Golden Pavilion & Bamboo Groves', desc: 'Morning visit to Kinkaku-ji (Golden Pavilion), followed by private rickshaw ride through Arashiyama Bamboo Grove.' },
      { day: 4, title: 'Nara Day Trip — Ancient Temples & Deer Park', desc: 'Full-day excursion to Nara. Visit Todai-ji Temple, feed the sacred deer, and explore Kasuga Grand Shrine.' },
      { day: 5, title: 'Fushimi Inari & Sake District', desc: 'Morning hike through thousands of vermillion torii gates at Fushimi Inari. Afternoon sake tasting in the historic district.' },
      { day: 6, title: 'Geisha District & Farewell Dinner', desc: 'Explore Gion\'s atmospheric lanes. Optional maiko performance viewing. Farewell dinner at a riverside restaurant.' },
      { day: 7, title: 'Departure', desc: 'Leisurely morning at the ryokan. Private transfer to Kansai Airport for your departure.' },
    ]
  },
  {
    id: 'PKG-002',
    name: 'Swiss Alps Luxury Hiking',
    duration: '9 Days',
    basePrice: 3700,
    region: 'Europe',
    slots: { booked: 12, total: 15 },
    trend: 'Stable',
    heroImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    description: 'Conquer the Swiss Alps on this 9-day luxury hiking adventure. Trek beneath the iconic Matterhorn, ride the famous Gornergrat cogwheel railway, and unwind in world-class alpine lodges surrounded by pristine mountain wilderness.',
    highlights: [
      'Scenic helicopter transfer from Zurich to Zermatt',
      'Gornergrat cogwheel railway panoramic ride',
      'Guided Matterhorn-facing acclimatization hike',
      'Haute Route trail segments with alpine guide',
      'Swiss chocolate tasting in mountain village',
      'Glacier walk with certified mountaineer'
    ],
    inclusions: [
      '5-star alpine lodge accommodation (8 nights)',
      'Helicopter transfer Zurich → Zermatt',
      'All meals with Swiss wine pairings',
      'Certified alpine hiking guide throughout',
      'Gornergrat railway & cable car passes',
      'Emergency mountain rescue insurance'
    ],
    exclusions: [
      'International flights to Zurich',
      'Personal hiking gear & equipment',
      'Spa & wellness treatments',
      'Gratuities for guides'
    ],
    itinerary: [
      { day: 1, title: 'Zurich Arrival & Helicopter to Zermatt', desc: 'Arrival at Zurich Airport. Scenic helicopter transfer to Zermatt. Check-in at Mont Cervin Palace.' },
      { day: 2, title: 'Gornergrat Cogwheel & Matterhorn Views', desc: 'Ride the famous cogwheel railway. Moderate acclimatization hike facing the Matterhorn with private alpine guide.' },
      { day: 3, title: 'Five Lakes Trail', desc: 'Full-day hike along the spectacular Five Lakes Trail with panoramic views of 29 peaks over 4,000m.' },
      { day: 4, title: 'Glacier Paradise Excursion', desc: 'Cable car to Klein Matterhorn. Visit the Glacier Palace ice cave. Afternoon free in Zermatt village.' },
      { day: 5, title: 'Haute Route Segment — Zermatt to Grünsee', desc: 'Trek the legendary Haute Route. Picnic lunch at turquoise Grünsee lake with Matterhorn reflections.' },
    ]
  },
  {
    id: 'PKG-003',
    name: 'Maldives Overwater Resort Stay',
    duration: '5 Days',
    basePrice: 9800,
    region: 'Asia',
    slots: { booked: 8, total: 10 },
    trend: '+2 this week',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=600&q=80',
    description: 'Escape to paradise in the Maldives with a 5-day overwater villa experience. Crystal-clear turquoise waters, private decks with glass-floor panels, and world-class dining under the stars await you at one of the world\'s most exclusive resorts.',
    highlights: [
      'Overwater villa with private infinity pool',
      'Glass-floor panels for underwater viewing',
      'Sunset dolphin cruise on traditional dhoni',
      'Underwater restaurant dining experience',
      'Private snorkeling safari with marine biologist',
      'Couples spa treatment over the ocean'
    ],
    inclusions: [
      'Overwater villa accommodation (4 nights)',
      'VIP speedboat airport transfer',
      'Full-board gourmet dining (all meals)',
      'Sunset dolphin cruise',
      'Snorkeling equipment & guided safari',
      'In-villa minibar replenished daily'
    ],
    exclusions: [
      'International flights to Malé',
      'Scuba diving excursions',
      'Premium wine & champagne upgrades',
      'Travel insurance'
    ],
    itinerary: [
      { day: 1, title: 'Malé Speedboat Transfer to Resort', desc: 'Meet-and-greet at Malé airport. Premium speedboat transfer to Soneva Jani. Overwater villa check-in with champagne welcome.' },
      { day: 2, title: 'Snorkeling Safari & Spa Day', desc: 'Morning guided snorkeling with marine biologist. Afternoon couples spa treatment in the overwater pavilion.' },
      { day: 3, title: 'Island Exploration & Sunset Cruise', desc: 'Visit uninhabited sandbank island. Evening sunset dolphin cruise on a traditional Maldivian dhoni.' },
      { day: 4, title: 'Free Day & Underwater Dining', desc: 'Leisure day at the resort. Evening dinner at the underwater restaurant surrounded by coral reef fish.' },
      { day: 5, title: 'Departure', desc: 'Relaxed morning. Speedboat transfer back to Malé airport for departure.' },
    ]
  },
  {
    id: 'PKG-004',
    name: 'Tokyo Business Executive Package',
    duration: '4 Days',
    basePrice: 14500,
    region: 'Asia',
    slots: { booked: 15, total: 30 },
    trend: '+1 this week',
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    description: 'The ultimate executive travel experience in Tokyo. Designed for business leaders who demand the finest — from penthouse suites in Shinjuku to private kaiseki dinners with industry leaders, every detail is curated for maximum impact and efficiency.',
    highlights: [
      'Penthouse suite at Park Hyatt Tokyo',
      'Private executive sedan service 24/7',
      'Business lounge access at Narita/Haneda',
      'Private kaiseki dinner with concierge sommelier',
      'Optional Tokyo Stock Exchange tour',
      'High-speed Shinkansen experience to Hakone'
    ],
    inclusions: [
      'Penthouse suite accommodation (3 nights)',
      'VIP airport assistance & fast-track immigration',
      'Private executive sedan throughout stay',
      'Full-board dining at premium restaurants',
      'Business lounge membership card',
      'Mobile Wi-Fi hotspot device'
    ],
    exclusions: [
      'International flights',
      'Meeting room hire & AV equipment',
      'Personal shopping & entertainment',
      'Travel insurance'
    ],
    itinerary: [
      { day: 1, title: 'Shinjuku Penthouse & Business Lounge Access', desc: 'VIP airport assistance and premium executive sedan transfer to Park Hyatt Tokyo. Evening welcome reception.' },
      { day: 2, title: 'Business District Tour & Executive Dining', desc: 'Morning visit to Marunouchi financial district. Lunch at the Imperial Hotel. Afternoon meetings at private conference suite.' },
      { day: 3, title: 'Cultural Immersion & Farewell Dinner', desc: 'Morning visit to Meiji Shrine and Harajuku contrast walk. Farewell kaiseki dinner at 3-Michelin-star restaurant.' },
      { day: 4, title: 'Departure', desc: 'Executive sedan transfer to airport. VIP fast-track departure assistance.' },
    ]
  },
  {
    id: 'PKG-005',
    name: 'Swiss Alps Family Stay',
    duration: '6 Days',
    basePrice: 7400,
    region: 'Europe',
    slots: { booked: 5, total: 12 },
    trend: 'Stable',
    heroImage: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=600&q=80',
    description: 'Create unforgettable family memories in the Swiss Alps. This 6-day adventure combines gentle mountain trails, cheese-making workshops, and scenic train rides through some of the most spectacular landscapes in Europe — all tailored for families with children.',
    highlights: [
      'Scenic panoramic train through Bernese Oberland',
      'Family cheese-making workshop at alpine dairy',
      'Gentle mountain trail suitable for all ages',
      'Jungfraujoch "Top of Europe" excursion',
      'Traditional Swiss chalet accommodation',
      'Kids\' adventure park & supervised activities'
    ],
    inclusions: [
      'Family chalet accommodation (5 nights)',
      'Scenic train from Geneva to Grindelwald',
      'Full-board meals with kids\' menu options',
      'Family hiking guide for trail days',
      'Jungfraujoch railway tickets (family)',
      'Kids\' activity pack & adventure gear'
    ],
    exclusions: [
      'International flights to Geneva',
      'Travel insurance',
      'Baby equipment rental (cots available on request)',
      'Personal expenses'
    ],
    itinerary: [
      { day: 1, title: 'Geneva Arrival & Scenic Train to Grindelwald', desc: 'Scenic rail journey to Grindelwald through the Bernese Oberland. Check-in at traditional family chalet. Welcome dinner.' },
      { day: 2, title: 'Grindelwald First Adventure', desc: 'Cable car to First summit. Family cliff walk, eagle glider, and mountain cart descent. Afternoon free play at kids\' adventure park.' },
      { day: 3, title: 'Jungfraujoch — Top of Europe', desc: 'Full-day excursion to Jungfraujoch at 3,454m. Ice Palace visit, snow fun park, and Sphinx observation deck.' },
      { day: 4, title: 'Alpine Dairy & Cheese Workshop', desc: 'Morning visit to traditional alpine dairy. Hands-on cheese-making workshop. Afternoon gentle valley hike along glacial streams.' },
      { day: 5, title: 'Lake Brienz & Farewell Bonfire', desc: 'Boat cruise on turquoise Lake Brienz. Visit Giessbach Falls. Evening family bonfire at the chalet with hot chocolate.' },
      { day: 6, title: 'Departure', desc: 'Leisurely morning. Scenic train transfer back to Geneva airport.' },
    ]
  },
  {
    id: 'PKG-006',
    name: 'Santorini Romantic Getaway',
    duration: '6 Days',
    basePrice: 6200,
    region: 'Europe',
    slots: { booked: 10, total: 20 },
    trend: '+3 this week',
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80',
    description: 'The perfect romantic escape to the iconic white-washed cliffs of Santorini. Watch legendary sunsets from your private terrace, sail the caldera on a luxury catamaran, and savor authentic Greek cuisine paired with volcanic wines.',
    highlights: [
      'Private cave suite with caldera views',
      'Luxury catamaran sunset cruise',
      'Private wine tasting at volcanic vineyard',
      'Couples cooking class with local chef',
      'Ancient Akrotiri ruins guided tour',
      'Private hot tub under the stars'
    ],
    inclusions: [
      'Cave suite accommodation (5 nights)',
      'Private airport/port transfers',
      'Daily gourmet breakfast & 2 sunset dinners',
      'Catamaran sunset cruise with BBQ dinner',
      'Wine tasting tour with sommelier',
      'Couples cooking class'
    ],
    exclusions: [
      'International flights/ferry to Santorini',
      'Travel insurance',
      'Lunch (recommendations provided)',
      'Personal shopping'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Oia & Cave Suite Check-in', desc: 'Private transfer from airport/port to boutique cave hotel in Oia. Welcome drink on your private terrace watching the sunset.' },
      { day: 2, title: 'Caldera Hiking Trail & Wine Country', desc: 'Morning hike along the caldera rim from Fira to Oia. Afternoon wine tasting at Santo Wines with volcanic vineyard views.' },
      { day: 3, title: 'Catamaran Cruise & Hot Springs', desc: 'Full-day luxury catamaran cruise around the caldera. Swim at hot springs, snorkel at Red Beach, BBQ dinner aboard at sunset.' },
      { day: 4, title: 'Akrotiri Ruins & Cooking Class', desc: 'Morning tour of ancient Akrotiri (the "Pompeii of the Aegean"). Afternoon couples cooking class with local chef.' },
      { day: 5, title: 'Free Day & Farewell Dinner', desc: 'Leisure day to explore Fira town, shop for local crafts. Farewell candlelit dinner at cliffside restaurant.' },
      { day: 6, title: 'Departure', desc: 'Final morning at the cave suite. Private transfer to airport/port.' },
    ]
  },
  {
    id: 'PKG-007',
    name: 'Bali Wellness Retreat',
    duration: '8 Days',
    basePrice: 5500,
    region: 'Asia',
    slots: { booked: 7, total: 18 },
    trend: '+2 this week',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    cardImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80',
    description: 'Rejuvenate your mind, body, and spirit on this 8-day Bali wellness retreat. Nestled among terraced rice paddies in Ubud, this transformative journey combines ancient Balinese healing traditions, yoga, meditation, and organic farm-to-table dining.',
    highlights: [
      'Daily sunrise yoga in open-air pavilion',
      'Traditional Balinese healing ceremony',
      'Private meditation sessions with monk',
      'Organic cooking class at jungle restaurant',
      'Sacred water temple purification ritual',
      'Ubud rice terrace sunset trek'
    ],
    inclusions: [
      'Luxury jungle villa accommodation (7 nights)',
      'All organic farm-to-table meals',
      'Daily yoga & meditation sessions',
      'Balinese spa treatments (3 sessions)',
      'Airport transfers & inter-island transport',
      'Cooking class & temple ceremonies'
    ],
    exclusions: [
      'International flights to Bali',
      'Travel & health insurance',
      'Additional spa treatments',
      'Personal expenses & shopping'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Jungle Villa Welcome', desc: 'Transfer from Ngurah Rai Airport to luxury jungle villa in Ubud. Welcome flower bath and Balinese blessing ceremony.' },
      { day: 2, title: 'Sunrise Yoga & Rice Terrace Walk', desc: 'Dawn yoga session in open-air pavilion. Morning walk through Tegallalang rice terraces. Afternoon spa treatment.' },
      { day: 3, title: 'Sacred Water Temple & Meditation', desc: 'Visit Tirta Empul for water purification ritual. Afternoon private meditation session with Balinese spiritual guide.' },
      { day: 4, title: 'Organic Cooking & Jungle Trek', desc: 'Morning organic cooking class at riverside restaurant. Afternoon guided jungle trek to hidden waterfall.' },
    ]
  }
]

export default packages
