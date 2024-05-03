import React from 'react';
import reactCsv from 'react-csv';
import Button from 'react-bootstrap/Button';

export const ExportReactCSV = ({csvData, fileName}) => {
    console.log('csv data', csvData);
    
    return (
     <div>
        <Button variant="warning">
            <reactCsv data={csvData} filename={fileName}>Export1</reactCsv>
        </Button>
        </div>
    )
}