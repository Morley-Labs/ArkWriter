import React from 'react';
import { RungGrid } from '../utils/gridSystem';
import { getGridConstants } from '../utils/gridSystem';

interface GridOverlayProps {
  grid: RungGrid;
  dropIndicator: { x: number; valid: boolean } | null;
}

const { GRID_SIZE, RAIL_WIDTH } = getGridConstants();

export const GridOverlay: React.FC<GridOverlayProps> = ({ grid, dropIndicator }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Grid lines */}
      {grid.positions.map((pos) => (
        <div
          key={pos.x}
          className="absolute top-0 bottom-0 border-l border-gray-200"
          style={{
            left: `${RAIL_WIDTH + (pos.x - 1) * GRID_SIZE}px`,
          }}
        />
      ))}

      {/* Drop indicator */}
      {dropIndicator && (
        <div
          className={`absolute top-0 bottom-0 transition-all duration-200 ${
            dropIndicator.valid ? 'bg-green-100' : 'bg-red-100'
          }`}
          style={{
            left: `${RAIL_WIDTH + (dropIndicator.x - 1) * GRID_SIZE}px`,
            width: `${GRID_SIZE}px`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Component positions */}
      {grid.positions.map((pos) => (
        pos.component && (
          <div
            key={pos.x}
            className="absolute top-1/2 -translate-y-1/2 w-10 h-10 border-2 border-transparent"
            style={{
              left: `${RAIL_WIDTH + (pos.x - 1) * GRID_SIZE}px`,
            }}
          />
        )
      ))}
    </div>
  );
}