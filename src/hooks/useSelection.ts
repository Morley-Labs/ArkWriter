import { useState, useCallback } from 'react';
import { Component } from '../types/project';

interface Selection {
  rungIndex: number;
  componentIndices: number[];
}

export function useSelection() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [clipboard, setClipboard] = useState<Component[]>([]);

  const selectComponents = useCallback((rungIndex: number, componentIndices: number[]) => {
    setSelection({ rungIndex, componentIndices });
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  const copySelection = useCallback((components: Component[]) => {
    setClipboard([...components]);
  }, []);

  const getCopiedComponents = useCallback(() => {
    return [...clipboard];
  }, [clipboard]);

  return {
    selection,
    selectComponents,
    clearSelection,
    copySelection,
    getCopiedComponents,
    hasClipboard: clipboard.length > 0
  };
}