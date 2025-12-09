import { Router } from "express";
import vehicleController from "./vehicleControllers";

const router = Router();

const { create } = vehicleController;
router.post("/", create);

const vehicleRoutes = router;

export default vehicleRoutes;
