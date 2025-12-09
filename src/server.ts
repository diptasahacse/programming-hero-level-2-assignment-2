import app from "./app";
import config from "./config";
import authRoutes from "./modules/auth/authRoutes";
import vehicleRoutes from "./modules/vehicles/vehicleRoutes";

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/vehicles/", vehicleRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
