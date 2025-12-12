export const BookingStatus = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
  RETURNED: "returned",
} as const;

export interface IBookingCreatePayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}
