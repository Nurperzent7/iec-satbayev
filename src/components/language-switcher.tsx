'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LANGUAGES = ['kk', 'ru', 'en'];

// Navigation item component
function NavItem({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className="py-2 cursor-pointer border-b-2 border-transparent hover:border-b-2 hover:border-blue-600 transition-colors text-center"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

// Language switcher component - client side
export default function LanguageSwitcher({ onLanguageChange }: { onLanguageChange?: () => void }) {
  // TODO: Add logic for news (slug is language dependent)
  const pathname = usePathname();

  // Get the path segments after the language
  const segments = pathname.split('/');
  // Remove the first empty segment and the language segment
  const pathWithoutLang = segments.slice(2).join('/');
  const urlParams = useSearchParams();
  const urlParamsString = urlParams.toString();

  return (
    <div className="flex gap-2 ml-2">
      {LANGUAGES.map((lang) => {
        // Create the new path with the selected language
        const newPath = `/${lang}${pathWithoutLang ? `/${pathWithoutLang}` : ''}` +
          (urlParamsString ? `?${urlParamsString}` : '');

        return (
          <NavItem key={lang} href={newPath} onClick={onLanguageChange}>
            {lang === 'kk' ? 'KZ' : lang.toUpperCase()}
          </NavItem>
        );
      })}
    </div>
  );
} 