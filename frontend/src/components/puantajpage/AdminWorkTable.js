import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getAllWorkEntries, updateWorkEntry } from "../../services/WorkService";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import "./PuantajComponents.css";

export default function AdminWorkTable() {
    const [workEntries, setWorkEntries] = useState([]);
    const [selectedEntries, setSelectedEntries] = useState({});

    useEffect(() => {
        // Fetch all work entries
        getAllWorkEntries()
            .then((data) => {
                const initialSelection = data.reduce((acc, entry) => {
                    acc[entry.work_id] = entry.is_approved;
                    return acc;
                }, {});
                setWorkEntries(data);
                setSelectedEntries(initialSelection);
            })
            .catch((error) => {
                console.error("Error fetching work entries:", error);
            });
    }, []);

    const handleCheckboxChange = (workId, checked) => {
        setSelectedEntries((prev) => ({
            ...prev,
            [workId]: checked,
        }));
    };

    const handleSubmit = async () => {
        try {
            const updates = Object.entries(selectedEntries).map(([workId, isApproved]) => {
                const work = workEntries.find(entry => entry.work_id === parseInt(workId, 10));
                return {
                    work_id: parseInt(workId, 10),
                    is_approved: isApproved,
                    work_type: work.work_type, // Add work_type to the update payload
                };
            });

            for (const update of updates) {
                await updateWorkEntry(update.work_id, update.is_approved, update.work_type);
            }

            alert("Work entries updated successfully.");
            refreshData();
        } catch (error) {
            console.error("Error updating work entries:", error);
            alert("Failed to update work entries.");
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
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="data-table-container">
            <div className="data-table-content">
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
                    <Column field="workload" header="Workload"></Column>
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