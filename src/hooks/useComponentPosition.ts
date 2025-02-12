import { useState, useCallback, useEffect } from 'react';
import { validatePosition, snapToGrid } from '../utils/ladderValidation';

interface UseComponentPositionProps {
  gridSize: number;
  railWidth: number;
  components: any[];
  position: number;
  onMove: (newPosition: number) => void;
}

export function useComponentPosition({
  gridSize,
  railWidth,
  components,
  position,
  onMove
}: UseComponentPositionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startPosition, setStartPosition] = useState(position);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    setStartX(e.clientX);
    setStartPosition(position);
    
    // Set cursor style
    document.body.style.cursor = 'grabbing';
  }, [position]);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaGridUnits = Math.round(deltaX / gridSize);
    const newPosition = startPosition + deltaGridUnits;

    // Only update if the new position is valid
    if (validatePosition(newPosition, components, position)) {
      onMove(newPosition);
    }
  }, [isDragging, startX, startPosition, gridSize, components, position, onMove]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
  }, []);

  const handleKeyMove = useCallback((e: React.KeyboardEvent) => {
    let newPosition = position;

    switch (e.key) {
      case 'ArrowLeft':
        newPosition = Math.max(1, position - 1);
        break;
      case 'ArrowRight':
        newPosition = position + 1;
        break;
      default:
        return;
    }

    if (validatePosition(newPosition, components, position)) {
      onMove(newPosition);
    }
  }, [position, components, onMove]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  return {
    isDragging,
    handleDragStart,
    handleKeyMove
  };
}