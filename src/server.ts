import app from "./app";
import config from "./config";
import authRoutes from "./modules/auth/authRoutes";

app.use("/api/v1/auth/", authRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
