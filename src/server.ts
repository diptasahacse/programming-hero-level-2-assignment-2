import { Request, Response } from "express";
import app from "./app";
import config from "./config";
import authRoutes from "./modules/auth/authRoutes";
import userRoutes from "./modules/users/userRoutes";
import vehicleRoutes from "./modules/vehicles/vehicleRoutes";
import bookingRoutes from "./modules/bookings/bookingRoutes";

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to Car Rental Service");
});
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/vehicles/", vehicleRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/bookings/", bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found.."
  })
});

app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
