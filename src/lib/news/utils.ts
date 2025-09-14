import fs from "fs";
import matter from "gray-matter";
import { getNewsData } from "../server-utils";

import { MatterAndContent } from "./types";
import path from "path";

export const getNewsEntry = async (hl: string, slug: string): Promise<MatterAndContent | null> => {
  const filePath = (await getNewsData(hl)).find((item) => item.slug === slug)?.contentMdxPath;
  if (!filePath) {
    return null;
  }
  const fullPath = path.join(process.cwd(), 'public', 'static-content', filePath!);
  const content = fs.readFileSync(fullPath, "utf8");

  const parsed = matter(content);
  if (parsed.excerpt === undefined || parsed.excerpt === '') {
    parsed.excerpt = parsed.content
      .slice(0, 160)
      .replace(/\s+/g, ' ');
  }
  return { ...parsed, slug } as unknown as MatterAndContent;
};

export const headingToUrl = (heading: string) => heading.replace(/[ ]/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();


export const parseHeadings = (content: string) => {
  const tagHeadings = content.match(/(<h\d>)(.*)<\/h\d>/gm);
  const mdHeadings = content.match(/^ *(#{1,4}) (.*)$/gm);
  const headings = [...(tagHeadings ?? []), ...(mdHeadings ?? [])];
  return headings.map((heading) => {
    const trimmed = heading.trim();
    const level = trimmed.match(/^ *(#{1,4}) /)?.[1].length ?? parseInt(trimmed.match(/^<h(\d)>/)?.[1] ?? '0') ?? 0;
    const text = trimmed.replace(/^ *#{1,4} /, '').replace(/<h\d>/, '').replace(/<\/h\d>/, '').trim();
    return { level: level - 1, text, anchor: headingToUrl(text) };
  }).filter((heading) => heading.text !== '' && heading.level >= 0);
};
