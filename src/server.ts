import app from "./app";
import config from "./config";
import authRoutes from "./modules/auth/authRoutes";
import userRoutes from "./modules/users/userRoutes";
import vehicleRoutes from "./modules/vehicles/vehicleRoutes";

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/vehicles/", vehicleRoutes);
app.use("/api/v1/users/", userRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
