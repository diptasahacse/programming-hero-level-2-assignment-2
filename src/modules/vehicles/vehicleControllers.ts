import { Request, Response } from "express";
import {
  IVehiclePayload,
  VehicleStatus,
  VehicleType,
} from "./vehicleInterface";
import vehicleService from "./vehicleServices";

const { create: createVehicle, getByRegistrationNumber } = vehicleService;

const create = async (req: Request, res: Response) => {
  try {
    const {
      availability_status,
      daily_rent_price,
      registration_number,
      type,
      vehicle_name,
    } = (req.body || {}) as IVehiclePayload;
    // Validation
    if (!registration_number) {
      return res.status(422).json({
        message: "registration_number is required",
        success: false,
      });
    }
    const exist = await getByRegistrationNumber(registration_number);
    if (exist) {
      return res.status(422).json({
        message: "registration_number is already register",
        success: false,
      });
    }

    if (!availability_status) {
      return res.status(422).json({
        message: "availability_status is required",
        success: false,
      });
    }
    if (!Object.values(VehicleStatus).includes(availability_status)) {
      return res.status(422).json({
        message: `availability_status must be from ${Object.values(
          VehicleStatus
        ).join(", ")}`,
        success: false,
      });
    }
    if (typeof Number(daily_rent_price) !== "number") {
      return res.status(422).json({
        message: "daily_rent_price is required",
        success: false,
      });
    }
    if (Number(daily_rent_price) < 0) {
      return res.status(422).json({
        message: "daily_rent_price must be a positive number",
        success: false,
      });
    }

    if (!type) {
      return res.status(422).json({
        message: "type is required",
        success: false,
      });
    }

    if (!Object.values(VehicleType).includes(type)) {
      return res.status(422).json({
        message: `type must be from ${Object.values(VehicleType).join(", ")}`,
        success: false,
      });
    }
    if (!vehicle_name) {
      return res.status(422).json({
        message: "vehicle_name is required",
        success: false,
      });
    }

    const result = await createVehicle({
      availability_status,
      daily_rent_price,
      registration_number,
      type,
      vehicle_name,
    });
    if (!result) {
      return res.status(500).json({
        message: "Something went wrong. vehicle is not created",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "Create successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const vehicleController = {
  create,
};
export default vehicleController;
