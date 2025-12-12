import db from "../../db";
import { IUser, IUserUpdatePayload } from "./userInterface";

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
const update = async (item: IUser, data: IUserUpdatePayload) => {
  const { email, name, phone, role } = data;
  const emailData =
    typeof email === "undefined"
      ? item.email
      : email;

  const phoneData =
    typeof phone === "undefined"
      ? item.phone
      : phone;

  const roleData =
    typeof role === "undefined"
      ? item.role
      : role;

  const nameData =
    typeof name === "undefined" ? item.name : name;

  try {
    const result = await db.pool.query(
      `
      UPDATE users
      SET email = $1,
          name = $2,
          phone = $3,
          role = $4,
          updated_at = NOW()
      WHERE id = $5 RETURNING *
      `,
      [
        emailData,
        nameData,
        phoneData,
        roleData,
        item.id,
      ]
    );

    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const deleteUser = async (id: number) => {
  try {
    const result = await db.pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id]
    );

    if ((result.rowCount || 0) > 0) {
      return true;
    }

    return false;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const userService = {
  getUsers,
  getUserById,
  getUserByEmail,
  update,
  deleteUser
};
export default userService;
