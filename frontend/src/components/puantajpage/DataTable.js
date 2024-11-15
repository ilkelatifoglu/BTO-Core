import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import workService from '../../services/CustomerService'; // Import the workService
import LoadingDemo from './SubmitButton';
import BasicDemo from './CheckBox';

function PaginatorTemplateDemo() {
    const [workEntries, setWorkEntries] = useState([]);
    const [approvedStatus, setApprovedStatus] = useState({});

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    // Fetch work entries when the component mounts
    useEffect(() => {
        workService.getAllNonApprovedWorkEntries().then((data) => {
            setWorkEntries(data);
            // Initialize approved status for each work entry
            const initialStatus = {};
            data.forEach((_, index) => {
                initialStatus[index] = false;
            });
            setApprovedStatus(initialStatus);
        });
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB'); // e.g., "dd/mm/yyyy" format
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Custom body for the "Approve" column
    const approveBodyTemplate = (rowData, { rowIndex }) => {
        return (
            <BasicDemo
                checked={approvedStatus[rowIndex] || false}
                onChange={(e) => {
                    const newStatus = { ...approvedStatus, [rowIndex]: e.checked };
                    setApprovedStatus(newStatus);
                }}
            />
        );
    };

    return (
        <div className="card">
            <DataTable value={workEntries} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>

                {/* Custom renderers for Date and Time */}
                <Column field="date" header="Date" body={(rowData) => formatDate(rowData.date)} style={{ width: '16.6%' }} />
                <Column field="day" header="Day" style={{ width: '16.6%' }} />
                <Column field="time" header="Time" body={(rowData) => formatTime(rowData.time)} style={{ width: '16.6%' }} />
                <Column field="guide_name" header="Guide Name" style={{ width: '16.6%' }} />
                <Column field="workload" header="Workload" style={{ width: '16.6%' }} />
                <Column header="Approve" body={approveBodyTemplate} style={{ width: '16.6%' }} />
            </DataTable>
            <LoadingDemo />
        </div>
    );
}

export default PaginatorTemplateDemo;