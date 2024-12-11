import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"; // Using Dialog for confirmation
import { Toast } from "primereact/toast"; // (2) Importing Toast
import { fetchFairs, requestToJoinFair } from "../services/fairService";
import Sidebar from '../components/common/Sidebar';
import "./FairAssignment.css";

export default function FairAssignmentPage() {
    const [fairs, setFairs] = useState([]);
    const toast = useRef(null); // (3) Toast ref
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    useEffect(() => {
        const loadApprovedFairs = async () => {
            try {
                const data = await fetchFairs("APPROVED");
                setFairs(data);

                // Show success toast after data loaded
                toast.current.clear(); // (4) Clear before showing toast
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Approved fairs loaded successfully.",
                    life: 3000,
                });
            } catch (error) {
                console.error("Error loading approved fairs:", error);
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to load approved fairs. Please try again.",
                    life: 3000,
                });
            }
        };

        loadApprovedFairs();
    }, []);

    const handleRequestToJoin = (fairId) => {
        const guideId = localStorage.getItem("userId");
        if (!guideId) {
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Guide ID is missing.",
                life: 3000,
            });
            return;
        }

        setConfirmMessage("Are you sure you want to send a request to join this fair?");
        setConfirmAction(() => async () => {
            try {
                await requestToJoinFair(fairId, guideId);
                setFairs((prevFairs) =>
                    prevFairs.map((f) => (f.id === fairId ? { ...f, requested: true } : f))
                );

                toast.current.clear();
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Request sent successfully.",
                    life: 3000,
                });
            } catch (error) {
                console.error("Error sending join request:", error);
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to send join request. Please try again.",
                    life: 3000,
                });
            }
        });
        setConfirmVisible(true);
    };

    const actionTemplate = (rowData) => (
        <Button
            label="Request to Join"
            icon="pi pi-send"
            onClick={() => handleRequestToJoin(rowData.id)}
            disabled={rowData.requested} // Disable if already requested
        />
    );

    const confirmDialogFooter = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setConfirmVisible(false)}
                className="p-button-text"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={async () => {
                    setConfirmVisible(false);
                    if (confirmAction) {
                        await confirmAction();
                    }
                }}
                className="p-button-danger"
                autoFocus
            />
        </div>
    );

    return (
        <div className="fair-assignment-page">
            <Sidebar />
            <Toast ref={toast} /> {/* (5) Adding Toast to JSX */}
            <div className="fair-assignment-content">
                <h2>Fair Assignment</h2>
                <DataTable value={fairs} paginator rows={10} responsiveLayout="scroll">
                    <Column field="date" header="Date" />
                    <Column field="organization_name" header="Organization Name" />
                    <Column field="city" header="City" />
                    <Column body={actionTemplate} header="Actions" />
                </DataTable>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                visible={confirmVisible}
                onHide={() => setConfirmVisible(false)}
                header="Confirmation"
                footer={confirmDialogFooter}
                modal
                closable={false}
            >
                <p>{confirmMessage}</p>
            </Dialog>
        </div>
    );
}
