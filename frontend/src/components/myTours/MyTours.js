import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AssignTourService from "../../services/AssignTourService";
import {
    getMyIndividualTours,
    withdrawFromIndividualTour,
} from "../../services/IndividualTourService"; // Destructured imports
import { fetchFairs, unassignGuide } from "../../services/fairService";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog"; // Import Dialog from PrimeReact
import "./MyTours.css";
import Sidebar from '../../components/common/Sidebar';
import '../common/CommonComp.css';
import Unauthorized from '../../pages/Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../../hooks/useProtectRoute';
import FilterBar from './FilterBar'; // Import the FilterBar component


export default function MyTours() {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); 
    const [confirmVisible, setConfirmVisible] = useState(false); // Manage dialog visibility
    const [pendingItem, setPendingItem] = useState(null); // Item to withdraw from
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tours = await AssignTourService.getMyTours();
                const readyTours = tours.filter(tour => tour.tour_status === "READY");
                const fairs = await fetchFairs("READY")
                const individualTours = await getMyIndividualTours();
                const readyIndividualTours = individualTours.filter(indTour => indTour.tour_status === "READY")
                

                const combinedData = [
                    ...readyTours.map((tour) => ({
                        ...tour,
                        type: "tour",
                        event: tour.school_name,
                    })),
                    ...fairs
                        .filter((fair) =>
                            [fair.guide_1_id, fair.guide_2_id, fair.guide_3_id]
                                .includes(parseInt(localStorage.getItem("userId"), 10))
                        )
                        .map((fair) => ({
                            ...fair,
                            type: "fair",
                            event: fair.organization_name,
                        })),
                        ...readyIndividualTours.map((indTour) => ({
                            ...indTour,
                            type: "individual",
                            event: indTour.name,
                        })),
                ];

                setItems(combinedData);
                setFilteredItems(combinedData); // Show all initially
                if (toast.current){
                    toast.current.clear();
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Assignments loaded successfully.",
                        life: 3000,
                    });
                }
            } catch (err) {
                if(toast.current){
                    toast.current.clear();
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.message || "Failed to fetch data",
                        life: 3000,
                    });
                }    
            }
        };

        fetchData();
    }, []);

    const dateTemplate = (rowData) => new Date(rowData.date).toLocaleDateString();

    const dayTemplate = (rowData) => {
        const date = new Date(rowData.date);
        return date.toLocaleString("en-us", { weekday: "long" });
    };

    const timeTemplate = (rowData) =>
        rowData.type === "tour" ? rowData.time || "Not Assigned" : "-";

    const showConfirmDialog = (item) => {
        setPendingItem(item);
        setConfirmVisible(true);
    };

    const hideConfirmDialog = () => {
        setConfirmVisible(false);
        setPendingItem(null);
    };

    const confirmWithdraw = async () => {
        if (!pendingItem) return;
        const item = pendingItem;
        const isIndividual = item.type === "individual";
    
        hideConfirmDialog();
        if(toast.current){
            toast.current.clear();
        }
        try {
            if (isIndividual) {
                // Handle individual tour withdrawal
                await withdrawFromIndividualTour(item.id, localStorage.getItem("userId"));
            } else {
                // Handle general tour withdrawal
                await AssignTourService.withdrawFromTour(item.id);
            }
    
            // Update the UI
            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: `${isIndividual ? "Individual Tour" : "Tour"} withdrawn successfully.`,
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message || `Failed to withdraw from ${isIndividual ? "individual tour" : "tour"}.`,
                life: 3000,
            });
        }
    };
    

    const actionTemplate = (rowData) => {
        if (rowData.type === "tour" || rowData.type === "individual") {
            return (
                <button
                    className="withdraw-button"
                    onClick={() => showConfirmDialog(rowData)}
                >
                    Withdraw
                </button>
            );
        }
        return null; // Do not render anything for fairs
    };

    const confirmDialogFooter = (
        <div>
            <button
                className="p-button p-component p-button-text"
                onClick={hideConfirmDialog}
            >
                No
            </button>
            <button
                className="p-button p-component p-button-danger"
                onClick={confirmWithdraw}
            >
                Yes
            </button>
        </div>
    );

    const handleFilterChange = (filters) => {
        const { date, event, type, time } = filters;

        const filtered = items.filter((entry) => {
            // Match date
            let matchDate = true;
            if (date) {
                const entryDateStr = new Date(entry.date).toDateString();
                const filterDateStr = new Date(date).toDateString();
                matchDate = entryDateStr === filterDateStr;
            }

            // Match event (case-insensitive)
            let matchEvent = true;
            if (event) {
                matchEvent = entry.event?.toLowerCase().includes(event.toLowerCase());
            }

            // Match type
            let matchType = true;
            if (type) {
                // Convert entry.type to user-friendly type
                let entryTypeLabel = "-";
                if (entry.type === "fair") entryTypeLabel = "Fair";
                else if (entry.type === "individual") entryTypeLabel = "Individual Tour";
                else if (entry.type === "tour") entryTypeLabel = "Tour";

                matchType = entryTypeLabel.toLowerCase().includes(type.toLowerCase());
            }

            // Match time
            let matchTime = true;
            if (time) {
                const entryTime = entry.type === "tour" ? (entry.time || "Not Assigned") : "-";
                matchTime = entryTime.toLowerCase().includes(time.toLowerCase());
            }

            return matchDate && matchEvent && matchType && matchTime;
        });

        setFilteredItems(filtered);
    };


    if (!isAuthorized) {
        return <Unauthorized />;
      }
    return (
        <div className="page-container">
            <Sidebar />
            <Toast ref={toast} />
            <div className="page-content">
                <h1>My Assignments</h1>
                <FilterBar onFilterChange={handleFilterChange} />

                <DataTable
                    value={filteredItems}
                    paginator
                    rows={15}
                    className="my-tours-table"
                    tableStyle={{ tableLayout: "fixed" }}
                >
                    <Column
                        field="date"
                        header="Date"
                        body={dateTemplate}
                        style={{ width: "20%" }}
                    ></Column>
                    <Column
                        field="day"
                        header="Day"
                        body={dayTemplate}
                        style={{ width: "20%" }}
                    ></Column>
                    <Column
                        field="event"
                        header="Event"
                        style={{ width: "40%" }}
                    ></Column>
                    <Column
                        field="type"
                        header="Type"
                        body={(rowData) => {
                            if (rowData.type === "fair") return "Fair";
                            if (rowData.type === "individual") return "Individual Tour";
                            if (rowData.type === "tour") return "Tour";
                            return "-";
                        }}
                        style={{ width: "20%" }}
                    ></Column>
                    <Column
                        field="time"
                        header="Time"
                        body={timeTemplate}
                        style={{ width: "10%" }}
                    ></Column>
                    <Column
                        body={actionTemplate}
                        header="Actions"
                        style={{ width: "10%" }}
                    ></Column>
                </DataTable>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                visible={confirmVisible}
                onHide={hideConfirmDialog}
                header="Confirm Withdrawal"
                footer={confirmDialogFooter}
                modal
                closable={false}
            >
                <p>
                    Are you sure you want to withdraw from this{" "}
                    {pendingItem?.type === "fair" ? "fair" : "tour"}?
                </p>
            </Dialog>
        </div>
    );
}