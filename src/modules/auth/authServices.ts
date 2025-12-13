import {
  IUserCreatePayload,
  IUserSigninPayload,
  IUserSigninResponse,
} from "./authInterface";
import db from "../../db";
import bcryptjs from "bcryptjs";
import config from "../../config";
import { IUser } from "../users/userInterface";
import jwt from "jsonwebtoken";
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
  const { email, name, password, phone, role } = data;
  const salt = await bcryptjs.genSalt(Number(config.hash_salt));
  const hashedPassword = bcryptjs.hashSync(password, salt);
  try {
    const result = await db.pool.query(
      `
        INSERT INTO users(name, email, password, phone, role)
        VALUES($1, $2, $3, $4, $5) RETURNING *
        `,
      [name, email, hashedPassword, phone, role]
    );
    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const signin = async (
  data: IUserSigninPayload,
  user: IUser
): Promise<IUserSigninResponse | null> => {
  const { email, password } = data;
  const {
    password: hashPassword,
    email: userEmail,
    id,
    role,
    name,
    phone,
  } = user;

  try {
    //  Check password
    const compare = await bcryptjs.compare(password, hashPassword);
    if (!compare) {
      return null;
    }

    const payload = {
      email: userEmail,
      id: id,
      role: role,
    };

    const token = jwt.sign(payload, config.jwt_secret, {
      expiresIn: "2 days",
    });

    return {
      token: token,
      user: {
        email,
        id,
        name,
        phone,
        role,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const authService = {
  register,
  signin,
  getUserById,
  getUserByEmail,
};
export default authService;
