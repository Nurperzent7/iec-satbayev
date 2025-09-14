import { promises as fs } from 'fs';
import path from 'path';
import { LabsData, NewsEntry, TeamData, PartnersData, TeamMember, Partner, Publication } from "./types";
import { formatUTCDate } from './utils';

const LANGUAGES = ["en", "kk", "ru"];

// Common function to load JSON data
async function loadJsonData<T>(hl: string, filename: string): Promise<T> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'static-content', hl, filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading ${filename} data:`, error);
    return {} as T;
  }
};

export const getGalleryPaths = async (): Promise<string[]> => {
  try {
    const galleryPath = path.join(process.cwd(), 'public', 'gallery');
    const files = await fs.readdir(galleryPath);
    return files.map(file => `/gallery/${file}`);
  } catch (error) {
    console.error('Error reading gallery paths:', error);
    return [];
  }
};

// Function to get all labs data from JSON file
export const getLabsData = async (hl: string): Promise<LabsData> => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'static-content', 'labs.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return Object.fromEntries(Object.entries(data).map(([labId, lab]) => {
      const langLab = Object.fromEntries(Object.entries(lab as object).map(([key, val]) => {
        if (typeof val === 'object' && Object.keys(val).every(key => LANGUAGES.includes(key))) {
          return [key, val[hl]];
        }
        return [key, val];
      }));
      return [labId, langLab];
    })) as LabsData;
  } catch (error) {
    console.error(`Error reading labs data:`, error);
    return {} as LabsData;
  }
};

type TeamMemberWithLangs = Omit<TeamMember, 'name' | 'position'> & {
  name: Record<string, string>
  position: Record<string, string>
}

// Function to get team data from JSON file
export const getTeamData = async (hl: string): Promise<TeamData> => {
  const filePath = path.join(process.cwd(), 'public', 'static-content', 'team.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  const results = data.map((tier: TeamMemberWithLangs[]) => tier.map((member: TeamMemberWithLangs) => ({
    ...member,
    name: member.name[hl],
    position: member.position[hl],
  })));
  return results;
};

export const getStrings = async (hl: string): Promise<Record<string, string | string[]>> => {
  const filePath = path.join(process.cwd(), 'public', 'static-content', 'strings.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    return [key, (value as Record<string, string | string[]>)[hl]];
  }));
};

type PartnerWithLangs = Omit<Partner, 'name' | 'location'> & {
  name: Record<string, string>
  location: Record<string, string>
}

export const getPartnersData = async (hl: string): Promise<PartnersData> => {
  const filePath = path.join(process.cwd(), 'public', 'static-content', 'partners.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  const results = {
    partners: data.partners.map((partner: PartnerWithLangs) => ({
      ...partner,
      name: partner.name[hl],
      location: partner.location[hl],
    })),
    universityPartners: data.universityPartners.map((partner: PartnerWithLangs) => ({
      ...partner,
      name: partner.name[hl],
      location: partner.location[hl],
    })),
  }
  return results;
};

export const getNewsData = async (hl: string): Promise<NewsEntry[]> => {
  const data = await loadJsonData<NewsEntry[]>(hl, 'news.json');
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => ({
    ...item,
    date: formatUTCDate(item.date, hl),
  }));
};

export const getPublicationsData = async (): Promise<Publication[]> => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'static-content', 'publications.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading publications data:`, error);
    return [] as Publication[];
  }
};