import { IUserCreatePayload } from "./authInterface";
import db from "../../db";
import bcryptjs from "bcryptjs";
import config from "../../config";
import { IUser } from "../users/userInterface";

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

const register = async (data: IUserCreatePayload): Promise<IUser | null> => {
  const { email, name, password, phone } = data;
  const hashedPassword = bcryptjs.hashSync(password, config.hash_salt);
  try {
    const result = await db.pool.query(
      `
        INSERT INTO users(name, email, password, phone)
        VALUES($1, $2, $3, $4)
        `,
      [name, email, hashedPassword, phone]
    );
    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const authService = {
  register,
  getUserById,
  getUserByEmail,
};
export default authService;
