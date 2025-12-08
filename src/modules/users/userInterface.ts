import { userRole } from "../auth/authInterface";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: userRole;
  created_at: string;
  updated_at: string;
}
