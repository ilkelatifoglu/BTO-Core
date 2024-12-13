import TourApprovalTable from "../components/approveTour/TourApprovalTable"
import Sidebar from '../components/common/Sidebar'; 
import "./TourApproval.css"; // Create a CSS file for additional styling, if necessary
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';
import { useLocation } from "react-router-dom";

function TourApprovalPage() {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const location = useLocation();

    if (!isAuthorized) {
        return <Unauthorized from={location}/>;
      }
    return (
        <div>
            <Sidebar />
            <TourApprovalTable />
        </div>
    );
}

export default TourApprovalPage;
