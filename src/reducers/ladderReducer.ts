import { ProjectData, Component } from '../types/plc';

export type LadderAction = 
  | { type: 'ADD_COMPONENT'; rungIndex: number; component: Component }
  | { type: 'MOVE_COMPONENT'; fromRung: number; toRung: number; fromIndex: number; toPosition: number }
  | { type: 'DELETE_COMPONENT'; rungIndex: number; componentIndex: number }
  | { type: 'ADD_RUNG'; rung: { id: string; components: Component[] } }
  | { type: 'DELETE_RUNG'; rungIndex: number }
  | { type: 'UPDATE_SETTINGS'; settings: any }
  | { type: 'LOAD_PROJECT'; project: ProjectData };

function isPositionValid(position: number, components: Component[]): boolean {
  return !components.some(comp => Math.abs(Math.round(comp.position) - Math.round(position)) < 1);
}


// â FIX: Add initialState to prevent undefined errors
const initialState: ProjectData = {
  name: "Untitled Project",
  rungs: [],
  settings: {
    showGrid: true,
    showAddresses: true,
    showCrossReferences: false
  }
};
export function ladderReducer(state: ProjectData = initialState, action: LadderAction): ProjectData {
  console.log('Reducer action:', action.type, action);
  
  switch (action.type) {
    case 'ADD_COMPONENT': {
      console.log('ADD_COMPONENT action:', action);
      
      const newRungs = [...state.rungs];
      const targetRung = { ...newRungs[action.rungIndex] };
      
      // Ensure integer position
      const position = Math.round(action.component.position);
      
      // Validate position
      if (!isPositionValid(position, targetRung.components)) {
        console.log('Invalid position:', position);
        return state;
      }

      // Create new component with integer position
      const newComponent: Component = {
        ...action.component,
        id: action.component.id || crypto.randomUUID(),
        position
      };

      console.log('Creating new component:', newComponent);

      // Add component and sort by position
      targetRung.components = [
        ...targetRung.components,
        newComponent
      ].sort((a, b) => Math.round(a.position) - Math.round(b.position));

      console.log('Updated rung components:', targetRung.components);

      newRungs[action.rungIndex] = targetRung;
      return { ...state, rungs: newRungs };
    }

    case 'MOVE_COMPONENT': {
      const newRungs = [...state.rungs];
      const sourceRung = { ...newRungs[action.fromRung] };
      
      // Get the component to move
      const movedComponent = sourceRung.components[action.fromIndex];
      if (!movedComponent) return state;

      // Remove component from source rung
      sourceRung.components = sourceRung.components.filter((_, index) => index !== action.fromIndex);
      
      // Ensure integer position
      const targetPosition = Math.round(action.toPosition);
      
      // Get or create target rung
      const targetRung = action.fromRung === action.toRung 
        ? sourceRung 
        : { ...newRungs[action.toRung] };

      // Validate position in target rung
      if (!isPositionValid(targetPosition, targetRung.components)) {
        return state;
      }

      // Create updated component with new position
      const updatedComponent: Component = {
        ...movedComponent,
        position: targetPosition
      };

      // Add component to target rung and sort
      targetRung.components = [
        ...targetRung.components,
        updatedComponent
      ].sort((a, b) => Math.round(a.position) - Math.round(b.position));

      // Update rungs array
      newRungs[action.fromRung] = sourceRung;
      if (action.fromRung !== action.toRung) {
        newRungs[action.toRung] = targetRung;
      const updatedRungs = state.rungs.filter((_, i) => i !== action.rungIndex);

        rungs: updatedRungs
      return { ...state, rungs: newRungs };
    }

    case 'DELETE_COMPONENT': {
      const newRungs = [...state.rungs];
      const targetRung = { ...newRungs[action.rungIndex] };
      
      targetRung.components = targetRung.components.filter(
        (_, index) => index !== action.componentIndex
      );

      newRungs[action.rungIndex] = targetRung;
      return { ...state, rungs: newRungs };
    }

    case 'ADD_RUNG': {
      return {
        ...state,
        rungs: [...state.rungs, action.rung]
      };
    }

    case 'DELETE_RUNG': {
      if (state.rungs.length <= 1) return state;
      
      return {
        ...state,
}
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: action.settings,
        name: action.settings.name
      };
    }

    case 'LOAD_PROJECT': {
      return {
        ...action.project,
        settings: {
          ...state.settings,
          ...action.project.settings
        }
      };
    }

    default:
      return state;
  }
}