import { getAllUsers } from "../models/userModel.js";

export const listUsers = async (req, res) => {
  const [rows] = await getAllUsers();
  res.json(rows);
};
