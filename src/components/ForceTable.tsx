import React, { useState } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { Variable } from '../types/plc';

interface ForceTableProps {
  variables: Variable[];
  onClose: () => void;
}

const ForceTable: React.FC<ForceTableProps> = ({ variables, onClose }) => {
  const [forcedValues, setForcedValues] = useState<Record<string, any>>({});
  const [isForcing, setIsForcing] = useState(false);

  const handleForceValue = (variable: Variable, value: any) => {
    setForcedValues(prev => ({
      ...prev,
      [variable.address]: value
    }));
  };

  const handleClearForce = (variable: Variable) => {
    setForcedValues(prev => {
      const newValues = { ...prev };
      delete newValues[variable.address];
      return newValues;
    });
  };

  const toggleForcing = () => {
    setIsForcing(!isForcing);
  };

  const clearAllForces = () => {
    setForcedValues({});
    setIsForcing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Force Table</h2>
            <button
              onClick={toggleForcing}
              className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${
                isForcing ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isForcing ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Forcing
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Forcing
                </>
              )}
            </button>
            <button
              onClick={clearAllForces}
              className="px-3 py-1 bg-gray-100 rounded text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All Forces
            </button>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Current Value</th>
                <th className="px-4 py-2 text-left">Force Value</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((variable, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{variable.name}</td>
                  <td className="px-4 py-2">{variable.address}</td>
                  <td className="px-4 py-2">{variable.type}</td>
                  <td className="px-4 py-2">{variable.value?.toString() || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <input
                      type={variable.type === 'BOOL' ? 'checkbox' : 'text'}
                      value={forcedValues[variable.address] || ''}
                      checked={variable.type === 'BOOL' && forcedValues[variable.address]}
                      onChange={(e) => handleForceValue(
                        variable,
                        variable.type === 'BOOL' ? e.target.checked : e.target.value
                      )}
                      className={
                        variable.type === 'BOOL'
                          ? 'form-checkbox h-4 w-4 text-[#FF7F11] rounded'
                          : 'w-full px-2 py-1 border rounded'
                      }
                      disabled={!isForcing}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleClearForce(variable)}
                      className="text-red-500 hover:text-red-700"
                      disabled={!forcedValues[variable.address]}
                    >
                      Clear Force
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ForceTable