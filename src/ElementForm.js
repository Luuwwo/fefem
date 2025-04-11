
import React from "react";

const ElementForm = ({ fromNode, toNode, setFromNode, setToNode, addElement, nodes }) => (
  <div>
    <h2>Добавление элементов</h2>
    <select value={fromNode} onChange={(e) => setFromNode(e.target.value)}>
      <option value="">От узла</option>
      {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
    </select>
    <select value={toNode} onChange={(e) => setToNode(e.target.value)}>
      <option value="">До узла</option>
      {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
    </select>
    <button onClick={addElement}>Добавить элемент</button>
  </div>
);
export default ElementForm;
