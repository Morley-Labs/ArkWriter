import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Circle, 
  ToggleLeft, 
  ToggleRight,
  Clock,
  Hash,
  Plus,
  Minus,
  ArrowRight,
  Equal,
  Calculator,
  Box,
  Timer,
  BarChart,
  Sigma,
  Divide
} from 'lucide-react';
import { POU } from '../types/plc';

const tools = [
  { 
    category: 'Basic',
    items: [
      { type: 'CONTACT_NO', icon: ToggleRight, label: 'NO Contact' },
      { type: 'CONTACT_NC', icon: ToggleLeft, label: 'NC Contact' },
      { type: 'COIL', icon: Circle, label: 'Coil' }
    ]
  },
  {
    category: 'Timers & Counters',
    items: [
      { type: 'TIMER', icon: Clock, label: 'Timer' },
      { type: 'COUNTER_UP', icon: Plus, label: 'Counter Up' },
      { type: 'COUNTER_DOWN', icon: Minus, label: 'Counter Down' }
    ]
  },
  {
    category: 'Math & Logic',
    items: [
      { type: 'COMPARE', icon: Equal, label: 'Compare' },
      { type: 'CALCULATE', icon: Calculator, label: 'Calculate' },
      { type: 'MOVE', icon: ArrowRight, label: 'Move' }
    ]
  },
  {
    category: 'Function Blocks',
    items: [
      { type: 'TON', icon: Timer, label: 'TON Timer', width: 3 },
      { type: 'TOF', icon: Timer, label: 'TOF Timer', width: 3 },
      { type: 'CTU', icon: BarChart, label: 'Count Up', width: 3 },
      { type: 'CTD', icon: BarChart, label: 'Count Down', width: 3 },
      { type: 'CTUD', icon: BarChart, label: 'Count Up/Down', width: 3 },
      { type: 'ADD', icon: Plus, label: 'Add', width: 3 },
      { type: 'SUB', icon: Minus, label: 'Subtract', width: 3 },
      { type: 'MUL', icon: Sigma, label: 'Multiply', width: 3 },
      { type: 'DIV', icon: Divide, label: 'Divide', width: 3 }
    ]
  }
];

interface ToolItemProps {
  tool: {
    type: string;
    icon: React.ComponentType<any>;
    label: string;
    pouId?: string;
    width?: number;
  };
}

const ToolItem: React.FC<ToolItemProps> = ({ tool }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: tool.pouId ? 'FUNCTION_BLOCK' : 'TOOL',
    item: { tool },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const Icon = tool.icon;

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md
        ${isDragging ? 'opacity-50' : 'hover:bg-gray-100'}
        cursor-grab transition-colors
      `}
    >
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-sm">{tool.label}</span>
      {tool.width && (
        <span className="text-xs text-gray-500 ml-auto">{tool.width}x</span>
      )}
    </div>
  );
};

interface ToolSelectorProps {
  pous: POU[];
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({ pous }) => {
  // Convert user-created function blocks to tools
  const userFunctionBlocks = pous
    .filter(pou => pou.type === 'functionBlock')
    .map(pou => ({
      type: 'FUNCTION_BLOCK',
      icon: Box,
      label: pou.name,
      pouId: pou.id,
      width: 3
    }));

  // Add user function blocks to the Function Blocks category if any exist
  const allTools = tools.map(category => {
    if (category.category === 'Function Blocks' && userFunctionBlocks.length > 0) {
      return {
        ...category,
        items: [
          ...category.items,
          { type: 'separator' },
          ...userFunctionBlocks
        ]
      };
    }
    return category;
  });

  return (
    <div className="p-4 space-y-6">
      {allTools.map((category, index) => (
        <div key={index}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            {category.category}
          </h3>
          <div className="space-y-1">
            {category.items.map((item, itemIndex) => 
              item.type === 'separator' ? (
                <hr key={`sep-${itemIndex}`} className="my-2 border-gray-200" />
              ) : (
                <ToolItem key={item.type} tool={item} />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};