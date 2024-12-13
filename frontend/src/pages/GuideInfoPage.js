
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from "../components/common/Sidebar";
import GuideFilterBar from '../components/guideInfo/GuideFilterBar';
import GuideInfoTable from '../components/guideInfo/GuideInfoTable';
import { fetchGuideInfo } from '../services/guideInfoService';
import './GuideInfoPage.css';
import { Toast } from "primereact/toast"; 
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';
import { useLocation } from "react-router-dom";

const GuideInfoPage = () => {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const location = useLocation();
    const [guides, setGuides] = useState([]);
    const [filters, setFilters] = useState({ name: '', role: '', department: '' });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null); 

    const handleFilter = (filter) => {
        setFilters((prev) => ({ ...prev, ...filter }));
    };

    useEffect(() => {
        const loadGuides = async () => {
            setLoading(true);
            try {
                const data = await fetchGuideInfo(filters);
                setGuides(data);
                
                if (toast.current) {
                    toast.current.clear();
                    toast.current.show({
                        severity: "success",
                        summary: "Data Loaded",
                        detail: "Guide information has been successfully fetched.",
                        life: 3000
                    });
                }

            } catch (error) {
                console.error(error);
                if (toast.current) {
                    toast.current.clear();
                    toast.current.show({
                        severity: "error",
                        summary: "Fetch Failed",
                        detail: `Failed to fetch guide information: ${error.message}`,
                        life: 5000
                    });
                }
            }
            setLoading(false);
        };
        loadGuides();
    }, [filters]);

    if (!isAuthorized) {
        return <Unauthorized from={location}/>;
      }
    return (
        <div className="page-container">
            <Sidebar />
            <Toast ref={toast} />
            <div className="page-content">
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Guide Information</h1>
                <GuideFilterBar onFilter={handleFilter} />
                <GuideInfoTable guides={guides} loading={loading} />
            </div>
        </div>
    );
};

export default GuideInfoPage;
