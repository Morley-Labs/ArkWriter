import React from 'react';
import { Bug, X } from 'lucide-react';

interface DebugInfo {
  dragState: {
    isDragging: boolean;
    draggedComponent?: {
      type: string;
      position: number;
      rungIndex: number;
    };
  };
  dropState: {
    isOver: boolean;
    canDrop: boolean;
    currentPosition?: number;
    targetRung?: number;
  };
  components: {
    rungIndex: number;
    position: number;
    type: string;
  }[];
  lastAction?: {
    type: string;
    payload: any;
    timestamp: number;
  };
}

interface LadderDebugPanelProps {
  debugInfo: DebugInfo;
  onClose: () => void;
}

const LadderDebugPanel: React.FC<LadderDebugPanelProps> = ({ debugInfo, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          <h3 className="font-semibold">Ladder Logic Debug</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Drag State */}
        <div>
          <h4 className="font-medium mb-2">Drag State</h4>
          <div className="bg-gray-50 p-2 rounded text-sm">
            <p>Is Dragging: {debugInfo.dragState.isDragging ? 'Yes' : 'No'}</p>
            {debugInfo.dragState.draggedComponent && (
              <>
                <p>Type: {debugInfo.dragState.draggedComponent.type}</p>
                <p>Position: {debugInfo.dragState.draggedComponent.position}</p>
                <p>Rung: {debugInfo.dragState.draggedComponent.rungIndex}</p>
              </>
            )}
          </div>
        </div>

        {/* Drop State */}
        <div>
          <h4 className="font-medium mb-2">Drop State</h4>
          <div className="bg-gray-50 p-2 rounded text-sm">
            <p>Is Over: {debugInfo.dropState.isOver ? 'Yes' : 'No'}</p>
            <p>Can Drop: {debugInfo.dropState.canDrop ? 'Yes' : 'No'}</p>
            {debugInfo.dropState.currentPosition !== undefined && (
              <p>Current Position: {debugInfo.dropState.currentPosition}</p>
            )}
            {debugInfo.dropState.targetRung !== undefined && (
              <p>Target Rung: {debugInfo.dropState.targetRung}</p>
            )}
          </div>
        </div>

        {/* Component Positions */}
        <div>
          <h4 className="font-medium mb-2">Component Positions</h4>
          <div className="bg-gray-50 p-2 rounded text-sm">
            {debugInfo.components.map((comp, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span>Rung {comp.rungIndex}</span>
                <span>Pos {comp.position}</span>
                <span>{comp.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Action */}
        {debugInfo.lastAction && (
          <div>
            <h4 className="font-medium mb-2">Last Action</h4>
            <div className="bg-gray-50 p-2 rounded text-sm">
              <p>Type: {debugInfo.lastAction.type}</p>
              <p>Time: {new Date(debugInfo.lastAction.timestamp).toLocaleTimeString()}</p>
              <pre className="text-xs mt-1 overflow-x-auto">
                {JSON.stringify(debugInfo.lastAction.payload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LadderDebugPanel;