// ═══════════════════════════════════════════
// SITE DATA — projects, services, team, testimonials, process
// ═══════════════════════════════════════════

export const WHATSAPP_NUMBER = "917982364617";
export const PHONE_NUMBER = "+91 79823 64617";
export const ALT_PHONE_NUMBER = "+91 99993 05862";
export const EMAIL = "brightspaceinterior@gmail.com";
export const ADDRESS = "J4/56J, Khirki Extension, Malviya Nagar, New Delhi — 110017";
export const TAGLINE = "Spaces designed to feel like you.";
export const WHATSAPP_MESSAGE =
  "Hello The Bright Space Interiors, I saw your work and I’m interested in your interior design services. I would like to discuss my project and get a consultation.";

export const SERVICES = [
  {
    slug: "residential",
    title: "Residential Interior",
    subtitle: "Your Home, Elevated",
    image: "/images/real-bedroom-fluted.jpg",
    description:
      "We transform apartments, flats, and villas into bespoke living spaces that reflect your personality and lifestyle. Every element is considered, every corner crafted.",
    subServices: [
      "Apartments & Flats",
      "Villas & Bungalows",
      "Bedrooms & Suites",
      "Living & Dining Rooms",
      "Modular Kitchens",
      "Wardrobes & Walk-in Closets",
    ],
    bgColor: "#2E2826",
    faqs: [
      {
        q: "How long does a residential interior project take?",
        a: "Timeline depends on scope. A single room takes 3–4 weeks; a full apartment typically takes 8–12 weeks from design approval to final handover.",
      },
      {
        q: "Do you work across Delhi NCR and other cities?",
        a: "Yes, we are headquartered in New Delhi and actively execute turnkey projects across Delhi, Gurugram, Noida, Faridabad, and Pan-India locations.",
      },
      {
        q: "Can I choose my own materials?",
        a: "Absolutely. We guide you through curated material options and also accommodate client-supplied materials and custom finishes.",
      },
    ],
  },
  {
    slug: "commercial",
    title: "Commercial Interior",
    subtitle: "Spaces That Work",
    image: "/images/real-salon-facade.jpg",
    description:
      "We design commercial spaces that balance brand identity, employee productivity, and client impression — offices, showrooms, restaurants, cafés, hotels.",
    subServices: [
      "Offices & Workspaces",
      "Retail Shops",
      "Showrooms",
      "Restaurants & Cafés",
      "Hotels & Hospitality",
      "Salons & Spas",
    ],
    bgColor: "#1C2226",
    faqs: [
      {
        q: "Can you handle large commercial projects?",
        a: "Yes. We have executed projects from small offices to large hotel fit-outs. Our team scales to the project size.",
      },
      {
        q: "Do you offer 3D visualization before execution?",
        a: "Yes — all projects include detailed 3D renders for client approval before any execution begins.",
      },
    ],
  },
  {
    slug: "turnkey",
    title: "Turnkey Projects",
    subtitle: "One Point of Responsibility",
    image: "/images/real-salon-mainhall.jpg",
    description:
      "From the first brick to the final furnishing — we manage everything, so you don't have to coordinate with multiple vendors. One contract, one team, zero hassle.",
    subServices: [
      "Modular Kitchens",
      "Modular Wardrobes",
      "Lighting & Cove Fixtures",
      "Flooring (Italian Marble & Wooden)",
      "Electrical Work & Smart Automation",
      "Civil Work & Space Reconfiguration",
      "False Ceiling & Gypsum Design",
      "Wall Design & Luxury Painting",
    ],
    bgColor: "#26221C",
    faqs: [
      {
        q: "What does 'turnkey' mean exactly?",
        a: "Turnkey means we handle everything — design, civil, electrical, false ceiling, modular cabinetry, flooring, and wall finishes — delivering a fully move-in-ready space.",
      },
      {
        q: "Is turnkey more expensive than managing separately?",
        a: "Our bulk procurement and process efficiency often make turnkey cost-comparable or cheaper than managing vendors individually.",
      },
    ],
  },
  {
    slug: "design-execution",
    title: "Design & Execution",
    subtitle: "Concept to Completion",
    image: "/images/real-salon-styling.jpg",
    description:
      "A full-service design journey: concept development, 3D visualization, material selection, precision execution, and quality finishing — under one roof.",
    subServices: [
      "Concept Development",
      "3D Design & Visualization",
      "Material Selection",
      "Precision Execution",
      "Quality Finishing",
      "Final Handover",
    ],
    bgColor: "#22261C",
    faqs: [
      {
        q: "How many 3D revision rounds are included?",
        a: "Our standard package includes 3 revision rounds. Additional rounds are available at a nominal charge.",
      },
      {
        q: "Do you offer design-only services?",
        a: "Yes, we offer standalone design & 3D visualization packages if you have your own execution team.",
      },
    ],
  },
];

