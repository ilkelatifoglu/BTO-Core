import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import workService from '../../services/CustomerService'; // Import the workService

export default function CheckboxRowSelectionDemo() {
    const [workEntries, setWorkEntries] = useState([]);
    const [rowClick, setRowClick] = useState(true); // Toggle row click functionality (on: all entries, off: only non-approved)

    const fetchAndSortEntries = useCallback(async () => {
        let data;
        if (rowClick) {
            data = await workService.getAllWorkEntries();
        } else {
            data = await workService.getAllNonApprovedWorkEntries();
        }

        const sortedEntries = data.sort((a, b) => {
            if (a.is_approved === b.is_approved) {
                return new Date(a.date) - new Date(b.date);
            }
            return a.is_approved - b.is_approved;
        });

        setWorkEntries(sortedEntries);
    }, [rowClick]);

    useEffect(() => {
        fetchAndSortEntries();
    }, [fetchAndSortEntries]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB'); // e.g., "dd/mm/yyyy" format
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleApproval = (rowData) => {
        const updatedEntries = workEntries.map((entry) =>
            entry.id === rowData.id
                ? { ...entry, is_approved: !entry.is_approved }
                : entry
        );

        const sortedEntries = updatedEntries.sort((a, b) => {
            if (a.is_approved === b.is_approved) {
                return new Date(a.date) - new Date(b.date);
            }
            return a.is_approved - b.is_approved;
        });

        setWorkEntries(sortedEntries);
    };

    const handleSubmit = async () => {
        try {
            const updatePromises = workEntries.map((entry) =>
                workService.updateWorkEntry(entry.id, { is_approved: entry.is_approved })
            );

            await Promise.all(updatePromises);

            alert('Entries updated successfully!');

            fetchAndSortEntries();
        } catch (error) {
            console.error('Error updating entries:', error);
            alert('An error occurred while updating entries.');
        }
    };

    return (
        <div className="card">
            <div className="flex justify-content-center align-items-center mb-4 gap-2">
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
                <Column field="date" header="Date" body={(rowData) => formatDate(rowData.date)}></Column>
                <Column field="day" header="Day"></Column>
                <Column field="time" header="Time" body={(rowData) => formatTime(rowData.time)}></Column>
                <Column field="guide_name" header="Guide Name"></Column>
                <Column field="workload" header="Workload"></Column>
            </DataTable>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button label="Submit" icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} />
            </div>
        </div>
    );
}
