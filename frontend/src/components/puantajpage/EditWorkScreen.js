import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { editWorkEntry } from "../../services/WorkService";

function EditWorkScreen({ isOpen, onClose, workData, onSave }) {
    const [formData, setFormData] = useState({});
    const [workHours, setWorkHours] = useState("");
    const [workMinutes, setWorkMinutes] = useState("");
    const [dateTime, setDateTime] = useState("");
    const toast = useRef(null);

    useEffect(() => {
        if (workData) {
            setFormData({ ...workData });
            setWorkHours(Math.floor(workData.workload / 60));
            setWorkMinutes(workData.workload % 60);
            setDateTime(`${workData.date}T${workData.time}`);
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

    const showToast = (severity, summary, detail) => {
        if (toast.current) {
            toast.current.clear();
            toast.current.show({ severity, summary, detail, life: 3000 });
        }
    };

    const handleSave = async () => {
        if (!dateTime || (!workHours && !workMinutes)) {
            showToast("error", "Error", "Please fill all required fields!");
            return;
        }

        if (workHours < 0 || workHours > 10 || workMinutes < 0 || workMinutes > 59) {
            showToast("error", "Error", "Work hours cannot exceed 10, minutes cannot exceed 59, and neither can be negative.");
            return;
        }

        const [date, time] = dateTime.split("T");
        const workload = (parseInt(workHours, 10) || 0) * 60 + (parseInt(workMinutes, 10) || 0);

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

    const now = new Date().toISOString().slice(0, 16);

    // Even if not open, we still render Toast so it's always mounted
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
                        setFormData({});
                        setWorkHours("");
                        setWorkMinutes("");
                        setDateTime("");
                        onClose();
                    }}
                >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="type">Work Type</label>
                            <Dropdown
                                id="type"
                                value={formData.type || ""}
                                options={workTypes}
                                onChange={handleDropdownChange}
                                placeholder="Select a Work Type"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="dateTime">Date & Time</label>
                            <input
                                type="datetime-local"
                                id="dateTime"
                                value={dateTime}
                                max={now}
                                onChange={(e) => setDateTime(e.target.value)}
                                style={{
                                    padding: "0.5rem",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    width: "100%",
                                }}
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="workHours">Workload (Hours:Minutes)</label>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <input
                                    type="number"
                                    id="workHours"
                                    value={workHours}
                                    onChange={(e) => setWorkHours(Math.max(0, Math.min(10, e.target.value)))}
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
                                    onChange={(e) => setWorkMinutes(Math.max(0, Math.min(59, e.target.value)))}
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
            )}
        </>
    );
}

export default EditWorkScreen;
