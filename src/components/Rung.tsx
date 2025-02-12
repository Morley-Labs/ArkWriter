import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import LadderComponent from './LadderComponent';
import RungGrid from './RungGrid';
import { GRID_SIZE, POWER_RAIL_WIDTH } from '../utils/gridSystem';
import { SegmentTool } from './RungSegmentToolbar';

interface RungProps {
  index: number;
  components: any[];
  onAddComponent: (index: number, position: number, tool: any) => void;
  onEditComponent: (index: number, componentIndex: number) => void;
  onDeleteComponent: (index: number, componentIndex: number) => void;
  onMoveComponent: (fromRung: number, toRung: number, fromIndex: number, toPosition: number) => void;
  onDeleteRung: (index: number) => void;
  isLastRung: boolean;
  showGrid: boolean;
  selectedTool?: SegmentTool;
}

const Rung: React.FC<RungProps> = ({
  index,
  components,
  onAddComponent,
  onEditComponent,
  onDeleteComponent,
  onMoveComponent,
  onDeleteRung,
  isLastRung,
  showGrid,
  selectedTool = 'select'
}) => {
  const rungRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['TOOL', 'COMPONENT'],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !rungRef.current) return;

      const rungRect = rungRef.current.getBoundingClientRect();
      const x = clientOffset.x - rungRect.left - POWER_RAIL_WIDTH;
      const position = Math.max(1, Math.round(x / GRID_SIZE));

      if (item.tool) {
        onAddComponent(index, position, item.tool);
      } else if (item.type === 'COMPONENT') {
        onMoveComponent(
          item.rungIndex,
          index,
          item.componentIndex,
          position
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [index, onAddComponent, onMoveComponent]);

  const handleSegmentsChange = (segments: any[]) => {
    // Handle segment changes
    console.log('Segments changed:', segments);
  };

  return (
    <div className="relative border-b border-gray-200">
      <div 
        ref={(node) => {
          drop(node);
          if (node) rungRef.current = node;
        }}
        className="flex h-24 relative"
      >
        {/* Left Power Rail */}
        <div className="w-[8px] bg-black" />

        {/* Rung Content */}
        <div className="flex-1 relative">
          {/* Grid and Segments */}
          <RungGrid
            rungId={`rung-${index}`}
            width={rungRef.current?.clientWidth || 0}
            height={96}
            showGrid={showGrid}
            selectedTool={selectedTool}
            onSegmentsChange={handleSegmentsChange}
            components={components}
          />

          {/* Components */}
          {components.map((component, compIndex) => (
            <div
              key={component.id || compIndex}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: `${(component.position - 1) * GRID_SIZE + POWER_RAIL_WIDTH}px`,
                width: `${(component.width || 1) * GRID_SIZE}px`,
                zIndex: 50
              }}
            >
              <LadderComponent
                type={component.type}
                icon={component.icon}
                rungIndex={index}
                componentIndex={compIndex}
                position={component.position}
                onEdit={() => onEditComponent(index, compIndex)}
                onDelete={() => onDeleteComponent(index, compIndex)}
              />
            </div>
          ))}
        </div>

        {/* Right Power Rail */}
        <div className="w-[8px] bg-black" />

        {/* Delete Rung Button */}
        {!isLastRung && (
          <button
            onClick={() => onDeleteRung(index)}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 p-2 text-red-500 hover:text-red-700"
            title="Delete Rung"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Rung;

export { Rung }