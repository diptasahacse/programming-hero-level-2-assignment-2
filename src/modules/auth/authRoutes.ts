import { Router } from "express";
import authController from "./authControllers";

const router = Router();

const { register, signin } = authController;
router.post("/signup", register);
router.post("/signin", signin);

const authRoutes = router;

export default authRoutes;
