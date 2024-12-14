import React, { useState, useRef } from "react";
import { addWork } from "../../services/WorkService";
import { Toast } from "primereact/toast"; // Toast
import { InputNumber } from "primereact/inputnumber"; // InputNumber
import { Dropdown } from "primereact/dropdown"; // Dropdown
import { Calendar } from "primereact/calendar"; // Calendar

function AddWork({ refreshData }) {
    const workTypes = [
        { name: 'Interview', code: 'INTERVIEW' },
        { name: 'Information Booth', code: 'INFO_BOOTH' }
    ];

    const [selectedWorkType, setSelectedWorkType] = useState(null); // Dropdown selection
    const [dateTime, setDateTime] = useState(null); // Calendar value
    const [workTime, setWorkTime] = useState(0); // Time in hours with step of 0.5
    const toast = useRef(null); // Toast ref

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const handleAddWork = async () => {
        toast.current.clear(); // Clear toast before showing a new one

        if (!selectedWorkType || !dateTime || workTime === 0) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please fill all the fields!",
                life: 3000,
            });
            return;
        }

        const date = dateTime.toISOString().split("T")[0]; // Extract date
        const time = dateTime.toISOString().split("T")[1].slice(0, 5); // Extract time
        const day = getDayOfWeek(dateTime);
        const workload = workTime * 60; // Convert hours to minutes
        const userId = localStorage.getItem("userId");

        const newWork = {
            type: selectedWorkType.name,
            date,
            time,
            day,
            user_id: userId,
            workload,
            is_approved: false
        };

        try {
            await addWork(newWork);
            toast.current.clear();
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Work added successfully!",
                life: 3000,
            });
            refreshData();
        } catch (error) {
            console.error("Error adding work:", error);
            toast.current.clear();
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to add work.",
                life: 3000,
            });
        }
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "nowrap", // Prevent wrapping
            }}
        >
            <Toast ref={toast} /> {/* Toast for AddWork */}

            {/* Work Type Dropdown */}
            <Dropdown
                value={selectedWorkType}
                options={workTypes}
                onChange={(e) => setSelectedWorkType(e.value)}
                optionLabel="name"
                placeholder="Select a Work Type"
                style={{
                    width: "10rem",
                    height: "3rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    flexShrink: 0,
                }}
            />

            {/* Date-Time Input */}
            <input
                type="datetime-local"
                value={dateTime ? dateTime.toISOString().slice(0, 16) : ''} // Format date for input
                onChange={(e) => setDateTime(new Date(e.target.value))} // Convert input to Date object
                max={new Date().toISOString().slice(0, 16)} // Restrict max date to today
                placeholder="Select Date & Time"
                style={{
                    height: "3rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    flexShrink: 0,
                }}
            />
            {/* InputNumber for Work Time */}
            <InputNumber
                id="work-time"
                value={workTime}
                onValueChange={(e) => setWorkTime(e.value)}
                showButtons
                buttonLayout="horizontal"
                step={0.5} // Step by 0.5 hours (30 minutes)
                min={0} // Minimum value
                max={10} // Maximum value
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                suffix=" hours" // Display 'hours' suffix
                style={{
                    height: "3rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    flexShrink: 0,
                }}
                inputStyle={{ pointerEvents: "none" }} // Prevent manual typing
                inputRef={(ref) => ref && (ref.readOnly = true)} // Programmatically make input read-only
            />


            {/* Add Work Button */}
            <button
                onClick={handleAddWork}
                style={{
                    height: "3rem",
                    padding: "0 1rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    backgroundColor: "#004a77",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#003355")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#004a77")}
            >
                <i className="pi pi-plus" style={{ marginRight: "0.5rem" }}></i>
                Add Work
            </button>
        </div>
    );
}

export default AddWork;
