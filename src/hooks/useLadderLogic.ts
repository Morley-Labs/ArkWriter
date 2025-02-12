import { useReducer, useCallback } from 'react';
import { ProjectData, Component } from '../types/project';
import { ladderReducer } from '../reducers/ladderReducer';

export function useLadderLogic(initialState: ProjectData) {
  const [state, dispatch] = useReducer(ladderReducer, initialState);

  const addComponent = useCallback((rungIndex: number, component: Component) => {
    dispatch({ type: 'ADD_COMPONENT', rungIndex, component });
  }, []);

  const moveComponent = useCallback((fromRung: number, toRung: number, fromIndex: number, toPosition: number) => {
    console.log('moveComponent called with:', {
      fromRung,
      toRung,
      fromIndex,
      toPosition,
      currentState: state
    });
    
    dispatch({ 
      type: 'MOVE_COMPONENT', 
      fromRung, 
      toRung, 
      fromIndex, 
      toPosition 
    });
  }, [state]);

  const deleteComponent = useCallback((rungIndex: number, componentIndex: number) => {
    dispatch({ type: 'DELETE_COMPONENT', rungIndex, componentIndex });
  }, []);

  const addRung = useCallback(() => {
    dispatch({ type: 'ADD_RUNG' });
  }, []);

  const deleteRung = useCallback((rungIndex: number) => {
    dispatch({ type: 'DELETE_RUNG', rungIndex });
  }, []);

  return {
    projectData: state,
    addComponent,
    moveComponent,
    deleteComponent,
    addRung,
    deleteRung
  };
}