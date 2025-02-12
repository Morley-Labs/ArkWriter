import React, { useState } from 'react';
import { ToolSelector, ToolContext } from './ToolSelector';
import { Rung } from './Rung';
import { Component } from '../types/project';

export const TestLadder: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [rungs, setRungs] = useState([{ components: [] }]);

  const handleAddComponent = (rungIndex: number, component: Component) => {
    if (!selectedTool) return;
    
    setRungs(prev => prev.map((rung, idx) => 
      idx === rungIndex
        ? {
            ...rung,
            components: [
              ...rung.components,
              { ...component, type: selectedTool.type, icon: selectedTool.icon }
            ].sort((a, b) => a.position - b.position)
          }
        : rung
    ));
  };

  const handleMoveComponent = (fromRung: number, toRung: number, fromIndex: number, toPosition: number) => {
    setRungs(prev => {
      const newRungs = [...prev];
      const component = newRungs[fromRung].components[fromIndex];
      
      // Remove from source rung
      newRungs[fromRung] = {
        ...newRungs[fromRung],
        components: newRungs[fromRung].components.filter((_, i) => i !== fromIndex)
      };

      // Add to target rung
      newRungs[toRung] = {
        ...newRungs[toRung],
        components: [
          ...newRungs[toRung].components,
          { ...component, position: toPosition }
        ].sort((a, b) => a.position - b.position)
      };

      return newRungs;
    });
  };

  const handleDeleteComponent = (rungIndex: number, componentIndex: number) => {
    setRungs(prev => prev.map((rung, idx) => 
      idx === rungIndex
        ? { ...rung, components: rung.components.filter((_, i) => i !== componentIndex) }
        : rung
    ));
  };

  const handleAddRung = () => {
    setRungs(prev => [...prev, { components: [] }]);
  };

  const handleDeleteRung = (index: number) => {
    if (rungs.length > 1) {
      setRungs(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <ToolContext.Provider value={{ selectedTool, setSelectedTool }}>
      <div className="flex flex-col h-screen bg-gray-50">
        <ToolSelector />
        
        <div className="flex-1 p-4">
          <button
            onClick={handleAddRung}
            className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Add Rung
          </button>

          <div className="border border-gray-300 rounded bg-white">
            {rungs.map((rung, index) => (
              <Rung
                key={index}
                index={index}
                components={rung.components}
                onAddComponent={handleAddComponent}
                onEditComponent={() => {}}
                onDeleteComponent={handleDeleteComponent}
                onMoveComponent={handleMoveComponent}
                onDeleteRung={handleDeleteRung}
                isLastRung={index === rungs.length - 1}
                showGrid={true}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolContext.Provider>
  );
};