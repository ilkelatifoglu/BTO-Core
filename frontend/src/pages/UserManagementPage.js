import React, { useState } from "react";
import axios from "axios";
import "./UserManagementPage.css"; // Include CSS for styling

const UserManagementPage = () => {
    const [action, setAction] = useState(""); // Selected action
    const [formData, setFormData] = useState({
       // user_id: "",
        full_name: "", // Combined First and Last Name
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

    const handleActionChange = (e) => {
        setAction(e.target.value);
        setFormData({
           // user_id: "",
            full_name: "",
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

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setFormData({ ...formData, role });

        // Adjust additional fields based on the role
        if (role === "candidate guide") {
            setAdditionalFields(["advisor_name"]);
        } else if (role === "guide") {
            setAdditionalFields([]);
        } else if (role === "advisor") {
            setAdditionalFields(["days"]);
        } else {
            setAdditionalFields([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure required fields based on the role
        if (formData.role === "advisor" && (!formData.days)) {
            alert("Advisor role requires 'days'.");
            return;
        }
        if (formData.role === "candidate guide" && !formData.advisor_name) {
            alert("Candidate guide role requires 'advisor_name'.");
            return;
        }
    
        try {
            // Prepare the request payload to match backend expectations
            const requestData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
               // user_id: formData.user_id,
                department: formData.department,
                role: formData.role,
                phone_number: formData.phone_number,
                crew_no: formData.crew_no || null, // Send null if not provided
                advisor_name: formData.advisor_name || null, // Send null if not provided
                days: formData.days || null, // Send null if not provided
            };
    
            // Make API call
            const response = await axios.post("http://localhost:3001/auth/register", requestData);
            alert(response.data.message);
        } catch (error) {
            console.error("Error during registration:", error);
    
            // Display backend error message, if available
            alert(error.response?.data?.message || "An error occurred while registering.");
        }
    };
    
    const handleRemoveSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/user-management/remove", {
                email: formData.email,
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred while removing the user.");
        }
    };
    

    const handleChangeStatusSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/user-management/changeRole", {
                email: formData.email,
                new_role: formData.role,
                days: formData.role === "advisor" ? formData.days : undefined,
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred while changing the user status.");
        }
    };

    const handleUpdateCrewNoSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/user-management/updateCrewNo", {
                email: formData.email,
                crew_no: formData.crew_no,
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred while updating the crew number.");
        }
    };
    

    return (
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
                    <input
                        type="text"
                        name="advisor_name"
                        value={formData.advisor_name}
                        onChange={handleChange}
                        required
                    />
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
            {additionalFields.includes("crew_no") && (
                <div className="form-group">
                    <label>Crew No:</label>
                    <input
                        type="text"
                        name="crew_no"
                        value={formData.crew_no}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}
            <button type="submit">Register</button>
        </form>
    </div>
            )}

            {action === "remove" && (
                <div className="form-container">
                    <h2>Remove User</h2>
                    <form onSubmit={handleRemoveSubmit}>
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
                        <button type="submit">Remove User</button>
                    </form>
                </div>
            )}

            {action === "change" && (
                <div className="form-container">
                    <h2>Change User Status</h2>
                    <form onSubmit={handleChangeStatusSubmit}>
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
                            <label>New Role:</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleRoleChange}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="guide">Guide</option>
                                <option value="advisor">Advisor</option>
                            </select>
                        </div>
                        {formData.role === "advisor" && (
                            <div className="form-group">
                                <label>Days:</label>
                                <input
                                    type="text"
                                    name="days"
                                    value={formData.days}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <button type="submit">Change Status</button>
                    </form>
                </div>
            )}

            {action === "updateCrewNo" && (
                <div className="form-container">
                    <h2>Update Crew Number</h2>
                    <form onSubmit={handleUpdateCrewNoSubmit}>
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
                            <label>Crew No:</label>
                            <input
                                type="text"
                                name="crew_no"
                                value={formData.crew_no}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Update Crew No</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;