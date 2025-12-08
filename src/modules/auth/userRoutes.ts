import { Router } from "express";
import authController from "./authControllers";

const router = Router();

const { register } = authController;
router.post("/signup", register);

const authRoutes = router;

export default authRoutes;
