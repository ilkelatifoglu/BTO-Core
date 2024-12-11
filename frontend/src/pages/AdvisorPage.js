import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./AdvisorPage.css"; // CSS for the page
import Sidebar from "../components/common/Sidebar";
import { Toast } from "primereact/toast";

const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Weekend"];

const AdvisorPage = () => {
    const [advisors, setAdvisors] = useState([]);
    const [groupedAdvisors, setGroupedAdvisors] = useState(
        daysOptions.reduce((acc, day) => ({ ...acc, [day]: [] }), {}) // Initialize grouped advisors
    );
    const advisorRefs = useRef({});
    const toast = useRef(null);

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await axios.get("http://localhost:3001/advisors");
                const advisorsData = response.data;

                // Group advisors by their assigned days
                const grouped = daysOptions.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
                advisorsData.forEach((advisor) => {
                    advisor.days.forEach((day) => {
                        if (grouped[day]) grouped[day].push(advisor);
                    });
                });

                setAdvisors(advisorsData);
                setGroupedAdvisors(grouped);
                
                // Show success toast
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Advisors Loaded",
                        detail: "Advisors have been successfully fetched.",
                        life: 3000,
                    });
                }
            } catch (error) {
                console.error("Error fetching advisors:", error);
                // Show error toast
                if (toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Fetch Failed",
                        detail: `Failed to fetch advisors: ${error.message}`,
                        life: 5000,
                    });
                }
            }
        };

        fetchAdvisors();
    }, []);

    const scrollToAdvisor = (id) => {
        if (advisorRefs.current[id]) {
            advisorRefs.current[id].scrollIntoView({ behavior: "smooth" });
        }
    };

    const renderDayColumn = (day) => {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {groupedAdvisors[day]?.map((advisor) => (
                    <div
                        key={advisor.advisor_id}
                        className="advisor-button"
                        onClick={() => scrollToAdvisor(advisor.advisor_id)}
                        style={{
                            margin: "5px 0",
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "blue",
                        }}
                    >
                        {advisor.advisor_name}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Sidebar />
            {/* Toast component placed here */}
            <Toast ref={toast} />
            <div className="advisor-page-container">
                <h1 className="advisor-page-title">Advisor Schedule</h1>
                <DataTable
                    value={[{ key: "schedule" }]}
                    className="p-datatable-striped"
                    style={{ width: "80%", margin: "auto" }}
                >
                    {daysOptions.map((day, index) => (
                        <Column key={index} field={day} header={day} body={() => renderDayColumn(day)} />
                    ))}
                </DataTable>
                <div className="advisor-details-section">
                    {advisors.map((advisor) => (
                        <div
                            key={advisor.advisor_id}
                            ref={(el) => (advisorRefs.current[advisor.advisor_id] = el)}
                            className="advisor-card"
                        >
                            <h3 className="advisor-card-title">{advisor.advisor_name}</h3>
                            <p>
                                <strong>Days:</strong> {advisor.days.join(", ")}
                            </p>
                            <p>
                                <strong>Candidate Guides:</strong>
                                <ul className="advisor-guides-list">
                                    {advisor.candidate_guides.map((guide, index) => (
                                        <li key={index} className="advisor-guide-item">
                                            <strong>Name:</strong> {guide.full_name} <br />
                                            <strong>Department:</strong> {guide.department} <br />
                                            <strong>Phone:</strong> {guide.phone_number}
                                        </li>
                                    ))}
                                </ul>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdvisorPage;
