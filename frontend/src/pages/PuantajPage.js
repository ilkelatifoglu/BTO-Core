import React from "react";
import Sidebar from "../components/common/Sidebar";
import CheckboxRowSelectionDemo from "../components/puantajpage/DataTable";

function PuantajPage() {
    return (
        <div className="page-container">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="page-content">
                <CheckboxRowSelectionDemo />
            </div>
        </div>
    );
}

export default PuantajPage;
