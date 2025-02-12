import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { ProjectData } from '../types/project';

interface CrossReferencesProps {
  project: ProjectData;
  onClose: () => void;
}

const CrossReferences: React.FC<CrossReferencesProps> = ({ project, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'contacts' | 'coils' | 'variables'>('all');

  const references = useMemo(() => {
    const refs: Array<{
      type: string;
      name: string;
      locations: Array<{ rung: number; pou: string }>;
    }> = [];

    // Collect references from all POUs and rungs
    project.pous?.forEach(pou => {
      pou.rungs.forEach((rung, rungIndex) => {
        rung.components.forEach(comp => {
          if (comp.variables?.address) {
            const existingRef = refs.find(r => r.name === comp.variables?.address);
            if (existingRef) {
              existingRef.locations.push({ rung: rungIndex, pou: pou.name });
            } else {
              refs.push({
                type: comp.type,
                name: comp.variables.address,
                locations: [{ rung: rungIndex, pou: pou.name }]
              });
            }
          }
        });
      });
    });

    return refs;
  }, [project]);

  const filteredReferences = useMemo(() => {
    return references.filter(ref => {
      const matchesSearch = ref.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      switch (filter) {
        case 'contacts':
          return ref.type.includes('CONTACT');
        case 'coils':
          return ref.type === 'COIL';
        case 'variables':
          return !ref.type.includes('CONTACT') && ref.type !== 'COIL';
        default:
          return true;
      }
    });
  }, [references, searchTerm, filter]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Cross References</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search references..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="contacts">Contacts</option>
              <option value="coils">Coils</option>
              <option value="variables">Variables</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {filteredReferences.map((ref, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{ref.name}</h3>
                    <p className="text-sm text-gray-500">{ref.type}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {ref.locations.length} reference{ref.locations.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {ref.locations.map((loc, locIndex) => (
                    <div
                      key={locIndex}
                      className="flex items-center gap-2 text-sm px-3 py-2 bg-gray-50 rounded"
                    >
                      <span>{loc.pou}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span>Rung {loc.rung + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossReferences