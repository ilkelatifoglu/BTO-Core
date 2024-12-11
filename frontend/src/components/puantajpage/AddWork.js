import React, { useState, useRef } from "react";
import { addWork } from "../../services/WorkService";
import { Toast } from "primereact/toast"; // Importing Toast

function AddWork({ refreshData }) {
    const workTypes = [
        { name: 'Fair', code: 'FAIR' },
        { name: 'Interview', code: 'INTERVIEW' },
        { name: 'Information Booth', code: 'INFO_BOOTH' }
    ];

    const [selectedWorkType, setSelectedWorkType] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [workMinutes, setWorkMinutes] = useState("");
    const toast = useRef(null); // Toast ref

    const getDayOfWeek = (dateString) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const handleAddWork = async () => {
        toast.current.clear(); // Clear toast before showing a new one

        if (!selectedWorkType || !dateTime || (!workHours && !workMinutes)) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please fill all the fields!",
                life: 3000,
            });
            return;
        }

        if (workHours < 0 || workHours > 10 || workMinutes < 0 || workMinutes > 59) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Work hours cannot exceed 10, and minutes cannot exceed 59. Neither can be negative.",
                life: 3000,
            });
            return;
        }

        const [date, time] = dateTime.split("T");
        const day = getDayOfWeek(date);
        const workload = (parseInt(workHours, 10) || 0) * 60 + (parseInt(workMinutes, 10) || 0);
        const userId = localStorage.getItem("userId");

        const newWork = {
            type: selectedWorkType,
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
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Toast ref={toast} /> {/* Toast for AddWork */}
            <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                style={{
                    padding: '0.5rem',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '200px'
                }}
            >
                <option value="" disabled>Select a Work Type</option>
                {workTypes.map((type) => (
                    <option key={type.code} value={type.name}>
                        {type.name}
                    </option>
                ))}
            </select>
            <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                max={(() => {
                    const now = new Date();
                    if (dateTime.split("T")[0] === now.toISOString().slice(0, 10)) {
                        return now.toISOString().slice(0, 16);
                    }
                    return now.toISOString().slice(0, 10) + "T23:59";
                })()}
                style={{
                    padding: '0.5rem',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="number"
                    value={workHours}
                    onChange={(e) => setWorkHours(Math.max(0, Math.min(10, e.target.value)))}
                    placeholder="Hours"
                    style={{
                        width: '5rem',
                        padding: '0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                <span>:</span>
                <input
                    type="number"
                    value={workMinutes}
                    onChange={(e) => setWorkMinutes(Math.max(0, Math.min(59, e.target.value)))}
                    placeholder="Minutes"
                    style={{
                        width: '5rem',
                        padding: '0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>
            <button
                className="p-button p-button-success"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                }}
                onClick={handleAddWork}
            >
                <i className="pi pi-plus" style={{ marginRight: '0.5rem' }}></i>
                Add Work
            </button>
        </div>
    );
}

export default AddWork;
