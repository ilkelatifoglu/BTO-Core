import ReadyToursTable from "../components/assignTour/TourTable"
import Sidebar from '../components/common/Sidebar'; 
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';
import { useLocation } from "react-router-dom";

function TourAssignmentPage() {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const location = useLocation();

    if (!isAuthorized) {
        return <Unauthorized from = {location}/>;
      }
    return(
        <> 
            <Sidebar />
            <ReadyToursTable/>
        </>
    );
}
export default TourAssignmentPage