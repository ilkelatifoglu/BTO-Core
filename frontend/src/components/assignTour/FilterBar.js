import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import AssignTourService from "../../services/AssignTourService";
import "./FilterBar.css";
import "../common/CommonComp.css";

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    date: null,
    day: "",
    time: "",
    school: "",
    city: "",
    guide: "",
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeOptions = [
    { label: "09:00", value: "09:00" },
    { label: "11:00", value: "11:00" },
    { label: "13:30", value: "13:30" },
    { label: "16:00", value: "16:00" },
  ];

  const [cities, setCities] = useState([]);
  const [allSchools, setAllSchools] = useState([]); // Stores all schools for independent selection
  const [filteredSchools, setFilteredSchools] = useState([]); // Shows schools based on city or all

  useEffect(() => {
    const fetchCitiesAndSchools = async () => {
      try {
        const { cities, schools } = await AssignTourService.getDistinctSchoolsAndCities();
        
        // Sort cities and schools in ascending order
        const sortedCities = cities.sort((a, b) => a.localeCompare(b));
        const sortedSchools = schools.sort((a, b) => a.localeCompare(b));

        // Map to dropdown-compatible format
        setCities(sortedCities.map((city) => ({ label: city, value: city })));
        const schoolOptions = sortedSchools.map((school) => ({
          label: school,
          value: school,
        }));
        setAllSchools(schoolOptions);
        setFilteredSchools(schoolOptions); // Default to all schools
      } catch (error) {
        console.error("Error fetching cities and schools:", error);
      }
    };

    fetchCitiesAndSchools();
  }, []);

  useEffect(() => {
    if (filters.city) {
      const fetchSchoolsByCity = async () => {
        try {
          const { schools } = await AssignTourService.getDistinctSchoolsAndCities(filters.city);
          
          // Sort schools in ascending order
          const sortedSchools = schools.sort((a, b) => a.localeCompare(b));

          setFilteredSchools(
            sortedSchools.map((school) => ({ label: school, value: school }))
          );
        } catch (error) {
          console.error("Error fetching schools by city:", error);
        }
      };

      fetchSchoolsByCity();
    } else {
      setFilteredSchools(allSchools); // Show all schools if no city is selected
    }
  }, [filters.city, allSchools]);

    
  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      date: null,
      day: "",
      time: "",
      school: "",
      city: "",
      guide: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filter-bar-container">
      {/* Date Filter */}
      <div className="filter-row">
        <Calendar
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.value)}
          placeholder="Select Date"
          className="filter-input"
        />

        {/* Day Filter */}
        <Dropdown
          value={filters.day}
          options={daysOfWeek.map((day) => ({ label: day, value: day }))}
          onChange={(e) => handleFilterChange("day", e.value)}
          placeholder="Select Day"
          className="filter-input"
        />

        {/* Time Filter */}
        <Dropdown
          value={filters.time}
          options={timeOptions}
          onChange={(e) => handleFilterChange("time", e.value)}
          placeholder="Select Time"
          className="filter-input"
        />
      </div>
      {(localStorage.getItem("userType") === '3' || localStorage.getItem("userType") === '4' || localStorage.getItem("userType") === '2') && (
          
          <div className="filter-row">
          {/* Guide Filter */}
          <InputText
            value={filters.guide}
            onChange={(e) => handleFilterChange("guide", e.target.value)}
            placeholder="Enter Guide Name"
            className="filter-input"
          />
        </div>
      
      )}
      <div className="filter-row">
        <Dropdown
          value={filters.city}
          options={cities}
          onChange={(e) => handleFilterChange("city", e.value)}
          placeholder="Select City"
          className="filter-input"
        />
        <Dropdown
          value={filters.school}
          options={filteredSchools}
          onChange={(e) => handleFilterChange("school", e.value)}
          placeholder="Select School"
          className="filter-input"
        />
      </div>

      {/* Clear Filters Button */}
      
      <button className="button clearfilters-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
}
