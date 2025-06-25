// Define the Lab type
export type Lab = {
  title: string
  description: string
  professor: string
  imagePaths: string[]
  videoPaths: string[]
  benefits: string[]
  tasks: string[]
  solutions: string[]
  professorImagePath: string
}

// Define the LabsData type
export type LabsData = {
  [key: string]: Lab
}

// Define carousel content types
export type CarouselImageContent = {
  type: 'image'
  src: string
  alt?: string
}

export type CarouselVideoContent = {
  type: 'video'
  videoUrl?: string  // YouTube URL (optional)
  directVideoUrl?: string  // Direct video file URL (optional)
  title?: string
}

export type CarouselContent = CarouselImageContent | CarouselVideoContent

export type SocialLink = {
  network: 'LinkedIn' | 'Facebook',
  url: string
}

// Define the TeamMember type
export type TeamMember = {
  id: string
  name: string
  imagePath: string
  reportsTo: string | null
  level: number
  position: string
  hIndex?: number
  labId?: string,
  socialLinks?: SocialLink[]
}

// Define the TeamData type - an array of levels, each level is an array of TeamMembers
export type TeamData = TeamMember[][]

export type NewsEntry = {
  slug: string
  title: string
  date: string
  contentMdxPath: string
  imagePath?: string
}

export type Partner = {
  name: string
  logoPath?: string
  url?: string
  location?: string
}

export type PartnersData = {
  partners: Partner[]
  universityPartners: Partner[]
}

export type PublicationType =
  | 'International'
  | 'National'
  | 'Patent'

export type Author = {
  name: string,
  id?: string,
  labId?: string,
}

export type Publication = {
  title: string
  authors: Author[]
  publicationType: PublicationType
  year: number
  biographicalDatabase: string
  link?: string
}