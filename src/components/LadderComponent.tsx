import React from 'react';
import { useDrag } from 'react-dnd';
import { Edit2, Trash2 } from 'lucide-react';
import { Component } from '../types/plc';
import { GRID_SIZE, RAIL_WIDTH } from '../utils/gridSystem';

interface LadderComponentProps {
  type: string;
  icon: React.ComponentType<any>;
  rungIndex: number;
  componentIndex: number;
  position: number;
  width?: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

const LadderComponent: React.FC<LadderComponentProps> = ({ 
  type, 
  icon: Icon,
  rungIndex,
  componentIndex,
  position,
  width = 1,
  onEdit,
  onDelete,
  onClick
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { 
      type: 'COMPONENT',
      rungIndex,
      componentIndex,
      position,
      width,
      originalPosition: position
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Calculate component position and size
  const style = {
    position: 'absolute' as const,
    left: `${(position - 1) * GRID_SIZE + RAIL_WIDTH}px`,
    width: `${width * GRID_SIZE}px`,
    height: `${GRID_SIZE}px`,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    zIndex: 50
  };

  return (
    <div 
      ref={drag}
      className="group"
      style={style}
      onClick={onClick}
    >
      <div className="ladder-component-inner">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      
      <div className="component-tooltip">
        {type}
      </div>

      {!isDragging && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-white rounded-md shadow-lg border border-gray-200 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 text-red-500 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LadderComponent;