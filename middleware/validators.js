import { body, validationResult } from "express-validator";

export const validateUser = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Email address is required")
		.isEmail()
		.withMessage("Must be a valid email address"),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 4 })
		.withMessage("Password must be at least 4 characters"),
	body("verifyPassword") // custom validation
		.notEmpty()
		.withMessage("Please verify your password")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords do not match");
			}
			return true; // validation passed
		}),
	body("firstName").trim().notEmpty().withMessage("First name is required"),
	body("lastName").trim().notEmpty().withMessage("Last name is required"),
	body("avatarURL").optional({ values: "falsy" }).trim(),
];

export const validateMessage = [
	body("message")
		.trim()
		.notEmpty()
		.withMessage("Message cannot be empty")
		.isLength({ max: 255 })
		.withMessage("Message cannot exceed 255 characters"),
];

export const validateUpgrade = [
	body("secret").trim().notEmpty().withMessage("Upgrade code is required"),
];

export const validateUserUpdate = [
	body("firstName").trim().notEmpty().withMessage("First name is required"),

	body("lastName").trim().notEmpty().withMessage("Last name is required"),

	body("avatarURL")
		.optional({ values: "falsy" })
		.trim()
		.isURL()
		.withMessage("Avatar must be a valid URL"),
];

export function handleValidationErrors(view) {
	return (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render(view, {
				errors: errors.array(),
				userInput: req.body,
			});
		}
		next();
	};
}
