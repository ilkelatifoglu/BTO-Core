import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import './GuideInfoTable.css';
import '../common/CommonComp.css';
import { fetchGuideSchedule } from '../../services/guideInfoService';

const GuideInfoTable = ({ guides, loading }) => {
    const [downloading, setDownloading] = useState({});
    const userType = parseInt(localStorage.getItem("userType"), 10); // Retrieve user type from localStorage
    const toast = useRef(null); // Reference to Toast component

    const downloadSchedule = async (rowData) => {
        if (downloading[rowData.id]) return; // Prevent multiple clicks

        // Clear existing toasts and show "Downloading..." toast after 250ms
        toast.current.clear();
        setTimeout(() => {
            toast.current.show({
                severity: 'info',
                summary: 'Downloading',
                detail: `Downloading schedule for ${rowData.first_name} ${rowData.last_name}...`,
                life: 3000,
            });
        }, 250);

        setDownloading((prev) => ({ ...prev, [rowData.id]: true }));

        try {
            const scheduleData = await fetchGuideSchedule(rowData.id);

            if (scheduleData && scheduleData.schedule_data) {
                const linkSource = `data:image/jpeg;base64,${scheduleData.schedule_data}`;
                const downloadLink = document.createElement('a');
                const fileName = `${rowData.first_name}_${rowData.last_name}_Schedule.jpg`;

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();

                // Clear existing toasts and show success toast after 250ms
                toast.current.clear();
                setTimeout(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Schedule for ${rowData.first_name} ${rowData.last_name} downloaded successfully.`,
                        life: 3000,
                    });
                }, 250);
            } else {
                // Clear existing toasts and show error toast after 250ms
                toast.current.clear();
                setTimeout(() => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `No schedule available for ${rowData.first_name} ${rowData.last_name}.`,
                        life: 3000,
                    });
                }, 250);
            }
        } catch (error) {
            // Clear existing toasts and show error toast after 250ms
            toast.current.clear();
            setTimeout(() => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Download Failed',
                    detail: `Failed to download schedule for ${rowData.first_name} ${rowData.last_name}: ${error.message}`,
                    life: 3000,
                });
            }, 250);
        } finally {
            setDownloading((prev) => ({ ...prev, [rowData.id]: false }));
        }
    };

    const renderDownloadButton = (rowData) => {
        if (userType === 3 || userType === 4) {
            return (
                <button
                    onClick={() => downloadSchedule(rowData)}
                    className="p-button p-component p-button-text p-button-plain"
                >
                    {downloading[rowData.id] ? 'Downloading...' : 'Download Schedule'}
                </button>
            );
        }
        // Return an empty fragment for other user types
        return null;
    };

    return (
        <div className="guide-info-table">
            <Toast ref={toast} /> {/* Added Toast component */}
            <DataTable
                value={guides}
                paginator
                rows={5}
                loading={loading}
                responsiveLayout="scroll"
                className="p-datatable-striped"
                tableStyle={{ width: "100%" }}
            >
                <Column
                    field="full_name"
                    header="Full Name"
                    body={(rowData) => `${rowData.first_name} ${rowData.last_name}`}
                    sortable
                    style={{ width: '10%' }}
                />
                <Column field="role" header="Role" sortable style={{ width: '10%' }} />
                <Column field="department" header="Department" sortable style={{ width: '10%' }} />
                <Column field="phone_number" header="Phone" style={{ width: '10%' }} />
                {(userType === 4) && (
                    <Column field="iban" header="IBAN" style={{ width: '10%' }} /> 
                )}
                {(userType === 4) && (
                    <Column field="crew_no" header="Crew Number" style={{ width: '10%' }} /> 
                )}
                {(userType === 3 || userType === 4) && (
                    <Column
                        header="Download Schedule"
                        body={renderDownloadButton}
                        style={{ width: '10%' }}
                    />
                )}
            </DataTable>
        </div>
    );
};

export default GuideInfoTable;
