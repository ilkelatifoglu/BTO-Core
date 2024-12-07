import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AssignTourService from "../../services/AssignTourService";
import "./MyTours.css";
import Sidebar from '../../components/common/Sidebar';

export default function MyTours() {
    const [myTours, setMyTours] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyTours = async () => {
            try {
                const tours = await AssignTourService.getMyTours();
                setMyTours(tours);
            } catch (err) {
                setError(err.message || "Failed to fetch tours");
            }
        };
        fetchMyTours();
    }, []);

    const dateTemplate = (rowData) => new Date(rowData.date).toLocaleDateString();
    const timeTemplate = (rowData) => rowData.time || "Not Assigned";

    const withdrawFromTour = async (tourId) => {
        try {
            await AssignTourService.withdrawFromTour(tourId);
            setMyTours((prevTours) => prevTours.filter((tour) => tour.id !== tourId)); // Update UI after withdrawal
        } catch (error) {
            console.error("Failed to withdraw from tour:", error);
            setError(error.message || "Failed to withdraw from tour");
        }
    };

    const withdrawButtonTemplate = (rowData) => (
        <button className="withdraw-button" onClick={() => withdrawFromTour(rowData.id)}>
            Withdraw
        </button>
    );


    return (
        <div className="my-tours-container">
            <Sidebar />
            <div className="my-tours-content">
            <h1>My Tours</h1>
            {error && <p className="error-message">{error}</p>}
            <DataTable value={myTours} paginator rows={10}>
                <Column field="date" header="Date" body={dateTemplate}></Column>
                <Column field="day" header="Day"></Column>
                <Column field="time" header="Time" body={timeTemplate}></Column>
                <Column field="school_name" header="School"></Column>
                <Column body={withdrawButtonTemplate} header="Actions"></Column>

            </DataTable>
        </div>
        </div>
    );
}
