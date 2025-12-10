import db from "../../db";
import { IUser } from "./userInterface";

const getUserById = async (id: number) => {
  try {
    const result = await db.pool.query(
      `
            SELECT * FROM users WHERE id=$1
            `,
      [id]
    );
    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const result = await db.pool.query(
      `
            SELECT * FROM users WHERE email=$1
            `,
      [email]
    );
    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getUsers = async () => {
  try {
    const results = await db.pool.query(`SELECT * FROM users`);
    return results.rows;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const userService = {
  getUsers,
  getUserById,
  getUserByEmail
};
export default userService;
