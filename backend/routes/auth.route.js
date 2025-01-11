import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// chuc nang dang ky
router.post("/signup", signup);
// chuc nang dang nhap 
router.post("/login", login);
// chuc nang dang xuatxuat
router.post("/logout", logout);

export default router;