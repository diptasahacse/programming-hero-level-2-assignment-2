import { Router } from "express";
import bookingController from "./bookingControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { createBooking, get } = bookingController;
router.post("/", auth("admin", "customer"), createBooking);

router.get("/", auth("admin", "customer"), get);

const bookingRoutes = router;

export default bookingRoutes;
