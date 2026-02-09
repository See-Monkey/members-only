import { Router } from "express";
import passport from "passport";
import { isAuth } from "../middleware/auth.js";

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

router.post("/register", userController.register);

router.get("/messages", isAuth, messageController.getMessages);
router.post("/messages", isAuth, messageController.postMessage);

router.get("/upgrade", isAuth, userController.getUpgrade);
router.post("/upgrade", isAuth, userController.postUpgrade);

export default router;
