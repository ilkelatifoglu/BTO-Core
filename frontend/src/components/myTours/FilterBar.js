import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import "./FilterBar.css";

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    date: null,
    event: "",
    type: "",
    time: ""
  });

  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      date: null,
      event: "",
      type: "",
      time: ""
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

      {/* Event Filter */}
      <InputText
        value={filters.event}
        onChange={(e) => handleFilterChange("event", e.target.value)}
        placeholder="Event"
        className="filter-input"
      />

      {/* Type Filter */}
      <InputText
        value={filters.type}
        onChange={(e) => handleFilterChange("type", e.target.value)}
        placeholder="Type"
        className="filter-input"
      />

      {/* Time Filter */}
      <InputText
        value={filters.time}
        onChange={(e) => handleFilterChange("time", e.target.value)}
        placeholder="Time"
        className="filter-input"
      />

      <button className="clearfilters-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
}
