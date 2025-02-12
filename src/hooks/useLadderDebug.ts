import { useState, useCallback } from 'react';

export function useLadderDebug() {
  const [debugInfo, setDebugInfo] = useState({
    dragState: {
      isDragging: false,
      draggedComponent: undefined,
    },
    dropState: {
      isOver: false,
      canDrop: false,
      currentPosition: undefined,
      targetRung: undefined,
    },
    components: [],
    lastAction: undefined,
  });

  const updateDragState = useCallback((state: any) => {
    setDebugInfo(prev => ({
      ...prev,
      dragState: { ...prev.dragState, ...state },
    }));
  }, []);

  const updateDropState = useCallback((state: any) => {
    setDebugInfo(prev => ({
      ...prev,
      dropState: { ...prev.dropState, ...state },
    }));
  }, []);

  const updateComponents = useCallback((components: any[]) => {
    setDebugInfo(prev => ({
      ...prev,
      components,
    }));
  }, []);

  const logAction = useCallback((type: string, payload: any) => {
    setDebugInfo(prev => ({
      ...prev,
      lastAction: {
        type,
        payload,
        timestamp: Date.now(),
      },
    }));
  }, []);

  return {
    debugInfo,
    updateDragState,
    updateDropState,
    updateComponents,
    logAction,
  };
}