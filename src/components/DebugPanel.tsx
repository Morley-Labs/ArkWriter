import React, { useState, useEffect } from 'react';
import { Play, Pause, StepForward, Eye, XCircle } from 'lucide-react';
import { DebugState, Variable } from '../types/plc';

interface DebugPanelProps {
  debugState: DebugState;
  onToggleDebug: () => void;
  onStep: () => void;
  onToggleBreakpoint: (rung: number) => void;
  onForceVariable: (variable: string, value: any) => void;
  watchList: Variable[];
  onRemoveWatch: (variable: string) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  debugState,
  onToggleDebug,
  onStep,
  onToggleBreakpoint,
  onForceVariable,
  watchList,
  onRemoveWatch,
}) => {
  const [selectedRung, setSelectedRung] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update scan time display
    }, 1000);

    return () => clearInterval(interval);
  }, [debugState.running]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Debug Panel</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDebug}
            className={`p-2 rounded ${
              debugState.running
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {debugState.running ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onStep}
            disabled={!debugState.paused}
            className={`p-2 rounded ${
              debugState.paused
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300'
            } text-white`}
          >
            <StepForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Status Information */}
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Scan Time:</span>
              <span>{debugState.scanTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span>State:</span>
              <span>
                {debugState.running
                  ? debugState.paused
                    ? 'Paused'
                    : 'Running'
                  : 'Stopped'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current Rung:</span>
              <span>{debugState.currentRung || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Watch List */}
        <div className="border rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Watch List</h3>
            <Eye className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-2">
            {watchList.map((variable, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{variable.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={debugState.forcedVariables.get(variable.name) ?? ''}
                    onChange={(e) => onForceVariable(variable.name, e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => onRemoveWatch(variable.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakpoints */}
      <div className="mt-4 border rounded p-3">
        <h3 className="font-medium mb-2">Breakpoints</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(debugState.breakpoints).map((rung) => (
            <div
              key={rung}
              className="flex items-center gap-2 bg-red-100 text-red-700 px-2 py-1 rounded"
            >
              <span>Rung {rung}</span>
              <button
                onClick={() => onToggleBreakpoint(parseInt(rung))}
                className="hover:text-red-900"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;