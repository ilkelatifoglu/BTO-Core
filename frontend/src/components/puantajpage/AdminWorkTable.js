import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getAllWorkEntries, updateWorkEntry } from "../../services/WorkService";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // (2) Import Toast
import "./PuantajComponents.css";
import "../common/CommonComp.css";

export default function AdminWorkTable() {
    const [workEntries, setWorkEntries] = useState([]);
    const [selectedEntries, setSelectedEntries] = useState({});
    const toast = useRef(null); // (3) Toast ref

    useEffect(() => {
        getAllWorkEntries()
            .then((data) => {
                const initialSelection = data.reduce((acc, entry) => {
                    const uniqueKey = JSON.stringify({
                        work_id: entry.work_id,
                        work_type: entry.work_type,
                        id: entry.id, // User ID
                    });
                    acc[uniqueKey] = entry.is_approved; // Use composite key
                    return acc;
                }, {});

                setWorkEntries(data);
                setSelectedEntries(initialSelection);

                // Success toast after loading data
                if (toast.current) {
                    toast.current.clear();
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "All work entries loaded successfully.",
                        life: 3000,
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching work entries:", error);
                if(toast.current){
                    toast.current.clear();
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: `Failed to load work entries: ${error.message}`,
                        life: 3000,
                    });
                }
            });
    }, []);

    const handleCheckboxChange = (rowData, checked) => {
        const uniqueKey = JSON.stringify({
            work_id: rowData.work_id,
            work_type: rowData.work_type,
            id: rowData.id, // User ID
        });

        setSelectedEntries((prev) => ({
            ...prev,
            [uniqueKey]: checked,
        }));
    };

    const handleSubmit = async () => {
        const updates = workEntries
            .filter((entry) => {
                const uniqueKey = JSON.stringify({
                    work_id: entry.work_id,
                    work_type: entry.work_type,
                    id: entry.id, // User ID
                });

                return selectedEntries[uniqueKey] !== entry.is_approved;
            })
            .map((entry) => ({
                work_id: entry.work_id,
                work_type: entry.work_type,
                id: entry.id, // User ID
                is_approved: selectedEntries[JSON.stringify({
                    work_id: entry.work_id,
                    work_type: entry.work_type,
                    id: entry.id, // User ID
                })],
            }));

        if (updates.length === 0) {
            toast.current?.clear();
            toast.current?.show({
                severity: "info",
                summary: "No Changes",
                detail: "No updates to submit.",
                life: 3000,
            });
            return;
        }

        try {
            for (const update of updates) {
                // Pass the user ID (update.id) to updateWorkEntry
                await updateWorkEntry(update.work_id, update.is_approved, update.work_type, update.id);
            }
            toast.current?.clear();
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Work entries updated successfully.",
                life: 3000,
            });
            refreshData();
        } catch (error) {
            console.error("Error updating work entries:", error);
            toast.current?.clear();
            toast.current?.show({
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
                const uniqueKey = JSON.stringify({
                    work_id: entry.work_id,
                    work_type: entry.work_type,
                    id: entry.id, // User ID
                });
                acc[uniqueKey] = entry.is_approved;
                return acc;
            }, {});
            setWorkEntries(data);
            setSelectedEntries(initialSelection);
        } catch (error) {
            console.error("Error refreshing data:", error);
            toast.current?.clear();
            toast.current?.show({
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
                    rows={20}
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
                    <Column field="first_name" header="First Name"></Column>
                    <Column field="last_name" header="Last Name"></Column>
                    <Column field="iban" header="IBAN No"></Column>
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
                                checked={selectedEntries[JSON.stringify({
                                    work_id: rowData.work_id,
                                    work_type: rowData.work_type,
                                    id: rowData.id, // User ID
                                })]}
                                onChange={(e) => handleCheckboxChange(rowData, e.checked)}
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
