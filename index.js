const express = require("express");
const morgan = require("morgan");
const connectToDatabase = require("./database");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");


// routes :
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const { StatusCodes } = require("http-status-codes");

// instance :
const app = express();

// config :
const port = 3000;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
dotenv.config();

// connection to db :
connectToDatabase();

// config multer :
app.locals.uploader = multer({
	storage: multer.memoryStorage({}),
	limits: { fileSize: 10 * 1024 * 1024 }, // Max size : 10 Mb
	fileFilter: (req, file, cb) => {
		// Accept only images :
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only images are accepted"));
		}
	},
});

// endpoints :
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);

// catch all :
app.use((req, res) => {
	return res.status(404).send("Page not found");
});

// heartbeat :
app.listen(port, () => {
	console.log(`Hexatrip server running on port ${port}`);
});
