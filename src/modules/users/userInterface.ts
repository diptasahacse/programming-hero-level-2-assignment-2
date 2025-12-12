import { userRole } from "../auth/authInterface";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: (typeof userRole)[keyof typeof userRole];
  created_at: string;
  updated_at: string;
}
export interface IUserUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: (typeof userRole)[keyof typeof userRole];
}
