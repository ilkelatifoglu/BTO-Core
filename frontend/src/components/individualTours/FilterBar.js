import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import "./FilterBar.css";

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    tourStatus: "",
    date: null,
    major: "",
    guide: ""
  });

  const statusOptions = [
    { label: "All", value: "" },
    { label: "READY", value: "READY" },
    { label: "WAITING", value: "WAITING" },
    { label: "APPROVED", value: "APPROVED" },
    { label: "CANCELLED", value: "CANCELLED" },
    { label: "REJECTED", value: "REJECTED" },
    { label: "DONE", value: "DONE" }
  ];


  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      tourStatus: "",
      date: null,
      major: "",
      guide: ""
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="filter-bar-container">
      {/* Tour Status */}
      <Dropdown
        value={filters.tourStatus}
        options={statusOptions}
        onChange={(e) => handleFilterChange("tourStatus", e.value)}
        placeholder="Tour Status"
        className="filter-input"
      />

      {/* Date Filter */}
      <Calendar
        value={filters.date}
        onChange={(e) => handleFilterChange("date", e.value)}
        placeholder="Select Date"
        className="filter-input"
        dateFormat="dd/mm/yy"
      />

      {/* Major of Interest */}
      <InputText
        value={filters.major}
        onChange={(e) => handleFilterChange("major", e.target.value)}
        placeholder="Major of Interest"
        className="filter-input"
      />

      {/* Guide Name */}
      <InputText
        value={filters.guide}
        onChange={(e) => handleFilterChange("guide", e.target.value)}
        placeholder="Guide Name"
        className="filter-input"
      />

      <button className="clearfilters-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
}
