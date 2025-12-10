import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import userService from "./userServices";
import { IUser } from "./userInterface";
const { getUsers, getUserById, getUserByEmail } = userService;
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
    const { id } = req.params || {};
    const bodyUser: JwtPayload = (req.user || {});


    if (!bodyUser) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (bodyUser.role !== "admin") {
      const user = await getUserByEmail(bodyUser.email);
      if (!user) {
        return res.status(403).json({
          message: "Unauthorized",
          success: false,
        });
      }
    }

    const user = (await getUserById(Number(id))) as IUser | undefined;

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

const userControllers = {
  getAllUsers,
  userById,
};

export default userControllers;
