import userModel from "../models/userModel.js";

const ROLES = {
	VIEWER: 1,
	MEMBER: 2,
	ADMIN: 3,
};

async function getIndex(req, res) {
	if (req.user) {
		return res.redirect("/messages");
	}

	res.render("index", { errors: [] });
}

async function getRegister(req, res) {
	res.render("register", { errors: [], userInput: {} });
}

async function register(req, res, next) {
	try {
		const { username, password, firstName, lastName, avatarURL } = req.body;

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
	res.render("upgrade", { errors: [], error: null });
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

		// no downgrades or redundant upgrades
		if (targetRole <= currentRole) {
			return res.status(400).render("upgrade", {
				error: "You already have this role or higher",
			});
		}

		await userModel.updateUserRole(req.user.id, targetRole);

		// update session user so they don’t need to log out/in
		req.user.role_id = targetRole;

		res.render("upgrade", { errors: [], error: null });
	} catch (err) {
		next(err);
	}
}

async function getAccount(req, res) {
	res.render("account", {
		user: req.user,
		errors: [],
	});
}

async function postUserUpdate(req, res, next) {
	try {
		const { firstName, lastName, avatarURL } = req.body;

		const updatedUser = await userModel.updateUser(req.user.id, {
			firstname: firstName,
			lastname: lastName,
			avatar_url: avatarURL ? avatarURL : req.user.avatar_url,
		});

		// Update session user immediately
		req.user.firstname = updatedUser.firstname;
		req.user.lastname = updatedUser.lastname;
		req.user.avatar_url = updatedUser.avatar_url;

		res.redirect("/messages");
	} catch (err) {
		next(err);
	}
}

export default {
	getIndex,
	getRegister,
	register,
	getUpgrade,
	postUpgrade,
	getAccount,
	postUserUpdate,
};
