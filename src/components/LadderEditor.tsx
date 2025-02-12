import React, { useState } from 'react';
import Rung from './Rung';
import VerticalLink from './VerticalLink';
import RungSegmentToolbar, { SegmentTool } from './RungSegmentToolbar';
import { useVerticalLinks } from '../hooks/useVerticalLinks';
import { VerticalLink as VerticalLinkType } from '../types/plc';

const RUNG_HEIGHT = 96;

interface LadderEditorProps {
  rungs: any[];
  onAddComponent: (rungIndex: number, position: number, tool: any) => void;
  onEditComponent: (rungIndex: number, componentIndex: number) => void;
  onDeleteComponent: (rungIndex: number, componentIndex: number) => void;
  onMoveComponent: (fromRung: number, toRung: number, fromIndex: number, toPosition: number) => void;
  onDeleteRung: (index: number) => void;
  showGrid: boolean;
  showAddresses?: boolean;
  showCrossReferences?: boolean;
}

const LadderEditor: React.FC<LadderEditorProps> = ({
  rungs,
  onAddComponent,
  onEditComponent,
  onDeleteComponent,
  onMoveComponent,
  onDeleteRung,
  showGrid,
  showAddresses,
  showCrossReferences
}) => {
  const { linkState, startLink, completeLink, cancelLink } = useVerticalLinks();
  const [verticalLinks, setVerticalLinks] = useState<VerticalLinkType[]>([]);
  const [selectedTool, setSelectedTool] = useState<SegmentTool>('select');

  const handleStartVerticalLink = (rung: number, position: number) => {
    if (selectedTool === 'select') {
      startLink(rung, position);
    }
  };

  const handleCompleteVerticalLink = (rung: number, position: number) => {
    if (selectedTool === 'select') {
      const newLink = completeLink(rung, position);
      if (newLink) {
        setVerticalLinks(prev => [...prev, newLink]);
      }
    }
  };

  const handleDeleteVerticalLink = (linkId: string) => {
    setVerticalLinks(prev => prev.filter(link => link.id !== linkId));
  };

  return (
    <div className="flex gap-4">
      {/* Segment Toolbar */}
      <RungSegmentToolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />

      {/* Ladder Editor */}
      <div className="flex-1 relative">
        {/* SVG layer for vertical links */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: rungs.length * RUNG_HEIGHT }}
        >
          {verticalLinks.map(link => (
            <VerticalLink
              key={link.id}
              link={link}
              rungHeight={RUNG_HEIGHT}
              onDelete={() => handleDeleteVerticalLink(link.id)}
            />
          ))}
        </svg>

        {/* Rungs */}
        {rungs.map((rung, index) => (
          <Rung
            key={index}
            index={index}
            components={rung.components}
            onAddComponent={onAddComponent}
            onEditComponent={onEditComponent}
            onDeleteComponent={onDeleteComponent}
            onMoveComponent={onMoveComponent}
            onDeleteRung={onDeleteRung}
            onStartVerticalLink={handleStartVerticalLink}
            onCompleteVerticalLink={handleCompleteVerticalLink}
            onDeleteVerticalLink={handleDeleteVerticalLink}
            isLastRung={index === rungs.length - 1}
            showGrid={showGrid}
            showAddresses={showAddresses}
            showCrossReferences={showCrossReferences}
            isCreatingLink={linkState.isCreating}
            selectedTool={selectedTool}
          />
        ))}
      </div>
    </div>
  );
};

export default LadderEditor;