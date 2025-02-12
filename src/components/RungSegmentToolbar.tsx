import React from 'react';
import { FlipHorizontal as MinusHorizontal, FlipVertical as MinusVertical, CornerRightUp, MousePointer, Eraser } from 'lucide-react';

export type SegmentTool = 'select' | 'horizontal' | 'vertical' | 'connection' | 'erase';

interface RungSegmentToolbarProps {
  selectedTool: SegmentTool;
  onToolSelect: (tool: SegmentTool) => void;
}

const tools = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'horizontal', icon: MinusVertical, label: 'Horizontal Line' },
  { id: 'vertical', icon: MinusHorizontal, label: 'Vertical Line' },
  { id: 'connection', icon: CornerRightUp, label: 'Connection (Left/Right-click to cycle: L → T)' },
  { id: 'erase', icon: Eraser, label: 'Erase' }
] as const;

const RungSegmentToolbar: React.FC<RungSegmentToolbarProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id as SegmentTool)}
          className={`p-2 rounded transition-colors ${
            selectedTool === tool.id
              ? 'bg-[#FF7F11] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default RungSegmentToolbar;