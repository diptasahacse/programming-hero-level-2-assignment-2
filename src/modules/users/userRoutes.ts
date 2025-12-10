import { Router } from "express";
import userControllers from "./userControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { getAllUsers } = userControllers;
router.get("/", auth("admin"), getAllUsers);

const userRoutes = router;
export default userRoutes;
