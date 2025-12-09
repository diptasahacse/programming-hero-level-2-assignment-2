import { IVehicle, IVehiclePayload } from "./vehicleInterface";
import db from "../../db";

const getByRegistrationNumber = async (registration_number: string) => {
  try {
    const result = await db.pool.query(
      `
            SELECT * FROM vehicles WHERE registration_number=$1
            `,
      [registration_number]
    );
    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const create = async (data: IVehiclePayload): Promise<IVehicle | null> => {
  const {
    vehicle_name,
    availability_status,
    daily_rent_price,
    registration_number,
    type,
  } = data;

  try {
    const result = await db.pool.query(
      `
      INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES($1, $2, $3, $4, $5) RETURNING *
      `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const vehicleService = {
  create,
  getByRegistrationNumber,
};
export default vehicleService;
