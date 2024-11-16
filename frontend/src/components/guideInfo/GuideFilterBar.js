import React, { useState } from 'react';

const GuideFilterBar = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');

    const applyFilter = () => {
        onFilter({ name, role, department });
    };

    return (
        <div className="guide-filter-bar">
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Role</option>
                <option value="guide">Guide</option>
                <option value="candidate guide">Candidate Guide</option>
                <option value="advisor">Advisor</option>
                <option value="coordinator">Coordinator</option>
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">Department</option>
                <option value="CS">CS</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
            </select>
            <button onClick={applyFilter}>Apply</button>
        </div>
    );
};

export default GuideFilterBar;
