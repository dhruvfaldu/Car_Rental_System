import { Router } from "express";
import { register, login, logout, getMe, updateMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;