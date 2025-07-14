// src/components/Table/CustomTable.jsx
import React, { useState, useEffect } from 'react';
import { Table }              from 'react-bootstrap';
import './CustomTable.css';

export default function CustomTable({ onHighlight }) {
  const [data, setData]     = useState([]);
  const [levels, setLevels] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/elements/');
      const result   = await response.json();
      setData(result.summary);
      if (result.summary.length > 0) {
        const allLevels = new Set();
        result.summary.forEach(item =>
          Object.keys(item).forEach(key => {
            if (!['type_size','unit','total_quantity'].includes(key)) {
              allLevels.add(key);
            }
          })
        );
        setLevels([...allLevels]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const safeHighlight = payload => {
    try {
      onHighlight(payload);
    } catch (e) {
      console.warn('Highlight failed:', e);
    }
  };

  return (
    <div className="table-section">
      <h2 className="table-title">Element Quantity Table</h2>
      <Table striped hover className="custom-table">
        <thead>
          <tr>
            <th>Element Type</th>
            <th>Unit</th>
            <th>Total Quantity</th>
            {levels.map((level, i) => (
              <th key={i}>
                <button
                  className="highlight-btn"
                  onClick={() => safeHighlight({ type: 'level', value: level })}
                >
                  {level}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>
                <button
                  className="highlight-btn"
                  onClick={() => safeHighlight({ type: 'element', value: item.type_size })}
                >
                  {item.type_size}
                </button>
              </td>
              <td>{item.unit}</td>
              <td>{item.total_quantity}</td>
              {levels.map((level, j) => (
                <td key={j}>{item[level] || 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
