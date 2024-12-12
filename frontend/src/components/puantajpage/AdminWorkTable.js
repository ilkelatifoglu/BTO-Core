import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getAllWorkEntries, updateWorkEntry } from "../../services/WorkService";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // (2) Import Toast
import "./PuantajComponents.css";
import '../common/CommonComp.css';

export default function AdminWorkTable() {
    const [workEntries, setWorkEntries] = useState([]);
    const [selectedEntries, setSelectedEntries] = useState({});
    const toast = useRef(null); // (3) Toast ref

    useEffect(() => {
        getAllWorkEntries()
            .then((data) => {
                const initialSelection = data.reduce((acc, entry) => {
                    acc[entry.work_id] = entry.is_approved;
                    return acc;
                }, {});
                setWorkEntries(data);
                setSelectedEntries(initialSelection);

                // Success toast after loading data
                toast.current.clear();
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "All work entries loaded successfully.",
                    life: 3000,
                });
            })
            .catch((error) => {
                console.error("Error fetching work entries:", error);
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: `Failed to load work entries: ${error.message}`,
                    life: 3000,
                });
            });
    }, []);

    const handleCheckboxChange = (workId, checked) => {
        setSelectedEntries((prev) => ({
            ...prev,
            [workId]: checked,
        }));
    };

    const handleSubmit = async () => {
        const updates = workEntries
            .filter((entry) => selectedEntries[entry.work_id] !== entry.is_approved)
            .map((entry) => ({
                work_id: entry.work_id,
                is_approved: selectedEntries[entry.work_id],
                work_type: entry.work_type,
            }));

        if (updates.length === 0) {
            toast.current.clear();
            toast.current.show({
                severity: "info",
                summary: "No Changes",
                detail: "No updates to submit.",
                life: 3000,
            });
            return;
        }

        try {
            for (const update of updates) {
                await updateWorkEntry(update.work_id, update.is_approved, update.work_type);
            }
            toast.current.clear();
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Work entries updated successfully.",
                life: 3000,
            });
            refreshData();
        } catch (error) {
            console.error("Error updating work entries:", error);
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to update work entries: ${error.message}`,
                life: 3000,
            });
        }
    };

    const refreshData = async () => {
        try {
            const data = await getAllWorkEntries();
            const initialSelection = data.reduce((acc, entry) => {
                acc[entry.work_id] = entry.is_approved;
                return acc;
            }, {});
            setWorkEntries(data);
            setSelectedEntries(initialSelection);
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

    return (
        <div className="page-container">
            <Toast ref={toast} /> {/* (5) Added Toast component */}
            <div className="page-content">
                <h1>All Work Entries</h1>
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
                    <Column field="first_name" header="First Name"></Column>
                    <Column field="last_name" header="Last Name"></Column>
                    <Column
                        field="workload"
                        header="Workload"
                        body={(rowData) => formatWorkload(rowData.workload)}
                    />

                    <Column
                        field="status"
                        header="Status"
                        body={(rowData) => (rowData.is_approved ? "Approved" : "Pending")}
                    />
                    <Column
                        header="Approve"
                        body={(rowData) => (
                            <Checkbox
                                checked={selectedEntries[rowData.work_id]}
                                onChange={(e) => handleCheckboxChange(rowData.work_id, e.checked)}
                            />
                        )}
                    />
                </DataTable>

                <div className="submit-button-container">
                    <Button
                        label="Submit"
                        icon="pi pi-check"
                        className="p-button-success"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
