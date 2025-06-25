"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Youtube from "@/assets/icons/youtube.svg";
import Instagram from "@/assets/icons/instagram.svg";
import { Lab, LabsData } from "@/lib/types";
import LanguageSwitcher from "./language-switcher";

type StringCollection = string | string[];

// Client component for mobile menu
export default function MobileMenu({
  labsData,
  strings,
  language
}: {
  labsData: LabsData;
  strings: Record<string, StringCollection>;
  language: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLabsSubmenu, setShowLabsSubmenu] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link href={`/${language}/about`} className="py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              {strings.navbarItemAboutCentre ?? 'Орталық туралы'}
            </Link>

            <div>
              <button
                onClick={() => setShowLabsSubmenu(!showLabsSubmenu)}
                className="flex items-center justify-between w-full py-2"
              >
                <span>{strings.navbarItemLabs ?? 'Лабораториялар'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${showLabsSubmenu ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showLabsSubmenu && (
                <div className="pl-4 mt-2 border-l-2 border-gray-200 space-y-2">
                  <div className="py-1"><Link href="/labs" className="block hover:text-blue-600">Все лаборатории</Link></div>
                  {Object.entries(labsData).map(([labId, lab]: [string, Lab]) => (
                    <div key={labId} className="py-1">
                      <Link
                        href={`/${language}/labs/${labId}`}
                        className="block hover:text-blue-600 text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        {lab.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${language}/team`} className="py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              {strings.navbarItemTeam ?? 'Команда'}
            </Link>
            <Link href={`/${language}/contact`} className="py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              {strings.navbarItemContacts ?? 'Байланыс'}
            </Link>

            <div className="flex gap-4 py-2">
              <Link href="https://www.youtube.com" onClick={() => setIsOpen(false)}>
                <Image src={Youtube} alt="Youtube" width={24} height={24} />
              </Link>
              <Link href="https://www.instagram.com" onClick={() => setIsOpen(false)}>
                <Image src={Instagram} alt="Instagram" width={24} height={24} />
              </Link>
            </div>

            <div className="pt-2 border-t">
              <LanguageSwitcher onLanguageChange={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
