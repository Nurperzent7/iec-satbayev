export type NewsMetadata = {
  title: string;
  description?: string;
  date: string;
  image?: string;
  thumbnail?: string;
  excerpt?: string;
  tags?: string[];
};

// Return type of gray-matter
export type MatterAndContent = {
  data: NewsMetadata;
  content: string;
  slug: string;
};
