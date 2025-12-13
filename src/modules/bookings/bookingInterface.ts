export const BookingStatus = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
  RETURNED: "returned",
} as const;
export interface IBookingGet {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: (typeof BookingStatus)[keyof typeof BookingStatus];
  customer: {
    name: string;
    email: string;
  };
  vehicle: {
    vehicle_name: string;
    registration_number: string;
  };
}

export interface IBookingCreatePayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export interface IBookingResponse {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: (typeof BookingStatus)[keyof typeof BookingStatus];
  vehicle: {
    vehicle_name: string;
    daily_rent_price: number;
  };
}
