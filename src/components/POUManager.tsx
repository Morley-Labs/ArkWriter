import React, { useState } from 'react';
import { Plus, FolderTree, Code, Box, Settings2, X } from 'lucide-react';
import { POU } from '../types/plc';

interface POUManagerProps {
  pous: POU[];
  onAddPOU: (pou: POU) => void;
  onUpdatePOU: (index: number, pou: POU) => void;
  onDeletePOU: (index: number) => void;
  onSelectPOU: (pou: POU) => void;
  onClose: () => void;
}

const POUManager: React.FC<POUManagerProps> = ({
  pous,
  onAddPOU,
  onUpdatePOU,
  onDeletePOU,
  onSelectPOU,
  onClose
}) => {
  const [isAddingPOU, setIsAddingPOU] = useState(false);
  const [newPOU, setNewPOU] = useState<Partial<POU>>({
    type: 'program',
    variables: { input: [], output: [], local: [] },
    rungs: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPOU.name) return;

    const pou: POU = {
      id: crypto.randomUUID(),
      name: newPOU.name,
      type: newPOU.type || 'program',
      variables: {
        input: [],
        output: [],
        local: []
      },
      rungs: []
    };

    onAddPOU(pou);
    setNewPOU({
      type: 'program',
      variables: { input: [], output: [], local: [] },
      rungs: []
    });
    setIsAddingPOU(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'program':
        return <FolderTree className="w-5 h-5" />;
      case 'function':
        return <Code className="w-5 h-5" />;
      case 'functionBlock':
        return <Box className="w-5 h-5" />;
      default:
        return <Settings2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Program Organization Units</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddingPOU(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add POU
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {pous.map((pou, index) => (
            <div
              key={pou.id}
              className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {getIcon(pou.type)}
                <div>
                  <h3 className="font-medium">{pou.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{pou.type}</p>
                </div>
              </div>
              <button
                onClick={() => onSelectPOU(pou)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {isAddingPOU && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New POU</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newPOU.name || ''}
                    onChange={(e) => setNewPOU({ ...newPOU, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newPOU.type || 'program'}
                    onChange={(e) => setNewPOU({ ...newPOU, type: e.target.value as POU['type'] })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  >
                    <option value="program">Program</option>
                    <option value="function">Function</option>
                    <option value="functionBlock">Function Block</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingPOU(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Create POU
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default POUManager;