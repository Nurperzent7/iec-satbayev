'use client';

import { Author, Publication } from "@/lib/types";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PublicationsTableProps {
  lang: string;
  seeMoreButtonText: string;
  nationalPublicationText: string;
  headings: string[];
  publications: Publication[];
  seeMoreAction: 'scroll' | 'redirect';
}

export default function PublicationsTable({
  lang,
  seeMoreButtonText,
  nationalPublicationText,
  headings,
  publications,
  seeMoreAction,
}: PublicationsTableProps) {
  const [visibleRows, setVisibleRows] = useState(3);
  const router = useRouter();
  const handleSeeMore = () => {
    if (seeMoreAction === 'redirect') {
      router.push(`/${lang}/publications`);
    } else {
      setVisibleRows(prev => Math.min(prev + 10, publications.length));
    }
  };

  const formatDOILink = (link?: string) => {
    if (!link) return '';

    // Extract DOI reference from the link
    const doiMatch = link.match(/https?:\/\/doi\.org\/(.+?)(?:\/)?$/);
    if (doiMatch) {
      const doiRef = doiMatch[1];
      return `DOI: ${doiRef}`;
    }

    // Fallback for other link formats
    return link;
  };

  const renderAuthor = (author: Author, index: number, authors: Author[]) => {
    const isLast = index === authors.length - 1;
    const separator = isLast ? '' : ', ';

    if (author.labId) {
      return (
        <span key={index}>
          <Link
            href={`/${lang}/labs/${author.labId}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {author.name}
          </Link>
          {separator}
        </span>
      );
    } else if (author.id) {
      return (
        <span key={index}>
          <Link
            href={`/${lang}/team`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {author.name}
          </Link>
          {separator}
        </span>
      );
    } else {
      return (
        <span key={index}>
          {author.name}
          {separator}
        </span>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              {headings?.map((heading: string, index: number) => (
                <th
                  key={index}
                  className="border border-gray-300 p-3 text-sm md:text-base font-semibold text-gray-700 text-center"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {publications.slice(0, visibleRows).map((publication, index) => (
              <tr
                key={`publication-${index}:${publication.title}`}
                className={`hover:bg-gray-50 ${visibleRows < publications.length && index >= visibleRows - 2
                  ? 'relative'
                  : ''
                  }`}
              >
                <td className="border border-gray-300 p-3 text-center text-sm md:text-base">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-3 text-sm md:text-base">
                  {publication.title}
                </td>
                <td className="border border-gray-300 p-3 text-sm md:text-base">
                  {publication.authors.map((author, authorIndex) =>
                    renderAuthor(author, authorIndex, publication.authors)
                  )}
                </td>
                <td className="border border-gray-300 p-3 text-center text-sm md:text-base">
                  {publication.publicationType === 'National' ? nationalPublicationText : publication.publicationType}
                </td>
                <td className="border border-gray-300 p-3 text-center text-sm md:text-base">
                  {publication.year}
                </td>
                <td className="border border-gray-300 p-3 text-center text-sm md:text-base">
                  {publication.biographicalDatabase}
                </td>
                <td className="border border-gray-300 p-3 text-center text-sm md:text-base">
                  {publication.link ? (
                    <Link
                      href={publication.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {formatDOILink(publication.link)}
                    </Link>
                  ) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Blur overlay and see more button */}
        {visibleRows < publications.length && (
          <>
            {/* Gradient blur overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-[2px] pointer-events-none" />

            {/* See more button positioned over the blur */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleSeeMore}
                className="py-3 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm md:text-base font-medium shadow-lg hover:shadow-xl border-2 border-white"
              >
                {seeMoreButtonText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}