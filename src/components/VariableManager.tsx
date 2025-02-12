import React, { useState } from 'react';
import { Plus, Trash2, Edit, Eye, X } from 'lucide-react';
import { Variable, DataType } from '../types/plc';

interface VariableManagerProps {
  variables: Variable[];
  onAddVariable: (variable: Variable) => void;
  onUpdateVariable: (index: number, variable: Variable) => void;
  onDeleteVariable: (index: number) => void;
  onAddToWatch: (variable: Variable) => void;
  onClose: () => void;
}

const VariableManager: React.FC<VariableManagerProps> = ({
  variables,
  onAddVariable,
  onUpdateVariable,
  onDeleteVariable,
  onAddToWatch,
  onClose
}) => {
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newVariable, setNewVariable] = useState<Partial<Variable>>({});

  const dataTypes: DataType[] = [
    'BOOL', 'INT', 'DINT', 'REAL', 'TIME', 'STRING', 'WORD', 'BYTE'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      onUpdateVariable(editingIndex, newVariable as Variable);
      setEditingIndex(null);
    } else {
      onAddVariable(newVariable as Variable);
    }
    setNewVariable({});
    setIsAddingVariable(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Variables</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddingVariable(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add Variable
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Variable List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Scope</th>
                <th className="px-4 py-2 text-left">Usage</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((variable, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{variable.name}</td>
                  <td className="px-4 py-2">{variable.type}</td>
                  <td className="px-4 py-2">{variable.address}</td>
                  <td className="px-4 py-2">{variable.scope}</td>
                  <td className="px-4 py-2">{variable.usage}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setNewVariable(variable);
                          setIsAddingVariable(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onAddToWatch(variable)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteVariable(index)}
                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Variable Form */}
        {isAddingVariable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {editingIndex !== null ? 'Edit Variable' : 'Add Variable'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newVariable.name || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newVariable.type || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as DataType })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  >
                    <option value="">Select Type</option>
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={newVariable.address || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Scope</label>
                  <select
                    value={newVariable.scope || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, scope: e.target.value as 'local' | 'global' })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  >
                    <option value="">Select Scope</option>
                    <option value="local">Local</option>
                    <option value="global">Global</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Usage</label>
                  <select
                    value={newVariable.usage || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, usage: e.target.value as 'input' | 'output' | 'memory' })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  >
                    <option value="">Select Usage</option>
                    <option value="input">Input</option>
                    <option value="output">Output</option>
                    <option value="memory">Memory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newVariable.description || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingVariable(false);
                    setEditingIndex(null);
                    setNewVariable({});
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  {editingIndex !== null ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariableManager;