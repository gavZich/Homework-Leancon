import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import './CustomTable.css';

export default function CustomTable() {
    const [data, setData] = useState([]);
    const [levels, setLevels] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/elements/');
            const result = await response.json();
            console.log("API result:", result);
            setData(result.summary);

            if (result.summary.length > 0) {
                const allLevels = new Set();
                result.summary.forEach(item => {
                    Object.keys(item).forEach(key => {
                        if (!["type_size", "unit", "total_quantity"].includes(key)) {
                            allLevels.add(key);
                        }
                    });
                });
                setLevels([...allLevels]);
                console.log("Levels detected:", [...allLevels]);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='table-container'>
            <h1 className='table-title'>Element Quantity Table</h1>
            <Table striped bordered hover className='custom-table'>
                <thead>
                    <tr>
                        <th>Element Type</th>
                        <th>Unit</th>
                        <th>Total Quantity</th>
                        {levels.map((level, index) => (
                            <th key={index}>{level}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.type_size}</td>
                            <td>{item.unit}</td>
                            <td>{item.total_quantity}</td>
                            {levels.map((level, i) => (
                                <td key={i}>{item[level] || 0}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}