import { useState, useCallback, useRef } from 'react';
import { ProjectData, Rung } from '../types/project';

const MAX_HISTORY = 50;

interface ProjectState {
  past: ProjectData[];
  present: ProjectData;
  future: ProjectData[];
}

export const useProjectState = (initialState: ProjectData) => {
  const [state, setState] = useState<ProjectState>({
    past: [],
    present: initialState,
    future: [],
  });

  const autoSaveTimeoutRef = useRef<number>();

  const saveToHistory = useCallback((newPresent: ProjectData) => {
    setState((currentState) => ({
      past: [...currentState.past.slice(-MAX_HISTORY), currentState.present],
      present: newPresent,
      future: [],
    }));

    // Handle auto-save
    if (newPresent.settings.autoSave) {
      if (autoSaveTimeoutRef.current) {
        window.clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = window.setTimeout(() => {
        // Implement auto-save logic here
      }, 5000);
    }
  }, []);

  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) return currentState;

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) return currentState;

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const addRung = useCallback(() => {
    const newPresent = {
      ...state.present,
      rungs: [...state.present.rungs, { components: [] }],
    };
    saveToHistory(newPresent);
  }, [state.present, saveToHistory]);

  const updateRung = useCallback((index: number, newRung: Rung) => {
    const newPresent = {
      ...state.present,
      rungs: state.present.rungs.map((r, i) => (i === index ? newRung : r)),
    };
    saveToHistory(newPresent);
  }, [state.present, saveToHistory]);

  const deleteRung = useCallback((index: number) => {
    const newPresent = {
      ...state.present,
      rungs: state.present.rungs.filter((_, i) => i !== index),
    };
    saveToHistory(newPresent);
  }, [state.present, saveToHistory]);

  return {
    projectData: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undo,
    redo,
    addRung,
    updateRung,
    deleteRung,
    setProjectData: saveToHistory,
  };
};