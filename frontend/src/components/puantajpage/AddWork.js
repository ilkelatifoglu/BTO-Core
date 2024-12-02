import React, { useState } from "react";
import GenericDropdown from "./Dropdown";
import FormatDemo from "./Calender";
import { addWork } from "../../services/WorkService";

function AddWork({ refreshData }) {
    const workTypes = [
        { name: 'Fair', code: 'FAIR' },
        { name: 'Interview', code: 'INTERVIEW' },
        { name: 'Information Booth', code: 'INFO_BOOTH' }
    ];

    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedTime, setSelectedTime] = useState(""); // Free text input for time
    const [selectedDate, setSelectedDate] = useState(null);
    const [workHours, setWorkHours] = useState(""); // Input for workload hours
    const [workMinutes, setWorkMinutes] = useState(""); // Input for workload minutes

    const getDayOfWeek = (dateString) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const handleAddWork = async () => {
        if (!selectedWorkType || !selectedTime || !selectedDate || (!workHours && !workMinutes)) {
            alert("Please fill all the fields!");
            return;
        }

        const day = getDayOfWeek(selectedDate);

        // Convert hours and minutes to total minutes
        const workload = (parseInt(workHours, 10) || 0) * 60 + (parseInt(workMinutes, 10) || 0);

        // Get userId from localStorage
        const userId = localStorage.getItem("userId");

        const newWork = {
            type: selectedWorkType.name,
            date: selectedDate,
            day,
            time: selectedTime,
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
            <GenericDropdown
                options={workTypes}
                value={selectedWorkType}
                onChange={setSelectedWorkType}
                optionLabel="name"
                placeholder="Select a Work Type"
            />
            <FormatDemo
                value={selectedDate}
                onChange={setSelectedDate}
            />
            <input
                type="text"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                placeholder="Enter Time (e.g., 13:30)"
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
                    onChange={(e) => setWorkHours(e.target.value)}
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
                    onChange={(e) => setWorkMinutes(e.target.value)}
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
