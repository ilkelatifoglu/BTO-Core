import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import "./FilterBar.css";

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    date: null,
    schoolOrIndividual: "",
    name: "",
    sender: "",
    city: "" 
  });

  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      date: null,
      schoolOrIndividual: "",
      name: "",
      sender: "",
      city: "" 
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="filter-bar-container">
      {/* Date Filter */}
      <Calendar
        value={filters.date}
        onChange={(e) => handleFilterChange("date", e.value)}
        placeholder="Select Date"
        className="filter-input"
        dateFormat="dd/mm/yy"
      />

      {/* School/Individual Filter */}
      <InputText
        value={filters.schoolOrIndividual}
        onChange={(e) => handleFilterChange("schoolOrIndividual", e.target.value)}
        placeholder="School/Individual"
        className="filter-input"
      />

      {/* Name Filter (Tagged Guides/Candidates) */}
      <InputText
        value={filters.name}
        onChange={(e) => handleFilterChange("name", e.target.value)}
        placeholder="Name (Guide/Candidate)"
        className="filter-input"
      />

      {/* Sender Filter */}
      <InputText
        value={filters.sender}
        onChange={(e) => handleFilterChange("sender", e.target.value)}
        placeholder="Sender"
        className="filter-input"
      />
      {/* City Filter */}
      <InputText
        value={filters.city}
        onChange={(e) => handleFilterChange("city", e.target.value)}
        placeholder="City"
        className="filter-input"
      />

      <button className="button clearfilters-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
}
