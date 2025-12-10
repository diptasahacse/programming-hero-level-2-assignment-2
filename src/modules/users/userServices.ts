import db from "../../db";

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
};
export default userService;
