import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import userService from "./userServices";
import { IUser, IUserUpdatePayload } from "./userInterface";
import { userRole } from "../auth/authInterface";
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
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
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
        return res.status(403).json({
          message: "Unauthorized",
          success: false,
        });
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, created_at, updated_at, ...rest } = user;

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: rest,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const bodyUser: JwtPayload = req.user || {};

    const { userId } = req.params || {};
    const user = (await getUserById(Number(userId))) as IUser | null;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    // Customer can only update this own account except role
    if (bodyUser.role !== userRole.ADMIN && user.email !== bodyUser.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { email, name, phone, role } = (req.body || {}) as IUserUpdatePayload;

    if (
      typeof email === "undefined" &&
      typeof name === "undefined" &&
      typeof phone === "undefined" &&
      typeof role === "undefined"
    ) {
      return res.status(422).json({
        success: false,
        message: "fields are missing..",
      });
    }

    if (role && !Object.values(userRole).includes(role)) {
      return res.status(422).json({
        success: false,
        message: `Invalid role. allowed roles are ${Object.values(
          userRole
        ).join(",")}`,
      });
    }

    // Customer can not update role
    if (bodyUser.role !== userRole.ADMIN && user.email === bodyUser.email) {
      if (role === userRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: "As a customer you can not change your role to admin.",
        });
      }
    }


    if (typeof email !== "undefined" && user.email !== email) {
      const exist = await getUserByEmail(email);
      if (exist) {
        return res.status(422).json({
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
      return res.status(500).json({
        success: true,
        message: "user not updated",
        data: null,
      });
    }

    const { created_at, updated_at, password, ...rest } = result;

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: rest,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const userControllers = {
  getAllUsers,
  userById,
  updateUserById,
};

export default userControllers;
