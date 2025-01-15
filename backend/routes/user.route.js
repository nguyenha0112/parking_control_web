import express from "express";
import userController from "../controllers/user.contronller.js";
import middlewareController from "../controllers/middleware.controller.js";

const router = express.Router();

// Get all users
router.get("/", middlewareController.verifyToken ,userController.getAllUsers);

// Delete user
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth,userController.deleteUser);

export default router;
