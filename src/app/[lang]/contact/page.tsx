import { getStrings } from '@/lib/server-utils'
import React from 'react'

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang }: { lang: string } = await params
  const strings = await getStrings(lang)

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">{strings.contactPageHeading ?? "Байланыс"}</h1>
      <p className="mb-4">
        {strings.contactPageDescription ?? "Инжиниринг Орталығына хабарласыңыз. Бұл жерде байланыс детальдары мен орналасу ақпаратын таба аласыз."}
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">{strings.contactPageContactInformationHeading ?? "Байланыс ақпараты"}</h2>
        <p>Email: <a className="text-blue-600 hover:underline" href="mailto:IEC_GMK@satbayev.university">IEC_GMK@satbayev.university</a></p>
      </div>
    </div>
  )
}
