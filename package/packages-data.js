"use strict";
const CATEGORY_LABELS = {
  nature: "Nature & Forests",
  adventure: "Adventure",
  culture: "Cultural Attractions",
  waterfall: "Waterfalls",
  wildlife: "Wildlife",
  mountain: "Mountains & Hiking"
};

const DISTRICT_LABELS = {
  ratnapura: "Ratnapura",
  kegalle: "Kegalle"
};

const PLACE_DATA = [
  {
    id: "belihuloya",
    name: "Belihuloya River Village",
    district: "ratnapura",
    location: "Ratnapura",
    image: "../destination/images/beli8.webp",
    categories: ["nature", "adventure"],
    tags: ["river", "village", "mountain", "streams", "hiking", "scenery"],
    description: "Belihuloya is known for its scenic mountain landscapes, flowing streams and peaceful natural surroundings. It is a wonderful place to enjoy the outdoors and explore the surrounding countryside.",
    activities: "Nature walks, photography and enjoying the scenery.",
    idealDays: [1, 3],
    entry: 0,
    transport: [
      { mode: "Bus from Ratnapura", price: 250, bands: ["20-60", "60-100"] },
      { mode: "Tuk-tuk from Ratnapura town", price: 900, bands: ["10-20", "20-60"] },
      { mode: "Private van (shared)", price: 1500, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local rice and curry shop", price: 500 },
      { name: "Riverside restaurant", price: 1000 }
    ],
    stays: [
      { name: "Riverside guesthouse", price: 4500 },
      { name: "Mountain eco-lodge", price: 9000 }
    ],
    bring: ["Light rain jacket", "Sturdy walking shoes", "Insect repellent", "Refillable water bottle"],
    childNotice: "Keep children within sight near streams. River levels can rise quickly after rain, so never let children enter the water unsupervised."
  },
  {
    id: "bopath",
    name: "Bopath Ella",
    district: "ratnapura",
    location: "Ratnapura",
    image: "../destination/images/bopath1.avif",
    categories: ["waterfall", "nature"],
    tags: ["waterfall", "falls", "ella", "kuruwita", "bo leaf", "greenery"],
    description: "Bopath Ella, near Kuruwita, is a well-known waterfall named for its resemblance to a Bo leaf. Its surrounding greenery makes it a popular natural attraction.",
    activities: "Sightseeing, nature photography and enjoying the waterfall from designated safe areas.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Kuruwita", price: 200, bands: ["20-60", "60-100", "100-180"] },
      { mode: "Tuk-tuk from Kuruwita", price: 500, bands: ["10-20", "20-60"] },
      { mode: "Private van (shared)", price: 1500, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local rice and curry shop (Kuruwita)", price: 500 },
      { name: "Town restaurant (Ratnapura)", price: 900 }
    ],
    stays: [
      { name: "Homestay near Kuruwita", price: 3000 },
      { name: "Hotel in Ratnapura town", price: 7000 }
    ],
    bring: ["Non-slip sandals", "Dry bag", "Towel and spare clothes", "Insect repellent"],
    childNotice: "Waterfall rocks are slippery. Children must wear footwear, stay on designated viewing areas and never climb rocks near the falls."
  },
  {
    id: "sinharaja",
    name: "Sinharaja Forest Reserve",
    district: "ratnapura",
    location: "Ratnapura area",
    image: "../destination/images/sinharaja.jpg",
    categories: ["nature", "wildlife"],
    tags: ["rainforest", "forest", "birds", "birdwatching", "biodiversity", "endemic"],
    description: "Sinharaja is a famous tropical rainforest known for its rich biodiversity and many endemic species. It is an important natural heritage site in Sri Lanka.",
    activities: "Guided nature walks, birdwatching and observing rainforest biodiversity.",
    idealDays: [2, 3],
    entry: 1500,
    transport: [
      { mode: "Bus towards Deniyaya", price: 300, bands: ["60-100", "100-180", "200+"] },
      { mode: "Hired car from Ratnapura", price: 1200, bands: ["20-60", "60-100"] },
      { mode: "Private van (shared)", price: 2000, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local food near the forest road", price: 600 },
      { name: "Hotel restaurant in Deniyaya", price: 1000 }
    ],
    stays: [
      { name: "Eco-lodge near the forest", price: 8000 },
      { name: "Guesthouse in Deniyaya", price: 4000 }
    ],
    bring: ["Long-sleeved clothes", "Leech socks", "Rain poncho", "Binoculars", "Insect repellent"],
    childNotice: "Walk only with a licensed guide and keep children in the group at all times. Leeches and slippery trails are common, so children must wear closed shoes and leech socks."
  },
  {
    id: "sri-pada",
    name: "Sri Pada (Adam's Peak)",
    district: "ratnapura",
    location: "Ratnapura side",
    image: "../destination/images/sri-padaya.jpg",
    categories: ["mountain", "culture"],
    tags: ["mountain", "pilgrimage", "hiking", "sacred", "religious", "temple"],
    description: "Sri Pada is a sacred mountain associated with several religious traditions. Pilgrims and hikers visit the mountain for its spiritual significance and striking views.",
    activities: "Pilgrimage, hiking during suitable conditions and enjoying mountain scenery. The climbing season is usually December to May.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Erathna (Ratnapura side)", price: 350, bands: ["20-60", "60-100", "100-180"] },
      { mode: "Tuk-tuk from Erathna", price: 800, bands: ["10-20", "20-60"] },
      { mode: "Private van (shared)", price: 1600, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Pilgrim-route tea and rice shop", price: 400 },
      { name: "Restaurant in Erathna town", price: 800 }
    ],
    stays: [
      { name: "Pilgrim rest house near the route", price: 2500 },
      { name: "Guesthouse on the Ratnapura side", price: 5000 }
    ],
    bring: ["Warm layers", "Headlamp or torch", "Sturdy shoes", "Water and snacks"],
    childNotice: "The climb is long and steep, especially at night. Children must be accompanied by an adult, take rest stops often and be carried or helped on steep steps. Stop and descend if a child shows fatigue, dizziness or breathing trouble."
  },
  {
    id: "saman-devalaya",
    name: "Sabaragamuwa Maha Saman Devalaya",
    district: "ratnapura",
    location: "Ratnapura",
    image: "../destination/images/maha-saman-devalaya.webp",
    categories: ["culture"],
    tags: ["temple", "shrine", "heritage", "worship", "architecture", "traditions"],
    description: "Located in the Ratnapura area, this historic shrine is dedicated to the deity Saman. It is an important place of worship and a significant part of the region's cultural heritage.",
    activities: "Visiting the shrine, learning about local traditions and appreciating its architecture.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Ratnapura town", price: 150, bands: ["20-60", "60-100", "100-180", "200+"] },
      { mode: "Tuk-tuk from Ratnapura town", price: 400, bands: ["10-20"] },
      { mode: "Private car (shared)", price: 1200, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Town restaurant near the bus stand", price: 500 },
      { name: "Vegetarian rice shop nearby", price: 350 }
    ],
    stays: [
      { name: "Hotel in Ratnapura town", price: 6000 },
      { name: "Guesthouse in Ratnapura", price: 3500 }
    ],
    bring: ["Modest clothing covering shoulders and knees", "Umbrella", "Flowers or offerings (optional)", "Small change for donation boxes"],
    childNotice: "Children must dress modestly and stay quiet during ceremonies. Keep children close in crowds, and never let them touch sacred objects or drums."
  },
  {
    id: "ratnapura",
    name: "Ratnapura Gem Heritage",
    district: "ratnapura",
    location: "Ratnapura",
    image: "../destination/images/ratnapura-gems.jpg",
    categories: ["culture"],
    tags: ["gems", "gemstone", "gem market", "heritage", "traditions", "jewellery"],
    description: "Ratnapura is widely associated with Sri Lanka's gemstone industry. The area's gem trade reflects a long-standing connection between local communities, gemstones and traditional knowledge.",
    activities: "Learning about gemstone traditions and visiting established gem businesses.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Ratnapura town", price: 150, bands: ["20-60", "60-100", "100-180", "200+"] },
      { mode: "Tuk-tuk in Ratnapura", price: 400, bands: ["10-20"] },
      { mode: "Private van (shared)", price: 1800, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Café near the gem market", price: 600 },
      { name: "Local rice and curry shop", price: 450 }
    ],
    stays: [
      { name: "Hotel in Ratnapura", price: 6000 },
      { name: "Guesthouse in Ratnapura", price: 3500 }
    ],
    bring: ["Small bag", "Cash for purchases", "Hat", "Water bottle"],
    childNotice: "Gem shops and street dealers can be crowded. Keep children away from cutting and polishing equipment, and never let children handle gemstones unsupervised."
  },
  {
    id: "theli-ella",
    name: "Theli Ella Falls",
    district: "kegalle",
    location: "Kegalle",
    image: "../destination/images/TheliEllaFalls.webp",
    categories: ["waterfall", "nature"],
    tags: ["waterfall", "falls", "ella", "peaceful", "greenery"],
    description: "Theli Ella Falls is a scenic waterfall in the Kegalle District. Its green surroundings make it a peaceful place for nature lovers.",
    activities: "Sightseeing, photography and enjoying the surrounding landscape from safe viewpoints.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Kegalle", price: 200, bands: ["20-60", "60-100", "100-180"] },
      { mode: "Tuk-tuk from Kegalle", price: 500, bands: ["10-20", "20-60"] },
      { mode: "Private van (shared)", price: 1500, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local rice and curry near the falls", price: 500 },
      { name: "Restaurant in Kegalle town", price: 700 }
    ],
    stays: [
      { name: "Homestay near the falls", price: 3000 },
      { name: "Hotel in Kegalle town", price: 5500 }
    ],
    bring: ["Non-slip sandals", "Dry bag", "Towel", "Insect repellent", "Rain gear"],
    childNotice: "Stay on the viewing paths. Water is cold and fast after rain, so children must not climb rocks or enter the water."
  },
  {
    id: "udawalawe",
    name: "Udawalawe National Park",
    district: "ratnapura",
    location: "Southern area",
    image: "../destination/images/udawalawe.jpg",
    categories: ["wildlife", "nature"],
    tags: ["elephants", "elephant", "safari", "national park", "open land", "wildlife"],
    description: "Udawalawe National Park is famous for its elephants and open landscapes. The park is a popular place to learn about Sri Lanka's wildlife and natural ecosystems.",
    activities: "Responsible wildlife observation through authorised safari operators. Safari jeep hire is charged separately.",
    idealDays: [1, 2],
    entry: 3500,
    transport: [
      { mode: "Bus to Udawalawe town", price: 300, bands: ["60-100", "100-180", "200+"] },
      { mode: "Tuk-tuk from Embilipitiya", price: 900, bands: ["20-60", "60-100"] },
      { mode: "Private van (shared)", price: 2000, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local food near the park gate", price: 600 },
      { name: "Hotel restaurant near the safari area", price: 1200 }
    ],
    stays: [
      { name: "Safari lodge near the park", price: 12000 },
      { name: "Guesthouse near the park", price: 4500 }
    ],
    bring: ["Neutral-coloured clothes", "Hat and sunscreen", "Binoculars", "Camera with zoom lens"],
    childNotice: "Stay inside the safari vehicle at all times. Keep children seated and quiet near elephants, and never feed or approach animals."
  },
  {
    id: "kitulgala",
    name: "Kitulgala",
    district: "kegalle",
    location: "Kegalle",
    image: "../destination/images/kitulgala.jpg",
    categories: ["adventure", "nature"],
    tags: ["river", "rafting", "kelani river", "rainforest", "guided", "outdoors"],
    description: "Kitulgala is known for its rainforest scenery and the Kelani River. It is a popular destination for nature-based tourism and guided outdoor activities.",
    activities: "Guided river activities, nature walks and rainforest photography.",
    idealDays: [2, 3],
    entry: 0,
    transport: [
      { mode: "Bus to Kitulgala", price: 250, bands: ["60-100", "100-180", "200+"] },
      { mode: "Tuk-tuk from Yatiyantota", price: 500, bands: ["20-60"] },
      { mode: "Private van (shared)", price: 1800, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Riverside restaurant", price: 1000 },
      { name: "Local rice and curry shop", price: 500 }
    ],
    stays: [
      { name: "Riverside guesthouse", price: 5000 },
      { name: "Eco resort near the river", price: 12000 }
    ],
    bring: ["Quick-dry clothes", "Water shoes", "Dry bag", "Sunscreen and hat"],
    childNotice: "River activities must be done only with licensed operators who provide life jackets. Children must wear a properly fitted life jacket at all times on the water."
  },
  {
    id: "pinnawala",
    name: "Pinnawala Elephant Orphanage",
    district: "kegalle",
    location: "Kegalle",
    image: "../destination/images/pinnawala.jpg",
    categories: ["wildlife"],
    tags: ["elephants", "elephant", "orphanage", "conservation", "family"],
    description: "Pinnawala is a well-known elephant facility in Kegalle District. Visitors can learn about elephants and the challenges involved in their care and conservation.",
    activities: "Learning about elephants and observing them in designated visitor areas.",
    idealDays: [1, 2],
    entry: 2000,
    transport: [
      { mode: "Bus to Pinnawala", price: 150, bands: ["20-60", "60-100", "100-180", "200+"] },
      { mode: "Tuk-tuk from Kegalle", price: 400, bands: ["10-20", "20-60"] },
      { mode: "Private van (shared)", price: 1500, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local food near Pinnawala", price: 500 },
      { name: "Café near the orphanage road", price: 800 }
    ],
    stays: [
      { name: "Guesthouse in Pinnawala", price: 3500 },
      { name: "Hotel in Kegalle town", price: 5000 }
    ],
    bring: ["Hat and sunscreen", "Water", "Comfortable shoes", "Camera"],
    childNotice: "Elephants are large and can be unpredictable. Children must stay behind barriers, never approach or feed elephants, and keep their hands and head inside the vehicle or behind rails."
  },
  {
    id: "bible-rock",
    name: "Bible Rock (Bathalegala)",
    district: "kegalle",
    location: "Kegalle area",
    image: "../destination/images/bible-rock.jpg",
    categories: ["mountain", "adventure"],
    tags: ["rock", "hiking", "bathalegala", "landmark", "viewpoint", "trek"],
    description: "Bible Rock, also called Bathalegala, is a distinctive rock formation in the Kegalle area. Its shape and surrounding scenery make it a notable landmark.",
    activities: "Viewing the landscape, photography and hiking where access and conditions permit.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Kegalle", price: 200, bands: ["20-60", "60-100", "100-180"] },
      { mode: "Tuk-tuk from Kegalle", price: 800, bands: ["10-20", "20-60"] },
      { mode: "Private van (shared)", price: 1500, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local food near Kegalle", price: 500 },
      { name: "Kegalle town restaurant", price: 800 }
    ],
    stays: [
      { name: "Guesthouse in Kegalle", price: 3500 },
      { name: "Hotel in Kegalle", price: 6000 }
    ],
    bring: ["Sturdy shoes", "Water and snacks", "Hat", "Power bank and first-aid kit"],
    childNotice: "Rock paths have steep drop-offs. Children must be held by the hand near edges, must not climb beyond marked or fenced areas, and the group should turn back in rain or fog."
  },
  {
    id: "asupini-ella",
    name: "Asupini Ella",
    district: "kegalle",
    location: "Kegalle",
    image: "../destination/images/asupini-ella.webp",
    categories: ["waterfall", "nature"],
    tags: ["waterfall", "falls", "ella", "aranayake", "greenery"],
    description: "Asupini Ella is a waterfall in the Aranayake area of Kegalle District. It is a scenic natural attraction for visitors exploring the region.",
    activities: "Sightseeing, nature photography and enjoying the surrounding landscape from safe locations.",
    idealDays: [1, 2],
    entry: 0,
    transport: [
      { mode: "Bus to Aranayake", price: 180, bands: ["20-60", "60-100"] },
      { mode: "Tuk-tuk from Aranayake", price: 400, bands: ["10-20"] },
      { mode: "Private van (shared)", price: 1400, bands: ["60-100", "100-180", "200+"] }
    ],
    restaurants: [
      { name: "Local rice and curry (Aranayake)", price: 450 },
      { name: "Kegalle town restaurant", price: 800 }
    ],
    stays: [
      { name: "Homestay near Aranayake", price: 2800 },
      { name: "Guesthouse in Kegalle", price: 3800 }
    ],
    bring: ["Non-slip footwear", "Towel", "Dry bag", "Raincoat"],
    childNotice: "Rocks are slippery. Children must stay on the safe viewing platform, never walk on or near the water flow, and avoid the falls entirely after heavy rain."
  }
];
