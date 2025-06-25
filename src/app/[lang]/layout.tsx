import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import Image from "next/image";
import { redirect } from "next/navigation";
import Youtube from "@/assets/icons/youtube.svg";
import Instagram from "@/assets/icons/instagram.svg";
import { getLabsData, getStrings } from "@/lib/server-utils";
import MobileMenu from "@/components/mobile-menu";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/language-switcher";
import { Suspense } from "react";

const LANGUAGES = ['kk', 'ru', 'en']

export async function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }))
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satbayev Engineering Centre",
  description: "University engineering centre website",
};

const navItemCn = "py-2 cursor-pointer border-b-2 border-transparent hover:border-b-2 " +
  "hover:border-blue-600 transition-colors text-center text-sm"

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={navItemCn}
    >
      {children}
    </Link>
  );
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const lang = (await params).lang
  if (!LANGUAGES.includes(lang)) {
    redirect(`/${LANGUAGES[0]}`)
  }
  const language = LANGUAGES.includes(lang) ? lang : LANGUAGES[0]
  const labsData = await getLabsData(language);
  const strings = await getStrings(language);


  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
    >
      <header className="border-b sticky top-0 z-50 bg-white">
        <nav className="container mx-auto flex items-center justify-between px-4 lg:w-3/4 py-2">
          <Link href={`/${language}`} className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu
              labsData={labsData}
              strings={strings}
              language={language}
            />
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-3 lg:gap-4">
            <NavItem href={`/${language}/about`}>{strings.navbarItemAboutCentre ?? 'Орталық туралы'}</NavItem>
            <div className="relative group">
              <div className={navItemCn}>{strings.navbarItemLabs ?? 'Лабораториялар'}</div>
              <div className={cn("absolute left-1/2 -translate-x-1/2 top-full hidden",
                "group-hover:block bg-white shadow-lg rounded-md p-2 z-10 min-w-80")}
              >
                <div className="py-1">
                  <Link
                    href={`/${language}/labs`}
                    className="block px-4 py-2 hover:bg-gray-100 rounded-md font-medium"
                  >
                    {strings.navbarItemLabsSubmenu ?? 'Все лаборатории'}
                  </Link>
                </div>
                {Object.entries(labsData).map(([labId, lab]) => (
                  <div key={labId} className="py">
                    <Link
                      href={`/${language}/labs/${labId}`}
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm"
                    >
                      {lab.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <NavItem href={`/${language}/news`}>{strings.navbarItemNews ?? 'Жаңалықтар'}</NavItem>
            <NavItem href={`/${language}/team`}>{strings.navbarItemTeam ?? 'Команда'}</NavItem>
            <NavItem href={`/${language}/publications`}>{strings.navbarItemPublications ?? 'Ғылыми еңбектер'}</NavItem>
            <NavItem href={`/${language}/contact`}>{strings.navbarItemContacts ?? 'Байланыс'}</NavItem>
            <NavItem href={`/${language}/partners`}>{strings.navbarItemPartners ?? 'Серіктестер'}</NavItem>
            <NavItem href={`/${language}/gallery`}>{strings.navbarItemGallery ?? 'Галерея'}</NavItem>
            <NavItem href="https://www.youtube.com"><Image src={Youtube} alt="Youtube" width={24} height={24} /></NavItem>
            <NavItem href="https://www.instagram.com"><Image src={Instagram} alt="Instagram" width={24} height={24} /></NavItem>
            <Suspense fallback={<div>Loading...</div>}>
              <LanguageSwitcher />
            </Suspense>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-blue-600 text-white">
        <div className="text-center w-full px-auto bg-[#125cc9] py-6">
          <div className="mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-16 justify-center">
            <div className="mb-6 md:mb-0">
              <div className="font-bold mb-4">{strings.footerAddressHeader ?? 'Мекен-жайы'}</div>
              <div>{(strings.footerAddressContentLines as string[] ?? []).map((line: string, index: number) => (
                <div key={index}>{line}</div>
              ))}</div>
            </div>
            <div className="mb-6 md:mb-0">
              <div className="font-bold mb-4">{strings.footerAboutUniversityHeading ?? 'Университет туралы'}</div>
              <div className="flex flex-col gap-2">
                <Link href={`https://www.satbayev.university/${language}/about`}>{strings.footerAboutUniversityContent?.[0] ?? "Сәтбаев Университеті"}</Link>
                <Link href={`https://www.satbayev.university/${language}/warranty`}>{strings.footerAboutUniversityContent?.[1] ?? "Білім сапасы"}</Link>
                <Link href={`https://www.satbayev.university/${language}/contacts`}>{strings.footerAboutUniversityContent?.[2] ?? "Байланыс"}</Link>
              </div>
            </div>
            <div>
              <div className="font-bold mb-4">{strings.footerUsefulLinks ?? 'Пайдалы сілтемелер'}</div>
              <div className="flex flex-col gap-2">
                <Link href={`https://www.kb.satbayev.university`}>{strings.footerUsefulLinksContent?.[0] ?? "Электрондық қабылдау комиссиясы"}</Link>
                <Link href={`https://sso.satbayev.university`}>{strings.footerUsefulLinksContent?.[1] ?? "Білім порталы"}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container text-center mx-auto px-4 py-3">
          © {new Date().getFullYear()} Satbayev Engineering Centre
        </div>
      </footer>
    </div>
  );
}
