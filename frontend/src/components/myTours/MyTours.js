import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AssignTourService from "../../services/AssignTourService";
import { fetchFairs, unassignGuide } from "../../services/fairService";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog"; // Import Dialog from PrimeReact
import "./MyTours.css";
import Sidebar from '../../components/common/Sidebar';
import '../common/CommonComp.css';
import Unauthorized from '../../pages/Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../../hooks/useProtectRoute';

export default function MyTours() {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const [items, setItems] = useState([]);
    const [confirmVisible, setConfirmVisible] = useState(false); // Manage dialog visibility
    const [pendingItem, setPendingItem] = useState(null); // Item to withdraw from
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tours = await AssignTourService.getMyTours();
                const fairs = await fetchFairs();

                const combinedData = [
                    ...tours.map((tour) => ({
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
                ];

                setItems(combinedData);

                toast.current.clear();
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Assignments loaded successfully.",
                    life: 3000,
                });
            } catch (err) {
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: err.message || "Failed to fetch data",
                    life: 3000,
                });
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
        const isFair = item.type === "fair";

        hideConfirmDialog();
        toast.current.clear();
        try {
            if (isFair) {
                const userId = parseInt(localStorage.getItem("userId"), 10);
                const column =
                    item.guide_1_id === userId
                        ? "guide_1_id"
                        : item.guide_2_id === userId
                        ? "guide_2_id"
                        : "guide_3_id";

                await unassignGuide(item.id, column);
            } else {
                await AssignTourService.withdrawFromTour(item.id);
            }

            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));

            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: `${isFair ? "Fair" : "Tour"} withdrawn successfully.`,
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message || `Failed to withdraw from ${isFair ? "fair" : "tour"}`,
                life: 3000,
            });
        }
    };

    const actionTemplate = (rowData) => (
        <button
            className="withdraw-button"
            onClick={() => showConfirmDialog(rowData)}
        >
            Withdraw
        </button>
    );

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
    if (!isAuthorized) {
        return <Unauthorized />;
      }
    return (
        <div className="page-container">
            <Sidebar />
            <Toast ref={toast} />
            <div className="page-content">
                <h1>My Tours</h1>
                <DataTable
                    value={items}
                    paginator
                    rows={10}
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