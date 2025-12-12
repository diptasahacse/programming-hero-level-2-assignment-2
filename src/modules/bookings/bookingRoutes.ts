import { Router } from "express";
import bookingController from "./bookingControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { createBooking } = bookingController;
router.post("/", auth("admin", "customer"), createBooking);

const bookingRoutes = router;

export default bookingRoutes;
