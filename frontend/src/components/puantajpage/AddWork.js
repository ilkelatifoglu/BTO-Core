import React, { useState } from "react";
import { addWork } from "../../services/WorkService";

function AddWork({ refreshData }) {
    const workTypes = [
        { name: 'Fair', code: 'FAIR' },
        { name: 'Interview', code: 'INTERVIEW' },
        { name: 'Information Booth', code: 'INFO_BOOTH' }
    ];

    const [selectedWorkType, setSelectedWorkType] = useState(""); // Store selected work type as a string
    const [dateTime, setDateTime] = useState(""); // Input for datetime-local
    const [workHours, setWorkHours] = useState(""); // Input for workload hours
    const [workMinutes, setWorkMinutes] = useState(""); // Input for workload minutes

    const getDayOfWeek = (dateString) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const handleAddWork = async () => {
        if (!selectedWorkType || !dateTime || (!workHours && !workMinutes)) {
            alert("Please fill all the fields!");
            return;
        }

        // Validate hours and minutes
        if (workHours < 0 || workHours > 10 || workMinutes < 0 || workMinutes > 59) {
            alert("Work hours cannot exceed 10, and minutes cannot exceed 59. Neither can be negative.");
            return;
        }

        // Split date and time
        const [date, time] = dateTime.split("T");

        const day = getDayOfWeek(date);

        // Convert hours and minutes to total minutes
        const workload = (parseInt(workHours, 10) || 0) * 60 + (parseInt(workMinutes, 10) || 0);

        // Get userId from localStorage
        const userId = localStorage.getItem("userId");

        const newWork = {
            type: selectedWorkType,
            date, // Pass date separately
            time, // Pass time separately
            day,
            user_id: userId, // Pass userId directly
            workload,
            is_approved: false
        };

        try {
            const response = await addWork(newWork);
            alert("Work added successfully!");
            console.log("Added Work:", response);
            refreshData(); // Call refreshData from UserWorkTable
        } catch (error) {
            console.error("Error adding work:", error);
            alert("Failed to add work.");
        }
    };

    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                    onChange={(e) => setWorkHours(Math.max(0, Math.min(10, e.target.value)))} // Constrain hours
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
                    onChange={(e) => setWorkMinutes(Math.max(0, Math.min(59, e.target.value)))} // Constrain minutes
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
