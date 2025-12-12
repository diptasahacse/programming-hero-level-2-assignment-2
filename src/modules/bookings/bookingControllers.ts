import { Request, Response } from "express";
import bookingService from "./bookingServices";
import { IBookingCreatePayload } from "./bookingInterface";
import userService from "../users/userServices";
import vehicleService from "../vehicles/vehicleServices";
import { IVehicle } from "../vehicles/vehicleInterface";
import { JwtPayload } from "jsonwebtoken";
import { userRole } from "../auth/authInterface";
import { IUser } from "../users/userInterface";

const { create } = bookingService;
const { getUserById } = userService;
const { getById, update: updateVehicle } = vehicleService;

const validDate = (date: string) => {
  return isNaN(new Date(date).getDate()) === false;
};
const getFormattedDate = (date: string) => {
  return new Date(date).toISOString().split("T")[0];
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as JwtPayload;

    const { customer_id, rent_end_date, rent_start_date, vehicle_id } =
      (req.body || {}) as IBookingCreatePayload;

    // Validation
    if (typeof customer_id === "undefined") {
      return res.status(422).json({
        message: "customer_id is required",
        success: false,
      });
    }
    if (typeof rent_end_date === "undefined") {
      return res.status(422).json({
        message: "rent_end_date is required",
        success: false,
      });
    }
    if (typeof rent_start_date === "undefined") {
      return res.status(422).json({
        message: "rent_start_date is required",
        success: false,
      });
    }
    if (typeof vehicle_id === "undefined") {
      return res.status(422).json({
        message: "vehicle_id is required",
        success: false,
      });
    }

    //  Customer exist
    const user = (await getUserById(Number(customer_id))) as IUser | null;
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }
    if (reqUser.role !== userRole.ADMIN && user.email !== reqUser.email) {
      return res.status(403).json({
        message: "unauthorized",
        success: false,
      });
    }

    // Date validation
    if (!validDate(rent_start_date)) {
      return res.status(422).json({
        message: "invalid rent_start_date value",
        success: false,
      });
    }

    if (!validDate(rent_end_date)) {
      return res.status(422).json({
        message: "invalid rent_end_date value",
        success: false,
      });
    }

    const duration =
      (new Date(getFormattedDate(rent_end_date)).getTime() -
        new Date(getFormattedDate(rent_start_date)).getTime()) /
      86400000;
    if (duration <= 0) {
      return res.status(422).json({
        message:
          "rent_end_date value must be greater than rent_start_date value",
        success: false,
      });
    }

    //  Vehicle validate
    const vehicle = (await getById(Number(vehicle_id))) as IVehicle | null;
    if (!vehicle) {
      return res.status(404).json({
        message: "vehicle not found",
        success: false,
      });
    }

    if (vehicle?.availability_status === "booked") {
      return res.status(422).json({
        message: "vehicle already booked",
        success: false,
      });
    }

    const payload: IBookingCreatePayload = {
      customer_id,
      rent_end_date,
      rent_start_date,
      vehicle_id,
    };

    const result = await create(payload, vehicle?.daily_rent_price as number);
    if (!result) {
      return res.status(500).json({
        message: "Something went wrong. booking is not created",
        success: false,
      });
    }
    //  Update vehicle status
    const updateResult = await updateVehicle(vehicle as IVehicle, {
      availability_status: "booked",
    });
    if (!updateResult) {
      return res.status(500).json({
        message: "Something went wrong. vehicle is not updated",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking Create successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const bookingController = {
  createBooking,
};
export default bookingController;
