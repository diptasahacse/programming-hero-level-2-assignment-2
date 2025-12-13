import { Request, Response } from "express";
import { IUserCreatePayload, IUserSignInPayload, userRole } from "./authInterface";
import authService from "./authServices";
import { sendResponse } from "../../helpers/sendResponse";

const { register: registerUser, getUserByEmail, signin: login } = authService;

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password, phone,role } = (req.body ||
      {}) as IUserCreatePayload;
    // For Missing data
    if (!email) {
      return sendResponse(res, 400, {
        message: "email is required",
        success: false,
      });
    }
    if (!name) {
      return sendResponse(res, 400, {
        message: "name is required",
        success: false,
      });
    }
    if (!password) {
      return sendResponse(res, 400, {
        message: "password is required",
        success: false,
      });
    }
    if (!phone) {
      return sendResponse(res, 400, {
        message: "phone is required",
        success: false,
      });
    }
    if (!role) {
      return sendResponse(res, 400, {
        message: "role is required",
        success: false,
      });
    }
    if (!Object.values(userRole).includes(role)) {
      return sendResponse(res, 400, {
        message: `Invalid role. allowed roles are ${Object.values(userRole).join(", ")}`,
        success: false,
      });
    }
    // For requirement validation
    const lowerCaseEmail = email
      .split("")
      .every((item) => item === item.toLowerCase());
    if (!lowerCaseEmail) {
      return sendResponse(res, 400, {
        message: "email should be lowercase",
        success: false,
      });
    }
    if (password.length < 6) {
      return sendResponse(res, 400, {
        message: "password must be min 6 chat length",
        success: false,
      });
    }
    // check email is already exist or not
    const userExist = await getUserByEmail(email);
    if (userExist) {
      return sendResponse(res, 400, {
        message: "email already registered",
        success: false,
      });
    }

    const payload: IUserCreatePayload = {
      email,
      name,
      password,
      phone,
      role
    };
    const user = await registerUser(payload);
    if (user) {
      const { password: _, created_at, updated_at, ...rest } = user;
      return sendResponse(res, 201, {
        success: true,
        message: "User registered successfully",
        data: rest,
      });
    }

    return sendResponse(res, 500, {
      success: false,
      message: "Registration failed",
    });
  } catch (error: any) {
    return sendResponse(res, 500, {
      success: false,
      message: error.message || "Internal server error",
      errors: error,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body || {}) as IUserSignInPayload;
    // Validation
    if (!email) {
      return sendResponse(res, 400, {
        message: "email is required",
        success: false,
      });
      
    }
    if (!password) {
      return sendResponse(res, 400, {
        message: "password is required",
        success: false,
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return sendResponse(res, 404, {
        message: "email or password are incorrect",
        success: false,
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
      return sendResponse(res, 404, {
        message: "email or password are incorrect",
        success: false,
      });
    }
    sendResponse(res, 200, {
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const authController = {
  register,
  signin,
};
export default authController;
