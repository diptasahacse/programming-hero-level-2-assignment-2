import { Router } from "express";
import userControllers from "./userControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { getAllUsers, userById, updateUserById } = userControllers;
router.get("/", auth("admin"), getAllUsers);
router.get("/:userId", auth("admin", "customer"), userById);
router.put("/:userId", auth("admin", "customer"), updateUserById);

const userRoutes = router;
export default userRoutes;
