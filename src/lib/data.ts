// ═══════════════════════════════════════════
// SITE DATA — projects, services, team, testimonials, process
// ═══════════════════════════════════════════

export const WHATSAPP_NUMBER = "917982364617";
export const PHONE_NUMBER = "+91 79823 64617";
export const ALT_PHONE_NUMBER = "+91 95401 84245";
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
    image: "/images/service-residential.jpg",
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
    image: "/images/service-commercial.jpg",
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
    image: "/images/service-turnkey.jpg",
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
    image: "/images/service-design.jpg",
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
    image: "/images/modular-kitchen.jpg",
    description: "Tailor-made acrylic, PU, and veneer finishes with blum soft-close hardware, pull-out larders, and quartz countertops.",
  },
  {
    name: "Modular Wardrobes",
    tagline: "Custom Storage Systems",
    image: "/images/modular-wardrobe.jpg",
    description: "Floor-to-ceiling sliding or hinged wardrobes, tinted glass shutters, sensor LED illumination, and bespoke organizers.",
  },
  {
    name: "Lighting Design",
    tagline: "Architectural & Ambient",
    image: "/images/specialty-lighting.jpg",
    description: "Layered lighting schemes including magnetic track lights, concealed coves, warm dimmers, and bespoke statement chandeliers.",
  },
  {
    name: "Flooring",
    tagline: "Luxury Stone & Hardwood",
    image: "/images/specialty-flooring.jpg",
    description: "Precision-laid Italian marble book-matching, herringbone hardwood, vitrified large slabs, and seamless microtopping.",
  },
  {
    name: "Electrical Work",
    tagline: "Safe, Concealed & Smart",
    image: "/images/specialty-electrical.jpg",
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
    image: "/images/specialty-ceiling.jpg",
    description: "Saint-Gobain gypsum boards, multi-level floating designs, cove lighting channels, and wooden acoustic baffles.",
  },
  {
    name: "Wall Design & Painting",
    tagline: "Textures & Bespoke Finishes",
    image: "/images/specialty-painting.jpg",
    description: "Limewash, micro-cement, Venetian plaster textures, fluted wall panels, and high-durability luxury matte emulsions.",
  },
];

