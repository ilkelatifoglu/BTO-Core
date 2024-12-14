import ReadyToursTable from "../components/assignTour/TourTable"
import Sidebar from '../components/common/Sidebar'; 
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';

function TourAssignmentPage() {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization

    if (!isAuthorized) {
        return <Unauthorized/>;
      }
    return(
        <> 
            <Sidebar />
            <ReadyToursTable/>
        </>
    );
}
export default TourAssignmentPage