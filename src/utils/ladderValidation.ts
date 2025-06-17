export function validateSegmentPlacement(
  position: number,
  row: number,
  type: string,
  segments: GridSegment[],
  components: Component[]
): boolean {
  // Check for component overlap
  const hasComponentOverlap = components.some(comp => {
    const compWidth = comp.width || 1;
    return position >= comp.position && position < comp.position + compWidth;
  });

  if (hasComponentOverlap) return false;

  // Get existing segment at this position
  const existingSegment = segments.find(seg => 
    seg.position === position && seg.row === row
  );

  // If there's an existing segment, allow modification
  if (existingSegment) {
    return true;
  }

  // Check for segment conflicts
  const adjacentSegments = segments.filter(seg => 
    Math.abs(seg.position - position) <= 1 && Math.abs(seg.row - row) <= 1
  );

  for (const adj of adjacentSegments) {
    // Validate based on segment type combinations
    if (!areSegmentTypesCompatible(type, adj.type, {
      positionDiff: adj.position - position,
      rowDiff: adj.row - row
    })) {
      return false;
    }
  }

  return true;
}

function areSegmentTypesCompatible(
  type1: string,
  type2: string,
  { positionDiff, rowDiff }: { positionDiff: number; rowDiff: number }
): boolean {
  // Allow vertical connections to any segment type
  if (type1 === 'vertical' || type2 === 'vertical') {
    return true;
  }

  // Allow all connections to horizontal lines
  if (type2 === 'horizontal') {
    return rowDiff === 0;
  }

  // L-shape connections
  if (type2.startsWith('L-')) {
    // Allow horizontal connections
    if (rowDiff === 0 && Math.abs(positionDiff) === 1) {
      return true;
    }
    // Allow vertical connections
    if (positionDiff === 0 && Math.abs(rowDiff) === 1) {
      const isUpConnection = type2 === 'L-up';
      const isDownConnection = type2 === 'L-down';
      return (isUpConnection && rowDiff === -1) || (isDownConnection && rowDiff === 1);
    }
  }

  // T-shape connections
  if (type2 === 'T') {
    // Allow horizontal connections
    if (rowDiff === 0 && Math.abs(positionDiff) === 1) {
      return true;
    }
    // Allow vertical connections
    if (positionDiff === 0 && Math.abs(rowDiff) === 1) {
      return true;
    }
  }

  return true;
}

// Validate a component position on a rung. The optional excludePosition allows
// ignoring a component already located at that grid index when performing the
// overlap check.
export function validatePosition(
  position: number,
  components: Component[],
  excludePosition?: number
): boolean {
  const gridPos = Math.round(position);
  if (gridPos < 1) return false;

  return !components.some(comp => {
    if (excludePosition !== undefined && Math.round(comp.position) === Math.round(excludePosition)) {
      return false;
    }

    const start = Math.round(comp.position);
    const end = start + (comp.width || 1) - 1;
    return gridPos >= start && gridPos <= end;
  });
}

// Snap a pixel based coordinate to the nearest grid multiple.
export function snapToGrid(x: number, gridSize: number): number {
  return Math.round(x / gridSize) * gridSize;
}