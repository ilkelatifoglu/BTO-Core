import TourApprovalTable from "../components/approveTour/TourApprovalTable"
import Sidebar from '../components/common/Sidebar'; 
import "./TourApproval.css"; // Create a CSS file for additional styling, if necessary
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';

function TourApprovalPage() {
    const isAuthorized = useProtectRoute([3,4]); // Check authorization

    if (!isAuthorized) {
        return <Unauthorized />;
      }
    return (
        <div>
            <Sidebar />
            <TourApprovalTable />
        </div>
    );
}

export default TourApprovalPage;
