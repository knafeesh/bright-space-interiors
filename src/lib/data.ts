// ═══════════════════════════════════════════
// SITE DATA — projects, services, team, testimonials, process
// ═══════════════════════════════════════════

export const WHATSAPP_NUMBER = "919999999999";
export const PHONE_NUMBER = "+91 99999 99999";
export const EMAIL = "hello@brightspaceinteriors.com";
export const ADDRESS = "123, Design Avenue, Sector 18, Mumbai, Maharashtra — 400001";

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
      "Bedrooms",
      "Living Rooms",
      "Kitchens",
      "Wardrobes & Storage",
    ],
    bgColor: "#2E2826",
    faqs: [
      {
        q: "How long does a residential interior project take?",
        a: "Timeline depends on scope. A single room takes 3–4 weeks; a full apartment typically takes 8–12 weeks from design approval to handover.",
      },
      {
        q: "Do you work in my city?",
        a: "We operate across Mumbai, Pune, and nearby metros. Contact us to confirm availability in your location.",
      },
      {
        q: "Can I choose my own materials?",
        a: "Absolutely. We guide you through curated material options and also accommodate client-supplied materials.",
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
    slug: "the-oak-hills-villa",
    title: "The Oak Hills Villa",
    category: "Residential",
    location: "Khandala",
    area: "4,500 sq ft",
    year: "2024",
    duration: "14 weeks",
    featured: true,
    image: "/images/project-oak-hills.jpg",
    gallery: [
      "/images/project-oak-hills.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/gallery-detail-2.jpg",
    ],
    description:
      "A palatial villa reimagined with a warm minimalist palette — ivory stone floors, bespoke joinery, and a curated art collection that frames each room.",
    challenge:
      "The client wanted a home that felt both luxurious and deeply personal — a retreat from the city without sacrificing modern amenities.",
    solution:
      "We layered warm stone, aged brass fixtures, and handcrafted furniture against generous light-filled spaces. The result is a home that breathes.",
    clientQuote:
      "Bright Space didn't just design our home — they understood our life and created a space we never want to leave.",
    clientName: "Arjun & Priya Mehra",
    materials: ["Italian Marble", "Teak Wood", "Aged Brass", "Handwoven Textiles"],
    bgGradient: "linear-gradient(135deg, #2C2420 0%, #3D3025 100%)",
  },
  {
    id: 2,
    slug: "modern-city-penthouse",
    title: "Modern City Penthouse",
    category: "Residential",
    location: "Worli, Mumbai",
    area: "3,800 sq ft",
    year: "2024",
    duration: "12 weeks",
    featured: true,
    image: "/images/project-city-penthouse.jpg",
    gallery: [
      "/images/project-city-penthouse.jpg",
      "/images/gallery-detail-2.jpg",
      "/images/gallery-detail-3.jpg",
    ],
    description:
      "High-rise penthouse lounge boasting panoramic city vistas, architectural recessed coves, and bespoke curved velvet seating.",
    challenge:
      "To design an ultra-luxury urban sanctuary that maintains seamless sightlines to the skyline while providing cozy intimate zones.",
    solution:
      "Custom low-slung Italian furniture, smoked mirror columns, and zoned acoustic ceiling treatments that maximize light and openness.",
    clientQuote:
      "The finish quality and lighting choreography are beyond what we imagined.",
    clientName: "Vikram & Sunita Singhal",
    materials: ["Smoked Glass", "Statuario Marble", "Walnut Veneer", "Brushed Gold"],
    bgGradient: "linear-gradient(135deg, #1C2620 0%, #253020 100%)",
  },
  {
    id: 3,
    slug: "the-atelier-office",
    title: "The Atelier Office",
    category: "Commercial",
    location: "BKC, Mumbai",
    area: "5,200 sq ft",
    year: "2024",
    duration: "10 weeks",
    featured: true,
    image: "/images/project-atelier-office.jpg",
    gallery: [
      "/images/project-atelier-office.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/service-commercial.jpg",
    ],
    description:
      "An executive headquarters crafted with fluted oak acoustics, minimalist bronze lighting, and private client presentation suites.",
    challenge:
      "Balancing corporate professionalism with warm hospitality aesthetics for international executive visitors.",
    solution:
      "Rich natural oak timbering, custom travertine boardroom table, and concealed smart automation panels.",
    clientQuote:
      "Our clients and partners are consistently wowed by the warmth and prestige of our studio.",
    clientName: "Kabir Malhotra, MD",
    materials: ["Fluted Oak", "Travertine Stone", "Architectural Bronze", "Acoustic Wool"],
    bgGradient: "linear-gradient(135deg, #1C2030 0%, #202535 100%)",
  },
  {
    id: 4,
    slug: "tranquil-waterfront-home",
    title: "Tranquil Waterfront Home",
    category: "Residential",
    location: "Alibaug",
    area: "3,600 sq ft",
    year: "2023",
    duration: "9 weeks",
    featured: true,
    image: "/images/project-waterfront-home.jpg",
    gallery: [
      "/images/project-waterfront-home.jpg",
      "/images/gallery-detail-3.jpg",
      "/images/service-residential.jpg",
    ],
    description:
      "A serene coastal sanctuary featuring limestone terraces, bleached ash joinery, and an indoor-outdoor transitional layout.",
    challenge:
      "Creating an environment resilient to maritime air while retaining soft, understated luxury aesthetics.",
    solution:
      "Marine-grade architectural finishes, micro-cement flooring, linen draping, and earth-toned textured walls.",
    clientQuote:
      "A peaceful oasis where every sunrise feels like a luxury resort stay.",
    clientName: "Nisha & Rajesh Patel",
    materials: ["Micro-cement", "Bleached Ash", "Belgian Linen", "Weathered Brass"],
    bgGradient: "linear-gradient(135deg, #2C1E24 0%, #35242C 100%)",
  },
  {
    id: 5,
    slug: "woodcraft-showroom",
    title: "Woodcraft Showroom",
    category: "Commercial",
    location: "Ahmedabad",
    area: "2,200 sq ft",
    year: "2023",
    duration: "7 weeks",
    featured: true,
    image: "/images/project-showroom.jpg",
    gallery: [
      "/images/project-showroom.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/gallery-detail-2.jpg",
    ],
    description:
      "A furniture showroom designed to showcase craftsmanship — warm lighting, natural textures, and vignette displays that tell each product's story.",
    challenge:
      "The showroom needed to feel like a home, not a warehouse — every display needed to be shoppable and emotionally engaging.",
    solution:
      "Room-within-room vignettes, warm incandescent lighting, and hand-selected artwork create a showroom that invites discovery.",
    clientQuote:
      "Sales increased by 40% after the redesign. The space sells itself.",
    clientName: "Raj Furniture",
    materials: ["Teak Wood", "Hand-troweled Plaster", "Vintage Brass", "Wool Rugs"],
    bgGradient: "linear-gradient(135deg, #24201A 0%, #2E261E 100%)",
  },
  {
    id: 6,
    slug: "azure-hotel-suite",
    title: "Azure Hotel Suite",
    category: "Hotel",
    location: "Goa",
    area: "680 sq ft",
    year: "2023",
    duration: "4 weeks",
    featured: true,
    image: "/images/project-hotel.jpg",
    gallery: [
      "/images/project-hotel.jpg",
      "/images/gallery-detail-3.jpg",
      "/images/gallery-detail-2.jpg",
    ],
    description:
      "A boutique hotel suite where coastal calm meets refined luxury — natural linens, handcrafted pottery, and ocean-blue accents.",
    challenge:
      "To bring the feeling of Goa's coast inside without clichés — avoiding nautical kitsch while embracing genuine coastal serenity.",
    solution:
      "Bleached woods, handmade indigo textiles, and raw plaster walls create a suite that feels like a curated hideaway, not a tourist trap.",
    clientQuote:
      "Guests request this suite specifically. It's our most reviewed room online.",
    clientName: "Coastal Retreats Hospitality",
    materials: ["Bleached Teak", "Indigo Linen", "Raw Plaster", "Sea Glass"],
    bgGradient: "linear-gradient(135deg, #1A2030 0%, #202B40 100%)",
  },
  {
    id: 7,
    slug: "lumina-luxury-salon",
    title: "Lumina Luxury Salon",
    category: "Salon",
    location: "Mumbai",
    area: "1,200 sq ft",
    year: "2024",
    duration: "6 weeks",
    featured: true,
    image: "/images/project-salon.jpg",
    gallery: [
      "/images/project-salon.jpg",
      "/images/gallery-detail-1.jpg",
      "/images/gallery-detail-3.jpg",
    ],
    description:
      "An ethereal beauty sanctuary bathed in champagne brass, fluted travertine, and custom back-lit vanity arches.",
    challenge:
      "Creating seamless client flow and sound isolation between styling stations and tranquil treatment suites.",
    solution:
      "Acoustic velvet drapery, zoned ambient dimmer channels, and custom recessed styling stations.",
    clientQuote:
      "Clients constantly photograph our salon. It has elevated our brand recognition tremendously.",
    clientName: "Pooja Singhania",
    materials: ["Travertine", "Champagne Brass", "Custom Mirrors", "Bouclé"],
    bgGradient: "linear-gradient(135deg, #2E2418 0%, #3D3025 100%)",
  },
  {
    id: 8,
    slug: "zenith-turnkey-residence",
    title: "Zenith Turnkey Residence",
    category: "Turnkey",
    location: "Pune",
    area: "4,100 sq ft",
    year: "2024",
    duration: "16 weeks",
    featured: true,
    image: "/images/project-turnkey.jpg",
    gallery: [
      "/images/project-turnkey.jpg",
      "/images/gallery-detail-2.jpg",
      "/images/gallery-detail-1.jpg",
    ],
    description:
      "Full turnkey conversion of a raw duplex penthouse into a fully furnished, smart-automated luxury residence.",
    challenge:
      "Complete civil demolition, restructuring MEP services, and executing custom imported finishes in 16 weeks.",
    solution:
      "Single-contract coordination with dedicated civil, electrical, carpentry, and styling crews working in parallel phases.",
    clientQuote:
      "Walking into a completed, immaculate home with zero coordination headaches was worth every rupee.",
    clientName: "Deepak & Sunita Kothari",
    materials: ["Italian Marble", "Smart Lighting Panels", "Acoustic Ceilings", "PU Cabinetry"],
    bgGradient: "linear-gradient(135deg, #1C2226 0%, #26221C 100%)",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Arjun & Priya Mehra",
    project: "Residential Villa, Mumbai",
    rating: 5,
    quote:
      "Bright Space didn't just design our home — they understood our life and created a space we never want to leave. The team's attention to detail was extraordinary.",
  },
  {
    id: 2,
    name: "Chef Rohan Kapoor",
    project: "The Leaf Restaurant, Pune",
    rating: 5,
    quote:
      "Our guests always comment on the ambiance first. Bright Space created something truly special — a restaurant that feels like an experience, not just a meal.",
  },
  {
    id: 3,
    name: "Vikram Shah",
    project: "Horizon Office, Bangalore",
    rating: 5,
    quote:
      "Employee satisfaction went up from the first day. The design communicates our brand values perfectly. Highly recommend Bright Space for any commercial project.",
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
