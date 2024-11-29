import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { getAllTours, approveTour, rejectTour } from "../../services/ApproveTourService";

const TourApprovalTable = () => {
    const [tours, setTours] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState({}); // Store selected times for each row

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getAllTours();
                setTours(data);
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
            <div>
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
                <Button
                    label="Approve"
                    className="p-button-success p-mb-2"
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

    return (
        <DataTable
            value={tours}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "80rem" }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
        >
            <Column field="tour_id" header="Tour ID" style={{ width: "10%" }}></Column>
            <Column field="tour_status" header="Tour Status" style={{ width: "15%" }}></Column>
            <Column field="school_name" header="School Name" style={{ width: "15%" }}></Column>
            <Column field="city" header="City" style={{ width: "10%" }}></Column>
            <Column field="date" header="Date" style={{ width: "10%" }}></Column>
            <Column field="tour_size" header="Tour Size" style={{ width: "10%" }}></Column>
            <Column field="teacher_name" header="Teacher Name" style={{ width: "15%" }}></Column>
            <Column field="teacher_phone" header="Teacher Phone" style={{ width: "15%" }}></Column>
            <Column field="classroom" header="Classroom" style={{ width: "10%" }}></Column>
            <Column field="time" header="Selected Time" style={{ width: "10%" }}></Column>
            <Column
                header="Actions"
                body={actionBodyTemplate}
                style={{ width: "20%" }}
            ></Column>
        </DataTable>
    );
};

export default TourApprovalTable;
