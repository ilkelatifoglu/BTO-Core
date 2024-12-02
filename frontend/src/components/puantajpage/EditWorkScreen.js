import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { editWorkEntry } from "../../services/WorkService"; // Import the service method

function EditWorkScreen({ isOpen, onClose, workData, onSave }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (workData) {
            setFormData({ ...workData });
        }
    }, [workData]);

    const workTypes = [
        { label: "Fair", value: "Fair" },
        { label: "Interview", value: "Interview" },
        { label: "Information Booth", value: "Information Booth" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (e) => {
        const { name, value } = e;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            // Save changes via the backend
            await editWorkEntry(formData.work_id, formData); // Backend API call

            // Notify the parent component of the changes
            onSave(formData);

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

    return (
        <Dialog
            visible={isOpen}
            style={{ width: "500px" }}
            header="Edit Work Entry"
            modal
            footer={dialogFooter}
            onHide={onClose}
        >
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="type">Work Type</label>
                    <Dropdown
                        id="type"
                        name="type"
                        value={formData.type}
                        options={workTypes}
                        onChange={(e) => handleDropdownChange({ name: "type", value: e.value })}
                        placeholder="Select a Work Type"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="date">Date</label>
                    <Calendar
                        id="date"
                        name="date"
                        value={new Date(formData.date)}
                        onChange={(e) => handleInputChange({ target: { name: "date", value: e.value } })}
                        showIcon
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="time">Time</label>
                    <InputText
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        placeholder="Enter time (e.g., 09:00)"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="workload">Workload</label>
                    <InputNumber
                        id="workload"
                        name="workload"
                        value={formData.workload}
                        onChange={(e) => handleInputChange({ target: { name: "workload", value: e.value } })}
                        mode="decimal"
                        min={0}
                        placeholder="Enter workload in minutes"
                    />
                </div>
            </div>
        </Dialog>
    );
}

export default EditWorkScreen;
