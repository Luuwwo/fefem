
import React from "react";

const NodeTable = ({ nodes }) => (
  <div>
    <h3>Список узлов:</h3>
    <table border="1" cellPadding="4" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr><th>ID</th><th>X</th><th>Y</th><th>Fx</th><th>Fy</th><th>Закр.X</th><th>Закр.Y</th></tr>
      </thead>
      <tbody>
        {nodes.map((node) => (
          <tr key={node.id}>
            <td>{node.id}</td>
            <td>{node.x}</td>
            <td>{node.y}</td>
            <td>{node.fx}</td>
            <td>{node.fy}</td>
            <td>{node.fixedX ? '✓' : ''}</td>
            <td>{node.fixedY ? '✓' : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default NodeTable;
