import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './GuideInfoTable.css'; 

const GuideInfoTable = ({ guides, loading }) => {
    
   const userType = parseInt(localStorage.getItem("userType"), 10);    console.log('User Type in Local Storage:', userType);
    //const userType = localStorage.getItem("userType")
    console.log('User Type in Local Storage:', userType); // Debug
    console.log('Guides Data:', guides);

    const renderScheduleLink = (rowData) => {
        if (rowData.schedule_url) {
            return (
                <a href={rowData.schedule_url} target="_blank" rel="noopener noreferrer">
                    <i className="pi pi-calendar" style={{ fontSize: '1.5rem', color: '#007bff', cursor: 'pointer' }}></i>
                </a>
            );
        }
        return 'N/A';
    };
    return (
        <div className="guide-info-table">
            <DataTable key={guides.length} value={guides} paginator rows={5} loading={loading} responsiveLayout="scroll">
                <Column
                    field="full_name"
                    header="Full Name"
                    body={(rowData) => `${rowData.first_name} ${rowData.last_name}`}
                    sortable
                    style={{ width: '25%' }}
                />
                <Column field="role" header="Role" sortable style={{ width: '10%' }} />
                <Column field="department" header="Department" sortable style={{ width: '10%' }} />
                <Column field="phone_number" header="Phone" style={{ width: '10%' }} />
                <Column field="schedule_url" header="View Schedule" body={renderScheduleLink} />
                {userType === 4 && (
                    <>
                        {console.log("Rendering IBAN and Crew No Columns")}
                        <Column field="iban" header="IBAN" sortable style={{ width: '10%' }} />
                        <Column field="crew_no" header="Crew No" sortable style={{ width: '10%' }} />
                    </>
                )}
            </DataTable>
        </div>
    );
};

export default GuideInfoTable;
