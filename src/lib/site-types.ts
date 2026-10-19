export interface SiteSettings {
  brandName: string;
  tagline: string;
  phoneNumber: string;
  altPhoneNumber: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  address: string;
  workingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
  designersCount: number;
  footerText: string;
  // Aliases for compatibility
  phone?: string;
  altPhone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface NavServiceItem {
  id?: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  caption?: string;
  href?: string;
  link?: string;
  whatsappMsg?: string;
  order: number;
  published: boolean;
}

export interface ServiceDetailItem {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  subServices: string[];
  bgColor: string;
  faqs: { q: string; a: string }[];
  order: number;
  published: boolean;
}

export interface SpecialtyServiceItem {
  id?: string;
  name: string;
  tagline: string;
  image?: string;
  description: string;
  icon?: string;
  order: number;
  published?: boolean;
}

export interface ProjectItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  categories: string[];
  location: string;
  area: string;
  year: string;
  duration: string;
  featured: boolean;
  status: "published" | "draft";
  image: string;
  gallery: string[];
  description: string;
  challenge: string;
  solution: string;
  clientQuote: string;
  clientName: string;
  client?: string;
  quote?: string;
  materials: string[];
  bgGradient: string;
  order: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  group: string;
  type: "residential" | "commercial";
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  metaTitle: string;
  metaDescription: string;
  designs: {
    id: string;
    title: string;
    image: string;
    tag?: string;
    description?: string;
  }[];
  order: number;
  published: boolean;
}

export interface TestimonialItem {
  id: number;
  name: string;
  project: string;
  rating: number;
  quote: string;
  order: number;
  published: boolean;
  author?: string;
  role?: string;
  location?: string;
}

export interface TeamMemberItem {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  published?: boolean;
}

export interface PhilosophySlide {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface PageSeoItem {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  folder: string;
  size: string | number;
  dimensions: string;
  type: string;
  altText: string;
  alt?: string;
  dateAdded: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  budget: string;
  message: string;
  time?: string;
  status: "New" | "Contacted" | "Won" | "Lost" | string;
  notes?: string;
  createdAt?: number;
}

export interface FullSiteStore {
  settings: SiteSettings;
  navServices: NavServiceItem[];
  detailedServices: ServiceDetailItem[];
  specialties: SpecialtyServiceItem[];
  projects: ProjectItem[];
  categories: CategoryItem[];
  testimonials: TestimonialItem[];
  team: TeamMemberItem[];
  philosophyCarousel: PhilosophySlide[];
  pageSeo: PageSeoItem[];
  media: MediaAssetItem[];
  updatedAt: number;
}

export interface SaveResult {
  success: boolean;
  persisted: boolean;
  storage: "firestore" | "local_disk" | "ephemeral_tmp";
  updatedAt: number;
  error?: string;
}
