const UserModel = require("../models/UserModel");
const { query } = require("../config/database");

class UserRepository {
  async createUser(userData) {
    const user = await UserModel.create(userData);
    return user.id;
  }

  async findUserByEmail(email) {
    return await UserModel.findByEmail(email);
  }

  async deleteUserByEmail(email) {
    return await UserModel.deleteByEmail(email);
  }

  async updateUserPassword(email, hashedPassword) {
    const user = await UserModel.findByEmail(email);
    if (user) {
      await user.updatePassword(hashedPassword);
    }
  }

  async getAllUsers() {
    const result = await query("SELECT id, email, first_name, last_name FROM users");
    return result.rows.map((row) => new UserModel(row));
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async updateResetToken(email, resetToken) {
    const user = await UserModel.findByEmail(email);
    if (user) {
      await user.updateResetToken(resetToken);
    }
  }

  async findUserByResetToken(token) {
    return await UserModel.findByResetToken(token);
  }

  async resetPassword(token, hashedPassword) {
    const user = await UserModel.findByResetToken(token);
    if (user) {
      await user.resetPassword(hashedPassword);
    }
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
    if (advisor.rows[0]) {
      return advisor.rows[0];
    }
    return null;
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
