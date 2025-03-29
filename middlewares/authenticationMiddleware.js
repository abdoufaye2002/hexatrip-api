const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const authenticateMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.header("authorization");
		// is there a token attached :
		if (!authHeader) {
			return res.status(StatusCodes.BAD_REQUEST).send("Authentication failed");
		}
		// is token valid :
		const jwtSecretKey = process.env.JWT_SECRET_KEY;
		const token = authHeader.split(" ")[1];
		const userByToken = jwt.verify(token, jwtSecretKey);
		const userInDB = await User.findById(userByToken.id).select("-password -__v -updatedAt");
		// attach user to req :
		req.user = userInDB;
		next();
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.BAD_REQUEST).send("Authentication failed");
	}
};

module.exports = { authenticateMiddleware };
