const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Order = require("../models/Order");

// user routes :
const getProfile = async (req, res) => {
	const middlewareUser = req.user;
	return res.status(StatusCodes.OK).send(middlewareUser);
};

const updateProfile = async (req, res) => {
	const { id } = req.params;
	const data = req.body;
	try {
		const user = await User.findByIdAndUpdate(id, data, { new: true }).select("-password -__v");
		return res.status(StatusCodes.OK).send(user);
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.NOT_FOUND).send("No resource found");
	}
};

const deleteProfile = async (req, res) => {
	try {
		const middlewareUser = req.user;
		await User.findByIdAndDelete(middlewareUser._id);
		await Order.deleteMany({ email: middlewareUser.email });
		return res.status(StatusCodes.OK).send("User profile deleted");
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.NOT_FOUND).send("Deletion failed");
	}
};

module.exports = { getProfile, updateProfile, deleteProfile };
