import React from 'react';
import { VerticalLink as VerticalLinkType } from '../types/plc';
import { GRID_SIZE, RAIL_WIDTH } from '../utils/gridSystem';

interface VerticalLinkProps {
  link: VerticalLinkType;
  rungHeight: number;
  onDelete: () => void;
}

const VerticalLink: React.FC<VerticalLinkProps> = ({ link, rungHeight, onDelete }) => {
  const startY = (link.fromRung * rungHeight) + (rungHeight / 2);
  const endY = (link.toRung * rungHeight) + (rungHeight / 2);
  const startX = (link.fromPosition - 1) * GRID_SIZE + RAIL_WIDTH;
  const endX = (link.toPosition - 1) * GRID_SIZE + RAIL_WIDTH;

  const path = `
    M ${startX} ${startY}
    L ${startX} ${endY}
    L ${endX} ${endY}
  `;

  return (
    <g className="vertical-link">
      <path
        d={path}
        stroke="black"
        strokeWidth="2"
        fill="none"
        className="vertical-link-path"
      />
      <circle
        cx={startX}
        cy={startY}
        r="3"
        fill="black"
        className="vertical-link-node"
      />
      <circle
        cx={endX}
        cy={endY}
        r="3"
        fill="black"
        className="vertical-link-node"
      />
      <path
        d={path}
        stroke="transparent"
        strokeWidth="10"
        fill="none"
        className="vertical-link-hitbox"
        onClick={onDelete}
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
};

export default VerticalLink;