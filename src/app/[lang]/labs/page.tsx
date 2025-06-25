import Link from 'next/link'
import { getLabsData } from '@/lib/server-utils'
import Image from 'next/image';

export default async function LabsPage({ params }: { params: Promise<{ lang: string }> }) {
  // Get all labs data
  const { lang }: { lang: string } = await params;
  const labsData = await getLabsData(lang)

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Research Laboratories</h1>

      <div className="max-w-3xl mx-auto mb-12 text-center">
        <p className="text-lg text-gray-700">
          The Satbayev Engineering Centre houses state-of-the-art laboratories for cutting-edge research
          and education in various engineering disciplines. Explore our labs below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(labsData).map(([labId, lab]) => (
          <div key={labId} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 flex items-center justify-center">
              <Image
                width={600}
                height={100}
                src={lab.imagePaths[0]}
                alt={lab.title}
                className="rounded-lg max-h-48"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{lab.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {lab.description}
              </p>
              <Link
                href={`/${lang}/labs/${labId}`}
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