export const PROJECTS = [
  {
    id: 1,
    slug: "park-view-city-residence",
    title: "Park View City Residence",
    category: "Residential",
    location: "Sector 48, Gurugram",
    area: "1,300 sq ft",
    year: "2024",
    duration: "10 weeks",
    featured: true,
    image: "/images/project-serene-villa.jpg",
    gallery: [
      "/images/project-serene-villa.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/gallery-detail-2.jpg",
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
    materials: ["Italian Marble", "Teak Wood", "Aged Brass", "Handwoven Textiles"],
    bgGradient: "linear-gradient(135deg, #2C2420 0%, #3D3025 100%)",
  },
  {
    id: 2,
    slug: "look-salon-gurugram",
    title: "Look Salon & Wellness",
    category: "Commercial",
    location: "New Colony, Old Gurugram",
    area: "4,000 sq ft",
    year: "2024",
    duration: "14 weeks",
    featured: true,
    image: "/images/project-salon.jpg",
    gallery: [
      "/images/project-salon.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/gallery-detail-3.jpg",
    ],
    description:
      "A flagship luxury salon handed over in August 2024, featuring champagne brass vanity arches, travertine counters, and acoustic treatment.",
    challenge:
      "Creating seamless client flow between high-activity hair styling stations and tranquil private spa therapy suites within a 4,000 sq ft floor plate.",
    solution:
      "Custom recessed styling mirrors, zone-controlled mood lighting, and concealed MEP engineering for effortless salon operations.",
    clientQuote:
      "Handed over right on schedule in August 2024. Our salon footfall and client compliments have exceeded all expectations.",
    clientName: "Look Salon Management",
    materials: ["Travertine Stone", "Champagne Brass", "Custom Curved Glass", "Bouclé Upholstery"],
    bgGradient: "linear-gradient(135deg, #2E2418 0%, #3D3025 100%)",
  },
  {
    id: 3,
    slug: "dwarka-luxury-home",
    title: "Dwarka Modern Residence",
    category: "Residential",
    location: "Sector 23, Dwarka, Delhi",
    area: "900 sq ft",
    year: "2024",
    duration: "8 weeks",
    featured: true,
    image: "/images/project-city-penthouse.jpg",
    gallery: [
      "/images/project-city-penthouse.jpg",
      "/images/gallery-detail-2.jpg",
      "/images/gallery-detail-3.jpg",
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
    materials: ["Statuario Marble", "Smoked Glass", "Walnut Veneer", "Brushed Gold"],
    bgGradient: "linear-gradient(135deg, #1C2620 0%, #253020 100%)",
  },
  {
    id: 4,
    slug: "v-deliver-commercial-kitchen",
    title: "V-Deliver Commercial Kitchen",
    category: "Commercial",
    location: "Sushant Lok Phase 1, Gurugram",
    area: "2,500 sq ft",
    year: "2023",
    duration: "9 weeks",
    featured: true,
    image: "/images/project-atelier-office.jpg",
    gallery: [
      "/images/project-atelier-office.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/service-commercial.jpg",
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
    id: 5,
    slug: "palam-vihar-residence",
    title: "Palam Vihar Residence",
    category: "Residential",
    location: "Palam Vihar, Delhi",
    area: "900 sq ft",
    year: "2023",
    duration: "7 weeks",
    featured: true,
    image: "/images/project-waterfront-home.jpg",
    gallery: [
      "/images/project-waterfront-home.jpg",
      "/images/gallery-detail-3.jpg",
      "/images/service-residential.jpg",
    ],
    description:
      "A warm contemporary sanctuary with light oak joinery, concealed warm lighting, and a serene minimalist palette.",
    challenge:
      "Creating seamless flow and cozy intimate zones within a compact urban layout.",
    solution:
      "Concealed architectural lighting, earth-toned textured plaster, and low-slung custom seating.",
    clientQuote:
      "A peaceful oasis where every detail was executed with total honesty and care.",
    clientName: "Mr. Das",
    materials: ["Bleached Ash", "Belgian Linen", "Weathered Brass", "Micro-cement"],
    bgGradient: "linear-gradient(135deg, #2C1E24 0%, #35242C 100%)",
  },
  {
    id: 6,
    slug: "agarwal-residence-ranchi",
    title: "Agarwal Family Residence",
    category: "Residential",
    location: "Ranchi",
    area: "1,350 sq ft",
    year: "2024",
    duration: "11 weeks",
    featured: true,
    image: "/images/project-showroom.jpg",
    gallery: [
      "/images/project-showroom.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/gallery-detail-2.jpg",
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
  {
    id: 7,
    slug: "geetanjli-studio",
    title: "Geetanjli Studio",
    category: "Commercial",
    location: "Gurugram & Delhi",
    area: "1,800 sq ft",
    year: "2024",
    duration: "8 weeks",
    featured: true,
    image: "/images/project-hotel.jpg",
    gallery: [
      "/images/project-hotel.jpg",
      "/images/gallery-detail-3.jpg",
      "/images/gallery-detail-2.jpg",
    ],
    description:
      "Bespoke commercial salon and studio interior with custom back-lit mirrors, styling stations, and welcoming hospitality lounge.",
    challenge:
      "High-traffic commercial specifications with premium luxury visual impact.",
    solution:
      "Commercial-grade durable vinyl finishes, bespoke curved brass partitions, and shadow-free high CRI lighting.",
    clientQuote:
      "Bright Space elevated our studio brand into a true luxury experience.",
    clientName: "Studio Management",
    materials: ["Champagne Brass", "High-CRI Lighting", "Curved Glass", "Terrazzo"],
    bgGradient: "linear-gradient(135deg, #1A2030 0%, #202B40 100%)",
  },
  {
    id: 8,
    slug: "saket-modular-kitchen-turnkey",
    title: "Saket Turnkey & Modular Residence",
    category: "Turnkey",
    location: "Saket, South Delhi",
    area: "2,200 sq ft",
    year: "2024",
    duration: "12 weeks",
    featured: true,
    image: "/images/project-turnkey.jpg",
    gallery: [
      "/images/project-turnkey.jpg",
      "/images/gallery-detail-2.jpg",
      "/images/gallery-detail-1.jpg",
    ],
    description:
      "Complete turnkey execution featuring German-hardware modular kitchen, custom quartz counters, and smart automated illumination.",
    challenge:
      "Civil restructuring and rewiring for modern appliances and air-handling.",
    solution:
      "Single-point turnkey accountability with turnkey civil, MEP, and modular carpentry.",
    clientQuote:
      "Walking into a completed, immaculate home with zero coordination headaches was worth every rupee.",
    clientName: "South Delhi Resident",
    materials: ["Quartz Countertops", "Soft-Close German Hardware", "Acoustic Ceilings", "PU Cabinetry"],
    bgGradient: "linear-gradient(135deg, #1C2226 0%, #26221C 100%)",
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
