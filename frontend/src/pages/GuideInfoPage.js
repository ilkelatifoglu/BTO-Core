import React, { useState, useEffect } from 'react';
import Sidebar from "../components/common/Sidebar";
import GuideFilterBar from '../components/guideInfo/GuideFilterBar';
import GuideInfoTable from '../components/guideInfo/GuideInfoTable';
import { fetchGuideInfo } from '../services/guideInfoService';

const GuideInfoPage = () => {
    const [guides, setGuides] = useState([]);
    const [filters, setFilters] = useState({ name: '', role: '', department: '' });
    const [loading, setLoading] = useState(false);

    const handleFilter = (filter) => {
        setFilters((prev) => ({ ...prev, ...filter }));
    };

    useEffect(() => {
        const loadGuides = async () => {
            setLoading(true);
            try {
                const data = await fetchGuideInfo(filters);
                setGuides(data); // Ensure this includes `schedule_url`.
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        loadGuides();
    }, [filters]);

    return (
        <div className="page-container">
            <Sidebar />
            <div className="page-content">
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Guide Information</h1>
                <GuideFilterBar onFilter={handleFilter} />
                <GuideInfoTable guides={guides} loading={loading} />
            </div>
        </div>
    );
};

export default GuideInfoPage;
