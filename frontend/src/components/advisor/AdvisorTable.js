import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AdvisorTable = () => {
    const [advisors, setAdvisors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdvisors();
    }, []);

    const fetchAdvisors = async () => {
        try {
            const response = await axios.get("http://localhost:3001/advisors");
            setAdvisors(response.data);
        } catch (error) {
            console.error("Error fetching advisors:", error);
        }
    };

    return (
        <div>
            <h1>Advisor Table</h1>
            <DataTable value={advisors} responsiveLayout="scroll" loading={loading}>
                <Column field="full_name" header="Advisor Name"></Column>
                <Column field="day" header="Day"></Column>
                <Column
                    header="Candidate Guides"
                    body={(rowData) => (
                        <ul>
                            {rowData.candidateGuides?.map((guide, index) => (
                                <li key={index}>{guide.full_name}</li>
                            ))}
                        </ul>
                    )}
                ></Column>
            </DataTable>
        </div>
    );
};

export default AdvisorTable;
