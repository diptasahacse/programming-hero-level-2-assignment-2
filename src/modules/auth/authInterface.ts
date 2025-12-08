export type userRole = "customer" | "admin";

export interface IUserCreatePayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}
