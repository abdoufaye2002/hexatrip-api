const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const register = async (req, res) => {
	try {
		const { username, email, password, role } = req.body;
		// missing fields :
		if (!username || !email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
		}
		// check if user is already registered :
		const foundUser = await User.findOne({ email });
		if (foundUser) {
			return res.status(StatusCodes.BAD_REQUEST).send("Registration failed : You are already registered");
		}
		// hash password :
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		// create user :
		const user = {
			username,
			email,
			password: hashedPassword,
			role,
		};
		await User.create(user);
		return res.status(StatusCodes.CREATED).send("User registered");
	} catch (error) {
		console.log(`Error in user registration : ${error}`);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred during registration");
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// missing fields :
		if (!email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
		}
		// check if user is already registered :
		const foundUser = await User.findOne({ email });
		if (!foundUser) {
			return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");
		}
		// check password:
		const isMatch = await bcrypt.compare(password, foundUser.password);
		if (!isMatch) {
			return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");
		}
		// everything is fine, so we send data as a token to the user :
		const jwtSecretKey = process.env.JWT_SECRET_KEY;
		const token = jwt.sign(
			{
				id: foundUser._id,
				username: foundUser.username,
				email: foundUser.email,
			},
			jwtSecretKey,
			{ expiresIn: "1h" }
		);
		// strip the foundUSer from the password :
		const { password: _, __v, ...userWithoutSensitiveData } = foundUser._doc;
		return res.status(StatusCodes.OK).send({ user: userWithoutSensitiveData, token });
	} catch (error) {
		console.log(`Error in user login : ${error}`);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred during login");
	}
};

module.exports = { register, login };
