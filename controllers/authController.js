import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByUsername,
  findUserByEmail,
  findUserByMobile,
  addEmailOtp,
  findEmailOtp,
  addResetOtp,
  findResetOtp,
  addRefreshToken,
  findRefreshToken,
  db,
} from "../models/userModel.js";

import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/mailer.js";

export const signup = async (req, res) => {
  try {
    const { FirstName, LastName, username, email, password, Mobile_number } =
      req.body;

    // Username check
    const [existingUser] = await findUserByUsername(username);
    if (existingUser.length > 0)
      return res.status(400).json({ error: "Username already exists." });

    // Email check
    const [existingEmail] = await findUserByEmail(email);
    if (existingEmail.length > 0)
      return res.status(400).json({ error: "Email already exists." });

    // Mobile check
    const [existingMobile] = await findUserByMobile(Mobile_number);
    if (existingMobile.length > 0)
      return res.status(400).json({ error: "Mobile number already exists." });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert user
    await createUser([
      FirstName,
      LastName,
      username,
      email,
      hash,
      Mobile_number,
      false,
    ]);

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await findUserByUsername(username);
    if (rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { username: user.username, is_admin: user.is_admin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await addEmailOtp(email, otp, expires);
    await sendEmail(email, "Your OTP Code", `Your OTP: ${otp}`);

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: "Could not send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await findEmailOtp(email, otp);
    if (rows.length === 0)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "OTP verification failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await addResetOtp(email, otp, expires);
    await sendEmail(email, "Password Reset OTP", `Your OTP: ${otp}`);

    res.json({ message: "Reset OTP sent" });
  } catch (err) {
    res.status(500).json({ error: "Could not send OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const [rows] = await findResetOtp(email, otp);

    if (rows.length === 0)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const hash = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE users SET password_hash = ? WHERE email = ?", [
      hash,
      email,
    ]);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Could not reset password" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const [rows] = await findRefreshToken(refreshToken);

    if (rows.length === 0)
      return res.status(403).json({ error: "Invalid refresh token" });

    const { username } = rows[0];

    const newAccessToken = jwt.sign(
      { username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(500).json({ error: "Refresh failed" });
  }
};
