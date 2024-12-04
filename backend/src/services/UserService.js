const bcrypt = require("bcrypt");
const { query } = require("../config/database");

class UserService {
  async createUser({
    first_name,
    last_name,
    email,
    department,
    role,
    phone_number,
    crew_no,
    advisor_name,
    days,
  }) {
    const originalPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(originalPassword, 10);

    const roleToUserType = {
      // TODO
      "candidate guide": 1,
      guide: 2,
      advisor: 3,
      coordinator: 4,
    };

    const userType = roleToUserType[role];

    const newUser = await query(
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

    await this._handleRoleSpecificLogic(newUser.rows[0].id, role, {
      first_name,
      last_name,
      department,
      advisor_name,
      days,
    });

    return { userId: newUser.rows[0].id, password: originalPassword };
  }

  async findUserByEmail(email) {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  }

  async deleteUser(email) {
    const result = await query(
      "DELETE FROM users WHERE email = $1 RETURNING id, email",
      [email]
    );
    return result.rows[0];
  }

  async updateUserPassword(email, newHashedPassword) {
    await query("UPDATE users SET password = $1 WHERE email = $2", [
      newHashedPassword,
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

  async _handleRoleSpecificLogic(userId, role, userData) {
    if (role === "advisor") {
      await this._createAdvisor(userId, userData);
    } else if (role === "candidate guide") {
      await this._createCandidateGuide(userId, userData);
    }
  }

  async _createAdvisor(userId, { first_name, last_name, days }) {
    await query(
      `INSERT INTO advisors (user_id, full_name, day, candidate_guides_count, created_at, updated_at) 
       VALUES ($1, $2, $3, 0, NOW(), NOW())`,
      [userId, `${first_name} ${last_name}`, days]
    );
  }

  async _createCandidateGuide(
    userId,
    { first_name, last_name, department, advisor_name }
  ) {
    const advisor = await query(`SELECT * FROM advisors WHERE full_name = $1`, [
      advisor_name,
    ]);
    if (!advisor.rows[0]) throw new Error("Advisor not found");

    const advisorUserId = advisor.rows[0].user_id;
    await query(
      `INSERT INTO candidate_guides (user_id, advisor_user_id, advisor_name, full_name, department, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        userId,
        advisorUserId,
        advisor_name,
        `${first_name} ${last_name}`,
        department,
      ]
    );

    await query(
      `UPDATE advisors SET candidate_guides_count = candidate_guides_count + 1 WHERE user_id = $1`,
      [advisorUserId]
    );
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

module.exports = new UserService();
