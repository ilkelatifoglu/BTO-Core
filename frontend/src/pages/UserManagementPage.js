import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagementPage.css"; // Include CSS for styling
import Sidebar from "../components/common/Sidebar";
import { MultiSelect } from "primereact/multiselect"; // Import MultiSelect component


const daysOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Weekend", value: "Weekend" },
];


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

    const handleDaysChange = (e) => {
        setFormData({ ...formData, days: e.value });
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
        if (formData.role === "advisor" && (!formData.days || formData.days.length === 0)) {
            alert("Advisor role requires selecting days.");
            return;
        }
        
        if (formData.role === "candidate guide" && !formData.advisor_name) {
            alert("Candidate guide role requires selecting an advisor.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/auth/register", {
              ...formData,
              days: formData.days, // Send days as an array
            });
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
                                    <option value="advisor">Advisor</option>
                                </select>
                            </div>
                            {formData.role === "advisor" && (
                                <div className="form-group">
                                    <label>Days:</label>
                                    <MultiSelect
                                        value={formData.days}
                                        options={daysOptions}
                                        onChange={handleDaysChange}
                                        placeholder="Select Days"
                                        display="chip"
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
