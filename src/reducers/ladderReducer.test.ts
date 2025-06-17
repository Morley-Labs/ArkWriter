import { describe, it, expect } from 'vitest';
import { ladderReducer } from './ladderReducer';
import type { ProjectData, Component } from '../types/project';

// Simple initial state
const initialState: ProjectData = {
  name: 'Test',
  rungs: [
    { id: 'r1', segments: [], components: [] }
  ],
  settings: {}
};

describe('ladderReducer', () => {
  it('adds a component to a rung', () => {
    const component: Component = { type: 'test', position: 0 };
    const action = {
      type: 'ADD_COMPONENT' as const,
      rungIndex: 0,
      component
    };
    const state = ladderReducer(initialState, action);
    expect(state.rungs[0].components.length).toBe(1);
    expect(state.rungs[0].components[0].type).toBe('test');
  });
});
