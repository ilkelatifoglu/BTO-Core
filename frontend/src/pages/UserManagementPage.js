import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagementPage.css"; // Include CSS for styling
import Sidebar from "../components/common/Sidebar";

const UserManagementPage = () => {
    const [action, setAction] = useState("register"); // Default to "register"
    const [advisors, setAdvisors] = useState([]); // List of advisors
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        role: "",
        phone_number: "",
        crew_no: "",
        advisor_name: "",
        days: "",
    });
    const [additionalFields, setAdditionalFields] = useState([]); // For dynamic fields
    const [error, setError] = useState("");

    // Fetch advisors on component mount
    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await axios.get("http://localhost:3001/user-management/advisors");
                setAdvisors(response.data);
            } catch (error) {
                console.error("Error fetching advisors:", error);
            }
        };

        fetchAdvisors();
    }, []);

    const handleActionChange = (e) => {
        setAction(e.target.value);
        resetForm();
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setFormData({ ...formData, role });

        // Adjust additional fields based on the role
        if (role === "candidate guide") {
            setAdditionalFields(["advisor_name"]);
        } else if (role === "advisor") {
            setAdditionalFields(["days"]);
        } else {
            setAdditionalFields([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            department: "",
            role: "",
            phone_number: "",
            crew_no: "",
            advisor_name: "",
            days: "",
        });
        setAdditionalFields([]);
        setError("");
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Ensure required fields based on the role
        if (formData.role === "advisor" && !formData.days) {
            alert("Advisor role requires 'days'.");
            return;
        }
        if (formData.role === "candidate guide" && !formData.advisor_name) {
            alert("Candidate guide role requires selecting an advisor.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/auth/register", formData);
            alert(response.data.message);
            resetForm(); // Clear form after successful submission
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.response?.data?.message || "An error occurred while registering.");
        }
    };

    return (
        <div>
            <Sidebar />
            <div className="user-management-page">
                <h1>User Management</h1>
                <div className="action-selector">
                    <label htmlFor="action">Select Action:</label>
                    <select id="action" value={action} onChange={handleActionChange}>
                        <option value="">-- Select --</option>
                        <option value="register">Register User</option>
                        <option value="remove">Remove User</option>
                        <option value="change">Change User Status</option>
                        <option value="updateCrewNo">Update Crew Number</option>
                    </select>
                </div>

                {action === "register" && (
                    <div className="form-container">
                        <h2>Register New User</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department:</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role:</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleRoleChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="candidate guide">Candidate Guide</option>
                                    <option value="guide">Guide</option>
                                    <option value="advisor">Advisor</option>
                                </select>
                            </div>
                            {additionalFields.includes("advisor_name") && (
                                <div className="form-group">
                                    <label>Advisor Name:</label>
                                    <select
                                        name="advisor_name"
                                        value={formData.advisor_name}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Advisor</option>
                                        {advisors.map((advisor) => (
                                            <option key={advisor.user_id} value={advisor.full_name}>
                                                {advisor.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {additionalFields.includes("days") && (
                                <div className="form-group">
                                    <label>Days:</label>
                                    <input
                                        type="text"
                                        name="days"
                                        value={formData.days}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            <button type="submit">Register</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
