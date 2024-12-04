import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getUserWorkEntries, deleteWorkEntry, saveWorkload } from "../../services/WorkService";
import EditWorkScreen from "./EditWorkScreen"; // Import the dialog component
import AddWork from "./AddWork"; // Import AddWork component
import { Button } from "primereact/button";
import "./PuantajComponents.css";

export default function UserWorkTable() {
    const [workEntries, setWorkEntries] = useState([]);
    const [workloadInputs, setWorkloadInputs] = useState({}); // Store workload inputs for Tour rows
    const [selectedWork, setSelectedWork] = useState(null); // Store selected work for editing
    const [isEditScreenOpen, setIsEditScreenOpen] = useState(false); // Control the edit dialog visibility

    useEffect(() => {
        const userId = localStorage.getItem("userId"); // Fetch logged-in user ID from localStorage

        // Fetch only the logged-in user's work entries
        getUserWorkEntries(userId)
            .then((data) => {
                setWorkEntries(data);
            })
            .catch((error) => {
                console.error("Error fetching user work entries:", error);
            });
    }, []);

    const handleEdit = (rowData) => {
        setSelectedWork(rowData);
        setIsEditScreenOpen(true);
    };

    const handleDelete = async (rowData) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete work entry with ID: ${rowData.work_id}?`
        );
        if (confirmDelete) {
            try {
                await deleteWorkEntry(rowData.work_id); // Ensure this is implemented in your service
                setWorkEntries((prevEntries) =>
                    prevEntries.filter((entry) => entry.work_id !== rowData.work_id)
                );
                alert("Work entry deleted successfully.");
            } catch (error) {
                console.error("Error deleting work entry:", error);
                alert("Failed to delete work entry.");
            }
        }
        refreshData();
    };

    const refreshData = async () => {
        try {
            const userId = localStorage.getItem("userId"); // Fetch logged-in user ID again

            const data = await getUserWorkEntries(userId);
            setWorkEntries(data);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };
    const handleSaveWorkload = async (rowData) => {
        const confirmSave = window.confirm("Are you sure you want to save this workload?");
        if (!confirmSave) return;

        const { hours, minutes } = workloadInputs[rowData.work_id] || {};
        const totalWorkload = (parseInt(hours, 10) || 0) * 60 + (parseInt(minutes, 10) || 0);

        try {
            await saveWorkload(rowData.work_id, totalWorkload); // Save workload in the database
            setWorkEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry.work_id === rowData.work_id ? { ...entry, workload: totalWorkload } : entry
                )
            );
            alert("Workload saved successfully!");
        } catch (error) {
            console.error("Error saving workload:", error);
            alert("Failed to save workload.");
        }
    };

    const handleInputChange = (workId, field, value) => {
        setWorkloadInputs((prevInputs) => ({
            ...prevInputs,
            [workId]: { ...prevInputs[workId], [field]: value },
        }));
    };
    const handleSaveEdit = (updatedWork) => {
        setWorkEntries((prevEntries) =>
            prevEntries.map((entry) =>
                entry.work_id === updatedWork.work_id ? updatedWork : entry
            )
        );
        refreshData();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatWorkload = (workload) => {
        const hours = Math.floor(workload / 60);
        const minutes = workload % 60;
        return `${hours} hour(s) ${minutes} minute(s)`;
    };

    const renderWorkload = (rowData) => {
        if (rowData.work_type === "Tour" && rowData.workload === null) {
            const { hours = "", minutes = "" } = workloadInputs[rowData.work_id] || {};
            return (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => handleInputChange(rowData.work_id, "hours", e.target.value)}
                        placeholder="Hours"
                        style={{ width: "3rem" }}
                    />
                    :
                    <input
                        type="number"
                        value={minutes}
                        onChange={(e) => handleInputChange(rowData.work_id, "minutes", e.target.value)}
                        placeholder="Minutes"
                        style={{ width: "3rem" }}
                    />
                </div>
            );
        }
        return `${Math.floor(rowData.workload / 60)} hour(s) ${rowData.workload % 60} minute(s)`;
    };

    const renderActions = (rowData) => {
        if (rowData.work_type === "Tour" && rowData.workload === null) {
            return (
                <Button
                    label="Save"
                    icon="pi pi-save"
                    className="p-button-success p-button-sm"
                    onClick={() => handleSaveWorkload(rowData)}
                />
            );
        }
        if (rowData.work_type === "Tour" || rowData.is_approved) {
            return <span style={{ color: "#aaa" }}>Not Editable</span>; // Placeholder for no action
        }
        return (
            <>
                <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    className="p-button-warning p-button-sm"
                    onClick={() => handleEdit(rowData)}
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    onClick={() => handleDelete(rowData)}
                />
            </>
        );
    };

    return (
        <div className="data-table-container">
            <div className="data-table-content">
                <h1>My Work Entries</h1>
                <DataTable
                    value={workEntries}
                    dataKey="work_id"
                    paginator
                    rows={5}
                    tableStyle={{ minWidth: "50rem" }}
                    paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                >
                    <Column field="work_type" header="Type"></Column>
                    <Column field="date" header="Date" body={(rowData) => formatDate(rowData.date)}></Column>
                    <Column field="day" header="Day"></Column>
                    <Column field="time" header="Time" body={(rowData) => formatTime(rowData.time)}></Column>
                    <Column
                        field="workload"
                        header="Workload"
                        body={(rowData) => renderWorkload(rowData)}
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={(rowData) => (rowData.is_approved ? "Approved" : "Pending")}
                    />
                    <Column
                        header="Actions"
                        body={(rowData) => renderActions(rowData)}
                    />
                </DataTable>

                {/* Render AddWork component */}
                <div className="add-work-container">
                    <AddWork refreshData={refreshData} />
                </div>

                {/* Edit Dialog */}
                <EditWorkScreen
                    isOpen={isEditScreenOpen}
                    onClose={() => setIsEditScreenOpen(false)}
                    workData={selectedWork}
                    onSave={handleSaveEdit}
                />
            </div>
        </div>
    );
}