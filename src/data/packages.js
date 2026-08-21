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
  }
];

export default packages;
