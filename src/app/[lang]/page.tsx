import Link from "next/link";
import { getLabsData, getPublicationsData, getStrings } from "@/lib/server-utils";
import LabsCarousel from "@/components/labs-carousel";
import InPlaceCarousel from "@/components/in-place-carousel";
import { CarouselContent } from "@/lib/types";
import PublicationsTable from "@/components/publications-table";

const LANGUAGES = ['kk', 'ru', 'en']

export default async function Home(
  {
    params,
  }: {
    params: Promise<{ lang: string }>
  }
) {
  const lang = (await params).lang
  // Get all labs data
  const language = LANGUAGES.includes(lang) ? lang : LANGUAGES[0]
  const labsData = await getLabsData(language);
  const labEntries = Object.entries(labsData);
  const strings = await getStrings(language);
  const publicationsData = await getPublicationsData();
  const defaultLandingSubtitle = [
    "Центр лабораторияларының және олардың қабілеттеріне бірыңғай қолжетімділік.",
    "Құрал-жабдықтар, зерттеу және персонал - ашық форматта."
  ];

  // Define carousel content with mixed media
  const carouselContent: CarouselContent[] = [
    {
      type: 'image',
      src: '/images/landing/main-gif.gif',
      alt: 'Engineering Centre'
    },
    {
      type: 'video',
      videoUrl: 'https://youtu.be/S2wAVGtBv8g',
      title: 'Engineering Centre Introduction (YouTube)'
    },
    {
      type: 'video',
      videoUrl: 'https://youtu.be/kigQAakifdg',
      title: 'Engineering Centre Demo Video (YouTube)'
    },
    {
      type: 'video',
      directVideoUrl: '/gallery/IMG_4574.mp4', // Example direct video file
      title: 'Engineering Centre Demo Video'
    },
    {
      type: 'image',
      src: '/images/landing/main-gif.gif',
      alt: 'Engineering Centre Facilities'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 lg:w-3/4 mx-auto">
        <section className="py-8 md:py-16">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-2/5 flex flex-col mb-8 md:mb-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
                  {strings.landingTitle ?? 'Сәтбаев Университеті Инжиниринг Орталығы'}
                </h1>
                <div className="mb-6">
                  {((strings.landingSubtitle ?? defaultLandingSubtitle) as string[]).map((subtitle: string, index: number) => (
                    <p key={index} className="text-base md:text-lg text-gray-600 mb-2">
                      {subtitle}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col lg:flex-row sm:flex-col gap-4">
                  <Link
                    href={`/${language}/labs`}
                    className="py-2 px-4 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {strings.seeLabsButton ?? 'Лабораторияларды көру'}
                  </Link>
                  <Link
                    href={`/${language}/contact`}
                    className="py-2 px-4 text-center border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {strings.centreTeamButton ?? 'Орталық командасы'}
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-3/5 flex justify-center">
                <div className="rounded-lg w-full p-6">
                  <InPlaceCarousel content={carouselContent} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-2 md:py-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full mb-8 md:mb-0">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
                  {strings.aboutCentreHeading ?? 'Орталық туралы'}
                </h3>
                <div className="mb-4 flex flex-col gap-4">
                  {((strings.aboutCentreContent ?? defaultLandingSubtitle) as string[]).map((subtitle: string, index: number) => (
                    <p key={index} className="text-sm md:text-base text-gray-600">
                      {subtitle}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-2 md:py-4">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10 text-center">{strings.ourLabsHeading ?? 'Біздің лабораториялар'}</h2>
            <LabsCarousel labEntries={labEntries} language={language} />
          </div>
        </section>

        <section className="py-2 md:py-4">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10 text-center">{strings.publicationsHeading ?? 'Ғылыми еңбектер'}</h2>
            <div className="overflow-x-auto">
              <PublicationsTable
                seeMoreButtonText={strings.publicationsSeeMoreButton as string ?? 'Көбірек көру'}
                nationalPublicationText={strings.nationalPublicationText as string ?? 'Қазақстан Республикасы'}
                lang={language}
                headings={strings.publicationsTableHeading as string[] ?? []}
                publications={publicationsData}
                seeMoreAction="redirect"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
