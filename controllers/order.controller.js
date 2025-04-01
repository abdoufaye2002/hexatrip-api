const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");

// endpoints pour front :
// check with authenticate later
const getAll = async (req, res) => {
	try {
		const { email } = req.user;
		const orders = await Order.find({ email }).populate("trip");
		return res.status(StatusCodes.OK).send(orders);
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching orders");
	}
};

module.exports = { getAll };
