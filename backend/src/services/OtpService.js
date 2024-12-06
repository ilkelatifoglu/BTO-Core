const { query } = require("../config/database");
const { generateOtp } = require("../utils/otp");

class OTPService {
  async generateAndSaveOTP(userId) {
    const otp = generateOtp();

    await query(
      "UPDATE users SET two_factor_secret = $1, reset_token_expires = NOW() + interval '5 minutes' WHERE id = $2",
      [otp, userId]
    );

    return otp;
  }

  async verifyOTP(userId, otp) {
    const result = await query(
      "SELECT * FROM users WHERE id = $1 AND two_factor_secret = $2 AND reset_token_expires > NOW()",
      [userId, otp]
    );

    if (result.rows.length === 0) {
      return false;
    }

    await this.clearOTP(userId);
    return true;
  }

  async clearOTP(userId) {
    await query(
      "UPDATE users SET two_factor_secret = NULL, reset_token_expires = NULL WHERE id = $1",
      [userId]
    );
  }
}

module.exports = new OTPService();
