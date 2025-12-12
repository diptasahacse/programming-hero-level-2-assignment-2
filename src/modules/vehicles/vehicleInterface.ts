export const VehicleType = {
  CAR: "car",
  BIKE: "bike",
  VAN: "van",
  SUV: "SUV",
} as const;
export const VehicleStatus = {
  AVAILABLE: "available",
  BOOKED: "booked",
} as const;
export interface IVehicle {
  id: number;
  vehicle_name: string;
  type: (typeof VehicleType)[keyof typeof VehicleType];
  registration_number: string;
  daily_rent_price: number;
  availability_status: (typeof VehicleStatus)[keyof typeof VehicleStatus];
  created_at: string;
  update_at: string;
}

export interface IVehiclePayload {
  vehicle_name: string;
  type: (typeof VehicleType)[keyof typeof VehicleType];
  registration_number: string;
  daily_rent_price: number;
  availability_status: (typeof VehicleStatus)[keyof typeof VehicleStatus];
}

export interface IVehicleResponse {
  id: number;
  vehicle_name: string;
  type: (typeof VehicleType)[keyof typeof VehicleType];
  registration_number: string;
  daily_rent_price: number;
  availability_status: (typeof VehicleStatus)[keyof typeof VehicleStatus];
}

export interface IVehicleUpdateBody {
  vehicle_name?: string;
  type?: (typeof VehicleType)[keyof typeof VehicleType];
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: (typeof VehicleStatus)[keyof typeof VehicleStatus];
}
