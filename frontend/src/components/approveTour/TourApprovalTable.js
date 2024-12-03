import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { getAllTours, approveTour, rejectTour } from "../../services/ApproveTourService";
import "./TourApprovalTable.css";

const TourApprovalTable = () => {
    const [tours, setTours] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState({});
    const [rows, setRows] = useState(10);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getAllTours();

                // Override statuses for display
                const processedTours = data.map((tour) => {
                    if (["READY", "DONE", "CANCELLED"].includes(tour.tour_status)) {
                        return { ...tour, display_status: "APPROVED" };
                    }
                    return { ...tour, display_status: tour.tour_status };
                });

                setTours(processedTours);

                // Dynamically calculate rows to fit the screen
                const availableHeight = window.innerHeight;
                const rowHeight = 60;
                const headerHeight = 100;
                const footerHeight = 80;
                const rowsToFit = Math.floor((availableHeight - headerHeight - footerHeight) / rowHeight);
                setRows(rowsToFit);
            } catch (error) {
                console.error("Error loading tours:", error);
            }
        };

        fetchTours();
    }, []);

    const handleApprove = async (rowData) => {
        const selectedTime = selectedTimes[rowData.tour_id];
        const tourDate = rowData.date; // Assuming the date is available in rowData

        if (!selectedTime) {
            alert("Please select a time preference!");
            return;
        }

        try {
            await approveTour(rowData.tour_id, selectedTime, tourDate); // Pass tourDate as an argument
            setTours((prevTours) =>
                prevTours.map((tour) =>
                    tour.tour_id === rowData.tour_id
                        ? { ...tour, time: selectedTime, tour_status: "APPROVED", display_status: "APPROVED" }
                        : tour
                )
            );
        } catch (error) {
            console.error("Error approving tour:", error);
        }
    };


    const handleReject = async (rowData) => {
        try {
            await rejectTour(rowData.tour_id);
            setTours((prevTours) =>
                prevTours.map((tour) =>
                    tour.tour_id === rowData.tour_id
                        ? { ...tour, tour_status: "REJECTED", display_status: "REJECTED" }
                        : tour
                )
            );
        } catch (error) {
            console.error("Error rejecting tour:", error);
        }
    };

    const dateBodyTemplate = (rowData) => {
        const date = new Date(rowData.date);
        const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
        return (
            <span>
                {formattedDate} ({rowData.day})
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => {
        if (rowData.tour_status !== "WAITING") {
            return <span>Action not available</span>;
        }

        const timeOptions = [
            rowData.timepref1,
            rowData.timepref2,
            rowData.timepref3,
            rowData.timepref4,
        ].filter((time) => time !== null);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Dropdown
                    value={selectedTimes[rowData.tour_id]}
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
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
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
            </div>
        );
    };

    const rowClassName = (rowData) => {
        switch (rowData.display_status) {
            case "APPROVED":
                return "green-row";
            case "WAITING":
                return "yellow-row";
            case "REJECTED":
                return "red-row";
            default:
                return "";
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: "center", margin: "20px 0" }}>Tour Approval Page</h1>

            <DataTable
                value={tours}
                paginator
                rows={rows}
                tableStyle={{ minWidth: "80rem" }}
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowClassName={rowClassName}
            >
                <Column field="tour_id" header="Tour ID" style={{ width: "5%" }}></Column>
                <Column field="display_status" header="Tour Status" style={{ width: "10%" }}></Column>
                <Column field="school_name" header="School Name" style={{ width: "20%" }}></Column>
                <Column field="city" header="City" style={{ width: "10%" }}></Column>
                <Column
                    header="Date (Day)"
                    body={dateBodyTemplate}
                    style={{ width: "10%" }}
                ></Column>
                <Column field="tour_size" header="Tour Size" style={{ width: "5%" }}></Column>
                <Column field="teacher_name" header="Teacher Name" style={{ width: "10%" }}></Column>
                <Column field="teacher_phone" header="Teacher Phone" style={{ width: "10%" }}></Column>
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
