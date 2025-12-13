import { Request, Response } from "express";
import {
  IVehicle,
  IVehiclePayload,
  IVehicleUpdateBody,
  VehicleStatus,
  VehicleType,
} from "./vehicleInterface";
import vehicleService from "./vehicleServices";
import { sendResponse } from "../../helpers/sendResponse";

const {
  create: createVehicle,
  getByRegistrationNumber,
  getVehicles,
  getById,
  update,
  deleteVehicle,
} = vehicleService;

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
      return sendResponse(res, 400, {
        message: "registration_number is required",
        success: false,
      });
    }
    const exist = await getByRegistrationNumber(registration_number);
    if (exist) {
      return sendResponse(res, 400, {
        message: "registration_number is already register",
        success: false,
      });
    }

    if (!availability_status) {
      return sendResponse(res, 400, {
        message: "availability_status is required",
        success: false,
      });
    }
    if (!Object.values(VehicleStatus).includes(availability_status)) {
      return sendResponse(res, 400, {
        message: `availability_status must be from ${Object.values(
          VehicleStatus
        ).join(", ")}`,
        success: false,
      });
    }
    if (typeof Number(daily_rent_price) !== "number") {
      return sendResponse(res, 400, {
        message: "daily_rent_price is required",
        success: false,
      });
    }
    if (Number(daily_rent_price) < 0) {
      return sendResponse(res, 400, {
        message: "daily_rent_price must be a positive number",
        success: false,
      });
    }

    if (!type) {
      return sendResponse(res, 400, {
        message: "type is required",
        success: false,
      });
    }

    if (!Object.values(VehicleType).includes(type)) {
      return sendResponse(res, 400, {
        message: `type must be from ${Object.values(VehicleType).join(", ")}`,
        success: false,
      });
    }
    if (!vehicle_name) {
      return sendResponse(res, 400, {
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
      return sendResponse(res, 500, {
        message: "Something went wrong. vehicle is not created",
        success: false,
      });
    }
    const { created_at, updated_at, ...rest } = result;
    sendResponse(res, 200, {
      success: true,
      message: "Vehicle created successfully",
      data: rest,
    });
  } catch (error: any) {
    return sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const vehicles = ((await getVehicles()) as IVehicle[]).map((item) => {
      return {
        id: item.id,
        availability_status: item.availability_status,
        daily_rent_price: item.daily_rent_price,
        registration_number: item.registration_number,
        type: item.type,
        vehicle_name: item.vehicle_name,
      };
    });
    sendResponse(res, 200, {
      success: true,
      message:
        vehicles.length > 0
          ? "Vehicles retrieved successfully"
          : "No vehicles found",
      data: vehicles,
    });
  } catch (error: any) {
    return sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params || {};
    const vehicle = (await getById(Number(vehicleId))) as IVehicle | null;

    if (!vehicle) {
      return sendResponse(res, 404, {
        success: false,
        message: "Vehicle not found",
        data: null,
      });
    }

    const { created_at, updated_at, ...rest } = vehicle;

    sendResponse(res, 200, {
      success: true,
      message: "Vehicle retrieved successfully",
      data: rest,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const updateVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params || {};
    const vehicle = (await getById(Number(vehicleId))) as IVehicle | null;

    if (!vehicle) {
      return sendResponse(res, 404, {
        success: false,
        message: "Vehicle not found",
        data: null,
      });
    }
    const {
      availability_status,
      daily_rent_price,
      registration_number,
      type,
      vehicle_name,
    } = (req.body || {}) as IVehicleUpdateBody;

    if (
      typeof availability_status === "undefined" &&
      typeof daily_rent_price === "undefined" &&
      typeof registration_number === "undefined" &&
      typeof type === "undefined" &&
      typeof vehicle_name === "undefined"
    ) {
      return sendResponse(res, 400, {
        success: false,
        message: "fields are missing..",
      });
    }

    if (type && !Object.values(VehicleType).includes(type)) {
      return sendResponse(res, 400, {
        success: false,
        message: `Invalid type. allowed types are ${Object.values(
          VehicleType
        ).join(",")}`,
      });
    }

    if (typeof daily_rent_price !== "undefined") {
      if (isNaN(Number(daily_rent_price))) {
        return sendResponse(res, 400, {
          success: false,
          message: `Invalid daily_rent_price. it should be positive number`,
        });
      }

      if (Number(daily_rent_price) < 0) {
        return sendResponse(res, 400, {
          success: false,
          message: `Invalid daily_rent_price. it should be positive number`,
        });
      }
    }

    if (
      availability_status &&
      !Object.values(VehicleStatus).includes(availability_status)
    ) {
      return sendResponse(res, 400, {
        message: `Invalid availability_status. allowed types are ${Object.values(
          VehicleStatus
        ).join(",")}`,
        success: false,
      });
    }

    if (
      typeof registration_number !== "undefined" &&
      vehicle.registration_number !== registration_number
    ) {
      const exist = await getByRegistrationNumber(registration_number);
      if (exist) {
        return sendResponse(res, 400, {
          success: false,
          message: `registration_number already used..`,
        });
      }
    }
    const payload: IVehicleUpdateBody = {
      availability_status,
      daily_rent_price,
      registration_number,
      type,
      vehicle_name,
    };

    const result = (await update(vehicle, payload)) as IVehicle | null;

    if (!result) {
      return sendResponse(res, 500, {
        message: "vehicle not updated",
        success: true,
        data: null,
      });
    }

    const { created_at, updated_at, ...rest } = result;

    sendResponse(res, 200, {
      success: true,
      message: "Vehicle updated successfully",
      data: rest,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params || {};
    const vehicle = (await getById(Number(vehicleId))) as IVehicle | null;

    if (!vehicle) {
      return sendResponse(res, 404, {
        success: false,
        message: "Vehicle not found",
        data: null,
      });
    }
    if (vehicle.availability_status === VehicleStatus.BOOKED) {
      return sendResponse(res, 400, {
        success: false,
        message: "Status with booked vehicle can not be delete",
      });
    }

    const result = await deleteVehicle(vehicle.id);
    if (!result) {
      return sendResponse(res, 500, {
        success: true,
        message: "Vehicle not deleted",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const vehicleController = {
  create,
  get,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
export default vehicleController;
