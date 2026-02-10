import messageModel from "../models/messageModel.js";

async function getMessages(req, res, next) {
	try {
		const messages = await messageModel.getAllMessages();
		res.render("messages", { messages, user: req.user });
	} catch (err) {
		next(err);
	}
}

async function postMessage(req, res, next) {
	try {
		await messageModel.createMessage({
			message: req.body.message,
			user_id: req.user.id,
		});
		res.redirect("/messages");
	} catch (err) {
		next(err);
	}
}

async function deleteMessage(req, res, next) {
	try {
		const messageId = req.params.id;
		await messageModel.deleteMessage(messageId);
		res.redirect("/messages");
	} catch (err) {
		next(err);
	}
}

export default {
	getMessages,
	postMessage,
	deleteMessage,
};
