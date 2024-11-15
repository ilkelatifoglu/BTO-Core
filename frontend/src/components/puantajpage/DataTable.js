import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { CustomerService } from '../../services/CustomerService';

function PaginatorTemplateDemo() {
    const [customers, setCustomers] = useState([]);
    const [approvedStatus, setApprovedStatus] = useState({});

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => {
            setCustomers(data);
            // Initialize approved status for each customer
            const initialStatus = {};
            data.forEach((customer, index) => {
                initialStatus[index] = false;
            });
            setApprovedStatus(initialStatus);
        });
    }, []);

    // Function to toggle approved status for each row
    const onCheckboxChange = (index) => {
        setApprovedStatus(prevStatus => ({
            ...prevStatus,
            [index]: !prevStatus[index]
        }));
    };

    // Custom body for the Approved column
    const approvedBodyTemplate = (rowData, { rowIndex }) => {
        return (
            <Checkbox
                checked={approvedStatus[rowIndex] || false}
                onChange={() => onCheckboxChange(rowIndex)}
            />
        );
    };

    // Function to handle the "Save" button click
    const handleSave = () => {
        // Filter out rows that are approved
        const unapprovedCustomers = customers.filter((_, index) => !approvedStatus[index]);
        setCustomers(unapprovedCustomers);
    };

    return (
        <div className="card">
            <DataTable value={customers} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                <Column field="date" header="Date" style={{ width: '11.1%' }}></Column>
                <Column field="day" header="Day" style={{ width: '11.1%' }}></Column>
                <Column field="time" header="Time" style={{ width: '11.1%' }}></Column>
                <Column field="schoolName" header="School Name" style={{ width: '11.1%' }}></Column>
                <Column field="city" header="City" style={{ width: '11.1%' }}></Column>
                <Column field="people" header="People" style={{ width: '11.1%' }}></Column>
                <Column field="guideName" header="Guide Name" style={{ width: '11.1%' }}></Column>
                <Column field="workload" header="Workload" style={{ width: '11.1%' }}></Column>
                <Column header="Approved" body={approvedBodyTemplate} style={{ width: '11.1%' }}></Column>
            </DataTable>

            {/* Save Button positioned at the bottom right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button label="Save" icon="pi pi-save" className="p-button-primary" onClick={handleSave} />
            </div>
        </div>
    );
}

export default PaginatorTemplateDemo;
