import React, { useState, useCallback } from 'react';
import { GridSegment, LineSegmentType } from '../types/plc';
import { validateSegmentPlacement } from '../utils/ladderValidation';
import { GRID_SIZE, POWER_RAIL_WIDTH } from '../utils/gridSystem';
import { SegmentTool } from './RungSegmentToolbar';
import GridSegmentComponent from './GridSegment';

interface RungGridProps {
  rungId: string;
  width: number;
  height: number;
  showGrid: boolean;
  selectedTool: SegmentTool;
  onSegmentsChange: (segments: GridSegment[]) => void;
  components: any[];
}

const RungGrid: React.FC<RungGridProps> = ({
  rungId,
  width,
  height,
  showGrid,
  selectedTool,
  onSegmentsChange,
  components
}) => {
  const [segments, setSegments] = useState<GridSegment[]>([]);

  const getGridPosition = useCallback((clientX: number, clientY: number) => {
    const element = document.getElementById(rungId);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left - POWER_RAIL_WIDTH;
    const y = clientY - rect.top;

    return {
      position: Math.max(1, Math.round(x / GRID_SIZE)),
      row: Math.floor(y / GRID_SIZE)
    };
  }, [rungId]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getGridPosition(e.clientX, e.clientY);
    if (!pos) return;

    if (selectedTool === 'select') {
      return;
    }

    if (selectedTool === 'erase') {
      setSegments(prev => prev.filter(s => 
        !(s.position === pos.position && s.row === pos.row)
      ));
      onSegmentsChange(segments.filter(s => 
        !(s.position === pos.position && s.row === pos.row)
      ));
      return;
    }

    // Find existing segment at this position
    const existingSegment = segments.find(s => 
      s.position === pos.position && s.row === pos.row
    );

    if (existingSegment) {
      // Cycle through segment types on left click
      let newType: LineSegmentType;
      switch (existingSegment.type) {
        case 'horizontal':
          newType = 'vertical';
          break;
        case 'vertical':
          newType = 'L-up';
          break;
        case 'L-up':
          newType = 'L-down';
          break;
        case 'L-down':
          newType = 'T';
          break;
        case 'T':
          newType = 'horizontal';
          break;
        default:
          newType = 'horizontal';
      }

      const updatedSegments = segments.map(s => 
        s.id === existingSegment.id 
          ? { ...s, type: newType }
          : s
      );
      
      setSegments(updatedSegments);
      onSegmentsChange(updatedSegments);
      return;
    }

    // Validate placement for new segment
    if (!validateSegmentPlacement(pos.position, pos.row, selectedTool, segments, components)) {
      return;
    }

    // Create new segment
    const newSegment: GridSegment = {
      id: crypto.randomUUID(),
      type: selectedTool === 'connection' ? 'L-up' : selectedTool,
      position: pos.position,
      row: pos.row,
      mirrored: false,
      flipped: false
    };

    const updatedSegments = [...segments, newSegment];
    setSegments(updatedSegments);
    onSegmentsChange(updatedSegments);
  }, [selectedTool, segments, components, onSegmentsChange, getGridPosition]);

  return (
    <div
      id={rungId}
      className="relative w-full h-full"
      onClick={handleClick}
      style={{
        backgroundImage: showGrid ? 'linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px)' : 'none',
        backgroundSize: `${GRID_SIZE}px 100%`,
        backgroundPosition: `${POWER_RAIL_WIDTH}px 0`
      }}
    >
      {segments.map(segment => (
        <GridSegmentComponent
          key={segment.id}
          segment={segment}
          onClick={() => {/* Handle segment click */}}
          onFlipHorizontal={() => {
            const updated = segments.map(s =>
              s.id === segment.id ? { ...s, mirrored: !s.mirrored } : s
            );
            setSegments(updated);
            onSegmentsChange(updated);
          }}
          onFlipVertical={() => {
            const updated = segments.map(s =>
              s.id === segment.id ? { ...s, flipped: !s.flipped } : s
            );
            setSegments(updated);
            onSegmentsChange(updated);
          }}
          isSelected={false}
        />
      ))}
    </div>
  );
};

export default RungGrid;