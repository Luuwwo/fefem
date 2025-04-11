
import React, { useEffect } from "react";

const Visualization = ({
  nodes,
  elements,
  displacements,
  showAnimation,
  animationFactor,
  showNodeLabels,
  showForces,
  darkMode
}) => {
  const getAnimatedCoord = (node, disp) => {
    const dx = (showAnimation && disp?.Ux) ? disp.Ux * animationFactor : 0;
    const dy = (showAnimation && disp?.Uy) ? disp.Uy * animationFactor : 0;
    const x = node.x + dx;
    const y = node.y + dy;
    return [x, y];
  };

  const getTransform = () => {
    const positions = nodes.map((node) => {
      const d = displacements.find((dis) => dis.id === node.id);
      const dx = showAnimation && d?.Ux ? d.Ux * animationFactor : 0;
      const dy = showAnimation && d?.Uy ? d.Uy * animationFactor : 0;
      return {
        x: node.x + dx,
        y: node.y + dy,
      };
    });
  
    if (positions.length === 0) return { scale: 1, centerX: 0, centerY: 0 };
  
    const xs = positions.map((p) => p.x);
    const ys = positions.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
  
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const scale = 400 / Math.max(width, height);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
  
    return { scale, centerX, centerY };
  };
  

  const { scale, centerX, centerY } = getTransform();

  const transformCoord = ([x, y]) => {
    return [
      (x - centerX) * scale + 250,
      250 - (y - centerY) * scale,
    ];
  };

  return (
    <svg width="500" height="500" style={{ border: "1px solid #ccc", backgroundColor: darkMode ? '#222' : '#fff' }}>
      {elements.map(el => {
        const n1 = nodes.find(n => n.id === el.from);
        const n2 = nodes.find(n => n.id === el.to);
        const d1 = displacements.find(d => d.id === el.from);
        const d2 = displacements.find(d => d.id === el.to);
        if (!n1 || !n2) return null;
        const [x1, y1] = transformCoord(getAnimatedCoord(n1, d1));
        const [x2, y2] = transformCoord(getAnimatedCoord(n2, d2));
        return <line key={el.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="blue" strokeWidth="2" />;
      })}

      {nodes.map(node => {
        const d = displacements.find(dis => dis.id === node.id);
        const [cx, cy] = transformCoord(getAnimatedCoord(node, d));

        return (
          <g key={node.id}>
            <circle cx={cx} cy={cy} r="5" fill="red" />
            {showNodeLabels && (
              <text x={cx + 6} y={cy - 6} fontSize="10" fill={darkMode ? '#eee' : 'black'}>
                {node.id}
              </text>
            )}
            {showForces && (node.fx !== 0 || node.fy !== 0) && (
              <>
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + node.fx * 0.5}
                  y2={cy - node.fy * 0.5}
                  stroke="green"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={cx + node.fx * 0.5 + 4}
                  y={cy - node.fy * 0.5}
                  fontSize="10"
                  fill="green"
                >
                  ({node.fx}, {node.fy})
                </text>
              </>
            )}
          </g>
        );
      })}

      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="green" />
        </marker>
      </defs>
    </svg>
  );
};

export default Visualization;
