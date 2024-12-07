import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { fetchFairs, fetchAvailableGuides, assignGuide, approveFair, cancelFair } from "../services/fairService";
import Sidebar from '../components/common/Sidebar';
import "./FairApproval.css";

export default function FairApprovalPage() {
    const [fairs, setFairs] = useState([]);
    const [guides, setGuides] = useState({}); // Object to store guides per fair

    // Fetch fairs on component load
    useEffect(() => {
        fetchFairs()
            .then(setFairs)
            .catch((error) => console.error("Error fetching fairs:", error));
    }, []);

    // Load available guides for a specific fair
    const loadGuides = async (fairId) => {
        if (!guides[fairId]) {
            try {
                const availableGuides = await fetchAvailableGuides(fairId);
    
                // Get assigned guides for this fair
                const fair = fairs.find((f) => f.id === fairId);
                const assignedGuideIds = [
                    fair.guide_1_id,
                    fair.guide_2_id,
                    fair.guide_3_id,
                ].filter((id) => id); // Filter out null/undefined values
    
                // Filter out assigned guides
                const filteredGuides = availableGuides.filter(
                    (guide) => !assignedGuideIds.includes(guide.id)
                );
    
                setGuides((prev) => ({ ...prev, [fairId]: filteredGuides }));
            } catch (error) {
                console.error("Error fetching available guides for fair:", fairId, error);
            }
        }
    };
    

    // Handle guide assignment
    const handleAssignGuide = async (fairId, column, guideId) => {
        if (!guideId) {
            console.error("Guide ID is required for assignment");
            return;
        }
        try {
            // Assign the guide via backend
            await assignGuide(fairId, column, guideId);
    
            // Fetch the assigned guide's details
            const assignedGuide = guides[fairId]?.find((guide) => guide.id === guideId);
    
            if (assignedGuide) {
                // Update the specific fair's data in the `fairs` state
                setFairs((prevFairs) =>
                    prevFairs.map((fair) =>
                        fair.id === fairId
                            ? {
                                  ...fair,
                                  [column]: guideId, // Update the guide ID in the fair object
                                  [`${column.replace("_id", "_name")}`]: assignedGuide.full_name, // Update the name field dynamically
                              }
                            : fair
                    )
                );
    
                // Refresh available guides for this fair
                await loadGuides(fairId);
            } else {
                console.error("Assigned guide details not found");
            }
        } catch (error) {
            console.error("Error assigning guide:", error);
        }
    };    
    

    // Dropdown template for guide selection
    const dropdownOrTextTemplate = (row, column, guideNameField) => {
        const assignedGuideName = row[guideNameField]; // Get guide name field
        return assignedGuideName ? (
            <span>{assignedGuideName}</span> // Display guide name if assigned
        ) : (
            <Dropdown
                value={row[column]} // Current guide ID in the column
                options={guides[row.id] || []} // Guides available for this fair
                optionLabel="full_name" // Display full name of the guide
                optionValue="id" // Use guide ID as value
                placeholder="Select Guide"
                onFocus={() => loadGuides(row.id)} // Fetch guides when dropdown is focused
                onChange={(e) => handleAssignGuide(row.id, column, e.value)} // Assign guide on change
            />
        );
    };

    const handleApproveFair = async (fairId) => {
        if (window.confirm('Are you sure you want to approve this fair?')) {
            try {
                const result = await approveFair(fairId);
                alert(result.message);
                setFairs((prevFairs) =>
                    prevFairs.map((fair) =>
                        fair.id === fairId ? { ...fair, status: 'APPROVED' } : fair
                    )
                );
            } catch (error) {
                console.error('Error approving fair:', error);
            }
        }
    };
    
    const handleCancelFair = async (fairId) => {
        if (window.confirm('Are you sure you want to cancel this fair?')) {
            try {
                const result = await cancelFair(fairId);
                alert(result.message);
                setFairs((prevFairs) =>
                    prevFairs.map((fair) =>
                        fair.id === fairId ? { ...fair, status: 'CANCELLED' } : fair
                    )
                );
            } catch (error) {
                console.error('Error cancelling fair:', error);
            }
        }
    };
    
    
    const actionButtonsTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '10px' }}>
            <Button
                label="Approve"
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => handleApproveFair(rowData.id)}
                disabled={rowData.status === 'APPROVED'}
            />
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => handleCancelFair(rowData.id)}
            />
        </div>
    );
    
    
    
    return (
        <div className="fair-approval-page">
            {/* Sidebar */}
            <Sidebar />
    
            {/* Main Content */}
            <div className="fair-approval-content">
                <h2>Fair Approval</h2>
                <DataTable value={fairs} paginator rows={10} responsiveLayout="scroll">
                    <Column field="date" header="Date" />
                    <Column field="organization_name" header="Organization" />
                    <Column field="city" header="City" />
                    {[{ id: "guide_1_id", nameField: "guide_1_name" },
                    { id: "guide_2_id", nameField: "guide_2_name" },
                    { id: "guide_3_id", nameField: "guide_3_name" }
                    ].map(({ id, nameField }, index) => (
                        <Column
                            key={id}
                            field={id}
                            header={`Guide ${index + 1}`}
                            body={(row) => dropdownOrTextTemplate(row, id, nameField)}
                        />
                    ))}
                    <Column body={actionButtonsTemplate} header="Actions" />
                </DataTable>
            </div>
        </div>
    );
    
    
}
