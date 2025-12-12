export const userRole = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export interface IUserCreatePayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}
export interface IUserSignInPayload {
  email: string;
  password: string;
}

export interface IUserSigninPayload {
  email: string;
  password: string;
}

export interface IUserSigninResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: typeof userRole[keyof typeof userRole];
  };
}
