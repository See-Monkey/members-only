import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

async function getIndex(req, res) {}

async function register(req, res, next) {
	try {
		const { username, password, firstName, lastName, role, avatarURL } =
			req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		await userModel.createUser({
			username,
			password: hashedPassword,
			firstname: firstName,
			lastname: lastName,
			role_id: 1,
			avatar_url: avatarURL,
		});

		req.login({ id: user.id }, (err) => {
			if (err) return next(err);
			return res.redirect("/messages");
		});
	} catch (err) {
		next(err);
	}
}

async function getUpgrade(req, res) {}

async function postUpgrade(req, res) {}

export default {
	getIndex,
	register,
	getUpgrade,
	postUpgrade,
};
