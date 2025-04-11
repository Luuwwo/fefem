
import React from "react";

const ForceForm = ({ forceNodeId, setForceNodeId, fx, fy, setFx, setFy, applyForce, nodes }) => (
  <div>
    <h2>Добавление нагрузок</h2>
    <select value={forceNodeId} onChange={(e) => setForceNodeId(e.target.value)}>
      <option value="">Выберите узел</option>
      {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
    </select>
    <input type="number" placeholder="Fx" value={fx} onChange={(e) => setFx(e.target.value)} />
    <input type="number" placeholder="Fy" value={fy} onChange={(e) => setFy(e.target.value)} />
    <button onClick={applyForce}>Применить</button>
  </div>
);
export default ForceForm;
