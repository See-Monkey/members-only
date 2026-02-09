import messageModel from "../models/messageModel.js";

async function getMessages(req, res) {
	res.render("messages");
}

async function postMessage(req, res) {}

export default {
	getMessages,
	postMessage,
};
