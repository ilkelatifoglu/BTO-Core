import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { editWorkEntry } from "../../services/WorkService";
import "./EditWorkScreen.css";
function EditWorkScreen({ isOpen, onClose, workData, onSave }) {
    const [formData, setFormData] = useState({});
    const [workTime, setWorkTime] = useState(0);
    const [dateTime, setDateTime] = useState("");
    const toast = useRef(null);

    useEffect(() => {
        if (isOpen && workData) {
            setFormData({ ...workData });
            setWorkTime(workData.workload / 60);

            // Parse workData.date and update the time using workData.time
            const baseDate = new Date(workData.date);
            if (!isNaN(baseDate)) {
                const [hours, minutes] = workData.time.split(":").map(Number); // Extract hours and minutes
                baseDate.setHours(hours, minutes, 0, 0); // Update hours and minutes
                setDateTime(baseDate); // Set the updated Date object
            } else {
                console.error("Invalid Date:", workData.date);
                setDateTime(""); // Reset if invalid
            }
        }

        if (!isOpen) {
            // Reset state when the dialog is closed
            setFormData({});
            setWorkTime(0);
            setDateTime("");
        }
    }, [workData, isOpen]);

    const workTypes = [
        { label: "Interview", value: "Interview" },
        { label: "Information Booth", value: "Information Booth" },
    ];

    const handleDropdownChange = (e) => {
        setFormData((prev) => ({ ...prev, work_type: e.value })); // Update work_type consistently
    };

    const showToast = (severity, summary, detail) => {
        if (toast.current) {
            toast.current.clear();
            toast.current.show({ severity, summary, detail, life: 3000 });
        }
    };

    const handleSave = async () => {
        if (!dateTime || workTime === 0) {
            showToast("error", "Error", "Please fill all required fields!");
            return;
        }

        if (workTime < 0 || workTime > 10) {
            showToast("error", "Error", "Work hours cannot exceed 10 and cannot be negative.");
            return;
        }

        const date = dateTime.toISOString().split("T")[0];
        const time = dateTime.toISOString().split("T")[1].slice(0, 5);
        console.log(date, time);
        const workload = workTime * 60;

        const updatedData = {
            ...formData,
            date,
            time,
            workload,
        };

        try {
            await editWorkEntry(formData.work_id, updatedData);
            onSave(updatedData);
            showToast("success", "Success", "Work entry saved successfully!");
            onClose();
        } catch (error) {
            console.error("Error saving work entry:", error);
            showToast("error", "Error", "Failed to save changes. Please try again.");
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={onClose} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleSave} autoFocus />
        </div>
    );

    const maxDate = new Date().toISOString().slice(0, 16); // Get current date and time in the required format

    return (
        <>
            <Toast ref={toast} />
            {isOpen && (
                <Dialog
                    visible={isOpen}
                    style={{ width: "500px" }}
                    header="Edit Work Entry"
                    modal
                    footer={dialogFooter}
                    onHide={() => {
                        onClose(); // Notify parent component about close
                    }}
                >

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem", 
                        marginTop: "1rem",
                    }}
                >
                    {/* Work Type */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="type" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                            Work Type
                        </label>
                                <Dropdown
                                id="type"
                                value={formData.work_type || ""}
                                options={workTypes} // Updated dropdown options
                                onChange={handleDropdownChange}
                                placeholder="Select a Work Type"
                                style={{ height: "3rem", fontSize: "1rem", borderRadius: "5px" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="dateTime" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                                Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                id="dateTime"
                                value={dateTime ? dateTime.toISOString().slice(0, 16) : ""} // Format for datetime-local
                                max={new Date().toISOString().slice(0, 16)} // Restrict to today or earlier
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value);
                                    if (newDate > new Date()) {
                                        showToast("error", "Invalid Date", "Date cannot be later than today.");
                                        setDateTime(""); // Reset the date-time input
                                    } else if (!isNaN(newDate)) {
                                        setDateTime(newDate);
                                    } else {
                                        showToast("error", "Invalid Date", "Please select a valid date and time.");
                                    }
                                }}
                                placeholder="Select Date & Time"
                                style={{
                                    height: "3rem",
                                    padding: "0.5rem",
                                    fontSize: "1rem",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="workTime" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                                Workload (Hours)
                            </label>
                            <InputNumber
                                id="workTime"
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
                                suffix=" hours"
                                style={{
                                    height: "3rem",
                                    fontSize: "1rem",
                                    borderRadius: "5px",
                                    flexShrink: 0,
                                }}
                                inputStyle={{ pointerEvents: "none" }} // Prevent manual typing
                                inputRef={(ref) => ref && (ref.readOnly = true)} // Programmatically make input read-only
                            />
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
}

export default EditWorkScreen;
