import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { editWorkEntry } from "../../services/WorkService"; // Import the service method

function EditWorkScreen({ isOpen, onClose, workData, onSave }) {
    const [formData, setFormData] = useState({});
    const [workHours, setWorkHours] = useState(""); // Workload hours
    const [workMinutes, setWorkMinutes] = useState(""); // Workload minutes
    const [dateTime, setDateTime] = useState(""); // Date-time input

    useEffect(() => {
        if (workData) {
            setFormData({ ...workData });
            setWorkHours(Math.floor(workData.workload / 60)); // Initialize hours from workload
            setWorkMinutes(workData.workload % 60); // Initialize minutes from workload
            setDateTime(`${workData.date}T${workData.time}`); // Initialize date-time
        }
    }, [workData]);

    const workTypes = [
        { label: "Fair", value: "Fair" },
        { label: "Interview", value: "Interview" },
        { label: "Information Booth", value: "Information Booth" },
    ];

    const handleDropdownChange = (e) => {
        setFormData((prev) => ({ ...prev, type: e.value }));
    };

    const handleSave = async () => {
        if (!dateTime || (!workHours && !workMinutes)) {
            alert("Please fill all required fields!");
            return;
        }

        // Prevent invalid workload
        if (workHours < 0 || workHours > 10 || workMinutes < 0 || workMinutes > 59) {
            alert("Work hours cannot exceed 10, and minutes cannot exceed 59. Neither can be negative.");
            return;
        }

        // Split date and time
        const [date, time] = dateTime.split("T");

        // Calculate total workload in minutes
        const workload = (parseInt(workHours, 10) || 0) * 60 + (parseInt(workMinutes, 10) || 0);

        const updatedData = {
            ...formData,
            date,
            time,
            workload,
        };

        try {
            // Save changes via the backend
            await editWorkEntry(formData.work_id, updatedData); // Backend API call

            // Notify the parent component of the changes
            onSave(updatedData);

            // Close the dialog
            onClose();
        } catch (error) {
            console.error("Error saving work entry:", error);
            alert("Failed to save changes. Please try again.");
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={onClose} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleSave} autoFocus />
        </div>
    );

    if (!isOpen) return null;

    const now = new Date().toISOString().slice(0, 16); // Current date and time in `datetime-local` format

    return (
        <Dialog
            visible={isOpen}
            style={{ width: "500px" }}
            header="Edit Work Entry"
            modal
            footer={dialogFooter}
            onHide={() => {
                setFormData({}); // Reset form data on close
                setWorkHours("");
                setWorkMinutes("");
                setDateTime("");
                onClose();
            }}
        >
            <div className="p-fluid">
                {/* Work Type Dropdown */}
                <div className="p-field">
                    <label htmlFor="type">Work Type</label>
                    <Dropdown
                        id="type"
                        value={formData.type || ""} // Ensure value is correctly set
                        options={workTypes}
                        onChange={(e) => handleDropdownChange(e)}
                        placeholder="Select a Work Type"
                    />
                </div>

                {/* Date-Time Input */}
                <div className="p-field">
                    <label htmlFor="dateTime">Date & Time</label>
                    <input
                        type="datetime-local"
                        id="dateTime"
                        value={dateTime}
                        max={now} // Prevent selecting future dates/times
                        onChange={(e) => setDateTime(e.target.value)}
                        style={{
                            padding: "0.5rem",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            width: "100%",
                        }}
                    />
                </div>

                {/* Workload Hours and Minutes */}
                <div className="p-field">
                    <label htmlFor="workHours">Workload (Hours:Minutes)</label>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                            type="number"
                            id="workHours"
                            value={workHours}
                            onChange={(e) => setWorkHours(Math.max(0, Math.min(10, e.target.value)))} // Constrain hours
                            placeholder="Hours"
                            style={{
                                width: "5rem",
                                padding: "0.5rem",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <span>:</span>
                        <input
                            type="number"
                            id="workMinutes"
                            value={workMinutes}
                            onChange={(e) => setWorkMinutes(Math.max(0, Math.min(59, e.target.value)))} // Constrain minutes
                            placeholder="Minutes"
                            style={{
                                width: "5rem",
                                padding: "0.5rem",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default EditWorkScreen;
