import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast"; // (2) Importing Toast
import workService from '../../services/CustomerService'; // Import the workService

export default function SubmitButton({ selectedWorkEntries, refreshTable }) {
    const toast = useRef(null); // (3) Toast ref

    const handleSubmit = () => {
        toast.current.clear(); // (4) Clear before showing a new toast

        if (!selectedWorkEntries || selectedWorkEntries.length === 0) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No rows selected!",
                life: 3000,
            });
            return;
        }

        const updatePromises = selectedWorkEntries.map((row) =>
            workService.updateWorkEntry(row.id, { is_approved: true })
        );

        Promise.all(updatePromises)
            .then(() => {
                toast.current.clear();
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Selected entries approved successfully!",
                    life: 3000,
                });
                refreshTable();
            })
            .catch((error) => {
                console.error('Error updating entries:', error);
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "An error occurred while approving entries.",
                    life: 3000,
                });
            });
    };

    return (
        <>
            <Toast ref={toast} /> {/* (5) Adding the Toast to JSX */}
            <div className="card flex justify-content-center">
                <Button label="Submit" icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} />
            </div>
        </>
    );
}
