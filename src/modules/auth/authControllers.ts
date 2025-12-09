import { Request, Response } from "express";
import { IUserCreatePayload, IUserSignInPayload } from "./authInterface";
import authService from "./authServices";

const { register: registerUser, getUserByEmail, signin: login } = authService;

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password, phone } = (req.body ||
      {}) as IUserCreatePayload;
    // For Missing data
    if (!email) {
      return res.status(422).json({
        message: "email is required",
      });
    }
    if (!name) {
      return res.status(422).json({
        message: "name is required",
      });
    }
    if (!password) {
      return res.status(422).json({
        message: "password is required",
      });
    }
    if (!phone) {
      return res.status(422).json({
        message: "phone is required",
      });
    }
    // For requirement validation
    const lowerCaseEmail = email
      .split("")
      .every((item) => item === item.toLowerCase());
    if (!lowerCaseEmail) {
      return res.status(400).json({
        message: "email should be lowercase",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be min 6 chat length",
      });
    }
    // check email is already exist or not
    const userExist = await getUserByEmail(email);
    if (userExist) {
      return res.status(400).json({
        message: "email already registered",
      });
    }

    const payload: IUserCreatePayload = {
      email,
      name,
      password,
      phone,
    };
    const user = await registerUser(payload);
    if (user) {
      const { password: _, ...rest } = user;
      return res.status(201).json({
        message: "Registration success",
        data: rest,
      });
    }

    return res.status(500).json({
      message: "Registration failed",
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body || {}) as IUserSignInPayload;
    // Validation
    if (!email) {
      return res.status(422).json({
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(422).json({
        message: "password is required",
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        message: "email or password are incorrect",
      });
    }

    const result = await login(
      {
        email,
        password,
      },
      user
    );
    if (!result) {
      return res.status(404).json({
        message: "email or password are incorrect",
      });
    }
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const authController = {
  register,
  signin
};
export default authController;
