import React from 'react';
import { Box } from 'lucide-react';
import { useDrag } from 'react-dnd';

interface FunctionBlockComponentProps {
  id: string;
  name: string;
  rungIndex: number;
  componentIndex: number;
  position: number;
  height?: number;
  inputs?: Array<{ name: string; type: string; rungOffset: number }>;
  outputs?: Array<{ name: string; type: string; rungOffset: number }>;
  onEdit: () => void;
  onDelete: () => void;
}

const FunctionBlockComponent: React.FC<FunctionBlockComponentProps> = ({
  id,
  name,
  rungIndex,
  componentIndex,
  position,
  height = 1,
  inputs = [],
  outputs = [],
  onEdit,
  onDelete
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FUNCTION_BLOCK',
    item: { 
      type: 'FUNCTION_BLOCK',
      id,
      rungIndex,
      componentIndex,
      position,
      width: 3,
      height
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`function-block relative ${isDragging ? 'opacity-50' : ''}`}
      style={{ 
        width: '120px', 
        height: `${height * 80}px`,
        cursor: 'grab'
      }}
    >
      {/* Main block body */}
      <div className="absolute inset-0 bg-white border-2 border-gray-300 rounded-md p-2">
        <div className="flex items-center justify-between mb-2">
          <Box className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-medium">{name}</span>
        </div>

        {/* Input pins */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-around">
          {inputs.map((input, index) => (
            <div
              key={index}
              className="flex items-center gap-1"
              style={{ transform: 'translateX(-4px)' }}
            >
              <div
                className="w-2 h-2 bg-black"
                title={`${input.name}: ${input.type}`}
              />
              <span className="text-xs text-gray-600">{input.name}</span>
            </div>
          ))}
        </div>

        {/* Output pins */}
        <div className="absolute right-0 inset-y-0 flex flex-col justify-around">
          {outputs.map((output, index) => (
            <div
              key={index}
              className="flex items-center gap-1"
              style={{ transform: 'translateX(4px)' }}
            >
              <span className="text-xs text-gray-600">{output.name}</span>
              <div
                className="w-2 h-2 bg-black"
                title={`${output.name}: ${output.type}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionBlockComponent;