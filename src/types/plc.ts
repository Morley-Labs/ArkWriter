// Update the LineSegmentType
export type LineSegmentType = 
  | 'horizontal' 
  | 'vertical' 
  | 'L-up'    // Up and either left or right
  | 'L-down'  // Down and either left or right
  | 'T'       // T-shaped connection
  | 'none';

export interface GridSegment {
  id: string;
  type: LineSegmentType;
  position: number;
  row: number;
  mirrored?: boolean;  // For L shapes: true for left connections, false for right connections
  flipped?: boolean;   // For T shapes: true for upward T, false for downward T
}

export interface Rung {
  id: string;
  segments: GridSegment[];
  components: Component[];
}

export interface VerticalLink {
  id: string;
  fromRung: number;
  toRung: number;
  fromPosition: number;
  toPosition: number;
}