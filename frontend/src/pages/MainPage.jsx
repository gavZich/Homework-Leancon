// src/pages/MainPage.jsx
import React, { useState } from 'react';
import Structure from '../components/3Dstructure/Structure';
import CustomTable from '../components/Table/CustomTable';
import './MainPage.css';

export default function MainPage() {
  // Lift highlight state here
  const [highlight, setHighlight] = useState({
    type:  null,  // "level" / "element"
    value: null,  // "Level 1" / "IfcColumn 450 x 600mm"
  });

  return (
    <div className="main-page">
      {/* Page title */}
      <h1 className="app-title">Smart BIM Dashboard</h1>

        {/* 3D Viewer */}
      <Structure highlight={highlight} />

       {/* Quantities table */}
      <CustomTable onHighlight={setHighlight} />
    </div>
  );
}
