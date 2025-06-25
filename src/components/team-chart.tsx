"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { TeamData, TeamMember } from '@/lib/types';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ReactFlow, {
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  useUpdateNodeInternals,
  Position,
  Handle
} from 'reactflow';
import FacebookIcon from '@/assets/icons/facebook.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import 'reactflow/dist/style.css';


interface TeamChartProps {
  teamData: TeamData;
  reportsTo?: string;
  directReports?: string;
  useAdvancedChart?: boolean;
}

export function TeamChart(props: TeamChartProps) {
  const { teamData, reportsTo = 'Басшысы', directReports = 'Тікелей бағыныштылар', useAdvancedChart = false } = props;
  const searchParams = useSearchParams();
  const labIdFilter = searchParams?.get('labId');

  // Never use advanced chart when a lab is selected
  const shouldUseAdvancedChart = labIdFilter ? false : useAdvancedChart;

  // Use the advanced chart or simple chart based on the prop
  return shouldUseAdvancedChart ? (
    <AdvancedTeamChart
      teamData={teamData}
      reportsTo={reportsTo}
      directReports={directReports}
      labIdFilter={labIdFilter}
    />
  ) : (
    <SimpleTeamChart
      teamData={teamData}
      reportsTo={reportsTo}
      directReports={directReports}
      labIdFilter={labIdFilter}
    />
  );
}

interface SimpleTeamChartProps {
  teamData: TeamData;
  reportsTo: string;
  directReports: string;
  labIdFilter: string | null;
}

