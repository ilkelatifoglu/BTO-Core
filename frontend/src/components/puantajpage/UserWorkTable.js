import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getUserWorkEntries, deleteWorkEntry, saveWorkload } from "../../services/WorkService";
import EditWorkScreen from "./EditWorkScreen";
import AddWork from "./AddWork";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // (2) Importing Toast
import { Dialog } from "primereact/dialog"; // Use Dialog instead of window.confirm
import { InputNumber } from "primereact/inputnumber"; // InputNumber
import "./PuantajComponents.css";
import '../common/CommonComp.css';

export default function UserWorkTable() {
    const [workEntries, setWorkEntries] = useState([]);
    const [workloadInputs, setWorkloadInputs] = useState({});
    const [selectedWork, setSelectedWork] = useState(null);
    const [isEditScreenOpen, setIsEditScreenOpen] = useState(false);

    const toast = useRef(null); // (3) Toast ref

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        getUserWorkEntries(userId)
            .then((data) => {
                setWorkEntries(data);
                toast.current.clear();
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Work entries loaded successfully.",
                    life: 3000,
                });
            })
            .catch((error) => {
                console.error("Error fetching user work entries:", error);
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: `Failed to load work entries: ${error.message}`,
                    life: 3000,
                });
            });
    }, []);

    const handleEdit = (rowData) => {
        setSelectedWork(rowData);
        setIsEditScreenOpen(true);
    };

    const showConfirmDialog = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmVisible(true);
    };

    const handleDelete = (rowData) => {
        showConfirmDialog(
            `Are you sure you want to delete work entry with ID: ${rowData.work_id}?`,
            async () => {
                try {
                    await deleteWorkEntry(rowData.work_id);
                    setWorkEntries((prevEntries) =>
                        prevEntries.filter((entry) => entry.work_id !== rowData.work_id)
                    );
                    toast.current.clear();
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: `Work entry ${rowData.work_id} deleted successfully.`,
                        life: 3000,
                    });
                    refreshData();
                } catch (error) {
                    console.error("Error deleting work entry:", error);
                    toast.current.clear();
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: `Failed to delete work entry ${rowData.work_id}: ${error.message}`,
                        life: 3000,
                    });
                }
            }
        );
    };

    const refreshData = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const data = await getUserWorkEntries(userId);
            setWorkEntries(data);
        } catch (error) {
            console.error("Error refreshing data:", error);
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to refresh data: ${error.message}`,
                life: 3000,
            });
        }
    };

    const handleSaveWorkload = (rowData) => {
        // Map frontend work_type to database table names
        const workTypeMapping = {
            "Individual Tour": "individual_tours",
            "Tour": "tours",
            "Fair": "fairs",
        };

        const workType = workTypeMapping[rowData.work_type]; // Map work_type to the backend table name

        if (!workType) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Invalid work type: ${rowData.work_type}`,
                life: 3000,
            });
            return;
        }

        const workload = workloadInputs[rowData.work_id]?.workload || 0; // Retrieve workload directly

        // Ensure workload is greater than 0
        if (workload <= 0) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Workload must be greater than 0.",
                life: 3000,
            });
            return;
        }

        showConfirmDialog(
            "Are you sure you want to save this workload?",
            async () => {
                const totalWorkload = workload * 60; // Convert hours to minutes

                try {
                    // Pass the mapped workType along with workId and workload
                    await saveWorkload(rowData.work_id, workType, totalWorkload);

                    // Update the state to reflect the saved workload
                    setWorkEntries((prevEntries) =>
                        prevEntries.map((entry) =>
                            entry.work_id === rowData.work_id
                                ? { ...entry, workload: totalWorkload }
                                : entry
                        )
                    );

                    toast.current.clear();
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: `Workload for entry ${rowData.work_id} saved successfully.`,
                        life: 3000,
                    });
                } catch (error) {
                    console.error("Error saving workload:", error);
                    toast.current.clear();
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: `Failed to save workload for ${rowData.work_id}: ${error.message}`,
                        life: 3000,
                    });
                }
            }
        );
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
        toast.current.clear();
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `Work entry ${updatedWork.work_id} updated successfully.`,
            life: 3000,
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const renderWorkload = (rowData) => {
        if ((rowData.work_type === "Tour" || rowData.work_type === "Individual Tour" || rowData.work_type === "Fair") && rowData.workload === null) {
            const workload = workloadInputs[rowData.work_id]?.workload || 0; // Default to 0 if not set
            return (
                <InputNumber
                    value={workload}
                    onValueChange={(e) => handleInputChange(rowData.work_id, "workload", e.value)}
                    showButtons
                    buttonLayout="horizontal"
                    step={0.5} // Step by 0.5 hours (30 minutes)
                    min={0} // Minimum value
                    max={10} // Maximum value
                    decrementButtonClassName="p-button-danger"
                    incrementButtonClassName="p-button-success"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    suffix=" hours" // Display 'hours' suffix
                    style={{
                        height: "3rem",
                        fontSize: "1rem",
                        borderRadius: "5px",
                        flexShrink: 0,
                        width: "12rem",
                    }}
                    inputStyle={{ pointerEvents: "none" }} // Prevent manual typing
                    inputRef={(ref) => ref && (ref.readOnly = true)} // Programmatically make input read-only
                />
            );
        }
        const hours = Math.floor(rowData.workload / 60);
        const mins = rowData.workload % 60;
        return `${hours} hour(s) ${mins} minute(s)`;
    };


    const renderActions = (rowData) => {
        if ((rowData.work_type === "Tour" || rowData.work_type === "Individual Tour" || rowData.work_type === "Fair") && rowData.workload === null) {
            return (
                <Button
                    label="Save"
                    icon="pi pi-save"
                    className="p-button-success p-button-sm"
                    onClick={() => handleSaveWorkload(rowData)}
                />
            );
        }
        if (rowData.work_type === "Tour" || rowData.work_type === "Individual Tour" || rowData.work_type === "Fair" || rowData.is_approved) {
            return <span style={{ color: "#aaa" }}>Not Editable</span>;
        }
        return (
            <div style={{ display: "flex", gap: "0.5rem" }}> {/* Flexbox for spacing */}
                <button
                    className="actions-button edit"
                    onClick={() => handleEdit(rowData)}
                >
                    <i className="pi pi-pencil" style={{ marginRight: "5px" }}></i> Edit
                </button>
                <button
                    className="actions-button delete"
                    onClick={() => handleDelete(rowData)}
                >
                    <i className="pi pi-trash" style={{ marginRight: "5px" }}></i> Delete
                </button>
            </div>
        );
    };

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
        <div className="page-container">
            <Toast ref={toast} /> {/* Toast for UserWorkTable */}
            <div className="page-content">
                <h1>All Work Entries</h1>
                <DataTable
                    value={workEntries}
                    dataKey="work_id"
                    paginator
                    rows={15}
                    tableStyle={{ minWidth: "50rem" }}
                    paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                >
                    <Column field="work_type" header="Type"></Column>
                    <Column field="date" header="Date" body={(rowData) => formatDate(rowData.date)}></Column>
                    <Column field="day" header="Day"></Column>
                    <Column field="time" header="Time" body={(rowData) => formatTime(rowData.time)}></Column>
                    <Column
                        field="school_name"
                        header="School/Fair Name"
                        body={(rowData) => (rowData.school_name ? rowData.school_name : "-")}
                    />
                    <Column
                        field="city"
                        header="City"
                        body={(rowData) => (rowData.city ? rowData.city : "-")}
                    />

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

                <div className="add-work-container">
                    <AddWork refreshData={refreshData} />
                </div>

                <EditWorkScreen
                    isOpen={isEditScreenOpen}
                    onClose={() => setIsEditScreenOpen(false)}
                    workData={selectedWork}
                    onSave={handleSaveEdit}
                />
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
