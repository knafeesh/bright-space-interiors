import { PROJECTS as DEFAULT_PROJECTS, SERVICES as DEFAULT_SERVICES, SPECIALTY_SERVICES as DEFAULT_SPECIALTIES } from "./data";

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  area: string;
  year: string;
  duration: string;
  featured: boolean;
  image: string;
  gallery: string[];
  description: string;
  challenge: string;
  solution: string;
  clientQuote: string;
  clientName: string;
  materials: string[];
  bgGradient: string;
}

export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  subServices: string[];
  bgColor: string;
  faqs: { q: string; a: string }[];
}

export interface SpecialtyService {
  name: string;
  tagline: string;
  image: string;
  description: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  folder: "Projects" | "Services" | "Team" | "Hero" | "Renders";
  size: string;
  dimensions: string;
  type: "WebP" | "JPEG" | "PNG" | "MP4";
  altText: string;
  dateAdded: string;
}

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  { id: "m-1", name: "real-salon-facade.jpg", url: "/images/real-salon-facade.jpg", folder: "Projects", size: "210 KB", dimensions: "1920 × 1280", type: "JPEG", altText: "The Hair Palace London Glass Facade & Floral Arches", dateAdded: "2024-10-05" },
  { id: "m-2", name: "real-salon-reception.jpg", url: "/images/real-salon-reception.jpg", folder: "Projects", size: "101 KB", dimensions: "1600 × 1060", type: "JPEG", altText: "L'Oréal & Kérastase Branded Reception Desk", dateAdded: "2024-10-05" },
  { id: "m-3", name: "real-salon-chesterfield.jpg", url: "/images/real-salon-chesterfield.jpg", folder: "Projects", size: "221 KB", dimensions: "1920 × 1440", type: "JPEG", altText: "VIP Chesterfield Leather Waiting Lounge", dateAdded: "2024-10-05" },
  { id: "m-4", name: "real-salon-styling.jpg", url: "/images/real-salon-styling.jpg", folder: "Projects", size: "191 KB", dimensions: "1920 × 1440", type: "JPEG", altText: "Gilded Arched Mirrors & Styling Stations", dateAdded: "2024-10-05" },
  { id: "m-5", name: "real-salon-mainhall.jpg", url: "/images/real-salon-mainhall.jpg", folder: "Services", size: "151 KB", dimensions: "1920 × 1080", type: "JPEG", altText: "Luxury Salon Main Hall & Halo Chandeliers", dateAdded: "2024-10-05" },
  { id: "m-6", name: "real-salon-doors.jpg", url: "/images/real-salon-doors.jpg", folder: "Projects", size: "122 KB", dimensions: "1600 × 1200", type: "JPEG", altText: "Artisanal Pine Wood Barn Doors Treatment Suites", dateAdded: "2024-10-05" },
  { id: "m-7", name: "real-salon-pedispa.jpg", url: "/images/real-salon-pedispa.jpg", folder: "Projects", size: "161 KB", dimensions: "1920 × 1280", type: "JPEG", altText: "Hydrotherapy Pedispa Stations & Brick Wall", dateAdded: "2024-10-05" },
  { id: "m-8", name: "real-bedroom-headboard.jpg", url: "/images/real-bedroom-headboard.jpg", folder: "Projects", size: "221 KB", dimensions: "1920 × 1440", type: "JPEG", altText: "Master Bedroom Floor-to-Ceiling Wood Panelling & Headboard", dateAdded: "2024-10-05" },
  { id: "m-9", name: "real-bedroom-fluted.jpg", url: "/images/real-bedroom-fluted.jpg", folder: "Services", size: "75 KB", dimensions: "1280 × 960", type: "JPEG", altText: "Fluted Accent Wall & Geometric Sconce Light", dateAdded: "2024-10-05" },
  { id: "m-10", name: "real-wardrobe-tvunit.jpg", url: "/images/real-wardrobe-tvunit.jpg", folder: "Services", size: "103 KB", dimensions: "1600 × 1200", type: "JPEG", altText: "Custom Modular Wardrobe & Integrated TV Console", dateAdded: "2024-10-05" },
  { id: "m-11", name: "real-kitchen-maroon.jpg", url: "/images/real-kitchen-maroon.jpg", folder: "Services", size: "97 KB", dimensions: "1280 × 960", type: "JPEG", altText: "Cherry & Cream High-Gloss L-Shaped Modular Kitchen", dateAdded: "2024-10-05" },
  { id: "m-12", name: "real-kitchen-profile.jpg", url: "/images/real-kitchen-profile.jpg", folder: "Projects", size: "81 KB", dimensions: "1280 × 960", type: "JPEG", altText: "Under-Cabinet Profile LED & Undermount Sink", dateAdded: "2024-10-05" },
  { id: "m-13", name: "real-kitchen-saket.jpg", url: "/images/real-kitchen-saket.jpg", folder: "Projects", size: "105 KB", dimensions: "1600 × 1200", type: "JPEG", altText: "Saket Turnkey Dual-Tone Modular Kitchen", dateAdded: "2024-10-05" },
  { id: "m-14", name: "hero-luxury.jpg", url: "/images/hero-luxury.jpg", folder: "Hero", size: "380 KB", dimensions: "2560 × 1440", type: "JPEG", altText: "The Bright Space Interiors Hero Showcase", dateAdded: "2024-09-01" },
  { id: "m-15", name: "salon-rawls-reception.jpg", url: "/images/salon-rawls-reception.jpg", folder: "Projects", size: "193 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Rawls Salon Royal Carpet Reception Desk & Gold Crest", dateAdded: "2024-10-06" },
  { id: "m-16", name: "salon-rawls-mainhall.jpg", url: "/images/salon-rawls-mainhall.jpg", folder: "Projects", size: "204 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Rawls Salon Grand Hall Architectural Mirrors & Stations", dateAdded: "2024-10-06" },
  { id: "m-17", name: "salon-rawls-styling-suites.jpg", url: "/images/salon-rawls-styling-suites.jpg", folder: "Projects", size: "187 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Rawls Salon Ornate Gold Mirrors & Cognac Styling Chairs", dateAdded: "2024-10-06" },
  { id: "m-18", name: "salon-rawls-facade-site.jpg", url: "/images/salon-rawls-facade-site.jpg", folder: "Projects", size: "255 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Rawls Salon Multi-Tier Neoclassical Facade Scaffolding", dateAdded: "2024-10-06" },
  { id: "m-19", name: "office-gurugram-open-floor.jpg", url: "/images/office-gurugram-open-floor.jpg", folder: "Projects", size: "186 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Gurugram Corporate Office Open Workstation Floor with Red Baffle Lights", dateAdded: "2024-10-06" },
  { id: "m-20", name: "office-gurugram-workstations-lighting.jpg", url: "/images/office-gurugram-workstations-lighting.jpg", folder: "Projects", size: "122 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Gurugram Office Geometric Suspended LED Profile Lights & Ochre Screens", dateAdded: "2024-10-06" },
  { id: "m-21", name: "office-gurugram-executive-cabin.jpg", url: "/images/office-gurugram-executive-cabin.jpg", folder: "Projects", size: "113 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Gurugram Office Director's Corner Executive Cabin & Skyline View", dateAdded: "2024-10-06" },
  { id: "m-22", name: "office-gurugram-conference-room.jpg", url: "/images/office-gurugram-conference-room.jpg", folder: "Projects", size: "167 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Gurugram Corporate Office Boardroom & Video Conferencing Table", dateAdded: "2024-10-06" },
  { id: "m-23", name: "office-gurugram-modular-desks.jpg", url: "/images/office-gurugram-modular-desks.jpg", folder: "Projects", size: "196 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Gurugram Office Turnkey Modular Desk Assembly & Cable Trays", dateAdded: "2024-10-06" },
  { id: "m-24", name: "ranchi-agarwal-dining-hall.jpg", url: "/images/ranchi-agarwal-dining-hall.jpg", folder: "Projects", size: "170 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Agarwal Home Ranchi Marble Dining Suite & Tufted Chairs", dateAdded: "2024-10-06" },
  { id: "m-25", name: "ranchi-agarwal-fluted-tv-unit.jpg", url: "/images/ranchi-agarwal-fluted-tv-unit.jpg", folder: "Projects", size: "135 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Agarwal Home Ranchi Fluted Wooden TV Wall & Curved Console", dateAdded: "2024-10-06" },
  { id: "m-26", name: "ranchi-agarwal-ceiling-lighting.jpg", url: "/images/ranchi-agarwal-ceiling-lighting.jpg", folder: "Projects", size: "120 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Agarwal Home Ranchi Gypsum False Ceiling & Warm Cove LEDs", dateAdded: "2024-10-06" },
  { id: "m-27", name: "ranchi-agarwal-modular-crockery.jpg", url: "/images/ranchi-agarwal-modular-crockery.jpg", folder: "Projects", size: "73 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Agarwal Home Ranchi Modular Crockery Unit & Illuminated Bar", dateAdded: "2024-10-06" },
  { id: "m-28", name: "gurugram-manish-living-mirror-wall.jpg", url: "/images/gurugram-manish-living-mirror-wall.jpg", folder: "Projects", size: "96 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Manish Singh Park View City Gurugram Living Room Grid Mirror Wall & Marble Floor", dateAdded: "2024-10-06" },
  { id: "m-29", name: "gurugram-manish-grid-mirror-feature.jpg", url: "/images/gurugram-manish-grid-mirror-feature.jpg", folder: "Projects", size: "131 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Manish Singh Park View City Bronze Tinted Grid Mirror Accent Wall Feature", dateAdded: "2024-10-06" },
  { id: "m-30", name: "gurugram-manish-fluted-wall-console.jpg", url: "/images/gurugram-manish-fluted-wall-console.jpg", folder: "Projects", size: "72 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Manish Singh Fluted Accent Wall Floating Vanity Desk & Sconce", dateAdded: "2024-10-06" },
  { id: "m-31", name: "gurugram-manish-glass-partitions.jpg", url: "/images/gurugram-manish-glass-partitions.jpg", folder: "Projects", size: "104 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Mr. Manish Singh Fluted Architectural Glass Partition Doors & Black Metal Frame", dateAdded: "2024-10-06" },
  { id: "m-32", name: "kitchen-delhi-ncr-modern-lshape.jpg", url: "/images/kitchen-delhi-ncr-modern-lshape.jpg", folder: "Projects", size: "101 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Modular Kitchen L-Shaped Layout Quartz Counter & Wooden Louvers Delhi NCR", dateAdded: "2024-10-06" },
  { id: "m-33", name: "kitchen-delhi-ncr-high-gloss-black-marble.jpg", url: "/images/kitchen-delhi-ncr-high-gloss-black-marble.jpg", folder: "Projects", size: "112 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Modern High Gloss Acrylic Modular Kitchen with Black Marble Splash Delhi NCR", dateAdded: "2024-10-06" },
  { id: "m-34", name: "kitchen-delhi-ncr-craftsman-installation.jpg", url: "/images/kitchen-delhi-ncr-craftsman-installation.jpg", folder: "Projects", size: "101 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Modular Kitchen Hardware Installation On-Site Craftsmanship Delhi NCR", dateAdded: "2024-10-06" },
  { id: "m-35", name: "kitchen-delhi-ncr-profile-lighting-sink.jpg", url: "/images/kitchen-delhi-ncr-profile-lighting-sink.jpg", folder: "Projects", size: "88 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Modular Kitchen Under-Cabinet LED Profile Lights & Undermount Sink Delhi NCR", dateAdded: "2024-10-06" },
  { id: "m-36", name: "kitchen-delhi-ncr-cherry-ivory-dual-tone.jpg", url: "/images/kitchen-delhi-ncr-cherry-ivory-dual-tone.jpg", folder: "Projects", size: "98 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Dual Tone Maroon & Ivory Modular Kitchen Soft-Close Hardware Delhi NCR", dateAdded: "2024-10-06" },
  { id: "m-37", name: "sushant-lok-vdeliver-site-execution.jpg", url: "/images/sushant-lok-vdeliver-site-execution.jpg", folder: "Projects", size: "181 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Shri Ram Complex Sushant Lok Phase 1 Civil & Interior Execution", dateAdded: "2024-10-06" },
  { id: "m-38", name: "sushant-lok-vdeliver-stone-cutting-masonry.jpg", url: "/images/sushant-lok-vdeliver-stone-cutting-masonry.jpg", folder: "Projects", size: "175 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Granite & Marble On-Site Core Cutting Masonry Work Gurugram", dateAdded: "2024-10-06" },
  { id: "m-39", name: "sushant-lok-vdeliver-grand-hall-cove.jpg", url: "/images/sushant-lok-vdeliver-grand-hall-cove.jpg", folder: "Projects", size: "177 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Grand Interior Hallway Cove Lighting & Column Cladding Shri Ram Complex", dateAdded: "2024-10-06" },
  { id: "m-40", name: "sushant-lok-vdeliver-corridor-framing-flooring.jpg", url: "/images/sushant-lok-vdeliver-corridor-framing-flooring.jpg", folder: "Projects", size: "177 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Corridor Timber Partition Framing & Geometric Marble Flooring Execution", dateAdded: "2024-10-06" },
  { id: "m-41", name: "sushant-lok-vdeliver-ornate-panelling-joinery.jpg", url: "/images/sushant-lok-vdeliver-ornate-panelling-joinery.jpg", folder: "Projects", size: "195 KB", dimensions: "1024 × 768", type: "JPEG", altText: "Architectural Wood Panelling Gold Leaf Arched Mirrors & Custom Vanities", dateAdded: "2024-10-06" },
];

export interface CmsStore {
  projects: Project[];
  services: Service[];
  specialties: SpecialtyService[];
  media: MediaAsset[];
}

export function getDefaultCmsStore(): CmsStore {
  return {
    projects: DEFAULT_PROJECTS as Project[],
    services: DEFAULT_SERVICES as Service[],
    specialties: DEFAULT_SPECIALTIES as SpecialtyService[],
    media: INITIAL_MEDIA_ASSETS,
  };
}
