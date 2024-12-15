import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "./FilterBar.css";

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    date: null,
    type: "",
    name: "",
    status: ""
  });

  const statusOptions = [
    { label: "Approved", value: "Approved" },
    { label: "Pending", value: "Pending" },
  ];

  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = { date: null, type: "", name: "", status: "" };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="filter-bar-container">
      <Calendar
        value={filters.date}
        onChange={(e) => handleFilterChange("date", e.value)}
        placeholder="Select Date"
        className="filter-input"
        dateFormat="dd/mm/yy"
      />

      <InputText
        value={filters.type}
        onChange={(e) => handleFilterChange("type", e.target.value)}
        placeholder="Type"
        className="filter-input"
      />

      <InputText
        value={filters.name}
        onChange={(e) => handleFilterChange("name", e.target.value)}
        placeholder="Name"
        className="filter-input"
      />

      <Dropdown
        value={filters.status}
        options={statusOptions}
        onChange={(e) => handleFilterChange("status", e.value)}
        placeholder="Select Status"
        className="filter-input"
      />

      <button className="clearfilters-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
}
