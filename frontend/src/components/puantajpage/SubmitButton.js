import React from 'react';
import { Button } from 'primereact/button';
import workService from '../../services/CustomerService'; // Import the workService

export default function SubmitButton({ selectedWorkEntries, refreshTable }) {
    const handleSubmit = () => {
        if (!selectedWorkEntries || selectedWorkEntries.length === 0) {
            alert('No rows selected!');
            return;
        }

        // Send update requests for each selected row
        const updatePromises = selectedWorkEntries.map((row) =>
            workService.updateWorkEntry(row.id, { is_approved: true })
        );

        // Execute all updates and refresh the table
        Promise.all(updatePromises)
            .then(() => {
                alert('Selected entries approved successfully!');
                refreshTable(); // Refresh the table data
            })
            .catch((error) => {
                console.error('Error updating entries:', error);
                alert('An error occurred while approving entries.');
            });
    };

    return (
        <div className="card flex justify-content-center">
            <Button label="Submit" icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} />
        </div>
    );
}