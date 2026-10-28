const packages = [
  {
    id: 'PKG-SWISS-ALPS-01',
    name: 'Swiss Alps & Glacier Wonders Odyssey',
    duration: '7 Days',
    price: 185000,
    region: 'Europe',
    category: 'standard',
    trend: 'Bestseller',
    ctaBadge: 'Guaranteed Departure',
    isBespoke: false,
    slots: { booked: 6, total: 20 },
    cardImage: '/assets/unsplash-swiss-alps.jpg',
    heroImage: '/assets/unsplash-swiss-alps.jpg',
    description: 'Experience the magic of the Swiss Alps with panoramic rail journeys, glacier excursions to Jungfraujoch and Mount Titlis, and picturesque lakeside stays in Lucerne and Interlaken.',
    highlights: [
      'Top of Europe — Jungfraujoch Sphinx Observatory at 3,454m',
      'Mount Titlis rotating cable car & glacier cliff walk',
      'Panoramic 1st Class GoldenPass & Glacier Express scenic rail',
      'Lake Lucerne private champagne steamship cruise'
    ],
    inclusions: [
      '6 Nights 4-Star superior hotel accommodation',
      'Daily Swiss buffet breakfast & 4 gourmet three-course dinners',
      'Swiss Travel Pass 1st Class for unlimited transit',
      'All mountain excursion tickets and guided tours'
    ],
    exclusions: [
      'International flights to/from Zurich or Geneva',
      'Schengen Visa processing fee',
      'Personal expenses & travel insurance'
    ],
    inclusionsSelection: {
      hotel: true,
      flight: false,
      sightseeing: true,
      guide: true,
      airportTransfer: true,
      cruise: true
    },
    itinerary: [
      { day: 1, title: 'Arrival in Zurich & Scenic Train to Lucerne', desc: 'Arrive at Zurich Airport and board the panoramic train to Lucerne. Enjoy an evening walk across Chapel Bridge.' },
      { day: 2, title: 'Mount Titlis & Glacier Cave Adventure', desc: 'Ascend Mount Titlis on the world first rotating cable car. Walk the Cliff Walk suspension bridge.' },
      { day: 3, title: 'GoldenPass Scenic Rail to Interlaken', desc: 'Journey through the Brunig Pass aboard the GoldenPass Panoramic train to Interlaken.' },
      { day: 4, title: 'Jungfraujoch — Top of Europe', desc: 'Board the Eiger Express tricable gondola to Jungfraujoch. Walk through the Ice Palace.' },
      { day: 5, title: 'Zermatt & The Matterhorn Views', desc: 'Transfer to car-free Zermatt. Enjoy spectacular views of the iconic Matterhorn.' },
      { day: 6, title: 'Gornergrat Cogwheel Train & Alpine Hike', desc: 'Ride Europe highest open-air cogwheel railway to Gornergrat at 3,089m.' },
      { day: 7, title: 'Zurich Old Town & Departure', desc: 'Scenic rail return to Zurich. Enjoy historic Old Town shopping before your airport transfer.' }
    ]
  },
  {
    id: 'PKG-419ca801-c01c-49e6-bd3e-e5123129fcfa',
    name: 'Explore Vietnam',
    duration: '10 Days',
    price: 166000,
    region: 'Asia',
    category: 'standard',
    trend: 'Trending',
    ctaBadge: 'Filling Fast',
    isBespoke: false,
    slots: { booked: 3, total: 15 },
    cardImage: '/assets/unsplash-pkg-card.jpg',
    heroImage: '/assets/unsplash-pkg-hero.jpg',
    description: 'Vietnam is a Southeast Asian country known for its rich history, diverse culture, and stunning landscapes. Experience Hanoi, Da Nang Golden Bridge, and an overnight luxury cruise on Ha Long Bay.',
    highlights: [
      'Main and Internal Flights Included from Mumbai',
      '4-Star Accommodation on Double / Twin sharing basis',
      'Luxury Ha Long Bay overnight cruise with full board',
      'Golden Bridge at Ba Na Hills Da Nang & Hoi An Ancient Town',
      'English speaking licensed tour manager throughout'
    ],
    inclusions: [
      'Return international flights and domestic sectors',
      '9 nights in 4-star handpicked hotels and cruise',
      'Daily breakfast, 7 lunches, and 8 specialty dinners',
      'Private air-conditioned 45-seater luxury coach'
    ],
    exclusions: [
      'Personal laundry, beverages, and tips',
      'Optional watersports or spa treatments'
    ],
    inclusionsSelection: {
      hotel: true,
      flight: true,
      sightseeing: true,
      guide: true,
      airportTransfer: true,
      cruise: true
    },
    itinerary: [
      { day: 1, title: 'Arrival in Hanoi & Water Puppet Show', desc: 'Welcome to Hanoi. Check in to your central hotel and attend a traditional water puppet performance.' },
      { day: 2, title: 'Hanoi Heritage & Street Food Trail', desc: 'Visit Ho Chi Minh Mausoleum, Temple of Literature, and taste authentic Pho in the Old Quarter.' },
      { day: 3, title: 'Ha Long Bay 5-Star Cruise Check-in', desc: 'Drive to Ha Long Bay. Board your luxury wooden junk boat and kayak through limestone karsts.' },
      { day: 4, title: 'Sung Sot Cave & Flight to Da Nang', desc: 'Explore Surprise Cave before sailing back. Afternoon flight to Da Nang coastal city.' },
      { day: 5, title: 'Ba Na Hills & Iconic Golden Bridge', desc: 'Take the cable car to Ba Na Hills and walk along the world-famous giant stone hands Golden Bridge.' },
      { day: 6, title: 'Hoi An Lantern Festival & Ancient Town', desc: 'Discover lantern-lit alleyways, Japanese Covered Bridge, and custom tailoring shops.' },
      { day: 7, title: 'Flight to Ho Chi Minh City & Ben Thanh Market', desc: 'Fly to Saigon. Visit Notre-Dame Cathedral Basilica and the vibrant Ben Thanh Market.' },
      { day: 8, title: 'Cu Chi Tunnels Historical Tour', desc: 'Explore the fascinating underground network of Cu Chi tunnels used during the war.' },
      { day: 9, title: 'Mekong Delta River Safari', desc: 'Cruise along the Mekong Delta canals, sample tropical fruits, and listen to folk music.' },
      { day: 10, title: 'Saigon Leisure & Return Departure', desc: 'Enjoy last-minute souvenir shopping before your transfer to Tan Son Nhat Airport.' }
    ]
  },
  {
    id: 'PKG-KASHMIR-01',
    name: 'Kashmir Valley & Dal Lake Paradise',
    duration: '6 Days',
    price: 65000,
    region: 'India',
    category: 'standard',
    trend: 'Popular',
    ctaBadge: 'Guaranteed Departure',
    isBespoke: false,
    slots: { booked: 4, total: 20 },
    cardImage: '/assets/unsplash-kashmir.png',
    heroImage: '/assets/unsplash-kashmir.png',
    description: 'Immerse yourself in Paradise on Earth. Experience luxury heritage houseboats on Dal Lake, Gulmarg Gondola snow heights, and betaab valley in Pahalgam.',
    highlights: [
      'Heritage Cedarwood Houseboat stay on Dal Lake with private Shikara rides',
      'Gulmarg Gondola Phase 1 & Phase 2 cable car up to 13,780 ft Apharwat Peak',
      'Pahalgam Betaab Valley & Aru Valley pine meadow exploration',
      'Mughal Gardens of Srinagar: Shalimar, Nishat, and Chashme Shahi'
    ],
    inclusions: [
      '5 Nights luxury accommodation (1N Houseboat + 4N 4-Star Resort)',
      'Daily Kashmiri breakfast & traditional Wazwan dinner',
      'Dedicated private heating vehicle for all transfers',
      'All permits, entry passes, and Shikara sunset cruise'
    ],
    exclusions: ['Flights to Srinagar', 'Pony riding charges', 'Personal snow apparel rental'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: true },
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar & Dal Lake Shikara Sunset', desc: 'Warm Kashmiri welcome at Srinagar airport. Check-in to luxury houseboat and sunset Shikara ride.' },
      { day: 2, title: 'Srinagar Mughal Gardens & Old City Walk', desc: 'Explore Nishat Bagh and Shalimar Bagh built by Emperor Jahangir.' },
      { day: 3, title: 'Gulmarg Meadow of Flowers & Gondola Ride', desc: 'Drive through apple orchards to Gulmarg. Ride the world highest cable car to snow peaks.' },
      { day: 4, title: 'Pahalgam Valley of Shepherds & Betaab Valley', desc: 'Scenic journey along the Lidder River to Pahalgam. Visit Chandanwari and Betaab Valley.' },
      { day: 5, title: 'Aru Valley & Saffron Fields of Pampore', desc: 'Trek to peaceful Aru meadows and visit the authentic saffron fields of Pampore.' },
      { day: 6, title: 'Srinagar Departure', desc: 'Morning Kashmiri Kahwa tea before private transfer to Srinagar International Airport.' }
    ]
  },
  {
    id: 'PKG-GREECE-01',
    name: 'Greece Island Hopper & Aegean Odyssey',
    duration: '9 Days',
    price: 195000,
    region: 'Europe',
    category: 'standard',
    trend: 'Bestseller',
    ctaBadge: 'Almost Full',
    isBespoke: false,
    slots: { booked: 12, total: 16 },
    cardImage: '/assets/unsplash-greece.jpg',
    heroImage: '/assets/unsplash-santorini.jpg',
    description: 'Sail the turquoise Aegean Sea from ancient Athens to the whitewashed cliffs of Santorini and the vibrant beach clubs of Mykonos.',
    highlights: [
      'Acropolis and Parthenon VIP private morning access in Athens',
      'Semi-private sunset catamaran cruise with BBQ & Greek wine in Santorini',
      'Delos sacred island mythological cruise from Mykonos',
      'High-speed business class ferry transfers between Greek islands'
    ],
    inclusions: [
      '8 Nights boutique 4-star and 5-star whitewashed cliffside hotels',
      'Daily Mediterranean breakfast and welcome sunset dinner',
      'All inter-island high-speed hydrofoil ferry tickets',
      'Acropolis, Delos, and catamaran cruise tickets'
    ],
    exclusions: ['International airfare', 'Schengen Visa', 'City stay tax'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: true },
    itinerary: [
      { day: 1, title: 'Arrival in Athens & Plaka Walk', desc: 'Check in to boutique hotel overlooking the illuminated Acropolis. Evening stroll in historic Plaka.' },
      { day: 2, title: 'Acropolis & Ancient Agora Guided Tour', desc: 'Private guided exploration of Parthenon, Erechtheion, and the Acropolis Museum.' },
      { day: 3, title: 'Hydrofoil Ferry to Mykonos', desc: 'High-speed ferry to glamorous Mykonos. Relax at Little Venice and view the iconic windmills.' },
      { day: 4, title: 'Delos Island Ancient Sanctuary', desc: 'Sail to UNESCO-listed Delos island, birthplace of Apollo and Artemis.' },
      { day: 5, title: 'Ferry to Santorini & Oia Sunset', desc: 'Arrive at the volcanic caldera of Santorini. Watch the world-famous sunset from Oia cliffside.' },
      { day: 6, title: 'Santorini Volcano & Hot Springs Catamaran', desc: 'Swim in the volcanic hot springs and enjoy fresh Greek seafood on board.' },
      { day: 7, title: 'Akrotiri Prehistoric Ruins & Red Beach', desc: 'Explore Minoan Bronze Age ruins and relax on the vibrant volcanic Red Beach.' },
      { day: 8, title: 'Return to Athens & Farewell Dinner', desc: 'Flight back to Athens. Farewell rooftop Greek dinner with live bouzouki music.' },
      { day: 9, title: 'Athens Departure', desc: 'Private luxury transfer to Athens International Airport for your return flight.' }
    ]
  },
  {
    id: 'PKG-SAFARI-01',
    name: 'Serengeti & Masai Mara Wildlife Safari',
    duration: '8 Days',
    price: 245000,
    region: 'Africa',
    category: 'standard',
    trend: 'Luxury',
    ctaBadge: 'Specialist Escorted',
    isBespoke: false,
    slots: { booked: 2, total: 12 },
    cardImage: '/assets/unsplash-safari.jpg',
    heroImage: '/assets/unsplash-african-safari.jpg',
    description: 'Witness the Great Migration across the endless plains of the Serengeti and Masai Mara. Track the Big Five with expert naturalist guides and stay in luxury tented camps.',
    highlights: [
      'Unlimited 4x4 pop-up roof safari game drives across Serengeti & Mara',
      'Ngorongoro Crater volcanic caldera floor safari with high predator density',
      'Authentic Masai warrior village cultural immersion',
      'Luxury tented safari camp stays with campfire bush dinners under African stars'
    ],
    inclusions: [
      '7 Nights luxury safari lodges and tented camps',
      'All meals: full board (breakfast, picnic lunch, multi-course dinner)',
      'Custom 4x4 Land Cruiser with pop-up roof and guaranteed window seat',
      'All national park conservation fees and English naturalist guide'
    ],
    exclusions: ['International flights', 'Hot air balloon safari optional add-on', 'Yellow fever vaccination'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: false },
    itinerary: [
      { day: 1, title: 'Arrival in Nairobi & Transfer to Masai Mara', desc: 'Meet your safari director and drive across the Great Rift Valley into the legendary Masai Mara.' },
      { day: 2, title: 'Full Day Masai Mara Big Five Game Drive', desc: 'Track lions, leopards, cheetahs, and massive elephant herds across the savannah.' },
      { day: 3, title: 'Mara River Crossing & Masai Village', desc: 'Observe hippo pools and crocodile-filled Mara river, followed by cultural tribal dancing.' },
      { day: 4, title: 'Cross Border to Serengeti National Park', desc: 'Fly or drive into Tanzania Serengeti plains, home to over two million wildebeest and zebras.' },
      { day: 5, title: 'Serengeti Central Seronera Valley Safari', desc: 'Sunrise game drive searching for apex predators and endangered black rhinos.' },
      { day: 6, title: 'Ngorongoro Conservation Area & Crater Rim', desc: 'Ascend to the crater rim with sweeping views of the world largest inactive volcanic caldera.' },
      { day: 7, title: 'Ngorongoro Crater Floor Safari & Lake Manyara', desc: 'Descend 600m to the crater floor for an action-packed morning surrounded by wildlife.' },
      { day: 8, title: 'Arusha / Kilimanjaro Airport Departure', desc: 'Visit local curio markets before your transfer to Kilimanjaro International Airport.' }
    ]
  },
  {
    id: 'PKG-BALI-01',
    name: 'Bali Tropical Escape & Nusa Penida',
    duration: '7 Days',
    price: 85000,
    region: 'Asia',
    category: 'standard',
    trend: 'Popular',
    ctaBadge: 'Bestseller',
    isBespoke: false,
    slots: { booked: 5, total: 20 },
    cardImage: '/assets/unsplash-bali.jpg',
    heroImage: '/assets/unsplash-bali.jpg',
    description: 'Discover tropical Bali from Ubud jungle swings and terraced rice fields to the dramatic ocean cliffs and manta ray waters of Nusa Penida.',
    highlights: [
      'Nusa Penida West Island tour: Kelingking T-Rex cliff, Angel Billabong & Broken Beach',
      'Ubud Bali Swing and Tegallalang Emerald Rice Terraces',
      'Sunset at Tanah Lot and Uluwatu Cliffside Temple with Kecak Fire Dance',
      'Private pool villa stay in Seminyak with floating breakfast'
    ],
    inclusions: [
      '6 Nights accommodation (3N Ubud Jungle Resort + 3N Seminyak Private Pool Villa)',
      'Daily breakfast, floating breakfast, and Jimbaran Bay seafood candlelight dinner',
      'Fast boat return tickets to Nusa Penida and private island coach',
      'All temple entrances, sarong rentals, and airport transfers'
    ],
    exclusions: ['International flights', 'Indonesia tourist levy', 'Personal spa expenses'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: true },
    itinerary: [
      { day: 1, title: 'Arrival in Denpasar & Ubud Jungle Resort', desc: 'Traditional flower garland welcome at Ngurah Rai Airport and check-in to Ubud forest retreat.' },
      { day: 2, title: 'Tegallalang Rice Terraces, Bali Swing & Monkey Forest', desc: 'Soar high above the palm trees on the Bali Swing and visit Sacred Monkey Forest.' },
      { day: 3, title: 'Tirta Empul Holy Water Temple & Kintamani Volcano', desc: 'Participate in holy water cleansing ritual and view active Mount Batur volcano.' },
      { day: 4, title: 'Speedboat to Nusa Penida Island', desc: 'Board the speedboat to Nusa Penida. Marvel at the sheer drop of Kelingking T-Rex cliff.' },
      { day: 5, title: 'Seminyak Private Pool Villa & Beach Club', desc: 'Check in to luxury private pool villa and relax at Finns or Potato Head beach club.' },
      { day: 6, title: 'Uluwatu Clifftop Temple & Kecak Fire Dance', desc: 'Watch the dramatic sunset over the Indian Ocean followed by the hypnotic Kecak dance.' },
      { day: 7, title: 'Spa Relaxation & Denpasar Departure', desc: 'Enjoy 2-hour Balinese massage treatment before your airport departure.' }
    ]
  },
  {
    id: 'PKG-JAPAN-01',
    name: 'Kyoto Ancient Heritage & Tokyo Modernity',
    duration: '8 Days',
    price: 215000,
    region: 'Asia',
    category: 'luxury',
    trend: 'High Demand',
    ctaBadge: 'Cherry Blossom Season',
    isBespoke: false,
    slots: { booked: 9, total: 14 },
    cardImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=75',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    description: 'A masterclass in Japanese refinement: ride the Shinkansen bullet train from futuristic Tokyo to Kyoto bamboo groves, historic Gion geisha districts, and serene Zen rock gardens.',
    highlights: [
      'First Class Shinkansen Bullet Train with Mt. Fuji panoramic window view',
      'Exclusive private tea ceremony in an authentic 300-year-old Kyoto Machiya',
      'Arashiyama Bamboo Forest sunrise private walk and Golden Pavilion Kinkaku-ji',
      'Luxury Ryokan stay with private Onsen hot spring and 9-course Kaiseki dinner'
    ],
    inclusions: [
      '7 Nights in 5-star handpicked Tokyo hotels and traditional Kyoto Onsen Ryokan',
      '7-Day JR Rail Pass First Class and all local subway transit passes',
      'Daily Japanese gourmet breakfasts and 3 Michelin-starred Kaiseki dinners',
      'Private licensed English-speaking scholar guide in Tokyo and Kyoto'
    ],
    exclusions: ['International flights', 'Japan tourist visa fee', 'Personal shopping'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: false },
    itinerary: [
      { day: 1, title: 'Arrival in Tokyo & Shinjuku Neon Sky', desc: 'Arrive at Tokyo Haneda or Narita. Private chauffeur transfer to luxury hotel in Ginza.' },
      { day: 2, title: 'Asakusa Senso-ji & Meiji Shrine', desc: 'Explore Tokyo oldest temple in Asakusa and tranquil cedar groves of Meiji Jingu.' },
      { day: 3, title: 'Shinkansen Bullet Train to Kyoto', desc: 'High-speed 300 km/h Shinkansen ride past Mount Fuji into ancient Kyoto.' },
      { day: 4, title: 'Fushimi Inari Torii Gates & Gion Geisha District', desc: 'Walk under thousands of vermilion Torii gates and enjoy an evening walking tour in Gion.' },
      { day: 5, title: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Temple', desc: 'Early morning serenity in Arashiyama, followed by private Machiya matcha tea ceremony.' },
      { day: 6, title: 'Hakone Hot Springs & Ryokan Onsen Retreat', desc: 'Scenic journey to Hakone. Bathe in mineral hot spring onsen and dine on multi-course Kaiseki.' },
      { day: 7, title: 'Lake Ashi Cruise & Return to Tokyo', desc: 'Pirate ship cruise across Lake Ashi with views of Mt. Fuji before returning to Tokyo.' },
      { day: 8, title: 'Tokyo Departure', desc: 'Morning visit to Tsukiji Outer Market before your private airport transfer.' }
    ]
  },
  {
    id: 'PKG-DUBAI-01',
    name: 'Dubai Luxury Dunes, Burj Views & Marina Oasis',
    duration: '5 Days',
    price: 78000,
    region: 'Middle East',
    category: 'luxury',
    trend: 'Trending',
    ctaBadge: 'VIP Experience',
    isBespoke: false,
    slots: { booked: 11, total: 18 },
    cardImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=75',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    description: 'Immerse yourself in supreme Arabian luxury. Marvel at panoramic views from the Burj Khalifa At The Top, cruise Dubai Marina on a private yacht, and dine under desert stars in a royal Bedouin retreat.',
    highlights: [
      'Burj Khalifa Level 148 VIP Sky Lounge access with sunset champagne',
      'Private 2-hour luxury yacht cruise along Dubai Marina and Atlantis The Palm',
      'Royal Platinum Desert Safari in vintage Land Rovers with 6-course dune dinner',
      'Museum of the Future entry and Dubai Mall Fountain VIP viewing terrace'
    ],
    inclusions: [
      '4 Nights in 5-star beachfront luxury hotel (Jumeirah / Downtown)',
      'Daily international buffet breakfast and Bedouin royal banquet',
      'Private luxury vehicle transfers throughout Dubai',
      'All VIP skip-the-line attraction passes and yacht charter'
    ],
    exclusions: ['International flights', 'UAE tourist visa', 'Tourism Dirham fee'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: true },
    itinerary: [
      { day: 1, title: 'Arrival in Dubai & Private Chauffeur Transfer', desc: 'VIP meet and assist at Dubai International Airport. Check-in to luxury Downtown hotel.' },
      { day: 2, title: 'Burj Khalifa Level 148 & Dubai Mall Luxury Walk', desc: 'Ascend to the highest observation deck on earth and witness the Dubai Fountain choreography.' },
      { day: 3, title: 'Royal Desert Dunes Safari & Starlight Feast', desc: 'Traverse red sand dunes in vintage Land Rovers, watch falconry, and dine under desert stars.' },
      { day: 4, title: 'Dubai Marina Private Yacht & Palm Jumeirah', desc: 'Glide past Bluewaters Island and Ain Dubai on a private yacht, followed by Museum of the Future.' },
      { day: 5, title: 'Gold Souk & Departure', desc: 'Experience traditional Old Dubai Abra water taxi and spice souks before airport transfer.' }
    ]
  },
  {
    id: 'PKG-ITALY-01',
    name: 'Amalfi Coast Yachting & Tuscan Vineyard Escapes',
    duration: '8 Days',
    price: 220000,
    region: 'Europe',
    category: 'luxury',
    trend: 'High Demand',
    ctaBadge: 'Bestseller',
    isBespoke: false,
    slots: { booked: 7, total: 12 },
    cardImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=75',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    description: 'La Dolce Vita in its purest form: sail past Positano cliffs on a private Riva speedboat, stay in converted cliffside convents, and savor private Chianti tastings at historic Tuscan estates.',
    highlights: [
      'Private Capri & Faraglioni rock speedboat charter with Blue Grotto swim',
      'Exclusive wine tasting with estate owners in Chianti Classico, Tuscany',
      'Cliffside suite in Positano overlooking the Mediterranean Sea',
      'Private cooking class with an Italian master chef in Florence'
    ],
    inclusions: [
      '7 Nights in 5-star Relais & Chateaux properties (Amalfi + Tuscany)',
      'Daily Italian breakfasts and 3 multi-course wine-paired dinners',
      'First-Class Frecciarossa high-speed rail between Naples and Florence',
      'Private Mercedes V-Class chauffeur for all coastal and vineyard drives'
    ],
    exclusions: ['International airfare', 'Schengen Visa', 'City tourist taxes'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: true },
    itinerary: [
      { day: 1, title: 'Arrival in Naples & Drive to Positano', desc: 'Scenic private coastal drive along the dramatic cliffs of the Amalfi Coast.' },
      { day: 2, title: 'Private Speedboat to Capri & Anacapri', desc: 'Cruise to the Isle of Capri, explore Marina Grande, and swim in emerald sea grottoes.' },
      { day: 3, title: 'Ravello Gardens & Amalfi Cathedral', desc: 'Visit Villa Cimbrone clifftop gardens and historic Amalfi maritime square.' },
      { day: 4, title: 'High-Speed Train to Florence & Historic Walk', desc: 'First-Class rail to Tuscany. Evening walk across Ponte Vecchio and Piazza del Duomo.' },
      { day: 5, title: 'Chianti Wine Estate & Truffle Hunt', desc: 'Trek for wild truffles with trained hounds followed by private wine cellar tasting.' },
      { day: 6, title: 'San Gimignano & Siena Medieval Towers', desc: 'Explore UNESCO medieval walled towns of San Gimignano and Piazza del Campo in Siena.' },
      { day: 7, title: 'Uffizi Gallery VIP Access & Sunset Arno Cruise', desc: 'Skip-the-line Renaissance art masterworks and vintage wooden boat cruise on the River Arno.' },
      { day: 8, title: 'Florence / Rome Departure', desc: 'Private transfer to Florence or Rome Fiumicino Airport for your journey home.' }
    ]
  },
  {
    id: 'PKG-ICELAND-01',
    name: 'Iceland Northern Lights, Geysers & Glacier Lagoons',
    duration: '7 Days',
    price: 198000,
    region: 'Europe',
    category: 'standard',
    trend: 'Trending',
    ctaBadge: 'Aurora Guaranteed',
    isBespoke: false,
    slots: { booked: 4, total: 15 },
    cardImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=75',
    heroImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    description: 'Chase the ethereal Aurora Borealis across Iceland surreal volcanic landscapes: bathe in the geothermal Blue Lagoon, explore crystal blue ice caves, and stand beside roaring waterfalls.',
    highlights: [
      'Nightly Northern Lights Aurora hunts with professional astronomer guide',
      'Zodiac boat navigation between floating icebergs at Jokulsarlon Glacier Lagoon',
      'Exclusive Blue Lagoon Premium geothermal retreat with silica mud mask',
      'Super Jeep expedition into Katla natural ice cave beneath the glacier'
    ],
    inclusions: [
      '6 Nights in Nordic boutique design hotels with Aurora wake-up service',
      'Daily Scandinavian buffet breakfasts and 2 Icelandic seafood dinners',
      'Custom 4x4 Super Jeep transit and all national park fees',
      'Blue Lagoon Premium admission including towel, robe, and welcome beverage'
    ],
    exclusions: ['International flights to Keflavik', 'Cold weather thermal gear rental', 'Travel insurance'],
    inclusionsSelection: { hotel: true, flight: false, sightseeing: true, guide: true, airportTransfer: true, cruise: true },
    itinerary: [
      { day: 1, title: 'Arrival in Reykjavik & Blue Lagoon Soak', desc: 'Land at Keflavik and immerse in the warm mineral waters of the world-famous Blue Lagoon.' },
      { day: 2, title: 'Golden Circle: Thingvellir, Geysir & Gullfoss', desc: 'Walk between tectonic plates, watch Strokkur geyser spout 30m high, and view Gullfoss waterfall.' },
      { day: 3, title: 'South Coast: Seljalandsfoss & Black Sand Beach', desc: 'Walk behind Seljalandsfoss waterfall and admire basalt columns at Reynisfjara beach.' },
      { day: 4, title: 'Jokulsarlon Glacier Lagoon & Diamond Beach', desc: 'Watch crystal icebergs wash onto pitch-black volcanic sand at Diamond Beach.' },
      { day: 5, title: 'Vatnajokull Glacier Ice Cave Exploration', desc: 'Equip crampons and helmets to enter otherworldly naturally sculpted blue ice tunnels.' },
      { day: 6, title: 'Reykjavik Culture & Harpa Concert Hall', desc: 'Discover Hallgrimskirkja church and Reykjavik vibrant waterfront design shops.' },
      { day: 7, title: 'Keflavik Departure', desc: 'Final Icelandic breakfast before your transfer to Keflavik International Airport.' }
    ]
  }
];

export default packages;
