import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DataType, Variable } from '../types/plc';

interface ComponentVariable {
  address?: string;
  description?: string;
  [key: string]: any;
}

interface Component {
  type: string;
  variables?: ComponentVariable;
}

interface VariableEditorProps {
  component: Component;
  onSave: (changes: { variables: ComponentVariable; label?: string }) => void;
  onClose: () => void;
}

const VariableEditor: React.FC<VariableEditorProps> = ({
  component,
  onSave,
  onClose
}) => {
  const [variables, setVariables] = useState<ComponentVariable>(
    component.variables || {}
  );
  const [label, setLabel] = useState(component.type);
  const [availableVariables, setAvailableVariables] = useState<Variable[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string>(variables.address || '');

  // Fetch available variables (in a real app, this would come from your variable manager)
  useEffect(() => {
    // This is a placeholder - replace with actual variable fetching logic
    setAvailableVariables([
      { name: 'StartButton', type: 'BOOL', address: 'X0', scope: 'global', usage: 'input' },
      { name: 'StopButton', type: 'BOOL', address: 'X1', scope: 'global', usage: 'input' },
      { name: 'MotorRun', type: 'BOOL', address: 'Y0', scope: 'global', usage: 'output' },
    ]);
  }, []);

  const handleVariableSelect = (address: string) => {
    const selected = availableVariables.find(v => v.address === address);
    if (selected) {
      setSelectedVariable(address);
      setVariables(prev => ({
        ...prev,
        address: selected.address,
        name: selected.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      variables,
      label: label || component.type
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Component</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Component Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                placeholder={component.type}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Variable
              </label>
              <select
                value={selectedVariable}
                onChange={(e) => handleVariableSelect(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              >
                <option value="">Select a variable</option>
                {availableVariables.map((variable) => (
                  <option key={variable.address} value={variable.address}>
                    {variable.name} ({variable.address}) - {variable.usage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={variables.description || ''}
                onChange={(e) => setVariables({ ...variables, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows={3}
              />
            </div>

            {/* Component-specific settings */}
            {component.type === 'TIMER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timer Preset (ms)
                </label>
                <input
                  type="number"
                  value={variables.preset || 0}
                  onChange={(e) => setVariables({ ...variables, preset: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>
            )}

            {component.type === 'COUNTER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Counter Preset
                </label>
                <input
                  type="number"
                  value={variables.preset || 0}
                  onChange={(e) => setVariables({ ...variables, preset: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariableEditor;