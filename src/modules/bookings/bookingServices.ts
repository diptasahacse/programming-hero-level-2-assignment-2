import db from "../../db";
import { BookingStatus, IBookingCreatePayload } from "./bookingInterface";

const create = async (
  data: IBookingCreatePayload,
  dailyRentPrice: number
): Promise<any> => {
  const { customer_id, rent_end_date, rent_start_date, vehicle_id } = data;
  const duration =
    (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()) /
    86400000;
  const cost = dailyRentPrice * duration;

  try {
    const result = await db.pool.query(
      `
      INSERT INTO bookings(customer_id, rent_end_date, rent_start_date, vehicle_id, total_price, status)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [
        customer_id,
        rent_end_date,
        rent_start_date,
        vehicle_id,
        cost,
        BookingStatus.ACTIVE,
      ]
    );

    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const bookingService = {
  create,
};
export default bookingService;
