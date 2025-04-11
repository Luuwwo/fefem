
import React, { useState, useEffect } from "react";
import NodeForm from "./NodeForm";
import ElementForm from "./ElementForm";
import ForceForm from "./ForceForm";
import NodeTable from "./NodeTable";
import Visualization from "./Visualization";
import SettingsPanel from "./SettingsPanel";
import logo from "./assets/logo.png";

function App() {
  const [nodes, setNodes] = useState([]);
  const [elements, setElements] = useState([]);
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [fixedX, setFixedX] = useState(false);
  const [fixedY, setFixedY] = useState(false);
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [forceNodeId, setForceNodeId] = useState("");
  const [fx, setFx] = useState("");
  const [fy, setFy] = useState("");
  const [showAnimation, setShowAnimation] = useState(true);
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [showForces, setShowForces] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [displacements, setDisplacements] = useState([]);
  const [animationFactor, setAnimationFactor] = useState(0);

  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setAnimationFactor((prev) => {
        let next = prev + direction * 0.02;
        if (next > 1 || next < 0) {
          direction *= -1;
          next = prev;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const addNode = () => {
    if (x === "" || y === "") return;
    const newNode = {
      id: nodes.length + 1,
      x: parseFloat(x),
      y: parseFloat(y),
      fixedX,
      fixedY,
      fx: 0,
      fy: 0,
    };
    setNodes([...nodes, newNode]);
    setX(""); setY(""); setFixedX(false); setFixedY(false);
  };

  const addElement = () => {
    if (fromNode === "" || toNode === "" || fromNode === toNode) return;
    const newElement = {
      id: elements.length + 1,
      from: parseInt(fromNode),
      to: parseInt(toNode),
    };
    setElements([...elements, newElement]);
    setFromNode(""); setToNode("");
  };

  const applyForce = () => {
    if (forceNodeId === "") return;
    const updatedNodes = nodes.map((node) =>
      node.id === parseInt(forceNodeId)
        ? { ...node, fx: parseFloat(fx) || 0, fy: parseFloat(fy) || 0 }
        : node
    );
    setNodes(updatedNodes);
    setForceNodeId(""); setFx(""); setFy("");
  };

  const gaussSolve = (A, b) => {
    const n = A.length;
    for (let i = 0; i < n; i++) {
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [b[i], b[maxRow]] = [b[maxRow], b[i]];
      for (let k = i + 1; k < n; k++) {
        const c = -A[k][i] / A[i][i];
        for (let j = i; j < n; j++) {
          A[k][j] += c * A[i][j];
        }
        b[k] += c * b[i];
      }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = b[i] / A[i][i];
      for (let k = i - 1; k >= 0; k--) {
        b[k] -= A[k][i] * x[i];
      }
    }
    return x;
  };

  const calculate = () => {
    const E = 1, A = 1, dof = nodes.length * 2;
    let K = Array(dof).fill(0).map(() => Array(dof).fill(0));
    let F = Array(dof).fill(0);

    for (const el of elements) {
      const n1 = nodes.find(n => n.id === el.from);
      const n2 = nodes.find(n => n.id === el.to);
      if (!n1 || !n2) continue;
      const dx = n2.x - n1.x, dy = n2.y - n1.y;
      const L = Math.sqrt(dx * dx + dy * dy), c = dx / L, s = dy / L;
      const k = (E * A) / L;
      const k_local = [
        [ c*c, c*s, -c*c, -c*s ],
        [ c*s, s*s, -c*s, -s*s ],
        [-c*c, -c*s, c*c, c*s ],
        [-c*s, -s*s, c*s, s*s ]
      ].map(row => row.map(val => val * k));
      const indices = [(n1.id-1)*2, (n1.id-1)*2+1, (n2.id-1)*2, (n2.id-1)*2+1];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        K[indices[i]][indices[j]] += k_local[i][j];
      }
    }

    nodes.forEach((node, index) => {
      F[index*2] = node.fx;
      F[index*2+1] = node.fy;
    });

    nodes.forEach((node, index) => {
      if (node.fixedX) {
        const i = index * 2;
        for (let j = 0; j < dof; j++) { K[i][j] = 0; K[j][i] = 0; }
        K[i][i] = 1; F[i] = 0;
      }
      if (node.fixedY) {
        const i = index * 2 + 1;
        for (let j = 0; j < dof; j++) { K[i][j] = 0; K[j][i] = 0; }
        K[i][i] = 1; F[i] = 0;
      }
    });

    const U = gaussSolve(K, F);
    const results = nodes.map((node, index) => ({
      id: node.id,
      Ux: U[index * 2],
      Uy: U[index * 2 + 1]
    }));
    setDisplacements(results);
    alert("Результаты расчёта:\n" + results.map(r => `Узел ${r.id}: Ux = ${r.Ux.toFixed(4)}, Uy = ${r.Uy.toFixed(4)}`).join("\n"));
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: darkTheme ? "#1e1e1e" : "#fff", color: darkTheme ? "#fff" : "#000", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", marginBottom: "2rem" }}>
        <img src={logo} alt="FEM Solver Logo" style={{ height: "80px" }} />
        <div>
          <h1 style={{ margin: 0 }}>FEM Solver</h1>
          <h2 style={{ margin: 0, fontWeight: "normal" }}>Расчёт нагруженных конструкций</h2>
        </div>
      </div>

      <SettingsPanel
        showAnimation={showAnimation}
        setShowAnimation={setShowAnimation}
        showNodeLabels={showNodeLabels}
        setShowNodeLabels={setShowNodeLabels}
        showForces={showForces}
        setShowForces={setShowForces}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
      />

      <NodeForm {...{ x, y, setX, setY, fixedX, fixedY, setFixedX, setFixedY, addNode }} />
      <NodeTable nodes={nodes} />
      <ElementForm {...{ fromNode, toNode, setFromNode, setToNode, addElement, nodes }} />
      <ForceForm {...{ forceNodeId, setForceNodeId, fx, fy, setFx, setFy, applyForce, nodes }} />
      <Visualization {...{ nodes, elements, displacements, showAnimation, showNodeLabels, showForces, animationFactor }} />
      <button onClick={calculate} style={{ marginTop: "1rem" }}>Выполнить расчёт</button>
    </div>
  );
}

export default App;