function SimpleTeamChart({ teamData, reportsTo, directReports, labIdFilter }: SimpleTeamChartProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract language from current path
  const lang = pathname?.split('/')?.[1] || 'kk';

  // Filter team data based on labId if specified
  const filteredTeamData = useMemo(() => {
    if (!labIdFilter) return teamData;

    return teamData.map(level =>
      level.filter(member => member.labId === labIdFilter)
    ).filter(level => level.length > 0);
  }, [teamData, labIdFilter]);

  // Always limit to first 3 levels - removed showAllLevels state
  const visibleTeamData = useMemo(() => {
    return labIdFilter ? filteredTeamData : filteredTeamData.slice(0, 3);
  }, [filteredTeamData, labIdFilter]);

  // Navigate to lab page when clicking on a team member
  const handleMemberClick = (member: TeamMember) => {
    if (member.labId) {
      router.push(`/${lang}/labs/${member.labId}`);
    }
  };

  if (filteredTeamData.flat().length === 0) {
    return <div className="text-center py-8">No team members found.</div>;
  }

  return (
    <div className="flex flex-col items-center w-full space-y-8 py-10">
      <div className="w-full">
        {visibleTeamData.map((level, levelIndex) => (
          <div key={`level-${levelIndex}`} className="w-full mb-14">
            {/* Level 3 (index 2) is scrollable, others are centered */}
            <div className={`flex ${level.length >= 4 ? 'overflow-x-auto' : 'justify-center'} gap-6 w-full py-4`}>
              {level.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  teamData={filteredTeamData}
                  reportsTo={reportsTo}
                  directReportsString={directReports}
                  onClick={() => handleMemberClick(member)}
                />
              ))}
            </div>
            {levelIndex < visibleTeamData.length - 1 && (
              <div className="flex justify-center my-5">
                <div className="h-8 border-l-2 border-gray-300"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AdvancedTeamChartProps {
  teamData: TeamData;
  reportsTo: string;
  directReports: string;
  labIdFilter: string | null;
}

// Array of colors for different labs
const LAB_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#f97316', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#64748b', // slate
];

// Function to map labId to a color
function getLabColor(labId: string | undefined, allLabIds: (string | undefined)[]): string {
  if (!labId) return '#777777'; // Default gray for items without a labId

  // Get unique sorted lab IDs (filtering out undefined)
  const sortedLabIds = [...new Set(allLabIds.filter(Boolean))].sort();
  const index = sortedLabIds.indexOf(labId);

  // Use modulo to handle case where there are more labs than colors
  return LAB_COLORS[index % LAB_COLORS.length];
}

function AdvancedTeamChart({ teamData, reportsTo, directReports, labIdFilter }: AdvancedTeamChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [highlightedLabId, setHighlightedLabId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Extract language from current path
  const lang = pathname?.split('/')?.[1] || 'kk';

  // Custom node component
  const nodeTypes = useMemo(() => ({
    teamMember: TeamMemberNode
  }), []);

  // Create nodes and edges from team data
  useEffect(() => {
    const filteredMembers = labIdFilter
      ? teamData.flat().filter(member => member.labId === labIdFilter)
      : teamData.flat();

    // Always show all levels - removed filtering by level
    const visibleMembers = filteredMembers;

    if (visibleMembers.length === 0) return;

    // Get all unique lab IDs for color mapping
    const allLabIds = visibleMembers.map(member => member.labId);

    // Group members by level
    const membersByLevel = visibleMembers.reduce((acc, member) => {
      if (!acc[member.level]) acc[member.level] = [];
      acc[member.level].push(member);
      return acc;
    }, {} as Record<number, TeamMember[]>);

    // Create nodes
    const newNodes: Node[] = [];
    const levels = Object.keys(membersByLevel).sort((a, b) => Number(a) - Number(b));

    levels.forEach((level, levelIndex) => {
      const membersInLevel = membersByLevel[Number(level)];
      const nodeWidth = 160;
      const levelWidth = membersInLevel.length * (nodeWidth + 30);
      const startX = -levelWidth / 2 + nodeWidth / 2;

      membersInLevel.forEach((member, memberIndex) => {
        const labColor = getLabColor(member.labId, allLabIds);
        const isHighlighted = member.labId && highlightedLabId === member.labId;
        newNodes.push({
          id: member.id,
          type: 'teamMember',
          position: {
            x: startX + memberIndex * (nodeWidth + 30),
            y: levelIndex * 350  // Increased vertical spacing from 250 to 350
          },
          draggable: false,
          data: {
            member,
            allMembers: filteredMembers,
            reportsTo,
            directReports,
            labColor,
            isHovered: hoveredElementId === member.id,
            isHighlighted: !!isHighlighted,
          },
          sourcePosition: Position.Top,
          targetPosition: Position.Bottom,
          style: {
            zIndex: 10, // Ensure nodes are above edges
            cursor: 'pointer' // Add pointer cursor
          }
        });
      });
    });

    // Create edges
    const newEdges: Edge[] = [];
    visibleMembers.forEach(member => {
      if (member.reportsTo && visibleMembers.some(m => m.id === member.reportsTo)) {
        const edgeId = `${member.id}-${member.reportsTo}`;
        const labColor = getLabColor(member.labId, allLabIds);
        const isHighlighted = member.labId && highlightedLabId === member.labId;
        newEdges.push({
          id: edgeId,
          source: member.id,
          target: member.reportsTo,
          sourceHandle: member.id,
          targetHandle: member.reportsTo,
          type: 'step',
          style: {
            strokeWidth: isHighlighted || hoveredElementId === edgeId ? 2 : 1,
            stroke: isHighlighted || hoveredElementId === edgeId ? labColor : '#cccccc',
            zIndex: 5 // Make sure edges are behind nodes
          },
          animated: false,
          data: {
            labId: member.labId,
            labColor
          },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [teamData, labIdFilter, setNodes, setEdges, hoveredElementId, highlightedLabId, reportsTo, directReports]);

  // Handle node hover
  const onNodeMouseEnter = (event: React.MouseEvent, node: Node) => {
    setHoveredElementId(node.id);
    const member = node.data?.member as TeamMember;
    if (member && member.labId) {
      setHighlightedLabId(member.labId);
    }
  };

  const onNodeMouseLeave = () => {
    setHoveredElementId(null);
    setHighlightedLabId(null);
  };

  // Handle edge hover
  const onEdgeMouseEnter = (event: React.MouseEvent, edge: Edge) => {
    setHoveredElementId(edge.id);

    // Find the node for this edge's source
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (sourceNode && sourceNode.data?.member) {
      const member = sourceNode.data.member as TeamMember;
      if (member.labId) {
        setHighlightedLabId(member.labId);
      }
    }
  };

  const onEdgeMouseLeave = () => {
    setHoveredElementId(null);
    setHighlightedLabId(null);
  };

  // Handle node click for navigation
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    const member = node.data?.member as TeamMember;
    if (member && member.labId) {
      router.push(`/${lang}/labs/${member.labId}`);
    }
  };

  if (teamData.flat().filter(member => !labIdFilter || member.labId === labIdFilter).length === 0) {
    return <div className="text-center py-8">No team members found.</div>;
  }

  return (
    <div className="w-full h-[800px] border border-gray-300 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        zoomOnScroll
        nodesDraggable={false} // Disable node dragging
        edgesFocusable={true}  // Allow focusing on edges
        elementsSelectable={true} // Make elements selectable
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onNodeClick={onNodeClick} // Add click handler
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

// Custom ReactFlow node component
function TeamMemberNode({ data }: {
  data: {
    member: TeamMember,
    allMembers: TeamMember[],
    reportsTo?: string,
    directReports: string,
    labColor: string,
    isHovered: boolean,
    isHighlighted: boolean
  }
}) {
  const { member, allMembers, reportsTo, labColor, isHovered, isHighlighted } = data;
  const directReportsList = findDirectReports(member.id, [allMembers]);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(member.id)
  }, [member.id, updateNodeInternals])

  return (
    <div className="z-20">
      {reportsTo && <Handle type="source" position={Position.Top} />}
      <div
        className="flex flex-col items-center w-40 p-3 bg-white rounded-lg shadow-md border transition-all duration-200"
        style={{
          borderColor: isHovered || isHighlighted ? labColor : '#e5e7eb',
          borderWidth: isHovered || isHighlighted ? '2px' : '1px',
          cursor: 'pointer'
        }}
      >
        <div
          className="relative w-16 h-16 mb-2 rounded-full overflow-hidden border-2 transition-all duration-200"
          style={{ borderColor: isHovered || isHighlighted ? labColor : '#e5e7eb' }}
        >
          <Image
            src={member.imagePath}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
        <h4 className="text-sm font-bold text-gray-800 text-center">{member.name}</h4>
        <p className="text-xs text-gray-600 mb-1 text-center">{member.position}</p>

        {member.hIndex && (
          <p className="text-xs text-gray-600 mt-1 mb-1 text-center">h-index: {member.hIndex}</p>
        )}

        {/* Social links */}
        {member.socialLinks && member.socialLinks.length > 0 && (
          <div className="flex mt-2 space-x-2">
            {member.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                {link.network === 'LinkedIn' ? (
                  <Image src={LinkedinIcon} alt="LinkedIn" width={16} height={16} />
                ) : (
                  <Image src={FacebookIcon} alt="Facebook" width={16} height={16} />
                )}
              </a>
            ))}
          </div>
        )}

        {/* {directReportsList.length > 0 && (
          <div className="mt-1 text-xs text-gray-500 text-center">
            <p>{directReports}: {directReportsList.length}</p>
          </div>
        )} */}
      </div>
      {directReportsList.length > 0 && <Handle type="target" position={Position.Bottom} />}
    </div>
  );
}

interface TeamMemberCardProps {
  member: TeamMember;
  teamData: TeamData;
  reportsTo: string;
  directReportsString: string;
  onClick: () => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onClick }) => {
  // Find direct reports
  // const directReports = findDirectReports(member.id, teamData);

  return (
    <div
      className="flex flex-col items-center w-40 min-w-36 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <div className="relative w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src={member.imagePath}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <h4 className="text-base font-bold text-gray-800 text-center">{member.name}</h4>
      <p className="text-sm text-gray-700 mb-1 text-center">{member.position}</p>

      {member.hIndex && (
        <p className="text-sm text-gray-600 mt-1 mb-1 text-center">h-index: {member.hIndex}</p>
      )}

      {/* Social links */}
      {member.socialLinks && member.socialLinks.length > 0 && (
        <div className="flex mt-2 space-x-2" onClick={(e) => e.stopPropagation()}>
          {member.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              {link.network === 'LinkedIn' ? (
                <Image src={LinkedinIcon} alt="LinkedIn" width={20} height={20} />
              ) : (
                <Image src={FacebookIcon} alt="Facebook" width={20} height={20} />
              )}
            </a>
          ))}
        </div>
      )}

      {/* {directReports.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <p>{directReportsString}: {directReports.length}</p>
        </div>
      )} */}
    </div>
  );
};

function findDirectReports(managerId: string, teamData: TeamData): TeamMember[] {
  const reports: TeamMember[] = [];

  for (const level of teamData) {
    for (const member of level) {
      if (member.reportsTo === managerId) {
        reports.push(member);
      }
    }
  }

  return reports;
} 