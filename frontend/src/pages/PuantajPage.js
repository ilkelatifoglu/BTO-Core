import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import AdminWorkTable from "../components/puantajpage/AdminWorkTable";
import UserWorkTable from "../components/puantajpage/UserWorkTable";

function PuantajPage() {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        // Retrieve userType from localStorage or other state management
        const storedUserType = parseInt(localStorage.getItem("userType"), 10);
        setUserType(storedUserType);
    }, []);

    return (
        <div className="page-container">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="page-content">
                {userType === 4 ? <AdminWorkTable /> : <UserWorkTable />}
            </div>
        </div>
    );
}

export default PuantajPage;
