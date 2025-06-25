import { getPublicationsData, getStrings } from "@/lib/server-utils";
import PublicationsTable from "@/components/publications-table";

const LANGUAGES = ['kk', 'ru', 'en']

export default async function PublicationsPage(
  {
    params,
  }: {
    params: Promise<{ lang: string }>
  }
) {
  const lang = (await params).lang
  // Get all labs data
  const language = LANGUAGES.includes(lang) ? lang : LANGUAGES[0]
  const strings = await getStrings(language);
  const publicationsData = await getPublicationsData();

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 lg:w-3/4 mx-auto">
        <div className="container mx-auto pt-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10 text-center">{strings.publicationsHeading ?? 'Ғылыми еңбектер'}</h2>
          <div className="overflow-x-auto">
            <PublicationsTable
              seeMoreButtonText={strings.publicationsSeeMoreButton as string ?? 'Көбірек көру'}
              nationalPublicationText={strings.nationalPublicationText as string ?? 'Қазақстан Республикасы'}
              lang={language}
              headings={strings.publicationsTableHeading as string[] ?? []}
              publications={publicationsData}
              seeMoreAction="scroll"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
