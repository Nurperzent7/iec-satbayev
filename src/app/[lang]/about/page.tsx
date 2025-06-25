import { getStrings } from "@/lib/server-utils";

const LANGUAGES = ['kk', 'ru', 'en']

export async function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }))
}

type StringEntry = string | {
  type: "ul" | "ol"
  data: string[]
}

export default async function AboutPage(
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
  const defaultLandingSubtitle = [
    "Центр лабораторияларының және олардың қабілеттеріне бірыңғай қолжетімділік.",
    "Құрал-жабдықтар, зерттеу және персонал - ашық форматта."
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 lg:w-3/4 mx-auto">
        <section className="py-8 md:py-16">
          <div>
            <h1 className="text-3xl font-bold mb-6">{strings.aboutUsHeading}</h1>
            <div className="mb-4">
              {((strings.aboutUsContent ?? defaultLandingSubtitle) as StringEntry[]).map((content, index) => {
                if (typeof content === "string") {
                  return <p key={index} className="mb-4">{content}</p>
                }
                if (content.type === "ul") {
                  return <ul key={index} className="mb-4">
                    {content.data.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                }
                if (content.type === "ol") {
                  return <ol key={index} className="mb-4">
                    {content.data.map((item, index) => <li key={index}>{item}</li>)}
                  </ol>
                }
                return null
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
