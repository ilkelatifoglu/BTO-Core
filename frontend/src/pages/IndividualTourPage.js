import IndividualTourTable from "../components/individualTours/IndividualTourTable"
import Sidebar from '../components/common/Sidebar';
import '../components/common/CommonComp.css'; 
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';
import { useLocation } from "react-router-dom";

function IndividualTourPage() {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const location = useLocation();
    if (!isAuthorized) {
        return <Unauthorized from={location}/>;
      }
    return (
        <div className="page-container">
            <Sidebar />
            <div className="page-content">
                <h1>Individual Tours</h1>
                <IndividualTourTable />
            </div>
        </div>
    );
}
export default IndividualTourPage