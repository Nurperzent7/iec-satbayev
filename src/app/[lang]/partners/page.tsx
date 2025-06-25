import Image from 'next/image';
import Link from 'next/link';
import { getPartnersData } from '@/lib/server-utils';
import { Partner } from '@/lib/types';

export default async function PartnersPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const { partners, universityPartners } = await getPartnersData(lang);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Partners</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Industry Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">University Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universityPartners.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const { name, logoPath, url, location } = partner;

  const card = (
    <div className="border rounded-lg shadow-sm p-6 h-full flex flex-col">
      {logoPath && (
        <div className="flex justify-center mb-4 flex-grow">
          <div className="relative h-32 w-full">
            <Image
              src={logoPath}
              alt={name ?? 'Partner Logo'}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      <div className="mt-auto">
        <h3 className="text-lg font-medium">{name}</h3>
        {location && <p className="text-gray-600 mt-1">{location}</p>}
      </div>
    </div>
  );

  if (url) {
    return (
      <Link href={url} target="_blank" rel="noopener noreferrer" className="transition hover:opacity-90">
        {card}
      </Link>
    );
  }

  return card;
}
