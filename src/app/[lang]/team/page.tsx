import { getStrings, getTeamData, getLabsData } from '@/lib/server-utils'
import { TeamChart } from '@/components/team-chart'
import { Suspense } from 'react'
import ClientTeamPage from '@/components/team-page-client-view'

// Page component
export default async function TeamPage({ params, searchParams }: {
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ advanced?: string, labId?: string }>
}) {
  // Get the team data and strings
  const { lang } = await params
  const strings = await getStrings(lang)
  const teamData = await getTeamData(lang)
  const labsData = await getLabsData(lang)
  const { advanced, labId } = await searchParams

  // If a lab is selected, always use simple view
  const labIdSelected = !!labId
  const useAdvancedChart = !labIdSelected && advanced === 'true'

  return (
    <div className="mx-auto py-12 px-4 lg:w-3/4">
      <h1 className="text-3xl font-bold mb-6">{strings.teamPageHeading ?? 'Команда'}</h1>

      {/* Team Chart */}
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <ClientTeamPage
              currentAdvanced={useAdvancedChart}
              labsData={labsData}
              advancedViewString={strings.teamPageAdvancedView as string}
              simpleViewString={strings.teamPageSimpleView as string}
              allLabsString={strings.teamPageAllLabs as string}
            />
          </Suspense>
        </div>

        <TeamChart
          teamData={teamData}
          reportsTo={strings.teamPageReportsTo as string | undefined}
          directReports={strings.teamPageDirectReports as string | undefined}
          useAdvancedChart={useAdvancedChart}
        />
      </div>
    </div>
  )
}