export const SPECIALTY_SERVICES = [
  {
    name: "Modular Kitchens",
    tagline: "Ergonomic & High-End",
    image: "/images/real-kitchen-maroon.jpg",
    description: "Tailor-made acrylic, PU, and veneer finishes with blum soft-close hardware, pull-out larders, and quartz countertops.",
  },
  {
    name: "Modular Wardrobes",
    tagline: "Custom Storage Systems",
    image: "/images/real-wardrobe-tvunit.jpg",
    description: "Floor-to-ceiling sliding or hinged wardrobes, integrated entertainment consoles, sensor LED illumination, and bespoke organizers.",
  },
  {
    name: "Lighting Design",
    tagline: "Architectural & Ambient",
    image: "/images/real-bedroom-headboard.jpg",
    description: "Layered lighting schemes including magnetic track lights, concealed coves, warm dimmers, and bespoke statement chandeliers.",
  },
  {
    name: "Flooring",
    tagline: "Luxury Stone & Hardwood",
    image: "/images/real-salon-styling.jpg",
    description: "Precision-laid Italian marble book-matching, herringbone hardwood, vitrified large slabs, and seamless microtopping.",
  },
  {
    name: "Electrical Work",
    tagline: "Safe, Concealed & Smart",
    image: "/images/real-bedroom-fluted.jpg",
    description: "Full circuit load design, concealed fire-resistant wiring, smart home automation integration, and designer switchplates.",
  },
  {
    name: "Civil Work",
    tagline: "Structural Reconfiguration",
    image: "/images/specialty-civil.jpg",
    description: "Masonry alterations, partition demolition/creation, plumbing lines, screeding, and high-performance waterproofing.",
  },
  {
    name: "False Ceiling",
    tagline: "Acoustics & Aesthetics",
    image: "/images/real-salon-mainhall.jpg",
    description: "Saint-Gobain gypsum boards, multi-level floating designs, cove lighting channels, and wooden acoustic baffles.",
  },
  {
    name: "Wall Design & Painting",
    tagline: "Textures & Bespoke Finishes",
    image: "/images/real-bedroom-fluted.jpg",
    description: "Limewash, micro-cement, Venetian plaster textures, fluted wall panels, and high-durability luxury matte emulsions.",
  },
];

