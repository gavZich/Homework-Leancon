import React from 'react';
import Structure from '../components/3Dstructure/Structure';
import SimpleIFCViewer from '../components/3Dstructure/SimpleIFCViewer.jsx';
import CustomTable from '../components/Table/CustomTable';
import './MainPage.css';

//<Structure />
export default function MainPage() {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <SimpleIFCViewer />
            <CustomTable />
        </div>
    );
}
