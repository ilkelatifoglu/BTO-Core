import React, { useState, useRef, useEffect } from "react";
import "./GuideFilterBar.css";

const GuideFilterBar = ({ onFilter }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  const roleDropdownRef = useRef(null);
  const departmentDropdownRef = useRef(null);

  const roles = ["Guide", "Advisor", "Coordinator"];
  const departments = [
    "American Culture and Literature",
    "Archaeology",
    "Architecture",
    "Art",
    "Biochemistry and Molecular Biology",
    "Business Administration",
    "Chemical Engineering",
    "Computer Science",
    "Design and Communication",
    "Department of Electrical Engineering",
    "Education Sciences",
    "English Language and Literature",
    "English Translation and Interpretation",
    "French Translation and Interpretation",
    "Graphic Design",
    "History",
    "Industrial Engineering",
    "Law",
    "Machine Engineering",
    "Mathematics",
    "Music",
    "Music and Performing Arts",
    "Philosophy",
    "Physics",
    "Political Science and Public Administration",
    "Psychology",
    "Social Sciences and Economy",
    "Teaching",
    "Urban Design",
  ];

  const applyFilter = () => {
    onFilter({ name, role, department });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target)
      ) {
        setRoleDropdownOpen(false);
      }
      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target)
      ) {
        setDepartmentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole === "Default" ? "" : selectedRole); // Reset to default if "Default" is selected
    setRoleDropdownOpen(false);
  };

  const handleSelectDepartment = (selectedDepartment) => {
    setDepartment(selectedDepartment === "Default" ? "" : selectedDepartment); // Reset to default if "Default" is selected
    setDepartmentDropdownOpen(false);
  };

  return (
    <div className="guide-filter-bar">
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Custom Role Dropdown */}
      <div className="custom-dropdown" ref={roleDropdownRef}>
        <button
          className={`dropdown-button ${isRoleDropdownOpen ? "active" : ""}`}
          onClick={() => setRoleDropdownOpen(!isRoleDropdownOpen)}
        >
          {role || "Select Role"}
        </button>
        {isRoleDropdownOpen && (
          <ul className="dropdown-menu">
            <li
              key="default"
              onClick={() => handleSelectRole("Default")}
              className="dropdown-item"
            >
              Select Role
            </li>
            {roles.map((roleOption) => (
              <li
                key={roleOption}
                onClick={() => handleSelectRole(roleOption)}
                className="dropdown-item"
              >
                {roleOption}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Custom Department Dropdown */}
      <div className="custom-dropdown" ref={departmentDropdownRef}>
        <button
          className={`dropdown-button ${
            isDepartmentDropdownOpen ? "active" : ""
          }`}
          onClick={() => setDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
        >
          {department || "Choose Department"}
        </button>
        {isDepartmentDropdownOpen && (
          <ul className="dropdown-menu">
            <li
              key="default"
              onClick={() => handleSelectDepartment("Default")}
              className="dropdown-item"
            >
              Choose Department
            </li>
            {departments.map((dept) => (
              <li
                key={dept}
                onClick={() => handleSelectDepartment(dept)}
                className="dropdown-item"
              >
                {dept}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={applyFilter}>Apply</button>
    </div>
  );
};

export default GuideFilterBar;