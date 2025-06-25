'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LabsData } from '@/lib/types';

interface ClientTeamPageProps {
  currentAdvanced: boolean;
  labsData: LabsData;
  advancedViewString: string;
  simpleViewString: string;
  allLabsString: string;
}

export default function ClientTeamPage({
  currentAdvanced,
  labsData,
  advancedViewString = 'Күрделі көрініс',
  simpleViewString = 'Қарапайым көрініс',
  allLabsString = 'Барлық лабораториялар'
}: ClientTeamPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedLabId = searchParams.get('labId');

  // Toggle between simple and advanced view
  const toggleAdvancedView = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentAdvanced) {
      params.delete('advanced');
    } else {
      params.set('advanced', 'true');
    }

    // Preserve any existing labId filter
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle lab filtering
  const handleLabFilter = (labId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (labId) {
      params.set('labId', labId);
      // When a lab is selected, always use simple view
      params.delete('advanced');
    } else {
      params.delete('labId');
      // When going back to all labs, maintain the previous view mode
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Lab filtering dropdown */}
      <select
        onChange={(e) => handleLabFilter(e.target.value || null)}
        value={selectedLabId || ''}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
      >
        <option value="">{allLabsString}</option>
        {Object.entries(labsData).map(([id, lab]) => (
          <option key={id} value={id}>
            {lab.title}
          </option>
        ))}
      </select>
      {/* Only show toggle button when no lab is selected */}
      {!selectedLabId && (
        <button
          onClick={toggleAdvancedView}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          {currentAdvanced ? simpleViewString : advancedViewString}
        </button>
      )}
    </div>
  );
} 