const bcrypt = require("bcrypt");
const { query } = require("../config/database");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  console.log(req.body);
  const { username, email, password, user_type } = req.body;
  try {
    const userCheck = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     const result = await query(
      "INSERT INTO users (email, password, user_type) VALUES ($1, $2, $3) RETURNING id",
      [email, hashedPassword, user_type] // Include user_type in the parameter array
    );

    res.status(201).json({
      message: `user registered successfully, usertype of: ${user_type}`,
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = result.rows[0]; // Get the user record from the query result

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    const token = generateToken(user.id); // Generate a token for the authenticated user
    return res.json({ 
      message: "Login successful", 
      token, 
      user_type: user.user_type  // Add user_type to the response
    });
  } catch (error) {
    console.error("Error in login function:", error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await query("DELETE FROM users WHERE email = $1 RETURNING id, email", [email]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully", email: result.rows[0].email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "New passwords do not match" });
  }

  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    await query("UPDATE users SET password = $1 WHERE email = $2", [hashedNewPassword, email]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const result = await query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};
