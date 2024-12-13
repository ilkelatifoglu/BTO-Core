import React, { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // (1) Import useNavigate
import { cancelTour } from "../services/ApproveTourService"; 
import { Toast } from "primereact/toast"; 

const CancelConfirmation = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate(); 

    const token = searchParams.get("token");

    const handleCancel = async () => {
        if (!token) {
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Invalid cancellation link.",
                life: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await cancelTour(token);
            toast.current.clear();
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: response.message || "Tour successfully canceled.",
                life: 3000,
            });

            // (3) Redirect to home after a short delay, giving time for the toast to appear
            setTimeout(() => {
                navigate("/home");
            }, 1500);
        } catch (error) {
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.response?.data?.message || "Failed to cancel the tour. Please try again.",
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Toast ref={toast} />
            <h1>Confirm Cancellation</h1>
            <p>Are you sure you want to cancel your tour?</p>

            <button
                onClick={handleCancel}
                disabled={isLoading}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {isLoading ? "Processing..." : "Yes, Cancel My Tour"}
            </button>
        </div>
    );
};

export default CancelConfirmation;
