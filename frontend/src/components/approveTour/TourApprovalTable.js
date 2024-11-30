import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { getAllTours, approveTour, rejectTour } from "../../services/ApproveTourService";
import "./TourApprovalTable.css"; // Adjust the path based on your project structure

const TourApprovalTable = () => {
    const [tours, setTours] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState({}); // Store selected times for each row
    const [rows, setRows] = useState(10); // Default rows to display

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getAllTours();
                setTours(data);

                // Dynamically calculate rows to fit the screen
                const availableHeight = window.innerHeight; // Get viewport height
                const rowHeight = 60; // Approximate row height
                const headerHeight = 100; // Approximate header height
                const footerHeight = 80; // Approximate footer height
                const rowsToFit = Math.floor((availableHeight - headerHeight - footerHeight) / rowHeight);
                setRows(rowsToFit);
            } catch (error) {
                console.error("Error loading tours:", error);
            }
        };

        fetchTours();
    }, []);

    // Approve a tour with a selected time preference
    const handleApprove = async (rowData) => {
        const selectedTime = selectedTimes[rowData.tour_id];
        if (!selectedTime) {
            alert("Please select a time preference!");
            return;
        }
        try {
            await approveTour(rowData.tour_id, selectedTime);
            // Update the UI after approval
            setTours((prevTours) =>
                prevTours.map((tour) =>
                    tour.tour_id === rowData.tour_id
                        ? { ...tour, time: selectedTime, tour_status: "APPROVED" }
                        : tour
                )
            );
        } catch (error) {
            console.error("Error approving tour:", error);
        }
    };

    // Reject a tour
    const handleReject = async (rowData) => {
        try {
            await rejectTour(rowData.tour_id);
            // Update the UI after rejection
            setTours((prevTours) =>
                prevTours.map((tour) =>
                    tour.tour_id === rowData.tour_id
                        ? { ...tour, tour_status: "REJECTED" }
                        : tour
                )
            );
        } catch (error) {
            console.error("Error rejecting tour:", error);
        }
    };

    // Format date and combine with day
    const dateBodyTemplate = (rowData) => {
        const date = new Date(rowData.date);

        // Format date to dd-MM-yyyy
        const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

        return (
            <span>
                {formattedDate} ({rowData.day})
            </span>
        );
    };

    // Action buttons for each row
    const actionBodyTemplate = (rowData) => {
        if (rowData.tour_status !== "WAITING") {
            return <span>Action not available</span>; // Show a placeholder message
        }

        const timeOptions = [
            rowData.timepref1,
            rowData.timepref2,
            rowData.timepref3,
            rowData.timepref4,
        ].filter((time) => time !== null); // Filter out null preferences

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Dropdown for time selection */}
                <Dropdown
                    value={selectedTimes[rowData.tour_id]} // Bind the selected time for this row
                    options={timeOptions}
                    onChange={(e) =>
                        setSelectedTimes((prev) => ({
                            ...prev,
                            [rowData.tour_id]: e.value,
                        }))
                    }
                    placeholder="Select Time"
                    className="p-mb-2"
                    disabled={rowData.tour_status !== "WAITING"}
                />
                {/* Buttons for approve and reject */}
                <Button
                    label="Approve"
                    className="p-button-success"
                    onClick={() => handleApprove(rowData)}
                    disabled={rowData.tour_status !== "WAITING"}
                />
                <Button
                    label="Reject"
                    className="p-button-danger"
                    onClick={() => handleReject(rowData)}
                    disabled={rowData.tour_status !== "WAITING"}
                />
            </div>
        );
    };

    // Row class logic
    const rowClassName = (rowData) => {
        switch (rowData.tour_status) {
            case "APPROVED":
            case "READY":
                return "green-row";
            case "WAITING":
                return "yellow-row";
            case "REJECTED":
            case "CANCELED":
                return "red-row";
            default:
                return "";
        }
    };

    return (
        <div>
            {/* Page Header */}
            <h1 style={{ textAlign: "center", margin: "20px 0" }}>Tour Approval Page</h1>

            {/* Data Table */}
            <DataTable
                value={tours}
                paginator
                rows={rows}
                tableStyle={{ minWidth: "80rem" }}
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowClassName={rowClassName} // Apply row-specific classes
            >
                <Column field="tour_id" header="Tour ID" style={{ width: "5%" }}></Column>
                <Column field="tour_status" header="Tour Status" style={{ width: "10%" }}></Column>
                <Column field="school_name" header="School Name" style={{ width: "20%" }}></Column>
                <Column field="city" header="City" style={{ width: "10%" }}></Column>
                {/* Combined Date and Day Column */}
                <Column
                    header="Date (Day)"
                    body={dateBodyTemplate}
                    style={{ width: "10%" }}
                ></Column>
                <Column field="tour_size" header="Tour Size" style={{ width: "5%" }}></Column>
                <Column field="teacher_name" header="Teacher Name" style={{ width: "10%" }}></Column>
                <Column field="teacher_phone" header="Teacher Phone" style={{ width: "10%" }}></Column>
                <Column field="classroom" header="Classroom" style={{ width: "5%" }}></Column>
                <Column field="time" header="Selected Time" style={{ width: "5%" }}></Column>
                <Column
                    header="Approve/Reject"
                    body={actionBodyTemplate}
                    style={{ width: "10%" }}
                ></Column>
            </DataTable>
        </div>
    );
};

export default TourApprovalTable;
