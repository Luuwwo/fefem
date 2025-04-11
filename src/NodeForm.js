
import React from "react";

const NodeForm = ({ x, y, setX, setY, fixedX, fixedY, setFixedX, setFixedY, addNode }) => (
  <div>
    <h2>Добавление узлов</h2>
    <input type="number" placeholder="X" value={x} onChange={(e) => setX(e.target.value)} />
    <input type="number" placeholder="Y" value={y} onChange={(e) => setY(e.target.value)} />
    <label><input type="checkbox" checked={fixedX} onChange={(e) => setFixedX(e.target.checked)} /> Зафиксировать X</label>
    <label><input type="checkbox" checked={fixedY} onChange={(e) => setFixedY(e.target.checked)} /> Зафиксировать Y</label>
    <button onClick={addNode}>Добавить узел</button>
  </div>
);
export default NodeForm;
