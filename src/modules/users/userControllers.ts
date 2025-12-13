import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import userService from "./userServices";
import { IUser, IUserUpdatePayload } from "./userInterface";
import { userRole } from "../auth/authInterface";
import { sendResponse } from "../../helpers/sendResponse";
const { getUsers, getUserById, getUserByEmail, update } = userService;
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = ((await getUsers()) as IUser[]).map((item) => {
      return {
        name: item.name,
        email: item.email,
        id: item.id,
        phone: item.phone,
        role: item.role,
      };
    });
    sendResponse(res, 200, {
      success: true,
      message:
        users.length > 0 ? "Users retrieved successfully" : "No users found",
      data: users,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};
const userById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params || {};
    const bodyUser: JwtPayload = req.user || {};
    const user = (await getUserById(Number(userId))) as IUser | null;
    if (bodyUser.role !== "admin") {
      if (user && user.email !== bodyUser.email) {
        return sendResponse(res, 403, {
          message: "Unauthorized",
          success: false,
        });
      }
    }

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const { password, created_at, updated_at, ...rest } = user;

    sendResponse(res, 200, {
      success: true,
      message: "Users retrieved successfully",
      data: rest,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const bodyUser: JwtPayload = req.user || {};

    const { userId } = req.params || {};
    const user = (await getUserById(Number(userId))) as IUser | null;

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Customer can only update this own account except role
    if (bodyUser.role !== userRole.ADMIN && user.email !== bodyUser.email) {
      return sendResponse(res, 403, {
        success: false,
        message: "Unauthorized. You can not update this user",
      });
    }

    const { email, name, phone, role } = (req.body || {}) as IUserUpdatePayload;

    if (
      typeof email === "undefined" &&
      typeof name === "undefined" &&
      typeof phone === "undefined" &&
      typeof role === "undefined"
    ) {
      return sendResponse(res, 400, {
        success: false,
        message: "fields are missing..",
      });
    }

    if (role && !Object.values(userRole).includes(role)) {
      return sendResponse(res, 400, {
        success: false,
        message: `Invalid role. allowed roles are ${Object.values(
          userRole
        ).join(",")}`,
      });
    }

    // Customer can not update role
    if (bodyUser.role !== userRole.ADMIN && user.email === bodyUser.email) {
      if (role === userRole.ADMIN) {
        return sendResponse(res, 403, {
          success: false,
          message: "As a customer you can not change your role to admin.",
        });
      }
    }

    if (typeof email !== "undefined" && user.email !== email) {
      const exist = await getUserByEmail(email);
      if (exist) {
        return sendResponse(res, 400, {
          success: false,
          message: `email already used..`,
        });
      }
    }
    const payload: IUserUpdatePayload = {
      email,
      name,
      phone,
      role,
    };

    const result = (await update(user, payload)) as IUser | null;

    if (!result) {
      return sendResponse(res, 500, {
        message: "User not updated",
        success: false,
        data: null,
      });
    }

    const { created_at, updated_at, password, ...rest } = result;

    sendResponse(res, 200, {
      success: true,
      message: "User updated successfully",
      data: rest,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const userControllers = {
  getAllUsers,
  userById,
  updateUserById,
};

export default userControllers;
