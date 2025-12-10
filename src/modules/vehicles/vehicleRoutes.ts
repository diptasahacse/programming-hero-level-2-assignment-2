import { Router } from "express";
import vehicleController from "./vehicleControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { create } = vehicleController;
router.post("/", auth("admin"), create);

const vehicleRoutes = router;

export default vehicleRoutes;
