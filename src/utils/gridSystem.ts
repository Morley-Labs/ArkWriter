// Core grid constants
export const GRID_SIZE = 40;
export const RAIL_WIDTH = 8; // Changed from 40 to 8
export const POWER_RAIL_WIDTH = 8; // Changed from 40 to 8
export const MIN_COMPONENT_SPACING = 1;
export const COMPONENT_SIZE = 40;
export const COMPONENT_INNER_SIZE = 36;

// Validate component position
export function isValidPosition(
  position: number,
  components: any[],
  excludeId?: string
): boolean {
  // Ensure position is at least 1 unit from left rail
  if (position < 1) return false;

  // Check for collisions with other components
  return !components.some(comp => {
    if (comp.id === excludeId) return false;
    return Math.abs(Math.round(comp.position) - Math.round(position)) < MIN_COMPONENT_SPACING;
  });
}

// Find nearest valid position
export function findNearestValidPosition(
  position: number,
  components: any[],
  excludeId?: string
): number {
  const roundedPosition = Math.round(position);
  
  if (isValidPosition(roundedPosition, components, excludeId)) {
    return roundedPosition;
  }

  let offset = 1;
  const maxOffset = 10;

  while (offset <= maxOffset) {
    if (isValidPosition(roundedPosition + offset, components, excludeId)) {
      return roundedPosition + offset;
    }
    if (isValidPosition(roundedPosition - offset, components, excludeId)) {
      return roundedPosition - offset;
    }
    offset++;
  }

  return roundedPosition;
}

// Convert client coordinates to grid position
export function calculateGridPosition(clientX: number, rungRect: DOMRect): number {
  const rungX = clientX - rungRect.left - POWER_RAIL_WIDTH;
  return Math.max(1, Math.round(rungX / GRID_SIZE));
}

// Get component style
export function getComponentStyle(position: number) {
  return {
    position: 'absolute' as const,
    left: `${(position - 1) * GRID_SIZE + POWER_RAIL_WIDTH}px`,
    top: '50%',
    transform: 'translateY(-50%)',
    width: `${COMPONENT_SIZE}px`,
    height: `${COMPONENT_SIZE}px`,
    padding: '2px',
    zIndex: 10,
  };
}

// Get drop indicator style
export function getDropIndicatorStyle(position: number, isValid: boolean) {
  return {
    position: 'absolute' as const,
    left: `${(position - 1) * GRID_SIZE + POWER_RAIL_WIDTH}px`,
    top: '0',
    bottom: '0',
    width: `${GRID_SIZE}px`,
    backgroundColor: isValid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
    border: `2px dashed ${isValid ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}`,
    borderRadius: '4px',
    opacity: 0.7,
    transition: 'all 0.15s ease-in-out',
    zIndex: 5,
  };
}