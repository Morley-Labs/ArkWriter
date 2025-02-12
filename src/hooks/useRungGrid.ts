import { useState, useCallback, useRef } from 'react';
import { GridSegment, LineSegmentType } from '../types/plc';

interface UseRungGridProps {
  rungId: string;
  initialSegments: GridSegment[];
  onChange: (segments: GridSegment[]) => void;
}

export function useRungGrid({ rungId, initialSegments, onChange }: UseRungGridProps) {
  const [segments, setSegments] = useState<GridSegment[]>(initialSegments);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const segmentsRef = useRef(segments);

  // Update ref when segments change
  segmentsRef.current = segments;

  const handleGridClick = useCallback((position: number, row: number, type: LineSegmentType) => {
    setSegments(prev => {
      let newSegments: GridSegment[];

      if (type === 'none') {
        // Remove segment at position
        newSegments = prev.filter(s => !(s.position === position && s.row === row));
      } else {
        // Add or update segment
        const existingIndex = prev.findIndex(s => s.position === position && s.row === row);
        if (existingIndex >= 0) {
          newSegments = prev.map((s, i) => 
            i === existingIndex ? { ...s, type } : s
          );
        } else {
          const newSegment: GridSegment = {
            id: crypto.randomUUID(),
            type,
            position,
            row,
            mirrored: false,
            flipped: false
          };
          newSegments = [...prev, newSegment];
        }
      }

      onChange(newSegments);
      return newSegments;
    });
  }, [onChange]);

  const flipSegment = useCallback((segmentId: string) => {
    setSegments(prev => {
      const newSegments = prev.map(seg =>
        seg.id === segmentId
          ? {
              ...seg,
              mirrored: seg.type === 'T' ? seg.mirrored : !seg.mirrored,
              flipped: seg.type === 'T' ? !seg.flipped : seg.flipped
            }
          : seg
      );
      onChange(newSegments);
      return newSegments;
    });
  }, [onChange]);

  const findIntersections = useCallback((segment: GridSegment) => {
    const intersections: { x: number; y: number }[] = [];
    segmentsRef.current.forEach(other => {
      if (other.id === segment.id) return;
      if (other.position === segment.position && other.row === segment.row) {
        intersections.push({ x: 20, y: 20 }); // Center of grid cell
      }
    });
    return intersections;
  }, []);

  return {
    segments,
    selectedSegment,
    setSelectedSegment,
    handleGridClick,
    flipSegment,
    findIntersections
  };
}