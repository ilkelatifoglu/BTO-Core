import TourApprovalTable from "../components/approveTour/TourApprovalTable"
import Sidebar from '../components/common/Sidebar'; 
import "./TourApproval.css"; // Create a CSS file for additional styling, if necessary

function TourApprovalPage() {
    return (
        <div>
            <Sidebar />
            <TourApprovalTable />
        </div>
    );
}

export default TourApprovalPage;
