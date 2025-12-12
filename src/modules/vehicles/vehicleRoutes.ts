import { Router } from "express";
import vehicleController from "./vehicleControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { create,get, getVehicleById,updateVehicleById } = vehicleController;
router.post("/", auth("admin"), create);
router.get("/", get);
router.get("/:vehicleId", getVehicleById);
router.put("/:vehicleId", updateVehicleById);

const vehicleRoutes = router;

export default vehicleRoutes;
