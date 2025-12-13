import db from "../../db";
import { BookingStatus, IBookingCreatePayload } from "./bookingInterface";
const getFormattedDate = (date: string) => {
  return new Date(date).toISOString().split("T")[0];
};
const create = async (
  data: IBookingCreatePayload,
  dailyRentPrice: number
): Promise<any> => {
  const { customer_id, rent_end_date, rent_start_date, vehicle_id } = data;
   const duration =
      (new Date(getFormattedDate(rent_end_date)).getTime() -
        new Date(getFormattedDate(rent_start_date)).getTime()) /
      86400000;
  const cost = dailyRentPrice * duration;
  try {
    const result = await db.pool.query(
      `
      WITH new_booking AS(
        INSERT INTO bookings(customer_id, rent_end_date, rent_start_date, vehicle_id, total_price, status)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING *
      )
      SELECT 
      nb.id AS id,
      nb.customer_id AS customer_id,
      nb.vehicle_id AS vehicle_id,
      nb.rent_start_date AS rent_start_date,
      nb.rent_end_date AS rent_end_date,
      nb.total_price AS total_price,
      nb.status AS status,
      v.vehicle_name AS vehicle_name,
      v.daily_rent_price AS daily_rent_price
      FROM new_booking nb
      JOIN users u ON nb.customer_id = u.id
      JOIN vehicles v ON nb.vehicle_id = v.id;
      `,
      [
        customer_id,
        getFormattedDate(rent_end_date),
        getFormattedDate(rent_start_date),
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
const getBookings = async () => {
  try {
    const results = await db.pool.query(`
      SELECT 
      b.id,
      b.customer_id, 
      b.vehicle_id, 
      b.rent_start_date, 
      b.rent_end_date, 
      b.total_price, 
      b.status,
      u.name,
      u.email,
      v.vehicle_name,
      v.registration_number
      FROM bookings AS b
      
      JOIN users AS u 
        ON b.customer_id = u.id
      JOIN vehicles AS v 
        ON b.vehicle_id = v.id;
      `);
    return results.rows;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const getBookingById = async (id: number) => {
  try {
    const results = await db.pool.query(
      `
      SELECT *
      FROM bookings
      WHERE id = $1
      `,
      [id]
    );
    return results.rows[0];
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const getBookingsByCustomerId = async (id: number) => {
  try {
    const results = await db.pool.query(
      `
      SELECT 
      b.id,
      b.customer_id, 
      b.vehicle_id, 
      b.rent_start_date, 
      b.rent_end_date, 
      b.total_price, 
      b.status,
      u.name,
      u.email,
      v.vehicle_name,
      v.registration_number
      FROM bookings AS b
      
      JOIN users AS u 
        ON b.customer_id = u.id
      JOIN vehicles AS v 
        ON b.vehicle_id = v.id
      WHERE b.customer_id = $1;
      `,
      [id]
    );
    return results.rows;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const update = async (
  id: number,
  status: (typeof BookingStatus)[keyof typeof BookingStatus]
): Promise<any> => {
  try {
    const result = await db.pool.query(
      `
      UPDATE bookings
        SET
          status = $1
        WHERE id = $2 RETURNING *
      `,
      [status, id]
    );

    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const bookingService = {
  create,
  getBookings,
  getBookingsByCustomerId,
  getBookingById,
  update,
  getFormattedDate
};
export default bookingService;
