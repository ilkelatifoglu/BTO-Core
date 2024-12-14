import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./FilterBar.css";

export default function FilterBar({ onFilterChange }) {
    const [filters, setFilters] = useState({
        date: null,
        organization: "",
        status: null,
    });

    const statusOptions = [
        { label: "Approved", value: "APPROVED" },
        { label: "Cancelled", value: "CANCELLED" },
    ];

    const handleInputChange = (field, value) => {
        const updatedFilters = { ...filters, [field]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters); // Notify parent component
    };

    const clearFilters = () => {
        const clearedFilters = {
            date: null,
            organization: "",
            status: null,
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters); // Reset filters in parent
    };

    return (
        <div className="filter-bar">
            {/* Date Filter */}
            <Calendar
                value={filters.date}
                onChange={(e) => handleInputChange("date", e.value)}
                placeholder="Select Date"
                className="filter-input"
            />

            {/* Organization Name Filter */}
            <InputText
                value={filters.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                placeholder="Organization Name"
                className="filter-input"
            />

            {/* Status Filter */}
            <Dropdown
                value={filters.status}
                options={statusOptions}
                onChange={(e) => handleInputChange("status", e.value)}
                placeholder="Select Status"
                className="filter-input"
            />

            {/* Clear Button */}
            <Button
                label="Clear Filters"
                onClick={clearFilters}
                className="p-button-secondary clear-filters-button"
            />
        </div>
    );
}
