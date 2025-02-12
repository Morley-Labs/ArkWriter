import React from 'react';
import { GridSegment as GridSegmentType } from '../types/plc';
import { GRID_SIZE, RAIL_WIDTH } from '../utils/gridSystem';

interface GridSegmentProps {
  segment: GridSegmentType;
  onClick: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  isSelected: boolean;
  intersections?: { x: number; y: number }[];
}

const GridSegment: React.FC<GridSegmentProps> = ({ 
  segment, 
  onClick, 
  onFlipHorizontal,
  onFlipVertical,
  isSelected,
  intersections = []
}) => {
  const getSegmentPath = () => {
    const width = GRID_SIZE;
    const height = GRID_SIZE;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    switch (segment.type) {
      case 'horizontal':
        return `M 0 ${halfHeight} H ${width}`;
      case 'vertical':
        return `M ${halfWidth} 0 V ${height}`;
      case 'L-up':
        return segment.mirrored
          ? `M ${width} ${halfHeight} H ${halfWidth} V 0`
          : `M 0 ${halfHeight} H ${halfWidth} V 0`;
      case 'L-down':
        return segment.mirrored
          ? `M ${width} ${halfHeight} H ${halfWidth} V ${height}`
          : `M 0 ${halfHeight} H ${halfWidth} V ${height}`;
      case 'T':
        if (segment.flipped) {
          // Upward T
          return `M 0 ${halfHeight} H ${width} M ${halfWidth} ${halfHeight} V 0`;
        } else {
          // Downward T
          return `M 0 ${halfHeight} H ${width} M ${halfWidth} ${halfHeight} V ${height}`;
        }
      default:
        return '';
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (segment.type === 'L-up' || segment.type === 'L-down') {
      onFlipHorizontal();
    } else if (segment.type === 'T') {
      onFlipVertical();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'f' || e.key === 'F') {
      if (segment.type === 'L-up' || segment.type === 'L-down') {
        onFlipHorizontal();
      } else if (segment.type === 'T') {
        onFlipVertical();
      }
    }
  };

  // Calculate z-index based on segment type
  const getZIndex = () => {
    switch (segment.type) {
      case 'horizontal':
        return 10;
      case 'vertical':
        return 20;
      case 'L-up':
      case 'L-down':
      case 'T':
        return 30;
      default:
        return 0;
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${(segment.position - 1) * GRID_SIZE + RAIL_WIDTH}px`,
        top: `${segment.row * GRID_SIZE}px`,
        width: GRID_SIZE,
        height: GRID_SIZE,
        zIndex: isSelected ? 100 : getZIndex()
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      title={`${segment.type}${segment.mirrored ? ' (mirrored)' : ''}${segment.flipped ? ' (flipped)' : ''} - Right-click or press F to flip`}
    >
      <svg
        width={GRID_SIZE}
        height={GRID_SIZE}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        {/* Main segment path */}
        <path
          d={getSegmentPath()}
          stroke={isSelected ? '#FF7F11' : '#000'}
          strokeWidth="2"
          fill="none"
          className="transition-colors duration-200"
          style={{ pointerEvents: 'all' }}
        />

        {/* Connection nodes at intersections */}
        {intersections.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={isSelected ? '#FF7F11' : '#000'}
            className="transition-colors duration-200"
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {/* Invisible hit area */}
        <rect
          x="0"
          y="0"
          width={GRID_SIZE}
          height={GRID_SIZE}
          fill="transparent"
          className="cursor-pointer hover:stroke-[#FF7F11]"
          style={{ pointerEvents: 'all' }}
        />
      </svg>
    </div>
  );
};

export default GridSegment;