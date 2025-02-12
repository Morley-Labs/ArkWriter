import { useCallback, useReducer } from 'react';
import { ProjectData } from '../types/project';

interface HistoryState {
  past: ProjectData[];
  present: ProjectData;
  future: ProjectData[];
}

type HistoryAction = 
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'UPDATE'; newState: ProjectData };

const MAX_HISTORY = 50;

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future]
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture
      };
    }
    case 'UPDATE': {
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: action.newState,
        future: []
      };
    }
    default:
      return state;
  }
}

export function useEditHistory(initialState: ProjectData) {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const update = useCallback((newState: ProjectData) => {
    dispatch({ type: 'UPDATE', newState });
  }, []);

  return {
    state: state.present,
    canUndo,
    canRedo,
    undo,
    redo,
    update
  };
}