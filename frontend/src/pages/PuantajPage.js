import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import AdminWorkTable from "../components/puantajpage/AdminWorkTable";
import UserWorkTable from "../components/puantajpage/UserWorkTable";
import '../components/common/CommonComp.css';
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';

function PuantajPage() {
    const isAuthorized = useProtectRoute([2,3,4]); // Check authorization
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        // Retrieve userType from localStorage or other state management
        const storedUserType = parseInt(localStorage.getItem("userType"), 10);
        setUserType(storedUserType);
    }, []);

    if (!isAuthorized) {
        return <Unauthorized />;
      }

    return (
        <div >
            <Sidebar />
            <div >
                {userType === 4 ? <AdminWorkTable /> : <UserWorkTable />}
                <div className="submit-button-container">
                  
                </div>
            </div>
        </div>
    );
}

export default PuantajPage;
