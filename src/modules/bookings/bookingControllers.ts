import { Request, Response } from "express";
import bookingService from "./bookingServices";
import {
  BookingStatus,
  IBookingCreatePayload,
  IBookingResponse,
  IBookingUpdateResponse,
} from "./bookingInterface";
import userService from "../users/userServices";
import vehicleService from "../vehicles/vehicleServices";
import { IVehicle } from "../vehicles/vehicleInterface";
import { JwtPayload } from "jsonwebtoken";
import { userRole } from "../auth/authInterface";
import { IUser } from "../users/userInterface";
import { sendResponse } from "../../helpers/sendResponse";

const {
  create,
  getBookings,
  getBookingsByCustomerId,
  getBookingById,
  update,
  getFormattedDate,
} = bookingService;
const { getUserById } = userService;
const { getById, update: updateVehicle } = vehicleService;

const validDate = (date: string) => {
  return isNaN(new Date(date).getDate()) === false;
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as JwtPayload;

    const { customer_id, rent_end_date, rent_start_date, vehicle_id } =
      (req.body || {}) as IBookingCreatePayload;

    // Validation
    if (typeof customer_id === "undefined") {
      return sendResponse(res, 400, {
        message: "customer_id is required",
        success: false,
      });
    }
    if (typeof rent_end_date === "undefined") {
      return sendResponse(res, 400, {
        message: "rent_end_date is required",
        success: false,
      });
    }
    if (typeof rent_start_date === "undefined") {
      return sendResponse(res, 400, {
        message: "rent_start_date is required",
        success: false,
      });
    }
    if (typeof vehicle_id === "undefined") {
      return sendResponse(res, 400, {
        message: "vehicle_id is required",
        success: false,
      });
    }

    //  Customer exist
    const user = (await getUserById(Number(customer_id))) as IUser | null;
    if (!user) {
      return sendResponse(res, 404, {
        message: "user not found",
        success: false,
      });
    }
    if (user.role === userRole.ADMIN) {
      return sendResponse(res, 400, {
        message: "admin type user can not book for him or any admin.",
        success: false,
      });
    }
    if (reqUser.role !== userRole.ADMIN && user.email !== reqUser.email) {
      return sendResponse(res, 403, {
        message: "unauthorized",
        success: false,
      });
    }

    // Date validation
    if (!validDate(rent_start_date)) {
      return sendResponse(res, 400, {
        message: "invalid rent_start_date value",
        success: false,
      });
    }

    if (!validDate(rent_end_date)) {
      return sendResponse(res, 400, {
        message: "invalid rent_end_date value",
        success: false,
      });
    }

    const duration =
      (new Date(getFormattedDate(rent_end_date)).getTime() -
        new Date(getFormattedDate(rent_start_date)).getTime()) /
      86400000;
    if (duration <= 0) {
      return sendResponse(res, 400, {
        message:
          "rent_end_date value must be greater than rent_start_date value",
        success: false,
      });
    }

    //  Vehicle validate
    const vehicle = (await getById(Number(vehicle_id))) as IVehicle | null;
    if (!vehicle) {
      return sendResponse(res, 404, {
        message: "Vehicle not found",
        success: false,
      });
    }

    if (vehicle?.availability_status === "booked") {
      return sendResponse(res, 400, {
        message: "Vehicle already booked",
        success: false,
      });
    }

    const payload: IBookingCreatePayload = {
      customer_id,
      rent_end_date,
      rent_start_date,
      vehicle_id,
    };

    const result = (await create(
      payload,
      vehicle?.daily_rent_price as number
    )) as any | null;
    if (!result) {
      return sendResponse(res, 500, {
        message: "Something went wrong. booking is not created",
        success: false,
      });
    }
    //  Update vehicle status
    const updateResult = await updateVehicle(vehicle as IVehicle, {
      availability_status: "booked",
    });
    if (!updateResult) {
      return sendResponse(res, 500, {
        message: "Something went wrong. vehicle is not updated",
        success: false,
      });
    }

    const response: IBookingResponse = {
      customer_id: result.customer_id,
      id: result.id,
      rent_end_date: getFormattedDate(result.rent_end_date),
      rent_start_date: getFormattedDate(result.rent_start_date),
      status: result.status,
      total_price: Number(result.total_price),
      vehicle_id: result.vehicle_id,
      vehicle: {
        daily_rent_price: Number(result.daily_rent_price),
        vehicle_name: result.vehicle_name,
      },
    };

    sendResponse(res, 200, {
      success: true,
      message: "Booking Create successfully",
      data: response,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as JwtPayload;
    const customer = reqUser.role === userRole.CUSTOMER;

    const bookings = (
      customer ? await getBookingsByCustomerId(reqUser.id) : await getBookings()
    ).map((item) => {
      return {
        id: item.id,
        customer_id: item.customer_id,
        vehicle_id: item.vehicle_id,
        rent_start_date: item.rent_start_date,
        rent_end_date: item.rent_end_date,
        total_price: item.total_price,
        status: item.status,
        customer: {
          name: item.name,
          email: item.email,
        },
        vehicle: {
          registration_number: item?.registration_number,
          vehicle_name: item?.vehicle_name,
        },
      };
    });
    sendResponse(res, 200, {
      success: true,
      message:
        bookings.length > 0
          ? "bookings retrieved successfully"
          : "No bookings found",
      data: bookings,
    });
  } catch (error: any) {
    sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const updateById = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as JwtPayload;
    const { bookingId } = req.params || {};
    const booking = (await getBookingById(
      Number(bookingId)
    )) as IBookingResponse | null;

    if (!booking) {
      return sendResponse(res, 404, {
        success: false,
        message: "booking not found",
      });
    }
    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.RETURNED
    ) {
      return sendResponse(res, 400, {
        success: false,
        message: "Booking already cancelled or returned",
      });
    }

    const { status } = (req.body || {}) as {
      status?: string;
    };

    if (typeof status === "undefined") {
      return sendResponse(res, 400, {
        success: false,
        message: "status is required",
      });
    }

    if (
      !Object.values(BookingStatus).includes(
        status as "active" | "returned" | "cancelled"
      )
    ) {
      return sendResponse(res, 400, {
        success: false,
        message: `invalid status. allowed are ${Object.values(
          BookingStatus
        ).join(", ")}`,
      });
    }

    if (
      status === BookingStatus.ACTIVE &&
      booking.status === BookingStatus.ACTIVE
    ) {
      return sendResponse(res, 400, {
        success: false,
        message: `Already active`,
      });
    }

    if (status === BookingStatus.RETURNED && reqUser.role !== userRole.ADMIN) {
      return sendResponse(res, 403, {
        success: false,
        message: `returned status is not allowed for customer`,
      });
    }

    if (
      status === BookingStatus.CANCELLED &&
      reqUser.role !== userRole.CUSTOMER
    ) {
      return sendResponse(res, 403, {
        success: false,
        message: `canceled status is not allowed for admin`,
      });
    }
    if (reqUser.role !== userRole.ADMIN && reqUser.id !== booking.customer_id) {
      return sendResponse(res, 403, {
        success: false,
        message: `unauthorized`,
      });
    }
    if (
      status === BookingStatus.CANCELLED &&
      reqUser.role !== userRole.CUSTOMER
    ) {
      return sendResponse(res, 403, {
        success: false,
        message: `unauthorized`,
      });
    }
    const duration =
      (new Date(getFormattedDate(booking.rent_start_date)).getTime() -
        new Date(getFormattedDate(new Date().toISOString())).getTime()) /
      86400000;
    if (duration <= 0) {
      return sendResponse(res, 400, {
        message: "Sorry. You can not cancel this booking at this time.",
        success: false,
      });
    }

    const result = await update(
      booking.id,
      status as "active" | "cancelled" | "returned"
    );
    if (result) {
      const vehicle = await getById(result.vehicle_id);
      if (vehicle) {
        const vehicleUpdateResult = await updateVehicle(vehicle, {
          availability_status: "available",
        });
        if (vehicleUpdateResult) {
          const response: IBookingUpdateResponse = {
            id: result.id,
            customer_id: result.customer_id,
            vehicle_id: result.vehicle_id,
            rent_start_date: result.rent_start_date,
            rent_end_date: result.rent_end_date,
            total_price: result.total_price,
            status: result.status,
          };
          if (response.status === BookingStatus.RETURNED) {
            response.vehicle = {
              availability_status: vehicleUpdateResult.availability_status,
            };
          }
          return sendResponse(res, 200, {
            message:
              response.status === BookingStatus.RETURNED
                ? "Booking marked as returned. Vehicle is now available"
                : "Booking cancelled successfully",
            success: true,
            data: response
          });
        } else {
          return sendResponse(res, 500, {
            message: "Not updated. Something went wrong.",
            success: false,
          });
        }
      } else {
        return sendResponse(res, 500, {
          message: "Not updated. Something went wrong.",
          success: false,
        });
      }
    } else {
      return sendResponse(res, 500, {
        message: "Not updated. Something went wrong.",
        success: false,
      });
    }
  } catch (error: any) {
    return sendResponse(res, 500, {
      message: error.message || "Internal server error",
      success: false,
      errors: error,
    });
  }
};

const bookingController = {
  createBooking,
  get,
  updateById,
};
export default bookingController;
