import { Response } from "express";
export interface IResponseData<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}
export const sendResponse = <T>(
  res: Response,
  code: 200 | 201 | 400 | 401 | 403 | 404 | 500,
  data: IResponseData<T>
) => {
  const responseData: IResponseData<T> = {
    success: data.success,
    message: data.message,
  };
  if (typeof data.errors !== "undefined") {
    responseData.errors = data.errors;
  }
  if (typeof data.data !== "undefined") {
    responseData.data = data.data;
  }
  res.status(code).json(responseData);
};


