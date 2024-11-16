import React, { useState } from "react";
import GenericDropdown from "./Dropdown";
import NumeralsDemo from "./NumberInput";
import FormatDemo from "./Calender";
import workService from "../../services/CustomerService";

function AddWork() {
    const workTypes = [
        { name: 'Tour', code: 'TOUR' },
        { name: 'Fair', code: 'FAIR' },
        { name: 'Interview', code: 'INTERVIEW' },
        { name: 'Information Booth', code: 'INFO_BOOTH' }
    ];
    const times = [
        { time: '09:00:00', code: '0900' },
        { time: '11:00:00', code: '1100' },
        { time: '13:30:00', code: '1330' },
        { time: '16:00:00', code: '1600' }
    ];

    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [workload, setWorkload] = useState(null);

    const getDayOfWeek = (dateString) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const handleAddWork = async () => {
        if (!selectedWorkType || !selectedTime || !selectedDate || !workload) {
            alert("Please fill all the fields!");
            return;
        }

        const day = getDayOfWeek(selectedDate);

        const newWork = {
            type: selectedWorkType.name,
            date: selectedDate,
            day,
            time: selectedTime.time,
            guide_name: "Bertan Uran", // Replace with dynamic value if needed
            workload,
            is_approved: false
        };

        try {
            const response = await workService.addWork(newWork);
            alert("Work added successfully!");
            console.log("Added Work:", response);
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
            <GenericDropdown
                options={times}
                value={selectedTime}
                onChange={setSelectedTime}
                optionLabel="time"
                placeholder="Select a Time"
            />
            <NumeralsDemo
                value={workload}
                onChange={setWorkload}
            />
            <button
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={handleAddWork}
            >
                Add Work
            </button>
        </div>
    );
}

export default AddWork;