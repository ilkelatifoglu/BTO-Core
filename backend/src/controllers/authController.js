const bcrypt = require("bcrypt");
const { query } = require("../config/database");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
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
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "user registered successfully",
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

    // Log the result for debugging purposes
    console.log("Query result:", result);

    if (result.rows.length === 0) {
      // Email not found in the database
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = result.rows[0];

    // Log the user data for debugging
    console.log("User from DB:", user);

    // Direct comparison of passwords as plain strings
    if (password !== user.password) {
      // Email exists but password is incorrect
      return res.status(400).json({ message: "Password incorrect" });
    }

    // Both email and password are correct
    const token = generateToken(user.id);
    return res.json({ message: "Login successful", token });
  } catch (error) {
    // Log the error for better debugging
    console.error("Error in login function:", error);
    return res.status(500).json({ message: "server error" });
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
