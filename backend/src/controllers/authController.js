const speakeasy = require("speakeasy");
const bcrypt = require("bcrypt");
const { query } = require("../config/database");
const { verifyToken, generateToken } = require("../utils/jwt");
const pool = require("../config/database"); // TODO
const { sendEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");
const { generateOtp, validateOtp, isOtpExpired } = require("../utils/otp");

exports.register = async (req, res) => {
  const {
      first_name,
      last_name,
      email,
      password,
      user_id,
      department,
      role,
      phone_number,
      crew_no,
      advisor_name,
      days
  } = req.body;

  try {
      // Email validation for Bilkent domain
      if (!email.endsWith("@ug.bilkent.edu.tr")) {
          return res.status(400).json({ message: "Email must be a valid Bilkent email." });
      }

      // Check if user already exists
      const userCheck = await query("SELECT * FROM users WHERE email = $1", [email]);
      if (userCheck.rows.length > 0) {
          return res.status(400).json({ message: "User already exists." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert into users table
      const userResult = await query(
          "INSERT INTO users (first_name, last_name, email, password, user_id, department, role, phone_number, crew_no) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
          [first_name, last_name, email, hashedPassword, user_id, department, role, phone_number, crew_no || null]
      );

      const newUserId = userResult.rows[0].id;

      // Additional logic based on the role
      if (role === "candidate guide") {
          // Get advisor details
          const advisor = await query("SELECT * FROM advisors WHERE full_name = $1", [advisor_name]);
          if (advisor.rows.length === 0) {
              return res.status(400).json({ message: "Advisor not found." });
          }

          const advisorId = advisor.rows[0].id;

          // Insert into candidate_guides table
          await query(
              "INSERT INTO candidate_guides (user_id, advisor_user_id, advisor_name, full_name, department) VALUES ($1, $2, $3, $4, $5)",
              [newUserId, advisorId, advisor_name, `${first_name} ${last_name}`, department]
          );

          // Increment candidate_guides count in advisors table
          await query("UPDATE advisors SET candidate_guide = candidate_guide + 1 WHERE id = $1", [advisorId]);

      } else if (role === "guide") {
          if (!crew_no) {
              return res.status(400).json({ message: "Crew number is required for guide role." });
          }

      } else if (role === "advisor") {
          if (!crew_no || !days) {
              return res.status(400).json({ message: "Crew number and days are required for advisor role." });
          }

          // Insert into advisors table
          await query(
              "INSERT INTO advisors (user_id, full_name, day) VALUES ($1, $2, $3)",
              [newUserId, `${first_name} ${last_name}`, days]
          );
      }

      res.status(200).json({
          success: true,
          message: "User registered successfully.",
          userId: newUserId
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = generateOtp();
    await query(
      "UPDATE users SET two_factor_secret = $1, reset_token_expires = NOW() + interval '5 minutes' WHERE id = $2",
      [otp, user.id]
    );

    await sendEmail({
      to: email,
      subject: "Your Login Verification Code",
      html: `
        <h1>Login Verification Code</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 24px; letter-spacing: 2px; background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });

    const token = generateToken(user.id, true);
    return res.json({
      message: "Login successful",
      token: token,
      user_type: user.user_type,
    });
  } catch (error) {
    console.log("Error in login function:", error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const tempToken = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = verifyToken(tempToken);

    if (!decoded.isTemp) {
      return res.status(401).json({ message: "Invalid token 1" });
    }

    const result = await query(
      "SELECT * FROM users WHERE id = $1 AND two_factor_secret = $2 AND reset_token_expires > NOW()",
      [decoded.userId, otp]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid or expired verification code" });
    }

    await query(
      "UPDATE users SET two_factor_secret = NULL, reset_token_expires = NULL WHERE id = $1",
      [decoded.userId]
    );

    const accessToken = generateToken(decoded.userId, false);

    res.json({
      message: "Verification successful",
      token: accessToken,
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json(err);
  }
};

exports.deleteUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await query(
      "DELETE FROM users WHERE email = $1 RETURNING id, email",
      [email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User deleted successfully",
      email: result.rows[0].email,
    });
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
    await query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedNewPassword,
      email,
    ]);

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

exports.getAllUsers = async (req, res) => {
  try {
    const result = await query("SELECT id, email FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await query(
      "UPDATE users SET reset_token = $1, reset_token_expires = NOW() + interval '1 hour' WHERE email = $2",
      [resetToken, email]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "BTO Core Password Reset Request",
      html: `
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>\n BTO Core Team</p>
        `,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Error requesting password reset" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token]
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2",
      [hashedPassword, token]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
