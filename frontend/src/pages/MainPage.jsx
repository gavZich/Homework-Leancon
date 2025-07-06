import React from 'react';
import Structure from '../components/3Dstructure/Structure';
// debugg
// import SimpleIFCViewer from '../components/3Dstructure/IFCViewer.jsx';
import CustomTable from '../components/Table/CustomTable';
import './MainPage.css';

export default function MainPage() {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <Structure />
            <CustomTable />
        </div>
    );
}
