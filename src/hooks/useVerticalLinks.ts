import { useState, useCallback } from 'react';
import { VerticalLink } from '../types/plc';

interface VerticalLinkState {
  isCreating: boolean;
  startRung?: number;
  startPosition?: number;
}

export function useVerticalLinks() {
  const [linkState, setLinkState] = useState<VerticalLinkState>({
    isCreating: false
  });

  const startLink = useCallback((rung: number, position: number) => {
    setLinkState({
      isCreating: true,
      startRung: rung,
      startPosition: position
    });
  }, []);

  const completeLink = useCallback((endRung: number, endPosition: number): VerticalLink | null => {
    if (!linkState.isCreating || linkState.startRung === undefined || linkState.startPosition === undefined) {
      return null;
    }

    // Ensure links only go downward
    const [fromRung, toRung] = linkState.startRung < endRung 
      ? [linkState.startRung, endRung]
      : [endRung, linkState.startRung];

    const [fromPosition, toPosition] = linkState.startRung < endRung
      ? [linkState.startPosition, endPosition]
      : [endPosition, linkState.startPosition];

    setLinkState({ isCreating: false });

    return {
      id: crypto.randomUUID(),
      fromRung,
      toRung,
      fromPosition,
      toPosition
    };
  }, [linkState]);

  const cancelLink = useCallback(() => {
    setLinkState({ isCreating: false });
  }, []);

  return {
    linkState,
    startLink,
    completeLink,
    cancelLink
  };
}