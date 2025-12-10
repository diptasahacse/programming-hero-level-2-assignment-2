import { Router } from "express";
import userControllers from "./userControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { getAllUsers, userById } = userControllers;
router.get("/", auth("admin"), getAllUsers);
router.get("/:id", auth("admin", "customer"), userById);

const userRoutes = router;
export default userRoutes;
