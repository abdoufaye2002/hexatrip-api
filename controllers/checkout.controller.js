const { StatusCodes } = require("http-status-codes");
const { hotelTax } = require("../helpers/data");
const Trip = require("../models/Trip");
const Order = require("../models/Order");
const Stripe = require("stripe");

const createStripeSession = async (req, res) => {
	try {
		// Init stripe session :
		const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

		// Import everything sent by the client :
		const order = req.body.order;
		const items = req.body.items;
		const token = req.body.token;

		// Fetch trip sold in the transaction from the db (items is an array of one only item : items[0] which is the trip) :
		const foundTrip = await Trip.findById(items[0].id);

		// Do the transaction/payment via stripe :
		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: items.map((item) => {
				return {
					price_data: {
						currency: "eur",
						product_data: {
							name: foundTrip.title,
						},
						unit_amount: foundTrip.adultPrice * items[0].adults + foundTrip.youngPrice * items[0].kids + hotelTax,
					},
					quantity: item.quantity,
				};
			}),
			success_url:
				process.env.NODE_ENV === "production"
					? `${process.env.CLIENT_URL_PROD}/checkout-success`
					: `${process.env.CLIENT_URL_LOCAL}/checkout-success`,
			cancel_url:
				process.env.NODE_ENV === "production" ? `${process.env.CLIENT_URL_PROD}/checkout` : `${process.env.CLIENT_URL_LOCAL}/checkout`,
		});

		// Normally, the order should be placed into the DB after proof of stripe payment success
		// How to do it via webhook here : https://docs.stripe.com/checkout/fulfillment#create-event-handler

		// Write the purchase order in the db (in mode "not logged/visitor" and in mode logged user) :
		if (!token.token) {
			await Order.create({ ...order, email: "guest@guest.com" });
		} else {
			await Order.create(order);
		}

		// Exit :
		return res.status(StatusCodes.OK).json({ url: session.url });
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}
};

module.exports = { createStripeSession };
