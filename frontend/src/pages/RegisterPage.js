import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_id: "",
        department: "",
        role: "",
        phone_number: "",
        crew_no: "",
        advisor_name: "",
        days: ""
    });

    const [additionalFields, setAdditionalFields] = useState([]);

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setFormData({ ...formData, role });

        if (role === "candidate guide") {
            setAdditionalFields(["advisor_name"]);
        } else if (role === "guide") {
            setAdditionalFields(["crew_no"]);
        } else if (role === "advisor") {
            setAdditionalFields(["crew_no", "days"]);
        } else {
            setAdditionalFields([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/register", formData);
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h1>Register New User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>User ID:</label>
                    <input
                        type="text"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleRoleChange} required>
                        <option value="">Select Role</option>
                        <option value="candidate guide">Candidate Guide</option>
                        <option value="guide">Guide</option>
                        <option value="advisor">Advisor</option>
                    </select>
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                {additionalFields.includes("advisor_name") && (
                    <div>
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
                {additionalFields.includes("crew_no") && (
                    <div>
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
                {additionalFields.includes("days") && (
                    <div>
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
    );
};

export default RegisterPage;
