import { Request, Response } from "express";
import userService from "./userServices";
import { IUser } from "./userInterface";
const { getUsers } = userService;
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

const userControllers = {
  getAllUsers,
};

export default userControllers;
