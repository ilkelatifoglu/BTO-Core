import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import workService from '../../services/CustomerService'; // Import the workService
import AddWork from './AddWork';
import "./PuantajComponents.css";

export default function CheckboxRowSelectionDemo() {
    const [workEntries, setWorkEntries] = useState([]);
    const [rowClick, setRowClick] = useState(true); // Toggle row click functionality (on: all entries, off: only non-approved)

    // Fetch work entries based on rowClick state
    useEffect(() => {
        if (rowClick) {
            // Fetch all work entries when rowClick is ON
            workService.getAllWorkEntries().then((data) => {
                setWorkEntries(data);
            });
        } else {
            // Fetch only non-approved work entries when rowClick is OFF
            workService.getAllNonApprovedWorkEntries().then((data) => {
                setWorkEntries(data);
            });
        }
    }, [rowClick]); // Re-fetch data whenever rowClick state changes

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB'); // e.g., "dd/mm/yyyy" format
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Toggle the checkbox for each row
    const toggleApproval = (rowData) => {
        const updatedEntries = workEntries.map((entry) =>
            entry.id === rowData.id
                ? { ...entry, is_approved: !entry.is_approved }
                : entry
        );
        setWorkEntries(updatedEntries);
    };

    // Handle the Submit button click
    const handleSubmit = async () => {
        try {
            const updatePromises = workEntries.map((entry) =>
                workService.updateWorkEntry(entry.id, { is_approved: entry.is_approved })
            );

            await Promise.all(updatePromises);

            alert('Entries updated successfully!');

            // Refresh the table after updates
            if (rowClick) {
                workService.getAllWorkEntries().then((data) => setWorkEntries(data));
            } else {
                workService.getAllNonApprovedWorkEntries().then((data) => setWorkEntries(data));
            }
        } catch (error) {
            console.error('Error updating entries:', error);
            alert('An error occurred while updating entries.');
        }
    };

    return (
        <div className="data-table-container">
        <div className="data-table-content">
            <h1>Puantaj Page</h1>
            <div className="toggle-container">
            <InputSwitch
                        inputId="input-rowclick"
                        checked={rowClick}
                        onChange={(e) => setRowClick(e.value)}
                    />
                <label htmlFor="input-rowclick">
                    {rowClick ? 'Show All Entries' : 'Show Non-Approved Only'}
                </label>
            </div>

            <DataTable
                value={workEntries}
                dataKey="id"
                paginator
                rows={5}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
            >
                <Column
                    headerStyle={{ width: '3rem' }}
                    body={(rowData) => (
                        <input
                            type="checkbox"
                            checked={rowData.is_approved}
                            onChange={() => toggleApproval(rowData)}
                        />
                    )}
                ></Column>
                <Column field="type" header="Type"></Column>
                <Column field="date" header="Date" body={(rowData) => formatDate(rowData.date)}></Column>
                <Column field="day" header="Day"></Column>
                <Column field="time" header="Time" body={(rowData) => formatTime(rowData.time)}></Column>
                <Column field="guide_name" header="Guide Name"></Column>
                <Column field="workload" header="Workload"></Column>
            </DataTable>

            <div className="submit-button-container">
                    <Button label="Submit" icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} />
                </div>
                <AddWork />
            </div>
        </div>
    );
}