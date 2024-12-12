import IndividualTourTable from "../components/individualTours/IndividualTourTable"
import Sidebar from '../components/common/Sidebar';
import '../components/common/CommonComp.css'; 

function IndividualTourPage() {
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