import userModel from "../models/userModel.js";

const ROLES = {
	VIEWER: 1,
	MEMBER: 2,
	ADMIN: 3,
};

async function getIndex(req, res) {
	res.render("index");
}

async function register(req, res, next) {
	try {
		const { username, password, firstName, lastName, role, avatarURL } =
			req.body;

		const user = await userModel.createUser({
			username,
			password: password,
			firstname: firstName,
			lastname: lastName,
			role_id: 1,
			avatar_url: avatarURL,
		});

		req.login(user, (err) => {
			if (err) return next(err);
			res.redirect("/messages");
		});
	} catch (err) {
		next(err);
	}
}

async function getUpgrade(req, res) {
	res.render("upgrade");
}

async function postUpgrade(req, res, next) {
	try {
		const { secret } = req.body;
		const currentRole = req.user.role_id;

		let targetRole = null;

		if (secret === process.env.ADMIN_SECRET) {
			targetRole = ROLES.ADMIN;
		} else if (secret === process.env.MEMBER_SECRET) {
			targetRole = ROLES.MEMBER;
		} else {
			return res.status(400).render("upgrade", {
				error: "Invalid upgrade code",
			});
		}

		// No downgrades or redundant upgrades
		if (targetRole <= currentRole) {
			return res.status(400).render("upgrade", {
				error: "You already have this role or higher",
			});
		}

		await userModel.updateUserRole(req.user.id, targetRole);

		// Update session user so they don’t need to log out/in
		req.user.role_id = targetRole;

		res.redirect("/messages");
	} catch (err) {
		next(err);
	}
}

export default {
	getIndex,
	register,
	getUpgrade,
	postUpgrade,
};
