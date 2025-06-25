import { notFound } from 'next/navigation'
import { getLabsData, getStrings } from '@/lib/server-utils'
import Link from 'next/link'
import InPlaceCarousel from '@/components/in-place-carousel'

// Page component
export default async function LabPage({ params }: { params: Promise<{ lang: string, labId: string }> }) {
  // Get the lab data
  const { lang, labId } = await params
  const labsData = await getLabsData(lang)
  const labData = labsData[labId]
  const strings = await getStrings(lang)
  // If the lab doesn't exist, show a 404 page
  if (!labData) {
    notFound()
  }

  return (
    <div className="mx-auto py-12 px-4 lg:w-3/4">
      <h1 className="text-3xl font-bold mb-6">{labData.title}</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-1">
          <p className="text-lg text-gray-700 mb-6">
            {labData.description}
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{strings.labPageProfessorHeading ?? 'Ғылыми басшысы'}</h2>
            <div className="flex flex-row items-start gap-4">
              {labData.professorImagePath && (
                <div className="w-24 h-24 overflow-hidden flex-shrink-0 rounded-full mb-2">
                  <img
                    src={labData.professorImagePath}
                    alt={labData.professor}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="mb-4">
                  {labData.professor}
                </p>
                <Link
                  href={`/${lang}/team?labId=${labId}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {strings.labPageViewTeam ?? 'View team'}
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{strings.labPageBenefitsHeading ?? 'Артықшылықтар'}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {labData.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{strings.labPageTasksHeading ?? 'Мақсаттар'}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {labData.tasks.map((task, index) => (
                <li key={index} className="text-gray-700">{task}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{strings.labPageSolutionsHeading ?? 'Шешімдер'}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {labData.solutions.map((solution, index) => (
                <li key={index} className="text-gray-700">{solution}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <InPlaceCarousel content={
            [
              ...labData.videoPaths.map(videoPath => ({
                type: 'video' as const,
                videoUrl: videoPath,
                title: labData.title
              })),
              ...labData.imagePaths.map(imagePath => ({
                type: 'image' as const,
                src: imagePath,
                alt: labData.title
              }
              )),
            ]
          } className="w-full" />
        </div>
      </div>
    </div>
  )
}
