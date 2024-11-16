import React from "react";
import { Dropdown } from 'primereact/dropdown';

function GenericDropdown({ value, onChange, options, optionLabel, placeholder = "Select an option" }) {
    return (
        <div className="card flex justify-content-center">
            <Dropdown
                value={value}
                onChange={(e) => onChange(e.value)}
                options={options}
                optionLabel={optionLabel}
                placeholder={placeholder}
                className="w-full md:w-14rem"
            />
        </div>
    );
}
export default GenericDropdown;
