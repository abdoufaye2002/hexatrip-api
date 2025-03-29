const mongoose = require("mongoose");

const mongoUriAtlas = ``;
const mongoUriLocalhost = `mongodb://localhost:27017/hexa-trip`;

let mongoUri = ``;

const connectToDatabase = async () => {
	if (process.env.NODE_ENV === "production") {
		mongoUri = mongoUriAtlas;
	} else {
		mongoUri = mongoUriLocalhost;
	}

	try {
		await mongoose.connect(mongoUri, {
			dbName: "hexa-trip",
			useNewUrlParser: true,
			useUnifiedTopology: true,
			tls: process.env.NODE_ENV === "production",
		});
		console.log("Connection with db successful");
	} catch (error) {
		console.log("Error during db connection", error);
	}
};

module.exports = connectToDatabase;
