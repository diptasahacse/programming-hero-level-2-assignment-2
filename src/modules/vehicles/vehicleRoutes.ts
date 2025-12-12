import { Router } from "express";
import vehicleController from "./vehicleControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { create, get, getVehicleById, updateVehicleById, deleteVehicleById } =
  vehicleController;
router.post("/", auth("admin"), create);
router.get("/", get);
router.get("/:vehicleId", getVehicleById);
router.put("/:vehicleId", auth("admin"), updateVehicleById);
router.delete("/:vehicleId", auth("admin"), deleteVehicleById);

const vehicleRoutes = router;

export default vehicleRoutes;
