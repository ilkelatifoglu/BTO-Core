import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast"; 
import { getIndividualTours, approveTour, rejectTour } from "../../services/IndividualTourService";
import '../approveTour/TourApprovalTable.css';
import './IndividualTourTable.css';

const IndividualToursTable = () => {
    const [tours, setTours] = useState([]);
    const [rows, setRows] = useState(10);
    const [visible, setVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [userType, setUserType] = useState(localStorage.getItem("userType"));

    const toast = useRef(null); // (3) Toast ref

    // Function to fetch tours and set the state
    const fetchTours = async () => {
        try {
            const data = await getIndividualTours();
            setTours(data);

            // Dynamically calculate rows to fit the screen
            const availableHeight = window.innerHeight;
            const rowHeight = 60;
            const headerHeight = 100;
            const footerHeight = 80;
            const rowsToFit = Math.floor((availableHeight - headerHeight - footerHeight) / rowHeight);
            setRows(rowsToFit);

            // Show success toast after loading
            toast.current.clear();
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Individual tours loaded successfully.",
                life: 3000,
            });
        } catch (error) {
            console.error("Error fetching individual tours:", error);
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to load individual tours: ${error.message}`,
                life: 3000,
            });
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    // Format the date to dd/mm/yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Open the popup with the note content
    const showNote = (note) => {
        setSelectedNote(note);
        setVisible(true);
    };

    // Close the popup
    const hideNote = () => {
        setVisible(false);
    };

    // Approve a tour
    const handleApproveTour = async (tourId) => {
        toast.current.clear();
        try {
            await approveTour(tourId, userId);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: `Tour ${tourId} approved successfully.`,
                life: 3000,
            });
            fetchTours();
        } catch (error) {
            console.error("Error approving tour:", error);
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to approve tour ${tourId}: ${error.message}`,
                life: 3000,
            });
        }
    };

    // Reject a tour
    const handleRejectTour = async (tourId) => {
        toast.current.clear();
        try {
            await rejectTour(tourId);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: `Tour ${tourId} rejected successfully.`,
                life: 3000,
            });
            fetchTours();
        } catch (error) {
            console.error("Error rejecting tour:", error);
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to reject tour ${tourId}: ${error.message}`,
                life: 3000,
            });
        }
    };

    // Visitor notes column template
    const noteBodyTemplate = (rowData) => {
        if (rowData.visitor_notes) {
            return (
                <Button
                    icon="pi pi-file"
                    className="p-button-notes p-button-rounded"
                    onClick={() => showNote(rowData.visitor_notes)}
                    aria-label="Show Note"
                />
            );
        } else {
            return <span>No Note</span>;
        }
    };

    // Actions column template
    const actionBodyTemplate = (rowData) => {
        if (rowData.tour_status === "WAITING") {
            return (
                <div>
                    <Button
                        icon="pi pi-check"
                        className="p-button-success p-button-approve p-button-rounded"
                        onClick={() => handleApproveTour(rowData.id)}
                        aria-label="Approve Tour"
                    />
                    {(userType === "3" || userType === "4") && (
                        <Button
                            icon="pi pi-times"
                            className="p-button-danger p-button-reject p-button-rounded"
                            onClick={() => handleRejectTour(rowData.id)}
                            aria-label="Reject Tour"
                        />
                    )}
                </div>
            );
        }
        return <span>No action</span>;
    };

    // Combine first and last name into one Guide Name
    const combineGuideName = (rowData) => {
        if (rowData.guide_id === null) {
            return "No guide is assigned yet";
        }
        return `${rowData.guide_first_name} ${rowData.guide_last_name}`;
    };

    // Dynamic row class based on tour status
    const getRowClass = (tourStatus) => {
        switch (tourStatus) {
            case "APPROVED":
            case "READY":
            case "DONE":
                return "green-row";
            case "WAITING":
                return "yellow-row";
            case "CANCELLED":
            case "REJECTED":
                return "red-row";
            default:
                return "";
        }
    };

    return (
        <div className="table-wrapper" style={{ marginLeft: "10px", overflowX: "hidden" }}>
          <Toast ref={toast} /> {/* (5) Adding the Toast to the JSX */}
            <DataTable
                value={tours}
                paginator
                rows={rows}
                tableStyle={{ width: "100%" }}
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowClassName={(data) => getRowClass(data.tour_status)}
            >
                <Column field="id" header="ID" style={{ width: "5%" }}></Column>
                <Column field="tour_status" header="Tour Status" style={{ width: "10%" }}></Column>
                <Column field="date" header="Date" style={{ width: "10%" }} body={(rowData) => formatDate(rowData.date)}></Column>
                <Column field="day" header="Day" style={{ width: "10%" }}></Column>
                <Column field="time" header="Time" style={{ width: "5%" }}></Column>
                <Column field="tour_size" header="Tour Size" style={{ width: "5%" }}></Column>
                <Column field="contact_name" header="Contact Name" style={{ width: "10%" }}></Column>
                <Column field="contact_phone" header="Contact Phone" style={{ width: "10%" }}></Column>
                <Column field="major_of_interest" header="Major of Interest" style={{ width: "10%" }}></Column>
                <Column field="visitor_notes" header="Visitor Notes" style={{ width: "5%" }} body={noteBodyTemplate}></Column>
                <Column header="Guide Name" style={{ width: "10%" }} body={combineGuideName}></Column>
                <Column body={actionBodyTemplate} header="Actions" style={{ width: "10%" }}></Column>
            </DataTable>

            <Dialog visible={visible} onHide={hideNote} header="Visitor Notes" modal>
                <p>{selectedNote}</p>
            </Dialog>
        </div>
    );
};

export default IndividualToursTable;
