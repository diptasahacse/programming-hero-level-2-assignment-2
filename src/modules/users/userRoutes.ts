import { Router } from "express";
import userControllers from "./userControllers";
import { auth } from "../../middlewares/auth";

const router = Router();

const { getAllUsers, userById, updateUserById, deleteUserById } = userControllers;
router.get("/", auth("admin"), getAllUsers);
router.get("/:userId", auth("admin", "customer"), userById);
router.put("/:userId", auth("admin", "customer"), updateUserById);
router.delete("/:userId", auth("admin"), deleteUserById);

const userRoutes = router;
export default userRoutes;
