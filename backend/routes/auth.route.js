import express from "express";
import authController from "../controllers/auth.controller.js";
import middlewareController from "../controllers/middleware.controller.js";

const router = express.Router();

//REGISTER
router.post("/register", authController.registerUser);
//LOGIN
router.post("/login", authController.loginUser);
//refresh
router.post("/refresh", authController.requestRefreshToken);
//loout
router.post("/logout",middlewareController.verifyToken,authController.userLogout);
export default router;
