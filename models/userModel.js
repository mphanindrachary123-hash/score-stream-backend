import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create User
export const createUser = async (data) => {
  return db.execute(
    `INSERT INTO users 
        (first_name, last_name, username, email, password_hash, mobile_number, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
    data,
  );
};

export const findUserByUsername = async (username) => {
  return db.execute("SELECT * FROM users WHERE username = ?", [username]);
};

export const getAllUsers = async () => {
  return db.execute("SELECT username, email, mobile_number FROM users");
};

export const findUserByEmail = async (email) => {
  return db.execute("SELECT * FROM users WHERE email = ?", [email]);
};

export const findUserByMobile = async (mobile) => {
  return db.execute("SELECT * FROM users WHERE mobile = ?", [mobile]);
};

// Email verification OTP
export const addEmailOtp = async (email, otp, expires) => {
  return db.execute(
    "INSERT INTO email_verifications (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expires],
  );
};

export const findEmailOtp = async (email, otp) => {
  return db.execute(
    "SELECT * FROM email_verifications WHERE email = ? AND otp = ? AND expires_at > NOW()",
    [email, otp],
  );
};

// Password reset OTP
export const addResetOtp = async (email, otp, expires) => {
  return db.execute(
    "INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expires],
  );
};

export const findResetOtp = async (email, otp) => {
  return db.execute(
    "SELECT * FROM password_resets WHERE email = ? AND otp = ? AND expires_at > NOW()",
    [email, otp],
  );
};

// Refresh Token
export const addRefreshToken = async (username, token, expiry) => {
  return db.execute(
    "INSERT INTO refresh_tokens (username, token, expires_at) VALUES (?, ?, ?)",
    [username, token, expiry],
  );
};

export const findRefreshToken = async (token) => {
  return db.execute(
    "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()",
    [token],
  );
};
