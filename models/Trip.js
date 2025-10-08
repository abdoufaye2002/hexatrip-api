const mongoose = require("mongoose");
const { Schema } = mongoose;

const tripSchema = new Schema(
	{
		title: { type: String, required: true },
		summary: { type: String },
		region: { type: Number },
		town: { type: String },
		desc: { type: String },
		category: { type: String },
		images: { type: [String] },
		duration: { type: Number },
		adultPrice: { type: Number },
		youngPrice: { type: Number },
		tags: { type: [String] },
	},
	{ timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
//skskkdkdkdkdkdkdddkd