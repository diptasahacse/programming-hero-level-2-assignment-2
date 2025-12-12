import {
  IVehicle,
  IVehiclePayload,
  IVehicleUpdateBody,
} from "./vehicleInterface";
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
const getVehicles = async () => {
  try {
    const results = await db.pool.query(`SELECT * FROM vehicles`);
    return results.rows;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};
const getById = async (id: number) => {
  try {
    const result = await db.pool.query(
      `
            SELECT * FROM vehicles WHERE id=$1
            `,
      [id]
    );
    return result.rows[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const update = async (item: IVehicle, data: IVehicleUpdateBody) => {
  const {
    availability_status,
    daily_rent_price,
    registration_number,
    type,
    vehicle_name,
  } = data;
  const availabilityStatus =
    typeof availability_status === "undefined"
      ? item.availability_status
      : availability_status;

  const price =
    typeof daily_rent_price === "undefined"
      ? item.daily_rent_price
      : daily_rent_price;

  const registrationNumber =
    typeof registration_number === "undefined"
      ? item.registration_number
      : registration_number;

  const vehicleType = typeof type === "undefined" ? item.type : type;

  const name =
    typeof vehicle_name === "undefined" ? item.vehicle_name : vehicle_name;

  try {
    const result = await db.pool.query(
      `
      UPDATE vehicles
      SET availability_status = $1,
          daily_rent_price = $2,
          registration_number = $3,
          type = $4,
          vehicle_name = $5,
          updated_at = NOW()
      WHERE id = $6 RETURNING *
      `,
      [
        availabilityStatus,
        price,
        registrationNumber,
        vehicleType,
        name,
        item.id,
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
  getVehicles,
  getById,
  update,
};
export default vehicleService;
