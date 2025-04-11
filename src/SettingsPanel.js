
import React from "react";

const SettingsPanel = ({
  showAnimation, setShowAnimation,
  showNodeLabels, setShowNodeLabels,
  showForces, setShowForces,
  darkTheme, setDarkTheme
}) => (
  <div style={{ margin: "1rem 0", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    <label><input type="checkbox" checked={showAnimation} onChange={() => setShowAnimation(!showAnimation)} /> Анимация</label>
    <label><input type="checkbox" checked={showNodeLabels} onChange={() => setShowNodeLabels(!showNodeLabels)} /> Подписи узлов</label>
    <label><input type="checkbox" checked={showForces} onChange={() => setShowForces(!showForces)} /> Силы</label>
    <label><input type="checkbox" checked={darkTheme} onChange={() => setDarkTheme(!darkTheme)} /> Тёмная тема</label>
  </div>
);
export default SettingsPanel;