export const PROJECTS = [
  {
    id: 1,
    slug: "the-hair-palace-london",
    title: "The Hair Palace London — Salon & Academy",
    category: "Commercial",
    location: "Delhi NCR",
    area: "4,500 sq ft",
    year: "2024",
    duration: "14 weeks",
    featured: true,
    image: "/images/real-salon-facade.jpg",
    gallery: [
      "/images/real-salon-facade.jpg",
      "/images/real-salon-mainhall.jpg",
      "/images/real-salon-styling.jpg",
      "/images/real-salon-reception.jpg",
      "/images/real-salon-doors.jpg",
    ],
    description:
      "Turnkey architectural facade design and luxury interior execution for The Hair Palace London. Features a grand two-story glass facade, celebratory floral entrance archways, illuminated brand signage, and multi-tier salon academy stations.",
    challenge:
      "Transforming an expansive commercial space into a distinguished European-style luxury academy while ensuring flawless MEP and sound isolation between academy and salon floors.",
    solution:
      "Engineered structural facade reinforcement, custom architectural signage, high-efficiency central air handling, and zone-specific dimmable lighting throughout.",
    clientQuote:
      "Bright Space Interiors delivered our flagship luxury salon and academy with international standards. The finished execution is stunning.",
    clientName: "The Hair Palace London Management",
    materials: ["Double-Glazed Facade", "Illuminated 3D Signage", "Travertine Marble", "Acoustic Drywall"],
    bgGradient: "linear-gradient(135deg, #1C1C1C 0%, #2A2521 100%)",
  },
  {
    id: 2,
    slug: "hair-palace-salon-lounge",
    title: "L'Oréal & Kérastase Retail Lounge",
    category: "Commercial",
    location: "Delhi NCR",
    area: "2,200 sq ft",
    year: "2024",
    duration: "10 weeks",
    featured: true,
    image: "/images/real-salon-reception.jpg",
    gallery: [
      "/images/real-salon-reception.jpg",
      "/images/real-salon-mainhall.jpg",
      "/images/real-salon-chesterfield.jpg",
      "/images/real-salon-styling.jpg",
    ],
    description:
      "Luxury retail and client reception lounge featuring custom L'Oréal Professionnel Paris and Kérastase Paris branded display shelving, back-lit translucent marble reception desk, statement yellow velvet armchairs, and acoustic ceiling.",
    challenge:
      "Balancing high-density retail merchandise display with welcoming, uncluttered five-star hospitality aesthetics.",
    solution:
      "Concealed LED strip illumination behind frosted glass shelves, custom marble counter with inset halo lighting, and rich oak acoustic wall cladding.",
    clientQuote:
      "Product sales and client dwell time doubled immediately. The lighting and marble craftsmanship are world-class.",
    clientName: "Salon Director",
    materials: ["Italian Statuario Marble", "Black Powder-Coated Steel", "Back-Lit Acrylic", "High-CRI LED"],
    bgGradient: "linear-gradient(135deg, #2E2418 0%, #3D3025 100%)",
  },
  {
    id: 3,
    slug: "hair-palace-vip-pedispa",
    title: "Executive Waiting Suite & Pedispa",
    category: "Commercial",
    location: "Delhi NCR",
    area: "1,800 sq ft",
    year: "2024",
    duration: "8 weeks",
    featured: true,
    image: "/images/real-salon-chesterfield.jpg",
    gallery: [
      "/images/real-salon-chesterfield.jpg",
      "/images/real-salon-pedispa.jpg",
      "/images/real-salon-doors.jpg",
      "/images/real-salon-mainhall.jpg",
    ],
    description:
      "Distinguished client waiting lounge and dedicated pedicure wellness zone featuring a deep-buttoned burgundy leather Chesterfield sofa, Persian rug, classical gold-leaf mirror, and custom brick-and-timber pedicure stations.",
    challenge:
      "Harmonizing heritage warmth with modern clinical hygiene for premium spa treatments.",
    solution:
      "Exposed rustic brickwork, sealed solid timber planking, individual plumbed hydrotherapy foot basins, and custom leather seating.",
    clientQuote:
      "Our clients love taking photos in this lounge. It feels like an exclusive private club.",
    clientName: "VIP Clients",
    materials: ["Tufted Genuine Leather", "Natural Exposed Brick", "Bleached Pine Planks", "Hand-Knotted Carpet"],
    bgGradient: "linear-gradient(135deg, #24201A 0%, #2E261E 100%)",
  },
  {
    id: 4,
    slug: "hair-palace-royal-styling",
    title: "Royal Styling Stations & Private Treatment Suites",
    category: "Commercial",
    location: "Delhi NCR",
    area: "2,000 sq ft",
    year: "2024",
    duration: "8 weeks",
    featured: true,
    image: "/images/real-salon-styling.jpg",
    gallery: [
      "/images/real-salon-styling.jpg",
      "/images/real-salon-doors.jpg",
      "/images/real-salon-mainhall.jpg",
      "/images/real-salon-chesterfield.jpg",
    ],
    description:
      "Opulent commercial styling suite featuring arched gold-leaf full-height mirrors, vintage hydraulic styling chairs, checkerboard marble flooring, and private artisanal pine treatment suites with O3+ branding.",
    challenge:
      "Accommodating individual client privacy while maintaining a cohesive, open royal luxury atmosphere.",
    solution:
      "Constructed custom acoustic private treatment rooms with artisanal pine barn-doors, alongside open-format gilded mirror stations and check-patterned flooring.",
    clientQuote:
      "The styling mirrors and timber doors are an instant favorite with our clientele. It creates an unforgettable brand experience.",
    clientName: "Hair Palace Management",
    materials: ["Arched Gold-Leaf Framing", "Solid Pine Barn Doors", "Checkerboard Marble", "Hydraulic Leather Chairs"],
    bgGradient: "linear-gradient(135deg, #2E251A 0%, #3D3220 100%)",
  },
  {
    id: 5,
    slug: "bespoke-turnkey-modular-kitchen",
    title: "Saket Dual-Tone Modular Kitchen",
    category: "Turnkey",
    location: "Saket, South Delhi",
    area: "1,200 sq ft",
    year: "2024",
    duration: "6 weeks",
    featured: true,
    image: "/images/real-kitchen-saket.jpg",
    gallery: [
      "/images/real-kitchen-saket.jpg",
      "/images/real-kitchen-maroon.jpg",
      "/images/real-kitchen-profile.jpg",
      "/images/real-wardrobe-tvunit.jpg",
    ],
    description:
      "Modern turnkey modular kitchen delivered with dual-tone anthracite and ivory acrylic cabinets, seamless quartz countertop, marble splashback, high-efficiency chimney, and architectural timber partition screen.",
    challenge:
      "Creating maximum storage and prep counter surface in an open-concept flat while providing visual privacy from the living foyer.",
    solution:
      "Full-height vertical cabinetry with soft-close Blum hardware, seamless quartz counter with integrated under-mount sink, and vertical wood baffle divider.",
    clientQuote:
      "From 3D design to site handover, Bright Space managed every detail cleanly. The kitchen finish is immaculate.",
    clientName: "South Delhi Resident",
    materials: ["Scratch-Resistant Acrylic", "Solid Wood Battens", "Calacatta Quartz", "Tandem Soft-Close"],
    bgGradient: "linear-gradient(135deg, #1C2226 0%, #26221C 100%)",
  },
  {
    id: 6,
    slug: "park-view-city-residence",
    title: "Park View City Luxury Residence",
    category: "Residential",
    location: "Sector 48, Gurugram",
    area: "1,300 sq ft",
    year: "2024",
    duration: "10 weeks",
    featured: true,
    image: "/images/real-bedroom-headboard.jpg",
    gallery: [
      "/images/real-bedroom-headboard.jpg",
      "/images/real-wardrobe-tvunit.jpg",
      "/images/real-bedroom-fluted.jpg",
      "/images/real-kitchen-saket.jpg",
    ],
    description:
      "A complete bespoke home interior featuring subtle fluted panels, warm ambient lighting, handcrafted cabinetry, and curated marble textures.",
    challenge:
      "Balancing high functionality for everyday family living with the quiet luxury aesthetic requested by the homeowner.",
    solution:
      "We layered warm stone, aged brass fixtures, and handcrafted furniture against generous light-filled spaces. The result is a home that breathes.",
    clientQuote:
      "Bright Space didn't just design our home — they understood our lifestyle and delivered on-time perfection.",
    clientName: "Manish Singh",
    materials: ["Floor-to-Ceiling Wood Panelling", "Upholstered Bed Headboard", "Indirect LED Channels", "Italian Marble"],
    bgGradient: "linear-gradient(135deg, #2C2420 0%, #3D3025 100%)",
  },
  {
    id: 7,
    slug: "dwarka-luxury-home",
    title: "Dwarka Modern Living & Wardrobe Suite",
    category: "Residential",
    location: "Sector 23, Dwarka, Delhi",
    area: "900 sq ft",
    year: "2024",
    duration: "8 weeks",
    featured: true,
    image: "/images/real-wardrobe-tvunit.jpg",
    gallery: [
      "/images/real-wardrobe-tvunit.jpg",
      "/images/real-bedroom-headboard.jpg",
      "/images/real-bedroom-fluted.jpg",
      "/images/real-kitchen-maroon.jpg",
    ],
    description:
      "Optimized compact luxury apartment featuring custom space-saving joinery, recessed coves, and premium textured wall coatings.",
    challenge:
      "Maximizing usable living area and natural light within a 900 sq ft footprint without clutter.",
    solution:
      "Integrated floor-to-ceiling concealed storage, neutral reflective tones, and an open layout uniting the lounge and dining areas.",
    clientQuote:
      "They transformed our 900 sq ft space into feeling like an open luxury suite.",
    clientName: "Ashok Kumar",
    materials: ["Custom Modular Wardrobe", "Integrated TV Console", "Warm Ambient LED", "Brushed Metal Hardware"],
    bgGradient: "linear-gradient(135deg, #1C2620 0%, #253020 100%)",
  },
  {
    id: 8,
    slug: "contemporary-turnkey-kitchen",
    title: "Contemporary Cherry & Cream Turnkey Kitchen",
    category: "Turnkey",
    location: "Sushant Lok, Gurugram",
    area: "1,100 sq ft",
    year: "2024",
    duration: "5 weeks",
    featured: true,
    image: "/images/real-kitchen-maroon.jpg",
    gallery: [
      "/images/real-kitchen-maroon.jpg",
      "/images/real-kitchen-profile.jpg",
      "/images/real-kitchen-saket.jpg",
      "/images/real-wardrobe-tvunit.jpg",
    ],
    description:
      "Ergonomic L-shaped turnkey modular kitchen executed with high-gloss cream overhead cabinets, rich cherry-wine base drawers, concealed under-cabinet profile lighting, and undermount double-bowl sink.",
    challenge:
      "Fitting high-capacity storage, heavy appliance wiring, and water filtration equipment seamlessly without compromising visual symmetry.",
    solution:
      "Custom cabinetry with soft-close tandem boxes, hidden LED track lighting beneath upper units, and durable high-temperature acrylic finishes.",
    clientQuote:
      "The finish on the cabinets and the under-cabinet lighting makes cooking a pleasure. On-time handover with zero hassle.",
    clientName: "Gurugram Resident",
    materials: ["High-Gloss Acrylic", "Under-Cabinet Profile LED", "Quartz Worktops", "Stainless Steel Sink"],
    bgGradient: "linear-gradient(135deg, #2A1C1C 0%, #352020 100%)",
  },
  {
    id: 9,
    slug: "v-deliver-commercial-kitchen",
    title: "V-Deliver Commercial Culinary Facility",
    category: "Commercial",
    location: "Sushant Lok Phase 1, Gurugram",
    area: "2,500 sq ft",
    year: "2023",
    duration: "9 weeks",
    featured: true,
    image: "/images/real-kitchen-saket.jpg",
    gallery: [
      "/images/real-kitchen-saket.jpg",
      "/images/real-kitchen-maroon.jpg",
      "/images/real-salon-facade.jpg",
      "/images/real-salon-mainhall.jpg",
    ],
    description:
      "State-of-the-art commercial culinary facility at Shri Ram Complex, designed for high-efficiency workflow, hygiene, and durability.",
    challenge:
      "Demanding heavy MEP, exhaust ventilation, commercial gas pipelines, and anti-skid epoxy civil finishes under tight compliance.",
    solution:
      "Industrial grade SS-304 fabrication, seamless epoxy flooring, and zoning between prep, cooking, and dispatch stations.",
    clientQuote:
      "The engineering and turnkey execution were flawless. Bright Space delivered an industrial kitchen that runs like clockwork.",
    clientName: "Shri Ram Complex / V-Deliver",
    materials: ["SS-304 Stainless Steel", "Industrial Epoxy", "Acoustic Insulation", "Fire-Rated Partitions"],
    bgGradient: "linear-gradient(135deg, #1C2030 0%, #202535 100%)",
  },
  {
    id: 10,
    slug: "agarwal-residence-ranchi",
    title: "Agarwal Family Turnkey Residence",
    category: "Residential",
    location: "Ranchi",
    area: "1,350 sq ft",
    year: "2024",
    duration: "11 weeks",
    featured: true,
    image: "/images/real-bedroom-fluted.jpg",
    gallery: [
      "/images/real-bedroom-fluted.jpg",
      "/images/real-bedroom-headboard.jpg",
      "/images/real-wardrobe-tvunit.jpg",
      "/images/real-kitchen-maroon.jpg",
    ],
    description:
      "Turnkey home interior blending classical warmth with modern European minimalism for an expansive family flat.",
    challenge:
      "Remote project management and procurement with strict timeline constraints.",
    solution:
      "End-to-end off-site fabrication, scheduled site installations, and daily supervisory video updates.",
    clientQuote:
      "Managing our home from start to finish with such professionalism was truly remarkable.",
    clientName: "Mr. Agarwal",
    materials: ["Teak Wood", "Hand-troweled Plaster", "Vintage Brass", "Italian Marble"],
    bgGradient: "linear-gradient(135deg, #24201A 0%, #2E261E 100%)",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Manish Singh",
    project: "Park View City, Gurugram",
    rating: 5,
    quote:
      "Bright Space didn't just design our home — they understood our family's needs and created a space we cherish every day. The finish quality and on-time handover were extraordinary.",
  },
  {
    id: 2,
    name: "Look Salon Team",
    project: "4,000 Sq. Ft. Salon, Old Gurugram",
    rating: 5,
    quote:
      "Handed over in August 2024 exactly as promised. Our clients constantly compliment the lighting and ambiance. Bright Space gave our flagship location an unmatched luxury feel.",
  },
  {
    id: 3,
    name: "Ashok Kumar",
    project: "Sector 23, Dwarka, Delhi",
    rating: 5,
    quote:
      "Their space planning and 3D visualization were incredible. What they showed us in renders was what was delivered on site. Highly recommend Mohd Mushir and his team.",
  },
];

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Mohd Mushir",
    role: "Founder & Principal Designer",
    image: "/images/team-anjali.jpg",
    bio: "15 years of luxury interior experience across India and the UAE.",
  },
  {
    id: 2,
    name: "Rohan Verma",
    role: "Design Director",
    image: "/images/team-rohan.jpg",
    bio: "Specializes in commercial spaces and hospitality design.",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "3D Visualization Lead",
    image: "/images/team-priya.jpg",
    bio: "Creates photorealistic renders that bring concepts to life.",
  },
  {
    id: 4,
    name: "Karan Mehta",
    role: "Project Manager",
    image: "/images/team-karan.jpg",
    bio: "Ensures every project is delivered on time and on budget.",
  },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Consultation",
    description: "A free initial call to understand your vision, requirements, and budget.",
    clientDoes: "Share your vision, wishlist, and timeline.",
    weDeliver: "Design brief summary, next-steps plan.",
  },
  {
    step: 2,
    title: "Site Visit",
    description: "Our team visits the site for detailed measurement and assessment.",
    clientDoes: "Provide site access and key contacts.",
    weDeliver: "Site report, floor plan sketch.",
  },
  {
    step: 3,
    title: "Requirement Discussion",
    description: "Deep-dive session to finalize scope, style direction, and budget.",
    clientDoes: "Approve design brief and project scope.",
    weDeliver: "Detailed scope document and timeline.",
  },
  {
    step: 4,
    title: "Design & 3D",
    description: "Our designers create full 3D visualizations of your space.",
    clientDoes: "Review renders and suggest revisions.",
    weDeliver: "3D renders, mood boards, material palette.",
  },
  {
    step: 5,
    title: "Quotation",
    description: "A transparent, line-item quotation with no hidden costs.",
    clientDoes: "Review and approve the quotation.",
    weDeliver: "Itemized quote, payment schedule.",
  },
  {
    step: 6,
    title: "Material Selection",
    description: "Guided selection of all materials, finishes, and furniture.",
    clientDoes: "Visit showrooms, make final selections.",
    weDeliver: "Approved material schedule, procurement plan.",
  },
  {
    step: 7,
    title: "Execution",
    description: "Our skilled team executes all civil, MEP, and finishing work.",
    clientDoes: "Regular site visits (optional), approvals.",
    weDeliver: "Weekly progress reports, site photos.",
  },
  {
    step: 8,
    title: "Quality Inspection",
    description: "A comprehensive snag-list and quality check before handover.",
    clientDoes: "Walk through the space, raise snags.",
    weDeliver: "Snag resolution report, quality certificate.",
  },
  {
    step: 9,
    title: "Final Handover",
    description: "Your space is ready. We walk you through everything.",
    clientDoes: "Final sign-off and move in.",
    weDeliver: "Handover certificate, warranty documents.",
  },
];

export const WHY_US_PILLARS = [
  {
    title: "End-to-End Management",
    description: "From first sketch to final handover — one team, one responsibility.",
    icon: "shield",
  },
  {
    title: "Experienced Team",
    description: "12+ years of expertise across residential, commercial, and hospitality projects.",
    icon: "users",
  },
  {
    title: "Quality Materials",
    description: "We source from trusted suppliers and offer curated material selections.",
    icon: "gem",
  },
  {
    title: "On-Time Delivery",
    description: "We set realistic timelines and honour them — without compromising quality.",
    icon: "clock",
  },
  {
    title: "Transparent Communication",
    description: "Regular updates, clear quotations, and honest conversations throughout.",
    icon: "message",
  },
];
