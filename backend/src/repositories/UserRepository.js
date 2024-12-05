const { query } = require("../config/database");

class UserRepository {
  async createUser(userData) {
    const {
      first_name,
      last_name,
      email,
      hashedPassword,
      department,
      role,
      phone_number,
      crew_no,
      userType,
    } = userData;
    const result = await query(
      `INSERT INTO users (first_name, last_name, email, password, department, role, phone_number, crew_no, user_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        department,
        role,
        phone_number,
        crew_no || null,
        userType,
      ]
    );
    return result.rows[0].id;
  }

  async findUserByEmail(email) {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  }

  async deleteUserByEmail(email) {
    const result = await query(
      "DELETE FROM users WHERE email = $1 RETURNING id, email",
      [email]
    );
    return result.rows[0];
  }

  async updateUserPassword(email, hashedPassword) {
    await query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);
  }

  async getAllUsers() {
    const result = await query("SELECT id, email FROM users");
    return result.rows;
  }

  async getUserById(id) {
    const result = await query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  async updateResetToken(email, resetToken) {
    await query(
      "UPDATE users SET reset_token = $1, reset_token_expires = NOW() + interval '1 hour' WHERE email = $2",
      [resetToken, email]
    );
  }

  async findUserByResetToken(token) {
    const result = await query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token]
    );
    return result.rows[0];
  }

  async resetPassword(token, hashedPassword) {
    await query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2",
      [hashedPassword, token]
    );
  }

  async createAdvisor(userId, fullName, days) {
    await query(
      `INSERT INTO advisors (user_id, full_name, day, candidate_guides_count, created_at, updated_at) 
       VALUES ($1, $2, $3, 0, NOW(), NOW())`,
      [userId, fullName, days]
    );
  }

  async findAdvisorByName(advisorName) {
    const advisor = await query(`SELECT * FROM advisors WHERE full_name = $1`, [
      advisorName,
    ]);
    return advisor.rows[0];
  }

  async createCandidateGuide(
    userId,
    advisorUserId,
    advisorName,
    fullName,
    department
  ) {
    await query(
      `INSERT INTO candidate_guides (user_id, advisor_user_id, advisor_name, full_name, department, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [userId, advisorUserId, advisorName, fullName, department]
    );
  }

  async updateAdvisorCandidateGuidesCount(advisorUserId) {
    await query(
      `UPDATE advisors SET candidate_guides_count = candidate_guides_count + 1 WHERE user_id = $1`,
      [advisorUserId]
    );
  }
}

module.exports = new UserRepository();
