import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Only admin role can manage users
router.use(protect);
router.use(authorize("admin"));

router.route("/")
    .get(userController.getAllUsers);

router.route("/:id")
    .delete(userController.deleteUser);

router.route("/:id/role")
    .put(userController.updateUserRole);

export default router;
