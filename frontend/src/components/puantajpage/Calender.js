import React from "react";
import { Calendar } from 'primereact/calendar';

function FormatDemo({ value, onChange }) {
    return (
        <div className="card flex justify-content-center">
            <Calendar
                value={value}
                onChange={(e) => onChange(e.value)}
                placeholder="Select a Date"
                dateFormat="yy/mm/dd"
            />
        </div>
    );
}
export default FormatDemo;
