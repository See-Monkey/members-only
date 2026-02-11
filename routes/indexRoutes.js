import { Router } from "express";
import passport from "passport";
import { isAuth, isAdmin } from "../middleware/auth.js";
import {
	validateUser,
	validateMessage,
	validateUpgrade,
	validateUserUpdate,
	handleValidationErrors,
} from "../middleware/validators.js";

import userController from "../controllers/userController.js";
import messageController from "../controllers/messageController.js";

const router = Router();

router.get("/", userController.getIndex);

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/messages",
		failureRedirect: "/",
	}),
);

router.post("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect("/");
	});
});

router.get("/register", userController.getRegister);

router.post(
	"/register",
	validateUser,
	handleValidationErrors("register"),
	userController.register,
);

router.get("/messages", isAuth, messageController.getMessages);
router.post(
	"/messages",
	isAuth,
	validateMessage,
	handleValidationErrors("messages"),
	messageController.postMessage,
);

router.get("/upgrade", isAuth, userController.getUpgrade);
router.post(
	"/upgrade",
	isAuth,
	validateUpgrade,
	handleValidationErrors("upgrade"),
	userController.postUpgrade,
);

router.get("/account", isAuth, userController.getAccount);
router.post(
	"/account",
	isAuth,
	validateUserUpdate,
	handleValidationErrors("account"),
	userController.postUserUpdate,
);

router.post("/messages/:id/delete", isAdmin, messageController.deleteMessage);

export default router;
